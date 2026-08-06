import { html } from '../lib/html.js';
import site from '../data/site.js';
import { PRICES } from '../data/packages.js';

/**
 * Builds a `wa.me` deep link that opens WhatsApp with a prefilled enquiry
 * message, optionally naming a specific package.
 *
 * @param {string} [packageTitle]
 * @returns {string}
 */
export function whatsappLink(packageTitle) {
  const message = packageTitle
    ? `Hello Nissa, I'd love to plan the ${packageTitle} with you.`
    : `Hello Nissa, I'd love to plan a safari with you.`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Renders a single safari package as a card linking to its detail page.
 *
 * @param {object} pkg — an entry from `data/packages.js`
 * @returns {import('../lib/html.js').RawHtml}
 */
export function packageCard(pkg) {
  const price = PRICES[pkg.priceKey];
  const href = `/safaris/${pkg.slug}/`;
  return html`<article class="pkg-card">
  <a class="pkg-card-media" href="${href}">
    <img src="${pkg.hero}" alt="${pkg.heroAlt}" loading="lazy" decoding="async">
  </a>
  <div class="pkg-card-body">
    ${pkg.signature && html`<span class="badge badge-signature">Signature</span>`}
    <h3 class="h3"><a href="${href}">${pkg.title}</a></h3>
    <p class="body">${pkg.summary}</p>
    <p class="pkg-meta">${pkg.days} days · ${pkg.destinations.length} destination(s)</p>
    <p class="pkg-price">From $${price.fromUsd}<span> per person</span></p>
  </div>
</article>`;
}

/**
 * A forest-background call-to-action block that drives an enquiry straight
 * into WhatsApp, optionally naming the package under discussion.
 *
 * @param {{ heading: string, body: string, packageTitle?: string }} opts
 * @returns {import('../lib/html.js').RawHtml}
 */
export function ctaBlock({ heading, body, packageTitle }) {
  return html`<div class="section-forest">
  <div class="wrap">
    <h2 class="h2">${heading}</h2>
    <p class="lede">${body}</p>
    <a class="btn btn-gold" href="${whatsappLink(packageTitle)}" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp</a>
  </div>
</div>`;
}

/**
 * The numbered eyebrow + heading pattern used to open every content
 * section across the site (e.g. "01 · The Story").
 *
 * @param {{ number: string, eyebrow: string, heading: string }} opts
 * @returns {import('../lib/html.js').RawHtml}
 */
export function sectionHeading({ number, eyebrow, heading }) {
  return html`<div class="eyebrow"><span>${number}</span><span>${eyebrow}</span></div>
<h2 class="h2">${heading}</h2>`;
}

/**
 * A breadcrumb trail. The last crumb is rendered as inert text marked
 * `aria-current="page"` rather than a link to itself.
 *
 * @param {{ name: string, path: string }[]} crumbs
 * @returns {import('../lib/html.js').RawHtml}
 */
export function breadcrumbNav(crumbs) {
  const items = crumbs.map((crumb, i) => {
    const isLast = i === crumbs.length - 1;
    return isLast
      ? html`<span class="crumb" aria-current="page">${crumb.name}</span>`
      : html`<a class="crumb" href="${crumb.path}">${crumb.name}</a>`;
  });
  return html`<nav class="crumbs" aria-label="Breadcrumb">${items}</nav>`;
}
