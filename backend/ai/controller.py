from __future__ import annotations

import os
from typing import Any

from dotenv import load_dotenv

# Load backend/.env for local development. The real .env is ignored by Git.
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


def _compact_rows(rows: list[dict[str, Any]], limit: int = 80) -> list[dict[str, Any]]:
    return rows[:limit]


def answer_controller(question: str, bank: list[dict[str, Any]], settlements: list[dict[str, Any]], invoices: list[dict[str, Any]], ledger: list[dict[str, Any]], matches: list[dict[str, Any]]) -> dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "available": False,
            "message": "Finance Controller LLM is not configured. Add GEMINI_API_KEY to backend/.env, then restart the backend.",
        }

    try:
        from google import genai
    except ImportError:
        return {
            "available": False,
            "message": "The Gemini SDK is missing. Install the backend requirements and restart FastAPI.",
        }

    client = genai.Client(api_key=api_key)
    model = os.getenv("GEMINI_MODEL", "gemini-3.7-flash")

    matched = sum(1 for x in matches if x.get("status") == "matched")
    review = sum(1 for x in matches if x.get("status") == "review")
    exceptions = sum(1 for x in matches if x.get("status") == "exception")

    context = {
        "dataset_counts": {
            "bank_transactions": len(bank),
            "settlements": len(settlements),
            "invoices": len(invoices),
            "ledger_entries": len(ledger),
        },
        "reconciliation_counts": {
            "matched": matched,
            "review": review,
            "exceptions": exceptions,
        },
        "bank_transactions": _compact_rows(bank),
        "settlements": _compact_rows(settlements),
        "invoices": _compact_rows(invoices),
        "ledger_entries": _compact_rows(ledger),
        "reconciliation_results": _compact_rows(matches),
    }

    prompt = f"""You are Verita's Finance Controller. Answer the user's finance-operations question using ONLY the supplied dataset and reconciliation evidence.

Rules:
- Never invent accounting facts, transactions, invoices, amounts, dates, or explanations.
- If the dataset does not contain enough evidence, say exactly what is missing.
- Distinguish model inference from confirmed source data.
- Prefer concise, decision-ready answers.
- When discussing a match, cite the relevant record IDs from the supplied context.
- You may explain why a reconciliation result was classified as matched, review, or exception, but do not claim an external accounting action happened unless the data says so.

USER QUESTION:
{question}

GROUNDED DATA:
{context}
"""

    try:
        response = client.models.generate_content(model=model, contents=prompt)
        text = getattr(response, "text", None) or "No response was returned by the Finance Controller model."
        return {
            "available": True,
            "model": model,
            "answer": text,
            "evidence": {
                "records_available": len(bank) + len(settlements) + len(invoices) + len(ledger),
                "reconciliation_results": len(matches),
            },
        }
    except Exception as exc:
        return {
            "available": False,
            "message": f"The Finance Controller LLM could not be reached: {exc}",
        }
