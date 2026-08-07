import { html } from '../lib/html.js';
import { travelAgencySchema, personSchema } from '../lib/seo.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { packageCard, ctaBlock, sectionHeading, whatsappLink, picture } from './partials.js';
import site from '../data/site.js';

// Authored well clear of the 50-165 (escaped) char range; truncateToEscapedLimit
// is a safety net for escaping inflation, matching about.js/destination.js/package.js.
const DESCRIPTION =
  'Private, freelance Kenya safaris led personally by Nissa Ole Kinyaga — Masai Mara, Samburu, Laikipia, Tsavo, Mount Kenya and the Diani coast.';

// Nissa's own ground — Borana, Lewa, Laikipia — the only trips on this site a
// Nairobi-based operator cannot replicate. Kept in this fixed order (Borana
// first) regardless of their position in data/packages.js.
const SIGNATURE_SLUGS = ['4-day-borana-lewa-conservation-safari', '3-day-laikipia-walking-tracking-safari'];

const POPULAR_SLUGS = [
  '3-day-masai-mara-classic',
  '3-day-samburu-special-five',
  '2-day-ol-pejeta-rhino-safari',
  '3-day-tsavo-east-tsavo-west',
  '5-day-mount-kenya-sirimon-to-chogoria',
  '7-day-best-of-kenya',
];

// Short, factual teaser — full biography lives at /about/. Every claim here
// traces to docs/nissa-biography-source.md: his career with Kenya's
// conservancies began in 1998 (Lewa Wildlife Conservancy, ranger research —
// not a guiding role), he has guided professionally since 2002 (Lewa Safari
// Camp), freelance, founder of Nissa Safaris, Utalii College distinction.
// No computed years, no invented routine, no Silver rating, no Lengishu.
const GUIDE_TEASER =
  "Nissa Ole Kinyaga's career with Kenya's conservancies began in 1998, and he has guided professionally since 2002 — across Lewa, Sirikoi and Borana. A Kenya Utalii College graduate with distinction, he now guides freelance as the founder of Nissa Safaris, planning and leading every safari on this site himself.";

