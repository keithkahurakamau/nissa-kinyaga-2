import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../build.js';
import site from '../data/site.js';
import journeys from '../data/journeys.js';
import { inlineLinks } from '../lib/text.js';
import { renderToString } from '../lib/html.js';
import {
  lastUpdated,
  commercialTermsPending,
  storage,
  processors,
  terms,
  privacy,
  cookies,
  copyright,
} from '../data/legal.js';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const byPath = new Map(pages().map((p) => [p.path, p.html]));
const appJs = readFileSync(join(ROOT, 'app.js'), 'utf8');

const LEGAL = {
  '/terms/': terms,
  '/privacy/': privacy,
  '/cookies/': cookies,
  '/copyright/': copyright,
};

test('all four legal pages are emitted', () => {
  for (const path of Object.keys(LEGAL)) assert.ok(byPath.has(path), `missing ${path}`);
});

test('every legal page carries a heading, a contents list and a last-updated date', () => {
  for (const [path, sections] of Object.entries(LEGAL)) {
    const page = byPath.get(path);
    assert.match(page, /<h1 class="display">/, `${path} has no h1`);
    assert.match(page, /class="legal-toc"/, `${path} has no contents list`);
    assert.ok(page.includes(`Last updated ${lastUpdated}`), `${path} shows no last-updated date`);
    for (const section of sections) {
      assert.ok(page.includes(`id="${section.id}"`), `${path} is missing section ${section.id}`);
      assert.ok(page.includes(`href="#${section.id}"`), `${path} contents omits ${section.id}`);
    }
  }
});

test('section ids are unique within each page', () => {
  for (const [path, sections] of Object.entries(LEGAL)) {
    const ids = sections.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, `${path} has duplicate section ids`);
  }
});

test('every legal page is reachable from the footer of every page', () => {
  for (const [path, page] of byPath) {
    if (!path.endsWith('/')) continue;
    for (const link of site.legalLinks) {
      assert.ok(page.includes(`href="${link.href}"`), `${path} does not link to ${link.href}`);
    }
  }
});

/* ---------------------------------------------------------------------------
   The cookie policy against the code
   ---------------------------------------------------------------------------
   A cookie policy is a factual claim about what a program does, and it is the
   claim most likely to quietly stop being true: someone adds a preference,
   stores it, and never thinks about the policy page. These two tests are the
   only thing standing between that and a false statement on a published legal
   document, so they check the code rather than the prose.
--------------------------------------------------------------------------- */

test('the "no cookies" claim is true of the code that ships', () => {
  assert.doesNotMatch(appJs, /document\s*\.\s*cookie/,
    'app.js touches document.cookie, but /cookies/ states this site sets none');
  assert.match(byPath.get('/cookies/'), /sets no cookies/i);
});

// Resolves what each localStorage call site actually reads or writes, whether
// the key is passed as a literal or, as app.js does, through a `var KEY = '...'`.
function storageKeysUsedByApp() {
  const consts = new Map();
  for (const [, name, value] of appJs.matchAll(/\b(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*'([^']*)'/g)) {
    consts.set(name, value);
  }
  const keys = new Set();
  const calls = appJs.matchAll(
    /localStorage\s*\.\s*(?:get|set|remove)Item\s*\(\s*(?:'([^']*)'|([A-Za-z_$][\w$]*))/g,
  );
  for (const [, literal, identifier] of calls) {
    if (literal !== undefined) keys.add(literal);
    else if (consts.has(identifier)) keys.add(consts.get(identifier));
    else assert.fail(`localStorage key "${identifier}" in app.js could not be resolved`);
  }
  return keys;
}

test('the storage table lists exactly what app.js stores, no more and no less', () => {
  const used = storageKeysUsedByApp();
  const declared = new Set(storage.map((item) => item.key));
  for (const key of used) {
    assert.ok(declared.has(key), `app.js stores "${key}" but /cookies/ does not disclose it`);
  }
  for (const key of declared) {
    assert.ok(used.has(key), `/cookies/ discloses "${key}" but app.js never stores it`);
  }
});

test('the cookie page shows the storage table and the way to change your mind', () => {
  const page = byPath.get('/cookies/');
  for (const item of storage) {
    assert.ok(page.includes(item.key), `${item.key} is missing from the storage table`);
    assert.ok(page.includes(item.duration), `${item.key} shows no retention period`);
  }
  // Consent must be as easy to withdraw as to give; before this control
  // existed the banner was a one-way door.
  assert.match(page, /id="nk-prefs-accept"/);
  assert.match(page, /id="nk-prefs-decline"/);
  assert.match(page, /id="nk-prefs-clear"/);
  assert.match(appJs, /nk-prefs-clear/, 'app.js does not wire up the clear button');
});

