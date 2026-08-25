# VERITA Demo Dataset + Ingestion Backend

## What's in here

```
data/
  bank_transactions.csv       21 records
  invoices.csv                 20 records
  settlements.csv              16 records
  ledger_entries.csv           21 records
  reconciliation_truth.csv     23 rows (internal only - do not show to the product user)

backend/
  requirements.txt
  app/
    schemas_registry.py    - column contracts for each source, used by detection + validation
    source_detection.py    - schema-based source identification with a confidence score
    validation.py          - required-columns / date / numeric / duplicate-id / empty-row checks
    ingestion.py            - orchestrates read -> detect -> validate -> summary + event log
    main.py                  - FastAPI app exposing POST /demo/run
```

## Scenario

Zylora Commerce Pvt Ltd, a fictional mid-sized Indian e-commerce business, selling through
its own site (Zylora.in, settled via a fictional "PayNova" payment gateway) and three
fictional marketplaces (Bazaarly, ShopKarma, Vyapaar Mart), over the period 2026-07-01 to
2026-07-30.

## Running the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# then:
curl -X POST "http://127.0.0.1:8000/demo/run"
```

By default it reads the four CSVs from `../data` relative to the `app` package. You can
point it at any other directory with `?data_dir=/path/to/csvs`, or via the
`VERITA_DATA_DIR` environment variable. Nothing about record counts, source detection,
validity, or processing time is hardcoded - every value in the response is computed from
whatever CSVs are actually on disk at request time (verified by re-running against a
deliberately corrupted copy of `invoices.csv` - the response correctly reflected the bad
date, non-numeric amount, and duplicate ID).

## Reconciliation design (see reconciliation_truth.csv for the full map)

- **16 clean MATCHED groups** - invoice -> settlement -> bank -> ledger, including cases
  where commission, payment fees, a partial refund, and small positive/negative
  "other_adjustments" fully explain the gap between gross invoice value and bank credit,
  and cases with 1-4 day settlement-to-bank timing delays.
- **3 REVIEW groups** - two invoices with identical customer/date/amount settled by one
  ambiguous batch settlement; two near-duplicate settlement records for the same
  marketplace order; and one invoice still pending with no settlement/bank/ledger trail yet.
- **2 EXCEPTION groups** - a duplicate ledger revenue posting with no second settlement or
  bank credit behind it, and an unexplained bank credit with no settlement, invoice, or
  ledger entry to support it.
