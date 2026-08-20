import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pages } from '../build.js';
import packages from '../data/packages.js';

const index = new Map(pages().map((p) => [p.path, p.html])).get('/safaris/');

test('the safaris index exists', () => {
  assert.ok(index);
});

test('every package is in the static HTML', () => {
  for (const pkg of packages) {
    assert.ok(index.includes(`/safaris/${pkg.slug}/`), `index omits ${pkg.slug}`);
  }
});

test('every card carries filter data attributes', () => {
  const cards = [...index.matchAll(/<article class="pkg-card"[^>]*>/g)].map((m) => m[0]);
  assert.equal(cards.length, packages.length);
  for (const card of cards) {
    assert.match(card, /data-destinations="/);
    assert.match(card, /data-days="\d+"/);
    assert.match(card, /data-category="/);
  }
});

test('all five category headings appear', () => {
  for (const category of [
    'Masai Mara &amp; Rift Valley', 'Amboseli &amp; Tsavo',
    'Laikipia &amp; the North', 'Mount Kenya', 'Coast',
  ]) {
    assert.ok(index.includes(category), `missing category heading ${category}`);
  }
});

test('filter controls are real form controls, not divs', () => {
  assert.match(index, /<select[^>]+id="filter-destination"/);
  assert.match(index, /<select[^>]+id="filter-duration"/);
  assert.match(index, /<label[^>]+for="filter-destination"/);
  assert.match(index, /<label[^>]+for="filter-duration"/);
});

test('the filter logic lives in app.js, not inline', () => {
  assert.doesNotMatch(index, /\son[a-z]+=/i);
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(app, /filter-destination/);
});
