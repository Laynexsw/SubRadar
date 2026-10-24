/**
 * SubRadar — 3D Interactive Radar Globe (hero-radar-3d.js)
 * Powered by Three.js (mrdoob/three.js) • 100% Offline-First WebGL Engine
 * Apple Glass & Cyber-Radar Aesthetic: Orbiting Gimbal Rings, Sonar Beam, Detected SaaS Nodes
 */

export function initHeroRadar3D() {
  const container = document.getElementById('hero-radar-3d-wrapper');
  const canvas = document.getElementById('hero-radar-3d-canvas');
  if (!container || !canvas || typeof THREE === 'undefined') return null;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 420;
  
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 7.8);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Main Group for interactive rotation
  const radarGroup = new THREE.Group();
  scene.add(radarGroup);

  // 1. Theme-aware color palette
  const isLight = () => document.documentElement.classList.contains('light');
  
  function getPalette() {
    const light = isLight();
    return {
      sphereWire: light ? 0x059669 : 0x10b981,
      sphereOpacity: light ? 0.22 : 0.16,
      corePoints: light ? 0x047857 : 0x34d399,
      coreOpacity: light ? 0.45 : 0.35,
      ringOuter: light ? 0x0f172a : 0xffffff,
      ringOuterOpacity: light ? 0.25 : 0.18,
      ringRadar: light ? 0x059669 : 0x10b981,
      ringRadarOpacity: light ? 0.55 : 0.45,
      sweepColor: light ? 0x059669 : 0x34d399,
      sweepOpacity: light ? 0.22 : 0.16,
      nodeGlow: light ? 0x047857 : 0x34d399
    };
  }

  let palette = getPalette();

  // 2. Wireframe Outer Radar Globe (Geodesic Sphere)
  const sphereGeo = new THREE.IcosahedronGeometry(2.35, 3);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: palette.sphereWire,
    wireframe: true,
    transparent: true,
    opacity: palette.sphereOpacity
  });
  const wireSphere = new THREE.Mesh(sphereGeo, sphereMat);
  radarGroup.add(wireSphere);

  // 3. Inner Point Cloud Core (Matrix of detected data points)
  const pointCount = 180;
  const pointPositions = new Float32Array(pointCount * 3);
  for (let i = 0; i < pointCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.45 + Math.random() * 0.75;
    const sinPhi = Math.sin(phi);
    pointPositions[i * 3] = r * sinPhi * Math.cos(theta);
    pointPositions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    pointPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
  const pointMat = new THREE.PointsMaterial({
    color: palette.corePoints,
    size: 0.05,
    transparent: true,
    opacity: palette.coreOpacity
  });
  const innerPoints = new THREE.Points(pointGeo, pointMat);
  radarGroup.add(innerPoints);

  // 4. Concentric Gimbal Radar Rings
  const rings = [];

  // Equatorial Primary Ring
  const eqRingGeo = new THREE.TorusGeometry(2.72, 0.015, 16, 90);
  const eqRingMat = new THREE.MeshBasicMaterial({
    color: palette.ringRadar,
    transparent: true,
    opacity: palette.ringRadarOpacity
  });
  const eqRing = new THREE.Mesh(eqRingGeo, eqRingMat);
  eqRing.rotation.x = Math.PI / 2.2;
  radarGroup.add(eqRing);
  rings.push({ mesh: eqRing, speedY: 0.003, speedX: 0.001 });

  // Polar Ring
  const polarRingGeo = new THREE.TorusGeometry(2.95, 0.012, 16, 90);
  const polarRingMat = new THREE.MeshBasicMaterial({
    color: palette.ringOuter,
    transparent: true,
    opacity: palette.ringOuterOpacity
  });
  const polarRing = new THREE.Mesh(polarRingGeo, polarRingMat);
  polarRing.rotation.y = Math.PI / 3;
  radarGroup.add(polarRing);
  rings.push({ mesh: polarRing, speedY: -0.002, speedZ: 0.0015 });

  // Outer Precision Latitude Ring with dashed feel
  const outerRingGeo = new THREE.TorusGeometry(3.18, 0.008, 16, 80);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: palette.ringRadar,
    transparent: true,
    opacity: palette.ringOuterOpacity * 0.8
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.x = Math.PI / 3.5;
  outerRing.rotation.z = Math.PI / 6;
  radarGroup.add(outerRing);
  rings.push({ mesh: outerRing, speedX: -0.001, speedY: 0.002 });

  // 5. Rotating Sonar Radar Sweep Fan
  const sweepGeo = new THREE.CircleGeometry(2.65, 48, 0, Math.PI / 3.2);
  const sweepMat = new THREE.MeshBasicMaterial({
    color: palette.sweepColor,
    transparent: true,
    opacity: palette.sweepOpacity,
    side: THREE.DoubleSide
  });
  const radarSweep = new THREE.Mesh(sweepGeo, sweepMat);
  radarSweep.rotation.x = Math.PI / 2.2;
  radarGroup.add(radarSweep);

  // 6. Detected SaaS Nodes (Floating Subscription Satellites)
  const saasNodes = [
    { name: 'Netflix', color: 0xef4444, pos: [1.8, 1.2, 1.1], price: '$15.99' },
    { name: 'Adobe CC', color: 0xf43f5e, pos: [-1.9, 0.9, -1.0], price: '$54.99' },
    { name: 'Spotify', color: 0x10b981, pos: [0.8, -1.9, 1.3], price: '$10.99' },
    { name: 'ChatGPT Plus', color: 0x14b8a6, pos: [-1.2, -1.4, 1.6], price: '$20.00' },
    { name: 'Figma Pro', color: 0xa855f7, pos: [1.5, -0.8, -1.7], price: '$12.00' },
    { name: 'GitHub Copilot', color: 0x38bdf8, pos: [-1.6, 1.5, 1.2], price: '$10.00' },
    { name: 'AWS Cloud', color: 0xf59e0b, pos: [0.5, 2.0, -1.4], price: '$64.20' }
  ];

  const nodeMeshes = [];
  const pingHalos = [];

  const nodeSphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const haloRingGeo = new THREE.RingGeometry(0.1, 0.22, 24);

  saasNodes.forEach((node) => {
    const nodeMat = new THREE.MeshBasicMaterial({ color: node.color });
    const mesh = new THREE.Mesh(nodeSphereGeo, nodeMat);
    mesh.position.set(node.pos[0], node.pos[1], node.pos[2]);
    radarGroup.add(mesh);

    // Pulsing Radar Halo Ring
    const haloMat = new THREE.MeshBasicMaterial({
      color: node.color,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(haloRingGeo, haloMat);
    halo.position.copy(mesh.position);
    halo.lookAt(0, 0, 0);
    radarGroup.add(halo);

    nodeMeshes.push({ mesh, data: node });
    pingHalos.push({ halo, baseScale: 1, phase: Math.random() * Math.PI * 2 });
  });

  // 7. Interactive Mouse / Touch Orbit Controls
  let isDragging = false;
  let previousMousePos = { x: 0, y: 0 };
  let targetRotation = { x: 0.15, y: 0 };
  let targetTilt = { x: 0, y: 0 };

  const onPointerDown = (e) => {
    isDragging = true;
    previousMousePos = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePos.x;
      const deltaY = e.clientY - previousMousePos.y;
      targetRotation.y += deltaX * 0.006;
      targetRotation.x += deltaY * 0.006;
      previousMousePos = { x: e.clientX, y: e.clientY };
    } else {
      // Subtle parallax tilt when hovering
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetTilt.y = normX * 0.35;
      targetTilt.x = normY * 0.25;
    }
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);

  // 8. Theme change listener
  function updateThemeColors() {
    palette = getPalette();
    sphereMat.color.setHex(palette.sphereWire);
    sphereMat.opacity = palette.sphereOpacity;
    pointMat.color.setHex(palette.corePoints);
    pointMat.opacity = palette.coreOpacity;
    eqRingMat.color.setHex(palette.ringRadar);
    eqRingMat.opacity = palette.ringRadarOpacity;
    polarRingMat.color.setHex(palette.ringOuter);
    polarRingMat.opacity = palette.ringOuterOpacity;
    outerRingMat.color.setHex(palette.ringRadar);
    sweepMat.color.setHex(palette.sweepColor);
    sweepMat.opacity = palette.sweepOpacity;
  }

  const themeObserver = new MutationObserver(() => updateThemeColors());
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // 9. Resize Handling
  function handleResize() {
    if (!container || !canvas) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', handleResize, { passive: true });

  // 10. Animation Loop & Visibility Caching (Zero overhead when scrolled out)
  let isVisible = true;
  const visibilityObserver = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  visibilityObserver.observe(container);

  let animationFrameId;
  let clock = new THREE.Clock();

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    if (!isVisible) return;

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Constant smooth background rotation
    targetRotation.y += 0.0035;

    // Smooth lerp damping
    radarGroup.rotation.x += (targetRotation.x + targetTilt.x - radarGroup.rotation.x) * 0.08;
    radarGroup.rotation.y += (targetRotation.y + targetTilt.y - radarGroup.rotation.y) * 0.08;

    // Rotate Sonar Sweep Fan continuously
    radarSweep.rotation.z -= 0.024;

    // Pulse Inner Points
    innerPoints.rotation.y += 0.0015;
    innerPoints.rotation.x -= 0.001;

    // Rotate concentric rings
    rings.forEach((ring) => {
      if (ring.speedX) ring.mesh.rotation.x += ring.speedX;
      if (ring.speedY) ring.mesh.rotation.y += ring.speedY;
      if (ring.speedZ) ring.mesh.rotation.z += ring.speedZ;
    });

    // Pulse halos around detected SaaS nodes
    pingHalos.forEach((p, idx) => {
      const scale = 1 + Math.sin(elapsedTime * 3.5 + p.phase) * 0.45;
      const opacity = 0.8 - (scale - 1) * 1.5;
      p.halo.scale.set(scale, scale, scale);
      p.halo.material.opacity = Math.max(0.05, opacity);
    });

    renderer.render(scene, camera);
  }

  animate();

  return {
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
    }
  };
}
