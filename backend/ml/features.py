from datetime import datetime
from difflib import SequenceMatcher


def string_similarity(a, b):
    if not a or not b:
        return 0.0

    return SequenceMatcher(
        None,
        str(a).lower(),
        str(b).lower()
    ).ratio()


def amount_similarity(a, b):
    try:
        a_val = float(a)
        b_val = float(b)
    except (ValueError, TypeError):
        return 0.0

    if a_val == 0 or b_val == 0:
        if a_val == b_val:
            return 1.0
        return 0.0

    difference = abs(a_val - b_val)

    return max(
        0.0,
        1.0 - difference / max(abs(a_val), abs(b_val))
    )


def date_similarity(date1, date2):
    try:
        d1 = datetime.fromisoformat(str(date1))
        d2 = datetime.fromisoformat(str(date2))
    except (ValueError, TypeError):
        return 0.0

    days = abs((d1 - d2).days)

    # Same day = 1
    # 30+ days apart = 0
    return max(0.0, 1 - days / 30)


def build_features(bank_txn, settlement):
    return [
        amount_similarity(
            bank_txn.get("credit", 0), # Bank credit amount
            settlement.get("payout_amount", 0) # Settlement payout amount
        ),
        date_similarity(
            bank_txn.get("transaction_date", ""),
            settlement.get("settlement_date", "")
        ),
        string_similarity(
            bank_txn.get("reference_number", ""),
            settlement.get("bank_reference", "")
        ),
        string_similarity(
            bank_txn.get("counterparty_name", ""),
            settlement.get("marketplace", "")
        ),
        1.0 # currency match (defaulting to 1 for this demo since all are INR)
    ]
