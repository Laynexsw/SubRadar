/**
 * SubRadar — Originkit "Vector Wordmark" Component
 * Direct Vanilla JS Port of Originkit Vector Wordmark (@originkit/vector-wordmark)
 * 
 * Features:
 * - Runtime dual-channel 2D atlas baking (Red = Solid fill, Green = Dotted vector stroke)
 * - Auto-fitting responsive font scaling (guarantees zero left/right clipping on all screens)
 * - Fullscreen WebGL fragment shader with cubed smoothstep pointer falloff
 * - Ghost silhouette retention in light mode for crystal-clear readability & high contrast
 * - Multi-tap radial ring blur with jittered sample offsets
 * - Drifting 3-handle rig snapping to 2nd-4th nearest lattice cells around cursor
 * - Real-time DOM coordinate telemetry chips ([X, Y]) tracked at 60/120fps
 * - Automatic simulated sweep when idle, seamless handoff to real pointer
 * - Theme-adaptive color palettes (Dark Obsidian / Light High-Contrast Charcoal with Emerald accents)
 */

(function () {
  const VERTEX_SHADER = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

  const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uMap;
uniform vec2 uRes;      // host box, css px
uniform vec2 uAtlas;    // drawn wordmark size, css px
uniform vec2 uPtr;      // eased pointer, screen uv
uniform float uReach;   // reveal radius, as a fraction of the host width
uniform vec3 uText;
uniform vec3 uShade;
uniform vec4 uAccent;   // rig colour; its alpha IS the rig intensity
uniform vec2 uV0;
uniform vec2 uV1;
uniform vec2 uV2;
uniform float uHalf;    // handle half-side, in y-normalised units
uniform float uIsLight; // 1.0 = light mode, 0.0 = dark mode

varying vec2 vUv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Multi-tap ring blur: taps on a ring at even angles, each pushed out by a
// random amount, so six taps read as a soft disc rather than a hexagon.
vec2 blurRG(vec2 uv, float e) {
    vec4 sum = vec4(0.0);
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float th = radians(fi / 6.0 * 360.0);
        vec2 dir = vec2(cos(th), sin(th));
        vec2 off = dir * (hash(vec2(fi, uv.x + uv.y)) + e);
        sum += texture2D(uMap, uv + off * e);
    }
    return (sum / 6.0).rg;
}

// Perpendicular distance to a segment, plus parameter along it for dash pattern
vec2 segment(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    vec2 ap = p - a;
    float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-8), 0.0, 1.0);
    return vec2(length(ap - ab * t), t);
}

float stroke(float d, float lw, float px) {
    return 1.0 - smoothstep(lw, lw + px, d);
}

float dashedLine(vec2 p, vec2 a, vec2 b, float lw, float px) {
    vec2 s = segment(p, a, b);
    float dash = step(0.5, fract(s.y * length(b - a) * 100.0));
    return stroke(s.x, lw, px) * dash;
}

float boxEdge(vec2 p, vec2 c, float h, float lw, float px) {
    vec2 q = abs(p - c) - vec2(h);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    return stroke(abs(d), lw, px);
}