// Below 700px the legal tables stack into blocks and the <thead> is hidden,
// so each cell carries its own column heading in data-label. A cell without
// one loses its heading entirely on a phone, silently.
test('every legal table cell carries its column heading for the stacked mobile layout', () => {
  for (const path of ['/privacy/', '/cookies/']) {
    const page = byPath.get(path);
    for (const [table] of page.matchAll(/<table class="legal-table">[\s\S]*?<\/table>/g)) {
      const cells = [...table.matchAll(/<td\b[^>]*>/g)].map((m) => m[0]);
      assert.ok(cells.length > 0, `${path} renders a legal table with no cells`);
      for (const cell of cells) {
        assert.match(cell, /\sdata-label="[^"]+"/, `${path}: ${cell} has no data-label`);
      }
    }
  }
});

test('the consent banner does not claim to use cookies', () => {
  const home = byPath.get('/');
  const banner = home.slice(home.indexOf('id="nk-consent"'), home.indexOf('id="nk-wa"'));
  assert.doesNotMatch(banner, /we use cookies|uses cookies to/i);
  assert.match(banner, /no cookies/i);
  assert.match(banner, /href="\/cookies\/"/, 'the banner must link to the cookie policy');
});

/* ---------------------------------------------------------------------------
   Commercial terms
--------------------------------------------------------------------------- */

// The rule at the top of data/legal.js: a deposit percentage or cancellation
// scale nobody agreed to is worse on this page than no figure at all. While
// `commercialTermsPending` is true the quote is the only place they live, and
// this test fails the moment a plausible-looking figure appears here instead.
test('no invented deposit, cancellation or payment figure is published', () => {
  if (!commercialTermsPending) return;
  const prose = terms.flatMap((s) => [...s.paragraphs, ...(s.list ?? [])]).join('\n');
  const inventions = [
    /\b\d{1,3}\s?%/,
    /\b\d{1,3}\s?per\s?cent/i,
    /\b(?:a\s)?deposit of\b/i,
    /\b\d+\s?(?:days?|weeks?|months?)\s+(?:before|prior to|of)\b/i,
    /\b(?:KES|USD|EUR|GBP|\$|€|£)\s?[\d,]+/,
  ];
  for (const pattern of inventions) {
    assert.doesNotMatch(prose, pattern, `the terms publish a figure that was never agreed: ${pattern}`);
  }
});

test('the terms say the written quote governs, and where to find its numbers', () => {
  const page = byPath.get('/terms/');
  assert.match(page, /the quote is what governs/i);
  if (commercialTermsPending) {
    assert.match(page, /class="legal-note"/, 'the "where the numbers live" note is missing');
    assert.match(page, /written into your quote/i);
  }
});

