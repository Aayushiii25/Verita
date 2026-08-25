from typing import List, Optional, Any, Dict
from pydantic import BaseModel


class Issue(BaseModel):
    severity: str
    code: str
    message: str


class SourceSummaryItem(BaseModel):
    source: str
    file: str
    records: int
    valid_records: int
    invalid_records: int
    confidence: float
    status: str
    warnings: int
    blocking_errors: int
    issues: Optional[List[Issue]] = None


class IngestionSummary(BaseModel):
    status: str
    sources_detected: int
    total_records: int
    valid_records: int
    invalid_records: int
    processing_time_ms: float


class Screen3Summary(BaseModel):
    run_id: str
    status: str
    records_ingested: int
    sources_detected: int
    records_valid: int
    warnings: int
    blocking_errors: int
    processing_time_ms: float


class EventLogItem(BaseModel):
    stage: str
    message: Optional[str] = None
    source: Optional[str] = None
    file: Optional[str] = None
    records: Optional[int] = None
    confidence: Optional[float] = None


class DemoRunResponse(BaseModel):
    ingestion_summary: IngestionSummary
    source_summary: List[SourceSummaryItem]
    event_log: List[EventLogItem]
    screen_3: Screen3Summary
