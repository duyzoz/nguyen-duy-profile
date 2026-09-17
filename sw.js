/* ══════════════════════════════════════════════════════
   Service Worker v20 — Nguyễn Duy Profile (Network First)
   Purges stale caches immediately to guarantee live updates
══════════════════════════════════════════════════════ */
const CACHE_NAME = 'nd-profile-v20';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Always fetch fresh network first; never stale cache for code/data
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.includes('api.lanyard.rest') || url.includes('.mp3') || url.includes('api.ipify.org') || url.includes('/cdn-cgi/')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
