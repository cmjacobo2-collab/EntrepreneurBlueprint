const CACHE = 'attable-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      fetch(req).then((res) => { try { cache.put(req, res.clone()); } catch (_) {} return res; })
        .catch(() => cache.match(req))
    )
  );
});
