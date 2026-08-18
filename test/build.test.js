import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import { metaDescription } from '../templates/package.js';
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
  // Match every prefilled WhatsApp link, not just the first: package pages
  // that visit a balloon park also carry the balloon add-on's own CTA, which
  // is prefilled with the flight rather than the trip. The assertion is that
  // the trip's CTA exists, not that it is the only one on the page.
  const matches = [...page.matchAll(/https:\/\/wa\.me\/254707415444\?text=([^"]+)/g)]
    .map((m) => decodeURIComponent(m[1]));
  assert.ok(matches.length, 'no WhatsApp link on the page');
  const wanted = new RegExp(pkg.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  assert.ok(
    matches.some((text) => wanted.test(text)),
    `no WhatsApp CTA prefilled with "${pkg.title}"; found: ${JSON.stringify(matches)}`,
  );
});

test('no image is missing alt text', () => {
  for (const { path, html } of all) {
    const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    for (const img of imgs) {
      assert.ok(/\salt="/.test(img), `${path} has an <img> with no alt attribute`);
    }
  }
});

test('meta description composer guarantees the 50-char floor even for a pathological short package', () => {
  // A deliberately minimal package: a one-word title, a one-day trip and a
  // two-character summary. The summary alone is nowhere near 50 chars, so
  // this exercises the compose-a-fallback branch of metaDescription().
  const minimal = { title: 'Mara', days: 1, nights: 0, summary: 'A.' };
  const description = metaDescription(minimal);
  assert.ok(
    description.length >= 50 && description.length <= 165,
    `description length ${description.length} outside 50-165: "${description}"`,
  );
});
