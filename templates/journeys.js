import { html } from '../lib/html.js';
import { layout } from './layout.js';
import { breadcrumbNav, sectionHeading, picture, ctaBlock } from './partials.js';

const TITLE = 'International Journeys | Nissa Safaris';
const DESCRIPTION =
  'Journeys Nissa Safaris arranges beyond Kenya, across eastern and southern Africa, flights, lodges, transfers and guiding, planned around your dates.';

const REGIONS = [
  { number: '01', name: 'Eastern Africa' },
  { number: '02', name: 'Southern Africa' },
];

function journeyCard(country) {
  const href = `/journeys/${country.slug}/`;
  return html`<article class="card">
  <a class="card-media" href="${href}">
    ${picture({ src: country.hero, alt: country.heroAlt })}
  </a>
  <div class="card-body">
    <h3 class="h3"><a href="${href}">${country.shortName}</a></h3>
    <p class="body">${country.summary}</p>
  </div>
</article>`;
}

function regionSection(region, countriesHere, alt) {
  const cards = countriesHere.map((country) => journeyCard(country));
  return html`<section class="${alt ? 'section-alt' : 'section'}">
  <div class="wrap">
    ${sectionHeading({ number: region.number, eyebrow: 'Region', heading: region.name })}
    <div class="grid-3">
      ${cards}
    </div>
  </div>
</section>`;
}

/**
 * Renders the international journeys catalogue index: an intro explaining
 * these are enquiry-only overview pages (no fixed itineraries, no prices,
 * see data/journeys.js), grouped into its two regions, each linking to a
 * country detail page.
 *
 * @param {object[]} journeysList, the full `data/journeys.js` array
 * @returns {string} the complete HTML document
 */
export function journeysIndexPage(journeysList) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Journeys', path: '/journeys/' },
  ];

  const sections = REGIONS.map((region, i) =>
    regionSection(
      region,
      journeysList.filter((country) => country.region === region.name),
      i % 2 === 0,
    ),
  );

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">International journeys</h1>
      <p class="lede">Beyond Kenya, we arrange trips across nine more countries in eastern and southern Africa. There are no fixed itineraries here yet and no published prices, each trip is planned individually around your dates, and Nissa is your single point of contact from enquiry to the ground.</p>
    </div>
  </header>
  ${sections}
  ${ctaBlock({
    heading: 'Not sure which country fits your trip?',
    body: "Tell us where you'd like to go, or what you want to see, and we'll suggest a country and build the itinerary around it.",
  })}
</main>`;

  return layout({
    title: TITLE,
    description: DESCRIPTION,
    path: '/journeys/',
    image: journeysList[0]?.hero,
    preloadImage: journeysList[0]?.hero,
    crumbs,
    body,
  });
}