void main() {
    float aspect = uRes.x / uRes.y;

    // Centred on both axes.
    vec2 E = (vUv * uRes - (uRes - uAtlas) * 0.5) / uAtlas;
    float inside = step(0.0, E.x) * step(E.x, 1.0) * step(0.0, E.y) * step(E.y, 1.0);
    vec2 safeUv = clamp(E, 0.0, 1.0);

    float b = clamp(1.0 - E.y * 3.5, 0.0, 1.0) * 0.008;
    vec2 soft = blurRG(safeUv, b);
    vec2 sharp = blurRG(safeUv, b * 0.1);

    float d = length((vUv - uPtr) / vec2(1.0, aspect));
    float k = 1.0 - pow(smoothstep(0.0, max(uReach, 1e-4), d), 3.0);

    // In light mode: retain a 30% ghost silhouette so the letters remain crisp and never look faint or washed out!
    // In dark mode: retain 12% ghost silhouette for deep glowing aesthetic.
    float ghost = uIsLight > 0.5 ? 0.30 : 0.12;
    float vectorLayer = max(sharp.g, soft.r * ghost);
    float mask = mix(soft.r, vectorLayer, k) * inside;

    vec3 fill = mix(uShade, uText, smoothstep(0.0, 1.0, E.y));

    // Rig space: x scaled by aspect so a cell and a handle stay square.
    vec2 P = vec2(vUv.x * aspect, vUv.y);
    float px = 1.0 / uRes.y;
    float lw = px * 0.22;
    float lines = max(
        max(dashedLine(P, uV0, uV1, lw, px), dashedLine(P, uV1, uV2, lw, px)),
        dashedLine(P, uV2, uV0, lw, px)
    );
    float boxes = max(
        max(boxEdge(P, uV0, uHalf, lw, px), boxEdge(P, uV1, uHalf, lw, px)),
        boxEdge(P, uV2, uHalf, lw, px)
    );
    float A = max(lines, boxes) * uAccent.a * (1.0 - vUv.y);

    // Everything premultiplied from here, so the canvas composites cleanly
    vec4 card = vec4(fill * mask, mask);
    vec4 comp = vec4(uAccent.rgb * A, A) + card * (1.0 - A);

    // Fade: In dark mode, smooth pow(y, 0.7) foot melt into dark background.
    // In light mode, preserve at least 58% baseline opacity so the bottom never vanishes into white!
    float fade = uIsLight > 0.5
        ? mix(0.58, 1.0, pow(clamp(E.y, 0.0, 1.0), 0.6))
        : pow(clamp(E.y, 0.0, 1.0), 0.7);

    gl_FragColor = comp * fade;
}
`;

  const MAX_DPR = 2;
  const MAX_TEX = 4096;
  const NUM_HANDLES = 3;
  const LATTICE_ASPECT = 0.6;
  const JITTER_X = 0.08;
  const JITTER_Y = 0.04;
  const ROT_X = 1.3;
  const ROT_Y = 1.3 * 1.3;
  const AUTO_SWEEP_X = 0.45;
  const AUTO_SWEEP_Y = 0.28;
  const AUTO_RESET_INTERVAL = 0.2;
  const DAMP_RATE = 20;
  const SPEED_SCALE = 50;
  const LABEL_OPACITY = 0.75;
  const STROKE_WIDTH_RATIO = 7 / 440;
  const STROKE_DASH_RATIO = 14 / 440;

  const clamp = (n, min, max) => (n < min ? min : n > max ? max : n);
  const fract = (n) => n - Math.floor(n);

  function parseColor(colorStr, fallback) {
    if (!colorStr) return fallback || [1, 1, 1, 1];
    const s = String(colorStr).trim();
    if (s.startsWith('#')) {
      let hex = s.slice(1);
      if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map((c) => c + c).join('');
      }
      if (hex.length === 6) hex += 'ff';
      if (hex.length !== 8) return fallback || [1, 1, 1, 1];
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
        parseInt(hex.slice(6, 8), 16) / 255,
      ];
    }
    const match = s.match(/^rgba?\(([^)]+)\)$/i);
    if (match) {
      const parts = match[1].split(/[\s,/]+/).filter(Boolean);
      if (parts.length >= 3) {
        return [
          parseFloat(parts[0]) / 255,
          parseFloat(parts[1]) / 255,
          parseFloat(parts[2]) / 255,
          parts[3] !== undefined ? parseFloat(parts[3]) : 1.0,
        ];
      }
    }
    return fallback || [1, 1, 1, 1];
  }

  function compileShader(gl, vert, frag) {
    const makeShader = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, makeShader(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, makeShader(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    return prog;
  }

  function formatFont(spec, size) {
    return `${spec.style} ${spec.weight} ${size}px ${spec.family}`;
  }

  function bakeAtlas(text, fontSpec, fontSize, dpr) {
    const dummy = document.createElement('canvas').getContext('2d');
    if (!dummy) return null;

    const applyFont = (ctx, sz) => {
      ctx.font = formatFont(fontSpec, sz);
      if ('letterSpacing' in ctx && fontSpec.letterSpacing) {
        try {
          ctx.letterSpacing = fontSpec.letterSpacing;
        } catch (_) {}
      }
    };

    const measure = (sz) => {
      applyFont(dummy, sz);
      const m = dummy.measureText(text);
      return {
        w: Math.max(1, m.width),
        asc: m.actualBoundingBoxAscent || sz * 0.8,
        desc: m.actualBoundingBoxDescent || sz * 0.22,
      };
    };

    let renderSize = Math.max(8, fontSize * dpr);
    let m = measure(renderSize);
    let pad = renderSize * 0.12;
    let scaleOver = Math.max((m.w + pad * 2) / MAX_TEX, (m.asc + m.desc + pad * 2) / MAX_TEX);
    if (scaleOver > 1) {
      renderSize = Math.max(8, renderSize / scaleOver);
      m = measure(renderSize);
      pad = renderSize * 0.12;
    }

    const w = Math.max(1, Math.ceil(m.w + pad * 2));
    const h = Math.max(1, Math.ceil(m.asc + m.desc + pad * 2));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    applyFont(ctx, renderSize);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.globalCompositeOperation = 'lighter';

    // Red channel: Solid fill
    ctx.fillStyle = '#ff0000';
    ctx.fillText(text, pad, pad + m.asc);

    // Green channel: Dotted vector outline with enhanced crispness
    const totalH = m.asc + m.desc;
    ctx.strokeStyle = '#00ff00';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(1.5, totalH * STROKE_WIDTH_RATIO);
    ctx.setLineDash([0, Math.max(3, totalH * STROKE_DASH_RATIO)]);
    ctx.strokeText(text, pad, pad + m.asc);

    const cssScale = fontSize / renderSize;
    return { canvas, cssW: w * cssScale, cssH: h * cssScale };
  }

  function initVectorWordmark(options) {
    const opts = options || {};
    const root = typeof opts.container === 'string'
      ? document.querySelector(opts.container)
      : opts.container || document.getElementById('sr-vector-wordmark');

    if (!root) return null;

    // Avoid double initialization
    if (root._srVectorWordmarkActive) return root._srVectorWordmarkActive;

    const canvas = root.querySelector('canvas') || document.createElement('canvas');
    if (!canvas.parentElement) {
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      root.appendChild(canvas);
    }

    // Ensure labels container
    let labelsWrap = root.querySelector('.sr-vector-labels');
    if (!labelsWrap) {
      labelsWrap = document.createElement('div');
      labelsWrap.className = 'sr-vector-labels absolute inset-0 pointer-events-none select-none z-10';
      root.appendChild(labelsWrap);
    }

    const labelNodes = [];
    labelsWrap.innerHTML = '';
    for (let i = 0; i < NUM_HANDLES; i++) {
      const lbl = document.createElement('div');
      lbl.className = 'sr-vector-chip font-mono text-[10px] tracking-wider transition-opacity duration-150';
      lbl.style.position = 'absolute';
      lbl.style.left = '0';
      lbl.style.top = '0';
      lbl.style.pointerEvents = 'none';
      lbl.style.whiteSpace = 'nowrap';
      lbl.style.opacity = '0';
      labelsWrap.appendChild(lbl);
      labelNodes.push(lbl);
    }

    const glOpts = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    };
    const gl = canvas.getContext('webgl2', glOpts) || canvas.getContext('webgl', glOpts);
    if (!gl) return null;

    const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
    const program = compileShader(gl, VERTEX_SHADER, FRAGMENT_SHADER);

    const locs = {
      map: gl.getUniformLocation(program, 'uMap'),
      res: gl.getUniformLocation(program, 'uRes'),
      atlas: gl.getUniformLocation(program, 'uAtlas'),
      ptr: gl.getUniformLocation(program, 'uPtr'),
      reach: gl.getUniformLocation(program, 'uReach'),
      text: gl.getUniformLocation(program, 'uText'),
      shade: gl.getUniformLocation(program, 'uShade'),
      accent: gl.getUniformLocation(program, 'uAccent'),
      v0: gl.getUniformLocation(program, 'uV0'),
      v1: gl.getUniformLocation(program, 'uV1'),
      v2: gl.getUniformLocation(program, 'uV2'),
      half: gl.getUniformLocation(program, 'uHalf'),
      isLight: gl.getUniformLocation(program, 'uIsLight'),
    };

    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Exact user requested text: SUB-RADAR
    const text = opts.text || 'SUB-RADAR';
    const fontSpec = {
      family: opts.fontFamily || 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      weight: opts.fontWeight || '900',
      style: opts.fontStyle || 'normal',
      size: opts.fontSize || 220,
      letterSpacing: opts.letterSpacing || '-0.035em',
    };

    const handleConfig = {
      size: opts.handleSize || 76,
      spread: opts.handleSpread || 25,
      labels: opts.showLabels !== false,
    };

    let isAlive = true;
    let width = Math.max(1, root.offsetWidth);
    let height = Math.max(1, root.offsetHeight);
    let needsResize = true;
    let dpr = 1;
    let pxWidth = 0;
    let pxHeight = 0;
    let atlasNormW = 1;
    let atlasNormH = 1;
    let bakedSig = '';

    // Auto-fit font size to guarantee text fits within available container with zero clipping on left/right
    const getScaledFontSize = () => {
      const dummy = document.createElement('canvas').getContext('2d');
      if (!dummy) return 160;
      dummy.font = formatFont(fontSpec, 100);
      const m = dummy.measureText(text);
      const textWidthAt100 = Math.max(1, m.width);
      const textHeightAt100 = 85;

      // Allow maximum 88% width so safe margins remain on left and right
      const maxW = width * 0.88;
      const maxH = height * 0.75;

      const sizeByWidth = (maxW / textWidthAt100) * 100;
      const sizeByHeight = (maxH / textHeightAt100) * 100;

      const fittedSize = Math.min(sizeByWidth, sizeByHeight);
      return Math.max(18, Math.min(230, fittedSize));
    };

    const updateSize = () => {
      width = Math.max(1, root.offsetWidth);
      height = Math.max(1, root.offsetHeight);
      dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      const pw = Math.max(1, Math.round(width * dpr));
      const ph = Math.max(1, Math.round(height * dpr));
      if (pw !== pxWidth || ph !== pxHeight) {
        pxWidth = pw;
        pxHeight = ph;
        canvas.width = pw;
        canvas.height = ph;
      }
    };

    const rebake = () => {
      const curSz = Math.max(8, getScaledFontSize());
      const baked = bakeAtlas(text, fontSpec, curSz, dpr);
      if (!baked) return;

      atlasNormW = Math.max(1e-4, baked.cssW / curSz);
      atlasNormH = Math.max(1e-4, baked.cssH / curSz);

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, baked.canvas);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

      const cw = baked.canvas.width;
      const ch = baked.canvas.height;
      const isPowerOfTwo = (cw & (cw - 1)) === 0 && (ch & (ch - 1)) === 0;
      if (isWebGL2 || isPowerOfTwo) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };

    const rawPointer = { x: -0.5, y: 0.5 };
    const easedPointer = { x: -0.5, y: 0.5 };
    const targetHandles = [];
    const handlePositions = [];
    for (let i = 0; i < NUM_HANDLES; i++) {
      targetHandles.push({ x: -0.5, y: 0.5 });
      handlePositions.push({ x: -0.5, y: 0.5 });
    }

    let hasRealPointer = false;
    let autoTimer = 0;
    let autoPhase = 0;

    const solveLattice = (px, py, cellW, cellH) => {
      const gx = Math.floor(px / cellW);
      const gy = Math.floor(py / cellH);
      const cand = [];
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const cx = (gx + ox + 0.5) * cellW;
          const cy = (gy + oy + 0.5) * cellH;
          cand.push({ x: cx, y: cy, d: Math.hypot(cx - px, cy - py) });
        }
      }
      cand.sort((a, b) => a.d - b.d);
      for (let m = 0; m < NUM_HANDLES; m++) {
        targetHandles[m].x = cand[m + 1].x;
        targetHandles[m].y = cand[m + 1].y;
      }
    };

    const onPointerMove = (e) => {
      hasRealPointer = true;
      const rect = root.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      rawPointer.x = (e.clientX - rect.left) / rect.width;
      rawPointer.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const onPointerLeave = () => {
      hasRealPointer = false;
    };

    root.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', onPointerLeave, { passive: true });

    let rafId = 0;
    let lastTime = 0;

    const syncState = () => {
      if (needsResize) {
        needsResize = false;
        updateSize();
      }
      const curFontSize = Math.ceil(Math.max(8, getScaledFontSize()) / 4);
      const sig = [text, fontSpec.family, fontSpec.weight, fontSpec.style, fontSpec.letterSpacing, dpr, curFontSize].join('|');
      if (sig !== bakedSig) {
        bakedSig = sig;
        rebake();
      }
    };

    const updatePhysics = (dt) => {
      const speed = opts.speed !== undefined ? opts.speed : 45;
      const spd = Math.max(0, speed) / SPEED_SCALE;
      const spread = Math.max(0.01, handleConfig.spread / 100);
      const cellH = spread * LATTICE_ASPECT;
      const aspect = width / height;

      if (hasRealPointer) {
        solveLattice(rawPointer.x * aspect, rawPointer.y, spread, cellH);
      } else {
        const textH = (atlasNormH * Math.max(8, getScaledFontSize())) / height;
        rawPointer.x += dt * AUTO_SWEEP_X * spd;
        rawPointer.y = (1.0 - textH) / 2 + AUTO_SWEEP_Y * textH;
        if (rawPointer.x > 1.5) {
          rawPointer.x = -0.5;
          easedPointer.x = -0.5;
        }
        autoTimer += dt;
        if (autoTimer >= AUTO_RESET_INTERVAL) {
          autoTimer = 0;
          solveLattice(rawPointer.x * aspect, rawPointer.y, spread, cellH);
        }
      }

      const damping = opts.damping !== undefined ? opts.damping : 60;
      const factor = clamp((damping / 100) * DAMP_RATE * dt, 0, 1);
      easedPointer.x += (rawPointer.x - easedPointer.x) * factor;
      easedPointer.y += (rawPointer.y - easedPointer.y) * factor;
      autoPhase += dt * spd;

      for (let m = 0; m < NUM_HANDLES; m++) {
        const th = targetHandles[m];
        const col = Math.round(th.x / spread - 0.5);
        const row = Math.round(th.y / cellH - 0.5);
        const r1 = fract(Math.sin(col * 127.1 + row * 311.7) * 43758.5453);
        const r2 = fract(Math.sin(col * 269.5 + row * 183.3) * 43758.5453);
        handlePositions[m].x = th.x + JITTER_X * spread * Math.sin(autoPhase * ROT_X + r1 * Math.PI * 2);
        handlePositions[m].y = th.y + JITTER_Y * cellH * Math.sin(autoPhase * ROT_Y + r2 * Math.PI * 2);
      }
    };

    const updateLabels = () => {
      const isLight = document.documentElement.classList.contains('light');
      const aspect = width / height;
      const halfSize = handleConfig.size / 2;

      for (let h = 0; h < NUM_HANDLES; h++) {
        const node = labelNodes[h];
        if (!node) continue;
        const sx = handlePositions[h].x / aspect;
        const sy = handlePositions[h].y;
        const px = Math.round(clamp(sx * 100, 0, 100));
        const py = Math.round(clamp(sy * 100, 0, 100));
        node.style.transform = `translate(${sx * width - halfSize}px, ${(1.0 - sy) * height - halfSize}px)`;
        node.style.opacity = String(LABEL_OPACITY);
        node.style.color = isLight ? '#047857' : '#34d399';
        node.textContent = `${px}, ${py}`;
      }
    };

    const renderGL = () => {
      const isLight = document.documentElement.classList.contains('light');

      // Light mode: High-contrast pure jet black to charcoal gradient with dark emerald accent
      // Dark mode: Crisp white to obsidian gradient with bright neon emerald accent
      const textColor = parseColor(isLight ? (opts.lightTextColor || '#000000') : (opts.darkTextColor || '#FFFFFF'), [1, 1, 1, 1]);
      const shadeColor = parseColor(isLight ? (opts.lightShade || '#27272a') : (opts.darkShade || '#141416'), [0.08, 0.08, 0.09, 1]);
      const accentRGBA = parseColor(
        opts.accent || (isLight ? 'rgba(4, 120, 87, 0.95)' : 'rgba(52, 211, 153, 0.75)'),
        [0.2, 0.83, 0.6, 0.75]
      );

      gl.viewport(0, 0, pxWidth, pxHeight);
      gl.useProgram(program);
      gl.uniform1i(locs.map, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform2f(locs.res, width, height);

      const curSz = Math.max(8, getScaledFontSize());
      gl.uniform2f(locs.atlas, atlasNormW * curSz, atlasNormH * curSz);
      gl.uniform2f(locs.ptr, easedPointer.x, easedPointer.y);
      const reach = opts.reach !== undefined ? opts.reach : 270;
      gl.uniform1f(locs.reach, Math.max(1, reach) / width);
      gl.uniform3f(locs.text, textColor[0], textColor[1], textColor[2]);
      gl.uniform3f(locs.shade, shadeColor[0], shadeColor[1], shadeColor[2]);
      gl.uniform4f(locs.accent, accentRGBA[0], accentRGBA[1], accentRGBA[2], accentRGBA[3]);
      gl.uniform2f(locs.v0, handlePositions[0].x, handlePositions[0].y);
      gl.uniform2f(locs.v1, handlePositions[1].x, handlePositions[1].y);
      gl.uniform2f(locs.v2, handlePositions[2].x, handlePositions[2].y);
      gl.uniform1f(locs.half, handleConfig.size / 2 / height);
      gl.uniform1f(locs.isLight, isLight ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const loop = (t) => {
      if (!isAlive) return;
      const dt = lastTime ? Math.min(0.1, (t - lastTime) / 1000) : 0;
      lastTime = t;

      syncState();
      updatePhysics(dt);
      if (handleConfig.labels) {
        updateLabels();
      }
      renderGL();

      rafId = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (!document.hidden && isAlive) {
        if (!rafId) {
          lastTime = 0;
          rafId = requestAnimationFrame(loop);
        }
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const ro = new ResizeObserver(() => {
      needsResize = true;
    });
    ro.observe(root);
    document.addEventListener('visibilitychange', onVisibility);

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        bakedSig = '';
      }).catch(() => {});
    }

    rafId = requestAnimationFrame(loop);

    const api = {
      destroy: () => {
        isAlive = false;
        if (rafId) cancelAnimationFrame(rafId);
        ro.disconnect();
        root.removeEventListener('pointermove', onPointerMove);
        root.removeEventListener('pointerleave', onPointerLeave);
        document.removeEventListener('visibilitychange', onVisibility);
        root._srVectorWordmarkActive = null;
      },
    };

    root._srVectorWordmarkActive = api;
    return api;
  }

  // Export globally for browser bundle and ES modules
  window.initVectorWordmark = initVectorWordmark;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initVectorWordmark };
  }
})();
