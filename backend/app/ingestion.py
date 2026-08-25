import time
from pathlib import Path
from typing import List, Dict, Any

import pandas as pd

from .source_detection import detect_source
from .validation import validate_dataframe

EXPECTED_FILES = [
    "bank_transactions.csv",
    "invoices.csv",
    "settlements.csv",
    "ledger_entries.csv",
]


def _read_csv_safely(path: Path):
    """Returns (dataframe_or_None, error_message_or_None)."""
    try:
        df = pd.read_csv(path, dtype=str, keep_default_na=False)
        return df, None
    except Exception as exc:  # noqa: BLE001 - surfacing any read failure to the caller
        return None, str(exc)


def run_ingestion(data_dir: str, run_id: str = "demo_001") -> Dict[str, Any]:
    """
    Ingests the four VERITA source CSVs from `data_dir`, detects each source
    from its schema, validates it, and returns a dynamic summary + event log.
    Nothing here is hardcoded - every count is derived from the files present
    on disk at call time.
    """
    start = time.perf_counter()
    data_path = Path(data_dir)

    events: List[Dict[str, Any]] = [
        {"stage": "STARTED", "message": f"Reading input files from {data_path}"}
    ]

    source_summary: List[Dict[str, Any]] = []
    total_records = 0
    total_valid = 0
    total_invalid = 0
    total_warnings = 0
    total_blocking = 0
    sources_detected = 0

    for filename in EXPECTED_FILES:
        file_path = data_path / filename

        if not file_path.exists():
            events.append({
                "stage": "SOURCE_MISSING",
                "file": filename,
                "message": f"{filename} not found in {data_path}",
            })
            source_summary.append({
                "source": filename.replace(".csv", "").upper(),
                "file": filename,
                "records": 0,
                "valid_records": 0,
                "invalid_records": 0,
                "confidence": 0.0,
                "status": "missing",
                "warnings": 0,
                "blocking_errors": 1,
            })
            total_blocking += 1
            continue

        df, read_error = _read_csv_safely(file_path)
        if df is None:
            events.append({
                "stage": "SOURCE_READ_ERROR",
                "file": filename,
                "message": f"Could not read {filename}: {read_error}",
            })
            source_summary.append({
                "source": filename.replace(".csv", "").upper(),
                "file": filename,
                "records": 0,
                "valid_records": 0,
                "invalid_records": 0,
                "confidence": 0.0,
                "status": "error",
                "warnings": 0,
                "blocking_errors": 1,
            })
            total_blocking += 1
            continue

        detection = detect_source(df, filename)
        record_count = len(df)
        total_records += record_count

        if detection.source is None:
            events.append({
                "stage": "SOURCE_UNRECOGNIZED",
                "file": filename,
                "message": f"Could not identify a known schema for {filename}",
            })
            source_summary.append({
                "source": "UNKNOWN",
                "file": filename,
                "records": record_count,
                "valid_records": 0,
                "invalid_records": record_count,
                "confidence": 0.0,
                "status": "error",
                "warnings": 0,
                "blocking_errors": 1,
            })
            total_invalid += record_count
            total_blocking += 1
            continue

        sources_detected += 1
        events.append({
            "stage": "SOURCE_DETECTED",
            "source": detection.source,
            "file": filename,
            "records": record_count,
            "confidence": detection.confidence,
        })

        report = validate_dataframe(df, detection.source)
        total_valid += report.valid_rows
        total_invalid += report.invalid_rows
        total_warnings += report.warning_count
        total_blocking += report.blocking_count

        status = "ready" if not report.has_blocking_error else "blocked"

        source_summary.append({
            "source": detection.source,
            "file": filename,
            "records": report.total_rows,
            "valid_records": report.valid_rows,
            "invalid_records": report.invalid_rows,
            "confidence": detection.confidence,
            "status": status,
            "warnings": report.warning_count,
            "blocking_errors": report.blocking_count,
            "issues": [
                {"severity": i.severity, "code": i.code, "message": i.message}
                for i in report.issues
            ],
        })

    events.append({"stage": "VALIDATION", "message": "Validating records"})

    overall_status = "complete" if total_blocking == 0 else "complete_with_errors"
    events.append({
        "stage": "COMPLETE",
        "message": "Ingestion complete" if total_blocking == 0 else "Ingestion complete with blocking errors",
    })

    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)

    ingestion_summary = {
        "status": overall_status,
        "sources_detected": sources_detected,
        "total_records": total_records,
        "valid_records": total_valid,
        "invalid_records": total_invalid,
        "processing_time_ms": elapsed_ms,
    }

    screen_3 = {
        "run_id": run_id,
        "status": "INGESTION COMPLETE" if total_blocking == 0 else "INGESTION COMPLETE WITH ERRORS",
        "records_ingested": total_records,
        "sources_detected": sources_detected,
        "records_valid": total_valid,
        "warnings": total_warnings,
        "blocking_errors": total_blocking,
        "processing_time_ms": elapsed_ms,
    }

    return {
        "ingestion_summary": ingestion_summary,
        "source_summary": source_summary,
        "event_log": events,
        "screen_3": screen_3,
    }
