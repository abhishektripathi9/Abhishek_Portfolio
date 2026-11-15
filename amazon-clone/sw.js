/**
 * UDAANMART - SERVICE WORKER (sw.js)
 * High-speed caching for offline readiness, core shell assets, and instant reload.
 */

const CACHE_NAME = 'udaanmart-v2.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/variables.css',
  './css/main.css',
  './css/components.css',
  './css/modals.css',
  './css/stitch-ui.css',
  './js/store.js',
  './js/i18n.js',
  './js/products-data.js',
  './js/cart.js',
  './js/search-filter.js',
  './js/modal.js',
  './js/checkout.js',
  './js/seller.js',
  './js/app.js',
  './images/udaanmart-logo-transparent.png',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('SW pre-cache non-fatal warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first for APIs, cache fallback for static assets
  if (e.request.url.includes('postalpincode.in') || e.request.url.includes('api.')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((response) => {
        return response;
      }).catch(() => cached);
    })
  );
});
