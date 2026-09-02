"use client";

import { motion } from "framer-motion";
import { BrainCircuit, CheckCircle2, GitBranch, Sparkles } from "lucide-react";

const causes = [
  { label: "Gateway fee", value: 82, color: "bg-emerald-400", text: "text-emerald-300", active: true },
  { label: "Timing difference", value: 9, color: "bg-amber-300", text: "text-amber-200", active: false },
  { label: "FX difference", value: 6, color: "bg-sky-300", text: "text-sky-200", active: false },
  { label: "Data error", value: 3, color: "bg-zinc-500", text: "text-zinc-300", active: false },
];

export default function Testimonial1() {
  return (
    <section className="relative w-full h-full min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-5 md:px-10 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[12%] top-[18%] w-72 h-72 rounded-full bg-emerald-400/[0.035] blur-3xl" />
        <div className="absolute right-[10%] bottom-[12%] w-80 h-80 rounded-full bg-violet-400/[0.035] blur-3xl" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.035]" />
      </div>

      <div className="relative w-full max-w-[1450px] min-h-[82vh] rounded-[34px] border border-white/10 bg-zinc-950/95 overflow-hidden flex flex-col justify-center shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="relative z-10 px-6 md:px-12 lg:px-20 py-10 md:py-14">
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.25em] text-zinc-500">
              <BrainCircuit className="w-4 h-4 text-emerald-300" />
              VERITA / 06 · CAUSAL INFERENCE
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Hypothesis engine active
            </div>
          </div>

          <div className="grid lg:grid-cols-[0.95fr_1.25fr] gap-10 lg:gap-20 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[10px] uppercase tracking-[0.25em] font-bold text-emerald-300/70 mb-4">
                STEP 6 — ROOT-CAUSE / CAUSAL HYPOTHESIS ENGINE
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7 }} className="text-5xl md:text-6xl lg:text-7xl xl:text-[82px] font-black tracking-[-0.055em] leading-[0.92]">
                Find the cause.<br />
                <span className="text-zinc-500">Not just the break.</span>
              </motion.h2>
              <p className="mt-7 max-w-xl text-sm md:text-base lg:text-lg leading-relaxed text-zinc-400">
                For every break, generate possible explanations and rank them using evidence from the financial graph.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  [Sparkles, "ML scoring"],
                  [CheckCircle2, "Financial rules"],
                  [GitBranch, "Graph evidence"],
                ].map(([Icon, label]) => (
                  <div key={label as string} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-xs text-zinc-400">
                    {(() => { const I = Icon as typeof Sparkles; return <I className="w-3.5 h-3.5 text-zinc-300" />; })()}
                    {label as string}
                  </div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.7 }} className="rounded-[28px] border border-white/10 bg-black/50 p-5 md:p-7">
              <div className="flex items-end justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Exception detected</div>
                  <div className="mt-2 text-3xl md:text-4xl font-black tracking-tight">₹750 discrepancy</div>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500">4 hypotheses</div>
              </div>

              <div className="mt-6 space-y-4">
                {causes.map((cause, index) => (
                  <motion.div key={cause.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + index * 0.09, duration: 0.5 }}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${cause.color} ${cause.active ? "shadow-[0_0_12px_rgba(52,211,153,0.65)]" : ""}`} />
                        <span className={`text-sm md:text-base font-semibold truncate ${cause.active ? "text-white" : "text-zinc-400"}`}>{cause.label}</span>
                        {cause.active && <span className="hidden sm:inline text-[9px] uppercase tracking-[0.16em] text-emerald-300/70">top hypothesis</span>}
                      </div>
                      <span className={`font-mono text-sm md:text-base font-bold ${cause.text}`}>{cause.value}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${cause.value}%` }} transition={{ delay: 0.35 + index * 0.09, duration: 0.9, ease: "easeOut" }} className={`h-full rounded-full ${cause.color} ${cause.active ? "shadow-[0_0_16px_rgba(52,211,153,0.25)]" : "opacity-60"}`} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2">
                {[
                  ["ML", "Prior"],
                  ["RULES", "Constraints"],
                  ["GRAPH", "Evidence"],
                ].map(([title, detail]) => (
                  <div key={title} className="rounded-xl border border-white/10 bg-white/[0.025] p-3 text-center">
                    <div className="text-[10px] font-mono font-bold text-zinc-300">{title}</div>
                    <div className="mt-1 text-[9px] uppercase tracking-wider text-zinc-600">{detail}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.045] px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-emerald-300/60">Highest-ranked explanation</div>
                  <div className="mt-1 text-sm font-bold text-white">Gateway fee</div>
                </div>
                <div className="text-2xl font-black text-emerald-300">82%</div>
              </div>
            </motion.div>
          </div>

          <div className="mt-10 pt-5 border-t border-white/[0.07] flex flex-col md:flex-row md:items-center justify-between gap-3 text-[10px] md:text-xs uppercase tracking-[0.18em] text-zinc-600">
            <span>ML + financial rules + graph evidence</span>
            <span>Exception → hypotheses → ranked cause</span>
          </div>
        </div>
      </div>
    </section>
  );
}
