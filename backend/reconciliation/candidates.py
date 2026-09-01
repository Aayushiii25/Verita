def generate_candidates(bank_transactions, settlements):
    candidates = []

    for b in bank_transactions:
        b_amount = b.get("credit")
        if not b_amount:
            continue
        try:
            b_amount = float(b_amount)
        except (ValueError, TypeError):
            continue

        for s in settlements:
            s_amount = s.get("payout_amount")
            if not s_amount:
                continue
            try:
                s_amount = float(s_amount)
            except (ValueError, TypeError):
                continue
                
            amount_diff = abs(b_amount - s_amount)
            
            # Simple heuristic: if difference is more than 10%, not a candidate
            if amount_diff > max(abs(b_amount), abs(s_amount)) * 0.1:
                continue
                
            candidates.append((b, s))

    return candidates
