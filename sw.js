/**
 * Nissa Safaris service worker.
 *
 * This exists for one concrete reason: people read this site in places with
 * no signal. Half the point of a safari is being somewhere remote, and a
 * guest who saved their itinerary at the lodge should still have it in the
 * Mara with no bars. Installability follows from the same work.
 *
 * ---------------------------------------------------------------------------
 * THE CACHING RULES, AND WHY THEY ARE THESE RULES
 * ---------------------------------------------------------------------------
 * This site has already been bitten once by a URL that lied about its
 * contents (see lib/assets.js: a one-hour cache on styles.css meant returning
 * visitors saw the old hero for an hour after every deploy). A service worker
 * is the same mistake with a much longer fuse, because it can serve stale
 * pages indefinitely and survives a hard refresh. So:
 *
 *   HTML is network-first, always. A page you can see is a page that came
 *   from the network if the network was there. The cache is a fallback for
 *   being offline, never a shortcut for being slow. This is the rule that
 *   makes the whole thing safe.
 *
 *   Content-hashed assets are cache-first, because their URL changes the
 *   moment their bytes do, so a cached copy cannot be wrong.
 *
 *   Photographs are cache-first with a capped, trimmed cache. They are the
 *   heavy part of this site and they do not change under a fixed name.
 *
 *   /api/ is never cached, at all. The Google reviews proxy sits there, and
 *   Google's terms forbid storing review content. See api/google-reviews.js.
 *
 * Two placeholders below are filled in by build.js (lib/pwa.js does the
 * substitution). They are left as real JS so this file parses and can be
 * linted as-is; test/pwa.test.js fails if either survives into dist/.
 */

const VERSION = '__BUILD_VERSION__';
const PRECACHE_URLS = __PRECACHE__;

const SHELL = `nk-shell-${VERSION}`;
const RUNTIME = `nk-runtime-${VERSION}`;
const OFFLINE_URL = '/offline/';

// Photographs are the only thing that can grow without bound here. Roughly
// this many full-size frames is a few tens of megabytes at most, and the
// browser evicts the whole origin long before that matters.
const MAX_RUNTIME_ENTRIES = 90;

// styles.<8 hex>.css and app.<8 hex>.js, the two files lib/assets.js emits
// under a content hash. Safe to cache forever precisely because the name
// changes with the content.
const HASHED_ASSET = /^\/(?:styles|app)\.[0-9a-f]{8}\.(?:css|js)$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      // Not addAll: that rejects the entire install if any single URL fails,
      // which would leave the site with no worker at all because one image
      // 404ed. Each is added independently and a failure is survivable.
      .then((cache) => Promise.all(PRECACHE_URLS.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith('nk-') && name !== SHELL && name !== RUNTIME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Lets the page ask a waiting worker to take over immediately (app.js sends
// this when the visitor accepts an update).
self.addEventListener('message', (event) => {
  if (event.data === 'nk-skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Cross-origin (Google Fonts) is left entirely alone: caching someone
  // else's opaque responses buys nothing and hides their failures.
  if (url.origin !== self.location.origin) return;

  // Never intercepted. /api/ must stay live (Google forbids storing review
  // content), and the worker script itself is the browser's business.
  if (url.pathname.startsWith('/api/') || url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, true));
    return;
  }

  if (HASHED_ASSET.test(url.pathname) || url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request, false));
});

/** Only a complete, same-origin, 200 response is worth storing. */
function isCacheable(response) {
  return Boolean(response) && response.status === 200 && response.type === 'basic';
}

/**
 * The network is the source of truth; the cache is what is left when the
 * network is gone. Navigations additionally fall back to the offline page.
 */
async function networkFirst(request, isNavigation) {
  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      const cache = await caches.open(RUNTIME);
      await cache.put(request, response.clone());
      trim(RUNTIME, MAX_RUNTIME_ENTRIES);
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (isNavigation) {
      const offline = await caches.match(OFFLINE_URL);
      if (offline) return offline;
    }
    throw error;
  }
}

/** For URLs whose contents cannot change without the URL changing. */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (isCacheable(response)) {
    const cache = await caches.open(RUNTIME);
    await cache.put(request, response.clone());
    trim(RUNTIME, MAX_RUNTIME_ENTRIES);
  }
  return response;
}

/**
 * Oldest-first eviction. Cache.keys() returns insertion order, so dropping
 * from the front is a rough LRU and is enough to stop a long browse through
 * the gallery filling the origin's quota.
 *
 * Deliberately not awaited by the fetch handler: trimming must never delay
 * a response going back to the page.
 */
function trim(cacheName, maxEntries) {
  caches.open(cacheName).then(async (cache) => {
    const keys = await cache.keys();
    if (keys.length <= maxEntries) return;
    await Promise.all(keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)));
  });
}
