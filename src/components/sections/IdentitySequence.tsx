"use client";

import React, { useRef } from "react";
import { motion, useTransform, useSpring, easeOut, easeInOut, circOut, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { portfolioData } from "@/data/portfolio";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { BrandScroller, BrandScrollerReverse } from "@/components/ui/brand-scroller";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Check, X, GitBranch, ShieldCheck } from "lucide-react";
import MagneticEffect from "@/components/ui/MagneticEffect";

const BlurInUpText = ({ text, animate }: { text: string; animate: boolean }) => {
    const words = text.split(" ");
    return (
        <motion.span initial="hidden" animate={animate ? "visible" : "hidden"} transition={{ staggerChildren: 0.01 }} aria-label={text}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-pre">
                    {word.split("").map((char, charIndex) => (
                        <motion.span key={charIndex} variants={{
                            hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0, duration: 0.5 } }
                        }} className="inline-block" style={{ willChange: "filter, opacity, transform" }}>
                            {char}
                        </motion.span>
                    ))}
                    {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
            ))}
        </motion.span>
    );
};

interface IdentitySequenceProps {
    scrollYProgress: any;
    isVisible: boolean;
}

const hypotheses = [
    { name: "Hypothesis A", title: "₹750 = gateway fee", status: "PASS", confidence: 94, checks: [["Bank reconciles", true], ["Gateway reconciles", true], ["GL reconciles", true]] },
    { name: "Hypothesis B", title: "₹750 = missing payment", status: "FAIL", confidence: 6, checks: [["Bank", false], ["Settlement", false]] },
];

