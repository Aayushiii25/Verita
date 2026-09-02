from __future__ import annotations

from typing import Any

from ml.features import build_features

FEATURE_NAMES = [
    "amount_similarity",
    "date_similarity",
    "reference_similarity",
    "counterparty_similarity",
    "currency_match",
]


def _pct(value: float) -> float:
    return round(max(0.0, min(1.0, float(value))) * 100, 1)


def _model_probability(engine, features: list[float]) -> float:
    return float(engine.model.predict_probability(features))


def explain_match(engine, bank: dict[str, Any], settlement: dict[str, Any]) -> dict[str, Any]:
    features = build_features(bank, settlement)
    probability = _model_probability(engine, features)

    signals = [
        {
            "feature": name,
            "score": _pct(score),
            "strength": "strong" if score >= 0.85 else "partial" if score >= 0.60 else "weak",
        }
        for name, score in zip(FEATURE_NAMES, features)
    ]
    signals.sort(key=lambda item: item["score"], reverse=True)

    # Counterfactual test: repair one weak signal at a time and observe the
    # model delta. This gives the controller a grounded explanation without
    # asking an LLM to invent accounting facts.
    counterfactuals = []
    for index, name in enumerate(FEATURE_NAMES):
        if features[index] >= 0.99:
            continue
        repaired = list(features)
        repaired[index] = 1.0
        repaired_probability = _model_probability(engine, repaired)
        delta = repaired_probability - probability
        counterfactuals.append(
            {
                "feature": name,
                "current_score": _pct(features[index]),
                "repaired_probability": _pct(repaired_probability),
                "probability_delta": round(delta * 100, 1),
                "causal_signal": "high" if delta >= 0.15 else "medium" if delta >= 0.05 else "low",
            }
        )

    counterfactuals.sort(key=lambda item: item["probability_delta"], reverse=True)
    strongest_gap = counterfactuals[0] if counterfactuals else None

    if probability >= 0.90:
        decision = "AUTO_RESOLVE"
    elif probability >= 0.70:
        decision = "HUMAN_REVIEW"
    else:
        decision = "EXCEPTION"

    return {
        "decision": decision,
        "match_probability": round(probability, 4),
        "match_confidence": _pct(probability),
        "signals": signals,
        "counterfactuals": counterfactuals,
        "primary_driver": strongest_gap["feature"] if strongest_gap else None,
        "explanation": _build_explanation(probability, signals, strongest_gap),
    }


def _build_explanation(probability: float, signals: list[dict[str, Any]], strongest_gap: dict[str, Any] | None) -> str:
    if probability >= 0.90:
        prefix = "High-confidence match."
    elif probability >= 0.70:
        prefix = "Plausible match, but human review is required."
    else:
        prefix = "Low-confidence match; treat this as an exception."

    strong = [s["feature"] for s in signals if s["score"] >= 85]
    weak = [s["feature"] for s in signals if s["score"] < 60]
    details = []
    if strong:
        details.append("strong evidence from " + ", ".join(strong))
    if weak:
        details.append("weak evidence from " + ", ".join(weak))
    if strongest_gap and strongest_gap["probability_delta"] >= 5:
        details.append(
            f"the largest counterfactual lift comes from {strongest_gap['feature']}"
        )
    return prefix + (" " + "; ".join(details) + "." if details else "")


def _amount(value: Any) -> float:
    try:
        return abs(float(value or 0))
    except (TypeError, ValueError):
        return 0.0


def assess_risk(result: dict[str, Any], bank: dict[str, Any] | None = None) -> dict[str, Any]:
    probability = float(result.get("probability", 0.0))
    amount = _amount((bank or {}).get("credit"))
    evidence = result.get("features") or []

    # Risk increases with uncertainty, monetary exposure and evidence gaps.
    uncertainty = 1.0 - probability
    evidence_gap = sum(1 for x in evidence if isinstance(x, (int, float)) and x < 0.60) / max(1, len(evidence))
    exposure = min(amount / 1000000.0, 1.0)
    score = min(1.0, 0.55 * uncertainty + 0.25 * evidence_gap + 0.20 * exposure)

    if score >= 0.65:
        level = "HIGH"
        action = "ESCALATE"
    elif score >= 0.35:
        level = "MEDIUM"
        action = "REVIEW"
    else:
        level = "LOW"
        action = "AUTO_RESOLVE"

    return {
        "risk_score": round(score, 4),
        "risk_percent": _pct(score),
        "risk_level": level,
        "recommended_action": action,
        "monetary_exposure": amount,
        "evidence_gap": round(evidence_gap, 3),
    }


def build_impact(results: list[dict[str, Any]], bank: list[dict[str, Any]], settlements: list[dict[str, Any]]) -> dict[str, Any]:
    by_bank = {str(row.get("transaction_id")): row for row in bank}
    exception_rows = [r for r in results if r.get("status") != "matched"]
    total_exposure = sum(_amount(by_bank.get(str(r.get("bank_id")), {}).get("credit")) for r in exception_rows)
    review_exposure = sum(
        _amount(by_bank.get(str(r.get("bank_id")), {}).get("credit"))
        for r in results if r.get("status") == "review"
    )

    impact = {
        "bank_reconciliation": "HIGH" if exception_rows else "LOW",
        "general_ledger": "HIGH" if any(r.get("journal_ids") for r in exception_rows) else "MEDIUM" if exception_rows else "LOW",
        "cash_forecast": "MEDIUM" if total_exposure > 0 else "LOW",
        "tax_liability": "LOW",
    }

    return {
        "monetary_exposure": round(total_exposure, 2),
        "review_exposure": round(review_exposure, 2),
        "affected_records": len(exception_rows),
        "settlements_scanned": len(settlements),
        "impact_levels": impact,
    }


def benchmark(results: list[dict[str, Any]], truth_rows: list[dict[str, Any]]) -> dict[str, Any]:
    truth = {}
    for row in truth_rows:
        bank_id = str(row.get("bank_transaction_id") or "")
        if bank_id:
            truth[bank_id] = str(row.get("expected_status") or "").lower()

    predicted = {}
    for row in results:
        bank_id = str(row.get("bank_id") or "")
        if bank_id and bank_id not in predicted:
            predicted[bank_id] = str(row.get("status") or "").lower()

    labels = {"matched", "review", "exception"}
    evaluated = [(truth[k], predicted[k]) for k in truth if k in predicted and truth[k] in labels]
    correct = sum(actual == pred for actual, pred in evaluated)

    per_class = {}
    for label in labels:
        tp = sum(actual == label and pred == label for actual, pred in evaluated)
        fp = sum(actual != label and pred == label for actual, pred in evaluated)
        fn = sum(actual == label and pred != label for actual, pred in evaluated)
        precision = tp / (tp + fp) if tp + fp else 0.0
        recall = tp / (tp + fn) if tp + fn else 0.0
        per_class[label] = {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1": round(2 * precision * recall / (precision + recall), 4) if precision + recall else 0.0,
        }

    return {
        "records_evaluated": len(evaluated),
        "correct_predictions": correct,
        "accuracy": round(correct / len(evaluated), 4) if evaluated else 0.0,
        "accuracy_percent": _pct(correct / len(evaluated)) if evaluated else 0.0,
        "per_class": per_class,
        "ground_truth_cases": len(truth),
    }
