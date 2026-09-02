"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Spotlight } from "@/components/ui/spotlight-new";
import DemoRunner from "@/components/demo/DemoRunner";
import FinancialGraph from "@/components/demo/FinancialGraph";
import { TechnicalDetailsModal } from "@/components/demo/TechnicalDetailsModal";
import { useLenis } from 'lenis/react';

/**
 * HorizontalScrollSection
 * 
 * Uses the exact same pattern as HeroVisual (Slide 1):
 * - Single h-screen container with pin: true
 * - Absolute-positioned video2.mp4 background with zoom + darken on scroll
 * - Content panels stacked absolutely, animated with x-translate via GSAP
 * - No actual CSS overflow — all movement is transform-based
 */
export function HorizontalScrollSection({ isReady = false }: { isReady?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Panel refs
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;

    gsap.registerPlugin(ScrollTrigger);

    // Small delay to let HeroVisual's ScrollTrigger fully initialize first
    const initTimer = setTimeout(() => {
      const ctx = gsap.context(() => {
        if (!sectionRef.current) return;

        // Initialize panels: Panel 1 visible, Panel 2 & 3 off-screen right
        gsap.set(panel1Ref.current, { x: 0, opacity: 1 });
        gsap.set(panel2Ref.current, { x: "100vw", opacity: 0 });
        gsap.set(panel3Ref.current, { x: "100vw", opacity: 0 });

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=3000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          }
        });

        // Background zoom & darken (same as HeroVisual)
        masterTl
          .to(videoBgRef.current, { scale: 1.4, ease: "none" }, 0)
          .to(darkOverlayRef.current, { opacity: 0.85, ease: "none" }, 0);

        // Phase 1: Panel 1 exits left, Panel 2 enters from right
        masterTl
          .to(panel1Ref.current, { x: "-100vw", opacity: 0, ease: "none" }, 0.3)
          .to(panel2Ref.current, { x: 0, opacity: 1, ease: "none" }, 0.3);

        // Phase 2: Panel 2 exits left, Panel 3 enters from right
        masterTl
          .to(panel2Ref.current, { x: "-100vw", opacity: 0, ease: "none" }, 0.7)
          .to(panel3Ref.current, { x: 0, opacity: 1, ease: "none" }, 0.7);

        // Background continues zooming
        masterTl
          .to(videoBgRef.current, { scale: 1.8, ease: "none" }, 0.7);

      }, sectionRef);

      // Store ctx for cleanup
      (sectionRef.current as any).__gsapCtx = ctx;
    }, 500);

    return () => {
      clearTimeout(initTimer);
      if (sectionRef.current && (sectionRef.current as any).__gsapCtx) {
        (sectionRef.current as any).__gsapCtx.revert();
      }
    };
  }, [isReady]);

  return (
    <div
      ref={sectionRef}
      className="relative h-screen w-full bg-background text-foreground overflow-hidden"
    >
      {/* Background Video Layer — same structure as HeroVisual */}
      <div ref={videoBgRef} className="absolute inset-0 z-0 w-full h-full will-change-transform">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-60"
        >
          <source src="/video2.mp4" type="video/mp4" />
          <track kind="captions" />
        </video>
        {/* Darkening overlay (same as HeroVisual) */}
        <div ref={darkOverlayRef} className="absolute inset-0 bg-black/70 opacity-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
        
        {/* Dot pattern (same as HeroVisual) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_#888_0.5px,_transparent_0.5px)] dark:bg-[radial-gradient(circle,_#444_0.5px,_transparent_0.5px)] opacity-20 [background-size:24px_24px] pointer-events-none" />
      </div>

      {/* Spotlight Effect (same as HeroVisual) */}
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
      <div
        ref={panel1Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center w-full px-6 max-w-5xl mx-auto will-change-transform"
      >
        <div className="absolute top-8 right-8 z-50">
            <TechnicalDetailsModal />
        </div>
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-6 drop-shadow-md">
          VERITA / 03
        </p>
        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] text-foreground uppercase mb-8"
          style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}
        >
          THE NEXT PHASE<br />OF VERIFICATION.
        </h2>
        <p className="text-base md:text-xl lg:text-2xl text-muted-foreground tracking-wide font-light leading-relaxed max-w-3xl mb-8">
          Scroll down or click the button below to journey through our advanced reconciliation process.
        </p>
        <button 
          onClick={() => {
            if (lenis) {
              lenis.scrollTo(window.scrollY + window.innerHeight * 1.5);
            } else {
              window.scrollBy({ top: window.innerHeight * 1.5, behavior: 'smooth' });
            }
          }}
          className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
        >
          View ML Record Linking Model
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>

      {/* PANEL 2 — ML Record Linking */}
      <div
        ref={panel2Ref}
        className="absolute inset-0 z-10 flex flex-col w-full px-6 pt-24 max-w-6xl mx-auto will-change-transform overflow-y-auto"
      >
        <div className="absolute top-8 right-8 z-50">
            <TechnicalDetailsModal />
        </div>
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-2 drop-shadow-md text-center">
          VERITA / 04
        </p>
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.1] text-foreground uppercase mb-6 text-center"
          style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}
        >
          ML RECORD LINKING MODEL
        </h2>
        
        {/* Navigation to Graph */}
        <div className="flex justify-center mb-6">
            <button 
            onClick={() => {
              if (lenis) {
                lenis.scrollTo(window.scrollY + window.innerHeight * 1.5);
              } else {
                window.scrollBy({ top: window.innerHeight * 1.5, behavior: 'smooth' });
              }
            }}
            className="px-6 py-2 bg-primary/20 hover:bg-primary/40 text-primary-foreground border border-primary/50 font-semibold rounded-full transition-colors flex items-center gap-2 text-sm z-50"
            >
            Proceed to Temporal Financial Graph
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
        </div>

        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border mb-24 relative z-40">
            <DemoRunner onReset={() => window.location.reload()} />
        </div>
      </div>

      {/* PANEL 3 — Temporal Graph */}
      <div
        ref={panel3Ref}
        className="absolute inset-0 z-10 flex flex-col w-full px-6 pt-24 max-w-6xl mx-auto will-change-transform overflow-y-auto"
      >
        <div className="absolute top-8 right-8 z-50">
            <TechnicalDetailsModal />
        </div>
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-2 drop-shadow-md text-center">
          VERITA / 05
        </p>
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.1] text-foreground uppercase mb-6 text-center"
          style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}
        >
          TEMPORAL FINANCIAL GRAPH
        </h2>
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border mt-4 mb-24">
            <FinancialGraph />
        </div>
      </div>
    </div>
  );
}
