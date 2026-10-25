/**
 * SubRadar — Ascii Reveal & Ascii Skeleton Engine (Refined & Polished)
 * Powered by ascii-reveal (quanhoangindex/ascii-reveal)
 * 
 * Implements the component pattern:
 * <AsciiReveal loading={!data} preset="decode">
 *   {data ? <Profile data={data} /> : <AsciiSkeleton variant="dither" />}
 * </AsciiReveal>
 *
 * Timing:
 * - Originkit Tiles Loader finishes.
 * - Deliberate aesthetic pause of 1.3 seconds (1-1.5s range) where the layout
 *   and dither skeletons settle.
 * - Then, high-tech text decoding animation (preset="decode") initiates in a smooth,
 *   staggered cascade with emerald lock-in flashes (--ascii-flash).
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

    /* AsciiReveal Design Tokens */
    :root {
      --ascii-font: "SF Mono", "Geist Mono", "JetBrains Mono", Menlo, Consolas, monospace;
      --ascii-accent: #10b981;
      --ascii-flash: rgb(16, 185, 129);
      --ascii-glyph: rgba(255, 255, 255, 0.42);
      --ascii-surface: rgb(24, 24, 27);
      --ascii-skeleton: rgba(255, 255, 255, 0.38);
    }

    html.light {
      --ascii-glyph: rgba(0, 0, 0, 0.38);
      --ascii-surface: rgb(240, 240, 242);
      --ascii-flash: rgb(5, 150, 105);
      --ascii-skeleton: rgba(0, 0, 0, 0.32);
    }

    /* Refined AsciiSkeleton Overlay */
    .ar-skeleton-overlay {
      position: absolute;
      inset: 0;
      z-index: 20;
      pointer-events: none;
      border-radius: inherit;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 1.25rem 1.5rem;
      overflow: hidden;
      background: rgba(9, 9, 11, 0.65);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      opacity: 1;
      transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s ease;
    }

    html.light .ar-skeleton-overlay {
      background: rgba(245, 245, 247, 0.72);
    }

    /* Muted content while skeleton is active: zero layout shift */
    [data-ar-loading="true"] {
      position: relative !important;
    }

    [data-ar-loading="true"] > *:not(.ar-skeleton-overlay):not(.ar-overlay) {
      opacity: 0.1 !important;
      filter: blur(1px) !important;
      user-select: none !important;
      pointer-events: none !important;
      transition: opacity 0.4s ease, filter 0.4s ease;
    }

    [data-ar-loading="false"] > *:not(.ar-skeleton-overlay):not(.ar-overlay) {
      opacity: 1 !important;
      filter: none !important;
      pointer-events: auto !important;
      transition: opacity 0.4s ease, filter 0.4s ease;
    }

    .ars {
      max-width: 100%;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
}

/**
 * AsciiSkeleton Component
 * Generates an animated ASCII Skeleton with variant='dither'
 */
