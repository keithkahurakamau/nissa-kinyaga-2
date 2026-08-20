import { html, raw, renderToString, escape } from '../lib/html.js';
import { layout } from './layout.js';
import { packageCard, breadcrumbNav } from './partials.js';

const TITLE = 'Kenya Safari Packages | Nissa Safaris';
const DESCRIPTION =
  "Browse all 21 Kenya safari packages from Nissa Safaris, from 2-day Mara escapes to 8-day coast-and-bush circuits, filterable by destination and length.";

// Category order controls the order sections render in, independent of
// each package's position in data/packages.js.
const CATEGORY_ORDER = [
  'Masai Mara & Rift Valley',
  'Amboseli & Tsavo',
  'Laikipia & the North',
  'Mount Kenya',
  'Coast',
  'Romance & Honeymoon',
];

function filterBar(total) {
  return html`<section class="section-alt">
  <div class="wrap">
    <div class="filter-bar">
      <div class="filter-field">
        <label class="filter-label" for="filter-destination">Destination</label>
        <select id="filter-destination" class="filter-select">
          <option value="all">All destinations</option>
          <option value="masai-mara">Masai Mara</option>
          <option value="amboseli">Amboseli</option>
          <option value="samburu">Samburu</option>
          <option value="ol-pejeta">Ol Pejeta</option>
          <option value="tsavo">Tsavo</option>
          <option value="laikipia">Laikipia</option>
          <option value="mount-kenya">Mount Kenya</option>
          <option value="diani">Diani</option>
        </select>
      </div>
      <div class="filter-field">
        <label class="filter-label" for="filter-duration">Length</label>
        <select id="filter-duration" class="filter-select">
          <option value="all">Any length</option>
          <option value="short">Short (up to 3 days)</option>
          <option value="medium">Medium (4-6 days)</option>
          <option value="long">Long (7+ days)</option>
        </select>
      </div>
      <p id="filter-count" class="filter-count" aria-live="polite">Showing ${total} of ${total} safaris</p>
    </div>
  </div>
</section>
<div class="wrap">
  <p id="filter-empty" class="filter-empty" hidden>
    No safari matches that combination yet &mdash; there is no trip of that length to
    that destination on the list. Try a different length, or
    <a href="/contact/">ask Nissa to build one</a>.
  </p>
</div>`;
}

// packageCard() has a fixed one-arg signature shared by three other
// templates (see partials.js), so filter data attributes are spliced onto
// its rendered `<article class="pkg-card">` opening tag here rather than
// widening that shared contract for this one caller.
function categoryCard(pkg) {
  const cardHtml = renderToString(packageCard(pkg));
  const attrs =
    ` data-destinations="${escape(pkg.destinations.join(' '))}"` +
    ` data-days="${pkg.days}" data-category="${escape(pkg.category)}"`;
  // Insert after the class attribute rather than replacing the whole opening
  // tag as a literal string. The literal form silently stopped matching the
  // moment packageCard gained another attribute (data-reveal), which dropped
  // the filter attributes and broke /safaris/ filtering without erroring.
  // Anchoring on `class="pkg-card"` keeps that from recurring, and the throw
  // turns a future mismatch into a failed build instead of a silent one.
  const anchor = '<article class="pkg-card"';
  if (!cardHtml.includes(anchor)) {
    throw new Error(`packageCard no longer opens with ${anchor}; filter attributes cannot be spliced`);
  }
  return raw(cardHtml.replace(anchor, `${anchor}${attrs}`));
}

function categorySection(category, packagesHere, alt) {
  const cards = packagesHere.map((pkg) => categoryCard(pkg));
  return html`<section class="${alt ? 'section-alt' : 'section'}" data-category-section>
  <div class="wrap">
    <h2 class="h2">${category}</h2>
    <div class="grid-3">
      ${cards}
    </div>
  </div>
</section>`;
}

/**
 * Renders the safaris index: an intro, client-side filter controls, and
 * every package grouped under its category heading. Filtering is
 * progressive enhancement, all cards render in the static HTML with
 * `data-destinations`/`data-days`/`data-category` attributes, and
 * `initSafariFilters()` in app.js hides/shows them; a visitor without JS,
 * and every crawler, sees the full list.
 *
 * @param {object[]} packagesList, the full `data/packages.js` array
 * @param {object[]} destinationsList, the full `data/destinations.js` array
 * @returns {string} the complete HTML document
 */
export function safarisIndexPage(packagesList, destinationsList) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Safaris', path: '/safaris/' },
  ];

  const sections = CATEGORY_ORDER.map((category, i) =>
    categorySection(
      category,
      packagesList.filter((pkg) => pkg.category === category),
      i % 2 === 0,
    ),
  );

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">Kenya safari packages</h1>
      <p class="lede">Twenty-one itineraries across ${destinationsList.length} destinations, from a weekend Mara escape to a two-week circuit of the whole country. Filter by destination or length, or browse by region below.</p>
    </div>
  </header>
  ${filterBar(packagesList.length)}
  ${sections}
</main>`;

  return layout({
    title: TITLE,
    description: DESCRIPTION,
    path: '/safaris/',
    image: packagesList[0]?.hero,
    preloadImage: packagesList[0]?.hero,
    crumbs,
    body,
  });
}
