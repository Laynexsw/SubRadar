/* =========================================================================
   SubRadar — Offline-First Progressive Web App Service Worker
   ========================================================================= */

const CACHE_NAME = 'subradar-v1.6.0-cache';
const ASSETS_TO_CACHE = [
  './code.html',
  './favicon.svg',
  './og-image.svg',
  './css/base.css',
  './css/components.css',
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

  // Network-First for HTML documents to ensure instant updates
  if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('./code.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        // Cache successful response if same origin
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for HTML documents
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./code.html');
        }
      });
    })
  );
});
