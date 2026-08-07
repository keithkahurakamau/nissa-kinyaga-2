import { html, raw, renderToString } from '../lib/html.js';
import { headTags, jsonLd, breadcrumbSchema } from '../lib/seo.js';
import site from '../data/site.js';
import { whatsappLink, picture } from './partials.js';

const CSP =
  "default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'none'; " +
  "img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; " +
  "font-src https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; manifest-src 'self'";

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2322291E'/%3E%3Ctext x='32' y='44' font-family='Georgia,serif' font-size='34' font-weight='600' fill='%23C9A24B' text-anchor='middle'%3ENK%3C/text%3E%3C/svg%3E";

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600&family=Mulish:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap';

// The lens-refraction filters `.btn`/`.refract`/`#nk-cursor` reference via
// `backdrop-filter: url(#nk-refract)` / `url(#nk-drop)` in styles.css. A
// url(#id) filter with no matching element in the document resolves to
// nothing, so this must render once per page. Ported verbatim from
// index.html:171-184; ".filter-defs" replaces its inline
// style="position:absolute;pointer-events:none" (no inline styles allowed).
const SVG_FILTER_DEFS = `<svg width="0" height="0" class="filter-defs" aria-hidden="true"><defs>
  <filter id="nk-refract" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feImage preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" result="map"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cdefs%3E%3ClinearGradient id='h' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0' stop-color='%23000'/%3E%3Cstop offset='1' stop-color='%23ff0000'/%3E%3C/linearGradient%3E%3ClinearGradient id='v' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23000'/%3E%3Cstop offset='1' stop-color='%2300ff00'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23h)'/%3E%3Crect width='100' height='100' fill='url(%23v)' style='mix-blend-mode:screen'/%3E%3C/svg%3E"/>
    <feGaussianBlur in="map" stdDeviation="2" result="smap"/>
    <feDisplacementMap in="SourceGraphic" in2="smap" scale="38" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="nk-drop" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
    <feImage preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" result="map"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cdefs%3E%3ClinearGradient id='h' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0' stop-color='%23000'/%3E%3Cstop offset='1' stop-color='%23ff0000'/%3E%3C/linearGradient%3E%3ClinearGradient id='v' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23000'/%3E%3Cstop offset='1' stop-color='%2300ff00'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23h)'/%3E%3Crect width='100' height='100' fill='url(%23v)' style='mix-blend-mode:screen'/%3E%3C/svg%3E"/>
    <feGaussianBlur in="map" stdDeviation="1" result="smap"/>
    <feDisplacementMap in="SourceGraphic" in2="smap" scale="16" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs></svg>`;

function navItem(item, path, extraClass) {
  const isCurrent = item.href === path;
  return html`<a class="nav-link${extraClass ?? ''}"${isCurrent ? raw(' aria-current="page"') : ''} href="${item.href}">${item.label}</a>`;
}

function menuItem(item, path, extraClass) {
  // app.js closes the mobile menu via document.querySelectorAll('.nk-mlink')
  // on click — that literal class token must be present on the element
  // itself; the CSS-level `.menu-link, .nk-mlink` alias in styles.css only
  // covers styling, not app.js's DOM query.
  const isCurrent = item.href === path;
  return html`<a class="menu-link nk-mlink${extraClass ?? ''}"${isCurrent ? raw(' aria-current="page"') : ''} href="${item.href}">${item.label}</a>`;
}

function nav(path) {
  const links = site.nav.map((item, i) =>
    navItem(item, path, i === site.nav.length - 1 ? ' btn btn-ink nav-cta' : ''),
  );
  return html`<nav id="nk-nav" class="nav" aria-label="Primary">
  <div id="nk-navbar" class="nav-bar">
    <a href="/" class="nav-logo">${picture({ src: site.logo, alt: site.name })}</a>
    <div class="nav-links" data-desktopnav>
      ${links}
    </div>
    <button id="nk-menu-open" type="button" class="menu-open" aria-label="Open menu" data-mobtoggle>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>`;
}

function mobileMenu(path) {
  const links = site.nav.map((item, i) =>
    menuItem(item, path, i === site.nav.length - 1 ? ' btn nav-cta' : ''),
  );
  return html`<div id="nk-menu" class="menu">
  <button id="nk-menu-close" type="button" class="menu-close" aria-label="Close menu">&times;</button>
  ${links}
</div>`;
}

