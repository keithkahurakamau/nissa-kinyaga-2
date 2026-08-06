import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePackage, validateDestination, assertAllValid } from '../lib/validate.js';

const valid = {
  slug: '2-day-tsavo-east',
  title: '2-Day Tsavo East',
  days: 2,
  nights: 1,
  category: 'Amboseli & Tsavo',
  destinations: ['tsavo'],
  priceKey: 'tsavo2',
  hero: '/assets/p10.jpg',
  heroAlt: 'Red dust rising behind a herd of elephant',
  summary: 'A short run into the red earth of Tsavo East.',
  overview: ['Paragraph one.', 'Paragraph two.'],
  itinerary: [
    { day: 1, title: 'Nairobi to Tsavo East', body: 'Body copy.' },
    { day: 2, title: 'Morning drive and return', body: 'Body copy.' },
  ],
  included: ['Park fees', 'Transport', 'Full-board accommodation', 'Guiding'],
  excluded: ['International flights', 'Visas', 'Tips'],
  bestTime: 'June to October, and January to February.',
  faqs: [
    { q: 'Q1?', a: 'A1.' },
    { q: 'Q2?', a: 'A2.' },
    { q: 'Q3?', a: 'A3.' },
  ],
  signature: false,
};

test('a well-formed package reports no problems', () => {
  assert.deepEqual(validatePackage(valid), []);
});

test('itinerary length must equal days', () => {
  const bad = { ...valid, days: 3 };
  assert.ok(validatePackage(bad).some((p) => p.includes('itinerary')));
});

test('slug must match the slugified title', () => {
  const bad = { ...valid, slug: 'wrong-slug' };
  assert.ok(validatePackage(bad).some((p) => p.includes('slug')));
});

test('missing required fields are each reported', () => {
  const problems = validatePackage({ slug: 'x' });
  assert.ok(problems.length >= 10);
  assert.ok(problems.some((p) => p.includes('title')));
  assert.ok(problems.some((p) => p.includes('hero')));
});

test('heroAlt must be present and non-trivial', () => {
  const bad = { ...valid, heroAlt: '' };
  assert.ok(validatePackage(bad).some((p) => p.includes('heroAlt')));
});

test('faqs must number between 3 and 5', () => {
  const bad = { ...valid, faqs: [{ q: 'Q?', a: 'A.' }] };
  assert.ok(validatePackage(bad).some((p) => p.includes('faqs')));
});

test('a well-formed destination reports no problems', () => {
  assert.deepEqual(
    validateDestination({
      slug: 'tsavo',
      name: 'Tsavo East & Tsavo West',
      shortName: 'Tsavo',
      hero: '/assets/p10.jpg',
      heroAlt: 'Dust and thorn scrub under a wide sky',
      summary: "Kenya's largest protected wilderness.",
      overview: ['One.', 'Two.'],
      wildlife: ['Elephant', 'Lion', 'Buffalo'],
      bestTime: 'June to October.',
      gettingThere: 'Five hours by road from Nairobi.',
      nissaNote: 'I guided here for several seasons.',
    }),
    []
  );
});

test('assertAllValid throws listing every problem', () => {
  assert.throws(
    () => assertAllValid([{ slug: 'x' }], validatePackage, 'package'),
    /package/
  );
});

test('assertAllValid passes silently when all items are valid', () => {
  assert.doesNotThrow(() => assertAllValid([valid], validatePackage, 'package'));
});