export function AsciiSkeleton(options = {}) {
  const {
    variant = 'dither',
    lines = 3,
    widths = ['100%', '88%', '65%'],
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
    widths: options.widths || ['100%', '88%', '65%'],
    speed: options.speed || 1.15,
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
    el.setAttribute('data-ar-loading', 'false');
    if (!state.overlay) return;
    const ov = state.overlay;
    state.overlay = null;
    ov.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    ov.style.opacity = '0';
    setTimeout(() => {
      if (ov.isConnected) ov.remove();
    }, 420);
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
      if (state.ctrl) {
        try { state.ctrl.destroy(); } catch (_) {}
      }
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

  // Distinct, non-overlapping target specifications across the entire site
  const siteTargets = [
    { sel: '#site-header .header-island-inner', origin: 'center', lines: 1, delay: 0, speed: 1.3 },
    { sel: '#hero-title', origin: 'top-left', lines: 2, delay: 60, speed: 1.2 },
    { sel: '#hero-desc', origin: 'top-left', lines: 2, delay: 120, speed: 1.2 },
    { sel: '#hero-cta-group', origin: 'top-left', lines: 1, delay: 180, speed: 1.2 },
    { sel: '#hero-mock-window', origin: 'top-left', rows: 12, surface: true, delay: 240, speed: 1.15 },
    { sel: '[data-od-id="sorun"] .grid > div', origin: 'center', rows: 4, surface: true, delay: 320, speed: 1.15 },
    { sel: '#ekstre-laboratuvari .apple-card', origin: 'center', rows: 6, surface: true, delay: 400, speed: 1.15 },
    { sel: '#hesaplayici .apple-card', origin: 'center', rows: 6, surface: true, delay: 480, speed: 1.15 },
    { sel: '#karsilastirma .apple-card', origin: 'center', rows: 6, surface: true, delay: 560, speed: 1.15 },
    { sel: '#ozellikler .apple-card', origin: 'center', rows: 5, surface: true, delay: 640, speed: 1.15 },
    { sel: '[data-od-id="mimari"] .apple-card, #mimari .apple-card', origin: 'center', rows: 5, surface: true, delay: 720, speed: 1.15 },
    { sel: '#isletim-sistemleri .apple-card', origin: 'center', rows: 5, surface: true, delay: 800, speed: 1.15 },
    { sel: '#hash-verifier .apple-card', origin: 'center', rows: 4, surface: true, delay: 880, speed: 1.15 },
    { sel: '#fiyatlandirma .apple-card', origin: 'center', rows: 6, surface: true, delay: 960, speed: 1.15 },
    { sel: '#faq .apple-card, #faq details', origin: 'center', lines: 2, surface: true, delay: 1040, speed: 1.15 },
    { sel: '#sr-scrollspy', origin: 'center', lines: 1, delay: 1100, speed: 1.25 },
    { sel: '#site-footer', origin: 'center', lines: 2, delay: 1160, speed: 1.15 }
  ];

  // Mark all numeric KPIs with data-ascii-digits for clean numeric scrambling
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
    if (item) {
      if (item.observer) {
        try { item.observer.disconnect(); } catch (_) {}
      }
      if (item.instance && typeof item.instance.destroy === 'function') {
        try { item.instance.destroy(); } catch (_) {}
      }
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
        speed: spec.speed || 1.15,
        origin: spec.origin || 'center'
      });
      if (instance) {
        activeRevealInstances.push({ instance, delay: spec.delay || 0, decoded: false });
      }
    });
  });

  // Start skeleton scan canvas animation
  const startSkeletonAnim = window.animateSkeletons || animateSkeletons;
  if (typeof startSkeletonAnim === 'function') {
    try { startSkeletonAnim(document); } catch (_) {}
  }

  // Helper to decode a single target
  function decodeTarget(item) {
    if (item.decoded) return;
    item.decoded = true;
    item.instance.setLoading(false);
  }

  // 2. Data Ready: Delay 1.3 seconds (1-1.5s as requested) after Tiles Loader finishes
  const POST_LOADER_DELAY_MS = 1300;

  function triggerDecodeCascade() {
    const vh = window.innerHeight;
    activeRevealInstances.forEach(item => {
      const el = item.instance.element;
      const rect = el.getBoundingClientRect();
      const isAboveFold = rect.top < vh * 0.95 && rect.bottom > 0;

      if (isAboveFold) {
        setTimeout(() => {
          decodeTarget(item);
        }, item.delay);
      } else {
        // Below the fold: reveal gracefully when scrolled into view
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                obs.disconnect();
                setTimeout(() => {
                  decodeTarget(item);
                }, 50);
              }
            });
          }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
          observer.observe(el);
          item.observer = observer;
        } else {
          setTimeout(() => {
            decodeTarget(item);
          }, item.delay + 300);
        }
      }
    });
  }

  if (isLoaded) {
    // If already loaded, trigger after standard aesthetic pause
    setTimeout(triggerDecodeCascade, POST_LOADER_DELAY_MS);
  } else {
    // Wait for Tiles Loader completion event, then wait 1.3 seconds before decoding
    window.addEventListener('subradar:tiles-loader-complete', () => {
      console.log('[AsciiReveal] Tiles loader complete. Waiting 1.3s before starting decode animation...');
      setTimeout(triggerDecodeCascade, POST_LOADER_DELAY_MS);
    }, { once: true });
  }

  // Replay handler: Re-engages loading state (!data) with dither skeletons, then decodes again
  window.addEventListener('subradar:tiles-loader-start', () => {
    activeRevealInstances.forEach(item => {
      item.decoded = false;
      if (item.observer) {
        try { item.observer.disconnect(); } catch (_) {}
      }
      item.instance.setLoading(true); // reset to <AsciiSkeleton variant="dither" />
    });
    const restartAnim = window.animateSkeletons || animateSkeletons;
    if (typeof restartAnim === 'function') {
      try { restartAnim(document); } catch (_) {}
    }
    window.addEventListener('subradar:tiles-loader-complete', () => {
      setTimeout(triggerDecodeCascade, POST_LOADER_DELAY_MS);
    }, { once: true });
  });
}

// Global exposure for non-module usage
if (typeof window !== 'undefined') {
  window.AsciiSkeleton = AsciiSkeleton;
  window.AsciiReveal = AsciiReveal;
  window.srInitAsciiRevealLoader = initAsciiRevealLoader;
}
