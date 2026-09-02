from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from reconciliation.engine import ReconciliationEngine
from graph.financial_graph import FinancialGraph
from ai.intelligence import explain_match, assess_risk, build_impact, benchmark
from user_runs import create_run, get_manifest, ingest_uploads, load_run_records
import os
import pandas as pd

app = FastAPI(title="AI Finance Controller")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

engine = ReconciliationEngine()


def load_data_from_csv():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    bank_df = pd.read_csv(os.path.join(data_dir, "bank_transactions.csv"))
    stl_df = pd.read_csv(os.path.join(data_dir, "settlements.csv"))
    inv_df = pd.read_csv(os.path.join(data_dir, "invoices.csv"))
    led_df = pd.read_csv(os.path.join(data_dir, "ledger_entries.csv"))

    return (
        bank_df.to_dict(orient="records"),
        stl_df.to_dict(orient="records"),
        inv_df.to_dict(orient="records"),
        led_df.to_dict(orient="records")
    )


def load_truth():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    return pd.read_csv(os.path.join(data_dir, "reconciliation_truth.csv")).to_dict(orient="records")


def load_dataset(run_id: str | None = None):
    if not run_id:
        return load_data_from_csv()
    records = load_run_records(run_id)
    return (
        records.get("BANK", []),
        records.get("SETTLEMENT", []),
        records.get("INVOICE", []),
        records.get("LEDGER", []),
    )