// The clauses that carry actual safety or legal weight. If any of these is
// ever edited away, that is a decision someone should have to make on purpose.
test('the terms keep the clauses that matter most', () => {
  const page = byPath.get('/terms/');
  assert.match(page, /travel insurance/i, 'no insurance requirement');
  assert.match(page, /air evacuation/i, 'the insurance clause omits air evacuation');
  // The rendered page escapes the apostrophe, so match the escaped form.
  assert.match(page, /follow your guide&#39;s instructions/i, 'no safety instruction clause');
  assert.match(page, /laws of Kenya/i, 'no governing law');
  // Liability for death or personal injury caused by negligence cannot be
  // excluded, and a term attempting it is void. The page must not try.
  assert.match(page, /death or personal injury/i);
  assert.doesNotMatch(page, /exclude all liability|no liability whatsoever/i);
});

// The site brokers these rather than operating them, and says so everywhere
// else. The terms are where that distinction becomes contractual.
test('the terms repeat what the rest of the site says we do not operate', () => {
  const page = byPath.get('/terms/');
  assert.match(page, /We do not operate aircraft/i);
  assert.match(page, /Nissa does not guide inside those countries/i);
});

/* ---------------------------------------------------------------------------
   Privacy
--------------------------------------------------------------------------- */

test('the privacy policy names every third party and what reaches it', () => {
  const page = byPath.get('/privacy/');
  for (const entry of processors) {
    assert.ok(page.includes(entry.name), `${entry.name} is missing from the privacy policy`);
    assert.ok(page.includes(entry.sees), `${entry.name} does not say what it sees`);
    assert.ok(page.includes(entry.url), `${entry.name} links to no policy of its own`);
  }
});

test('the privacy policy states the rights and the regulator', () => {
  const page = byPath.get('/privacy/');
  assert.match(page, /Data Protection Act, 2019/);
  assert.match(page, /Office of the Data Protection Commissioner/);
  assert.match(page, /odpc\.go\.ke/);
  assert.match(page, /GDPR/);
});

// The claim the whole policy rests on. It is true because the forms hand
// their text to WhatsApp or a mail client, which is visible in app.js, and
// because the CSP has no endpoint for a form to post to.
test('the "forms never submit anywhere" claim matches the code', () => {
  assert.match(byPath.get('/privacy/'), /do not submit anywhere|never leave your browser|no backend/i);
  assert.doesNotMatch(appJs, /\bfetch\s*\(\s*['"`]https?:/,
    'app.js sends a request to a third-party origin');
  for (const [path, page] of byPath) {
    if (!path.endsWith('/')) continue;
    assert.doesNotMatch(page, /<form\b[^>]*\saction="/, `${path} has a form that posts somewhere`);
  }
});

/* ---------------------------------------------------------------------------
   Copyright
--------------------------------------------------------------------------- */

// CC BY-SA 4.0 requires the author, the licence and a route back to the
// source to travel with the image. Generating this list from data/journeys.js
// is what stops a licence obligation being quietly dropped when a photograph
// is swapped out.
test('every Creative Commons photograph is credited on the copyright page', () => {
  const page = byPath.get('/copyright/');
  const credited = journeys.filter((country) => country.heroCredit);
  assert.ok(credited.length > 0, 'no credited photographs found to check');
  for (const country of credited) {
    const { author, license, licenseUrl, sourceUrl } = country.heroCredit;
    assert.ok(page.includes(author), `${country.slug}: author not credited`);
    assert.ok(page.includes(license), `${country.slug}: licence not named`);
    assert.ok(page.includes(licenseUrl), `${country.slug}: no link to the licence`);
    assert.ok(page.includes(sourceUrl), `${country.slug}: no link back to the source`);
  }
});

test('the copyright page carries a takedown route and does not overclaim', () => {
  const page = byPath.get('/copyright/');
  assert.ok(page.includes(site.email), 'no address to report an infringement to');
  // Naming a regulator or a partner is not a claim of endorsement by them.
  assert.match(page, /does not imply that any of them endorses/i);
});

/* ---------------------------------------------------------------------------
   inlineLinks
--------------------------------------------------------------------------- */

const render = (text) => renderToString(inlineLinks(text));

test('inlineLinks escapes everything that is not a link', () => {
  assert.equal(render('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.equal(render('Fish & chips'), 'Fish &amp; chips');
});

test('inlineLinks builds internal and external anchors correctly', () => {
  assert.equal(render('see the [contact page](/contact/) for details'),
    'see the <a href="/contact/">contact page</a> for details');
  assert.equal(render('write to [us](mailto:a@b.com)'),
    'write to <a href="mailto:a@b.com">us</a>');
  // External links open in a new tab with rel="noopener noreferrer", the
  // invariant test/remaining-pages.test.js enforces across the whole site.
  assert.equal(render('read [it](https://example.com/x)'),
    'read <a href="https://example.com/x" target="_blank" rel="noopener noreferrer">it</a>');
});

test('inlineLinks refuses any href it does not recognise', () => {
  for (const bad of ['javascript:alert(1)', 'data:text/html,<b>', 'http://insecure.test', '//evil.test']) {
    const out = render(`click [here](${bad})`);
    assert.doesNotMatch(out, /<a\b/, `${bad} was turned into a link`);
    assert.ok(out.includes('click ['), 'the unrecognised link should render as literal text');
  }
});

test('inlineLinks escapes the link label', () => {
  assert.equal(render('[a<b>c](/x/)'), '<a href="/x/">a&lt;b&gt;c</a>');
  // A quote in an href is rejected outright rather than escaped, so it can
  // never break out of the attribute it lands in.
  assert.doesNotMatch(render('[x](/a"b)'), /<a\b/);
});

/* ---------------------------------------------------------------------------
   House style
--------------------------------------------------------------------------- */

test('the legal pages carry no em dashes and no typographic apostrophes', () => {
  for (const path of Object.keys(LEGAL)) {
    const page = byPath.get(path);
    assert.ok(!page.includes('—'), `em dash found on ${path}`);
    assert.ok(!page.includes('’'), `curly apostrophe found on ${path}`);
  }
});

test('no legal page is blocked from being indexed', () => {
  for (const path of Object.keys(LEGAL)) {
    assert.doesNotMatch(byPath.get(path), /name="robots"[^>]*noindex/,
      `${path} is noindexed; these pages are a trust signal and should be indexable`);
  }
});
