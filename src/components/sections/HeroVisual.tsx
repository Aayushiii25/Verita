"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Spotlight } from "@/components/ui/spotlight-new";

// --- SVG Filters for Custom Button ---
const CustomButtonFilters = () => (
  <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <svg className="filter">
          <filter id="bump">
              <feTurbulence result="noise" numOctaves="4" baseFrequency="0.678" type="fractalNoise" />
              <feSpecularLighting result="specular" lightingColor="#fffffa" specularExponent="15" specularConstant="0.7" surfaceScale="0.22" in="noise">
                  <fePointLight z="210" y="-50" x="40" />
              </feSpecularLighting>
              <feComposite result="noise2" operator="in" in="specular" in2="SourceGraphic" />
              <feBlend mode="difference" in2="noise2" in="SourceGraphic" result="out" />
              <feBlend mode="overlay" in2="out" in="SourceGraphic" />
          </filter>
      </svg>
      <svg className="filter">
          <defs>
              <filter id="linen">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9 0.03" numOctaves="2" seed="8" result="verticalNoise" />
                  <feTurbulence type="fractalNoise" baseFrequency="0.03 0.9" numOctaves="2" seed="12" result="horizontalNoise" />
                  <feBlend in="verticalNoise" in2="horizontalNoise" mode="multiply" result="woven" />
                  <feComponentTransfer in="woven" result="threadContrast">
                      <feFuncR type="gamma" amplitude="1.3" exponent="2.4" />
                      <feFuncG type="gamma" amplitude="1.3" exponent="2.4" />
                      <feFuncB type="gamma" amplitude="1.3" exponent="2.4" />
                  </feComponentTransfer>
                  <feGaussianBlur in="threadContrast" stdDeviation="0.22" result="softThreads" />
                  <feComposite in="softThreads" in2="SourceGraphic" operator="in" result="textureMask" />
                  <feBlend in="SourceGraphic" in2="textureMask" mode="color-burn" />
              </filter>
          </defs>
      </svg>
  </div>
);

const CustomButton = ({ label, secondaryLabel, onClick }: { label: string, secondaryLabel: string, onClick?: () => void }) => (
  <button className="btn" onClick={onClick}>
      <div className="fabric"></div>
      <span className="txt">{label}</span>
      <span className="txt">{secondaryLabel}</span>
      <div className="shadow left"></div>
      <div className="shadow right"></div>
      <div className="dot"></div>
      <div className="light"></div>
  </button>
);

