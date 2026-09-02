"use client";

import { AlertTriangle, ArrowDown, Check, ChevronRight, CircleDollarSign, GitBranch, ShieldAlert, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type ChainRow = {
  label: string;
  amount: string;
  status: "matched" | "break";
};

const chain: ChainRow[] = [
  { label: "Invoice", amount: "₹50,000", status: "matched" },
  { label: "Payment", amount: "₹50,000", status: "matched" },
  { label: "Gateway", amount: "₹49,250", status: "matched" },
  { label: "Bank", amount: "₹49,250", status: "matched" },
  { label: "GL", amount: "₹50,000", status: "break" },
];

const hypotheses = [
  { label: "Gateway fee", probability: 82, detail: "₹750 equals the expected gateway charge." },
  { label: "Timing difference", probability: 9, detail: "Settlement timing could explain the variance." },
  { label: "FX difference", probability: 6, detail: "Currency conversion evidence is weak." },
  { label: "Data error", probability: 3, detail: "No strong source-record corruption found." },
];

export default function Testimonial1() {
  const [activeHypothesis, setActiveHypothesis] = useState(0);
  const [scanned, setScanned] = useState(false);

  return (
    <section
      id="professional-statistics"
      className="relative min-h-screen w-full overflow-hidden bg-black px-4 py-16 text-white md:px-8 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_42%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-7 flex justify-center">
          <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-xl">
            <span className="relative flex h-2.5 w-2.5">
              <motion.span
                animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-emerald-400"
              />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
            </span>
            Financial Intelligence
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-5xl text-center"
        >
          <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] md:text-6xl lg:text-7xl">
            Find the break.
            <br />
            <span className="text-zinc-500">Explain why it happened.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
            Verita traces every financial record through the chain, detects where the numbers diverge, then ranks evidence-backed root-cause hypotheses.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* STEP 5 */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl md:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  <GitBranch className="h-3.5 w-3.5" /> STEP 05
                </div>
                <h2 className="text-2xl font-black tracking-tight md:text-3xl">Break / Exception Detection</h2>
                <p className="mt-2 text-sm text-zinc-500">Where does the financial chain break?</p>
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-amber-300">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-white/8 bg-black/40 p-4 md:p-5">
              {chain.map((row, index) => (
                <div key={row.label}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center justify-between rounded-xl px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full ${row.status === "break" ? "bg-amber-400/15 text-amber-300" : "bg-emerald-400/10 text-emerald-400"}`}>
                        {row.status === "break" ? <AlertTriangle className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="text-sm font-semibold text-zinc-300">{row.label}</span>
                    </div>
                    <span className={`font-mono text-sm font-bold ${row.status === "break" ? "text-amber-300" : "text-zinc-100"}`}>
                      {row.amount}
                    </span>
                  </motion.div>
                  {index < chain.length - 1 && (
                    <div className="ml-[25px] h-4 border-l border-dashed border-white/15" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300/70">Exception detected</div>
                <div className="mt-1 text-lg font-black">₹750 discrepancy</div>
                <div className="mt-1 text-xs text-zinc-500">Detection only — not resolved</div>
              </div>
              <CircleDollarSign className="h-7 w-7 text-amber-300" />
            </div>

            <button
              type="button"
              onClick={() => setScanned((value) => !value)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-zinc-200 transition hover:bg-white/10"
            >
              {scanned ? "Scan complete · 1 break found" : "Run exception scan"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* STEP 6 */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl md:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  <Sparkles className="h-3.5 w-3.5" /> STEP 06
                </div>
                <h2 className="text-2xl font-black tracking-tight md:text-3xl">Root-Cause Engine</h2>
                <p className="mt-2 text-sm text-zinc-500">What most likely caused the break?</p>
              </div>
              <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-3 text-violet-300">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {hypotheses.map((item, index) => {
                const active = activeHypothesis === index;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveHypothesis(index)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-violet-400/30 bg-violet-400/[0.07]" : "border-white/8 bg-black/30 hover:bg-white/[0.04]"}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-bold text-zinc-200">{item.label}</span>
                      <span className={`font-mono text-sm font-black ${active ? "text-violet-300" : "text-zinc-400"}`}>{item.probability}%</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.probability}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full ${active ? "bg-violet-300" : "bg-zinc-600"}`}
                      />
                    </div>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden text-xs leading-5 text-zinc-500"
                        >
                          <span className="text-zinc-400">Evidence:</span> {item.detail}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-violet-400/15 bg-violet-400/[0.05] p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-300/80">
                <Sparkles className="h-3.5 w-3.5" /> Highest-confidence hypothesis
              </div>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <div className="text-xl font-black">{hypotheses[activeHypothesis].label}</div>
                  <div className="mt-1 text-xs text-zinc-500">Ranked from rules + ML + graph evidence</div>
                </div>
                <div className="font-mono text-2xl font-black text-violet-300">{hypotheses[activeHypothesis].probability}%</div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-600">
              <span>Detect</span><ArrowDown className="h-3 w-3 rotate-[-90deg]" /><span>Trace</span><ArrowDown className="h-3 w-3 rotate-[-90deg]" /><span>Explain</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
