import { html } from '../lib/html.js';
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

// Every photo renders as a real server-side <img> (Task 17 fix: the reel
// used to be built entirely by app.js from an inline array, so crawlers
// indexed nothing). app.js still drives the carousel/lightbox, reading each
// card back out of this markup instead of holding its own copy of the data.
function galleryCard(item, i) {
  return html`<figure class="gal-item${i === 0 ? ' is-active' : ''}">
  ${// the first frame is the preloaded LCP image (see the <link rel=preload>
      // below), lazy-loading it would contradict that preload
      picture({ src: item.src, alt: item.alt, lazy: i !== 0 })}
  <div class="gal-card-scrim" aria-hidden="true"></div>
  <figcaption class="glass glass-dark refract gal-card-caption">
    <span class="gal-card-cat">${item.category}</span>
    <div class="gal-card-title">${item.title}</div>
    <p class="gal-card-story">${item.story}</p>
    <button type="button" class="btn btn-gold" data-lb="${i}">View image</button>
  </figcaption>
</figure>`;
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
 * crawlable <img>, plus the carousel/lightbox markup app.js progressively
 * enhances.
 *
 * @returns {string} the complete HTML document
 */
export function galleryPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery/' },
  ];

  const cards = gallery.map((item, i) => galleryCard(item, i));

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">From the field</h1>
      <p class="lede">Photographs from Nissa's own safaris, each with the story behind the frame. Swipe, scroll or use the arrows to move through the reel, and tap a frame to view it full-screen.</p>
    </div>
  </header>
  <section class="section-alt">
    <div class="wrap">
      <div class="gal-wrap">
        <div id="nk-gal" class="gal" role="region" aria-roledescription="carousel" aria-label="Photographs from the field" tabindex="0">
          <div class="gal-track">
            ${cards}
          </div>
        </div>
        <button id="nk-prev" type="button" class="galbtn galbtn-prev" aria-label="Previous photo">&#8249;</button>
        <button id="nk-next" type="button" class="galbtn galbtn-next" aria-label="Next photo">&#8250;</button>
      </div>
      <div id="nk-gal-meta" class="gal-counter"><span id="nk-gal-cur">01</span> <span class="gal-counter-sep">/</span> <span id="nk-gal-total">${String(gallery.length).padStart(2, '0')}</span></div>
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
