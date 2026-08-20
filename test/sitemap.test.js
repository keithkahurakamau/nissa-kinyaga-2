import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pages, NOINDEX_PATHS } from '../build.js';
import site from '../data/site.js';
import packages from '../data/packages.js';
import destinations from '../data/destinations.js';
import journeys from '../data/journeys.js';

const byPath = new Map(pages().map((p) => [p.path, p.html]));
const sitemap = byPath.get('/sitemap.xml');

test('a sitemap is emitted', () => {
  assert.ok(sitemap);
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
});

test('the sitemap lists every indexable HTML page and nothing else', () => {
  const htmlPaths = [...byPath.keys()].filter((p) => p.endsWith('/') && !NOINDEX_PATHS.has(p));
  const listed = [...sitemap.matchAll(/<loc>https:\/\/nissasafaris\.com([^<]*)<\/loc>/g)].map((m) => m[1]);
  assert.deepEqual(listed.sort(), htmlPaths.sort());
});

// Derived from the data rather than hardcoded, for the same reason as the
// equivalent assertion in test/integration.test.js.
test('the sitemap lists one URL per page the data implies', () => {
  const fixed = [
    '/', '/safaris/', '/destinations/', '/journeys/',
    '/about/', '/gallery/', '/journal/', '/contact/', '/reviews/', '/app/',
    ...site.legalLinks.map((link) => link.href),
  ];
  const listed = [...sitemap.matchAll(/<loc>/g)];
  assert.equal(
    listed.length,
    fixed.length + packages.length + destinations.length + journeys.length,
  );
});

// A legal page missing from the sitemap is a page Google may never index,
// and these four are exactly the ones a search engine looks for to decide a
// site belongs to a real business.
test('the sitemap lists all four legal pages', () => {
  for (const link of site.legalLinks) {
    assert.match(sitemap, new RegExp(`<loc>https://nissasafaris\\.com${link.href}</loc>`));
  }
});

test('robots.txt allows crawling and points at the sitemap', () => {
  const robots = byPath.get('/robots.txt');
  assert.ok(robots);
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/nissasafaris\.com\/sitemap\.xml/);
  assert.doesNotMatch(robots, /^Disallow: \/$/m);
});

test('vercel.json sets security headers and redirects www to apex', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  const headerNames = config.headers
    .flatMap((entry) => entry.headers)
    .map((header) => header.key.toLowerCase());
  for (const name of [
    'strict-transport-security', 'x-frame-options',
    'x-content-type-options', 'referrer-policy',
  ]) {
    assert.ok(headerNames.includes(name), `vercel.json missing ${name}`);
  }
  assert.ok(config.redirects.some((r) => r.source.includes('www') || r.has), 'no www redirect');
});
