import { existsSync } from 'node:fs';
import { html, raw } from '../lib/html.js';
import site from '../data/site.js';
import { balloonSafari } from '../data/experiences.js';

/**
 * The `.webp` path that would sit alongside `src` if `scripts/make-webp.js`
 * had generated one, same directory, extension swapped.
 *
 * @param {string} src, root-relative image path, e.g. "/assets/lion.jpg"
 * @returns {string}
 */
function webpSiblingPath(src) {
  return src.replace(/\.[a-z0-9]+$/i, '.webp');
}

/**
 * Whether a `.webp` sibling actually exists on disk for a given
 * root-relative asset path. Resolved against the real `assets/` directory
 * (one level up from `templates/`), not `dist/`, the build hasn't run yet
 * when templates render.
 *
 * @param {string} webpSrc, e.g. "/assets/lion.webp"
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
 * original (JPEG/PNG) `<img>` as fallback, or, when no `.webp` sibling
 * exists on disk for `src` (e.g. `cwebp` was never run on this machine, or
 * the source isn't a `.jpg`), degrades to a plain `<img>` with no
 * `<picture>` wrapper at all. Never emits a `<source>` pointing at a file
 * that isn't there.
 *
 * @param {object} opts
 * @param {string} opts.src, root-relative image path, e.g. "/assets/lion.jpg"
 * @param {string} opts.alt, alt text, carried through unchanged (may be
 *   `""` for a decorative image marked `aria-hidden`)
 * @param {string} [opts.className], class applied to the `<img>` itself,
 *   never to the `<picture>` wrapper, so existing `<img>`-targeted CSS
 *   (e.g. `.pkg-hero img`, descendant selectors) keeps matching.
 * @param {boolean} [opts.lazy=true], false for hero images: emits
 *   `fetchpriority="high"` instead of `loading="lazy"`.
 * @param {string} [opts.sizes], forwarded to the `<source>`'s `sizes`
 *   attribute when a WebP sibling exists.
 * @param {boolean} [opts.ariaHidden=false], adds `aria-hidden="true"` to
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
 * @param {object} pkg, an entry from `data/packages.js`
 * @returns {import('../lib/html.js').RawHtml}
 */
export function packageCard(pkg) {
  const href = `/safaris/${pkg.slug}/`;
  // The whole card is clickable via a stretched-link pseudo-element on the
  // title anchor, rather than wrapping the <article> in an <a>. That keeps one
  // real link per card (so screen readers announce the trip name, not the whole
  // card's text), keeps the markup valid, and leaves text selectable.
  return html`<article class="pkg-card" data-reveal="clip">
  <div class="pkg-card-media">
    ${picture({ src: pkg.hero, alt: pkg.heroAlt })}
    <div class="pkg-card-veil" aria-hidden="true"><span>View the itinerary</span></div>
  </div>
  <div class="pkg-card-body">
    ${pkg.signature && html`<span class="badge badge-signature">Signature</span>`}
    <h3 class="h3"><a class="pkg-card-link" href="${href}">${pkg.title}</a></h3>
    <p class="body">${pkg.summary}</p>
    <p class="pkg-meta">${pkg.days} days · ${pkg.destinations.length} ${pkg.destinations.length === 1 ? 'destination' : 'destinations'}</p>
  </div>
</article>`;
}

/**
 * The hot air balloon add-on, rendered on the two parks that have flights
 * (data/experiences.js `parks`) and on any package visiting one of them.
 *
 * Returns an empty string for every other destination, so a park with no
 * balloon operation can never accidentally advertise one. Written in
 * operator voice throughout: we book the seat, a licensed balloon company
 * flies it. See the voice rule at the top of data/experiences.js.
 *
 * @param {string} slug, a data/destinations.js slug
 * @returns {import('../lib/html.js').RawHtml | string}
 */
export function balloonSection(slug) {
  const park = balloonSafari.parks[slug];
  if (!park) return '';

  const steps = balloonSafari.howItWorks.map((step) => html`<p class="body">${step}</p>`);
  const notes = balloonSafari.practical.map((note) => html`<li>${note}</li>`);

  return html`<section class="section-alt">
  <div class="wrap">
    ${sectionHeading({ number: '05', eyebrow: 'Add-on experience', heading: balloonSafari.name })}
    <div class="balloon-grid">
      <div class="balloon-media">
        ${picture({ src: park.image, alt: park.imageAlt })}
      </div>
      <div class="balloon-copy">
        <h3 class="h3">${park.label}</h3>
        <p class="lede">${park.body}</p>
        ${steps}
      </div>
    </div>
    <div class="balloon-foot">
      <div>
        <h3 class="h3">Worth knowing</h3>
        <ul class="balloon-notes">
          ${notes}
        </ul>
      </div>
      <div>
        <h3 class="h3">Who flies it</h3>
        <p class="body">${balloonSafari.operatorNote}</p>
        <a class="btn btn-gold" href="${whatsappLink(`Balloon safari, ${park.label}`)}" target="_blank" rel="noopener noreferrer">Add a balloon flight</a>
      </div>
    </div>
  </div>
</section>`;
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
  // data-reveal hooks the IntersectionObserver in app.js and the transitions
  // in styles.css, both of which already existed but had nothing to act on:
  // the attribute appeared in no template, so the whole reveal system was
  // dead code. The eyebrow leads and the heading follows on a short delay,
  // which reads as one movement rather than two separate ones.
  return html`<div class="eyebrow" data-reveal="up"><span>${number}</span><span>${eyebrow}</span></div>
<h2 class="h2" data-reveal="up" data-reveal-delay="90">${heading}</h2>`;
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
