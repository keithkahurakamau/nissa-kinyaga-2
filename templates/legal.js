import { html, raw } from '../lib/html.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit, inlineLinks } from '../lib/text.js';
import { layout } from './layout.js';
import { breadcrumbNav } from './partials.js';
import site from '../data/site.js';
import journeys from '../data/journeys.js';
import {
  lastUpdated,
  jurisdiction,
  commercialTermsPending,
  storage,
  processors,
  terms,
  privacy,
  cookies,
  copyright,
} from '../data/legal.js';

/**
 * The four legal pages: terms and conditions, privacy policy, cookie and
 * storage policy, copyright and image credits.
 *
 * They share one renderer because they share one shape (a lede, a contents
 * list, then numbered sections of prose) and because a legal page that
 * looks different from its neighbours reads as an afterthought. The content
 * lives in data/legal.js; everything here is presentation, apart from the
 * Creative Commons credit list, which is generated from data/journeys.js so
 * the attribution CC BY-SA requires cannot drift from the photographs
 * actually in use.
 */

function clampDescription(text) {
  const trimmed = text.trim();
  return escapedLength(trimmed) <= MAX_DESCRIPTION
    ? trimmed
    : truncateToEscapedLimit(trimmed, MAX_DESCRIPTION);
}

// A contents list rather than a wall of headings. On the terms page in
// particular this is the difference between a document someone skims for
// the clause they need and one they close.
function contents(sections) {
  return html`<nav class="legal-toc" aria-label="On this page">
  <h2 class="legal-toc-heading">On this page</h2>
  <ol class="legal-toc-list">
    ${sections.map((section) => html`<li><a href="#${section.id}">${section.heading}</a></li>`)}
  </ol>
</nav>`;
}

function sectionBlock(section, i, extras) {
  const extra = extras[section.id];
  return html`<section id="${section.id}" class="${i % 2 === 0 ? 'section' : 'section-alt'} legal-section">
  <div class="wrap-narrow">
    <p class="legal-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
    <h2 class="h2">${section.heading}</h2>
    ${section.paragraphs.map((text) => html`<p class="body">${inlineLinks(text)}</p>`)}
    ${section.list
      ? html`<ul class="legal-list">
      ${section.list.map((item) => html`<li>${inlineLinks(item)}</li>`)}
    </ul>`
      : ''}
    ${extra ?? ''}
  </div>
</section>`;
}

/**
 * @param {object} opts
 * @param {string} opts.title, the <title>
 * @param {string} opts.heading, the <h1>
 * @param {string} opts.lede
 * @param {string} opts.description, meta description
 * @param {string} opts.path
 * @param {string} opts.crumb, the breadcrumb label
 * @param {object[]} opts.sections, from data/legal.js
 * @param {Record<string, import('../lib/html.js').RawHtml>} [opts.extras],
 *   extra markup appended inside the section with the matching id
 * @returns {string} the complete HTML document
 */
function legalPage({ title, heading, lede, description, path, crumb, sections, extras = {} }) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: crumb, path },
  ];

  const body = html`<main id="main">
  <header class="section legal-head">
    <div class="wrap-narrow">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">${heading}</h1>
      <p class="lede">${lede}</p>
      <p class="legal-updated">Last updated ${lastUpdated}</p>
      ${contents(sections)}
    </div>
  </header>
  ${sections.map((section, i) => sectionBlock(section, i, extras))}
  <section class="section legal-foot">
    <div class="wrap-narrow">
      <h2 class="h2">Questions about any of this</h2>
      <p class="body">Email <a href="mailto:${site.email}">${site.email}</a> or message <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>. It reaches ${site.guide} directly, and a plain question gets a plain answer.</p>
      <nav class="legal-crosslinks" aria-label="Other legal pages">
        ${LEGAL_PAGES.filter((page) => page.path !== path).map(
          (page) => html`<a href="${page.path}">${page.label}</a>`,
        )}
      </nav>
    </div>
  </section>
</main>`;

  return layout({ title, description: clampDescription(description), path, crumbs, body });
}

// Single source for the cross-links at the foot of each legal page and for
// the legal row in the site footer (data/site.js imports the paths).
const LEGAL_PAGES = [
  { path: '/terms/', label: 'Terms and conditions' },
  { path: '/privacy/', label: 'Privacy policy' },
  { path: '/cookies/', label: 'Cookies' },
  { path: '/copyright/', label: 'Copyright and credits' },
];

/* ---------- terms ---------- */

// Rendered only while data/legal.js says the commercial terms live in the
// written quote. When Nissa supplies his deposit and cancellation schedule
// this disappears on its own rather than needing to be hunted down.
function quoteGovernsNote() {
  if (!commercialTermsPending) return '';
  return html`<aside class="legal-note">
  <p class="legal-note-heading">Where the numbers live</p>
  <p>Deposit amounts, payment dates and the cancellation scale are not published here, because they are set trip by trip and we will not put a figure on this page that differs from the one you actually agreed. They are written into your quote, in full, before you are asked to confirm anything. If a quote reaches you without them, ask, and do not confirm it until they are there.</p>
</aside>`;
}

export function termsPage() {
  return legalPage({
    title: 'Terms and Conditions | Nissa Safaris',
    heading: 'Terms and conditions',
    crumb: 'Terms',
    lede: 'How a trip with us is quoted, confirmed and run, what we are responsible for, and what we need from you. Written to be read, not to be got past.',
    description:
      'Booking terms for Nissa Safaris: how quotes and confirmations work, insurance and travel documents, safety in the field, and who runs each part of your trip.',
    path: '/terms/',
    sections: terms,
    extras: { quotes: quoteGovernsNote() },
  });
}

