import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, NOINDEX_PATHS } from '../build.js';
import { manifest } from '../lib/pwa.js';
import { outputPath } from '../lib/paths.js';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const all = pages();
const byPath = new Map(all.map((p) => [p.path, p.html]));
const sw = byPath.get('/sw.js');
const appJs = readFileSync(join(ROOT, 'app.js'), 'utf8');
const css = readFileSync(join(ROOT, 'styles.css'), 'utf8');

/* ---------------------------------------------------------------------------
   The manifest
--------------------------------------------------------------------------- */

test('a manifest is emitted and is valid JSON', () => {
  const raw = byPath.get('/manifest.webmanifest');
  assert.ok(raw, 'no manifest emitted');
  assert.deepEqual(JSON.parse(raw), manifest());
});

test('the manifest carries everything a browser needs to offer an install', () => {
  const m = manifest();
  for (const field of ['name', 'short_name', 'start_url', 'scope', 'display', 'icons']) {
    assert.ok(m[field], `manifest is missing ${field}`);
  }
  assert.equal(m.display, 'standalone');
  // A short_name over ~12 characters is truncated under a home screen icon.
  assert.ok(m.short_name.length <= 12, `short_name "${m.short_name}" will be truncated`);
  // Chrome will not offer an install without a 192 and a 512.
  const sizes = m.icons.map((icon) => icon.sizes);
  assert.ok(sizes.includes('192x192'), 'no 192x192 icon');
  assert.ok(sizes.includes('512x512'), 'no 512x512 icon');
  assert.ok(m.icons.some((icon) => icon.purpose === 'maskable'),
    'no maskable icon: Android will letterbox the icon inside a white blob');
});

/** Width and height live at a fixed offset in a PNG's IHDR chunk. */
function pngSize(file) {
  const buf = readFileSync(file);
  assert.equal(buf.toString('ascii', 12, 16), 'IHDR', `${file} is not a PNG`);
  return `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`;
}

