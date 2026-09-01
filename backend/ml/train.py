import pandas as pd
import os
import random
from ml.model import RecordLinkingModel
from ml.features import build_features

def load_data():
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    truth_df = pd.read_csv(os.path.join(data_dir, "reconciliation_truth.csv"))
    bank_df = pd.read_csv(os.path.join(data_dir, "bank_transactions.csv"))
    stl_df = pd.read_csv(os.path.join(data_dir, "settlements.csv"))
    return truth_df, bank_df, stl_df

def train_model():
    truth_df, bank_df, stl_df = load_data()
    
    # Pre-process into dicts for easy lookup
    bank_dict = bank_df.set_index("transaction_id").to_dict(orient="index")
    for k in bank_dict:
        bank_dict[k]["transaction_id"] = k
        
    stl_dict = stl_df.set_index("settlement_id").to_dict(orient="index")
    for k in stl_dict:
        stl_dict[k]["settlement_id"] = k

    X = []
    y = []

    # 1. Generate Positive Examples from MATCHED truth cases
    matched_cases = truth_df[truth_df["expected_status"] == "MATCHED"]
    
    for _, row in matched_cases.iterrows():
        b_id = row["bank_transaction_id"]
        s_id = row["settlement_id"]
        
        if pd.isna(b_id) or pd.isna(s_id):
            continue
            
        bank_txn = bank_dict.get(b_id)
        stl_txn = stl_dict.get(s_id)
        
        if bank_txn and stl_txn:
            features = build_features(bank_txn, stl_txn)
            X.append(features)
            y.append(1)  # Match

    # 2. Generate Negative Examples (random mismatches)
    bank_keys = list(bank_dict.keys())
    stl_keys = list(stl_dict.keys())
    
    # We want roughly same number of negative examples
    num_negatives = len(X) * 2 
    
    negative_count = 0
    while negative_count < num_negatives:
        b_id = random.choice(bank_keys)
        s_id = random.choice(stl_keys)
        
        # Check if they are actually a match in truth_df
        is_match = not truth_df[
            (truth_df["bank_transaction_id"] == b_id) & 
            (truth_df["settlement_id"] == s_id) & 
            (truth_df["expected_status"] == "MATCHED")
        ].empty
        
        if not is_match:
            features = build_features(bank_dict[b_id], stl_dict[s_id])
            X.append(features)
            y.append(0)  # No match
            negative_count += 1

    print(f"Training on {len(X)} pairs ({y.count(1)} positive, {y.count(0)} negative)...")

    model = RecordLinkingModel()
    model.train(X, y)
    
    model_path = os.path.join(os.path.dirname(__file__), "record_linking_model.pkl")
    model.save(model_path)
    print(f"Model saved to {model_path}")

    return model

if __name__ == "__main__":
    train_model()
