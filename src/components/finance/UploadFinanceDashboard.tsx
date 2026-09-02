"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileImage, FileSpreadsheet, FileText, Info, Loader2, Upload, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SOURCE_GUIDE = [
  { name: "Bank transactions", key: "BANK", fields: "transaction_id, transaction_date, value_date, reference_number, debit, credit, balance, counterparty_name" },
  { name: "Invoices", key: "INVOICE", fields: "invoice_number, invoice_date, order_reference, customer_id, customer_name, gross_amount, tax_amount, net_amount, payment_status" },
  { name: "Settlements", key: "SETTLEMENT", fields: "settlement_id, settlement_date, marketplace, gross_sales, commission_fee, payment_fee, refund_amount, other_adjustments, payout_amount, bank_reference" },
  { name: "Ledger entries", key: "LEDGER", fields: "journal_id, posting_date, account_name, debit, credit, currency, narration, related_reference" },
];

type Props = { open: boolean; onClose: () => void };

export function UploadFinanceDashboard({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  if (!open) return null;

  const chooseFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles(Array.from(incoming));
    setError("");
    setResult(null);
  };

  const upload = async () => {
    if (!files.length) return setError("Choose at least one CSV, PDF or screenshot first.");
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      files.forEach((file) => body.append("files", file));
      const response = await fetch(`${API}/api/runs/upload`, { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail?.errors?.[0]?.error || data?.detail || "Upload failed");
      if (!data.run_id) throw new Error("The controller did not return a run ID.");
      localStorage.setItem("verita_run_id", data.run_id);
      localStorage.setItem("verita_run_manifest", JSON.stringify(data));
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Could not connect to the Finance Controller.");
    } finally {
      setBusy(false);
    }
  };

  const continueToController = () => {
    onClose();
    window.dispatchEvent(new Event("verita-run-changed"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl">
        <button onClick={onClose} className="absolute right-5 top-5 z-10 rounded-full border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-white" aria-label="Close upload dashboard"><X className="h-4 w-4" /></button>

        <div className="border-b border-white/10 px-7 py-7 md:px-10">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500"><Upload className="h-3.5 w-3.5" /> VERITA / YOUR DATA</div>
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">Build your reconciliation run.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">Upload the financial records you already have. Verita identifies the source, extracts and validates the data, then locks Slides 4–12 to this exact batch.</p>
        </div>

        <div className="grid gap-6 p-7 md:grid-cols-[1.05fr_.95fr] md:p-10">
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">01 · Add your files</div>
            <button onClick={() => inputRef.current?.click()} className="group flex min-h-[220px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/[0.03] p-8 text-center transition hover:border-white/40 hover:bg-white/[0.05]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] transition group-hover:scale-105"><Upload className="h-6 w-6 text-zinc-200" /></div>
              <div className="text-lg font-bold">Drop files here or browse</div>
              <div className="mt-2 text-xs text-zinc-500">CSV + PDF + PNG + JPG + JPEG + WEBP · multiple files allowed</div>
              <div className="mt-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500"><FileSpreadsheet className="h-3.5 w-3.5" /> CSV <FileText className="ml-2 h-3.5 w-3.5" /> PDF <FileImage className="ml-2 h-3.5 w-3.5" /> Screenshot</div>
            </button>
            <input ref={inputRef} type="file" multiple accept=".csv,.pdf,.png,.jpg,.jpeg,.webp,image/*,text/csv,application/pdf" className="hidden" onChange={(e) => chooseFiles(e.target.files)} />

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file) => <div key={`${file.name}-${file.size}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs"><span className="truncate pr-4">{file.name}</span><span className="shrink-0 text-zinc-500">{(file.size / 1024).toFixed(0)} KB</span></div>)}
              </div>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-sky-400/20 bg-sky-400/[0.05] p-4 text-xs leading-5 text-sky-100/80"><Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" /><span><b className="text-sky-200">PDF / screenshot tip:</b> upload a clear statement, invoice, settlement report or ledger page where the headers and rows are readable. Gemini Vision extracts the visible table without fabricating missing values.</span></div>

            {error && <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-xs text-red-200"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}

            {!result ? (
              <button disabled={busy || !files.length} onClick={upload} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40">{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Extracting & validating…</> : "Validate & start run"}</button>
            ) : (
              <button onClick={continueToController} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black"><CheckCircle2 className="h-4 w-4" /> Continue with this run</button>
            )}
          </div>

          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">02 · What to put in each file</div>
            <div className="space-y-3">
              {SOURCE_GUIDE.map((source) => <div key={source.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-center justify-between gap-3"><span className="font-bold">{source.name}</span><span className="rounded-full border border-white/10 px-2 py-1 text-[9px] font-mono text-zinc-500">{source.key}</span></div><p className="mt-2 text-[11px] leading-5 text-zinc-500">{source.fields}</p></div>)}
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5"><div className="text-xs font-bold text-zinc-300">You don't need to upload all four.</div><p className="mt-2 text-xs leading-5 text-zinc-500">Upload a mix of CSVs, PDFs and screenshots. Missing sources are shown as missing and the controller will not fabricate them. More source types create a richer reconciliation chain.</p></div>

            {result && <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5"><div className="text-xs font-black uppercase tracking-wider text-emerald-300">Run created · {result.run_id}</div><div className="mt-3 grid grid-cols-2 gap-2">{(result.sources || []).map((s: any) => <div key={s.source} className="rounded-xl bg-black/20 p-3"><div className="text-[9px] uppercase text-zinc-500">{s.source}</div><div className="mt-1 font-mono text-lg font-bold">{s.records}</div><div className="text-[9px] text-zinc-600">records</div></div>)}</div>{result.errors?.length > 0 && <div className="mt-3 text-[10px] text-amber-300">Some files need attention; successful files are still retained in this run.</div>}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
