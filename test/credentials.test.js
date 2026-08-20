import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  guideCredentials,
  companyCredentials,
  reviewPlatforms,
  internationalAssurance,
  verified,
  activePlatforms,
} from '../data/credentials.js';
import reviews from '../data/reviews.js';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const page = readFileSync(join(ROOT, 'dist', 'reviews', 'index.html'), 'utf8');

const all = [...guideCredentials, ...companyCredentials];

// These entries assert things about real regulators, so anything not marked
// publishable must never reach the page even if every other field is filled in.
test('no unverified credential is rendered', () => {
  for (const entry of all) {
    if (entry.verified) continue;
    assert.ok(
      !page.includes(entry.name) || all.some((e) => e.verified && e.name === entry.name),
      `unverified credential "${entry.name}" leaked onto /reviews/`,
    );
  }
});

test('every published company credential reaches the page', () => {
  for (const entry of companyCredentials) {
    if (!entry.verified) continue;
    assert.ok(page.includes(entry.body), `${entry.id} is published but missing from /reviews/`);
  }
});

// A missing reference is fine and renders no number. An invented one is not:
// a licence number is a specific verifiable string, and a wrong one points a
// checker at someone else's record, which is worse than showing nothing.
test('no credential carries an invented or placeholder reference', () => {
  for (const entry of companyCredentials) {
    if (entry.reference === null || entry.reference === undefined) continue;
    assert.ok(typeof entry.reference === 'string' && entry.reference.trim().length > 0,
      `${entry.id} has an empty reference; use null instead`);
    assert.doesNotMatch(
      entry.reference,
      /X{3,}|9{5,}|0{5,}|123456|placeholder|example|sample|TODO|TBC|N\/?A/i,
      `${entry.id}'s reference looks like a stand-in, not a real number`,
    );
  }
});

test('a credential with no reference renders no number', () => {
  for (const entry of companyCredentials) {
    if (entry.reference) continue;
    // credentialCard only emits " · <reference>" when reference is truthy, so
    // the body line must be the issuing body alone.
    const stray = new RegExp(`${entry.body.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*·`);
    assert.doesNotMatch(page, stray, `${entry.id} rendered a separator with no number after it`);
  }
});

test('every credential names the body that issued it', () => {
  for (const entry of all) {
    assert.ok(entry.body && entry.body.length > 3, `${entry.id} has no issuing body`);
    assert.ok(entry.detail && entry.detail.length > 20, `${entry.id} has no explanation`);
  }
});

test('verified guide credentials cite an independent source', () => {
  for (const entry of verified(guideCredentials)) {
    assert.ok(entry.source?.url, `${entry.id} is verified but cites no source`);
    assert.ok(entry.source.url.startsWith('https://'), `${entry.id} source must be a URL`);
  }
});

// KWS manages parks and wildlife; the Tourism Regulatory Authority licenses
// tour operators. Describing a KWS permit as an operator licence would
// misstate a government agency's remit.
test('the KWS entry does not claim to license the company', () => {
  const kws = companyCredentials.find((entry) => entry.id === 'kws');
  assert.ok(kws, 'the KWS entry is missing');
  assert.doesNotMatch(kws.detail, /licen[sc]ed? (tour )?operator/i);
  const tra = companyCredentials.find((entry) => entry.id === 'tra');
  assert.match(tra.detail, /licenses tour operators/i);
});

test('no review platform is linked without a URL', () => {
  for (const platform of reviewPlatforms) {
    if (platform.url) {
      assert.ok(platform.url.startsWith('https://'), `${platform.id} URL must be absolute`);
      continue;
    }
    assert.ok(!page.includes(platform.cta), `${platform.id} rendered a CTA with no URL behind it`);
  }
  for (const platform of activePlatforms()) assert.ok(platform.url);
});

// A fabricated testimonial is the worst thing that could appear on this site.
// data/reviews.js must stay empty until real guests send reviews.
test('no review is published without a name, rating and body', () => {
  for (const review of reviews) {
    assert.ok(review.name, 'a review has no attribution');
    assert.ok(Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5);
    assert.ok(review.body && review.body.length > 30, `${review.name}'s review has no substance`);
  }
});

test('the page never invents an aggregate rating', () => {
  if (reviews.length) return;
  assert.doesNotMatch(page, /aggregateRating/i);
  assert.doesNotMatch(page, /\b\d\.\d\s*(out of|\/)\s*5\b/i);
});

test('international journeys claim partner licensing, not our own', () => {
  assert.match(internationalAssurance, /licensed in their own country|licensed .* country/i);
  assert.doesNotMatch(internationalAssurance, /we are (licensed|certified) in/i);
});

test('the reviews page renders the verified guiding qualifications', () => {
  assert.match(page, /KPSGA Silver guide/);
  assert.match(page, /Kenya Professional Safari Guides Association/);
  assert.match(page, /Kenya Utalii College/);
});

test('the review form requires consent before publication', () => {
  assert.match(page, /id="nk-rv-consent"[^>]*required|required[^>]*id="nk-rv-consent"/);
  assert.match(page, /happy for this review/i);
});

test('the reviews page carries no em dashes', () => {
  assert.ok(!page.includes('—'), 'em dash found on /reviews/');
});

// llms.txt is what an AI assistant reads to describe this business. A wrong
// statement there propagates into answers the client never sees, so the
// claims that could go stale are asserted against the data they describe.
test('llms.txt does not contradict the site', async () => {
  const { readFileSync } = await import('node:fs');
  const llms = readFileSync(join(ROOT, 'dist', 'llms.txt'), 'utf8');

  if (reviews.length === 0) {
    assert.match(llms, /reviews are not yet published/i,
      'llms.txt must say reviews are unpublished while data/reviews.js is empty');
  } else {
    assert.match(llms, new RegExp(`${reviews.length} guest review`),
      'llms.txt must report the real published review count');
  }

  // Prices are removed sitewide; an assistant quoting one would be inventing it.
  assert.match(llms, /Prices are not published/i);
  assert.doesNotMatch(llms, /(KES|USD|\$)\s?[\d,]{3}/);

  // The two things the site brokers rather than operates.
  assert.match(llms, /does not guide inside the countries/i);
  assert.match(llms, /does not operate aircraft/i);
});

// The Google reviews block is filled at runtime by app.js from a same-origin
// proxy. It must ship hidden and empty: Google's policies forbid storing
// review content, so nothing may be baked into the build, and an
// unconfigured site must show no empty shell.
test('the Google reviews section ships hidden and carries no baked review text', () => {
  assert.match(page, /<section id="nk-google"[^>]*\shidden/,
    'the Google section must ship hidden');
  assert.match(page, /<div id="nk-grev-list" class="review-grid"><\/div>/,
    'the review list must ship empty, not pre-populated');
  assert.match(page, /<span id="nk-grev-rating" class="grev-rating"><\/span>/,
    'no rating may be baked into the build');
});

// Google requires the author and a link back to Google to travel with any
// review taken from the Places API.
test('the Google reviews block carries its required attribution', () => {
  assert.match(page, /Reviews shown live from Google/i);
  assert.match(page, /id="nk-grev-link"[^>]*href="https:\/\/www\.google\.com\/maps"/);
});