export function HeroVisual({ isReady = true }: { isReady?: boolean }) {
  const [isScreen4Open, setIsScreen4Open] = useState(false);

  // Container & Background
  const journeyRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  
  // Screen 1 (VERITA) Refs
  const screen1Ref = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const questionRef = useRef<HTMLParagraphElement>(null);

  // Screen 2 (Trail) Refs
  const screen2Ref = useRef<HTMLElement>(null);
  const screen2EyebrowRef = useRef<HTMLParagraphElement>(null);
  const screen2TitleRef = useRef<HTMLHeadingElement>(null);
  const screen2BodyRef = useRef<HTMLParagraphElement>(null);
  const screen2LabelsRef = useRef<HTMLDivElement>(null);

  // Screen 3 (Starting Point) Refs
  const screen3Ref = useRef<HTMLElement>(null);
  const screen3ContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ----------------------------------------------------
      // 1. Initial Load Animations (Screen 1 Typewriter)
      // ----------------------------------------------------
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
      gsap.set(questionRef.current, { opacity: 0, y: -10 });
      gsap.set(titleRef.current, { opacity: 1 });
      
      const tlLoad = gsap.timeline();
      
      // Question gently fades in
      tlLoad.to(questionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.2
      });

      // Typewriter for VERITA
      const text = "VERITA";
      const titleEl = titleRef.current;
      let timerId: NodeJS.Timeout;
      let startTimerId: NodeJS.Timeout;

      if (titleEl) {
        titleEl.textContent = "";
        let i = 0;
        const speed = 90; // ms per character
        
        function typeWriter() {
          if (i < text.length && titleEl) {
            titleEl.textContent += text.charAt(i);
            i++;
            timerId = setTimeout(typeWriter, speed);
          } else {
            // Finished typing!
            gsap.to(titleEl, {
              borderRightColor: "transparent",
              duration: 0.2,
              delay: 0.2
            });
            gsap.to(subtitleRef.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out"
            });
          }
        }
        
        startTimerId = setTimeout(typeWriter, 400);

        gsap.fromTo(titleEl, 
          { borderRightColor: "transparent" },
          {
            borderRightColor: "currentColor",
            repeat: -1,
            yoyo: true,
            duration: 0.3,
            ease: "steps(1)"
          }
        );
      }

      // ----------------------------------------------------
      // 2. Master ScrollTrigger Timeline
      // ----------------------------------------------------
      
      // Initialize Screen 2 hidden state
      gsap.set(screen2EyebrowRef.current, { opacity: 0, y: 30 });
      gsap.set(screen2TitleRef.current, { opacity: 0, y: 70, scale: 0.96 });
      gsap.set(screen2BodyRef.current, { opacity: 0, y: 30 });
      gsap.set(screen2LabelsRef.current, { opacity: 0, scale: 0.9 });

      // Initialize Screen 3 hidden state
      gsap.set(screen3Ref.current, { opacity: 0, pointerEvents: "none" });
      gsap.set(screen3ContentRef.current, { opacity: 0, y: 50 });

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: journeyRef.current,
          start: "top top",
          end: "+=2000", // Shorter scroll duration to make scrolling faster and easier
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // Phase 1: Screen 1 Disappears & Zoom starts & Darken starts
      masterTimeline
        .to(videoBgRef.current, { scale: 1.1, ease: "none", transformOrigin: "center center" }, 0)
        .to(darkOverlayRef.current, { opacity: 1, backgroundColor: "rgba(0,0,0,0.7)", ease: "none" }, 0.2) // Gradually darken as we scroll down
        .to(screen1Ref.current, { opacity: 0, y: -80, scale: 0.95, ease: "none" }, 0);

      // Phase 2: Zoom continues & Screen 2 Appears
      masterTimeline
        .to(videoBgRef.current, { scale: 1.4, ease: "none" }, 0.5) // Starts after Screen 1 fades
        .to(screen2EyebrowRef.current, { opacity: 1, y: 0, ease: "none" }, 0.6)
        .to(screen2TitleRef.current, { opacity: 1, y: 0, scale: 1, ease: "none" }, 0.7)
        .to(screen2BodyRef.current, { opacity: 1, y: 0, ease: "none" }, 0.8)
        .to(screen2LabelsRef.current, { opacity: 1, scale: 1, ease: "none" }, 0.9);

      // Phase 3: Screen 2 Disappears & Screen 3 Appears, Background transitions to nude tone
      masterTimeline
        .to(screen2Ref.current, { opacity: 0, y: -50, ease: "none" }, 1.3)
        .to(videoBgRef.current, { scale: 1.8, ease: "none" }, 1.3)
        .to(darkOverlayRef.current, { backgroundColor: "rgba(230, 215, 205, 0.35)", ease: "none" }, 1.3) // Soften nude tone significantly
        .to(screen3Ref.current, { opacity: 1, pointerEvents: "auto", ease: "none" }, 1.4)
        .to(screen3ContentRef.current, { opacity: 1, y: 0, ease: "none" }, 1.5);

      // End Phase: Move Screen 3 slightly up to prepare for natural page scrolling
      masterTimeline
        .to(screen3Ref.current, { y: -50, ease: "none" }, 2.0);
      
      return () => {
        clearTimeout(startTimerId);
        clearTimeout(timerId);
      };
    }, journeyRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <motion.div
      ref={journeyRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="cinematic-journey relative h-screen w-full bg-background text-foreground overflow-hidden selection:bg-primary/20"
    >
      {/* Shared Background Video Layer */}
      <div ref={videoBgRef} className="absolute inset-0 z-0 w-full h-full will-change-transform">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-60"
        >
          <source src="/size.mp4" type="video/mp4" />
          <track kind="captions" />
        </video>
        {/* Darkening overlay for text contrast (Fades in on scroll) */}
        <div ref={darkOverlayRef} className="absolute inset-0 bg-black/70 opacity-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_#888_0.5px,_transparent_0.5px)] dark:bg-[radial-gradient(circle,_#444_0.5px,_transparent_0.5px)] opacity-20 [background-size:24px_24px] pointer-events-none" />
      </div>

      {/* Spotlight Effect (Shared) */}
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

      {/* SCREEN 1 */}
      <main ref={screen1Ref} className="screen-1 absolute inset-0 z-10 flex flex-col items-center justify-center text-center w-full px-6 max-w-7xl mx-auto mt-[-5%] will-change-transform">
        {/* Top Question */}
        <p
          ref={questionRef}
          className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-muted-foreground mb-12 md:mb-20"
        >
          WHEN DID YOU LAST VERIFY THE NUMBERS?
        </p>

        {/* Main Title: VERITA */}
        <div className="flex items-center justify-center mb-8 md:mb-12 h-[clamp(4rem,15vw,14rem)] overflow-visible">
          <h1
            ref={titleRef}
            className="text-[clamp(4rem,15vw,14rem)] font-medium tracking-[-0.04em] leading-[0.9] text-foreground uppercase whitespace-nowrap overflow-hidden border-r-[4px] border-foreground pr-2"
            style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif", fontWeight: 500, boxSizing: "content-box" }}
          ></h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl lg:text-2xl text-muted-foreground tracking-wide font-light"
        >
          Every number, verified.
        </p>
      </main>

      {/* SCREEN 2 */}
      <main ref={screen2Ref} className="screen-2 absolute inset-0 z-20 flex flex-col items-center justify-center text-center w-full px-6 max-w-5xl mx-auto pointer-events-none will-change-transform">
        
        <p
          ref={screen2EyebrowRef}
          className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-6"
        >
          VERITA / 02
        </p>
        
        <h2
          ref={screen2TitleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] text-foreground uppercase mb-8"
          style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}
        >
          EVERY RUPEE<br />LEAVES A TRAIL.
        </h2>

        <p
          ref={screen2BodyRef}
          className="text-base md:text-xl lg:text-2xl text-muted-foreground tracking-wide font-light max-w-3xl leading-relaxed mb-16"
        >
          One transaction leaves traces across every system it touches.
        </p>

        <div ref={screen2LabelsRef} className="flex flex-col items-center gap-2">
          <div className="px-4 py-1.5 border border-primary/30 bg-primary/5 rounded-full text-xs font-mono text-primary tracking-widest uppercase shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            TRAIL DETECTED
          </div>
          <p className="text-xs font-mono text-muted-foreground/60 tracking-wider">04 RECORDS FOUND</p>
        </div>

      </main>

      {/* SCREEN 3 (Starting Point) */}
      <main ref={screen3Ref} className="screen-3 absolute inset-0 z-30 flex flex-col items-center justify-center text-center w-full px-6 max-w-7xl mx-auto opacity-0 pointer-events-none will-change-transform">
        <CustomButtonFilters />
        
        {/* Content Layer */}
        <div ref={screen3ContentRef} className="relative z-10 flex flex-col items-center text-center w-full">
            
            {/* Main Headline */}
            <div className="mb-6 mt-12">
                <h2 className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[76px] font-bold tracking-tight leading-[0.92] text-zinc-900 dark:text-zinc-900 uppercase transition-all duration-700">
                    CHOOSE YOUR <br />
                    STARTING POINT.
                </h2>
            </div>

            {/* Supporting Text */}
            <div className="mb-12 max-w-2xl mx-auto">
                <p className="text-base md:text-lg lg:text-xl font-medium text-zinc-800 dark:text-zinc-800 leading-relaxed tracking-tight drop-shadow-sm">
                    Identify the source. Validate the data. Prepare the batch.
                </p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full max-w-4xl border-t border-zinc-900/10 pt-16 mb-8 mt-4">
                
                {/* Option 1: Run Demo */}
                <div className="flex flex-col items-center space-y-8">
                    <div className="space-y-2 text-center">
                        <span className="text-zinc-900 text-xl font-bold uppercase tracking-widest block drop-shadow-sm">RUN DEMO</span>
                        <p className="text-zinc-800 italic drop-shadow-sm">See a complete run</p>
                    </div>
                    <CustomButton label="Play" secondaryLabel="Stop" />
                </div>

                {/* Option 2: Use Your Data */}
                <div className="flex flex-col items-center space-y-8">
                    <div className="space-y-2 text-center">
                        <span className="text-zinc-900 text-xl font-bold uppercase tracking-widest block drop-shadow-sm">USE YOUR DATA</span>
                        <p className="text-zinc-800 italic drop-shadow-sm">Start with your records</p>
                    </div>
                    <div style={{ pointerEvents: "auto" }}>
                      <CustomButton label="Upload" secondaryLabel="Stop" onClick={() => { console.log('UPLOAD CLICKED'); setIsScreen4Open(true); }} />
                    </div>
                </div>

            </div>
        </div>
      </main>

      {/* SCREEN 4: Slide-up Drawer (Upload) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isScreen4Open && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[9999] bg-zinc-950 text-white flex flex-col items-center justify-center overflow-hidden"
            >
              {/* Optional Subtle Grid/Noise Background to match pattern */}
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,_#ffffff05_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsScreen4Open(false)}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors z-50 group"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Screen 4 Content - Cinematic Layout */}
              <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl px-6">
                
                <h2 className="text-[32px] sm:text-[48px] md:text-[64px] font-bold tracking-tight leading-[0.92] text-white uppercase transition-all duration-700 mb-6 drop-shadow-lg">
                  UPLOAD <br /> RECORDS.
                </h2>
                
                <p className="text-base md:text-lg lg:text-xl font-medium text-zinc-400 leading-relaxed tracking-tight mb-12 max-w-2xl">
                  Securely bring your own data into the system for validation and processing.
                </p>
                
                {/* Drag & Drop Area - Dark Theme */}
                <div className="w-full max-w-2xl border-2 border-dashed border-zinc-700/50 rounded-2xl p-16 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group backdrop-blur-sm">
                  <svg className="w-12 h-12 text-zinc-600 group-hover:text-zinc-300 transition-colors mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-zinc-400 group-hover:text-zinc-200 transition-colors font-medium tracking-wide">
                    Drag & drop your files here, or click to browse
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
