const CACHE_NAME = 'academic-timer-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json?v=2',
  'https://fonts.cdnfonts.com/css/digital-7-mono',
  'https://img.icons8.com/ios-filled/512/FFFFFF/stopwatch.png?v=3'
];

// 安装阶段：将文件存入缓存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求：优先从缓存读取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
