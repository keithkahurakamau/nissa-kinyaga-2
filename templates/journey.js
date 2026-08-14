import { html } from '../lib/html.js';
import { touristDestinationSchema } from '../lib/seo.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { ctaBlock, breadcrumbNav, picture } from './partials.js';
import { internationalAssurance } from '../data/credentials.js';

/**
 * Derives a safe 50-165 (escaped) char meta description from a country's
 * `metaDescription` field, same contract as templates/destination.js's
 * metaDescription(): every entry in data/journeys.js is authored well clear
 * of both bounds, so this is a safety net, not something normal operation
 * relies on.
 *
 * @param {object} country
 * @returns {string}
 */
export function metaDescription(country) {
  const text = country.metaDescription.trim();
  const len = escapedLength(text);
  if (len <= MAX_DESCRIPTION) return text;
  return truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

// Reuses .dest-hero: same "image only, gradient overlay paints last" contract
// as templates/destination.js's heroSection, see the styles.css comment on
// .dest-hero for why nothing else may be nested inside it.
function heroSection(country) {
  return html`<div class="dest-hero">
  ${picture({ src: country.hero, alt: country.heroAlt, lazy: false })}
</div>`;
}

function titleSection(country, crumbs) {
  return html`<header class="section">
  <div class="wrap">
    ${breadcrumbNav(crumbs)}
    <h1 class="display">${country.name}</h1>
    <p class="lede">${country.summary}</p>
  </div>
</header>`;
}

function overviewSection(country) {
  const paragraphs = country.overview.map((para) => html`<p class="body">${para}</p>`);
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    <h2 class="h2">Overview</h2>
    ${paragraphs}
  </div>
</section>`;
}

// CC BY-SA requires the author, the licence and a route back to the source to
// travel with the image. `.dest-hero` may hold nothing but the picture (see
// the styles.css comment on it), so the credit is rendered here instead, as
// fine print at the foot of the page. Entries without `heroCredit` are our own
// photographs and render nothing.
function photoCreditSection(country) {
  const credit = country.heroCredit;
  if (!credit) return '';
  return html`<p class="photo-credit">
  Header photograph by
  <a href="${credit.sourceUrl}" target="_blank" rel="noopener noreferrer">${credit.author}</a>,
  licensed under
  <a href="${credit.licenseUrl}" target="_blank" rel="noopener noreferrer">${credit.license}</a>.
</p>`;
}

function factsSection(country) {
  const highlights = country.highlights.map((item) => html`<li>${item}</li>`);
  return html`<section class="section">
  <div class="wrap">
    <div class="dest-facts">
      <div>
        <h3 class="h3">Highlights</h3>
        <ul>
          ${highlights}
        </ul>
      </div>
      <div>
        <h3 class="h3">Best time to visit</h3>
        <p class="body">${country.bestTime}</p>
      </div>
      <div>
        <h3 class="h3">Getting there</h3>
        <p class="body">${country.gettingThere}</p>
      </div>
    </div>
  </div>
</section>`;
}

// Operator-voice only: this project's honesty rules (docs/nissa-biography-source.md)
// bind hard on this section. Nissa has no recorded first-hand guiding in any
// of the nine data/journeys.js countries, so this never claims one, no "when
// I guided there", no invented routine. It states plainly that there is no
// fixed itinerary here the way there is for Kenya, and says what Nissa's own
// account (the "What he does now" section of the source document) actually
// lists him doing: flight bookings, hotels and lodges, road transfers,
// private guiding, arranged through people he trusts on the ground.
function arrangementsSection(country) {
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    <h2 class="h2">How we arrange it</h2>
    <p class="body">We don't guide inside ${country.shortName} ourselves, and we don't publish a fixed ${country.shortName} itinerary the way we do for Kenya: no set trips exist yet for this country, so we build each one individually rather than invent a day-by-day plan that isn't real. What we do is put the trip together end to end, flights in and out, the right lodges and camps for your budget and interests, road or light-aircraft transfers between them, and a private guide on the ground who knows that particular park well.</p>
    <p class="body">Tell us what you want to see and how many days you have, and we'll draw up an itinerary and put you in touch with the people who can deliver it, with Nissa as your single point of contact throughout.</p>
    <p class="body">${internationalAssurance}</p>
  </div>
</section>`;
}

/**
 * Renders a full country overview page: hero, title, overview, highlights
 * and facts, an explicit statement of how Nissa arranges (rather than
 * personally guides) the trip, and an enquiry CTA. No itinerary, no
 * packages, no price, deliberately, see data/journeys.js.
 *
 * @param {object} country, an entry from `data/journeys.js`
 * @returns {string} the complete HTML document
 */
export function journeyPage(country) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Journeys', path: '/journeys/' },
    { name: country.shortName, path: `/journeys/${country.slug}/` },
  ];

  const body = html`<main id="main">
  ${heroSection(country)}
  ${titleSection(country, crumbs)}
  ${overviewSection(country)}
  ${factsSection(country)}
  ${arrangementsSection(country)}
  ${ctaBlock({
    heading: `Ready to plan ${country.shortName}?`,
    body: `Send us your travel dates and we'll put together a ${country.shortName} itinerary around them, flights, lodges and a guide on the ground.`,
  })}
  ${photoCreditSection(country)}
</main>`;

  return layout({
    title: country.metaTitle,
    description: metaDescription(country),
    path: `/journeys/${country.slug}/`,
    image: country.hero,
    preloadImage: country.hero,
    type: 'article',
    crumbs,
    schemas: [touristDestinationSchema(country)],
    body,
  });
}
