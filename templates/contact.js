import { html, raw } from '../lib/html.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { breadcrumbNav, whatsappLink, picture } from './partials.js';
import site from '../data/site.js';

// Authored well clear of the 50-165 (escaped) char range; truncateToEscapedLimit
// is a safety net for escaping inflation, matching the pattern in
// templates/about.js/destination.js/package.js.
const DESCRIPTION =
  'Plan your Kenya safari directly with Nissa Ole Kinyaga — email, call, or send an enquiry with your travel dates on WhatsApp.';

export function metaDescription() {
  const text = DESCRIPTION.trim();
  const len = escapedLength(text);
  if (len <= MAX_DESCRIPTION) return text;
  return truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

// One option per entry in data/packages.js, plus a catch-all — server
// rendered so the list can never drift from the 21 packages (Task 17).
// This is a custom listbox (role="listbox"/"option"), not a native
// <select>, ported from index.html's #nk-pkg-toggle/#nk-pkg pattern onto
// the .pkg-select* classes added in Task 10 for exactly this page; app.js
// drives open/close and selection via the .is-open/.is-selected/.has-value
// modifier classes already defined in styles.css.
//
// `title` is rendered via raw() rather than html`` auto-escaping: several
// package titles contain a literal "&" (e.g. "4-Day Masai Mara & Lake
// Nakuru"), and titles are trusted, static, quote-free strings from
// data/packages.js — not user input — so this is safe. Titles never
// contain '<', '>' or '"'; validatePackage/assertAllValid would need to
// enforce that invariant if that ever changed.
function pkgOption(title) {
  return html`<button type="button" role="option" class="pkg-select-opt" data-pkg="${raw(title)}" aria-selected="false">${raw(title)}</button>`;
}

function packageSelect(packagesList) {
  const options = packagesList.map((pkg) => pkgOption(pkg.title));
  return html`<div class="field">
  <label id="pkg-select-label" class="field-label">Which experience interests you?</label>
  <div class="pkg-select-wrap">
    <button type="button" id="nk-pkg-toggle" class="pkg-select" aria-haspopup="listbox" aria-expanded="false" aria-controls="nk-pkg" aria-labelledby="pkg-select-label nk-pkg-label">
      <span id="nk-pkg-label">Choose a safari</span>
      <span id="nk-pkg-icon" class="pkg-select-icon">SELECT</span>
    </button>
    <div id="nk-pkg" class="pkg-select-panel" role="listbox" aria-labelledby="pkg-select-label">
      ${options}
      ${pkgOption('Not sure yet — help me choose')}
    </div>
  </div>
</div>`;
}

function contactForm(packagesList) {
  return html`<div id="nk-form-wrap">
  <form id="nk-form" class="form">
    <div class="field">
      <label class="field-label" for="nk-name">Your name</label>
      <input id="nk-name" name="name" type="text" class="field-input" required autocomplete="name">
    </div>
    <div class="field">
      <label class="field-label" for="nk-email">Email</label>
      <input id="nk-email" name="email" type="email" class="field-input" required autocomplete="email" inputmode="email">
    </div>
    ${packageSelect(packagesList)}
    <div class="field">
      <label class="field-label" for="nk-date">When would you travel?</label>
      <input id="nk-date" name="travel" type="date" class="field-date">
      <label class="field-check" for="nk-flex"><input id="nk-flex" type="checkbox" name="flexible">I'm flexible / not sure of dates yet</label>
    </div>
    <div class="field">
      <label class="field-label" for="nk-wish">What do you hope to see?</label>
      <textarea id="nk-wish" name="wish" rows="3" class="field-textarea"></textarea>
    </div>
    <button type="submit" class="btn btn-gold form-submit">Send to Nissa</button>
  </form>
</div>`;
}

function contactInfo() {
  return html`<div>
  <h2 class="h2">Plan your safari directly with me</h2>
  <p class="lede">Every enquiry comes to me personally. Tell me what you hope to see, when you'd like to travel, and I'll help shape the journey.</p>
  <div class="contact-info">
    <div class="contact-row">
      <div class="field-label">Email</div>
      <a class="contact-link" href="mailto:${site.email}">${site.email}</a>
    </div>
    <div class="contact-row">
      <div class="field-label">Phone / WhatsApp</div>
      <a class="contact-link" href="tel:${site.phones[0].replace(/\s+/g, '')}">${site.phones[0]}</a>
      <div class="contact-alt">Alternate · <a href="tel:${site.phones[1].replace(/\s+/g, '')}">${site.phones[1]}</a></div>
      <div class="contact-actions">
        <a href="tel:${site.phones[0].replace(/\s+/g, '')}" class="btn btn-ink">Call directly</a>
        <a href="${whatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn btn-gold">WhatsApp</a>
      </div>
    </div>
    <div class="contact-social">
      <a href="https://instagram.com/${site.instagram}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">Instagram</a>
      <a href="${whatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">WhatsApp</a>
    </div>
  </div>
</div>`;
}

/**
 * Renders the contact page: Nissa's direct contact details plus an
 * enquiry form whose package list is generated from every entry in
 * `data/packages.js`, so it can never drift from the 21 packages.
 *
 * @param {object[]} packagesList — the full `data/packages.js` array
 * @returns {string} the complete HTML document
 */
export function contactPage(packagesList) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact/' },
  ];

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">Contact Nissa</h1>
      <p class="lede">Every enquiry is handled personally by ${site.guide} — reach him directly by email, phone, WhatsApp, or the form below.</p>
    </div>
  </header>
  <section class="section-forest">
    ${picture({ src: '/assets/p14.jpg', alt: '', className: 'photo-bg', ariaHidden: true })}
    <div class="photo-overlay"></div>
    <div class="wrap photo-content">
      <div class="grid-2">
        ${contactInfo()}
        ${contactForm(packagesList)}
      </div>
    </div>
  </section>
</main>`;

  return layout({
    title: 'Contact Nissa — Plan Your Kenya Safari | Nissa Safaris',
    description: metaDescription(),
    path: '/contact/',
    crumbs,
    body,
  });
}
