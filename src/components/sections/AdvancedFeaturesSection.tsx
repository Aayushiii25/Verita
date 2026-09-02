"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  Eye,
  FileSearch,
  GitBranch,
  Network,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserCheck,
  XCircle,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  PANEL 1 — Step 8: Break Propagation / Financial Impact Model      */
/* ------------------------------------------------------------------ */
function PanelBreakPropagation() {
  const impacts = [
    { label: "Bank reconciliation", level: "HIGH", color: "text-red-400 border-red-400/30 bg-red-400/[0.08]" },
    { label: "General Ledger", level: "HIGH", color: "text-red-400 border-red-400/30 bg-red-400/[0.08]" },
    { label: "Cash forecast", level: "MEDIUM", color: "text-amber-300 border-amber-400/30 bg-amber-400/[0.06]" },
    { label: "Tax liability", level: "LOW", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/[0.06]" },
  ];

  const metrics = [
    { label: "Monetary exposure", value: "₹12.4L" },
    { label: "Downstream records", value: "47" },
    { label: "Cash impact", value: "₹8.2L" },
    { label: "Forecast impact", value: "−2.1%" },
    { label: "Tax impact", value: "₹0.8L" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mb-4 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
        <Network className="h-3.5 w-3.5" /> VERITA / 08 · BREAK PROPAGATION
      </div>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-[0.95] text-center mb-2">
        Map the blast radius.
      </h2>
      <p className="text-sm md:text-base text-zinc-400 text-center mb-8 max-w-xl mx-auto">
        Once the cause is known, determine every downstream system it affects.
      </p>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Impact Tree */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 font-bold">Impact tree</div>
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-lg border border-amber-400/40 bg-amber-400/[0.1] px-3 py-1.5">
              <span className="text-xs font-bold text-amber-300">₹750 Exception</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">propagates to</span>
          </div>
          <div className="space-y-2 ml-4 border-l border-white/10 pl-4">
            {impacts.map((imp) => (
              <div key={imp.label} className={`flex items-center justify-between rounded-xl border p-3 ${imp.color}`}>
                <span className="text-sm font-medium">{imp.label}</span>
                <span className="text-[10px] font-black uppercase tracking-wider">{imp.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exposure Metrics */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 font-bold">Exposure metrics</div>
          <div className="space-y-3">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
                <span className="text-xs text-zinc-400">{m.label}</span>
                <span className="font-mono text-sm md:text-base font-black text-zinc-100">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PANEL 2 — Step 9: Confidence + Risk Engine                        */
/* ------------------------------------------------------------------ */
function PanelConfidenceRisk() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mb-4 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
        <Shield className="h-3.5 w-3.5" /> VERITA / 09 · CONFIDENCE ENGINE
      </div>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-[0.95] text-center mb-2">
        Should AI act?
      </h2>
      <p className="text-sm md:text-base text-zinc-400 text-center mb-8 max-w-xl mx-auto">
        Decide whether the system auto-resolves or escalates to a human.
      </p>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Auto-resolve scenario */}
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.03] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-5">
            <BadgeCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-300">AUTO RESOLVE</span>
          </div>
          <div className="space-y-3 mb-5">
            {[
              ["Confidence", "99.2%"],
              ["Amount", "₹2,400"],
              ["Counterfactual", "PASS"],
              ["Evidence conflict", "NONE"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">{k}</span>
                <span className="font-mono text-sm font-bold text-emerald-300">{v}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-emerald-400/[0.1] border border-emerald-400/20 p-3 text-center">
            <Check className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Resolved automatically</span>
          </div>
        </div>

        {/* Human-review scenario */}
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.03] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-5">
            <ShieldAlert className="h-5 w-5 text-amber-300" />
            <span className="text-sm font-bold text-amber-300">HUMAN REVIEW</span>
          </div>
          <div className="space-y-3 mb-5">
            {[
              ["Confidence", "81%"],
              ["Amount", "₹8,50,000"],
              ["Counterfactual", "PARTIAL"],
              ["Evidence", "Conflicting"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">{k}</span>
                <span className="font-mono text-sm font-bold text-amber-300">{v}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-amber-400/[0.08] border border-amber-400/20 p-3 text-center">
            <UserCheck className="h-5 w-5 text-amber-300 mx-auto mb-1" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Escalated for review</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PANEL 3 — Step 10: Agent Layer                                     */
/* ------------------------------------------------------------------ */
function PanelAgentLayer() {
  const steps = [
    { icon: Search, label: "Investigate exception" },
    { icon: GitBranch, label: "Query graph" },
    { icon: Eye, label: "Look at evidence" },
    { icon: BrainCircuit, label: "Generate hypotheses" },
    { icon: Sparkles, label: "Run counterfactuals" },
    { icon: Shield, label: "Check risk policy" },
    { icon: Zap, label: "Resolve OR escalate" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mb-4 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
        <Bot className="h-3.5 w-3.5" /> VERITA / 10 · AGENT LAYER
      </div>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-[0.95] text-center mb-2">
        The finance controller.
      </h2>
      <p className="text-sm md:text-base text-zinc-400 text-center mb-8 max-w-xl mx-auto">
        An LLM that reasons over grounded evidence — never hallucinating accounting truth.
      </p>

      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-5 font-bold text-center">Agent workflow</div>
          <div className="space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === steps.length - 1;
              return (
                <React.Fragment key={step.label}>
                  <div className={`flex items-center gap-3 rounded-xl border p-3 ${isLast ? "border-emerald-400/30 bg-emerald-400/[0.06]" : "border-white/10 bg-white/[0.02]"}`}>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isLast ? "bg-emerald-400/20" : "bg-white/[0.06]"}`}>
                      <Icon className={`h-4 w-4 ${isLast ? "text-emerald-400" : "text-zinc-300"}`} />
                    </div>
                    <span className={`text-sm font-semibold ${isLast ? "text-emerald-300" : "text-zinc-200"}`}>{step.label}</span>
                  </div>
                  {!isLast && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="h-3.5 w-3.5 text-zinc-600" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PANEL 4 — Step 11: Explanation / Audit Trail                       */
/* ------------------------------------------------------------------ */
function PanelAuditTrail() {
  const trail = [
    { label: "Exception ID", value: "EXC-2024-0847" },
    { label: "Evidence used", value: "3 sources" },
    { label: "Candidate matches", value: "4 records" },
    { label: "Root cause", value: "Gateway fee" },
    { label: "Confidence", value: "99.2%" },
    { label: "Counterfactual", value: "PASS" },
    { label: "Action taken", value: "Auto-resolved" },
    { label: "Why allowed", value: "Policy §4.2 — low risk" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mb-4 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
        <FileSearch className="h-3.5 w-3.5" /> VERITA / 11 · AUDIT TRAIL
      </div>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-[0.95] text-center mb-2">
        Prove every decision.
      </h2>
      <p className="text-sm md:text-base text-zinc-400 text-center mb-8 max-w-xl mx-auto">
        &ldquo;Why did you reconcile this?&rdquo; — Your system can answer.
      </p>

      <div className="max-w-lg mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 font-bold">Decision trace</div>
          <div className="space-y-0">
            {trail.map((item, i) => (
              <React.Fragment key={item.label}>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400/60" />
                    <span className="text-xs text-zinc-400">{item.label}</span>
                  </div>
                  <span className="font-mono text-xs md:text-sm font-bold text-zinc-100">{item.value}</span>
                </div>
                {i < trail.length - 1 && (
                  <div className="flex justify-start ml-[10px]">
                    <div className="w-px h-3 bg-violet-400/20" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-violet-400/20 bg-violet-400/[0.04] p-3 text-center">
            <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Full audit chain · cryptographically signed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PANEL 5 — Step 12: Benchmark Everything                            */
/* ------------------------------------------------------------------ */
function PanelBenchmark() {
  const rows = [
    ["Records processed", "100"],
    ["Correct matches", "94"],
    ["Match precision", "97.1%"],
    ["Match recall", "95.8%"],
    ["Exceptions detected", "12"],
    ["Correct root causes", "11"],
    ["Auto-resolved", "8"],
    ["Human escalations", "4"],
    ["False auto-resolutions", "0"],
    ["₹ exposure resolved", "96.4%"],
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mb-4 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
        <BarChart3 className="h-3.5 w-3.5" /> VERITA / 12 · BENCHMARK
      </div>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-[0.95] text-center mb-2">
        Prove it at scale.
      </h2>
      <p className="text-sm md:text-base text-zinc-400 text-center mb-8 max-w-xl mx-auto">
        Run the entire batch — not cherry-picked examples.
      </p>

      <div className="max-w-lg mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl overflow-hidden">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 font-bold">100-record batch report</div>
          <div className="space-y-0">
            {rows.map(([metric, result], i) => {
              const isHighlight = metric === "False auto-resolutions" || metric === "₹ exposure resolved";
              const isZero = result === "0";
              return (
                <div
                  key={metric}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${
                    isHighlight
                      ? isZero
                        ? "bg-emerald-400/[0.06] border border-emerald-400/20"
                        : "bg-sky-400/[0.05] border border-sky-400/20"
                      : i % 2 === 0
                      ? "bg-white/[0.02]"
                      : ""
                  }`}
                >
                  <span className="text-xs text-zinc-400">{metric}</span>
                  <span
                    className={`font-mono text-sm font-black ${
                      isZero ? "text-emerald-400" : isHighlight ? "text-sky-300" : "text-zinc-100"
                    }`}
                  >
                    {result}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["Precision", "97.1%", "text-emerald-300"],
              ["Recall", "95.8%", "text-emerald-300"],
              ["₹ Resolved", "96.4%", "text-sky-300"],
            ].map(([label, val, clr]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <div className="text-[9px] font-mono font-bold text-zinc-500 uppercase">{label}</div>
                <div className={`mt-1 text-lg font-black ${clr}`}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN SECTION — Zoom-Scroll with video3.mp4 background             */
/* ================================================================== */
export function AdvancedFeaturesSection({ isReady = false }: { isReady?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);

  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const panel4Ref = useRef<HTMLDivElement>(null);
  const panel5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;

    gsap.registerPlugin(ScrollTrigger);

    const initTimer = setTimeout(() => {
      const ctx = gsap.context(() => {
        if (!sectionRef.current) return;

        const panels = [panel1Ref.current, panel2Ref.current, panel3Ref.current, panel4Ref.current, panel5Ref.current];

        // All panels start hidden off-screen right, except the first
        gsap.set(panels, { x: "100vw", opacity: 0, zIndex: 10 });
        gsap.set(panel1Ref.current, { x: 0, opacity: 1, zIndex: 10 });

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=6000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Subtle progressive zoom on the video background (1 → 1.35 total)
        masterTl.to(videoBgRef.current, { scale: 1.35, ease: "none", duration: 4 }, 0);
        // Progressive darkening
        masterTl.to(darkOverlayRef.current, { opacity: 0.85, ease: "none", duration: 4 }, 0);

        // 5 panels → 4 transitions, each at equal intervals
        const transitions = [
          [panel1Ref.current, panel2Ref.current, 0.6],
          [panel2Ref.current, panel3Ref.current, 1.4],
          [panel3Ref.current, panel4Ref.current, 2.2],
          [panel4Ref.current, panel5Ref.current, 3.0],
        ] as const;

        transitions.forEach(([current, next, at]) => {
          masterTl
            .to(current, { x: "-100vw", opacity: 0, ease: "none", duration: 0.28 }, at)
            .to(next, { x: 0, opacity: 1, ease: "none", duration: 0.28 }, at + 0.02);
        });
      }, sectionRef);

      (sectionRef.current as any).__gsapCtx = ctx;
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, 500);

    return () => {
      clearTimeout(initTimer);
      if (sectionRef.current && (sectionRef.current as any).__gsapCtx) {
        (sectionRef.current as any).__gsapCtx.revert();
      }
    };
  }, [isReady]);

  return (
    <div ref={sectionRef} className="relative h-screen w-full bg-black text-white overflow-hidden">
      {/* Video background */}
      <div ref={videoBgRef} className="absolute inset-0 z-0 w-full h-full will-change-transform">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-70">
          <source src="/video3.mp4" type="video/mp4" />
          <track kind="captions" />
        </video>
        <div ref={darkOverlayRef} className="absolute inset-0 bg-black/60 opacity-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_#444_0.5px,_transparent_0.5px)] opacity-15 [background-size:28px_28px] pointer-events-none" />
      </div>

      {/* PANEL 1 — Break Propagation */}
      <div
        ref={panel1Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full px-4 will-change-transform overflow-y-auto"
      >
        <PanelBreakPropagation />
      </div>

      {/* PANEL 2 — Confidence + Risk Engine */}
      <div
        ref={panel2Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full px-4 will-change-transform overflow-y-auto"
      >
        <PanelConfidenceRisk />
      </div>

      {/* PANEL 3 — Agent Layer */}
      <div
        ref={panel3Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full px-4 will-change-transform overflow-y-auto"
      >
        <PanelAgentLayer />
      </div>

      {/* PANEL 4 — Audit Trail */}
      <div
        ref={panel4Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full px-4 will-change-transform overflow-y-auto"
      >
        <PanelAuditTrail />
      </div>

      {/* PANEL 5 — Benchmark */}
      <div
        ref={panel5Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full px-4 will-change-transform overflow-y-auto"
      >
        <PanelBenchmark />
      </div>
    </div>
  );
}
