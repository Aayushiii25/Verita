# Verita — AI Finance Controller

> **Razorpay Buildathon · Track 04**  
> **Run the books and the cash position.**

Verita is an AI-powered finance operations controller that closes a reconciliation loop across **50+ synthetic financial records**. It combines deterministic reconciliation, ML-based record linking, exception detection, risk analysis, impact propagation, an audit-ready decision trace, and a grounded Finance Controller LLM.

The goal is not to show one perfect match. **Verita reports what it matched, what it could not resolve, and where human review is still required.**

---

## 🎯 Track 04 — AI Finance Controller

### The problem

Finance operations still rely heavily on manual reconciliation across disconnected sources such as bank transactions, invoices, settlements, and ledger entries.

That creates three recurring problems:

- matching records across systems is slow;
- ambiguous transactions require manual investigation;
- teams need to understand the financial impact of unresolved exceptions.

### The Verita approach

Verita treats reconciliation as an end-to-end finance-ops loop:

```text
Bank Transactions ─┐
Invoices ───────────┤
Settlements ────────┼──> Reconciliation ──> ML Matching ──> Exceptions
Ledger Entries ────┘                              │              │
                                                  ↓              ↓
                                           Confidence/Risk   Impact Analysis
                                                  │              │
                                                  └──────┬───────┘
                                                         ↓
                                                Finance Controller
                                                         ↓
                                              Decision + Explanation
```

---

## 🚀 What Verita Does

### 1. Multi-source reconciliation

Accepts finance records from multiple sources and normalizes them into a common structure.

Supported source categories:

- Bank transactions
- Invoices
- Settlements
- Ledger entries

Users can upload their own dataset and receive a unique run ID so results remain isolated to that dataset.

### 2. Deterministic reconciliation baseline

Verita first establishes a transparent baseline using accounting-relevant fields such as:

- amount
- currency
- date
- reference ID
- counterparty
- invoice ID

This gives the system a boring-but-correct foundation before introducing probabilistic matching.

### 3. ML record linking

The ML layer scores candidate relationships using multiple signals rather than relying on a single exact match.

The matching model considers:

```text
Amount similarity
+ Date proximity
+ Reference similarity
+ Counterparty similarity
+ Currency match
                    ↓
             Match probability
```

This allows Verita to distinguish high-confidence matches from records that need review.

### 4. Exception detection

Every reconciliation result is classified into an operational state:

- **Matched** — high-confidence reconciliation
- **Review** — ambiguous result requiring human validation
- **Exception** — unresolved relationship or meaningful discrepancy

The system surfaces exceptions instead of hiding them behind a single accuracy number.

### 5. Confidence + risk engine

Verita combines model confidence with financial exposure to prioritize operational risk.

For an exception, the system can surface:

- match probability
- contributing signals
- risk level
- monetary exposure
- likely downstream impact
- counterfactual reasoning

### 6. Break propagation / impact analysis

An unresolved reconciliation break can affect more than one record. Verita maps relationships between financial entities and estimates the affected financial surface so operators can prioritize the most consequential breaks.

### 7. Finance Controller LLM

The built-in Finance Controller provides grounded natural-language analysis over the current reconciliation run.

Example questions:

> Which transactions need review?

> Why was this transaction classified as an exception?

> What is the largest unresolved exposure?

> Which invoices appear to be missing a settlement?

> Summarize the current reconciliation status.

The controller is instructed to use only the supplied dataset and reconciliation evidence, distinguish inference from confirmed source data, and identify missing evidence rather than inventing accounting facts.

### 8. Audit-ready decision trace

Verita preserves the reasoning behind operational decisions, including the evidence used, confidence signals, exception state, and resulting action recommendation.

### 9. Batch reporting

The final view summarizes the entire run rather than presenting a cherry-picked success.

The report surfaces:

- total records processed
- matched records
- records requiring review
- unresolved exceptions
- match rate
- monetary exposure
- confidence/risk distribution
- benchmark information where ground truth exists

---

## 📊 The Benchmark Philosophy

The buildathon requirement is not simply:

> "Look, the AI matched one transaction!"

Verita is designed around **throughput + measured accuracy + an honest exception list**.

For synthetic benchmark data with known ground truth, the system can report measured performance such as match accuracy and reconciliation outcomes.

For user-uploaded data where ground truth is unavailable, Verita explicitly avoids fabricating an accuracy number. Instead, it reports the observed reconciliation outcomes and tells the operator when benchmark ground truth is missing.

**A system that admits uncertainty is more useful than one that invents certainty.**

---

## 🧠 Architecture

```text
                         ┌─────────────────────┐
                         │   User / Operator   │
                         └──────────┬──────────┘
                                    │
                             CSV / Image Data
                                    │
                                    ↓
                         ┌─────────────────────┐
                         │   Ingestion Layer   │
                         │  Source Detection   │
                         └──────────┬──────────┘
                                    │
                                    ↓
                         ┌─────────────────────┐
                         │ Reconciliation Core │
                         │ Deterministic Rules │
                         └──────────┬──────────┘
                                    │
                                    ↓
                         ┌─────────────────────┐
                         │  ML Record Linker   │
                         │ Confidence Scoring  │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
             Risk Engine     Graph Analysis    Exception Layer
                    │               │               │
                    └───────────────┼───────────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ Finance Controller  │
                         │    Gemini LLM       │
                         └──────────┬──────────┘
                                    ↓
                         Decision-ready output
```

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- GSAP
- Framer Motion

