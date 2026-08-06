import { html } from '../lib/html.js';
import { layout } from './layout.js';
import { breadcrumbNav } from './partials.js';
import packages from '../data/packages.js';

const TITLE = 'Kenya Safari Destinations | Nissa Safaris';
const DESCRIPTION =
  "Eight Kenya safari destinations covered by Nissa Safaris, from the Masai Mara and Amboseli to Laikipia and the Diani coast, each with its own guide.";

function packageCount(dest) {
  return packages.filter((pkg) => pkg.destinations.includes(dest.slug)).length;
}

function destinationCard(dest) {
  const href = `/destinations/${dest.slug}/`;
  const count = packageCount(dest);
  return html`<article class="card">
  <a class="card-media" href="${href}">
    <img src="${dest.hero}" alt="${dest.heroAlt}" loading="lazy" decoding="async">
  </a>
  <div class="card-body">
    <h3 class="h3"><a href="${href}">${dest.shortName}</a></h3>
    <p class="body">${dest.summary}</p>
    <p class="pkg-meta">${count} safari${count === 1 ? '' : 's'} visit ${dest.shortName}</p>
  </div>
</article>`;
}

/**
 * Renders the destinations index: an intro followed by a card grid linking
 * to every destination detail page.
 *
 * @param {object[]} destinationsList — the full `data/destinations.js` array
 * @returns {string} the complete HTML document
 */
export function destinationsIndexPage(destinationsList) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations/' },
  ];

  const cards = destinationsList.map((dest) => destinationCard(dest));

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">Destinations</h1>
      <p class="lede">Eight places across Kenya, from the Mara's open plains to the Diani coast — each one part of the ground Nissa guides.</p>
    </div>
  </header>
  <section class="section-alt">
    <div class="wrap">
      <div class="grid-3">
        ${cards}
      </div>
    </div>
  </section>
</main>`;

  return layout({
    title: TITLE,
    description: DESCRIPTION,
    path: '/destinations/',
    image: destinationsList[0]?.hero,
    preloadImage: destinationsList[0]?.hero,
    crumbs,
    body,
  });
}
