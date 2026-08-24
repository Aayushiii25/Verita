"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Spotlight } from "@/components/ui/spotlight-new";

export function HeroVisual({ isExiting = false }: { isExiting?: boolean }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const questionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isExiting) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial states
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
      gsap.set(questionRef.current, { opacity: 0, y: -10 });
      gsap.set(titleRef.current, { opacity: 1 });
      
      // Question gently fades in
      tl.to(questionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.2
      });

      // Cursor blinking animation
      gsap.to(cursorRef.current, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.4,
        ease: "steps(1)"
      });

      // Typewriter for VERITA
      const text = "VERITA";
      const titleEl = titleRef.current;
      if (titleEl) {
        titleEl.textContent = "";
        
        text.split("").forEach((char) => {
          tl.add(() => {
            titleEl.textContent += char;
          }, `+=${0.15}`); // Sequential stepped reveal
        });
      }

      // Fade out cursor gracefully after typing finishes
      tl.to(cursorRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.6
      });

      // Fade in subtitle
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out"
      }, "-=0.2");
      
    });

    return () => ctx.revert();
  }, [isExiting]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground overflow-hidden selection:bg-primary/20"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
      </div>

      {/* Background Pattern */}
      <div className="w-full absolute h-full z-0 bg-[radial-gradient(circle,_#888_0.5px,_transparent_0.5px)] dark:bg-[radial-gradient(circle,_#444_0.5px,_transparent_0.5px)] opacity-20 [background-size:24px_24px] pointer-events-none" />

      {/* Spotlight Effect */}
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

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center w-full px-6 pointer-events-auto h-full max-w-7xl mx-auto mt-[-5%]">
        
        {/* Top Question */}
        <p
          ref={questionRef}
          className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-12 md:mb-20"
        >
          WHEN DID YOU LAST VERIFY THE NUMBERS?
        </p>

        {/* Main Title: VERITA */}
        <div className="flex items-center justify-center mb-8 md:mb-12 h-[clamp(4rem,15vw,14rem)] overflow-visible">
          <h1
            ref={titleRef}
            className="text-[clamp(4rem,15vw,14rem)] font-medium tracking-[-0.04em] leading-[0.9] text-foreground uppercase whitespace-nowrap"
            style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif", fontWeight: 500 }}
          >
            {/* GSAP will populate text here */}
          </h1>
          <span
            ref={cursorRef}
            className="w-[3px] md:w-[6px] h-[80%] bg-foreground ml-2 md:ml-4 inline-block"
            style={{ transform: 'translateY(-5%)' }}
          />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-sm md:text-lg lg:text-xl text-muted-foreground tracking-wide font-light"
        >
          Every number, verified.
        </p>
        
      </main>
    </motion.div>
  );
}
