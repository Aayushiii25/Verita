"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Spotlight } from "@/components/ui/spotlight-new";

export function HorizontalScrollSection({ isReady = true }: { isReady?: boolean }) {
  const [error, setError] = React.useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;
    
    try {
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        if (!sectionRef.current || !trackRef.current) return;

        const track = trackRef.current;
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${track.scrollWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        tl.to(videoBgRef.current, { scale: 1.3, ease: "none" }, 0)
          .to(darkOverlayRef.current, { opacity: 0.8, ease: "none" }, 0);

        tl.to(track, {
          x: getScrollAmount,
          ease: "none"
        }, 0);

      }, sectionRef);

      return () => ctx.revert();
    } catch (e: any) {
      setError(e.message || "GSAP Error");
    }
  }, [isReady]);

  if (error) {
    return <div className="h-screen w-full flex items-center justify-center bg-red-500 text-white text-2xl">{error}</div>;
  }

  return (
    <section ref={sectionRef} className="relative h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Background Video Layer */}
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
        {/* Darkening overlay for text contrast (Fades in on scroll) */}
        <div ref={darkOverlayRef} className="absolute inset-0 bg-black/40" />
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

      {/* Horizontal Track */}
      <div ref={trackRef} className="relative z-10 flex h-full w-fit flex-nowrap items-center will-change-transform">
        
        {/* Panel 1 */}
        <div className="w-screen flex-shrink-0 flex items-center justify-center px-6 md:px-24">
            <div className="max-w-4xl text-center md:text-left md:mr-auto">
                <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-6 drop-shadow-md">
                    VERITA / 03
                </p>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] text-white uppercase mb-8 drop-shadow-lg"
                    style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}>
                    THE NEXT PHASE<br />OF VERIFICATION.
                </h2>
                <p className="text-base md:text-xl lg:text-2xl text-gray-200 tracking-wide font-light leading-relaxed drop-shadow-md max-w-2xl mx-auto md:mx-0">
                    Scroll down to journey horizontally through our advanced process.
                </p>
            </div>
        </div>

        {/* Panel 2 */}
        <div className="w-screen flex-shrink-0 flex items-center justify-center px-6 md:px-24">
            <div className="max-w-4xl text-center mx-auto">
                <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-6 drop-shadow-md">
                    ANALYSIS
                </p>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] text-white uppercase mb-8 drop-shadow-lg"
                    style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}>
                    DEEP DATA<br />INSPECTION.
                </h2>
                <p className="text-base md:text-xl lg:text-2xl text-gray-200 tracking-wide font-light leading-relaxed drop-shadow-md mx-auto max-w-2xl">
                    We look beyond the surface. Every transaction is matched across thousands of data points instantly.
                </p>
            </div>
        </div>

        {/* Panel 3 */}
        <div className="w-screen flex-shrink-0 flex items-center justify-center px-6 md:px-24">
            <div className="max-w-4xl text-center md:text-right md:ml-auto">
                <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-primary mb-6 drop-shadow-md">
                    RESULTS
                </p>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] text-white uppercase mb-8 drop-shadow-lg"
                    style={{ fontFamily: "'PP Neue Montreal', 'Helvetica Neue', Inter, sans-serif" }}>
                    CRYSTAL CLEAR<br />OUTCOMES.
                </h2>
                <p className="text-base md:text-xl lg:text-2xl text-gray-200 tracking-wide font-light leading-relaxed drop-shadow-md max-w-2xl mx-auto md:ml-auto md:mr-0">
                    No more ambiguous spreadsheets. Just clear, actionable intelligence ready for your team.
                </p>
            </div>
        </div>

      </div>
    </section>
  );
}
