import { html, escape } from '../lib/html.js';
import { touristTripSchema, faqPageSchema } from '../lib/seo.js';
import { layout } from './layout.js';
import { packageCard, ctaBlock, breadcrumbNav } from './partials.js';
import packages, { PRICES } from '../data/packages.js';

const MIN_DESCRIPTION = 50;
const MAX_DESCRIPTION = 165;

// The build test measures description length off the rendered HTML
// attribute (`<meta name="description" content="...">`), where the `html`
// tag function has already HTML-escaped the text. An apostrophe becomes
// `&#39;` (5 chars for 1), so length decisions must be made against the
// escaped length, not the raw source string length.
function escapedLength(text) {
  return escape(text).length;
}

/**
 * Truncates `text` word-by-word until its HTML-escaped form is at most
 * `maxLen` characters. Never splits a word.
 *
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
function truncateToEscapedLimit(text, maxLen) {
  let candidate = text.trim();
  while (escapedLength(candidate) > maxLen) {
    const lastSpace = candidate.lastIndexOf(' ');
    candidate = lastSpace > 0 ? candidate.slice(0, lastSpace) : candidate.slice(0, -1);
  }
  return candidate.trim();
}

/**
 * Derives a meta description of 50-165 (escaped) characters from a package.
 *
 * `pkg.summary` is validated to be <= 200 chars, so it can already run long
 * (truncated at a word boundary) or, in principle, short (composed into a
 * fuller sentence from the package title, length and the summary itself).
 * Every branch is deterministic and produces a description in range for
 * all 21 packages in the current data set.
 *
 * @param {object} pkg
 * @returns {string}
 */
function metaDescription(pkg) {
  const summary = pkg.summary.trim();
  const summaryLen = escapedLength(summary);
  if (summaryLen >= MIN_DESCRIPTION && summaryLen <= MAX_DESCRIPTION) return summary;
  if (summaryLen > MAX_DESCRIPTION) return truncateToEscapedLimit(summary, MAX_DESCRIPTION);
  const composed = `${pkg.title} — a ${pkg.days}-day, ${pkg.nights}-night Kenya safari. ${summary}`;
  return escapedLength(composed) <= MAX_DESCRIPTION ? composed : truncateToEscapedLimit(composed, MAX_DESCRIPTION);
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
      <ul class="incl">
        ${included}
      </ul>
      <ul class="excl">
        ${excluded}
      </ul>
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
    (faq) => html`<div class="faq-item">
      <h3 class="h4">${faq.q}</h3>
      <p>${faq.a}</p>
    </div>`,
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
