import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import packages from '../data/packages.js';

const all = pages();
const byPath = new Map(all.map((p) => [p.path, p.html]));

test('one page is emitted per package', () => {
  for (const pkg of packages) {
    assert.ok(byPath.has(`/safaris/${pkg.slug}/`), `missing page for ${pkg.slug}`);
  }
});

test('every page has a unique title', () => {
  const titles = all
    .filter((p) => p.path.endsWith('/'))
    .map((p) => p.html.match(/<title>(.*?)<\/title>/)[1]);
  assert.equal(new Set(titles).size, titles.length, 'duplicate <title> found');
});

test('every page has a unique meta description of 50-165 chars', () => {
  const descriptions = all
    .filter((p) => p.path.endsWith('/'))
    .map((p) => p.html.match(/<meta name="description" content="(.*?)">/)[1]);
  assert.equal(new Set(descriptions).size, descriptions.length);
  for (const d of descriptions) {
    assert.ok(d.length >= 50 && d.length <= 165, `description length ${d.length}: ${d}`);
  }
});

test('every page canonical matches its own path', () => {
  for (const { path, html } of all) {
    if (!path.endsWith('/')) continue;
    assert.ok(
      html.includes(`<link rel="canonical" href="https://nissasafaris.com${path}">`),
      `bad canonical on ${path}`
    );
  }
});

test('a package page renders its full itinerary', () => {
  const pkg = packages.find((p) => p.days === 3);
  const page = byPath.get(`/safaris/${pkg.slug}/`);
  for (const entry of pkg.itinerary) {
    assert.ok(page.includes(entry.title), `missing itinerary entry "${entry.title}"`);
  }
});

test('a package page carries TouristTrip and FAQPage schema', () => {
  const page = byPath.get(`/safaris/${packages[0].slug}/`);
  assert.match(page, /"@type":"TouristTrip"/);
  assert.match(page, /"@type":"FAQPage"/);
  assert.match(page, /"@type":"BreadcrumbList"/);
});

test('a package page CTA reaches WhatsApp prefilled with the package name', () => {
  const pkg = packages[0];
  const page = byPath.get(`/safaris/${pkg.slug}/`);
  const match = page.match(/https:\/\/wa\.me\/254707415444\?text=([^"]+)/);
  assert.ok(match, 'no WhatsApp link on the page');
  assert.match(decodeURIComponent(match[1]), new RegExp(pkg.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('no image is missing alt text', () => {
  for (const { path, html } of all) {
    const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    for (const img of imgs) {
      assert.ok(/\salt="/.test(img), `${path} has an <img> with no alt attribute`);
    }
  }
});
