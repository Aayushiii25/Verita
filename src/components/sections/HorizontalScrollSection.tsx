"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Spotlight } from "@/components/ui/spotlight-new";
import DemoRunner from "@/components/demo/DemoRunner";
import dynamic from "next/dynamic";
import { TechnicalDetailsModal } from "@/components/demo/TechnicalDetailsModal";
import { useLenis } from "lenis/react";
import { AlertTriangle, ArrowRight, Check, GitBranch, Sparkles } from "lucide-react";

const FinancialGraph = dynamic(() => import("@/components/demo/FinancialGraph"), {
  ssr: false,
  loading: () => (
    <div className="text-sm font-mono text-gray-500 animate-pulse p-12 text-center">
      Loading financial graph...
    </div>
  ),
});

const chain = [
  ["Invoice", "₹50,000", true],
  ["Payment", "₹50,000", true],
  ["Gateway", "₹49,250", true],
  ["Bank", "₹49,250", true],
  ["GL", "₹50,000", false],
] as const;

const hypotheses = [
  ["Gateway fee", 82, "₹750 matches the expected gateway charge."],
  ["Timing difference", 9, "Settlement timing may explain the variance."],
  ["FX difference", 6, "Currency conversion evidence is weak."],
  ["Data error", 3, "No strong source-record corruption found."],
] as const;

