const BASE_PATH = new URL(self.location).pathname.replace(
    /service-worker\.js$/,
    "",
);

const CACHE_NAME = "recoil-island";
const urlsToCache = [
    `${BASE_PATH}`,
    `${BASE_PATH}index.html`,
    `${BASE_PATH}assets/css/main.css`,
    `${BASE_PATH}assets/js/main.js`,
    `${BASE_PATH}favicon.ico`,
    `${BASE_PATH}assets/fonts/PixelifySans-Medium.ttf`,
    `${BASE_PATH}assets/fx/action.wav`,
    `${BASE_PATH}assets/fx/death.wav`,
    `${BASE_PATH}assets/fx/shot.wav`,
    `${BASE_PATH}assets/fx/startlevel.wav`,
    `${BASE_PATH}assets/img/blood.png`,
    `${BASE_PATH}assets/img/enemy.png`,
    `${BASE_PATH}assets/img/grass1.png`,
    `${BASE_PATH}assets/img/grass2.png`,
    `${BASE_PATH}assets/img/obstacle1.png`,
    `${BASE_PATH}assets/img/obstacle2.png`,
    `${BASE_PATH}assets/img/obstacle3.png`,
    `${BASE_PATH}assets/img/obstacle4.png`,
    `${BASE_PATH}assets/img/obstacle5.png`,
    `${BASE_PATH}assets/img/obstacle6.png`,
    `${BASE_PATH}assets/img/obstacle7.png`,
    `${BASE_PATH}assets/img/obstacle8.png`,
    `${BASE_PATH}assets/img/obstacle9.png`,
    `${BASE_PATH}assets/img/player.png`,
    `${BASE_PATH}assets/img/sand.png`,
    `${BASE_PATH}assets/img/water.png`,
    `${BASE_PATH}assets/maps/map0.json`,
    `${BASE_PATH}assets/maps/map1.json`,
    `${BASE_PATH}assets/maps/map2.json`,
    `${BASE_PATH}assets/maps/map3.json`,
    `${BASE_PATH}assets/maps/map4.json`,
    `${BASE_PATH}assets/maps/map5.json`,
    `${BASE_PATH}assets/maps/map6.json`,
    `${BASE_PATH}assets/maps/map7.json`,
    `${BASE_PATH}assets/maps/map8.json`,
    `${BASE_PATH}assets/maps/map9.json`,
    `${BASE_PATH}assets/icons/apple-touch-icon.png`,
    `${BASE_PATH}assets/icons/favicon.ico`,
    `${BASE_PATH}assets/icons/favicon.svg`,
    `${BASE_PATH}assets/icons/favicon-96x96.png`,
    `${BASE_PATH}assets/icons/site.webmanifest`,
    `${BASE_PATH}assets/icons/web-app-manifest-192x192.png`,
    `${BASE_PATH}assets/icons/web-app-manifest-512x512.png`,
].map((url) => new URL(url, self.location).href);

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                urlsToCache.map((url) => {
                    return cache
                        .add(url)
                        .catch((err) =>
                            console.error("Missing asset:", url, err),
                        );
                }),
            );
        }),
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => k !== CACHE_NAME)
                        .map((k) => caches.delete(k)),
                ),
            ),
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) return response;
            return fetch(event.request).catch(() => {
                if (event.request.mode === "navigate") {
                    return caches.match(`${BASE_PATH}index.html`);
                }
            });
        }),
    );
});
