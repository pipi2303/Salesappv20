// Cache name is bumped whenever the caching strategy changes, so browsers
// that already installed an older service worker purge their stale cache
// on activate instead of keeping it forever.
const CACHE_NAME = 'sales-monitoring-v2';
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  // Activate the new service worker immediately instead of waiting for
  // all open tabs to close, so a fresh deploy takes effect right away.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Network-first strategy: every request goes to the network first, and the
// cache is only used as an offline fallback. This prevents the "stale
// shell" bug where an old cached index.html keeps referencing JS/CSS
// bundle filenames (Vite content hashes) that no longer exist on the
// server after a new deploy, causing 404s for returning visitors.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GET requests; let everything else (POST,
  // browser extensions, cross-origin calls) pass through untouched.
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
