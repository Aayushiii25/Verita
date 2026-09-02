"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, BrainCircuit, CheckCircle2, FileSearch, GitBranch, ShieldAlert, Upload } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Summary = {
  run_id: string;
  sources: { bank: number; settlements: number; invoices: number; ledger: number };
  records_processed: number;
  counts: { MATCHED: number; REVIEW: number; EXCEPTIONS: number };
  top_exception: any;
  top_match: any;
};

type Props = { kind: "early" | "advanced" };

export function UserRunResultsOverlay({ kind }: Props) {
  const [runId, setRunId] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [insight, setInsight] = useState<any>(null);
  const [impact, setImpact] = useState<any>(null);
  const [benchmark, setBenchmark] = useState<any>(null);
  const [graph, setGraph] = useState<any>(null);
  const [slide, setSlide] = useState(kind === "early" ? 4 : 8);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const readRun = () => setRunId(localStorage.getItem("verita_run_id"));
    readRun();
    window.addEventListener("verita-run-changed", readRun);
    return () => window.removeEventListener("verita-run-changed", readRun);
  }, []);

  useEffect(() => {
    if (!runId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const suffix = `?run_id=${encodeURIComponent(runId)}`;
        const requests = await Promise.all([
          fetch(`${API}/api/runs/${runId}/summary`),
          fetch(`${API}/api/ai/insights${suffix}`),
          fetch(`${API}/api/ai/impact${suffix}`),
          fetch(`${API}/api/ai/benchmark${suffix}`),
          fetch(`${API}/api/graph${suffix}`, { method: "POST" }),
        ]);
        if (requests.some((r) => !r.ok)) return;
        const [s, i, p, b, g] = await Promise.all(requests.map((r) => r.json()));
        if (!cancelled) { setSummary(s); setInsight(i.insights?.[0] || null); setImpact(p); setBenchmark(b); setGraph(g); }
      } catch { /* keep upload UI usable when backend is offline */ }
    };
    load();
    const timer = window.setInterval(load, 30000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [runId]);

  useEffect(() => {
    if (!runId) return;
    const update = () => {
      const early = document.getElementById("verita-early-run-range");
      const advanced = document.getElementById("verita-advanced-features");
      const target = kind === "early" ? early : advanced;
      if (!target) return;
      const top = target.offsetTop;
      const distance = kind === "early" ? 5000 : 6000;
      const progress = Math.max(0, Math.min(0.999, (window.scrollY - top) / distance));
      const start = kind === "early" ? 4 : 8;
      setSlide(start + Math.min(4, Math.floor(progress * 4)));
      setActive(window.scrollY >= top - 80 && window.scrollY <= top + distance + 80);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [kind, runId]);

  const title = useMemo(() => ({
    4: "Your batch · ML record linking",
    5: "Your batch · temporal financial graph",
    6: "Your batch · break detection",
    7: "Your batch · reconciliation state",
    8: "Your batch · impact model",
    9: "Your batch · confidence + risk",
    10: "Your batch · finance controller",
    11: "Your batch · decision trace",
    12: "Your batch · benchmark report",
  } as Record<number, string>)[slide] || "Your finance run"), [slide]);

  if (!runId || !active || !summary) return null;

  const sourceRows = [
    ["Bank", summary.sources.bank], ["Settlements", summary.sources.settlements], ["Invoices", summary.sources.invoices], ["Ledger", summary.sources.ledger],
  ];

  return (
    <div className="fixed inset-0 z-[40] pointer-events-none flex items-center justify-center p-5 md:p-10">
      <div className="pointer-events-auto w-full max-w-5xl rounded-[30px] border border-white/10 bg-[#070707]/96 p-6 text-white shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div><div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> USER RUN · {runId}</div><h2 className="text-3xl font-black tracking-tight md:text-5xl">{title}</h2><p className="mt-2 text-sm text-zinc-500">Every metric below is computed from this uploaded batch — not the synthetic demo.</p></div>
          <div className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[9px] font-mono text-zinc-500">SLIDE {slide}</div>
        </div>

        {slide <= 7 && (
          <div className="grid gap-4 md:grid-cols-4">
            {sourceRows.map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="text-[9px] uppercase tracking-widest text-zinc-600">{label}</div><div className="mt-2 font-mono text-3xl font-black">{value}</div><div className="mt-1 text-[10px] text-zinc-500">records loaded</div></div>)}
          </div>
        )}

        {slide === 4 && <div className="mt-5 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5"><CheckCircle2 className="h-5 w-5 text-emerald-400" /><div className="mt-3 text-xs text-zinc-500">MATCHED</div><div className="text-3xl font-black">{summary.counts.MATCHED}</div></div><div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5"><ShieldAlert className="h-5 w-5 text-amber-300" /><div className="mt-3 text-xs text-zinc-500">REVIEW</div><div className="text-3xl font-black">{summary.counts.REVIEW}</div></div><div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5"><AlertTriangle className="h-5 w-5 text-red-300" /><div className="mt-3 text-xs text-zinc-500">EXCEPTIONS</div><div className="text-3xl font-black">{summary.counts.EXCEPTIONS}</div></div></div>}

        {slide === 5 && <div className="mt-5 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><GitBranch className="h-5 w-5" /><div className="mt-3 text-xs text-zinc-500">GRAPH NODES</div><div className="text-3xl font-black">{graph?.nodes?.length ?? 0}</div></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><GitBranch className="h-5 w-5" /><div className="mt-3 text-xs text-zinc-500">RELATIONSHIPS</div><div className="text-3xl font-black">{graph?.edges?.length ?? 0}</div></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><BarChart3 className="h-5 w-5" /><div className="mt-3 text-xs text-zinc-500">TOTAL RECORDS</div><div className="text-3xl font-black">{summary.records_processed}</div></div></div>}

        {slide === 6 && <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-6"><div className="text-[10px] uppercase tracking-widest text-amber-300">Top exception from your run</div><div className="mt-3 text-2xl font-black">{summary.top_exception?.bank_id || "No bank exception"}</div><p className="mt-2 text-sm text-zinc-400">{summary.top_exception?.reason || "No unresolved bank break was returned."}</p></div>}

        {slide === 7 && <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><div className="text-[10px] uppercase tracking-widest text-zinc-500">Current run state</div><div className="mt-4 grid grid-cols-3 gap-3"><div><div className="text-2xl font-black text-emerald-300">{summary.counts.MATCHED}</div><div className="text-[10px] text-zinc-500">matched</div></div><div><div className="text-2xl font-black text-amber-300">{summary.counts.REVIEW}</div><div className="text-[10px] text-zinc-500">review</div></div><div><div className="text-2xl font-black text-red-300">{summary.counts.EXCEPTIONS}</div><div className="text-[10px] text-zinc-500">exceptions</div></div></div></div>}

        {slide === 8 && <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><div className="text-[10px] uppercase tracking-widest text-zinc-500">Monetary exposure</div><div className="mt-2 text-4xl font-black">₹{Number(impact?.monetary_exposure || 0).toLocaleString("en-IN")}</div><div className="mt-4 text-sm text-zinc-400">Affected records: {impact?.affected_records ?? 0}</div></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><div className="text-[10px] uppercase tracking-widest text-zinc-500">Impact levels</div>{Object.entries(impact?.impact_levels || {}).map(([k, v]) => <div key={k} className="mt-3 flex justify-between text-sm"><span className="text-zinc-400">{k}</span><b>{String(v)}</b></div>)}</div></div>}

        {slide === 9 && <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6"><div className="text-xs font-bold text-emerald-300">MODEL DECISION</div><div className="mt-2 text-4xl font-black">{insight ? `${Math.round((insight.explanation.match_confidence || insight.probability || 0) * 1000) / 10}%` : "—"}</div><div className="mt-2 text-sm text-zinc-400">{insight?.status || "No scored candidate"}</div></div><div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-6"><div className="text-xs font-bold text-amber-300">RISK</div><div className="mt-2 text-3xl font-black">{insight?.risk?.risk_level || "—"}</div><div className="mt-2 text-sm text-zinc-400">{insight?.risk?.recommended_action || "No risk action returned"}</div></div></div>}

        {slide === 10 && <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center gap-3"><BrainCircuit className="h-5 w-5" /><div className="text-sm font-bold">Finance controller workflow</div></div><div className="mt-5 grid gap-2 md:grid-cols-4">{["Investigate exception","Query graph","Look at evidence","Generate hypotheses","Run counterfactuals","Check risk policy","Resolve OR escalate"].map((step) => <div key={step} className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-300">{step}</div>)}</div><div className="mt-5 text-xs text-zinc-500">Controller analyzed {summary.records_processed} records from this run.</div></div>}

        {slide === 11 && <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-6"><div className="text-[10px] uppercase tracking-widest text-violet-300">Decision trace</div><div className="mt-4 space-y-3 text-sm">{[["Exception", insight?.bank_id || "—"],["Evidence", insight ? "Bank + settlement + model signals" : "—"],["Driver", insight?.explanation?.primary_driver || "—"],["Confidence", insight ? `${Math.round((insight.explanation.match_confidence || 0) * 1000) / 10}%` : "—"],["Risk action", insight?.risk?.recommended_action || "—"]].map(([k,v]) => <div key={k} className="flex justify-between border-b border-white/[0.06] pb-2"><span className="text-zinc-500">{k}</span><b className="font-mono">{v}</b></div>)}</div></div>}

        {slide === 12 && <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center gap-3"><FileSearch className="h-5 w-5" /><div className="text-sm font-bold">Batch report for this upload</div></div><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4"><div><b className="text-2xl">{summary.records_processed}</b><div className="text-[10px] text-zinc-500">records processed</div></div><div><b className="text-2xl text-emerald-300">{summary.counts.MATCHED}</b><div className="text-[10px] text-zinc-500">matched</div></div><div><b className="text-2xl text-amber-300">{summary.counts.REVIEW}</b><div className="text-[10px] text-zinc-500">human review</div></div><div><b className="text-2xl text-red-300">{summary.counts.EXCEPTIONS}</b><div className="text-[10px] text-zinc-500">exceptions</div></div></div><div className="mt-5 rounded-xl border border-white/10 p-4 text-xs text-zinc-500">{benchmark?.message || "Ground-truth benchmark unavailable for this uploaded run. Counts above are measured directly from your files."}</div></div>}

        <div className="mt-7 flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-zinc-600"><Upload className="h-3 w-3" /> Source locked to uploaded run · no synthetic fallback</div>
      </div>
    </div>
  );
}
