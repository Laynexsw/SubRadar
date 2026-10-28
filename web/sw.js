/* =========================================================================
   SubRadar — Offline-First Progressive Web App Service Worker
   SEC-03 Hardened Edition: Origin Boundary Protection & Safe Fallbacks
   ========================================================================= */

const CACHE_NAME = 'subradar-v1.1-cache';
const ASSETS_TO_CACHE = [
  './code.html',
  './favicon.svg',
  './og-image.svg',
  './css/base.css',
  './css/components.css',
  './css/cursors.css',
  './css/main.css',
  './js/config.js',
  './js/theme.js',
  './js/fx.js',
  './js/toast.js',
  './js/calculator.js',
  './js/hero-window.js',
  './js/scroll-motion.js',
  './js/i18n.js',
  './js/analytics.js',
  './js/cookie-banner.js',
  './js/mobile-cta.js',
  './js/statement-lab.js',
  './js/audio-fx.js',
  './js/cursor-glow.js',
  './js/hash-verifier.js',
  './js/social-export.js',
  './js/supabase.js',
  './js/tiles-loader.js',
  './js/vector-wordmark.js',
  './js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  var url;
  try {
    url = new URL(event.request.url);
  } catch (e) {
    return;
  }

  // SEC-03: Sadece same-origin istekleri ele al; harici API'leri (open.er-api, supabase vb.) önbelleğe alma ve akışlarını bozma
  if (url.origin !== self.location.origin) {
    return;
  }

  // Universal Network-First: Always attempt fresh network fetch first; fall back to cache when offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // SEC-03: ./code.html fallback'ini YALNIZCA navigate modundaki sayfa isteklerinde çalıştır; API veya veri isteklerine asla HTML döndürme!
          if (event.request.mode === 'navigate') {
            return caches.match('./code.html');
          }
          return new Response(JSON.stringify({ error: 'Ağ bağlantısı yok (Çevrimdışı)', offline: true }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
  );
});
