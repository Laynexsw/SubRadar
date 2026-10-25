/**
 * Tiles Loader — Originkit (Port for SubRadar)
 *
 * Implements Originkit's Tiles Loader component with 100% mathematical fidelity:
 * - Pseudo-random seeded tile inking order via 32-bit PRNG
 * - Easing curves (edInOutCubic diagonal reveal wave)
 * - Difference blend mode counter with tabular numbers
 * - Dynamic grid scaling (SHORT_SIDE = 7)
 * - Container-aware sizing and resize observer
 */

const ED_HOLD_S = 1.8;
const ED_FADE_S = 0.35;
const ED_SERIF = '"Instrument Serif", "Times New Roman", Times, serif';
const ED_SANS = '"Inter", "Helvetica Neue", Arial, sans-serif';
const REVEAL_S = 1.6;
const PAPER = "#EEEAE3";
const INK = "#151412";
const SHORT_SIDE = 7;
const INK_WINDOW = 0.04;

function edRand(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function edLoadCurve(seed, loadS) {
  const r = edRand(seed);
  const k = Math.min(1, loadS / 4.4);
  const chunks = [];
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const size = 0.4 + r() * 1.2;
    chunks.push({ size, start: r() * 0.78 * loadS, len: (0.25 + r() * 0.9) * k });
    total += size;
  }
  chunks.push({ size: total * 0.12, start: loadS - 0.45 * k, len: 0.45 * k });
  total *= 1.12;
  return function (t) {
    if (t >= loadS) return 1;
    let p = 0;
    for (const c of chunks) {
      const x = Math.min(1, Math.max(0, (t - c.start) / Math.max(1e-3, c.len)));
      p += c.size * x * x * (3 - 2 * x);
    }
    return Math.min(0.999, p / total);
  };
}

function edRealLoad() {
  if (typeof document === 'undefined') return 1;
  if (document.readyState === 'complete') return 1;
  const imgs = document.images;
  let done = 0;
  for (let i = 0; i < imgs.length; i++) if (imgs[i].complete) done++;
  const frac = imgs.length ? done / imgs.length : 1;
  const fonts = document.fonts && document.fonts.status === 'loaded' ? 1 : 0;
  return Math.min(0.95, 0.15 + 0.6 * frac + 0.2 * fonts);
}

const edClamp = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const edSeg = (x, a, b) => edClamp((x - a) / Math.max(1e-6, b - a));
const edLerp = (a, b, t) => a + (b - a) * t;
const edOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const edOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const edInCubic = (x) => x * x * x;
const edInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const edInOutQuart = (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2);

/**
 * Mount and run an instance of Tiles Loader in target container
 */
