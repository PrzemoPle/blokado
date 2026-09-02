// Blokado service worker - wersja pobierana z parametru ?v= przy rejestracji
const V = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE = 'blokado-' + V;
const ASSETS = [
  './', './index.html',
  './style.css?v=' + V, './i18n.js?v=' + V, './game.js?v=' + V,
  './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  // nawigacja: najpierw sieć (świeży index), offline - z cache
  if(req.mode === 'navigate'){
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  // reszta (pliki gry, ikony, fonty): najpierw cache, potem sieć + zapis do cache
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if(res && res.ok && (req.url.startsWith(self.location.origin) || /fonts\.(googleapis|gstatic)\.com/.test(req.url))){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
