/**
 * SubRadar — Originkit "Tiles Loader" Component
 * Direct Vanilla JS Port of Originkit Tiles Loader (@originkit/tiles-loader)
 * 
 * Features:
 * - Dynamic cell grid with SHORT_SIDE = 7 calculation
 * - Seeded pseudo-random tile inking animation (edRand + edSeg + edLoadCurve)
 * - Tabular numbers difference blend mode counter (0% -> 100%)
 * - Diagonal distance reveal wipe (scale 1 - e)
 * - Seamless handoff to SubRadar ASCII Reveal & Dither Engine
 */

const ED_FADE_S = 0.35;
const REVEAL_S = 1.15;
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
  return (t) => {
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
const edOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const edInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function initTilesLoader(options = {}) {
  const root = document.getElementById('sr-tiles-loader');
  if (!root) return;

  const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minTime = reduced ? 0.5 : (options.minTime || 1.25);
  const revealS = reduced ? 0.35 : (options.revealS || REVEAL_S);

  const isDark = document.documentElement.classList.contains('dark');
  const background = options.background || (isDark ? '#09090b' : '#EEEAE3');
  const accent = options.accent || (isDark ? '#f4f4f5' : '#151412');

  let gridCols = 11;
  let gridRows = 7;
  let count = gridCols * gridRows;
  let order = [];
  let tileEls = [];
  let paperEls = [];

  const countEl = document.getElementById('sr-tiles-counter');
  const numEl = document.getElementById('sr-tiles-num');
  const gridContainer = document.getElementById('sr-tiles-grid') || root;

  function buildGrid(newCols, newRows) {
    gridCols = newCols;
    gridRows = newRows;
    count = gridCols * gridRows;

    // Seeded random order
    const r = edRand(count * 7919 + 13);
    order = Array.from({ length: count }, () => r() * (1 - INK_WINDOW));

    // Clear and rebuild tiles
    gridContainer.innerHTML = '';
    tileEls = [];
    paperEls = [];

    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const c = i % gridCols;
      const rIdx = Math.floor(i / gridCols);

      const tile = document.createElement('div');
      tile.className = 'sr-tile';
      tile.style.cssText = `
        position: absolute;
        left: ${(c * 100) / gridCols}%;
        top: ${(rIdx * 100) / gridRows}%;
        width: calc(${100 / gridCols}% + 1px);
        height: calc(${100 / gridRows}% + 1px);
        background: ${accent};
        transform-origin: center center;
        will-change: transform;
      `;

      const paper = document.createElement('div');
      paper.className = 'sr-tile-paper';
      paper.style.cssText = `
        position: absolute;
        inset: 0;
        background: ${background};
        opacity: 1;
        will-change: opacity;
      `;

      tile.appendChild(paper);
      frag.appendChild(tile);
      tileEls.push(tile);
      paperEls.push(paper);
    }
    gridContainer.appendChild(frag);
  }

  function updateDimensions() {
    const w = root.offsetWidth || window.innerWidth;
    const h = root.offsetHeight || window.innerHeight;
    if (!w || !h) return;
    const cell = Math.min(w, h) / SHORT_SIDE;
    const nextCols = Math.max(1, Math.round(w / cell));
    const nextRows = Math.max(1, Math.round(h / cell));
    if (nextCols !== gridCols || nextRows !== gridRows || tileEls.length === 0) {
      buildGrid(nextCols, nextRows);
    }
  }

  updateDimensions();
  window.addEventListener('resize', updateDimensions, { passive: true });

  // Allow click/tap/key to fast-forward loader if user desires
  let fastForward = false;
  const skipHandler = (e) => {
    if (e.type === 'keydown' && e.key !== 'Escape' && e.key !== ' ' && e.key !== 'Enter') return;
    fastForward = true;
  };
  root.addEventListener('click', skipHandler);
  window.addEventListener('keydown', skipHandler);

  let t = 0;
  let progress = 0;
  let revealAt = -1;
  let finished = false;
  let loadS = minTime;
  let curve = edLoadCurve(7, loadS);
  let lastTime = -1;
  let rafId = 0;

  function renderFrame(dt) {
    const reveal = revealAt < 0 ? 0 : edClamp((t - revealAt) / revealS);

    // Update each tile's inking and reveal scaling
    for (let i = 0; i < count; i++) {
      const paper = paperEls[i];
      if (paper) {
        paper.style.opacity = String(1 - edSeg(progress, order[i], order[i] + INK_WINDOW));
      }

      const tile = tileEls[i];
      if (tile) {
        const c = i % gridCols;
        const rIdx = Math.floor(i / gridCols);
        const d = 0.5 * (gridCols > 1 ? c / (gridCols - 1) : 0) + 0.5 * (gridRows > 1 ? (gridRows - 1 - rIdx) / (gridRows - 1) : 0);
        const e = edInOutCubic(edSeg(reveal, d * 0.55, d * 0.55 + 0.45));
        tile.style.transform = `scale(${1 - e})`;
      }
    }

    // Update center counter
    if (numEl) {
      const digits = String(Math.round(progress * 100));
      if (numEl.textContent !== digits) numEl.textContent = digits;
    }
    if (countEl) {
      countEl.style.opacity = String(edOutCubic(edSeg(t, 0.08, 0.7)) * (1 - edSeg(reveal, 0, 0.15)));
    }
  }

  function tick(now) {
    if (finished) return;
    const dt = lastTime < 0 ? 0 : Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    t += fastForward ? dt * 3.5 : dt;

    if (revealAt < 0) {
      const target = Math.min(curve(t), edRealLoad());
      progress = target >= 1 ? 1 : Math.min(target, progress + (fastForward ? dt * 4 : dt * 1.5));
      if ((progress >= 1 && t >= loadS) || (fastForward && t >= 0.4)) {
        progress = 1;
        revealAt = t;
      }
    }

    renderFrame(dt);

    // End of reveal
    if (revealAt >= 0 && t - revealAt >= revealS) {
      finished = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateDimensions);
      root.removeEventListener('click', skipHandler);
      window.removeEventListener('keydown', skipHandler);

      root.style.transition = `opacity ${ED_FADE_S}s ease`;
      root.style.opacity = '0';
      root.style.pointerEvents = 'none';

      setTimeout(() => {
        root.style.display = 'none';
        root.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('sr-loading-lock');

        // Trigger onComplete callback (e.g. SubRadar ASCII Reveal Engine)
        if (typeof options.onComplete === 'function') {
          options.onComplete();
        } else if (typeof window.srInitAsciiRevealLoader === 'function') {
          window.srInitAsciiRevealLoader();
        }
      }, ED_FADE_S * 1000);
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  // Lock scroll while loader is active
  document.body.classList.add('sr-loading-lock');
  renderFrame(0);
  rafId = requestAnimationFrame(tick);
}

export function playTilesLoader(options = {}) {
  const root = document.getElementById('sr-tiles-loader');
  if (!root) return;
  root.style.display = 'block';
  root.style.opacity = '1';
  root.style.pointerEvents = 'auto';
  root.removeAttribute('aria-hidden');
  initTilesLoader({
    minTime: options.minTime || 1.8,
    revealS: options.revealS || 1.3,
    ...options
  });
}

// Global exposure
if (typeof window !== 'undefined') {
  window.srInitTilesLoader = initTilesLoader;
  window.srPlayTilesLoader = playTilesLoader;
}
