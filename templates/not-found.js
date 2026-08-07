import { html } from '../lib/html.js';
import { layout } from './layout.js';
import { whatsappLink } from './partials.js';

const DESCRIPTION =
  'That page could not be found. Browse the Kenya safari packages, the destinations, or get in touch with Nissa Safaris directly.';

/**
 * Renders the 404 page. Vercel serves `/404.html` from the output root for any
 * unmatched path, so this is emitted as a file rather than a directory and is
 * deliberately kept out of the sitemap (build.js only lists paths ending "/").
 *
 * It carries `noindex` — a soft 404 in the index is worse than none at all —
 * and points at the three places a lost visitor most likely wanted.
 *
 * @returns {string} the complete HTML document
 */
export function notFoundPage() {
  return layout({
    title: 'Page not found | Nissa Safaris',
    description: DESCRIPTION,
    path: '/404.html',
    robots: 'noindex, follow',
    body: html`<main id="main">
  <section class="section section-notfound">
    <div class="wrap wrap-narrow">
      <p class="eyebrow">Error 404</p>
      <h1 class="display">This page has wandered off</h1>
      <p class="lede">
        The link may be old, or the address slightly off. Nothing is broken on
        your side. Here is where most people are heading:
      </p>
      <div class="notfound-links">
        <a class="btn btn-gold" href="/safaris/">See all safaris</a>
        <a class="btn btn-ink" href="/destinations/">Browse destinations</a>
        <a class="btn btn-ink" href="/">Back to the home page</a>
      </div>
      <p class="body notfound-help">
        Still stuck, or looking for something specific? Message Nissa on
        <a href="${whatsappLink()}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        or <a href="/contact/">send an enquiry</a>, and he will point you to the
        right trip.
      </p>
    </div>
  </section>
</main>`,
  });
}