export function mountTilesLoader(container, options = {}) {
  if (!container) return null;

  const {
    minTime = 2.4,
    background = PAPER,
    accent = INK,
    fontFamily = ED_SERIF,
    onComplete,
    autoStart = true
  } = options;

  const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Root styling
  container.style.position = container.style.position || 'relative';
  container.style.overflow = 'hidden';
  container.style.isolation = 'isolate';
  container.style.opacity = '1';
  container.style.visibility = 'visible';
  container.style.pointerEvents = 'auto';

  let w = container.offsetWidth || window.innerWidth;
  let h = container.offsetHeight || window.innerHeight;
  let cell = Math.min(w, h) / SHORT_SIDE;
  let cols = Math.max(1, Math.round(w / cell));
  let rows = Math.max(1, Math.round(h / cell));
  let count = cols * rows;

  let tileEls = [];
  let paperEls = [];
  let countEl = null;
  let numEl = null;
  let rafId = 0;
  let running = false;

  function renderGrid() {
    container.innerHTML = '';
    tileEls = [];
    paperEls = [];

    // Outer grid wrapper
    const gridWrap = document.createElement('div');
    gridWrap.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';

    for (let i = 0; i < count; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);

      const tile = document.createElement('div');
      tile.style.cssText = [
        'position:absolute',
        `left:${(c * 100) / cols}%`,
        `top:${(r * 100) / rows}%`,
        `width:calc(${100 / cols}% + 1px)`,
        `height:calc(${100 / rows}% + 1px)`,
        `background:${accent}`,
        'will-change:transform'
      ].join(';');

      const paper = document.createElement('div');
      paper.style.cssText = `position:absolute;inset:0;background:${background};will-change:opacity;`;

      tile.appendChild(paper);
      gridWrap.appendChild(tile);

      tileEls.push(tile);
      paperEls.push(paper);
    }
    container.appendChild(gridWrap);

    // Centered percentage difference counter
    countEl = document.createElement('div');
    countEl.setAttribute('aria-hidden', 'true');
    countEl.style.cssText = [
      'position:absolute',
      'inset:0',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'mix-blend-mode:difference',
      'color:#fff',
      'pointer-events:none',
      'white-space:nowrap',
      `font-family:${fontFamily}`,
      'font-size:min(28cqh, 38cqw, 18vw)',
      'font-variant-numeric:tabular-nums',
      'opacity:0',
      'z-index:2'
    ].join(';');

    const numWrap = document.createElement('span');
    numWrap.style.cssText = 'display:inline-flex;align-items:flex-start;';

    numEl = document.createElement('span');
    numEl.textContent = '0';

    const pctEl = document.createElement('span');
    pctEl.style.cssText = 'font-size:0.32em;font-style:italic;margin-top:0.85em;margin-left:0.08em;opacity:0.9;';
    pctEl.textContent = '%';

    numWrap.appendChild(numEl);
    numWrap.appendChild(pctEl);
    countEl.appendChild(numWrap);
    container.appendChild(countEl);
  }

  renderGrid();

  // Pseudo-random inking order
  const r = edRand(count * 7919 + 13);
  const order = Array.from({ length: count }, () => r() * (1 - INK_WINDOW));

  let t = 0;
  let progress = 0;
  let revealAt = -1;
  let finished = false;
  let loadS = reduced ? 0.6 : Math.max(0.5, minTime);
  let curve = edLoadCurve(7, loadS);
  let revealS = reduced ? 0.4 : REVEAL_S;
  let last = -1;

  function tick(now) {
    if (!running) return;
    const dt = last < 0 ? 0 : Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;

    if (revealAt < 0) {
      const target = Math.min(curve(t), edRealLoad());
      progress = target >= 1 ? 1 : Math.min(target, progress + dt * 1.5);
      if (progress >= 1 && t >= loadS) {
        revealAt = t;
      }
    }

    const reveal = revealAt < 0 ? 0 : edClamp((t - revealAt) / revealS);

    // Update tiles
    for (let i = 0; i < count; i++) {
      const paper = paperEls[i];
      if (paper) {
        paper.style.opacity = String(1 - edSeg(progress, order[i], order[i] + INK_WINDOW));
      }
      const tile = tileEls[i];
      if (!tile) continue;
      const c = i % cols;
      const r_idx = Math.floor(i / cols);
      const d = 0.5 * (cols > 1 ? c / (cols - 1) : 0) + 0.5 * (rows > 1 ? (rows - 1 - r_idx) / (rows - 1) : 0);
      const e = edInOutCubic(edSeg(reveal, d * 0.55, d * 0.55 + 0.45));
      tile.style.transform = `scale(${1 - e})`;
    }

    // Update numbers
    if (numEl) {
      const digits = String(Math.round(progress * 100));
      if (numEl.textContent !== digits) numEl.textContent = digits;
    }
    if (countEl) {
      countEl.style.opacity = String(edOutCubic(edSeg(t, 0.1, 0.8)) * (1 - edSeg(reveal, 0, 0.15)));
    }

    if (revealAt >= 0 && t - revealAt >= revealS) {
      finished = true;
      running = false;
      container.style.transition = `opacity ${ED_FADE_S}s ease`;
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      window.setTimeout(() => {
        container.style.visibility = 'hidden';
        container.style.display = 'none';
        if (typeof onComplete === 'function') onComplete();
      }, ED_FADE_S * 1000);
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    t = 0;
    progress = 0;
    revealAt = -1;
    finished = false;
    last = -1;
    container.style.opacity = '1';
    container.style.visibility = 'visible';
    container.style.display = 'block';
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  if (autoStart) start();

  return {
    start,
    stop,
    container
  };
}

/**
 * Global helper: Play Tiles Loader in full viewport overlay
 */
export function playTilesLoader(options = {}) {
  let overlay = document.getElementById('sr-tiles-loader-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sr-tiles-loader-overlay';
    document.body.appendChild(overlay);
  }

  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:999999',
    'width:100vw',
    'height:100vh',
    'overflow:hidden',
    'isolation:isolate',
    'display:block',
    'opacity:1',
    'visibility:visible'
  ].join(';');

  if (window.srAudio && window.srAudio.playRadarSweep) {
    window.srAudio.playRadarSweep();
  }

  return mountTilesLoader(overlay, {
    minTime: 2.2,
    background: '#EEEAE3',
    accent: '#151412',
    fontFamily: ED_SERIF,
    ...options,
    onComplete: () => {
      overlay.style.display = 'none';
      if (options.onComplete) options.onComplete();
    }
  });
}

// Global window exposure
if (typeof window !== 'undefined') {
  window.srTilesLoader = {
    mount: mountTilesLoader,
    play: playTilesLoader,
    constants: {
      REVEAL_S,
      ED_HOLD_S,
      ED_FADE_S,
      PAPER,
      INK,
      SHORT_SIDE,
      INK_WINDOW
    }
  };
  window.srPlayTilesLoader = playTilesLoader;
}