### Backend

- Python
- FastAPI
- Pandas
- scikit-learn
- NetworkX

### AI / ML

- Random Forest record-linking model
- Feature-based match scoring
- Google Gemini API for the Finance Controller

### Data

- Synthetic multi-source finance records
- Per-upload run isolation
- CSV ingestion
- Image-to-structured-data extraction when Gemini Vision is configured

---

## 📁 Project Structure

```text
Verita/
├── backend/
│   ├── ai/
│   │   ├── controller.py          # Finance Controller LLM
│   │   └── intelligence.py        # AI insights, risk & benchmark logic
│   ├── ml/
│   │   ├── features.py            # Matching features
│   │   ├── model.py               # ML model
│   │   └── record_linker.py       # Record linking
│   ├── reconciliation/
│   │   └── engine.py              # Core reconciliation engine
│   ├── services/
│   │   └── graph.py               # Relationship / impact graph
│   ├── user_runs.py               # Per-upload datasets
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt
│   └── .env.example
│
├── src/
│   ├── app/
│   │   └── page.tsx               # Main product flow
│   └── components/
│       ├── finance/               # Upload, results & Controller UI
│       └── sections/              # Product presentation sections
│
├── public/
├── package.json
└── README.md
```

---

## ⚡ Run Locally

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Gemini API key for the Finance Controller LLM

### 1. Clone

```bash
git clone https://github.com/Aayushiii25/Verita.git
cd Verita
```

### 2. Frontend dependencies

```bash
npm install
```

### 3. Backend environment

Create:

```text
backend/.env
```

Use the example file as a template:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.7-flash
```

**Never commit `backend/.env`.** It is ignored by Git.

### 4. Backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 5. Start FastAPI

```bash
uvicorn main:app --reload
```

The backend runs on:

```text
http://localhost:8000
```

### 6. Start Next.js

In another terminal:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | For LLM | Authenticates the Finance Controller with Gemini |
| `GEMINI_MODEL` | Optional | Gemini model name; defaults to `gemini-3.7-flash` |

Keep all secrets server-side. Do **not** expose `GEMINI_API_KEY` through a `NEXT_PUBLIC_*` variable.

---

## 🔄 Core API Flow

### Upload a dataset

```http
POST /api/runs/upload
```

Creates an isolated finance run and ingests the supplied sources.

### Get run summary

```http
GET /api/runs/{run_id}/summary
```

Returns reconciliation summary information for that run.

### Run reconciliation

```http
GET /api/reconcile?run_id={run_id}
```

Runs the reconciliation engine against the selected dataset.

### Ask the Finance Controller

```http
POST /api/controller/ask
```

Example payload:

```json
{
  "question": "Which transactions have the highest unresolved exposure?",
  "run_id": "your_run_id"
}
```

The LLM receives the current dataset and reconciliation evidence as grounded context.

---

## 🤖 Finance Controller Guardrails

The LLM is not treated as the source of truth for accounting data.

Its controller prompt explicitly requires it to:

1. use only supplied financial data;
2. never invent transactions, invoices, amounts, dates, or explanations;
3. identify missing evidence;
4. distinguish model inference from confirmed source data;
5. cite relevant record IDs when discussing reconciliation;
6. avoid claiming that an external accounting action occurred unless the dataset confirms it.

This makes the LLM an **operator interface over the reconciliation system**, rather than an unrestricted chatbot.

---

## 🧪 Example Evaluation

A representative run should contain **50+ records** across the synthetic finance sources.

The important evaluation output is:

```text
Records processed:       50+
Matched:                 X
Review required:         Y
Unresolved exceptions:   Z
Match rate:              XX.X%
Financial exposure:      ₹ / $ X,XXX.XX
```

The exact values should come from the executed dataset and benchmark run — not from a hard-coded claim in this README.

That distinction matters: **Verita reports the result it actually observed.**

---

## 🏆 Why This Fits Track 04

**Track 04 asks for an AI Finance Controller that closes a finance-ops loop across a 50+ record synthetic batch.**

Verita addresses that loop end-to-end:

| Track requirement | Verita implementation |
|---|---|
| 50+ record batch | Synthetic multi-source finance dataset |
| Finance operations | Bank / invoice / settlement / ledger reconciliation |
| AI agent | Grounded Finance Controller LLM |
| Matching | Deterministic baseline + ML record linking |
| Measured performance | Match rate and benchmark reporting |
| Exceptions | Explicit review + unresolved exception states |
| Risk | Confidence and risk engine |
| Impact | Financial exposure and relationship graph |
| Decision support | LLM-powered finance Q&A |
| Auditability | Evidence-backed decision trace |
| Honest evaluation | No fabricated accuracy without ground truth |

---

## 🔮 Future Extensions

The architecture can be extended toward the other directions suggested by the track:

- settlement Q&A automation;
- forward cash forecasting;
- tax-line matching;
- ERP integrations;
- human-in-the-loop approval workflows;
- continuous reconciliation monitoring;
- production accounting-system connectors.

---

## 👥 Buildathon Project

**Verita** was built for the **Razorpay Buildathon — Track 04: AI Finance Controller**.

> **Run the books and the cash position.**
>
> Don't hide the exceptions. Explain them, prioritize them, and give the finance operator a decision they can act on.
