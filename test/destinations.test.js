import test from 'node:test';
import assert from 'node:assert/strict';
import destinations from '../data/destinations.js';
import { validateDestination, assertAllValid } from '../lib/validate.js';

test('there are exactly 8 destinations with the expected slugs', () => {
  assert.equal(destinations.length, 8);
  assert.deepEqual(destinations.map((d) => d.slug).sort(), [
    'amboseli', 'diani', 'laikipia', 'masai-mara',
    'mount-kenya', 'ol-pejeta', 'samburu', 'tsavo',
  ]);
});

test('every destination passes schema validation', () => {
  assert.doesNotThrow(() => assertAllValid(destinations, validateDestination, 'destination'));
});

test('slugs are unique', () => {
  const slugs = destinations.map((d) => d.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('first-hand notes appear only where Nissa has worked', () => {
  const withNote = destinations.filter((d) => d.nissaNote).map((d) => d.slug).sort();
  assert.deepEqual(withNote, ['laikipia', 'masai-mara', 'samburu', 'tsavo']);
});

test('hero alt text never names a national park', () => {
  const parks = /masai mara|maasai mara|amboseli|samburu|ol pejeta|tsavo|borana|lewa|diani/i;
  for (const dest of destinations) {
    assert.doesNotMatch(dest.heroAlt, parks, `${dest.slug} heroAlt names a park`);
  }
});
