/**
 * SubRadar — Ascii Reveal & Ascii Skeleton Engine
 * Powered by ascii-reveal (quanhoangindex/ascii-reveal)
 * 
 * Implements the component lifecycle:
 * <AsciiReveal loading={!data} preset="decode">
 *   {data ? <Profile data={data} /> : <AsciiSkeleton variant="dither" />}
 * </AsciiReveal>
 *
 * 1. Initial / Loading Phase (!data):
 *    All elements across the site show an animated ASCII Skeleton (variant="dither"),
 *    rendering soft block patterns (░▒▓█) with an animated sweeping wave.
 * 2. Data / Complete Phase (data = true):
 *    Elements transition from <AsciiSkeleton variant="dither" /> to live UI,
 *    decoding text, metrics, and card surfaces via preset="decode" in an orchestrated cascade.
 */

import { createAsciiReveal, asciiSkeletonHTML, animateSkeleton, animateSkeletons, SKELETON_CSS } from './ascii-reveal-core.js';

let skeletonCssInjected = false;
function ensureSkeletonCSS() {
  if (skeletonCssInjected || typeof document === 'undefined') return;
  skeletonCssInjected = true;

  const styleId = 'sr-ascii-skeleton-css';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    ${typeof SKELETON_CSS !== 'undefined' ? SKELETON_CSS : (window.ASCII_SKELETON_CSS || '')}

    /* AsciiReveal Overlay & Loading State */
    .ar-skeleton-overlay {
      position: absolute;
      inset: 0;
      z-index: 25;
      pointer-events: none;
      border-radius: inherit;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 1.25rem;
      overflow: hidden;
      background: rgba(9, 9, 11, 0.84);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s ease;
    }

    html.light .ar-skeleton-overlay {
      background: rgba(245, 245, 247, 0.88);
    }

    [data-ar-loading="true"] {
      position: relative !important;
    }

    [data-ar-loading="true"] > *:not(.ar-skeleton-overlay):not(.ar-overlay) {
      opacity: 0.12 !important;
      filter: blur(1.5px) !important;
      pointer-events: none !important;
      transition: opacity 0.3s ease, filter 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

/**
 * AsciiSkeleton Component
 * Generates and mounts an animated ASCII Skeleton with variant='dither'
 */
export function AsciiSkeleton(options = {}) {
  const {
    variant = 'dither',
    lines = 3,
    widths = ['100%', '92%', '68%'],
    rows,
    width,
    height,
    circle = false,
    animate = true,
    seed = Math.floor(Math.random() * 1000)
  } = options;

  ensureSkeletonCSS();

  const getHTMLFn = () => {
    if (typeof asciiSkeletonHTML === 'function') return asciiSkeletonHTML;
    if (typeof window !== 'undefined' && typeof window.asciiSkeletonHTML === 'function') return window.asciiSkeletonHTML;
    return null;
  };

  const htmlFn = getHTMLFn();
  if (!htmlFn) return document.createElement('div');

  const rawHTML = htmlFn({
    variant,
    lines,
    widths,
    rows,
    animate,
    seed,
    css: false
  });

  const wrap = document.createElement('div');
  wrap.className = 'ar-skeleton-item w-full';
  if (width) wrap.style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) wrap.style.height = typeof height === 'number' ? `${height}px` : height;
  if (circle) wrap.style.borderRadius = '9999px';
  wrap.innerHTML = rawHTML;

  const skeletonSpan = wrap.querySelector('[data-ars-animate]');
  if (skeletonSpan && animate) {
    setTimeout(() => {
      const animFn = window.animateSkeleton || animateSkeleton;
      if (typeof animFn === 'function') {
        try { animFn(skeletonSpan); } catch (_) {}
      }
    }, 0);
  }

  return wrap;
}

/**
 * AsciiReveal Component Controller
 * Coordinates between <AsciiSkeleton variant="dither" /> and preset="decode"
 */
export function AsciiReveal(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;

  ensureSkeletonCSS();

  const state = {
    loading: options.loading !== undefined ? options.loading : true,
    preset: options.preset || 'decode',
    variant: options.variant || 'dither',
    lines: options.lines || 3,
    rows: options.rows || null,
    widths: options.widths || ['100%', '90%', '70%'],
    speed: options.speed || 1.2,
    origin: options.origin || 'center',
    surface: !!options.surface,
    ctrl: null,
    overlay: null
  };

  if (state.surface && !el.hasAttribute('data-ascii')) {
    el.setAttribute('data-ascii', 'surface');
  }

  function renderSkeleton() {
    if (state.overlay && state.overlay.isConnected) return;

    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }

    const overlay = document.createElement('div');
    overlay.className = 'ar-skeleton-overlay';
    overlay.setAttribute('data-ascii-skeleton-overlay', 'true');
    overlay.setAttribute('aria-hidden', 'true');

    const skeletonNode = AsciiSkeleton({
      variant: state.variant,
      lines: state.lines,
      widths: state.widths,
      rows: state.rows,
      animate: true
    });

    overlay.appendChild(skeletonNode);
    el.appendChild(overlay);
    state.overlay = overlay;

    el.setAttribute('data-ar-loading', 'true');
  }

  function removeSkeleton() {
    el.removeAttribute('data-ar-loading');
    if (!state.overlay) return;
    const ov = state.overlay;
    state.overlay = null;
    ov.style.transition = 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    ov.style.opacity = '0';
    setTimeout(() => {
      if (ov.isConnected) ov.remove();
    }, 300);
  }

  function decodeIn() {
    removeSkeleton();
    const revealFn = window.createAsciiReveal || createAsciiReveal;
    if (typeof revealFn !== 'function') return;

    try {
      if (!state.ctrl) {
        state.ctrl = revealFn(el, {
          preset: state.preset,
          duration: 'fast',
          speed: state.speed,
          origin: state.origin
        });
      }
      state.ctrl.reveal().catch(() => {});
    } catch (err) {
      console.warn('[AsciiReveal Decode]', el, err);
    }
  }

  function setLoading(loadingState) {
    state.loading = !!loadingState;
    if (state.loading) {
      renderSkeleton();
    } else {
      decodeIn();
    }
  }

  if (state.loading) {
    renderSkeleton();
  } else {
    decodeIn();
  }

  return {
    element: el,
    setLoading,
    reveal: () => decodeIn(),
    destroy: () => {
      removeSkeleton();
      if (state.ctrl) state.ctrl.destroy();
    }
  };
}

