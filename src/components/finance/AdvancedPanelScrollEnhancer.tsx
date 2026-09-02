'use client';

import { useEffect } from 'react';

export function AdvancedPanelScrollEnhancer() {
  useEffect(() => {
    const section = document.getElementById('verita-advanced-features');
    if (!section) return;

    const panels = Array.from(section.querySelectorAll<HTMLElement>(':scope > div > div.absolute.inset-0'));
    const cleanups: (() => void)[] = [];

    panels.forEach((panel) => {
      panel.style.overflowY = 'auto';
      panel.style.overflowX = 'hidden';
      panel.style.justifyContent = 'flex-start';
      panel.style.paddingTop = 'clamp(24px, 7vh, 72px)';
      panel.style.paddingBottom = 'clamp(90px, 12vh, 140px)';
      panel.style.scrollbarWidth = 'thin';
      panel.style.scrollbarColor = 'rgba(255,255,255,.25) transparent';
      panel.style.overscrollBehaviorY = 'contain';
      panel.style.touchAction = 'pan-y';
      panel.classList.add('verita-advanced-scroll-panel');

      const cue = document.createElement('div');
      cue.textContent = 'SCROLL DOWN';
      cue.className = 'verita-scroll-cue';
      panel.appendChild(cue);

      const updateCue = () => {
        const canScroll = panel.scrollHeight > panel.clientHeight + 12;
        const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 12;
        cue.style.opacity = canScroll && !atBottom ? '1' : '0';
      };
      panel.addEventListener('scroll', updateCue, { passive: true });
      window.addEventListener('resize', updateCue);
      requestAnimationFrame(updateCue);
      cleanups.push(() => {
        panel.removeEventListener('scroll', updateCue);
        window.removeEventListener('resize', updateCue);
        cue.remove();
      });
    });

    const style = document.createElement('style');
    style.textContent = `
      .verita-advanced-scroll-panel::-webkit-scrollbar { width: 5px; }
      .verita-advanced-scroll-panel::-webkit-scrollbar-track { background: transparent; }
      .verita-advanced-scroll-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,.22); border-radius: 999px; }
      .verita-scroll-cue {
        position: sticky;
        bottom: 18px;
        align-self: center;
        margin-top: 18px;
        z-index: 40;
        pointer-events: none;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.72);
        backdrop-filter: blur(12px);
        border-radius: 999px;
        padding: 8px 13px;
        color: rgba(255,255,255,.72);
        font: 700 9px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
        letter-spacing: .18em;
        transition: opacity .25s ease;
        box-shadow: 0 8px 30px rgba(0,0,0,.35);
      }
      @media (max-width: 768px) {
        .verita-scroll-cue { bottom: 12px; padding: 7px 11px; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      style.remove();
    };
  }, []);

  return null;
}
