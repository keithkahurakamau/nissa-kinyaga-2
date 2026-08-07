import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import packages from '../data/packages.js';

const home = new Map(pages().map((p) => [p.path, p.html])).get('/');

test('the home page exists', () => {
  assert.ok(home);
});

test('has exactly one h1 and it names the brand', () => {
  const h1s = [...home.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  assert.equal(h1s.length, 1);
  assert.match(h1s[0][1], /Nissa Safaris|Kenya/);
});

test('carries TravelAgency schema', () => {
  assert.match(home, /"@type":"TravelAgency"/);
});

test('features both signature packages above the fold section', () => {
  for (const pkg of packages.filter((p) => p.signature)) {
    assert.ok(home.includes(`/safaris/${pkg.slug}/`), `home omits signature ${pkg.slug}`);
  }
});

test('links to all 8 destinations', () => {
  const links = [...home.matchAll(/\/destinations\/[a-z-]+\//g)].map((m) => m[0]);
  assert.equal(new Set(links).size, 8);
});

test('preloads its hero image with high fetch priority', () => {
  assert.match(home, /<link rel="preload" as="image" href="\/assets\/[^"]+" fetchpriority="high">/);
});

test('the meta description mentions Kenya and safari', () => {
  const description = home.match(/<meta name="description" content="(.*?)">/)[1];
  assert.match(description, /Kenya/);
  assert.match(description, /safari/i);
});
