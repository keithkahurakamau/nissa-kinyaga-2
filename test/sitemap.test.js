import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pages } from '../build.js';

const byPath = new Map(pages().map((p) => [p.path, p.html]));
const sitemap = byPath.get('/sitemap.xml');

test('a sitemap is emitted', () => {
  assert.ok(sitemap);
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
});

test('the sitemap lists every HTML page and nothing else', () => {
  const htmlPaths = [...byPath.keys()].filter((p) => p.endsWith('/'));
  const listed = [...sitemap.matchAll(/<loc>https:\/\/nissasafaris\.com([^<]*)<\/loc>/g)].map((m) => m[1]);
  assert.deepEqual(listed.sort(), htmlPaths.sort());
});

test('there are 48 pages in the sitemap', () => {
  const listed = [...sitemap.matchAll(/<loc>/g)];
  assert.equal(listed.length, 48);
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
