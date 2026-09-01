import os
from ml.features import build_features
from ml.model import RecordLinkingModel
from reconciliation.candidates import generate_candidates

class ReconciliationEngine:
    def __init__(self):
        self.model = RecordLinkingModel()
        model_path = os.path.join(os.path.dirname(__file__), "..", "ml", "record_linking_model.pkl")
        try:
            self.model.load(model_path)
            self.is_loaded = True
        except FileNotFoundError:
            self.is_loaded = False

    def reconcile(self, bank_transactions, settlements, invoices, ledgers):
        if not self.is_loaded:
            raise RuntimeError("ML model not loaded. Run train.py first.")

        # 1. Map Invoices to Ledger (Deterministic)
        inv_to_led = {}
        for row in ledgers:
            jid = row.get("journal_id", "")
            refs = str(row.get("related_reference", "")).split(";")
            for ref in refs:
                ref = ref.strip()
                if not ref:
                    continue
                matching_invs = [inv for inv in invoices if inv.get("invoice_number") == ref or inv.get("order_reference") == ref]
                for inv in matching_invs:
                    inv_no = inv.get("invoice_number")
                    if inv_no not in inv_to_led:
                        inv_to_led[inv_no] = []
                    inv_to_led[inv_no].append(jid)
        
        # 2. Map Settlements to Invoices (Deterministic - simple logic matching gross amount for demo)
        used_inv = set()
        stl_to_inv = {}
        for stl in settlements:
            s_id = stl.get("settlement_id", "")
            try:
                s_gross = float(stl.get("gross_sales", 0))
            except (ValueError, TypeError):
                continue
                
            matched_invs = []
            for inv in invoices:
                i_id = inv.get("invoice_number")
                if i_id in used_inv:
                    continue
                try:
                    i_gross = float(inv.get("gross_amount", 0))
                    i_net = float(inv.get("net_amount", 0))
                except (ValueError, TypeError):
                    continue
                
                # Simplified greedy matcher for single invoices
                if abs(i_gross - s_gross) < 1.0 or abs(i_net - s_gross) < 1.0:
                    matched_invs.append(i_id)
                    used_inv.add(i_id)
                    break # just map 1 to 1 for this demo logic
            
            stl_to_inv[s_id] = matched_invs

        # 3. Generate ML Candidates (Bank <-> Settlement)
        candidates = generate_candidates(bank_transactions, settlements)
        
        results = []
        used_bank = set()
        used_stl = set()

        # Score all candidates
        scored_candidates = []
        for b, s in candidates:
            features = build_features(b, s)
            probability = self.model.predict_probability(features)
            scored_candidates.append((probability, b, s, features))
            
        # Sort by probability descending
        scored_candidates.sort(key=lambda x: x[0], reverse=True)
        
        for probability, b, s, features in scored_candidates:
            b_id = b.get("transaction_id")
            s_id = s.get("settlement_id")
            
            if b_id in used_bank or s_id in used_stl:
                continue
                
            if probability >= 0.90:
                status = "matched"
                used_bank.add(b_id)
                used_stl.add(s_id)
            elif probability >= 0.70:
                status = "review"
            else:
                status = "exception"

            # Reconstruct the full chain
            inv_ids = stl_to_inv.get(s_id, [])
            led_ids = list(set([j for i in inv_ids for j in inv_to_led.get(i, [])]))
            
            results.append({
                "bank_id": b_id,
                "settlement_id": s_id,
                "invoice_ids": inv_ids,
                "journal_ids": led_ids,
                "probability": round(probability, 3),
                "status": status,
                "features": features
            })

        # Find unmatched bank txns (exceptions)
        for b in bank_transactions:
            b_id = b.get("transaction_id")
            if b_id not in used_bank:
                try:
                    if float(b.get("credit", 0)) > 0:
                        results.append({
                            "bank_id": b_id,
                            "settlement_id": None,
                            "invoice_ids": [],
                            "journal_ids": [],
                            "probability": 0.0,
                            "status": "exception",
                            "features": []
                        })
                except (ValueError, TypeError):
                    pass

        return results
