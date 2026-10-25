/**
 * SubRadar — Ascii Reveal & Ascii Skeleton Engine (1.75s Full-Site Matrix Decode)
 * Powered by ascii-reveal (quanhoangindex/ascii-reveal)
 * 
 * Component Pattern:
 * <AsciiReveal loading={!data} preset="decode" duration="decode175">
 *   {data ? <Component data={data} /> : <AsciiSkeleton variant="dither" />}
 * </AsciiReveal>
 *
 * Requirements:
 * 1. Text loading/decode animation duration: exactly 1.75 seconds (1750ms).
 * 2. Every single text element and component across the entire website participates in this animation.
 * 3. Delicate 1.3-1.5s aesthetic pause after Originkit Tiles Loader finishes before decoding begins.
 * 4. Staggered, non-overlapping canvas layers to eliminate text jitter and character duplication.
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
      opacity: 0.12 !important;
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
 * Runs for exactly 1.75 seconds with duration="decode175" and speed=1.0
 */
export function AsciiReveal(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;

  ensureSkeletonCSS();

  const state = {
    loading: options.loading !== undefined ? options.loading : true,
    preset: options.preset || 'decode',
    duration: options.duration || 'decode175',
    variant: options.variant || 'dither',
    lines: options.lines || 3,
    rows: options.rows || null,
    widths: options.widths || ['100%', '88%', '65%'],
    speed: options.speed || 1.0, // scale = 1.0 -> exactly 1.75s
    origin: options.origin || 'center',
    surface: !!options.surface,
    showSkeleton: options.showSkeleton !== undefined ? !!options.showSkeleton : !!options.surface,
    ctrl: null,
    overlay: null
  };

  if (state.surface && !el.hasAttribute('data-ascii')) {
    el.setAttribute('data-ascii', 'surface');
  }

  function renderSkeleton() {
    if (!state.showSkeleton) {
      el.setAttribute('data-ar-loading', 'true');
      return;
    }
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
          duration: 'decode175', // Exactly 1.75s animation profile
          speed: 1.0,            // Guarantee 1.75s (1750ms) duration
          origin: state.origin
        });
      }
      state.ctrl.reveal({ duration: 'decode175', speed: 1.0 }).catch(() => {});
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
 * Initializes AsciiReveal on EVERY single text element and component across the entire website
 * Duration: exactly 1.75 seconds
 */
