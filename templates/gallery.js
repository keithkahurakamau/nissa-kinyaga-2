import { html, raw } from '../lib/html.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { ctaBlock, breadcrumbNav, picture } from './partials.js';
import gallery from '../data/gallery.js';

// Authored well clear of the 50-165 (escaped) char range; truncateToEscapedLimit
// is a safety net for escaping inflation, matching the pattern in
// templates/about.js/destination.js/package.js.
const DESCRIPTION =
  "Photographs from Nissa's own Kenya safaris, each with the story behind the frame, wildlife, landscapes and safari moments from the field.";

export function metaDescription() {
  const text = DESCRIPTION.trim();
  const len = escapedLength(text);
  if (len <= MAX_DESCRIPTION) return text;
  return truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

/**
 * Tile size for the mosaic, chosen at build time so no inline style is ever
 * needed (the CSP forbids style attributes outright).
 *
 * The rhythm is deliberate rather than random: a feature tile every seventh
 * frame and a tall tile every third gives the grid a repeating but not
 * obvious beat. It is a pure function of the index, so the layout is
 * identical on every build and a photo never jumps size between deploys.
 */
function tileClass(i) {
  if (i % 7 === 0) return ' gal-tile-feature';
  if (i % 3 === 1) return ' gal-tile-tall';
  return '';
}

// Every photo renders as a real server-side <img> (Task 17 fix: the reel used
// to be built entirely by app.js from an inline array, so crawlers indexed
// nothing). app.js reads each card back out of this markup rather than
// holding its own copy, so `.gal-card-cat`, `.gal-card-title` and
// `.gal-card-story` must stay present on every tile: the lightbox populates
// itself from them.
function galleryTile(item, i) {
  return html`<figure class="gal-item${raw(tileClass(i))}" data-cat="${item.category}" data-reveal>
  <div class="gal-item-media">
    ${// the first frames are above the fold on a wide screen and the very
      // first is the preloaded LCP image, so neither may be lazy
      picture({ src: item.src, alt: item.alt, lazy: i > 2 })}
  </div>
  <button type="button" class="gal-open" data-lb="${i}" aria-label="View ${item.title} full screen">
    <span class="gal-card-cat">${item.category}</span>
    <span class="gal-card-title">${item.title}</span>
    <span class="gal-card-story">${item.story}</span>
    <span class="gal-open-cue" aria-hidden="true">View</span>
  </button>
</figure>`;
}

/**
 * Category filter chips, built from the categories actually present in
 * data/gallery.js rather than a hardcoded list, so a new category cannot
 * appear in the data and be missing from the filter.
 */
function filterChips(categories) {
  const chips = categories.map(
    ({ name, count }) => html`<button type="button" class="gal-chip" data-filter="${name}" aria-pressed="false">
    ${name}<span class="gal-chip-n">${String(count)}</span>
  </button>`,
  );
  return html`<div class="gal-filters" role="group" aria-label="Filter photographs by subject">
  <button type="button" class="gal-chip is-on" data-filter="all" aria-pressed="true">
    All<span class="gal-chip-n">${String(gallery.length)}</span>
  </button>
  ${chips}
</div>`;
}

function lightbox() {
  return html`<div id="nk-lb" class="lb">
  <button id="nk-lb-close" type="button" class="lb-close" aria-label="Close">&times;</button>
  <button id="nk-lb-prev" type="button" class="galbtn galbtn-prev" aria-label="Previous">&#8249;</button>
  <button id="nk-lb-next" type="button" class="galbtn galbtn-next" aria-label="Next">&#8250;</button>
  <figure class="lb-figure">
    <div id="nk-lb-img" class="lb-img" role="img"></div>
    <figcaption class="lb-meta">
      <span id="nk-lb-cat" class="lb-cat"></span>
      <div id="nk-lb-title" class="lb-title"></div>
      <p id="nk-lb-story" class="lb-story"></p>
    </figcaption>
  </figure>
</div>`;
}

/**
 * Renders the gallery page: every photo from `data/gallery.js` as a real,
 * crawlable <img> in a mosaic grid, with category filters and the lightbox
 * markup app.js progressively enhances.
 *
 * This replaced a one-at-a-time carousel. With 31 photographs the reel showed
 * a single frame per screen and buried the rest behind arrow clicks; a grid
 * shows the whole body of work at once, which is what a gallery is for. The
 * lightbox is unchanged and still carries the story for each frame.
 *
 * @returns {string} the complete HTML document
 */
export function galleryPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery/' },
  ];

  const counts = new Map();
  for (const item of gallery) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  const categories = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const tiles = gallery.map((item, i) => galleryTile(item, i));

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">From the field</h1>
      <p class="lede">Photographs from Nissa's own safaris, each with the story behind the frame. Filter by subject, and open any frame to read it full screen.</p>
    </div>
  </header>
  <section class="section-alt">
    <div class="wrap">
      ${filterChips(categories)}
      <div id="nk-gal" class="gal-mosaic" role="region" aria-label="Photographs from the field">
        ${tiles}
      </div>
      <p id="nk-gal-count" class="gal-count" role="status">Showing all ${String(gallery.length)} photographs</p>
    </div>
  </section>
  ${ctaBlock({
    heading: 'Plan your own Kenya safari',
    body: 'Send your travel dates and Nissa will build the itinerary himself, drawing on the conservancies and lodges he knows first-hand.',
  })}
</main>
${lightbox()}`;

  return layout({
    title: 'Photo Gallery, Kenya Safaris | Nissa Safaris',
    description: metaDescription(),
    path: '/gallery/',
    image: gallery[0]?.src,
    preloadImage: gallery[0]?.src,
    crumbs,
    body,
  });
}
