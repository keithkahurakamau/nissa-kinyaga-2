import { html } from '../lib/html.js';
import { touristTripSchema, faqPageSchema } from '../lib/seo.js';
import { MIN_DESCRIPTION, MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { packageCard, ctaBlock, breadcrumbNav } from './partials.js';
import packages, { PRICES } from '../data/packages.js';

// Fixed, truthful marketing copy used only as a last-resort suffix to pull
// a composed description up to the 50-char floor. It's long enough on its
// own (48 chars) that appending it to even a one-word title and a
// one-character summary clears the floor — see the "guarantees the
// 50-char floor" test in test/build.test.js.
const BOOKING_SUFFIX = 'Private, guided departures with Nissa Safaris.';

/**
 * Truncates to the ceiling if over it, otherwise returns as-is.
 *
 * @param {string} text
 * @returns {string}
 */
function fitCeiling(text) {
  return escapedLength(text) <= MAX_DESCRIPTION ? text : truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

/**
 * Derives a meta description of 50-165 (escaped) characters from a package.
 *
 * `pkg.summary` is validated to be <= 200 chars (lib/validate.js), but has
 * no minimum, and `pkg.title` has no length bound either — so the summary
 * alone can legitimately fall under the 50-char floor. When it does, this
 * composes progressively fuller — but always truthful — candidates until
 * one clears the floor:
 *   1. title + days/nights + summary
 *   2. the above + a fixed booking sentence
 * Candidate 2 is long enough by construction to clear the floor for any
 * package that satisfies validatePackage (non-empty title, non-empty
 * summary, days >= 1, nights >= 0), so the loop always returns from
 * within range; it never falls through to the final guard.
 *
 * @param {object} pkg
 * @returns {string}
 */
export function metaDescription(pkg) {
  const summary = pkg.summary.trim();
  const summaryLen = escapedLength(summary);
  if (summaryLen >= MIN_DESCRIPTION && summaryLen <= MAX_DESCRIPTION) return summary;
  if (summaryLen > MAX_DESCRIPTION) return truncateToEscapedLimit(summary, MAX_DESCRIPTION);

  const base = `${pkg.title} — a ${pkg.days}-day, ${pkg.nights}-night Kenya safari.`;
  const candidates = [`${base} ${summary}`, `${base} ${summary} ${BOOKING_SUFFIX}`];

  for (const candidate of candidates) {
    const fitted = fitCeiling(candidate);
    if (escapedLength(fitted) >= MIN_DESCRIPTION) return fitted;
  }

  // Unreachable for any package that passes validatePackage — kept only so
  // this function never silently returns a description under the floor.
  return fitCeiling(candidates[candidates.length - 1]);
}

/**
 * Up to 3 other packages sharing at least one destination with `pkg`.
 *
 * @param {object} pkg
 * @returns {object[]}
 */
function relatedPackages(pkg) {
  return packages
    .filter((other) => other.slug !== pkg.slug && other.destinations.some((d) => pkg.destinations.includes(d)))
    .slice(0, 3);
}

function heroSection(pkg) {
  return html`<div class="pkg-hero">
  <img src="${pkg.hero}" alt="${pkg.heroAlt}" fetchpriority="high">
</div>`;
}

function titleSection(pkg, crumbs) {
  const price = PRICES[pkg.priceKey];
  return html`<header class="section">
  <div class="wrap">
    ${breadcrumbNav(crumbs)}
    <h1 class="display">${pkg.title}</h1>
    <p class="pkg-meta">${pkg.days} days · ${pkg.nights} nights</p>
    <p class="pkg-price">From $${price.fromUsd}<span> per person</span></p>
  </div>
</header>`;
}

function overviewSection(pkg) {
  const paragraphs = pkg.overview.map((para) => html`<p class="body">${para}</p>`);
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    <h2 class="h2">Overview</h2>
    ${paragraphs}
  </div>
</section>`;
}

function itinerarySection(pkg) {
  const days = pkg.itinerary.map(
    (entry) => html`<li class="itinerary-day">
      <span class="itinerary-num">${String(entry.day).padStart(2, '0')}</span>
      <div>
        <h3 class="h3">${entry.title}</h3>
        <p class="body">${entry.body}</p>
      </div>
    </li>`,
  );
  return html`<section class="section">
  <div class="wrap-narrow">
    <h2 class="h2">Day by day</h2>
    <ol class="itinerary">
      ${days}
    </ol>
  </div>
</section>`;
}

function inclExclSection(pkg) {
  const included = pkg.included.map((item) => html`<li>${item}</li>`);
  const excluded = pkg.excluded.map((item) => html`<li>${item}</li>`);
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    <h2 class="h2">What's included</h2>
    <div class="incl-excl">
      <div>
        <h3 class="visually-hidden">Included</h3>
        <ul class="incl">
          ${included}
        </ul>
      </div>
      <div>
        <h3 class="visually-hidden">Not included</h3>
        <ul class="excl">
          ${excluded}
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

function bestTimeSection(pkg) {
  return html`<section class="section">
  <div class="wrap-narrow">
    <h2 class="h2">Best time to visit</h2>
    <p class="best-time">${pkg.bestTime}</p>
  </div>
</section>`;
}

function faqSection(pkg) {
  const items = pkg.faqs.map(
    (faq) => html`<details class="faq-item">
      <summary>${faq.q}</summary>
      <p>${faq.a}</p>
    </details>`,
  );
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    <h2 class="h2">Common questions</h2>
    <div class="faq">
      ${items}
    </div>
  </div>
</section>`;
}

function relatedSection(pkg) {
  const related = relatedPackages(pkg);
  if (related.length === 0) return '';
  const cards = related.map((other) => packageCard(other));
  return html`<section class="section">
  <div class="wrap">
    <h2 class="h2">You might also like</h2>
    <div class="grid-3">
      ${cards}
    </div>
  </div>
</section>`;
}

/**
 * Renders a full safari package detail page.
 *
 * @param {object} pkg — an entry from `data/packages.js`
 * @returns {string} the complete HTML document
 */
export function packagePage(pkg) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Safaris', path: '/safaris/' },
    { name: pkg.title, path: `/safaris/${pkg.slug}/` },
  ];

  const body = html`<main id="main">
  ${heroSection(pkg)}
  ${titleSection(pkg, crumbs)}
  ${overviewSection(pkg)}
  ${itinerarySection(pkg)}
  ${inclExclSection(pkg)}
  ${bestTimeSection(pkg)}
  ${faqSection(pkg)}
  ${ctaBlock({
    heading: 'Ready to book this safari?',
    body: `Send us your travel dates and group size and we'll confirm availability for the ${pkg.title} within a day.`,
    packageTitle: pkg.title,
  })}
  ${relatedSection(pkg)}
</main>`;

  return layout({
    title: `${pkg.title} — Kenya Safari | Nissa Safaris`,
    description: metaDescription(pkg),
    path: `/safaris/${pkg.slug}/`,
    image: pkg.hero,
    preloadImage: pkg.hero,
    type: 'article',
    crumbs,
    schemas: [touristTripSchema(pkg), faqPageSchema(pkg.faqs)],
    body,
  });
}