export function initAsciiRevealLoader() {
  ensureSkeletonCSS();

  // Comprehensive, distinct, non-overlapping target specifications covering all text & components
  const siteTargets = [
    // 1. Header Island & Actions
    { sel: '#site-header .header-island-inner', origin: 'center', lines: 1, delay: 0, showSkeleton: false },

    // 2. Hero Elements (Badge, Headline, Description, Buttons, Trust Badges, App Window)
    { sel: '#hero > div:first-child, [data-od-id="hero"] > div:first-child', origin: 'center', lines: 1, delay: 40, showSkeleton: false },
    { sel: '#hero h1, [data-od-id="hero"] h1', origin: 'top-left', lines: 2, delay: 80, showSkeleton: false },
    { sel: '#hero p, [data-od-id="hero"] p', origin: 'top-left', lines: 2, delay: 120, showSkeleton: false },
    { sel: '#download', origin: 'center', lines: 1, delay: 160, showSkeleton: false },
    { sel: '[data-od-id="hero"] .flex.items-center.justify-center.gap-4', origin: 'center', lines: 1, delay: 200, showSkeleton: false },
    { sel: '#hero-mock-window', origin: 'top-left', rows: 12, surface: true, showSkeleton: true, delay: 240 },

    // 3. Problem Section (Left Column Copy + Right Column Big Stat & Quote)
    { sel: '[data-od-id="sorun"] [data-rv="left"]', origin: 'top-left', lines: 4, delay: 300, showSkeleton: false },
    { sel: '[data-od-id="sorun"] [data-rv="right"]', origin: 'center', lines: 3, delay: 340, showSkeleton: false },

    // 4. Statement Lab Section (Header + Interactive Lab Shell Card)
    { sel: '#ekstre-laboratuvari > div:first-child', origin: 'center', lines: 2, delay: 400, showSkeleton: false },
    { sel: '#ekstre-laboratuvari .apple-card', origin: 'center', rows: 6, surface: true, showSkeleton: true, delay: 440 },

    // 5. Waste Calculator Section (Header + Interactive Card)
    { sel: '#hesaplayici > header, #hesaplayici > div:first-child', origin: 'top-left', lines: 2, delay: 500, showSkeleton: false },
    { sel: '#hesaplayici .apple-card', origin: 'center', rows: 6, surface: true, showSkeleton: true, delay: 540 },

    // 6. Competitor Comparison Section (Header + Comparison Table Card)
    { sel: '#karsilastirma > div:first-child', origin: 'center', lines: 2, delay: 600, showSkeleton: false },
    { sel: '#karsilastirma .apple-card', origin: 'center', rows: 6, surface: true, showSkeleton: true, delay: 640 },

    // 7. Core Features Section (Header + Radar Scanner Graphic + 4 Feature Cards)
    { sel: '#ozellikler > div:first-child', origin: 'top-left', lines: 2, delay: 700, showSkeleton: false },
    { sel: '#radar-scanner-section', origin: 'center', rows: 6, surface: true, showSkeleton: true, delay: 740 },
    { sel: '#ozellikler .apple-card', origin: 'center', rows: 5, surface: true, showSkeleton: true, delay: 780 },

    // 8. Command Palette & Architecture (Header + Interactive Preview Card)
    { sel: '[data-od-id="komut-paleti"] > div:first-child, #komut-paleti > div:first-child', origin: 'center', lines: 2, delay: 840, showSkeleton: false },
    { sel: '#cmd-preview-box', origin: 'center', rows: 4, surface: true, showSkeleton: true, delay: 880 },

    // 9. OS Downloads Section (Header + macOS/Windows Cards + SHA-256 Verifier)
    { sel: '#isletim-sistemleri > div:first-child', origin: 'top-left', lines: 2, delay: 940, showSkeleton: false },
    { sel: '#isletim-sistemleri .apple-card:not(#hash-verifier-box)', origin: 'center', rows: 5, surface: true, showSkeleton: true, delay: 980 },
    { sel: '#hash-verifier-box', origin: 'center', rows: 4, surface: true, showSkeleton: true, delay: 1020 },

    // 10. Pricing Matrix (Header + Deal Pill + 3 Cards)
    { sel: '#fiyatlandirma > div:nth-of-type(1)', origin: 'center', lines: 2, delay: 1080, showSkeleton: false },
    { sel: '#fiyatlandirma > div:nth-of-type(2)', origin: 'center', lines: 1, delay: 1100, showSkeleton: false },
    { sel: '#fiyatlandirma .apple-card', origin: 'center', rows: 6, surface: true, showSkeleton: true, delay: 1140 },

    // 11. Final CTA / FAQ Section
    { sel: '[data-od-id="indir"], #hakkimizda', origin: 'center', lines: 3, delay: 1200, showSkeleton: false },

    // 12. Floating Scrollspy Dock
    { sel: '#sr-scrollspy', origin: 'center', lines: 1, delay: 1240, showSkeleton: false },

    // 13. Full Site Footer
    { sel: 'footer#footer, [data-od-id="footer"], footer', origin: 'center', lines: 2, delay: 1280, showSkeleton: false }
  ];

  // Mark all numeric KPIs with data-ascii-digits for clean numeric scrambling
  const digitSelectors = [
    '#hero-monthly-burn',
    '#hero-detected-leaks',
    '#hero-annual-waste',
    '#out-1yr',
    '#out-5yr',
    '.stat-number',
    '[data-digits]',
    '[data-usd]',
    '[data-mb]',
    '#radar-live-status',
    '#live-latency-display',
    '#footer-engine-ping'
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
    '#tiles-loader-btn',
    '.download-trigger-btn'
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

  // Set of attached elements to avoid duplicate registrations
  const attachedElements = new Set();

  // 1. Initial State: loading = true (!data) -> render <AsciiSkeleton variant="dither" />
  const isLoaded = !!window.srTilesLoaderDone;
  siteTargets.forEach(spec => {
    const els = document.querySelectorAll(spec.sel);
    els.forEach(el => {
      if (!el || el.closest('.hidden') || attachedElements.has(el)) return;
      attachedElements.add(el);
      const instance = AsciiReveal(el, {
        loading: !isLoaded,
        preset: 'decode',
        duration: 'decode175', // Exactly 1.75 seconds
        speed: 1.0,
        variant: 'dither',
        lines: spec.lines || 3,
        rows: spec.rows || null,
        surface: !!spec.surface,
        showSkeleton: spec.showSkeleton !== undefined ? spec.showSkeleton : !!spec.surface,
        origin: spec.origin || 'center'
      });
      if (instance) {
        activeRevealInstances.push({ instance, delay: spec.delay || 0, decoded: false });
      }
    });
  });

  // Dynamic discovery: ensure ANY remaining .apple-card or section card has AsciiReveal
  document.querySelectorAll('.apple-card').forEach((card, idx) => {
    if (!attachedElements.has(card) && !card.closest('#hero-mock-window') && !card.closest('.hidden')) {
      attachedElements.add(card);
      const instance = AsciiReveal(card, {
        loading: !isLoaded,
        preset: 'decode',
        duration: 'decode175',
        speed: 1.0,
        variant: 'dither',
        rows: 5,
        surface: true,
        showSkeleton: true,
        origin: 'center'
      });
      if (instance) {
        activeRevealInstances.push({ instance, delay: 600 + (idx * 40), decoded: false });
      }
    }
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

  // 2. Data Ready: Delay 1.3 seconds (1-1.5s range) after Tiles Loader finishes
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
        // Below the fold: reveal with 1.75s matrix scramble when scrolled into view
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
      console.log('[AsciiReveal] Tiles loader complete. Waiting 1.3s before starting 1.75s decode animation...');
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
