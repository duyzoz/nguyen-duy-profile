/* Service Worker v56 - Network First */
const CACHE_NAME = 'nd-profile-v56';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  var url = e.request.url;
  if (url.includes('generativelanguage.googleapis.com') || url.includes('api.lanyard.rest') || url.includes('.mp3') || url.includes('api.ipify.org') || url.includes('/cdn-cgi/')) {
    return;
  }
  e.respondWith(
    fetch(e.request).then(function(res) {
      if (res && res.status === 200) {
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
      }
      return res;
    }).catch(function() { return caches.match(e.request); })
  );
});
