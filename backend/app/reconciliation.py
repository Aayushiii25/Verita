import pandas as pd
from pathlib import Path
from typing import Dict, List, Any
import itertools
from collections import defaultdict

def to_float(val):
    try:
        return float(str(val).replace(',', ''))
    except (ValueError, TypeError):
        return 0.0

def reconcile_data(data_dir: str):
    data_path = Path(data_dir)
    
    bank_df = pd.read_csv(data_path / "bank_transactions.csv", dtype=str).fillna("")
    inv_df = pd.read_csv(data_path / "invoices.csv", dtype=str).fillna("")
    stl_df = pd.read_csv(data_path / "settlements.csv", dtype=str).fillna("")
    led_df = pd.read_csv(data_path / "ledger_entries.csv", dtype=str).fillna("")
    
    for df in [bank_df, inv_df, stl_df, led_df]:
        for col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            
    # Track used IDs
    used_bank = set()
    used_inv = set()
    used_stl = set()
    used_led = set()
    
    matched = []
    review = []
    exceptions = []
    
    # 1. Map Ledger to Invoices
    # invoice_number -> list of journal_ids
    inv_to_led = defaultdict(list)
    for _, row in led_df.iterrows():
        jid = row['journal_id']
        refs = [r.strip() for r in str(row['related_reference']).split(';') if r.strip()]
        for ref in refs:
            # find invoice by invoice_number or order_reference
            invs = inv_df[(inv_df['invoice_number'] == ref) | (inv_df['order_reference'] == ref)]
            for inv_no in invs['invoice_number']:
                inv_to_led[inv_no].append(jid)
                
    # 2. Iterate Settlements
    for _, stl in stl_df.iterrows():
        s_id = stl['settlement_id']
        b_ref = stl['bank_reference']
        s_payout = to_float(stl['payout_amount'])
        s_gross = to_float(stl['gross_sales'])
        
        # a. Find Bank Matches
        b_matches = bank_df[bank_df['reference_number'] == b_ref]
        
        b_ids = b_matches['transaction_id'].tolist()
        
        # b. Find Invoice Matches
        # We need subsets of unused invoices that sum to s_gross (using gross_amount or net_amount)
        unused_invs = inv_df[~inv_df['invoice_number'].isin(used_inv)]
        
        valid_subsets = []
        # Try size 1 to 3
        for size in range(1, 4):
            for subset in itertools.combinations(unused_invs.to_dict('records'), size):
                sum_gross = sum(to_float(i['gross_amount']) for i in subset)
                sum_net = sum(to_float(i['net_amount']) for i in subset)
                
                if abs(sum_gross - s_gross) < 0.01 or abs(sum_net - s_gross) < 0.01:
                    valid_subsets.append(subset)
                    
        # Filter valid_subsets: they might overlap.
        # If we have exactly 1 valid subset, it's a MATCH.
        # If > 1, it's REVIEW.
        # If 0, EXCEPTION.
        
        status = "MATCHED"
        reason = ""
        inv_ids = []
        j_ids = set()
        
        if len(b_ids) > 1:
            status = "REVIEW"
            reason += "Multiple bank matches found. "
        elif len(b_ids) == 0:
            status = "EXCEPTION"
            reason += "No bank match found. "
            
        if len(valid_subsets) == 1:
            subset = valid_subsets[0]
            inv_ids = [i['invoice_number'] for i in subset]
            for i in inv_ids:
                j_ids.update(inv_to_led[i])
        elif len(valid_subsets) > 1:
            status = "REVIEW"
            reason += "Ambiguous invoice matches. "
            # Just pick the first for display, or include all candidates
            inv_ids = [i['invoice_number'] for i in valid_subsets[0]]
            for i in inv_ids:
                j_ids.update(inv_to_led[i])
        else:
            status = "EXCEPTION"
            reason += "No matching invoices found for settlement amount. "
            
        # Check Ledger Duplicates
        if status == "MATCHED":
            # If any invoice has multiple journal IDs, it's an exception (duplicate ledger)
            for i in inv_ids:
                if len(inv_to_led[i]) > 1:
                    status = "EXCEPTION"
                    reason += f"Duplicate ledger posting for invoice {i}. "
                    
        if status == "MATCHED":
            reason = "Clean match tying bank, settlement, invoice and ledger."
            
        case = {
            "bank_id": b_ids[0] if b_ids else "",
            "settlement_id": s_id,
            "invoice_ids": inv_ids,
            "journal_id": list(j_ids)[0] if j_ids else "",
            "reason": reason
        }
        
        if status == "MATCHED":
            matched.append(case)
            used_stl.add(s_id)
            for b in b_ids: used_bank.add(b)
            for i in inv_ids: used_inv.add(i)
            for j in j_ids: used_led.add(j)
        elif status == "REVIEW":
            review.append(case)
        else:
            exceptions.append(case)

    # 3. Leftovers
    # Bank exceptions
    for _, b in bank_df.iterrows():
        b_id = b['transaction_id']
        if b_id not in used_bank and to_float(b['credit']) > 0:
            exceptions.append({
                "bank_id": b_id,
                "settlement_id": "",
                "invoice_ids": [],
                "journal_id": "",
                "reason": "Unexplained bank credit with no corresponding settlement."
            })
            
    # Invoice exceptions
    for _, i in inv_df.iterrows():
        i_id = i['invoice_number']
        if i_id not in used_inv:
            review.append({
                "bank_id": "",
                "settlement_id": "",
                "invoice_ids": [i_id],
                "journal_id": inv_to_led[i_id][0] if inv_to_led[i_id] else "",
                "reason": "Invoice has no settlement or bank credit yet."
            })
            
    # Ledger exceptions (already handled partly by the duplicate check, but we can check unused ledgers)
    
    return {
        "MATCHED": matched,
        "REVIEW": review,
        "EXCEPTIONS": exceptions
    }
