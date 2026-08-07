import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import packages, { PRICES } from '../data/packages.js';
import destinations from '../data/destinations.js';
import { validatePackage, assertAllValid } from '../lib/validate.js';

test('every package passes schema validation', () => {
  assert.doesNotThrow(() => assertAllValid(packages, validatePackage, 'package'));
});

test('slugs are unique', () => {
  const slugs = packages.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('every priceKey resolves to a price entry', () => {
  for (const pkg of packages) {
    assert.ok(PRICES[pkg.priceKey], `no PRICES entry for ${pkg.priceKey}`);
    assert.equal(typeof PRICES[pkg.priceKey].fromKes, 'number');
    assert.ok(PRICES[pkg.priceKey].fromKes > 0);
  }
});

test('every destination slug on a package exists in destinations.js', () => {
  const known = new Set(destinations.map((d) => d.slug));
  for (const pkg of packages) {
    for (const slug of pkg.destinations) {
      assert.ok(known.has(slug), `${pkg.slug} references unknown destination "${slug}"`);
    }
  }
});

test('the PLACEHOLDER price warning is present', () => {
  const source = readFileSync(new URL('../data/packages.js', import.meta.url), 'utf8');
  assert.match(source, /PLACEHOLDER, EDIT BEFORE LAUNCH/);
});

test('no price is hard-coded outside the PRICES block', () => {
  const source = readFileSync(new URL('../data/packages.js', import.meta.url), 'utf8');
  const afterPrices = source.slice(source.indexOf('export default'));
  assert.doesNotMatch(afterPrices, /\$\s?\d/, 'a dollar figure appears in package copy');
});

test('the 6 Masai Mara & Rift Valley packages are present', () => {
  const mara = packages.filter((p) => p.category === 'Masai Mara & Rift Valley');
  assert.equal(mara.length, 6);
});

test('the 4 Amboseli & Tsavo packages are present', () => {
  assert.equal(packages.filter((p) => p.category === 'Amboseli & Tsavo').length, 4);
});

test('the 5 Laikipia & the North packages are present', () => {
  assert.equal(packages.filter((p) => p.category === 'Laikipia & the North').length, 5);
});

test('exactly 2 packages are flagged signature', () => {
  const signature = packages.filter((p) => p.signature).map((p) => p.slug).sort();
  assert.deepEqual(signature, [
    '3-day-laikipia-walking-tracking-safari',
    '4-day-borana-lewa-conservation-safari',
  ]);
});

test('there are exactly 21 packages', () => {
  assert.equal(packages.length, 21);
});

test('the 3 Mount Kenya packages are present', () => {
  assert.equal(packages.filter((p) => p.category === 'Mount Kenya').length, 3);
});

test('the 3 Coast packages are present', () => {
  assert.equal(packages.filter((p) => p.category === 'Coast').length, 3);
});

test('every destination has at least one package', () => {
  const covered = new Set(packages.flatMap((p) => p.destinations));
  for (const dest of destinations) {
    assert.ok(covered.has(dest.slug), `no package visits ${dest.slug}`);
  }
});
