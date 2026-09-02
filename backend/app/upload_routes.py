from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile

from user_runs import get_manifest, ingest_uploads, load_run_records

router = APIRouter(prefix="/runs", tags=["user-runs"])


@router.post("/upload")
async def upload_run(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="Upload at least one CSV or screenshot.")
    result = ingest_uploads(files)
    if result["status"] == "failed":
        raise HTTPException(status_code=422, detail=result)
    return result


@router.get("/{run_id}")
def run_manifest(run_id: str):
    try:
        return get_manifest(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Run not found")


@router.get("/{run_id}/data")
def run_data(run_id: str):
    try:
        return load_run_records(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Run not found")
