"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Spotlight } from "@/components/ui/spotlight-new";

export function HeroVisual({ isReady = true }: { isReady?: boolean }) {
  // Container & Background
  const journeyRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  
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

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: journeyRef.current,
          start: "top top",
          end: "+=2800", // Scroll duration
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // Phase 1: Screen 1 Disappears & Zoom starts
      masterTimeline
        .to(videoBgRef.current, { scale: 1.1, ease: "none", transformOrigin: "center center" }, 0)
        .to(screen1Ref.current, { opacity: 0, y: -80, scale: 0.95, ease: "none" }, 0);

      // Phase 2: Zoom continues & Screen 2 Appears
      masterTimeline
        .to(videoBgRef.current, { scale: 1.8, ease: "none" }, 0.5) // Starts after Screen 1 fades
        .to(screen2EyebrowRef.current, { opacity: 1, y: 0, ease: "none" }, 0.6)
        .to(screen2TitleRef.current, { opacity: 1, y: 0, scale: 1, ease: "none" }, 0.7)
        .to(screen2BodyRef.current, { opacity: 1, y: 0, ease: "none" }, 0.8)
        .to(screen2LabelsRef.current, { opacity: 1, scale: 1, ease: "none" }, 0.9);

      // End Phase: Move Screen 2 slightly up to prepare for natural page scrolling
      masterTimeline
        .to(screen2Ref.current, { opacity: 0.5, y: -50, ease: "none" }, 1.5);
      
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
      <div ref={videoBgRef} className="absolute inset-0 z-0 w-full h-full will-change-transform bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40 mix-blend-luminosity"
        >
          <source src="/size.mp4" type="video/mp4" />
          <track kind="captions" />
        </video>
        {/* Darkening overlay for text contrast */}
        <div className="absolute inset-0 bg-black/50" />
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

    </motion.div>
  );
}
