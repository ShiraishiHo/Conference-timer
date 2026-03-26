const CACHE_NAME = 'academic-timer-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.cdnfonts.com/css/digital-7-mono',
  'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=180&h=180&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=192&h=192&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=512&h=512&auto=format&fit=crop'
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
