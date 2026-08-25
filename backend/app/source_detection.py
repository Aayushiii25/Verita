from dataclasses import dataclass
from typing import Optional
import pandas as pd

from .schemas_registry import SOURCE_SCHEMAS


@dataclass
class DetectionResult:
    source: Optional[str]
    confidence: float
    scores: dict


def detect_source(df: pd.DataFrame, filename: str = "") -> DetectionResult:
    """
    Identify which financial source a dataframe represents based on its column
    schema (not the filename). Confidence is the fraction of a source's
    signature columns that are present in the dataframe. If the filename hints
    at the source and the schema doesn't clearly disagree, that nudges ties.
    """
    columns = set(c.strip() for c in df.columns)
    scores = {}

    for source, spec in SOURCE_SCHEMAS.items():
        sig = spec["signature_columns"]
        matched = sum(1 for c in sig if c in columns)
        scores[source] = round(matched / len(sig), 4)

    best_source = max(scores, key=scores.get)
    best_score = scores[best_source]

    # tie-break using filename hint if scores are equal
    tied = [s for s, v in scores.items() if v == best_score]
    if len(tied) > 1 and filename:
        fname_lower = filename.lower()
        for s in tied:
            if s.lower() in fname_lower:
                best_source = s
                break

    if best_score == 0:
        return DetectionResult(source=None, confidence=0.0, scores=scores)

    return DetectionResult(source=best_source, confidence=best_score, scores=scores)
