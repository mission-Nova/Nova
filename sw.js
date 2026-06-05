/* AIR-1 Performance OS offline-first service worker.
   Preserves user data: this worker only caches network responses and never touches
   localStorage, IndexedDB, or sensitive Gemini API requests. */
const AIR1_CACHE_VERSION = 'air1-pwa-v41-2026-06-05-r2';
const APP_SHELL_CACHE = `${AIR1_CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${AIR1_CACHE_VERSION}-runtime`;

const APP_SHELL_ASSETS = [
  './',
  './index.html',
  './AIR1_WorldClass_V41_STABILITY_EDITION_PWA.html',
  './manifest.json',
  './favicon-32.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

const SENSITIVE_OR_API_HOSTS = new Set([
  'generativelanguage.googleapis.com'
]);

function isSensitiveRequest(url) {
  return SENSITIVE_OR_API_HOSTS.has(url.hostname) || url.pathname.includes(':generateContent');
}

function isCacheableExternalAsset(request, url) {
  if (request.method !== 'GET' || isSensitiveRequest(url)) return false;
  return ['style', 'script', 'font', 'image'].includes(request.destination) ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'cdn.jsdelivr.net';
}

async function putIfOk(cacheName, request, response) {
  if (!response || !response.ok) return response;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return response;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_SHELL_CACHE);
    await cache.addAll(APP_SHELL_ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([APP_SHELL_CACHE, RUNTIME_CACHE]);
    const names = await caches.keys();
    await Promise.all(names.map((name) => keep.has(name) ? undefined : caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (isSensitiveRequest(url)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await putIfOk(APP_SHELL_CACHE, './index.html', await fetch(request));
      } catch (error) {
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        return await putIfOk(APP_SHELL_CACHE, request, await fetch(request));
      } catch (error) {
        return cached || Response.error();
      }
    })());
    return;
  }

  if (isCacheableExternalAsset(request, url)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      try {
        return await putIfOk(RUNTIME_CACHE, request, await fetch(request));
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    })());
  }
});
