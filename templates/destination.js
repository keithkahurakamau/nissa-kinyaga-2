import { html } from '../lib/html.js';
import { placeSchema } from '../lib/seo.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { packageCard, ctaBlock, breadcrumbNav } from './partials.js';

/**
 * Derives a safe 50-165 (escaped) char meta description from a destination's
 * `metaDescription` field. Every destination's field is authored well clear
 * of both the 50-char floor and the 165-char ceiling (see data/destinations.js),
 * so this ceiling guard is a safety net for escaping inflation — apostrophes
 * becoming `&#39;` — rather than something normal operation should rely on.
 *
 * @param {object} dest
 * @returns {string}
 */
export function metaDescription(dest) {
  const text = dest.metaDescription.trim();
  const len = escapedLength(text);
  if (len <= MAX_DESCRIPTION) return text;
  return truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

function heroSection(dest) {
  return html`<div class="dest-hero">
  <img src="${dest.hero}" alt="${dest.heroAlt}" fetchpriority="high">
</div>`;
}

function titleSection(dest, crumbs) {
  return html`<header class="section">
  <div class="wrap">
    ${breadcrumbNav(crumbs)}
    <h1 class="display">${dest.name}</h1>
    <p class="lede">${dest.summary}</p>
  </div>
</header>`;
}

function overviewSection(dest) {
  const paragraphs = dest.overview.map((para) => html`<p class="body">${para}</p>`);
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    <h2 class="h2">Overview</h2>
    ${paragraphs}
  </div>
</section>`;
}

function factsSection(dest) {
  const wildlife = dest.wildlife.map((item) => html`<li>${item}</li>`);
  return html`<section class="section">
  <div class="wrap">
    <div class="dest-facts">
      <div>
        <h3 class="h3">Wildlife highlights</h3>
        <ul>
          ${wildlife}
        </ul>
      </div>
      <div>
        <h3 class="h3">Best time to visit</h3>
        <p class="body">${dest.bestTime}</p>
      </div>
      <div>
        <h3 class="h3">Getting there</h3>
        <p class="body">${dest.gettingThere}</p>
      </div>
    </div>
  </div>
</section>`;
}

// Renders only when `dest.nissaNote` is truthy. These are first-hand claims
// about Nissa's own professional history, and only four of the eight
// destinations carry one — rendering an empty block, or a note on ground he
// has not worked, would misrepresent him. `interpolate()` turns `null` into
// `''`, so this guard has to be explicit rather than left to the template
// literal.
function nissaNoteSection(dest) {
  if (!dest.nissaNote) return '';
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    <div class="nissa-note">
      <p>${dest.nissaNote}</p>
    </div>
  </div>
</section>`;
}

function packagesSection(dest, packagesHere) {
  const cards = packagesHere.map((pkg) => packageCard(pkg));
  return html`<section class="section">
  <div class="wrap">
    <h2 class="h2">Safaris that visit ${dest.shortName}</h2>
    <div class="grid-3">
      ${cards}
    </div>
  </div>
</section>`;
}

/**
 * Renders a full destination detail page.
 *
 * @param {object} dest — an entry from `data/destinations.js`
 * @param {object[]} packagesHere — packages whose `destinations` include
 *   `dest.slug`
 * @returns {string} the complete HTML document
 */
export function destinationPage(dest, packagesHere) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations/' },
    { name: dest.shortName, path: `/destinations/${dest.slug}/` },
  ];

  const body = html`<main id="main">
  ${heroSection(dest)}
  ${titleSection(dest, crumbs)}
  ${overviewSection(dest)}
  ${factsSection(dest)}
  ${nissaNoteSection(dest)}
  ${packagesSection(dest, packagesHere)}
  ${ctaBlock({
    heading: `Ready to explore ${dest.shortName}?`,
    body: `Send us your travel dates and we'll build a ${dest.shortName} itinerary around them.`,
  })}
</main>`;

  return layout({
    title: dest.metaTitle,
    description: metaDescription(dest),
    path: `/destinations/${dest.slug}/`,
    image: dest.hero,
    preloadImage: dest.hero,
    type: 'article',
    crumbs,
    schemas: [placeSchema(dest)],
    body,
  });
}
