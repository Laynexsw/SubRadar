/**
 * SubRadar — Ascii Reveal Component Loader (Dither + Decode Engine)
 * Powered by ascii-reveal (quanhoangindex/ascii-reveal)
 * 
 * Replaces page scroll animations with high-tech dither + decode loading reveals.
 */
import { createAsciiReveal, presets } from './ascii-reveal-core.js';

// Hybrid Dither + Decode Preset: dense dither blocks transitioning into alphanumeric decode scramble
export const ditherDecodePreset = {
  ramp: " ░▒▓█.:-=+*#%@",
  scramble: "░▒▓█0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=?/",
  mode: "ramp",
  color: "mono",
  cells: [20, 14, 10, 7, 5],
  tick: 55
};

export function initAsciiRevealLoader() {
  const getRevealFn = () => {
    if (typeof createAsciiReveal === 'function') return createAsciiReveal;
    if (typeof window !== 'undefined' && typeof window.createAsciiReveal === 'function') return window.createAsciiReveal;
    return null;
  };

  const revealFn = getRevealFn();
  if (!revealFn) return;

  // Selected component sections for the page entrance loading animation
  const componentSelectors = [
    { sel: '#site-header .header-island-inner', origin: 'center', delay: 0, speed: 1.3 },
    { sel: '[data-od-id="hero"] > div:not(.relative)', origin: 'top-left', delay: 0, speed: 1.2 },
    { sel: '#hero-mock-window', origin: 'top-left', delay: 80, speed: 1.15 },
    { sel: '[data-od-id="sorun"]', origin: 'center', delay: 140, speed: 1.15 },
    { sel: '#ekstre-laboratuvari', origin: 'center', delay: 200, speed: 1.15 },
    { sel: '#hesaplayici', origin: 'center', delay: 260, speed: 1.15 },
    { sel: '#karsilastirma', origin: 'center', delay: 320, speed: 1.15 },
    { sel: '#ozellikler', origin: 'center', delay: 380, speed: 1.15 },
    { sel: '#isletim-sistemleri', origin: 'center', delay: 440, speed: 1.15 },
    { sel: '#fiyatlandirma', origin: 'center', delay: 500, speed: 1.15 },
    { sel: '#faq', origin: 'center', delay: 560, speed: 1.15 }
  ];

  componentSelectors.forEach(({ sel, origin, delay, speed }) => {
    const els = document.querySelectorAll(sel);
    els.forEach(el => {
      if (!el || el.closest('.hidden')) return;
      setTimeout(() => {
        try {
          const ctrl = revealFn(el, {
            preset: ditherDecodePreset,
            duration: 'fast',
            speed: speed || 1.15,
            origin: origin || 'center'
          });
          ctrl.reveal().catch(() => {});
        } catch (err) {
          console.warn('[SubRadar Ascii Reveal]', sel, err);
        }
      }, delay);
    });
  });
}

// Global exposure
if (typeof window !== 'undefined') {
  window.srDitherDecodePreset = ditherDecodePreset;
  window.srInitAsciiRevealLoader = initAsciiRevealLoader;
}
