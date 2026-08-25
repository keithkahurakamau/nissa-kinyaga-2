import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import gallery from '../data/gallery.js';
import { galleryPage } from '../templates/gallery.js';
import { copyrightPage } from '../templates/legal.js';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const appJs = readFileSync(join(ROOT, 'app.js'), 'utf8');
const page = galleryPage();
const credited = gallery.filter((item) => item.credit);

/* ---------------------------------------------------------------------------
   Gallery tiles
--------------------------------------------------------------------------- */

// The mosaic sizes tiles from their position, which knows nothing about a
// photograph's shape. A wide panorama landing on a portrait tile loses its
// subject off both ends, so an item may override the rhythm with `tile`. A
// typo there must fail the build rather than silently fall back to a crop
// that ruins the frame.
test('gallery tile overrides are valid, and panoramas are not left to the rhythm', async () => {


  const allowed = new Set(['feature', 'tall', 'normal']);
  for (const item of gallery) {
    if (item.tile === undefined) continue;
    assert.ok(allowed.has(item.tile), `${item.src} has an unknown tile "${item.tile}"`);
  }

  const overridden = gallery.filter((item) => item.tile === 'feature');
  for (const item of overridden) {
    const at = page.indexOf(item.src);
    assert.ok(at > -1, `${item.src} is not on the page`);
    const figure = page.lastIndexOf('<figure', at);
    assert.match(page.slice(figure, at), /gal-item gal-tile-feature/,
      `${item.src} asked for a feature tile and did not get one`);
  }
});

test('an unknown gallery tile value fails the build rather than cropping badly', async () => {

  const original = gallery[0].tile;
  gallery[0].tile = 'enormous';

  assert.throws(() => galleryPage(), /unknown gallery tile "enormous"/);
  gallery[0].tile = original;
});

/* ---------------------------------------------------------------------------
   Credited photographs
   ---------------------------------------------------------------------------
   The gallery's claim is that these are Nissa's own photographs. Three
   flamingo frames are not, and are used under CC BY-SA instead. That licence
   requires the author, the licence and a route back to the source to travel
   with the image, and the site's own /copyright/ page promises that nothing
   here is "stock photography passed off as ours". These tests are what makes
   both statements true rather than aspirational.
--------------------------------------------------------------------------- */

test('every credit carries all four fields, and they are usable', () => {
  for (const item of credited) {
    const { author, license, licenseUrl, sourceUrl } = item.credit;
    assert.ok(author && author.length > 2, `${item.src}: no author`);
    assert.ok(license && /CC /.test(license), `${item.src}: no recognisable licence`);
    assert.match(licenseUrl, /^https:\/\/creativecommons\.org\//, `${item.src}: licence URL is not Creative Commons`);
    assert.match(sourceUrl, /^https:\/\//, `${item.src}: source URL must be absolute`);
  }
});

// A half-filled credit is the dangerous state: it looks credited in the data
// and renders as nothing, which is indistinguishable from passing the
// photograph off as ours.
test('no gallery item carries a partial credit', () => {
  for (const item of gallery) {
    if (!item.credit) continue;
    const keys = Object.keys(item.credit).sort();
    assert.deepEqual(keys, ['author', 'license', 'licenseUrl', 'sourceUrl'],
      `${item.src} has an incomplete credit: ${keys.join(', ')}`);
  }
});

test('a credited photograph names its photographer on the tile itself', () => {
  for (const item of credited) {
    const at = page.indexOf(item.src);
    assert.ok(at > -1, `${item.src} is not on the page`);
    const figureEnd = page.indexOf('</figure>', at);
    const figure = page.slice(page.lastIndexOf('<figure', at), figureEnd);
    assert.ok(figure.includes(item.credit.author),
      `${item.src} shows no photographer on the tile, so it reads as Nissa's own`);
    assert.ok(figure.includes(item.credit.license), `${item.src} shows no licence on the tile`);
  }
});

test('the lightbox is given the data to build a linked attribution', () => {
  for (const item of credited) {
    assert.ok(page.includes(`data-credit-author="${item.credit.author}"`), `${item.src}: no author data`);
    assert.ok(page.includes(`data-credit-source-url="${item.credit.sourceUrl}"`), `${item.src}: no source data`);
  }
  assert.match(page, /<p id="nk-lb-credit" class="lb-credit" hidden><\/p>/,
    'the lightbox has no credit slot, or it does not ship hidden');
  assert.match(appJs, /data-credit-author/, 'app.js never reads the credit data');
  // Built as nodes, never as an HTML string.
  assert.match(appJs, /createElement\('a'\)/, 'app.js should build the credit links as elements');
  assert.doesNotMatch(appJs, /lbCredit\.innerHTML/, 'the credit must not be built with innerHTML');
});

test('every credited photograph is listed on /copyright/', () => {
  const copyright = copyrightPage();
  for (const item of credited) {
    assert.ok(copyright.includes(item.credit.author), `${item.src}: photographer missing from /copyright/`);
    assert.ok(copyright.includes(item.credit.sourceUrl), `${item.src}: source link missing from /copyright/`);
    assert.ok(copyright.includes(item.credit.licenseUrl), `${item.src}: licence link missing from /copyright/`);
    assert.ok(copyright.includes(item.title), `${item.src}: not identified on /copyright/`);
  }
});

// The page used to say every photograph was Nissa's own work. With credited
// frames in the set that is no longer true, and the wording had to move with
// the content rather than after someone noticed.
test('the gallery does not claim every photograph is Nissa\'s own', () => {
  if (!credited.length) return;
  const lede = page.slice(page.indexOf('class="lede"'), page.indexOf('</p>', page.indexOf('class="lede"')));
  assert.match(lede, /licensed from others|credited/i,
    'the lede must acknowledge that some frames are not Nissa\'s');
  const description = page.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.doesNotMatch(description, /Photographs from Nissa&#39;s own/,
    'the meta description still claims every frame is his');
});

test('every credited image file actually exists', () => {
  for (const item of credited) {
    assert.ok(existsSync(join(ROOT, item.src.replace(/^\//, ''))), `${item.src} is missing from assets/`);
  }
});