export function HorizontalScrollSection({ isReady = false }: { isReady?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

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

        gsap.set(panels, { x: "100vw", opacity: 0, zIndex: 10 });
        gsap.set(panel1Ref.current, { x: 0, opacity: 1, zIndex: 10 });

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=5000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        masterTl
          .to(videoBgRef.current, { scale: 1.25, ease: "none" }, 0)
          .to(darkOverlayRef.current, { opacity: 0.78, ease: "none" }, 0);

        // Panel transitions are deliberately sequenced with a full exit before the next panel enters.
        const transitions = [
          [panel1Ref.current, panel2Ref.current, 0.8],
          [panel2Ref.current, panel3Ref.current, 1.8],
          [panel3Ref.current, panel4Ref.current, 2.8],
          [panel4Ref.current, panel5Ref.current, 3.8],
        ] as const;

        transitions.forEach(([current, next, at]) => {
          masterTl
            .to(current, { x: "-100vw", opacity: 0, ease: "none", duration: 0.28 }, at)
            .to(next, { x: 0, opacity: 1, ease: "none", duration: 0.28 }, at + 0.02);
        });

        masterTl.to(videoBgRef.current, { scale: 1.65, ease: "none", duration: 1 }, 3.8);
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

  const scrollForward = (amount = 1) => {
    const delta = window.innerHeight * amount;
    if (lenis) lenis.scrollTo(window.scrollY + delta);
    else window.scrollBy({ top: delta, behavior: "smooth" });
  };

  return (
    <div ref={sectionRef} className="relative h-screen w-full bg-black text-foreground overflow-hidden">
      <div ref={videoBgRef} className="absolute inset-0 z-0 w-full h-full will-change-transform">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-60">
          <source src="/video2.mp4" type="video/mp4" />
          <track kind="captions" />
        </video>
        <div ref={darkOverlayRef} className="absolute inset-0 bg-black/70 opacity-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_#888_0.5px,_transparent_0.5px)] dark:bg-[radial-gradient(circle,_#444_0.5px,_transparent_0.5px)] opacity-20 [background-size:24px_24px] pointer-events-none" />
      </div>

      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        <Spotlight
          duration={10}
          xOffset={120}
          translateY={-300}
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 100%, .15) 0, hsla(0, 0%, 100%, .05) 50%, transparent 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .1) 0, hsla(0, 0%, 100%, .02) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .08) 0, hsla(0, 0%, 100%, 0) 80%, transparent 100%)"
        />
      </div>

      {/* PANEL 1 — Intro */}
      <div ref={panel1Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center w-full px-6 will-change-transform bg-black/10">
        <div className="absolute top-8 right-8 z-50"><TechnicalDetailsModal /></div>
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-6 drop-shadow-md">VERITA / 03</p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] text-foreground uppercase mb-8" style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}>
          THE NEXT PHASE<br />OF VERIFICATION.
        </h2>
        <p className="text-base md:text-xl lg:text-2xl text-muted-foreground tracking-wide font-light leading-relaxed max-w-3xl mb-8">
          Scroll down or click the button below to journey through our advanced reconciliation process.
        </p>
        <button onClick={() => scrollForward(1.5)} className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
          View ML Record Linking Model <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* PANEL 2 — ML Record Linking */}
      <div ref={panel2Ref} className="absolute inset-0 z-10 flex flex-col items-center w-full px-6 pt-20 pb-10 will-change-transform overflow-hidden bg-black/10">
        <div className="absolute top-8 right-8 z-50"><TechnicalDetailsModal /></div>
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-2">VERITA / 04</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.1] text-foreground uppercase mb-6 text-center" style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}>
          ML RECORD LINKING MODEL
        </h2>
        <div className="flex justify-center mb-6">
          <button onClick={() => scrollForward(1.5)} className="px-6 py-2 bg-primary/20 hover:bg-primary/40 text-primary-foreground border border-primary/50 font-semibold rounded-full transition-colors flex items-center gap-2 text-sm z-50">
            Proceed to Temporal Financial Graph <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="w-full max-w-6xl bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border relative z-40">
          <DemoRunner onReset={() => window.location.reload()} />
        </div>
      </div>

      {/* PANEL 3 — Temporal Graph */}
      <div ref={panel3Ref} className="absolute inset-0 z-10 flex flex-col items-center w-full px-6 pt-20 pb-10 will-change-transform overflow-hidden bg-black/10">
        <div className="absolute top-8 right-8 z-50"><TechnicalDetailsModal /></div>
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-2">VERITA / 05</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.1] text-foreground uppercase mb-6 text-center" style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}>
          TEMPORAL FINANCIAL GRAPH
        </h2>
        <div className="w-full max-w-6xl bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border mt-4">
          <FinancialGraph />
        </div>
      </div>

      {/* PANEL 4 — Break / Exception Detection */}
      <div ref={panel4Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full px-5 md:px-8 will-change-transform overflow-hidden bg-black">
        <div className="absolute top-8 right-8 z-50"><TechnicalDetailsModal /></div>
        <div className="w-full max-w-6xl">
          <div className="mb-5 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
            <GitBranch className="h-3.5 w-3.5" /> VERITA / 06 · BREAK DETECTION
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.055em] leading-[0.98]">
              Find the break.
            </h2>
            <p className="mt-3 text-sm md:text-lg text-zinc-400">Trace the chain. Detect the exception.</p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.045] p-4 md:p-6 backdrop-blur-xl">
            <div className="grid gap-2 md:grid-cols-5">
              {chain.map(([label, amount, matched], index) => (
                <React.Fragment key={label}>
                  <div className={`rounded-2xl border p-4 ${matched ? "border-white/10 bg-white/[0.035]" : "border-amber-400/30 bg-amber-400/[0.08]"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</span>
                      {matched ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />}
                    </div>
                    <div className={`mt-3 font-mono text-lg md:text-xl font-black ${matched ? "text-zinc-100" : "text-amber-300"}`}>{amount}</div>
                  </div>
                  {index < chain.length - 1 && <div className="hidden md:flex items-center justify-center text-zinc-600"><ArrowRight className="h-4 w-4" /></div>}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-5 py-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-amber-300/70">Exception detected</div>
                <div className="mt-1 text-xl md:text-2xl font-black">₹750 discrepancy</div>
              </div>
              <div className="text-xs md:text-sm text-zinc-500">Detection only · not resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 5 — Root Cause / Causal Hypothesis */}
      <div ref={panel5Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full px-5 md:px-8 will-change-transform overflow-hidden bg-black">
        <div className="absolute top-8 right-8 z-50"><TechnicalDetailsModal /></div>
        <div className="w-full max-w-5xl">
          <div className="mb-5 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
            <Sparkles className="h-3.5 w-3.5" /> VERITA / 07 · CAUSAL HYPOTHESIS ENGINE
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.055em] leading-[0.98]">
              Explain why it happened.
            </h2>
            <p className="mt-3 text-sm md:text-lg text-zinc-400">Rank possible causes using rules, ML, and graph evidence.</p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.045] p-5 md:p-7 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Detected exception</div>
                <div className="mt-1 font-mono text-lg font-black text-amber-300">₹750 variance</div>
              </div>
              <div className="text-xs text-zinc-500">4 hypotheses ranked</div>
            </div>
            <div className="space-y-4">
              {hypotheses.map(([label, probability, evidence], index) => (
                <div key={label} className="group">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${index === 0 ? "bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.8)]" : "bg-zinc-600"}`} />
                      <span className="text-sm font-bold text-zinc-200">{label}</span>
                    </div>
                    <span className={`font-mono text-sm font-black ${index === 0 ? "text-violet-300" : "text-zinc-400"}`}>{probability}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-violet-300 transition-all duration-1000" style={{ width: `${probability}%` }} />
                  </div>
                  <div className="mt-1.5 text-xs text-zinc-600">Evidence: {evidence}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300/70">Highest-confidence hypothesis</div>
              <div className="mt-1 flex items-center justify-between gap-4">
                <div className="text-lg md:text-xl font-black">Gateway fee</div>
                <div className="font-mono text-2xl font-black text-violet-300">82%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
