const CACHE = 'mmc-v1';
const ASSETS = ['portfolio.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// stale-while-revalidate for same-origin GETs
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      const network = fetch(e.request).then(resp => {
        if (resp && resp.ok) cache.put(e.request, resp.clone());
        return resp;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

// ---- push config stored in IndexedDB (SW has no localStorage) ----
function cfgDb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('mmc-sw', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('cfg');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function cfgGet(key) {
  const db = await cfgDb();
  return new Promise((res, rej) => {
    const q = db.transaction('cfg').objectStore('cfg').get(key);
    q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
  });
}
async function cfgSet(key, val) {
  const db = await cfgDb();
  return new Promise((res, rej) => {
    const tx = db.transaction('cfg', 'readwrite');
    tx.objectStore('cfg').put(val, key);
    tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
  });
}

self.addEventListener('message', e => {
  if (e.data?.type === 'push-config') {
    e.waitUntil(cfgSet('push', { workerUrl: e.data.workerUrl, hash: e.data.hash }));
  }
});

self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let shown = false;
    try {
      const cfg = await cfgGet('push');
      if (cfg?.workerUrl && cfg?.hash) {
        const resp = await fetch(`${cfg.workerUrl.replace(/\/$/, '')}/messages?e=${encodeURIComponent(cfg.hash)}`);
        const data = await resp.json();
        for (const msg of (data.messages || [])) {
          await self.registration.showNotification('My Money', { body: msg, tag: msg, icon: 'icon-192.png' });
          shown = true;
        }
      }
    } catch (err) { /* fall through to generic */ }
    if (!shown) await self.registration.showNotification('My Money', { body: 'You have bills due soon — open the app', icon: 'icon-192.png' });
  })());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return clients.openWindow('portfolio.html');
  }));
});