const CounterfactualValidation = ({ visible }: { visible: any }) => {
    return (
        <motion.div style={{ opacity: visible }} className="absolute inset-0 z-30 flex items-center justify-center px-6 md:px-10 py-10 pointer-events-none overflow-y-auto">
            <div className="w-full max-w-6xl rounded-[32px] border border-white/10 bg-black/90 dark:bg-black/90 backdrop-blur-2xl shadow-2xl p-6 md:p-10 pointer-events-auto my-6">
                <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 mb-4"><ShieldCheck className="h-3.5 w-3.5" /> VERITA / 07–08 · CAUSAL VALIDATION</div>
                <h2 className="text-center text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.055em] leading-[0.96] text-white">Test the explanation.</h2>
                <p className="mx-auto mt-4 max-w-3xl text-center text-sm md:text-lg text-zinc-400"><span className="font-semibold text-zinc-200">This is your killer feature.</span><br />Take each hypothesis and ask: “If this hypothesis were true, would the entire financial graph reconcile?”</p>

                <section className="mt-7" aria-label="Step 7 Counterfactual Validation">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">STEP 7 · COUNTERFACTUAL VALIDATION</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-violet-300/70">Hypothesis testing</div>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
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
                </section>

                <section className="mt-8 pt-7 border-t border-white/10" aria-label="Step 8 Break Propagation and Financial Impact Model">
                    <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">STEP 8 · BREAK PROPAGATION / FINANCIAL IMPACT MODEL</div>
                            <h3 className="mt-2 text-2xl md:text-4xl font-black tracking-tight text-white">Once you know the cause, determine what else this break affects.</h3>
                        </div>
                        <div className="rounded-full border border-violet-400/20 bg-violet-400/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">Impact propagation</div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            ["Bank reconciliation", "HIGH", "Direct break"],
                            ["GL", "HIGH", "Ledger impact"],
                            ["Cash forecast", "MEDIUM", "Liquidity signal"],
                            ["Tax", "LOW", "Indirect impact"],
                        ].map(([label, level, detail], index) => (
                            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + index * 0.08, duration: 0.45 }} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                <div className="text-xs font-bold text-zinc-300">{label}</div>
                                <div className={`mt-3 text-lg font-black ${level === "HIGH" ? "text-red-300" : level === "MEDIUM" ? "text-amber-300" : "text-zinc-300"}`}>{level}</div>
                                <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-zinc-600">{detail}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {[
                            ["Monetary exposure", "₹750"],
                            ["Downstream records affected", "4"],
                            ["Cash impact", "₹750"],
                            ["Forecast impact", "MEDIUM"],
                            ["Tax impact", "LOW"],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                                <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">{label}</div>
                                <div className="mt-1 text-base md:text-lg font-black text-zinc-100">{value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                        <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-zinc-500 mb-4">Break propagation map</div>
                        <div className="grid gap-3 md:grid-cols-[1fr_auto_2fr] items-center">
                            <div className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-4 text-center">
                                <div className="text-[9px] uppercase tracking-wider text-violet-300/70">Exception</div>
                                <div className="mt-1 text-lg font-black text-white">₹750 gateway fee</div>
                            </div>
                            <div className="hidden md:block text-xl text-zinc-600">→</div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-xl border border-red-400/15 bg-red-400/[0.035] px-3 py-2"><div className="text-xs font-bold text-zinc-300">Bank reconciliation</div><div className="text-[10px] text-red-300">HIGH</div></div>
                                <div className="rounded-xl border border-red-400/15 bg-red-400/[0.035] px-3 py-2"><div className="text-xs font-bold text-zinc-300">GL</div><div className="text-[10px] text-red-300">HIGH</div></div>
                                <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.03] px-3 py-2"><div className="text-xs font-bold text-zinc-300">Cash forecast</div><div className="text-[10px] text-amber-300">MEDIUM</div></div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2"><div className="text-xs font-bold text-zinc-300">Tax</div><div className="text-[10px] text-zinc-400">LOW</div></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export const IdentitySequence = ({ scrollYProgress, isVisible }: IdentitySequenceProps) => {
    const t = useTranslations("about");
    const [isHovered, setIsHovered] = React.useState(false);
    const [isTextAnimated, setIsTextAnimated] = React.useState(false);
    const localProgress = useTransform(scrollYProgress, [0.4, 0.85], [0, 1]);
    const cardScale = useTransform(localProgress, [0, 0.4], [0.8, 1], { ease: easeInOut });
    const cardY = useTransform(localProgress, [0, 0.4], ["60vh", "0vh"], { ease: easeInOut });
    const cardBorderRadius = useTransform(localProgress, [0.1, 0.4], ["60px", "0px"], { ease: easeInOut });
    const contentY = useTransform(localProgress, [0.35, 1], ["0%", "-70%"], { ease: easeInOut });
    const imageParallaxY = useTransform(localProgress, [0.35, 1], ["-10%", "10%"], { ease: easeInOut });
    const phase0Opacity = useTransform(localProgress, [0, 0.15], [1, 0]);
    const cardContentOpacity = useTransform(localProgress, [0.1, 0.3], [0, 1]);
    const photoScale = useTransform(localProgress, [0.3, 0.8], [1.15, 1], { ease: easeInOut });
    const textOpacity = useTransform(localProgress, [0.85, 1], [0, 1]);
    const counterfactualOpacity = useTransform(localProgress, [0.13, 0.34, 0.42], [0, 1, 0]);
    useMotionValueEvent(localProgress, "change", (latest) => { if (latest > 0.85 && !isTextAnimated) setIsTextAnimated(true); });
    const cardBg = useTransform(localProgress, [0.8, 1], ["#EBEBEB", "#FFFFFF"]);
    const cardBgDark = useTransform(localProgress, [0.8, 1], ["#18181b", "#000000"]);
    const { resolvedTheme } = useTheme();
    const cardBgValue = resolvedTheme === 'dark' ? cardBgDark : cardBg;
    const vaultGradientDown = useTransform(cardBgValue, (color: string) => `linear-gradient(to bottom, ${color}, ${color}00)`);
    const vaultGradientUp = useTransform(cardBgValue, (color: string) => `linear-gradient(to top, ${color}, ${color}00)`);
    const marqueeItems = [<span key="1" className="text-[10rem] md:text-[16rem] font-black uppercase tracking-tighter mx-12 text-black dark:text-white leading-none">{portfolioData.personal.title}</span>, <div key="icon" className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#D1FF4D] flex items-center justify-center mx-12"><svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32 fill-black dark:fill-zinc-900"><path d="M50 0 C60 30 100 40 100 50 C100 60 60 70 50 100 C40 70 0 60 0 50 C0 40 40 30 50 0" /></svg></div>];
    return (
        <div className="relative w-screen h-full flex flex-col items-center justify-center overflow-hidden bg-background dark:bg-black">
            <motion.div style={{ opacity: phase0Opacity }} className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none -translate-y-12">
                <div className="mb-16 pointer-events-auto"><MagneticEffect><div className="group flex items-center gap-2 cursor-pointer"><div className="relative px-10 py-5 rounded-full bg-black dark:bg-white group-hover:bg-[#c1e44a] dark:group-hover:bg-[#c1e44a] overflow-hidden transition-all duration-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(193,228,74,0.3)]"><div className="relative z-10 h-7 overflow-hidden"><div className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1/2"><span className="text-white dark:text-black group-hover:text-black font-bold text-xl leading-7 transition-colors duration-500">Counterfactual Validation</span><span className="text-black font-bold text-xl leading-7 transition-colors duration-500">Counterfactual Validation</span></div></div></div><div className="relative w-16 h-16 rounded-full bg-black dark:bg-white group-hover:bg-[#c1e44a] dark:group-hover:bg-[#c1e44a] overflow-hidden flex items-center justify-center transition-all duration-500 shadow-lg"><div className="relative z-10 h-8 overflow-hidden"><div className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1/2"><ArrowUpRight className="w-8 h-8 text-white dark:text-black group-hover:text-black transition-colors duration-500" /><ArrowUpRight className="w-8 h-8 text-black transition-colors duration-500" /></div></div></div></div></MagneticEffect></div>
                <div className="w-full max-w-[1200px] flex items-center justify-between px-12"><div className="flex items-center gap-3 text-zinc-500 dark:text-white/60 text-sm font-medium tracking-tight"><motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-4 h-4 flex items-center justify-center">↓</motion.span><span>{t("leadIn.scroll")}</span></div><div className="text-zinc-500 dark:text-white/60 text-sm font-medium tracking-tight">{t("leadIn.shortStory")}</div></div>
            </motion.div>
            <motion.div style={{ scale: cardScale, y: cardY, borderRadius: cardBorderRadius, backgroundColor: cardBgValue, willChange: "transform, background-color" }} className="relative w-full h-full flex flex-col overflow-hidden origin-bottom z-10">
                <motion.div style={{ y: contentY }} className="relative w-full flex flex-col items-center">
                    <div className="w-full h-screen flex items-center justify-center flex-shrink-0"><motion.div style={{ opacity: cardContentOpacity }} className="w-full"><InfiniteMarquee items={marqueeItems} speed={18} className="w-full" itemClassName="py-12" /></motion.div></div>
                    <div className="relative w-full h-[100vh] flex flex-col items-center flex-shrink-0 px-4 md:px-10 lg:px-20"><div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative w-full h-full max-w-[1500px] group/photo cursor-pointer"><div className="absolute inset-0 overflow-hidden"><motion.div style={{ scale: photoScale }} animate={{ filter: isHovered ? "grayscale(0%) contrast(1)" : "grayscale(100%) contrast(1.1)" }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative w-full h-full"><div className="absolute inset-0"><div className="absolute w-[calc(100%+100px)] h-[130vh] -top-[15vh] -left-[50px]"><motion.div className="relative h-full w-full" style={{ y: imageParallaxY }}><Image src={portfolioData.personal.avatar} alt="Profile" fill className="object-cover object-bottom grayscale-0" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw" priority /></motion.div></div></div></motion.div></div><div className="absolute inset-0 pointer-events-none z-20"><motion.div style={{ backgroundColor: cardBgValue }} className="absolute -top-px left-0 w-full h-[52px]" /><motion.div style={{ background: vaultGradientDown }} className="absolute top-[50px] left-0 w-full h-32" /><motion.div style={{ backgroundColor: cardBgValue }} className="absolute -bottom-px left-0 w-full h-[52px]" /><motion.div style={{ background: vaultGradientUp }} className="absolute bottom-[50px] left-0 w-full h-32" /></div></div></div>
                    <motion.div style={{ opacity: textOpacity }} className="w-full max-w-[1700px] mx-auto px-8 md:px-16 lg:px-24 pt-24 pb-8 md:pt-32 md:pb-12 flex-shrink-0"><div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start"><div className="md:col-span-7"><h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-black dark:text-white" dangerouslySetInnerHTML={{ __html: t.raw("profile.title") }} /></div><div className="md:col-span-5 pt-1"><p className="text-[13px] md:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal"><BlurInUpText text={`${t("profile.narrative")} ${t("profile.narrative2")}`} animate={isTextAnimated} /></p></div></div></motion.div>
                    <motion.div style={{ opacity: textOpacity }} className="w-full max-w-[1700px] mx-auto py-20 flex flex-col gap-8 flex-shrink-0"><div className="px-8 md:px-16 lg:px-24 mb-6"><h4 className="text-lg md:text-xl uppercase tracking-[0.15em] font-bold text-zinc-500 dark:text-zinc-400">Tech Stack & Ecosystem</h4></div><BrandScroller /><BrandScrollerReverse /></motion.div>
                </motion.div>
            </motion.div>
            <CounterfactualValidation visible={counterfactualOpacity} />
        </div>
    );
};
