import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import destinations from '../data/destinations.js';
import packages from '../data/packages.js';

const byPath = new Map(pages().map((p) => [p.path, p.html]));

test('one page is emitted per destination, plus an index', () => {
  assert.ok(byPath.has('/destinations/'));
  for (const dest of destinations) {
    assert.ok(byPath.has(`/destinations/${dest.slug}/`), `missing ${dest.slug}`);
  }
});

test('a destination page lists every package that visits it', () => {
  for (const dest of destinations) {
    const page = byPath.get(`/destinations/${dest.slug}/`);
    const here = packages.filter((p) => p.destinations.includes(dest.slug));
    assert.ok(here.length > 0);
    for (const pkg of here) {
      assert.ok(page.includes(`/safaris/${pkg.slug}/`), `${dest.slug} omits ${pkg.slug}`);
    }
  }
});

test('destination pages carry TouristAttraction schema', () => {
  const page = byPath.get(`/destinations/${destinations[0].slug}/`);
  assert.match(page, /"@type":"TouristAttraction"/);
});

test('the first-hand note renders only where nissaNote is set', () => {
  for (const dest of destinations) {
    const page = byPath.get(`/destinations/${dest.slug}/`);
    const hasBlock = page.includes('class="nissa-note"');
    assert.equal(hasBlock, Boolean(dest.nissaNote), `nissa-note mismatch on ${dest.slug}`);
  }
});

test('the destinations index links to all 8', () => {
  const index = byPath.get('/destinations/');
  for (const dest of destinations) {
    assert.ok(index.includes(`/destinations/${dest.slug}/`), `index omits ${dest.slug}`);
  }
});