// A manifest that declares a size the file does not have is worse than no
// manifest: the browser scales it and the icon ships blurry.
test('every icon the manifest declares exists at the size it claims', () => {
  for (const icon of manifest().icons) {
    const file = join(ROOT, icon.src.split('?')[0].replace(/^\//, ''));
    assert.ok(existsSync(file), `manifest declares ${icon.src}, which does not exist`);
    assert.equal(pngSize(file), icon.sizes, `${icon.src} is not ${icon.sizes}`);
  }
});

// An installed app caches its icon at install time and only re-fetches when
// the manifest it reads has changed. With a fixed icon URL, replacing the
// logo changed the bytes at a URL the browser already held and considered
// fresh for a day, so installed apps kept showing the old mark indefinitely.
// The version in the URL is what turns a new logo into a new manifest.
test('every manifest icon URL carries a content version', () => {
  for (const icon of manifest().icons) {
    assert.match(icon.src, /\?v=[0-9a-f]{8}$/, `${icon.src} has no content version`);
  }
  // Different files must not share a version, or the whole thing is a
  // constant with extra steps.
  const versions = manifest().icons.map((icon) => icon.src.split('?v=')[1]);
  assert.equal(new Set(versions).size, versions.length, 'two icons share a version hash');
});

// The logo is a square composition with a wordmark running to its edges, and
// Android crops maskable icons to a circle or squircle. Pointing the maskable
// entry at the same square file as the "any" entry is the mistake that slices
// the lettering in half on every Android home screen, and it is invisible
// until someone installs it on a phone.
test('the maskable icon is a purpose-built file, not the square logo again', () => {
  const icons = manifest().icons;
  const maskable = icons.filter((icon) => String(icon.purpose).includes('maskable'));
  assert.ok(maskable.length > 0, 'no maskable icon declared');
  const plain = icons.filter((icon) => icon.purpose === 'any').map((icon) => icon.src);
  for (const icon of maskable) {
    assert.ok(!plain.includes(icon.src),
      `${icon.src} is declared both as "any" and as "maskable"; a maskable icon needs its own safe-zone inset`);
  }
});

// favicon.ico is the one icon that must work at 16px, where the full logo is
// unreadable. It carries three renderings so the small one can differ.
test('favicon.ico carries 16, 32 and 48 pixel renderings', () => {
  const ico = readFileSync(join(ROOT, 'assets', 'favicon.ico'));
  assert.equal(ico.readUInt16LE(0), 0, 'not an ICO: reserved field');
  assert.equal(ico.readUInt16LE(2), 1, 'not an ICO: type field');
  const count = ico.readUInt16LE(4);
  const sizes = [];
  for (let i = 0; i < count; i += 1) {
    const at = 6 + i * 16;
    sizes.push(ico[at] === 0 ? 256 : ico[at]);
  }
  assert.deepEqual(sizes.sort((a, b) => a - b), [16, 32, 48]);
});

test('the manifest start_url, scope and shortcuts all point at real pages', () => {
  const m = manifest();
  assert.ok(byPath.has(m.start_url), `start_url ${m.start_url} is not a page`);
  assert.equal(m.scope, '/', 'a scope narrower than / would leave part of the site outside the app');
  for (const shortcut of m.shortcuts ?? []) {
    assert.ok(byPath.has(shortcut.url), `shortcut "${shortcut.name}" points at ${shortcut.url}, which is not built`);
  }
});

test('every page links the manifest and declares itself installable on iOS', () => {
  for (const [path, html] of byPath) {
    if (!path.endsWith('/')) continue;
    assert.match(html, /<link rel="manifest" href="\/manifest\.webmanifest">/, `${path} does not link the manifest`);
    assert.match(html, /name="apple-mobile-web-app-capable" content="yes"/, `${path} is not installable on iOS`);
  }
});

/* ---------------------------------------------------------------------------
   The service worker
   ---------------------------------------------------------------------------
   These are the tests that matter most in this file. A service worker is the
   one thing on a static site that can keep serving an old build after a
   deploy, survive a hard refresh, and do it for weeks. Each assertion below
   corresponds to a specific way that happens.
--------------------------------------------------------------------------- */

test('the service worker ships with its build-time placeholders filled in', () => {
  assert.ok(sw, 'no service worker emitted');
  assert.doesNotMatch(sw, /__BUILD_VERSION__|__PRECACHE__/, 'a placeholder survived the build');
  assert.match(sw, /const VERSION = "[0-9a-f]{12}"/, 'no build version was substituted');
});

// If HTML were cache-first, a visitor could be pinned to an old build
// indefinitely, and no reload would rescue them. The cache is a fallback for
// being offline, never a shortcut for being slow.
test('HTML is network-first, so a deploy is never invisible to a returning visitor', () => {
  assert.match(sw, /request\.mode === 'navigate'[\s\S]{0,120}networkFirst/,
    'navigations must be handled network-first');
  assert.doesNotMatch(sw, /request\.mode === 'navigate'[\s\S]{0,120}cacheFirst/,
    'navigations must never be served cache-first');
});

// Google's terms forbid storing review content, which api/google-reviews.js
// is built around. A worker quietly caching that endpoint would break it.
test('the service worker never touches /api/', () => {
  assert.match(sw, /url\.pathname\.startsWith\('\/api\/'\)/, 'no /api/ bypass in the worker');
  const apiLine = sw.split('\n').find((line) => line.includes("'/api/'"));
  assert.match(apiLine, /return/, 'the /api/ branch must return without responding');
});

test('only content-hashed and image URLs are served cache-first', () => {
  const rule = sw.match(/const HASHED_ASSET = (\/.*\/);/);
  assert.ok(rule, 'no hashed-asset pattern in the worker');
  const pattern = new RegExp(rule[1].slice(1, -1));
  assert.ok(pattern.test('/styles.9ce481bb.css'), 'hashed CSS must match');
  assert.ok(pattern.test('/app.bb6ce041.js'), 'hashed JS must match');
  // The whole safety argument for cache-first is that the URL changes with
  // the content. An unhashed name must never qualify.
  assert.ok(!pattern.test('/styles.css'), 'an unhashed stylesheet must not be cache-first');
  assert.ok(!pattern.test('/app.js'), 'an unhashed script must not be cache-first');
});

test('the worker cleans up its own old caches and claims open pages', () => {
  assert.match(sw, /caches\.delete/, 'old caches are never deleted');
  assert.match(sw, /clients\.claim/, 'the worker never takes control of open pages');
  assert.match(sw, /skipWaiting/, 'an update would wait for every tab to close');
});

test('only complete same-origin 200 responses are cached', () => {
  assert.match(sw, /response\.status === 200/, 'a redirect or partial response could be cached');
  assert.match(sw, /response\.type === 'basic'/, 'an opaque cross-origin response could be cached');
});

test('the runtime cache is capped so a long browse cannot fill the device', () => {
  const cap = sw.match(/const MAX_RUNTIME_ENTRIES = (\d+)/);
  assert.ok(cap, 'no cap on the runtime cache');
  assert.ok(Number(cap[1]) > 0 && Number(cap[1]) <= 200, 'the cap is not a sane number');
});

// Every precached URL is fetched on install. One that 404s is a wasted
// request on someone's mobile data, on every first visit, forever.
test('every precached URL is something the build actually emits', () => {
  const list = JSON.parse(sw.match(/const PRECACHE_URLS = (\[[^\]]*\])/)[1]);
  assert.ok(list.length > 0, 'nothing is precached');
  for (const url of list) {
    if (url.startsWith('/assets/')) {
      const file = url.split('?')[0];
      assert.ok(existsSync(join(ROOT, file.replace(/^\//, ''))), `precached ${url} is not in assets/`);
      continue;
    }
    const hashed = url.match(/^\/(styles|app)\.[0-9a-f]{8}\.(css|js)$/);
    if (hashed) {
      assert.ok(existsSync(join(ROOT, `${hashed[1]}.${hashed[2]}`)), `precached ${url} has no source`);
      continue;
    }
    assert.ok(byPath.has(url), `precached ${url} is not built`);
  }
});

test('the offline fallback is precached, or it can never be shown', () => {
  const list = JSON.parse(sw.match(/const PRECACHE_URLS = (\[[^\]]*\])/)[1]);
  const fallback = sw.match(/const OFFLINE_URL = '([^']+)'/)[1];
  assert.ok(list.includes(fallback), `${fallback} is the fallback but is not precached`);
  assert.ok(byPath.has(fallback), `${fallback} is not built`);
});

test('the service worker is served from the root, or it controls nothing', () => {
  assert.equal(outputPath('/sw.js'), 'sw.js');
});

/* ---------------------------------------------------------------------------
   Deployment
--------------------------------------------------------------------------- */

// The one header that must be right. A service worker cached for a day is a
// site frozen for a day, because the browser checks the worker script for
// updates and would keep getting the stale copy back.
test('sw.js is served with a no-cache policy', () => {
  const config = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
  const entry = config.headers.find((h) => h.source === '/sw.js');
  assert.ok(entry, 'vercel.json sets no headers for /sw.js');
  const cacheControl = entry.headers.find((h) => h.key.toLowerCase() === 'cache-control');
  assert.ok(cacheControl, '/sw.js has no Cache-Control');
  assert.match(cacheControl.value, /max-age=0|no-cache|no-store/, `/sw.js is cacheable: ${cacheControl.value}`);
});

/* ---------------------------------------------------------------------------
   /app/ and /offline/
--------------------------------------------------------------------------- */

test('the install page works with no JavaScript at all', () => {
  const page = byPath.get('/app/');
  assert.ok(page, '/app/ is not built');
  // The per-platform steps are server-rendered, never injected, because the
  // iOS route is manual and is the one that must always be readable.
  assert.match(page, /Add to Home Screen/);
  assert.match(page, /On an iPhone or iPad/);
  assert.match(page, /On an Android phone/);
  assert.match(page, /On a computer/);
});

// The button is only meaningful once the browser has fired
// beforeinstallprompt. Shipping it visible would offer an install on iOS and
// on every browser that cannot do it, and do nothing when tapped.
test('the install button ships hidden and the hidden attribute actually hides it', () => {
  assert.match(byPath.get('/app/'), /<button[^>]*id="nk-install"[^>]*\shidden/);
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/,
    'without this reset the .btn display rule overrides the hidden attribute');
  assert.match(appJs, /beforeinstallprompt/, 'app.js never captures the install prompt');
  assert.match(appJs, /navigator\.serviceWorker\.register\('\/sw\.js'\)/, 'app.js never registers the worker');
});

test('the offline page is noindex and stays out of the sitemap', () => {
  assert.ok(NOINDEX_PATHS.has('/offline/'));
  assert.match(byPath.get('/offline/'), /<meta name="robots" content="noindex/);
  assert.doesNotMatch(byPath.get('/sitemap.xml'), /<loc>[^<]*\/offline\/<\/loc>/);
});

// It renders exactly when the network is gone, so every image on it is a
// gamble on that image already being in the cache. Its own content carries
// none. The shared shell contributes two, and they are not equal bets: the
// nav logo is on every page and is therefore cached by the visit that
// installed the worker, while the footer's full logo is a large lazy-loaded
// image that usually is not, and it painted as a broken-image icon until
// the .is-offline rule dropped it.
test('the offline page loads no image it is unlikely to have cached', () => {
  const page = byPath.get('/offline/');
  const main = page.slice(page.indexOf('<main'), page.indexOf('</main>'));
  assert.doesNotMatch(main, /<img\b/, 'the offline page body loads an image it cannot fetch');
  assert.match(page, /<body class="[^"]*is-offline/, 'the offline page must carry the is-offline class');
  // Not hidden in CSS: a display:none image is still fetched, so the only
  // real fix is not rendering it.
  assert.ok(!page.includes('footer-mark'), 'the offline page still renders the footer logo');
  assert.ok(!page.includes('logo-full'), 'the offline page still references the full logo');
});
