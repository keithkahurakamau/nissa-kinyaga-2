import { html } from '../lib/html.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { breadcrumbNav, whatsappLink, sectionHeading, ctaBlock } from './partials.js';
import site from '../data/site.js';
import reviews from '../data/reviews.js';
import {
  guideCredentials,
  companyCredentials,
  verified,
  activePlatforms,
  internationalAssurance,
} from '../data/credentials.js';

const DESCRIPTION =
  'Guest reviews of Nissa Safaris, the guiding qualifications behind every trip, and how to leave a review after you travel.';

export function metaDescription() {
  const text = DESCRIPTION.trim();
  if (escapedLength(text) <= MAX_DESCRIPTION) return text;
  return truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

function credentialCard(entry) {
  return html`<div class="cred">
  <h3 class="h3">${entry.name}</h3>
  <p class="cred-body">${entry.bodyUrl
    ? html`<a href="${entry.bodyUrl}" target="_blank" rel="noopener noreferrer">${entry.body}</a>`
    : entry.body}${entry.reference ? html` · ${entry.reference}` : ''}</p>
  <p class="body">${entry.detail}</p>
  ${entry.source
    ? html`<p class="cred-source">Independently reported by
        <a href="${entry.source.url}" target="_blank" rel="noopener noreferrer">${entry.source.title}</a>.</p>`
    : ''}
</div>`;
}

// Only `verified: true` entries reach the page. Everything in
// data/credentials.js is gated this way on purpose, see the editorial rule at
// the top of that file: an unverified licence claim must not render even if
// every other field on it is filled in.
function credentialsSection() {
  const guide = verified(guideCredentials);
  const company = verified(companyCredentials);
  if (!guide.length && !company.length) return '';

  return html`<section class="section-alt">
  <div class="wrap">
    ${sectionHeading({ number: '01', eyebrow: 'Quality assurance', heading: 'Qualifications behind the trip' })}
    ${guide.length
      ? html`<h3 class="cred-group">Guiding qualifications</h3>
          <div class="cred-grid">${guide.map((entry) => credentialCard(entry))}</div>`
      : ''}
    ${company.length
      ? html`<h3 class="cred-group">Company registration and licensing</h3>
          <div class="cred-grid">${company.map((entry) => credentialCard(entry))}</div>`
      : ''}
    <p class="body cred-note">${internationalAssurance}</p>
  </div>
</section>`;
}

// Renders nothing while data/reviews.js is empty, which it is until real
// guests send them. Never seed this with sample reviews.
function publishedReviewsSection() {
  if (!reviews.length) return '';
  const cards = reviews.map(
    (review) => html`<figure class="review">
  <div class="review-stars" aria-label="${String(review.rating)} out of 5">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
  <blockquote class="review-body">${review.body}</blockquote>
  <figcaption class="review-by">
    ${review.name}${review.country ? html` · ${review.country}` : ''}
    ${review.trip ? html`<span class="review-trip">${review.trip}</span>` : ''}
  </figcaption>
</figure>`,
  );
  return html`<section class="section">
  <div class="wrap">
    ${sectionHeading({ number: '02', eyebrow: 'Guest reviews', heading: 'In their words' })}
    <div class="review-grid">${cards}</div>
  </div>
</section>`;
}

// Platforms with no URL are filtered out rather than linked: a review link
// that 404s costs more trust than an absent badge.
function platformsSection() {
  const platforms = activePlatforms();
  if (!platforms.length) return '';
  const links = platforms.map(
    (platform) => html`<a class="btn btn-ink" href="${platform.url}" target="_blank" rel="noopener noreferrer">${platform.cta}</a>`,
  );
  return html`<section class="section">
  <div class="wrap wrap-narrow">
    <h2 class="h2">Reviews elsewhere</h2>
    <p class="body">Nissa Safaris is listed on the review platforms below. Reviews there are written and moderated by the platform, not by us.</p>
    <div class="platform-links">${links}</div>
  </div>
</section>`;
}

// Same delivery model as the enquiry form on /contact/: this is a static site
// with no backend, so app.js composes the answers into a message and hands it
// to WhatsApp or email. Nothing is stored here, which is also what
// /privacy/ promises.
function reviewForm() {
  return html`<div id="nk-review-wrap">
  <form id="nk-review-form" class="form">
    <div class="field">
      <label class="field-label" for="nk-rv-name">Your name</label>
      <input id="nk-rv-name" name="name" type="text" class="field-input" required autocomplete="name">
    </div>
    <div class="field">
      <label class="field-label" for="nk-rv-country">Where you travelled from</label>
      <input id="nk-rv-country" name="country" type="text" class="field-input" autocomplete="country-name">
    </div>
    <div class="field">
      <label class="field-label" for="nk-rv-trip">Which safari did you take?</label>
      <input id="nk-rv-trip" name="trip" type="text" class="field-input" placeholder="e.g. 3-Day Masai Mara Classic">
    </div>
    <fieldset class="field">
      <legend class="field-label">Your rating</legend>
      <div class="rating-row" id="nk-rv-rating">
        ${[5, 4, 3, 2, 1].map(
          (n) => html`<label class="rating-opt">
        <input type="radio" name="rating" value="${String(n)}"${n === 5 ? html` checked` : ''}>
        <span>${String(n)} star${n === 1 ? '' : 's'}</span>
      </label>`,
        )}
      </div>
    </fieldset>
    <div class="field">
      <label class="field-label" for="nk-rv-body">Your review</label>
      <textarea id="nk-rv-body" name="body" rows="5" class="field-textarea" required placeholder="What stood out? What would you tell someone considering the same trip?"></textarea>
    </div>
    <label class="field-check" for="nk-rv-consent">
      <input id="nk-rv-consent" type="checkbox" name="consent" required>
      I'm happy for this review and my first name to be published on this site.
    </label>
    <button type="submit" class="btn btn-gold form-submit">Send your review</button>
  </form>
</div>`;
}

function leaveReviewSection() {
  return html`<section class="section-alt">
  <div class="wrap">
    <div class="grid-2">
      <div>
        <h2 class="h2">Travelled with us? Tell us how it went</h2>
        <p class="lede">Reviews are how a freelance guide gets found, and honest ones are worth more than flattering ones. If something fell short, say so, it goes straight to ${site.guide}.</p>
        <p class="body">Your review is sent to Nissa on WhatsApp or by email. Nothing is stored on this website, and nothing is published unless you tick the box to allow it. See our <a href="/privacy/">privacy note</a>.</p>
        <div class="contact-actions">
          <a href="${whatsappLink()}" target="_blank" rel="noopener noreferrer" class="btn btn-gold">Send it on WhatsApp instead</a>
          <a href="mailto:${site.email}?subject=Review%20of%20my%20safari" class="btn btn-outline">Email it</a>
        </div>
      </div>
      ${reviewForm()}
    </div>
  </div>
</section>`;
}

/**
 * Renders /reviews/: the verified qualifications behind the trips, any live
 * third-party review platforms, published guest reviews, and a form for
 * guests to send their own.
 *
 * Three of the four sections are data-gated and render nothing while their
 * source data is empty (no verified company licences, no review platform
 * URLs, no published reviews), so this page is correct today and grows as
 * the client supplies evidence. See data/credentials.js and data/reviews.js.
 *
 * @returns {string} the complete HTML document
 */
export function reviewsPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Reviews', path: '/reviews/' },
  ];

  const body = html`<main id="main">
  <header class="section">
    <div class="wrap">
      ${breadcrumbNav(crumbs)}
      <h1 class="display">Reviews and credentials</h1>
      <p class="lede">What guests say after travelling with ${site.guide}, the qualifications behind the guiding, and how to leave a review of your own.</p>
    </div>
  </header>
  ${credentialsSection()}
  ${publishedReviewsSection()}
  ${platformsSection()}
  ${leaveReviewSection()}
  ${ctaBlock({
    heading: 'Planning a safari?',
    body: 'Tell Nissa your dates and what you hope to see, and he will put an itinerary together around them.',
  })}
</main>`;

  return layout({
    title: 'Reviews & Credentials | Nissa Safaris',
    description: metaDescription(),
    path: '/reviews/',
    crumbs,
    body,
  });
}
