"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { Check, X, GitBranch, ShieldCheck } from "lucide-react";

interface IdentitySequenceProps {
    scrollYProgress: any;
    isVisible: boolean;
}

const hypotheses = [
    { name: "Hypothesis A", title: "₹750 = gateway fee", status: "PASS", confidence: 94, checks: [["Bank reconciles", true], ["Gateway reconciles", true], ["GL reconciles", true]] },
    { name: "Hypothesis B", title: "₹750 = missing payment", status: "FAIL", confidence: 6, checks: [["Bank", false], ["Settlement", false]] },
];

const CounterfactualValidation = ({ visible }: { visible: any }) => (
    <motion.div style={{ opacity: visible }} className="absolute inset-0 z-50 flex items-center justify-center px-5 md:px-10 py-8 pointer-events-none bg-black">
        <div className="w-full max-w-6xl rounded-[32px] border border-white/10 bg-zinc-950 p-6 md:p-10 shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 mb-5"><ShieldCheck className="h-3.5 w-3.5" /> VERITA / 07 · COUNTERFACTUAL VALIDATION</div>
            <h2 className="text-center text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.055em] leading-[0.96] text-white">Counterfactual Validation</h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-sm md:text-lg text-zinc-400"><span className="font-semibold text-zinc-100">This is your killer feature.</span><br />Take each hypothesis and ask: “If this hypothesis were true, would the entire financial graph reconcile?”</p>
            <div className="mt-7 grid gap-4 lg:grid-cols-2">
                {hypotheses.map((hypothesis, index) => (
                    <motion.div key={hypothesis.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + index * 0.12, duration: 0.5 }} className={`rounded-3xl border p-5 ${index === 0 ? "border-emerald-400/25 bg-emerald-400/[0.055]" : "border-red-400/20 bg-red-400/[0.035]"}`}>
                        <div className="flex items-start justify-between gap-4"><div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{hypothesis.name}</div><div className="mt-2 text-xl md:text-2xl font-black text-white">{hypothesis.title}</div></div><div className={`rounded-full px-3 py-1.5 text-xs font-black tracking-wider ${index === 0 ? "bg-emerald-400/15 text-emerald-300" : "bg-red-400/15 text-red-300"}`}>{hypothesis.status}</div></div>
                        <div className="mt-4 space-y-2">{hypothesis.checks.map(([label, passed]) => (<div key={label as string} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3 py-2.5 text-sm"><span className="text-zinc-400">{label as string}</span>{passed ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-red-400" />}</div>))}</div>
                        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500"><span>Causal consistency</span><span className="font-mono font-bold text-zinc-200">{hypothesis.confidence}%</span></div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${hypothesis.confidence}%` }} transition={{ duration: 0.9, delay: 0.2 + index * 0.15 }} className={`h-full rounded-full ${index === 0 ? "bg-emerald-300" : "bg-red-300"}`} /></div>
                    </motion.div>
                ))}
            </div>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold text-zinc-500 mb-3"><GitBranch className="h-3.5 w-3.5" /> Financial graph consistency</div><div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">{["Payment", "Gateway", "Bank", "GL"].map((node, index) => (<React.Fragment key={node}><div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-3 text-center"><div className="text-[9px] uppercase tracking-wider text-zinc-500">Node</div><div className="mt-1 text-xs md:text-sm font-bold text-zinc-200">{node}</div><div className="mt-1 text-[10px] text-emerald-300">reconciles ✓</div></div>{index < 3 && <div className="hidden md:flex items-center justify-center text-emerald-400/50">→</div>}</React.Fragment>))}</div></div>
            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] px-5 py-4"><div><div className="text-[10px] uppercase tracking-[0.18em] font-bold text-violet-300/70">Causally consistent explanation</div><div className="mt-1 text-lg md:text-xl font-black text-white">Gateway fee is the most causally consistent explanation.</div></div><div className="font-mono text-xl font-black text-violet-300">94% consistency</div></div>
        </div>
    </motion.div>
);

export const IdentitySequence = ({ scrollYProgress, isVisible: _isVisible }: IdentitySequenceProps) => {
    const localProgress = useTransform(scrollYProgress, [0.4, 0.85], [0, 1]);
    const counterfactualOpacity = useTransform(localProgress, [0.08, 0.18, 0.36], [0, 1, 1]);
    return <div className="relative w-screen h-full overflow-hidden bg-black"><CounterfactualValidation visible={counterfactualOpacity} /></div>;
};
