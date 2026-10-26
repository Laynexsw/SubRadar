/* =========================================================================
   SubRadar — Offline-First Progressive Web App Service Worker
   ========================================================================= */

const CACHE_NAME = 'subradar-v1.6.3-cache';
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
          return cached || caches.match('./code.html');
        });
      })
  );
});
