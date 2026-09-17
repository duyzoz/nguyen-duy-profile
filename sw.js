const CACHE_NAME = 'nd-profile-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/Background.png',
  './assets/avatar.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Do not cache audio streams or external cross-origin APIs in SW
  if(e.request.url.includes('api.lanyard.rest') || e.request.url.includes('.mp3') || e.request.url.includes('api.ipify.org')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if(res.status === 200 && e.request.method === 'GET' && !e.request.url.startsWith('chrome-extension')) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, resClone));
        }
        return res;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
