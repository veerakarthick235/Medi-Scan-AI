// MediScan AI Service Worker
// Enables offline mode and caching for critical assets

const CACHE_NAME = 'mediscan-v1';
const STATIC_ASSETS = [
  '/',
  '/app/layout.tsx',
  '/app/globals.css',
  '/components/Header.tsx',
  '/components/TriageForm.tsx',
  '/components/TriageResults.tsx',
  '/components/PatientHistory.tsx',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching core assets');
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('[ServiceWorker] Some assets could not be cached');
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available
      if (response) {
        return response;
      }

      // Try to fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache if response is not successful
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // Return offline page if available
          console.log('[ServiceWorker] Offline - serving cached content');
          return caches.match('/') || new Response('Offline mode - Limited functionality');
        });
    })
  );
});

// Message handling for manual cache control
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[ServiceWorker] Cache cleared');
    });
  }
});