def _run_or_404(run_id: str | None):
    try:
        return load_dataset(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Uploaded finance run not found")


@app.get("/")
def health():
    return {"status": "running", "service": "AI Finance Controller"}


@app.post("/api/runs/upload")
async def upload_finance_run(files: list[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="Upload at least one CSV or screenshot.")
    result = ingest_uploads(files)
    if result["status"] == "failed":
        raise HTTPException(status_code=422, detail=result)
    return result


@app.get("/api/runs/{run_id}")
def finance_run(run_id: str):
    try:
        return get_manifest(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Uploaded finance run not found")


@app.get("/api/runs/{run_id}/data")
def finance_run_data(run_id: str):
    try:
        return load_run_records(run_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Uploaded finance run not found")


@app.get("/api/runs/{run_id}/summary")
def finance_run_summary(run_id: str):
    bank, stl, inv, led = _run_or_404(run_id)
    matches = engine.reconcile(bank, stl, inv, led)
    counts = {
        "MATCHED": len([x for x in matches if x["status"] == "matched"]),
        "REVIEW": len([x for x in matches if x["status"] == "review"]),
        "EXCEPTIONS": len([x for x in matches if x["status"] == "exception"]),
    }
    return {
        "run_id": run_id,
        "sources": {"bank": len(bank), "settlements": len(stl), "invoices": len(inv), "ledger": len(led)},
        "records_processed": sum(len(x) for x in (bank, stl, inv, led)),
        "counts": counts,
        "top_exception": next((x for x in matches if x["status"] == "exception"), None),
        "top_match": next((x for x in matches if x["status"] == "matched"), None),
    }


@app.post("/api/reconcile")
def reconcile(run_id: str | None = None):
    bank, stl, inv, led = _run_or_404(run_id)
    matches = engine.reconcile(bank, stl, inv, led)
    return {
        "MATCHED": [x for x in matches if x["status"] == "matched"],
        "REVIEW": [x for x in matches if x["status"] == "review"],
        "EXCEPTIONS": [x for x in matches if x["status"] == "exception"],
        "total_candidates": len(matches),
        "counts": {
            "MATCHED": len([x for x in matches if x["status"] == "matched"]),
            "REVIEW": len([x for x in matches if x["status"] == "review"]),
            "EXCEPTIONS": len([x for x in matches if x["status"] == "exception"])
        }
    }


@app.get("/api/ai/insights")
def ai_insights(run_id: str | None = None):
    bank, stl, inv, led = _run_or_404(run_id)
    matches = engine.reconcile(bank, stl, inv, led)
    bank_by_id = {str(row.get("transaction_id")): row for row in bank}
    stl_by_id = {str(row.get("settlement_id")): row for row in stl}

    insights = []
    for result in matches:
        b = bank_by_id.get(str(result.get("bank_id")))
        s = stl_by_id.get(str(result.get("settlement_id")))
        if b and s:
            explanation = explain_match(engine, b, s)
            risk = assess_risk(result, b)
            insights.append({
                "bank_id": result.get("bank_id"),
                "settlement_id": result.get("settlement_id"),
                "probability": result.get("probability"),
                "status": result.get("status"),
                "explanation": explanation,
                "risk": risk,
            })
    return {"insights": insights, "count": len(insights), "run_id": run_id or "synthetic"}


@app.get("/api/ai/exception/{bank_id}")
def ai_exception(bank_id: str, run_id: str | None = None):
    bank, stl, inv, led = _run_or_404(run_id)
    matches = engine.reconcile(bank, stl, inv, led)
    bank_row = next((b for b in bank if str(b.get("transaction_id")) == bank_id), None)
    if not bank_row:
        return {"error": "Bank transaction not found", "bank_id": bank_id}

    result = next((r for r in matches if str(r.get("bank_id")) == bank_id), None)
    if not result:
        return {"error": "No reconciliation result found", "bank_id": bank_id}

    settlement = next((s for s in stl if str(s.get("settlement_id")) == str(result.get("settlement_id"))), None)
    response = {"result": result, "risk": assess_risk(result, bank_row)}
    if settlement:
        response["explanation"] = explain_match(engine, bank_row, settlement)
    return response


@app.get("/api/ai/impact")
def ai_impact(run_id: str | None = None):
    bank, stl, inv, led = _run_or_404(run_id)
    matches = engine.reconcile(bank, stl, inv, led)
    return build_impact(matches, bank, stl) | {"run_id": run_id or "synthetic"}


@app.get("/api/ai/benchmark")
def ai_benchmark(run_id: str | None = None):
    # User uploads have no hidden ground-truth file, so never invent accuracy.
    if run_id:
        bank, stl, inv, led = _run_or_404(run_id)
        matches = engine.reconcile(bank, stl, inv, led)
        return {
            "run_id": run_id,
            "ground_truth_available": False,
            "records_evaluated": len(matches),
            "message": "Accuracy is not reported because this uploaded run has no labeled ground truth.",
            "counts": {
                "matched": len([x for x in matches if x["status"] == "matched"]),
                "review": len([x for x in matches if x["status"] == "review"]),
                "exceptions": len([x for x in matches if x["status"] == "exception"]),
            },
        }
    bank, stl, inv, led = load_data_from_csv()
    matches = engine.reconcile(bank, stl, inv, led)
    return benchmark(matches, load_truth())


@app.post("/api/graph")
def graph(run_id: str | None = None):
    bank, stl, inv, led = _run_or_404(run_id)
    matches = engine.reconcile(bank, stl, inv, led)

    g = FinancialGraph()
    for i in inv:
        g.add_record(i["invoice_number"], "invoice", amount=i.get("gross_amount"), customer=i.get("customer_name"), date=i.get("invoice_date"))
    for s in stl:
        g.add_record(s["settlement_id"], "settlement", amount=s.get("gross_sales"), date=s.get("settlement_date"))
    for b in bank:
        g.add_record(b["transaction_id"], "bank", amount=b.get("credit"), date=b.get("transaction_date"))
    for l in led:
        g.add_record(l["journal_id"], "ledger", amount=l.get("credit") or l.get("debit"), date=l.get("posting_date"))

    for m in matches:
        b_id = m.get("bank_id")
        s_id = m.get("settlement_id")
        inv_ids = m.get("invoice_ids", [])
        j_ids = m.get("journal_ids", [])
        confidence = m.get("probability", 0.0)
        if s_id:
            for i_id in inv_ids:
                g.add_relationship(i_id, s_id, "settled_in", confidence=1.0)
            if b_id:
                g.add_relationship(s_id, b_id, "bank_deposit", confidence=confidence)
        for j_id in j_ids:
            for i_id in inv_ids:
                g.add_relationship(i_id, j_id, "posted_to", confidence=1.0)

    return g.get_graph() | {"run_id": run_id or "synthetic"}
