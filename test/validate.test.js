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

test('faqs must number between 3 and 6', () => {
  const tooFew = { ...valid, faqs: [{ q: 'Q?', a: 'A.' }] };
  assert.ok(validatePackage(tooFew).some((p) => p.includes('faqs')));
  // The upper bound was untested, which is how it went unnoticed that six
  // was rejected until a package legitimately needed six.
  const tooMany = { ...valid, faqs: Array.from({ length: 7 }, () => ({ q: 'Q?', a: 'A.' })) };
  assert.ok(validatePackage(tooMany).some((p) => p.includes('faqs')));
  const six = { ...valid, faqs: Array.from({ length: 6 }, () => ({ q: 'Q?', a: 'A.' })) };
  assert.ok(!validatePackage(six).some((p) => p.includes('faqs')), 'six FAQs must be allowed');
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

test('destinations array elements must be non-empty strings', () => {
  const bad = { ...valid, destinations: [42] };
  assert.ok(validatePackage(bad).some((p) => p.includes('destinations')));
});

test('included array elements must be non-empty strings', () => {
  const bad = { ...valid, included: ['', '', '', ''] };
  assert.ok(validatePackage(bad).some((p) => p.includes('included')));
});

test('excluded array elements must be non-empty strings', () => {
  const bad = { ...valid, excluded: ['', '', ''] };
  assert.ok(validatePackage(bad).some((p) => p.includes('excluded')));
});

test('overview array elements must be non-empty strings in package', () => {
  const bad = { ...valid, overview: ['Real paragraph', ''] };
  assert.ok(validatePackage(bad).some((p) => p.includes('overview')));
});

test('overview array elements must be non-empty strings in destination', () => {
  const bad = {
    slug: 'tsavo',
    name: 'Tsavo',
    shortName: 'Tsavo',
    hero: '/assets/p10.jpg',
    heroAlt: 'Dust and thorn scrub under a wide sky',
    summary: 'Kenya largest protected wilderness.',
    overview: ['Real', ''],
    wildlife: ['Elephant', 'Lion', 'Buffalo'],
    bestTime: 'June to October.',
    gettingThere: 'Five hours by road.',
  };
  assert.ok(validateDestination(bad).some((p) => p.includes('overview')));
});

test('wildlife array elements must be non-empty strings', () => {
  const bad = {
    slug: 'tsavo',
    name: 'Tsavo',
    shortName: 'Tsavo',
    hero: '/assets/p10.jpg',
    heroAlt: 'Dust and thorn scrub under a wide sky',
    summary: 'Kenya largest protected wilderness.',
    overview: ['One.', 'Two.'],
    wildlife: ['Elephant', '', 'Buffalo'],
    bestTime: 'June to October.',
    gettingThere: 'Five hours by road.',
  };
  assert.ok(validateDestination(bad).some((p) => p.includes('wildlife')));
});

test('assertAllValid catches duplicate package slugs', () => {
  const pkg1 = { ...valid, slug: 'same-slug' };
  const pkg2 = { ...valid, slug: 'same-slug', title: 'Different Title' };
  assert.throws(
    () => assertAllValid([pkg1, pkg2], validatePackage, 'package'),
    /duplicate.*slug|slug.*duplicate|same-slug/i
  );
});

test('empty-string slug is identified in error message', () => {
  const bad = { ...valid, slug: '', title: '2-Day Tsavo East' };
  const problems = validatePackage(bad);
  // Should have a problem string that includes identifying info, not just ": slug is required"
  assert.ok(problems.some((p) => p !== ': slug is required'));
});

