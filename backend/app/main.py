import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from pydantic import BaseModel

from .ingestion import run_ingestion
from .models import DemoRunResponse
from .reconciliation import reconcile_data

app = FastAPI(
    title="VERITA Demo API",
    description="Dynamically ingests and reconciles the VERITA CSVs.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_DATA_DIR = os.environ.get("VERITA_DATA_DIR", os.path.join(os.path.dirname(__file__), "..", "..", "data"))


class ReconItem(BaseModel):
    bank_id: str
    settlement_id: str
    invoice_ids: List[str]
    journal_id: str
    reason: str


class ReconcileResponse(BaseModel):
    MATCHED: List[ReconItem]
    REVIEW: List[ReconItem]
    EXCEPTIONS: List[ReconItem]
    counts: Dict[str, int]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/demo/run", response_model=DemoRunResponse)
def demo_run(
    run_id: str = Query(default="demo_001"),
    data_dir: str = Query(default=None),
):
    target_dir = data_dir or DEFAULT_DATA_DIR
    if not os.path.isdir(target_dir):
        raise HTTPException(status_code=400, detail=f"data_dir not found: {target_dir}")

    result = run_ingestion(target_dir, run_id=run_id)
    return result


@app.post("/demo/reconcile", response_model=ReconcileResponse)
def demo_reconcile(
    data_dir: str = Query(default=None),
):
    target_dir = data_dir or DEFAULT_DATA_DIR
    if not os.path.isdir(target_dir):
        raise HTTPException(status_code=400, detail=f"data_dir not found: {target_dir}")

    result = reconcile_data(target_dir)
    
    counts = {
        "MATCHED": len(result["MATCHED"]),
        "REVIEW": len(result["REVIEW"]),
        "EXCEPTIONS": len(result["EXCEPTIONS"])
    }
    
    return {
        "MATCHED": result["MATCHED"],
        "REVIEW": result["REVIEW"],
        "EXCEPTIONS": result["EXCEPTIONS"],
        "counts": counts
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