/* ---------- privacy ---------- */

function processorTable() {
  return html`<div class="legal-table-wrap">
  <table class="legal-table">
    <caption class="legal-table-caption">Every third party involved in this website, and what reaches each one.</caption>
    <thead>
      <tr><th scope="col">Who</th><th scope="col">Why</th><th scope="col">What they see</th></tr>
    </thead>
    <tbody>
      ${processors.map(
        (entry) => html`<tr>
        <th scope="row"><a href="${entry.url}" target="_blank" rel="noopener noreferrer">${entry.name}</a></th>
        <td data-label="Why">${entry.role}</td>
        <td data-label="What they see">${entry.sees}</td>
      </tr>`,
      )}
    </tbody>
  </table>
</div>`;
}

export function privacyPage() {
  return legalPage({
    title: 'Privacy Policy | Nissa Safaris',
    heading: 'Privacy policy',
    crumb: 'Privacy',
    lede: 'This site has no backend, no analytics and no tracking cookies, and the forms do not submit anywhere. Here is exactly what that means for your data.',
    description:
      'How Nissa Safaris handles your data: no backend, no analytics, no tracking cookies, forms that never leave your browser, and your rights under Kenyan law.',
    path: '/privacy/',
    sections: privacy,
    extras: { sharing: processorTable() },
  });
}

/* ---------- cookies ---------- */

function storageTable() {
  return html`<div class="legal-table-wrap">
  <table class="legal-table">
    <caption class="legal-table-caption">Everything this site keeps in your browser. There is one entry, and it is not a cookie.</caption>
    <thead>
      <tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">What it does</th><th scope="col">Kept for</th></tr>
    </thead>
    <tbody>
      ${storage.map(
        (item) => html`<tr>
        <th scope="row"><code>${item.key}</code></th>
        <td data-label="Type">${item.kind}<span class="legal-tag">${item.category}</span></td>
        <td data-label="What it does">${item.purpose} ${item.contains}</td>
        <td data-label="Kept for">${item.duration}</td>
      </tr>`,
      )}
    </tbody>
  </table>
</div>`;
}

// app.js fills in the current choice and wires the buttons. Rendered as a
// plain, honest fallback: with JavaScript off there is nothing stored to
// change in the first place, so the static text is still true.
function preferenceControl() {
  return html`<div id="nk-prefs" class="legal-prefs">
  <p class="legal-prefs-status" id="nk-prefs-status">Nothing is stored in this browser yet. The banner will ask you on your first visit.</p>
  <div class="legal-prefs-actions">
    <button type="button" id="nk-prefs-accept" class="btn btn-gold">Allow analytics</button>
    <button type="button" id="nk-prefs-decline" class="btn btn-ink">Essential only</button>
    <button type="button" id="nk-prefs-clear" class="btn btn-ink">Forget my choice</button>
  </div>
</div>`;
}

export function cookiesPage() {
  return legalPage({
    title: 'Cookies and Browser Storage | Nissa Safaris',
    heading: 'Cookies',
    crumb: 'Cookies',
    lede: 'The short answer is that this site does not use any. The longer answer is the one thing it does keep in your browser, and how to change or clear it.',
    description:
      'Nissa Safaris sets no cookies and runs no analytics. What is stored in your browser, which third parties see anything, and how to change your privacy choice.',
    path: '/cookies/',
    sections: cookies,
    extras: { stored: storageTable(), control: preferenceControl() },
  });
}

/* ---------- copyright ---------- */

// Generated from data/journeys.js, never typed by hand. CC BY-SA 4.0
// requires the author, the licence and a route back to the source to travel
// with the image; each journey page already carries its own credit inline,
// and this collects them in one place so the obligation is visible even to
// someone who never opens a country page.
function creativeCommonsCredits() {
  const credited = journeys.filter((country) => country.heroCredit);
  if (!credited.length) return '';
  return html`<h3 class="h3 legal-subhead">Photographs licensed from others</h3>
<p class="body">These images are not ours. Each is used under a Creative Commons licence that permits it, and each is credited here and on the page it appears on.</p>
<ul class="legal-credits">
  ${credited.map(
    (country) => html`<li>
    <a class="legal-credit-page" href="/journeys/${country.slug}/">${country.name}</a>
    <span class="legal-credit-meta">Photograph by ${country.heroCredit.author}, licensed under <a href="${country.heroCredit.licenseUrl}" target="_blank" rel="noopener noreferrer">${country.heroCredit.license}</a>. <a href="${country.heroCredit.sourceUrl}" target="_blank" rel="noopener noreferrer">Source</a>.</span>
  </li>`,
  )}
</ul>`;
}

function copyrightLine() {
  return html`<p class="legal-copyline">&copy; ${String(new Date().getFullYear())} ${site.legalName}. All rights reserved. Registered and operating in ${jurisdiction.country}.</p>`;
}

export function copyrightPage() {
  return legalPage({
    title: 'Copyright and Image Credits | Nissa Safaris',
    heading: 'Copyright and credits',
    crumb: 'Copyright',
    lede: 'Who owns what on this site, what you are welcome to use, and the photographs here that belong to someone else.',
    description:
      'Copyright and image credits for Nissa Safaris: what is ours, what you may reuse, the Creative Commons photographs we credit, and how to report an infringement.',
    path: '/copyright/',
    sections: copyright,
    extras: {
      ownership: copyrightLine(),
      restrictions: raw(''),
      marks: creativeCommonsCredits(),
    },
  });
}

export { LEGAL_PAGES };
