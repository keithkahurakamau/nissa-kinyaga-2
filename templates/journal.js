import { html } from '../lib/html.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { ctaBlock, breadcrumbNav } from './partials.js';
import journal from '../data/journal.js';

// Authored well clear of the 50-165 (escaped) char range; truncateToEscapedLimit
// is a safety net for escaping inflation, matching the pattern in
// templates/about.js/destination.js/package.js.
const DESCRIPTION =
  "Stories from the bush by Nissa Ole Kinyaga — field notes on patience with big cats, conservation and his own Mukogodo Forest heritage.";

export function metaDescription() {
  const text = DESCRIPTION.trim();
  const len = escapedLength(text);
  if (len <= MAX_DESCRIPTION) return text;
  return truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

function entryCard(entry) {
  const paragraphs = entry.body.map((para) => html`<p class="body">${para}</p>`);
  return html`<article class="card">
  <div class="card-media">
    <img src="${entry.image}" alt="${entry.imageAlt}" loading="lazy" decoding="async">
  </div>
  <div class="card-body">
    <p class="pkg-meta">${entry.category}</p>
    <h2 class="h3">${entry.title}</h2>
    ${paragraphs}
  </div>
</article>`;
}

/**
 * Renders the journal page: field notes migrated from index.html's
 * #journal section, expanded into full entries.
 *
 * @returns {string} the complete HTML document
 */
export function journalPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/journal/' },
  ];

  const cards = journal.map((entry) => entryCard(entry));

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">Stories from the bush</h1>
      <p class="lede">Field notes from Nissa's own years in the conservancies — on patience, conservation and where his own story began.</p>
    </div>
  </header>
  <section class="section-alt">
    <div class="wrap">
      <div class="grid-3">
        ${cards}
      </div>
    </div>
  </section>
  ${ctaBlock({
    heading: 'Plan your own Kenya safari',
    body: 'Send your travel dates and Nissa will build the itinerary himself, drawing on the conservancies and lodges he knows first-hand.',
  })}
</main>`;

  return layout({
    title: 'Journal — Stories from the Bush | Nissa Safaris',
    description: metaDescription(),
    path: '/journal/',
    image: journal[0]?.image,
    preloadImage: journal[0]?.image,
    crumbs,
    body,
  });
}
