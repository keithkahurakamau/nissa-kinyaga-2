import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import packages from '../data/packages.js';
import destinations from '../data/destinations.js';
import { validatePackage, assertAllValid } from '../lib/validate.js';

test('every package passes schema validation', () => {
  assert.doesNotThrow(() => assertAllValid(packages, validatePackage, 'package'));
});

test('slugs are unique', () => {
  const slugs = packages.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('every destination slug on a package exists in destinations.js', () => {
  const known = new Set(destinations.map((d) => d.slug));
  for (const pkg of packages) {
    for (const slug of pkg.destinations) {
      assert.ok(known.has(slug), `${pkg.slug} references unknown destination "${slug}"`);
    }
  }
});

test('no price is hard-coded in the package copy', () => {
  const source = readFileSync(new URL('../data/packages.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /From KSh/, '"From KSh" appears in package copy');
  assert.doesNotMatch(source, /PRICES/, 'a PRICES block appears in package copy');
  assert.doesNotMatch(source, /\$\s?\d/, 'a dollar figure appears in package copy');
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

test('there are exactly 23 packages', () => {
  assert.equal(packages.length, 23);
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

/* ---------------------------------------------------------------------------
   Food and drink
   ---------------------------------------------------------------------------
   Every trip is full board with drinks, alcohol included. That is a client
   decision about what the business sells, and it has to be stated the same
   way on all 23 packages: a guest comparing two itineraries and finding meals
   spelled out on one but not the other will reasonably assume the other does
   not include them. These tests keep the set consistent, and keep a stale
   exclusion from contradicting an inclusion on the same page.
--------------------------------------------------------------------------- */

test('every package states that meals are included', () => {
  for (const pkg of packages) {
    assert.ok(
      pkg.included.some((item) => /^All meals/i.test(item)),
      `${pkg.slug} does not say meals are included`,
    );
  }
});

test('every package includes soft drinks and alcohol', () => {
  for (const pkg of packages) {
    assert.ok(
      pkg.included.some((item) => /Soft drinks, juices, tea and coffee/i.test(item)),
      `${pkg.slug} omits soft drinks`,
    );
    assert.ok(
      pkg.included.some((item) => /Beer, wine and spirits/i.test(item)),
      `${pkg.slug} omits alcoholic drinks`,
    );
  }
});

// The failure this catches is a page that both promises and refuses the same
// thing, which is worse than either alone: it is the kind of contradiction a
// guest notices only after they have been charged for a bar bill.
test('no package excludes something it also includes', () => {
  for (const pkg of packages) {
    for (const item of pkg.excluded) {
      assert.doesNotMatch(item, /alcohol/i, `${pkg.slug} still excludes alcohol`);
      assert.doesNotMatch(item, /\blunch|\bdinner/i, `${pkg.slug} still excludes a meal`);
    }
  }
});

// Board basis is the single most misread line on any itinerary. Nothing is
// half board or bed-and-breakfast any more, so nothing should say so.
test('no package is still sold on a bed-and-breakfast basis', () => {
  for (const pkg of packages) {
    for (const item of [...pkg.included, ...pkg.excluded]) {
      assert.doesNotMatch(item, /bed-and-breakfast|half board/i,
        `${pkg.slug} still describes a partial board basis: "${item}"`);
    }
  }
});
