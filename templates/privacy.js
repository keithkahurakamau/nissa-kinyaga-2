import { html } from '../lib/html.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { breadcrumbNav } from './partials.js';
import site from '../data/site.js';

// Authored well clear of the 50-165 (escaped) char range; truncateToEscapedLimit
// is a safety net for escaping inflation, matching the pattern in
// templates/about.js/destination.js/package.js.
const DESCRIPTION =
  'How Nissa Safaris handles your data — a static site with no backend, no tracking cookies and no third-party analytics by default.';

export function metaDescription() {
  const text = DESCRIPTION.trim();
  const len = escapedLength(text);
  if (len <= MAX_DESCRIPTION) return text;
  return truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

/**
 * Renders the privacy page, migrated from index.html's footer #privacy
 * block and expanded into full sections.
 *
 * @returns {string} the complete HTML document
 */
export function privacyPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Privacy', path: '/privacy/' },
  ];

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">Privacy</h1>
      <p class="lede">Your privacy matters. This is a static website with no backend — here is exactly what that means for your data.</p>
    </div>
  </header>
  <section class="section-alt">
    <div class="wrap-narrow">
      <h2 class="h2">No backend, no server-side storage</h2>
      <p class="body">This site has no backend. It is a static site: every page is built in advance and served as plain HTML, with no database or server-side code that could collect, store or process your personal data.</p>
      <p class="body">When you use the enquiry form on the <a href="/contact/">contact page</a>, your name, email and travel details are not sent to or stored on any server here. They are composed into a message that opens directly in your own WhatsApp or email client for you to send to ${site.guide} yourself, exactly as if you had typed it there. Nothing is sent anywhere until you choose to send it.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap-narrow">
      <h2 class="h2">Cookies and local storage</h2>
      <p class="body">This site sets no advertising or tracking cookies and runs no third-party analytics by default. The only thing stored in your browser is a small preference remembering the choice you make on the privacy notice banner, kept in your browser's local storage rather than a cookie. Any future analytics would only ever run after you explicitly allow it in that banner.</p>
      <p class="body">Fonts are loaded from Google Fonts, which may see your IP address as part of that request; no other third-party service is contacted by this site.</p>
    </div>
  </section>
  <section class="section-alt">
    <div class="wrap-narrow">
      <h2 class="h2">Security</h2>
      <p class="body">The site is served over HTTPS, and its Content-Security-Policy blocks inline scripts and inline styles, so nothing can be injected into a page you're viewing.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap-narrow">
      <h2 class="h2">Questions about your data</h2>
      <p class="body">If you have any question about how this site handles your data, email <a href="mailto:${site.email}">${site.email}</a> or message <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a> directly.</p>
    </div>
  </section>
</main>`;

  return layout({
    title: 'Privacy | Nissa Safaris',
    description: metaDescription(),
    path: '/privacy/',
    crumbs,
    body,
  });
}
