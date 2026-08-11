import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import journeys from '../data/journeys.js';

const byPath = new Map(pages().map((p) => [p.path, p.html]));

test('one page is emitted per journey country, plus an index', () => {
  assert.ok(byPath.has('/journeys/'));
  for (const country of journeys) {
    assert.ok(byPath.has(`/journeys/${country.slug}/`), `missing ${country.slug}`);
  }
});

test('there are nine countries split across the two named regions', () => {
  assert.equal(journeys.length, 9);
  const eastern = journeys.filter((c) => c.region === 'Eastern Africa');
  const southern = journeys.filter((c) => c.region === 'Southern Africa');
  assert.deepEqual(eastern.map((c) => c.slug).sort(), ['rwanda', 'tanzania', 'uganda']);
  assert.deepEqual(southern.map((c) => c.slug).sort(), [
    'botswana', 'mozambique', 'namibia', 'south-africa', 'zambia', 'zimbabwe',
  ]);
});

test('the journeys index links to all 9 countries, grouped by region', () => {
  const index = byPath.get('/journeys/');
  for (const country of journeys) {
    assert.ok(index.includes(`/journeys/${country.slug}/`), `index omits ${country.slug}`);
  }
  assert.match(index, /Eastern Africa/);
  assert.match(index, /Southern Africa/);
});

test('a journey page carries TouristDestination schema and a BreadcrumbList, never an Offer', () => {
  for (const country of journeys) {
    const page = byPath.get(`/journeys/${country.slug}/`);
    assert.match(page, /"@type":"TouristDestination"/);
    assert.match(page, /"@type":"BreadcrumbList"/);
    assert.doesNotMatch(page, /"@type":"Offer"/);
    assert.doesNotMatch(page, /"offers"/);
  }
});

test('no journey page renders a first-hand nissa-note, and none claims Nissa guided there personally', () => {
  for (const country of journeys) {
    const page = byPath.get(`/journeys/${country.slug}/`);
    assert.doesNotMatch(page, /class="nissa-note"/, `${country.slug} renders a first-hand note`);
    assert.doesNotMatch(page, /when i guided|i have guided|my years guiding/i, `${country.slug} claims first-hand guiding`);
  }
});

test('a journey page has a working WhatsApp enquiry CTA and no itinerary section', () => {
  for (const country of journeys) {
    const page = byPath.get(`/journeys/${country.slug}/`);
    assert.match(page, /https:\/\/wa\.me\/254707415444/);
    assert.doesNotMatch(page, /class="itinerary"/);
  }
});

test('no journey page states a price, a "from" figure, or KSh/USD currency', () => {
  for (const [path, html] of Object.entries(Object.fromEntries(byPath))) {
    if (!path.startsWith('/journeys/')) continue;
    assert.doesNotMatch(html, /KSh\s?[\d,]+/, `${path} mentions a price`);
    assert.doesNotMatch(html, /\bUSD\s?\$?\d/, `${path} mentions a price`);
    assert.doesNotMatch(html, /From \$[\d,]+/i, `${path} mentions a price`);
  }
});

test('no journey page uses an em dash', () => {
  for (const country of journeys) {
    const page = byPath.get(`/journeys/${country.slug}/`);
    assert.doesNotMatch(page, /—/, `${country.slug} contains an em dash`);
  }
});

test('the journeys catalogue is reachable from the nav on every page', () => {
  const home = byPath.get('/');
  assert.ok(home.includes('href="/journeys/"'));
});
