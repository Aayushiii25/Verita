"""Per-upload finance run storage and multimodal ingestion."""
from __future__ import annotations

import json
import os
import uuid
from pathlib import Path
from typing import Any, Dict, Iterable

import pandas as pd

from app.source_detection import detect_source

RUN_ROOT = Path(os.environ.get("VERITA_RUNS_DIR", Path(__file__).resolve().parent / "runs"))
RUN_ROOT.mkdir(parents=True, exist_ok=True)

SOURCE_FILES = {
    "BANK": "bank_transactions.csv",
    "INVOICE": "invoices.csv",
    "SETTLEMENT": "settlements.csv",
    "LEDGER": "ledger_entries.csv",
}


def _run_path(run_id: str) -> Path:
    if not run_id or "/" in run_id or "\\" in run_id or ".." in run_id:
        raise ValueError("Invalid run id")
    return RUN_ROOT / run_id


def create_run() -> str:
    run_id = f"run_{uuid.uuid4().hex[:12]}"
    _run_path(run_id).mkdir(parents=True, exist_ok=False)
    return run_id


def _write_source(run_dir: Path, source: str, frame: pd.DataFrame) -> int:
    filename = SOURCE_FILES[source]
    target = run_dir / filename
    frame = frame.copy()
    frame.columns = [str(c).strip() for c in frame.columns]
    if target.exists():
        existing = pd.read_csv(target, dtype=str).fillna("")
        frame = pd.concat([existing, frame], ignore_index=True)
    frame.to_csv(target, index=False)
    return len(frame)


def _extract_image_rows(data: bytes, mime_type: str) -> Dict[str, Any]:
    """Use Gemini Vision when configured to turn a table screenshot into rows."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "Screenshot ingestion needs GEMINI_API_KEY on the FastAPI server. "
            "CSV uploads do not require an AI key."
        )

    try:
        from google import genai
        from google.genai import types
    except ImportError as exc:
        raise RuntimeError("Install google-genai to enable screenshot ingestion.") from exc

    schema = {
        "type": "object",
        "properties": {
            "source": {"type": "string", "enum": ["BANK", "INVOICE", "SETTLEMENT", "LEDGER"]},
            "rows": {"type": "array", "items": {"type": "object", "additionalProperties": {"type": "string"}}},
            "notes": {"type": "string"},
        },
        "required": ["source", "rows", "notes"],
    }
    prompt = """
You are the ingestion layer of a finance reconciliation system.
Read the table in this screenshot. Identify whether it is BANK, INVOICE, SETTLEMENT, or LEDGER data.
Return every visible data row as JSON. Map columns to the canonical schema below; do not invent values.
If a field is not visible, use an empty string. Preserve IDs, dates, references and amounts exactly as shown.
Canonical columns:
BANK: transaction_id, transaction_date, value_date, description, reference_number, debit, credit, balance, counterparty_name
INVOICE: invoice_number, invoice_date, order_reference, customer_id, customer_name, gross_amount, tax_amount, net_amount, payment_status
SETTLEMENT: settlement_id, settlement_date, marketplace, gross_sales, commission_fee, payment_fee, refund_amount, other_adjustments, payout_amount, bank_reference
LEDGER: journal_id, posting_date, account_name, debit, credit, currency, narration, related_reference
Do not fabricate rows outside the visible table.
"""
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=os.environ.get("GEMINI_VISION_MODEL", "gemini-3.7-flash"),
        contents=[
            types.Part.from_text(text=prompt),
            types.Part.from_bytes(data=data, mime_type=mime_type),
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=schema,
            temperature=0,
        ),
    )
    return json.loads(response.text)


def ingest_uploads(files: Iterable[Any]) -> Dict[str, Any]:
    run_id = create_run()
    run_dir = _run_path(run_id)
    sources: Dict[str, Dict[str, Any]] = {}
    errors = []

    for upload in files:
        filename = getattr(upload, "filename", None) or "upload"
        content_type = getattr(upload, "content_type", "") or ""
        data = upload.file.read()
        suffix = Path(filename).suffix.lower()

        try:
            if suffix == ".csv" or content_type in {"text/csv", "application/csv"}:
                frame = pd.read_csv(pd.io.common.BytesIO(data), dtype=str).fillna("")
                detection = detect_source(frame, filename)
                if not detection.source or detection.confidence < 0.5:
                    raise ValueError(
                        "Could not identify this CSV. Use one of the four source templates shown in the upload guide."
                    )
                count = _write_source(run_dir, detection.source, frame)
                sources[detection.source] = {
                    "source": detection.source,
                    "files": sources.get(detection.source, {}).get("files", []) + [filename],
                    "records": count,
                    "confidence": detection.confidence,
                    "method": "schema",
                }
            elif content_type.startswith("image/") or suffix in {".png", ".jpg", ".jpeg", ".webp"}:
                parsed = _extract_image_rows(data, content_type or "image/png")
                source = parsed["source"]
                rows = parsed.get("rows", [])
                if not rows:
                    raise ValueError("No table rows were detected in the screenshot.")
                frame = pd.DataFrame(rows).fillna("")
                count = _write_source(run_dir, source, frame)
                sources[source] = {
                    "source": source,
                    "files": sources.get(source, {}).get("files", []) + [filename],
                    "records": count,
                    "confidence": 1.0,
                    "method": "gemini-vision",
                    "notes": parsed.get("notes", ""),
                }
            else:
                raise ValueError("Unsupported file type. Upload CSV, PNG, JPG, JPEG, or WEBP.")
        except Exception as exc:  # surface per-file errors without losing successful uploads
            errors.append({"file": filename, "error": str(exc)})

    total_records = 0
    for filename in SOURCE_FILES.values():
        path = run_dir / filename
        if path.exists():
            total_records += max(0, len(pd.read_csv(path, dtype=str)))

    manifest = {
        "run_id": run_id,
        "sources": list(sources.values()),
        "missing_sources": [s for s in SOURCE_FILES if s not in sources],
        "records_ingested": total_records,
        "errors": errors,
        "status": "ready" if sources and not errors else ("ready_with_warnings" if sources else "failed"),
    }
    (run_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def load_run_records(run_id: str):
    run_dir = _run_path(run_id)
    if not run_dir.exists():
        raise FileNotFoundError(run_id)

    result = {}
    for source, filename in SOURCE_FILES.items():
        path = run_dir / filename
        result[source] = pd.read_csv(path, dtype=str).fillna("").to_dict(orient="records") if path.exists() else []
    return result


def get_manifest(run_id: str) -> Dict[str, Any]:
    manifest_path = _run_path(run_id) / "manifest.json"
    if not manifest_path.exists():
        raise FileNotFoundError(run_id)
    return json.loads(manifest_path.read_text(encoding="utf-8"))
