import { existsSync } from 'node:fs';
import { html, raw } from '../lib/html.js';
import site from '../data/site.js';
import { PRICES } from '../data/packages.js';

/**
 * The `.webp` path that would sit alongside `src` if `scripts/make-webp.js`
 * had generated one — same directory, extension swapped.
 *
 * @param {string} src — root-relative image path, e.g. "/assets/lion.jpg"
 * @returns {string}
 */
function webpSiblingPath(src) {
  return src.replace(/\.[a-z0-9]+$/i, '.webp');
}

/**
 * Whether a `.webp` sibling actually exists on disk for a given
 * root-relative asset path. Resolved against the real `assets/` directory
 * (one level up from `templates/`), not `dist/` — the build hasn't run yet
 * when templates render.
 *
 * @param {string} webpSrc — e.g. "/assets/lion.webp"
 * @returns {boolean}
 */
function webpSiblingExists(webpSrc) {
  try {
    return existsSync(new URL(`..${webpSrc}`, import.meta.url));
  } catch {
    return false;
  }
}

/**
 * Renders an image as a `<picture>` with a WebP `<source>` plus the
 * original (JPEG/PNG) `<img>` as fallback — or, when no `.webp` sibling
 * exists on disk for `src` (e.g. `cwebp` was never run on this machine, or
 * the source isn't a `.jpg`), degrades to a plain `<img>` with no
 * `<picture>` wrapper at all. Never emits a `<source>` pointing at a file
 * that isn't there.
 *
 * @param {object} opts
 * @param {string} opts.src — root-relative image path, e.g. "/assets/lion.jpg"
 * @param {string} opts.alt — alt text, carried through unchanged (may be
 *   `""` for a decorative image marked `aria-hidden`)
 * @param {string} [opts.className] — class applied to the `<img>` itself,
 *   never to the `<picture>` wrapper, so existing `<img>`-targeted CSS
 *   (e.g. `.pkg-hero img`, descendant selectors) keeps matching.
 * @param {boolean} [opts.lazy=true] — false for hero images: emits
 *   `fetchpriority="high"` instead of `loading="lazy"`.
 * @param {string} [opts.sizes] — forwarded to the `<source>`'s `sizes`
 *   attribute when a WebP sibling exists.
 * @param {boolean} [opts.ariaHidden=false] — adds `aria-hidden="true"` to
 *   the `<img>`, for purely decorative background photos (paired with
 *   `alt: ''`) that also sit behind text an assistive-tech user shouldn't
 *   be told is "an image".
 * @returns {import('../lib/html.js').RawHtml}
 */
export function picture({ src, alt, className, lazy = true, sizes, ariaHidden = false }) {
  const webpSrc = webpSiblingPath(src);
  const hasWebp = webpSiblingExists(webpSrc);
  const classAttr = className ? raw(` class="${className}"`) : '';
  const loadingOrPriority = lazy ? raw(' loading="lazy"') : raw(' fetchpriority="high"');
  const ariaHiddenAttr = ariaHidden ? raw(' aria-hidden="true"') : '';

  const img = html`<img${classAttr} src="${src}" alt="${alt}" decoding="async"${loadingOrPriority}${ariaHiddenAttr}>`;

  if (!hasWebp) return img;

  const sizesAttr = sizes ? raw(` sizes="${sizes}"`) : '';
  return html`<picture>
  <source type="image/webp" srcset="${webpSrc}"${sizesAttr}>
  ${img}
</picture>`;
}

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
    ${picture({ src: pkg.hero, alt: pkg.heroAlt })}
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