function footer() {
  const links = site.footerLinks.map(
    (link) => html`<a href="${link.href}">${link.label}</a>`,
  );
  return html`<footer class="footer">
  <div class="footer-grid">
    <div>
      ${picture({ src: site.logo, alt: site.name, className: 'footer-logo' })}
    </div>
    <nav class="footer-links" aria-label="Footer">
      ${links}
    </nav>
  </div>
  <div class="footer-legal">
    &copy; ${new Date().getFullYear()} ${site.name}. All enquiries are handled personally by ${site.guide}.
  </div>
</footer>`;
}

function consentBanner() {
  return html`<div id="nk-consent" class="consent" role="dialog" aria-modal="false" aria-label="Privacy notice">
  <p>This site keeps your data private. We set <strong>no advertising or tracking cookies</strong>. Any enquiry you send goes straight to ${site.guide} via WhatsApp or email and is not stored here. See how we handle data in our <a href="/privacy/">privacy note</a>.</p>
  <div class="consent-actions">
    <button type="button" id="nk-consent-accept" class="btn btn-gold">Allow analytics</button>
    <button type="button" id="nk-consent-decline" class="btn btn-ink">Essential only</button>
  </div>
</div>`;
}

function whatsappButton() {
  return html`<a id="nk-wa" class="nk-wa" href="${whatsappLink()}" target="_blank" rel="noopener noreferrer" aria-label="Chat with Nissa on WhatsApp">
  <span class="nk-wa-ico"><svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path fill="#fff" d="M16.001 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.26.6 4.46 1.74 6.41L3.1 28.9l6.66-1.75A12.74 12.74 0 0 0 16 28.8C23.07 28.8 28.8 23.07 28.8 16S23.07 3.2 16.001 3.2Zm0 23.2c-1.94 0-3.84-.52-5.5-1.5l-.4-.24-3.95 1.04 1.05-3.85-.26-.4A10.34 10.34 0 0 1 5.6 16c0-5.74 4.66-10.4 10.4-10.4S26.4 10.26 26.4 16 21.74 26.4 16 26.4Zm5.7-7.78c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.81 1.02-1 1.23-.18.21-.37.24-.68.08-.31-.16-1.32-.49-2.51-1.55-.93-.83-1.55-1.85-1.74-2.16-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z"/></svg></span>
  <span class="nk-wa-txt">Chat on WhatsApp</span>
</a>`;
}

/**
 * Renders the complete `<!DOCTYPE html>` document every page on the site
 * shares: head metadata/SEO, nav, mobile menu, page body, footer, consent
 * banner and floating WhatsApp button.
 *
 * `body` must be (or contain) `<main id="main">…</main>` — the skip link
 * emitted here targets `#main`, and this function does not wrap the
 * supplied content in a `<main>` itself. Callers (page templates) own that.
 *
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} opts.path — site-relative path, e.g. "/safaris/"
 * @param {string} [opts.image] — absolute or root-relative share image
 * @param {string} [opts.type] — og:type, defaults to "website" (see headTags)
 * @param {object[]} [opts.schemas] — extra JSON-LD objects to emit
 * @param {{name: string, path: string}[]} [opts.crumbs] — breadcrumb trail;
 *   a BreadcrumbList schema is emitted automatically when there are 2+
 * @param {string} [opts.preloadImage] — root-relative image to preload
 * @param {import('../lib/html.js').RawHtml} opts.body — page content,
 *   including the `<main id="main">` wrapper
 * @returns {string} the full HTML document
 */
export function layout({
  title,
  description,
  path,
  image,
  type,
  schemas = [],
  crumbs = [],
  preloadImage,
  body,
}) {
  const allSchemas = crumbs.length > 1 ? [...schemas, breadcrumbSchema(crumbs)] : schemas;

  const page = html`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="${raw(CSP)}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#22291E">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="${FAVICON}">
${headTags({ title, description, path, image, type })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_HREF}" rel="stylesheet">
${preloadImage ? html`<link rel="preload" as="image" href="${preloadImage}" fetchpriority="high">` : ''}
<link rel="stylesheet" href="/styles.css">
${allSchemas.map((schema) => jsonLd(schema))}
</head>
<body>
${raw(SVG_FILTER_DEFS)}
<a class="skip-link" href="#main">Skip to content</a>
<div id="nk-cursor"></div>
<div id="nk-dot"></div>
<div id="nk-progress" aria-hidden="true"></div>
${nav(path)}
${mobileMenu(path)}
${body}
${footer()}
${consentBanner()}
${whatsappButton()}
<script src="/app.js" defer></script>
</body>
</html>`;

  return renderToString(page);
}
