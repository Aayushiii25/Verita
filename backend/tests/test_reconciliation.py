import pandas as pd
import sys
import os
from pathlib import Path

# Add the parent directory of backend to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from backend.app.reconciliation import reconcile_data

def test_reconciliation():
    data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data")
    
    # Run the engine
    results = reconcile_data(data_dir)
    
    # Flatten our output to compare with truth
    flat_results = []
    for bucket, items in results.items():
        for item in items:
            # item is a dict with: bank_id, settlement_id, invoice_ids, journal_id, reason
            # The truth file has a separate row for each invoice.
            # So if an item has multiple invoices, we expand it.
            inv_list = item.get("invoice_ids", [])
            if not inv_list:
                flat_results.append({
                    "bank_transaction_id": item.get("bank_id", ""),
                    "invoice_number": "",
                    "settlement_id": item.get("settlement_id", ""),
                    "journal_id": item.get("journal_id", ""),
                    "expected_status": bucket
                })
            else:
                for inv in inv_list:
                    flat_results.append({
                        "bank_transaction_id": item.get("bank_id", ""),
                        "invoice_number": inv,
                        "settlement_id": item.get("settlement_id", ""),
                        "journal_id": item.get("journal_id", ""),
                        "expected_status": bucket
                    })
                    
    df_pred = pd.DataFrame(flat_results)
    df_pred = df_pred.fillna("")
    
    truth_df = pd.read_csv(os.path.join(data_dir, "reconciliation_truth.csv"), dtype=str).fillna("")
    
    # Merge and compare
    # ... we will just print for now to debug ...
    print(f"Total matched: {len(results['MATCHED'])}")
    print(f"Total review: {len(results['REVIEW'])}")
    print(f"Total exceptions: {len(results['EXCEPTIONS'])}")

if __name__ == "__main__":
    test_reconciliation()
