"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

  // Screen 4 (Professional Statistics) Refs
  const screen4Ref = useRef<HTMLElement>(null);
  const screen4ContentRef = useRef<HTMLDivElement>(null);

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

      // Initialize Screen 4 hidden state
      gsap.set(screen4Ref.current, { opacity: 0, pointerEvents: "none" });
      gsap.set(screen4ContentRef.current, { opacity: 0, y: 50 });

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: journeyRef.current,
          start: "top top",
          end: "+=2800", // Extend scroll duration to fit 4 screens
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // Phase 1: Screen 1 Disappears & Zoom starts & Darken starts
      masterTimeline
        .to(videoBgRef.current, { scale: 1.1, ease: "none", transformOrigin: "center center" }, 0)
        .to(darkOverlayRef.current, { opacity: 1, backgroundColor: "rgba(0,0,0,0.7)", ease: "none" }, 0.2)
        .to(screen1Ref.current, { opacity: 0, y: -80, scale: 0.95, ease: "none" }, 0);

      // Phase 2: Zoom continues & Screen 2 Appears
      masterTimeline
        .to(videoBgRef.current, { scale: 1.4, ease: "none" }, 0.5)
        .to(screen2EyebrowRef.current, { opacity: 1, y: 0, ease: "none" }, 0.6)
        .to(screen2TitleRef.current, { opacity: 1, y: 0, scale: 1, ease: "none" }, 0.7)
        .to(screen2BodyRef.current, { opacity: 1, y: 0, ease: "none" }, 0.8)
        .to(screen2LabelsRef.current, { opacity: 1, scale: 1, ease: "none" }, 0.9);

      // Phase 3: Screen 2 Disappears & Screen 3 Appears, Background transitions to nude tone
      masterTimeline
        .to(screen2Ref.current, { opacity: 0, y: -50, ease: "none" }, 1.3)
        .to(videoBgRef.current, { scale: 1.8, ease: "none" }, 1.3)
        .to(darkOverlayRef.current, { backgroundColor: "rgba(230, 215, 205, 0.35)", ease: "none" }, 1.3) // Soften nude tone
        .to(screen3Ref.current, { opacity: 1, pointerEvents: "auto", ease: "none" }, 1.4)
        .to(screen3ContentRef.current, { opacity: 1, y: 0, ease: "none" }, 1.5);

      // Phase 4: Screen 3 Disappears & Screen 4 Appears
      masterTimeline
        .to(screen3Ref.current, { opacity: 0, y: -50, ease: "none" }, 2.0)
        .to(videoBgRef.current, { scale: 2.0, ease: "none" }, 2.0)
        .to(darkOverlayRef.current, { backgroundColor: "rgba(0, 0, 0, 0.95)", ease: "none" }, 2.0) // Transition back to pitch black
        .to(screen4Ref.current, { opacity: 1, pointerEvents: "auto", ease: "none" }, 2.1)
        .to(screen4ContentRef.current, { opacity: 1, y: 0, ease: "none" }, 2.2);

      // End Phase: Move Screen 4 slightly up to prepare for natural page scrolling
      masterTimeline
        .to(screen4Ref.current, { y: -50, ease: "none" }, 2.8);
      
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
                <div className="flex flex-col items-center space-y-8 opacity-0 pointer-events-none">
                    {/* Hiding old content but keeping structure if needed for spacing, or just removing it */}
                </div>

            </div>
        </div>
      </main>

      {/* SCREEN 4 (Professional Statistics) */}
      <main ref={screen4Ref} className="screen-4 absolute inset-0 z-40 flex flex-col items-center justify-center text-center w-full px-6 max-w-7xl mx-auto opacity-0 pointer-events-none will-change-transform">
        <div ref={screen4ContentRef} className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl px-6">
          
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 mb-12">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-xs font-mono text-zinc-300 tracking-widest uppercase">Professional Statistics</span>
          </div>

          {/* Big Headline */}
          <h2 className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold tracking-tight leading-[1.1] text-white transition-all duration-700 mb-16 drop-shadow-lg max-w-4xl">
            Data that speaks. AI that reasons.<br/>
            Software that ships.<br/>
            Three disciplines, one engineer<br/>
            and the numbers behind the work.
          </h2>
          
          {/* Statistics Box */}
          <div className="w-full max-w-4xl bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 backdrop-blur-md">
            
            <div className="flex flex-col items-center flex-1">
              <p className="text-[10px] md:text-xs text-zinc-500 font-mono tracking-widest uppercase mb-2">Current GPA</p>
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">3.62<span className="text-zinc-500 text-2xl">/4.0</span></p>
            </div>

            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-zinc-700 to-transparent opacity-50"></div>

            <div className="flex flex-col items-center flex-1">
              <p className="text-[10px] md:text-xs text-zinc-500 font-mono tracking-widest uppercase mb-2">Projects Completed</p>
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">20+</p>
            </div>

            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-zinc-700 to-transparent opacity-50"></div>

            <div className="flex flex-col items-center flex-1">
              <p className="text-[10px] md:text-xs text-zinc-500 font-mono tracking-widest uppercase mb-2">Professional Exp</p>
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">2<span className="text-zinc-400 text-2xl ml-1 font-medium tracking-normal">Years</span></p>
            </div>

            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-zinc-700 to-transparent opacity-50"></div>

            <div className="flex flex-col items-center flex-1">
              <p className="text-[10px] md:text-xs text-zinc-500 font-mono tracking-widest uppercase mb-2">Tech & Tools</p>
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">34+</p>
            </div>

          </div>

        </div>
      </main>
    </motion.div>
  );
}