// Global registry of active AsciiReveal instances
const activeRevealInstances = [];

/**
 * Initializes AsciiReveal with dither skeleton on all elements across the entire website
 */
export function initAsciiRevealLoader() {
  ensureSkeletonCSS();

  // Selected component specifications across the entire site
  const siteTargets = [
    { sel: '#site-header .header-island-inner', origin: 'center', lines: 1, delay: 0, speed: 1.3 },
    { sel: '[data-od-id="hero"] .hero-headline-wrap, [data-od-id="hero"] h1', origin: 'top-left', lines: 2, delay: 40, speed: 1.2 },
    { sel: '[data-od-id="hero"] p', origin: 'top-left', lines: 2, delay: 80, speed: 1.2 },
    { sel: '#hero-mock-window', origin: 'top-left', rows: 8, surface: true, delay: 120, speed: 1.15 },
    { sel: '#hero-mock-window .kpi-card', origin: 'center', rows: 3, surface: true, delay: 160, speed: 1.2 },
    { sel: '[data-od-id="sorun"] .apple-card', origin: 'center', rows: 4, surface: true, delay: 200, speed: 1.15 },
    { sel: '#ekstre-laboratuvari .apple-card', origin: 'center', rows: 6, surface: true, delay: 240, speed: 1.15 },
    { sel: '#hesaplayici .apple-card', origin: 'center', rows: 6, surface: true, delay: 280, speed: 1.15 },
    { sel: '#karsilastirma .apple-card', origin: 'center', rows: 6, surface: true, delay: 320, speed: 1.15 },
    { sel: '#ozellikler .apple-card', origin: 'center', rows: 5, surface: true, delay: 360, speed: 1.15 },
    { sel: '[data-od-id="mimari"] .apple-card, #mimari .apple-card', origin: 'center', rows: 5, surface: true, delay: 400, speed: 1.15 },
    { sel: '#isletim-sistemleri .apple-card', origin: 'center', rows: 5, surface: true, delay: 440, speed: 1.15 },
    { sel: '#hash-verifier .apple-card', origin: 'center', rows: 4, surface: true, delay: 480, speed: 1.15 },
    { sel: '#fiyatlandirma .apple-card', origin: 'center', rows: 6, surface: true, delay: 520, speed: 1.15 },
    { sel: '#faq .apple-card, #faq details', origin: 'center', lines: 2, surface: true, delay: 560, speed: 1.15 },
    { sel: '#sr-scrollspy', origin: 'center', lines: 1, delay: 600, speed: 1.25 },
    { sel: '#site-footer', origin: 'center', lines: 2, delay: 640, speed: 1.15 }
  ];

  // Mark all numeric KPIs with data-ascii-digits
  const digitSelectors = [
    '#hero-monthly-burn',
    '#hero-detected-leaks',
    '#hero-annual-waste',
    '#out-1yr',
    '#out-5yr',
    '.stat-number',
    '[data-digits]'
  ];
  digitSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (el) el.setAttribute('data-ascii-digits', 'true');
    });
  });

  // Mark interactive buttons and icons with data-ascii="fade"
  const fadeSelectors = [
    '.lang-btn',
    '.currency-btn',
    '#theme-toggle',
    '.direct-kill-btn',
    '.calc-preset-btn',
    '#hero-demo-reset',
    '#tiles-loader-btn'
  ];
  fadeSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (el && !el.hasAttribute('data-ascii')) el.setAttribute('data-ascii', 'fade');
    });
  });

  // Reset instances if re-initializing
  while (activeRevealInstances.length) {
    const item = activeRevealInstances.pop();
    if (item && item.instance && typeof item.instance.destroy === 'function') {
      item.instance.destroy();
    }
  }

  // 1. Initial State: loading = true (!data) -> render <AsciiSkeleton variant="dither" />
  const isLoaded = !!window.srTilesLoaderDone;
  siteTargets.forEach(spec => {
    const els = document.querySelectorAll(spec.sel);
    els.forEach(el => {
      if (!el || el.closest('.hidden')) return;
      const instance = AsciiReveal(el, {
        loading: !isLoaded,
        preset: 'decode',
        variant: 'dither',
        lines: spec.lines || 3,
        rows: spec.rows || null,
        surface: !!spec.surface,
        speed: spec.speed || 1.2,
        origin: spec.origin || 'center'
      });
      if (instance) {
        activeRevealInstances.push({ instance, delay: spec.delay || 0 });
      }
    });
  });

  // Start skeleton scan canvas animation
  const startSkeletonAnim = window.animateSkeletons || animateSkeletons;
  if (typeof startSkeletonAnim === 'function') {
    try { startSkeletonAnim(document); } catch (_) {}
  }

  // 2. Data Ready: Transition from <AsciiSkeleton variant="dither" /> to live UI with preset="decode"
  function triggerDecodeCascade() {
    activeRevealInstances.forEach(({ instance, delay }) => {
      setTimeout(() => {
        instance.setLoading(false); // data ready: replaces skeleton with real UI and triggers decode scramble
      }, delay);
    });
  }

  if (isLoaded) {
    triggerDecodeCascade();
  } else {
    window.addEventListener('subradar:tiles-loader-complete', triggerDecodeCascade, { once: true });
  }

  // Replay handler: Re-engages loading state (!data) with dither skeletons, then decodes again
  window.addEventListener('subradar:tiles-loader-start', () => {
    activeRevealInstances.forEach(({ instance }) => {
      instance.setLoading(true); // reset to <AsciiSkeleton variant="dither" />
    });
    const restartAnim = window.animateSkeletons || animateSkeletons;
    if (typeof restartAnim === 'function') {
      try { restartAnim(document); } catch (_) {}
    }
    window.addEventListener('subradar:tiles-loader-complete', triggerDecodeCascade, { once: true });
  });
}

// Global exposure for non-module usage
if (typeof window !== 'undefined') {
  window.AsciiSkeleton = AsciiSkeleton;
  window.AsciiReveal = AsciiReveal;
  window.srInitAsciiRevealLoader = initAsciiRevealLoader;
}
