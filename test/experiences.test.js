import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { balloonSafari } from '../data/experiences.js';
import destinations from '../data/destinations.js';
import packages from '../data/packages.js';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const read = (p) => readFileSync(join(ROOT, 'dist', p, 'index.html'), 'utf8');

const BALLOON_PARKS = Object.keys(balloonSafari.parks);

test('balloon parks are real destinations', () => {
  const slugs = new Set(destinations.map((d) => d.slug));
  for (const slug of BALLOON_PARKS) {
    assert.ok(slugs.has(slug), `${slug} is not a destination`);
  }
});

test('every balloon photograph exists on disk', () => {
  const images = [balloonSafari.hero, ...Object.values(balloonSafari.parks).map((p) => p.image)];
  for (const src of images) {
    assert.ok(existsSync(join(ROOT, src.replace(/^\//, ''))), `missing ${src}`);
  }
});

test('every balloon image has alt text describing the frame', () => {
  for (const park of Object.values(balloonSafari.parks)) {
    assert.ok(park.imageAlt && park.imageAlt.length > 20, 'balloon image needs real alt text');
    assert.doesNotMatch(park.imageAlt, /balloon safari in (the )?(Mara|Amboseli)/i,
      'alt text must describe the photograph, not assert where it was taken');
  }
});

// The two parks that have flights show the block; nothing else may.
test('the balloon add-on appears on exactly the parks that have flights', () => {
  for (const dest of destinations) {
    const page = read(`destinations/${dest.slug}`);
    const shown = page.includes('Hot air balloon safari');
    assert.equal(shown, BALLOON_PARKS.includes(dest.slug),
      `${dest.slug} ${shown ? 'shows' : 'is missing'} the balloon add-on`);
  }
});

test('a package shows the balloon add-on exactly when it visits a balloon park', () => {
  for (const pkg of packages) {
    const page = read(`safaris/${pkg.slug}`);
    const expected = pkg.destinations.some((d) => BALLOON_PARKS.includes(d));
    assert.equal(page.includes('Hot air balloon safari'), expected,
      `${pkg.slug} balloon add-on state is wrong`);
  }
});

test('a package visiting two balloon parks renders the block only once', () => {
  const both = packages.find(
    (p) => p.destinations.filter((d) => BALLOON_PARKS.includes(d)).length > 1,
  );
  assert.ok(both, 'expected a package visiting both Mara and Amboseli');
  const page = read(`safaris/${both.slug}`);
  assert.equal((page.match(/Add-on experience/g) || []).length, 1,
    `${both.slug} renders the balloon section more than once`);
});

// Nissa does not fly the balloons; a licensed balloon company does. Claiming
// otherwise would misstate who carries responsibility in the air.
test('the balloon copy never claims we fly the aircraft', () => {
  assert.match(balloonSafari.operatorNote, /licensed balloon operator/i);
  assert.match(balloonSafari.operatorNote, /not by us/i);
  const prose = [
    balloonSafari.summary,
    ...balloonSafari.howItWorks,
    ...balloonSafari.practical,
    ...Object.values(balloonSafari.parks).map((p) => p.body),
  ].join(' ');
  assert.doesNotMatch(prose, /\b(our|we) (balloons?|pilots?|aircraft)\b/i);
  assert.doesNotMatch(prose, /\bwe fly you\b/i);
});

test('the balloon copy quotes no price and no unverifiable limit', () => {
  const prose = JSON.stringify(balloonSafari);
  assert.doesNotMatch(prose, /(KES|USD|\$|Ksh)\s?[\d,]/i, 'prices are removed sitewide');
  assert.doesNotMatch(prose, /\b\d+\s?(kg|kilograms|years old)\b/i,
    'weight and age limits are not sourced, so must not be stated');
});

test('the balloon add-on carries no em dashes', () => {
  for (const slug of BALLOON_PARKS) {
    assert.ok(!read(`destinations/${slug}`).includes('—'), `em dash on ${slug}`);
  }
});
