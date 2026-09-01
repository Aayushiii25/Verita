from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from reconciliation.engine import ReconciliationEngine
from graph.financial_graph import FinancialGraph
import os
import pandas as pd

app = FastAPI(title="AI Finance Controller")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

engine = ReconciliationEngine()

def load_data_from_csv():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    bank_df = pd.read_csv(os.path.join(data_dir, "bank_transactions.csv"))
    stl_df = pd.read_csv(os.path.join(data_dir, "settlements.csv"))
    inv_df = pd.read_csv(os.path.join(data_dir, "invoices.csv"))
    led_df = pd.read_csv(os.path.join(data_dir, "ledger_entries.csv"))
    
    return (
        bank_df.to_dict(orient="records"),
        stl_df.to_dict(orient="records"),
        inv_df.to_dict(orient="records"),
        led_df.to_dict(orient="records")
    )

@app.get("/")
def health():
    return {
        "status": "running",
        "service": "AI Finance Controller"
    }

@app.post("/api/reconcile")
def reconcile():
    bank, stl, inv, led = load_data_from_csv()
    matches = engine.reconcile(bank, stl, inv, led)
    
    return {
        "MATCHED": [x for x in matches if x["status"] == "matched"],
        "REVIEW": [x for x in matches if x["status"] == "review"],
        "EXCEPTIONS": [x for x in matches if x["status"] == "exception"],
        "total_candidates": len(matches),
        "counts": {
            "MATCHED": len([x for x in matches if x["status"] == "matched"]),
            "REVIEW": len([x for x in matches if x["status"] == "review"]),
            "EXCEPTIONS": len([x for x in matches if x["status"] == "exception"])
        }
    }

@app.post("/api/graph")
def graph():
    bank, stl, inv, led = load_data_from_csv()
    matches = engine.reconcile(bank, stl, inv, led)
    
    g = FinancialGraph()
    
    # 1. Add Nodes
    for i in inv:
        g.add_record(i["invoice_number"], "invoice", amount=i.get("gross_amount"), customer=i.get("customer_name"), date=i.get("invoice_date"))
        
    for s in stl:
        g.add_record(s["settlement_id"], "settlement", amount=s.get("gross_sales"), date=s.get("settlement_date"))
        
    for b in bank:
        g.add_record(b["transaction_id"], "bank", amount=b.get("credit"), date=b.get("transaction_date"))
        
    for l in led:
        g.add_record(l["journal_id"], "ledger", amount=l.get("credit") or l.get("debit"), date=l.get("posting_date"))

    # 2. Add Edges based on reconciliation results
    for m in matches:
        b_id = m.get("bank_id")
        s_id = m.get("settlement_id")
        inv_ids = m.get("invoice_ids", [])
        j_ids = m.get("journal_ids", [])
        
        confidence = m.get("probability", 0.0)
        
        # Link Invoices -> Settlement
        if s_id:
            for i_id in inv_ids:
                g.add_relationship(i_id, s_id, "settled_in", confidence=1.0)
                
            # Link Settlement -> Bank
            if b_id:
                g.add_relationship(s_id, b_id, "bank_deposit", confidence=confidence)
                
        # Link Invoices -> Ledger
        for j_id in j_ids:
            for i_id in inv_ids:
                g.add_relationship(i_id, j_id, "posted_to", confidence=1.0)
                
    return g.get_graph()