export function metaDescription() {
  const text = DESCRIPTION.trim();
  const len = escapedLength(text);
  if (len <= MAX_DESCRIPTION) return text;
  return truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

function bySlug(list, slugs) {
  return slugs.map((slug) => list.find((pkg) => pkg.slug === slug)).filter(Boolean);
}

// Holds only the hero photograph (as .hero-media, a background-image div —
// there's no inline style="..." to point an <img> at a per-instance src, and
// this hero is always lion.jpg) plus its text overlay, which carries its own
// stacking context (.hero-content, z-index:1) so it isn't painted underneath
// the image/gradient. See the styles.css comments on .hero-media/.hero::after
// /.hero-content for why this differs from .about-hero/.dest-hero/.pkg-hero.
//
// The aria-label describes only what is in the frame — this exact file
// (/assets/lion.jpg) is reused across destinations it was not shot in (see
// its heroAlt on the 2-Day Ol Pejeta package, data/packages.js:106: "A maned
// lion sitting upright and alert in golden dry grass"), so it carries no
// location claim, matching that established alt text for the same photo.
function heroSection() {
  return html`<header class="hero">
  <div class="hero-media" role="img" aria-label="A maned lion sitting upright and alert in golden dry grass"></div>
  <div class="hero-content">
    <div class="wrap">
      <h1 class="display-lg">Nissa Safaris</h1>
      <p class="lede">Private, freelance safaris across Kenya, led personally by Nissa Ole Kinyaga — the Masai Mara, Samburu and the Diani coast, plus his own ground at Borana and Lewa.</p>
      <div class="hero-actions">
        <a class="btn btn-gold" href="/safaris/">See all safaris</a>
        <a class="btn" href="${whatsappLink()}" target="_blank" rel="noopener noreferrer">Talk to Nissa</a>
      </div>
    </div>
  </div>
</header>`;
}

function guideSection() {
  return html`<section class="section-alt">
  <div class="wrap">
    ${sectionHeading({ number: '01', eyebrow: 'Meet your guide', heading: 'Nissa Ole Kinyaga' })}
    <div class="grid-2">
      <div class="card">
        <div class="card-media">
          ${picture({ src: site.portrait, alt: 'Nissa Ole Kinyaga, founder and lead guide of Nissa Safaris' })}
        </div>
      </div>
      <div>
        <p class="body">${GUIDE_TEASER}</p>
        <a class="btn btn-gold" href="/about/">Meet Nissa</a>
      </div>
    </div>
  </div>
</section>`;
}

function signatureSection(packagesList) {
  const cards = bySlug(packagesList, SIGNATURE_SLUGS).map((pkg) => packageCard(pkg));
  return html`<section class="section">
  <div class="wrap">
    ${sectionHeading({
      number: '02',
      eyebrow: "Nissa's own ground",
      heading: 'Borana, Lewa and Laikipia',
    })}
    <p class="lede">The conservancies Nissa has guided for years, in the roles his own record names — ground a Nairobi operator books through a third party, and Nissa books as his own.</p>
    <div class="grid-2">
      ${cards}
    </div>
  </div>
</section>`;
}

function popularSection(packagesList) {
  const cards = bySlug(packagesList, POPULAR_SLUGS).map((pkg) => packageCard(pkg));
  return html`<section class="section-alt">
  <div class="wrap">
    ${sectionHeading({ number: '03', eyebrow: 'Popular safaris', heading: "Kenya's classic circuits" })}
    <div class="grid-3">
      ${cards}
    </div>
  </div>
</section>`;
}

function destinationTile(dest) {
  const href = `/destinations/${dest.slug}/`;
  return html`<article class="card">
  <a class="card-media" href="${href}">
    ${picture({ src: dest.hero, alt: dest.heroAlt })}
  </a>
  <div class="card-body">
    <h3 class="h4"><a href="${href}">${dest.shortName}</a></h3>
  </div>
</article>`;
}

function destinationsSection(destinationsList) {
  const tiles = destinationsList.map((dest) => destinationTile(dest));
  return html`<section class="section">
  <div class="wrap">
    ${sectionHeading({ number: '04', eyebrow: 'Destinations', heading: 'Where we guide' })}
    <div class="grid-4">
      ${tiles}
    </div>
  </div>
</section>`;
}

function galleryTeaserSection() {
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    ${sectionHeading({ number: '05', eyebrow: 'Gallery', heading: 'See Kenya through the viewfinder' })}
    <p class="lede">Sightings, camps and the everyday texture of a safari with Nissa, captured on the road.</p>
    <a class="btn btn-gold" href="/gallery/">View the gallery</a>
  </div>
</section>`;
}

/**
 * Renders the home page: the site's front door, routing visitors into the
 * safaris, destinations and about pages.
 *
 * @param {object[]} packagesList — the full `data/packages.js` array
 * @param {object[]} destinationsList — the full `data/destinations.js` array
 * @returns {string} the complete HTML document
 */
export function homePage(packagesList, destinationsList) {
  const body = html`<main id="main">
  ${heroSection()}
  ${guideSection()}
  ${signatureSection(packagesList)}
  ${popularSection(packagesList)}
  ${destinationsSection(destinationsList)}
  ${galleryTeaserSection()}
  ${ctaBlock({
    heading: 'Plan your Kenya safari with Nissa',
    body: 'Send your travel dates and Nissa will build the itinerary himself, drawing on the conservancies and lodges he knows first-hand.',
  })}
</main>`;

  return layout({
    title: 'Nissa Safaris — Private Kenya Safaris with Nissa Ole Kinyaga',
    description: metaDescription(),
    path: '/',
    image: site.defaultShareImage,
    preloadImage: '/assets/lion.jpg',
    type: 'website',
    schemas: [travelAgencySchema(), personSchema()],
    body,
  });
}
