'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingScreen } from '@/components/layout';
import { HeroVisual } from '@/components/sections/HeroVisual';
import { HorizontalScrollSection } from '@/components/sections/HorizontalScrollSection';
import { AdvancedFeaturesSection } from '@/components/sections/AdvancedFeaturesSection';
import { FinanceUploadMount } from '@/components/finance/FinanceUploadMount';
import { UserRunResultsOverlay } from '@/components/finance/UserRunResultsOverlay';
import { FinanceControllerChat } from '@/components/finance/FinanceControllerChat';
import { AdvancedPanelScrollEnhancer } from '@/components/finance/AdvancedPanelScrollEnhancer';
import { VeritaFAQ } from '@/components/sections/VeritaFAQ';
import { usePreloadState } from '@/components/ui/arc-preloader-hero';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const { phase } = usePreloadState();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoadingExit, setIsInitialLoadingExit] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('portfolioLoaded');
    if (hasLoaded) { setSkipAnimation(true); setIsLoading(false); }
    if (typeof window === 'undefined' || !('ResizeObserver' in window)) return;
    const refreshLayout = () => { window.dispatchEvent(new Event('resize')); ScrollTrigger.refresh(); };
    const resizeObserver = new ResizeObserver(refreshLayout);
    resizeObserver.observe(document.body);
    window.addEventListener('load', refreshLayout);
    return () => { resizeObserver.disconnect(); window.removeEventListener('load', refreshLayout); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const isReadyToAnimate = isLoading ? isInitialLoadingExit : (phase === 'reveal' || phase === 'done');
  useEffect(() => { if (isReadyToAnimate) { const timer = setTimeout(() => ScrollTrigger.refresh(), 1500); return () => clearTimeout(timer); } }, [isReadyToAnimate]);
  const handleLoadingComplete = () => { setIsLoading(false); window.scrollTo({ top: 0, behavior: 'instant' }); sessionStorage.setItem('portfolioLoaded', 'true'); setTimeout(() => ScrollTrigger.refresh(), 100); };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} onExitStart={() => setIsInitialLoadingExit(true)} duration={2500} />}
      <motion.main
        initial={skipAnimation ? false : { opacity: 0, y: 40 }}
        animate={skipAnimation ? { opacity: 1, y: 0 } : (isReadyToAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 })}
        transition={{ duration: skipAnimation ? 0 : 1.4, ease: skipAnimation ? 'linear' : [0.16, 1, 0.3, 1], opacity: { duration: skipAnimation ? 0 : 0.8 } }}
        className="relative overflow-x-clip"
      >
        <HeroVisual isReady={isReadyToAnimate} />
        <FinanceUploadMount />
        <div id="verita-early-run-range">
          <HorizontalScrollSection isReady={isReadyToAnimate} />
        </div>
        <UserRunResultsOverlay kind="early" />
        <div id="verita-advanced-features">
          <AdvancedFeaturesSection isReady={isReadyToAnimate} />
          <AdvancedPanelScrollEnhancer />
        </div>
        <UserRunResultsOverlay kind="advanced" />
        <FinanceControllerChat />
        <VeritaFAQ />
      </motion.main>
    </>
  );
}
