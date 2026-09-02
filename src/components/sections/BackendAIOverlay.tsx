"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, CheckCircle2, Gauge, GitBranch, ShieldAlert, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type InsightsResponse = {
  insights: Array<{
    bank_id: string;
    settlement_id: string;
    probability: number;
    status: string;
    explanation: {
      match_confidence: number;
      primary_driver: string | null;
      explanation: string;
      counterfactuals: Array<{ feature: string; probability_delta: number; causal_signal: string }>;
    };
    risk: { risk_percent: number; risk_level: string; recommended_action: string };
  }>;
};

type Benchmark = {
  accuracy_percent: number;
  records_evaluated: number;
  correct_predictions: number;
  per_class: Record<string, { precision: number; recall: number; f1: number }>;
};

type Impact = {
  monetary_exposure: number;
  affected_records: number;
  impact_levels: Record<string, string>;
};

export function BackendAIOverlay({ isReady = false }: { isReady?: boolean }) {
  const [insights, setInsights] = useState<InsightsResponse["insights"]>([]);
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null);
  const [impact, setImpact] = useState<Impact | null>(null);
  const [activeSlide, setActiveSlide] = useState(8);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    let mounted = true;

    const load = async () => {
      try {
        const [insightsRes, benchmarkRes, impactRes] = await Promise.all([
          fetch(`${API}/api/ai/insights`),
          fetch(`${API}/api/ai/benchmark`),
          fetch(`${API}/api/ai/impact`),
        ]);
        if (!insightsRes.ok || !benchmarkRes.ok || !impactRes.ok) return;
        const [insightData, benchmarkData, impactData] = await Promise.all([
          insightsRes.json(), benchmarkRes.json(), impactRes.json(),
        ]);
        if (mounted) {
          setInsights(insightData.insights || []);
          setBenchmark(benchmarkData);
          setImpact(impactData);
        }
      } catch {
        // Keep the existing frontend usable if the backend is offline.
      }
    };

    load();
    const interval = window.setInterval(load, 30000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;

    const onScroll = () => {
      const section = document.getElementById("verita-advanced-features");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const pinnedDistance = 6000;
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / pinnedDistance));
      const slide = Math.min(12, 8 + Math.floor(progress * 5));
      setActiveSlide(slide);
      setVisible(rect.top <= 40 && rect.bottom >= window.innerHeight * 0.45);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isReady]);

  const lead = useMemo(() => insights[0], [insights]);
  if (!isReady || !visible) return null;

  const liveValue = activeSlide === 8
    ? impact ? `₹${(impact.monetary_exposure / 100000).toFixed(1)}L exposure` : "Scanning graph"
    : activeSlide === 9
      ? lead ? `${lead.explanation.match_confidence}% confidence` : "Scoring candidates"
      : activeSlide === 10
        ? `${insights.length} decisions analyzed`
        : activeSlide === 11
          ? lead?.explanation.primary_driver ? `Driver: ${lead.explanation.primary_driver}` : "Tracing evidence"
          : benchmark ? `${benchmark.accuracy_percent}% accuracy` : "Evaluating batch";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        className="fixed bottom-6 right-6 z-[45] w-[min(360px,calc(100vw-32px))] pointer-events-none"
      >
        <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-400">LIVE BACKEND · ML/AI</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-600">SLIDE {activeSlide}</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
              {activeSlide === 8 ? <GitBranch className="h-4 w-4" /> : activeSlide === 9 ? <Gauge className="h-4 w-4" /> : activeSlide === 10 ? <BrainCircuit className="h-4 w-4" /> : activeSlide === 11 ? <Sparkles className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </div>
            <div>
              <div className="text-sm font-bold">{liveValue}</div>
              <div className="text-[10px] text-zinc-500">Computed by the FastAPI controller</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white/[0.04] p-2">
              <div className="text-[8px] uppercase text-zinc-600">Model</div>
              <div className="mt-1 text-[10px] font-bold">Random Forest</div>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-2">
              <div className="text-[8px] uppercase text-zinc-600">Signals</div>
              <div className="mt-1 text-[10px] font-bold">5 features</div>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-2">
              <div className="text-[8px] uppercase text-zinc-600">Risk</div>
              <div className="mt-1 text-[10px] font-bold flex items-center gap-1">
                {lead?.risk.risk_level || "—"} <ShieldAlert className="h-3 w-3" />
              </div>
            </div>
          </div>

          {activeSlide === 12 && benchmark && (
            <div className="mt-3 text-[9px] text-zinc-500 font-mono">
              {benchmark.correct_predictions}/{benchmark.records_evaluated} predictions correct · precision/recall evaluated against synthetic ground truth
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
