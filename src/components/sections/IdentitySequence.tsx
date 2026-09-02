"use client";

import React from "react";
import { motion, useTransform, useMotionValueEvent, easeInOut } from "framer-motion";
import { ArrowUpRight, Check, X, GitBranch, ShieldCheck } from "lucide-react";
import MagneticEffect from "@/components/ui/MagneticEffect";

interface IdentitySequenceProps {
    scrollYProgress: any;
    isVisible: boolean;
}

const hypotheses = [
    {
        name: "Hypothesis A",
        title: "₹750 = gateway fee",
        status: "PASS",
        confidence: 94,
        checks: [
            ["Bank reconciles", true],
            ["Gateway reconciles", true],
            ["GL reconciles", true],
        ],
    },
    {
        name: "Hypothesis B",
        title: "₹750 = missing payment",
        status: "FAIL",
        confidence: 6,
        checks: [
            ["Bank", false],
            ["Settlement", false],
        ],
    },
];

export const IdentitySequence = ({ scrollYProgress }: IdentitySequenceProps) => {
    const [isTextAnimated, setIsTextAnimated] = React.useState(false);
    const localProgress = useTransform(scrollYProgress, [0.4, 0.85], [0, 1]);

    const phase0Opacity = useTransform(localProgress, [0, 0.18], [1, 0]);
    const validationOpacity = useTransform(localProgress, [0.12, 0.32], [0, 1]);
    const validationY = useTransform(localProgress, [0.12, 0.32], [60, 0]);
    const graphProgress = useTransform(localProgress, [0.28, 0.72], [0, 1]);
    const resultOpacity = useTransform(localProgress, [0.68, 0.88], [0, 1]);

    useMotionValueEvent(localProgress, "change", (latest) => {
        if (latest > 0.7) setIsTextAnimated(true);
    });

    return (
        <div className="relative w-screen h-full flex flex-col items-center justify-center overflow-hidden bg-background dark:bg-black">
            {/* CTA / entry screen */}
            <motion.div
                style={{ opacity: phase0Opacity }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none -translate-y-12"
            >
                <div className="mb-16 pointer-events-auto">
                    <MagneticEffect>
                        <div className="group flex items-center gap-2 cursor-pointer">
                            <div className="relative px-10 py-5 rounded-full bg-black dark:bg-white group-hover:bg-[#c1e44a] dark:group-hover:bg-[#c1e44a] overflow-hidden transition-all duration-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(193,228,74,0.3)]">
                                <div className="relative z-10 h-7 overflow-hidden">
                                    <div className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1/2">
                                        <span className="text-white dark:text-black group-hover:text-black font-bold text-xl leading-7 transition-colors duration-500">
                                            Counterfactual Validation
                                        </span>
                                        <span className="text-black font-bold text-xl leading-7 transition-colors duration-500">
                                            Counterfactual Validation
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-16 h-16 rounded-full bg-black dark:bg-white group-hover:bg-[#c1e44a] dark:group-hover:bg-[#c1e44a] overflow-hidden flex items-center justify-center transition-all duration-500 shadow-lg">
                                <div className="relative z-10 h-8 overflow-hidden">
                                    <div className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1/2">
                                        <ArrowUpRight className="w-8 h-8 text-white dark:text-black group-hover:text-black" />
                                        <ArrowUpRight className="w-8 h-8 text-black" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MagneticEffect>
                </div>

                <div className="w-full max-w-[1200px] flex items-center justify-between px-12">
                    <div className="flex items-center gap-3 text-zinc-500 dark:text-white/60 text-sm font-medium tracking-tight">
                        <motion.span
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-4 h-4 flex items-center justify-center"
                        >
                            ↓
                        </motion.span>
                        <span>Scroll to validate</span>
                    </div>
                    <div className="text-zinc-500 dark:text-white/60 text-sm font-medium tracking-tight">Counterfactual Engine</div>
                </div>
            </motion.div>

            {/* Counterfactual Validation screen */}
            <motion.div
                style={{ opacity: validationOpacity, y: validationY }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 md:px-10 py-10"
            >
                <div className="w-full max-w-6xl">
                    <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 mb-4">
                        <ShieldCheck className="h-3.5 w-3.5" /> VERITA / 08 · COUNTERFACTUAL VALIDATION
                    </div>

                    <h2 className="text-center text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.055em] leading-[0.96] text-foreground">
                        Test the explanation.
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-center text-sm md:text-lg text-muted-foreground">
                        If this hypothesis were true, would the entire financial graph reconcile?
                    </p>

                    <div className="mt-8 grid gap-4 lg:grid-cols-2">
                        {hypotheses.map((hypothesis, index) => (
                            <motion.div
                                key={hypothesis.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isTextAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className={`rounded-3xl border p-5 md:p-6 backdrop-blur-xl ${index === 0 ? "border-emerald-400/25 bg-emerald-400/[0.05]" : "border-red-400/20 bg-red-400/[0.035]"}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{hypothesis.name}</div>
                                        <div className="mt-2 text-xl md:text-2xl font-black">{hypothesis.title}</div>
                                    </div>
                                    <div className={`rounded-full px-3 py-1.5 text-xs font-black tracking-wider ${index === 0 ? "bg-emerald-400/15 text-emerald-300" : "bg-red-400/15 text-red-300"}`}>
                                        {hypothesis.status}
                                    </div>
                                </div>

                                <div className="mt-5 space-y-2.5">
                                    {hypothesis.checks.map(([label, passed]) => (
                                        <div key={label} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-2.5 text-sm">
                                            <span className="text-zinc-400">{label}</span>
                                            {passed ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-red-400" />}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
                                    <span>Causal consistency</span>
                                    <span className="font-mono font-bold text-zinc-200">{hypothesis.confidence}%</span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={isTextAnimated ? { width: `${hypothesis.confidence}%` } : { width: 0 }}
                                        transition={{ duration: 0.9, delay: index * 0.2 }}
                                        className={`h-full rounded-full ${index === 0 ? "bg-emerald-300" : "bg-red-300"}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Graph evidence */}
                    <motion.div
                        style={{ opacity: graphProgress }}
                        className="mt-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4 md:p-5"
                    >
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold text-zinc-500 mb-4">
                            <GitBranch className="h-3.5 w-3.5" /> Graph consistency trace
                        </div>
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            {["Payment", "Gateway", "Bank", "GL"].map((node, index) => (
                                <React.Fragment key={node}>
                                    <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-3 text-center">
                                        <div className="text-[9px] uppercase tracking-wider text-zinc-500">Node</div>
                                        <div className="mt-1 text-xs md:text-sm font-bold text-zinc-200">{node}</div>
                                        <div className="mt-1 text-[10px] text-emerald-300">reconciles ✓</div>
                                    </div>
                                    {index < 3 && <div className="hidden md:flex items-center justify-center text-emerald-400/50">→</div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ opacity: resultOpacity }}
                        className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] px-5 py-4"
                    >
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-violet-300/70">Causally consistent explanation</div>
                            <div className="mt-1 text-lg md:text-xl font-black">Gateway fee is the strongest explanation.</div>
                        </div>
                        <div className="font-mono text-xl font-black text-violet-300">94% consistency</div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};
