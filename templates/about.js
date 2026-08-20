import { html } from '../lib/html.js';
import { personSchema } from '../lib/seo.js';
import { MAX_DESCRIPTION, escapedLength, truncateToEscapedLimit } from '../lib/text.js';
import { layout } from './layout.js';
import { ctaBlock, breadcrumbNav, sectionHeading, picture } from './partials.js';
import site from '../data/site.js';
import { guideCredentials, verified } from '../data/credentials.js';
import about from '../data/about.js';

// Authored well clear of the 50-165 (escaped) char range; truncateToEscapedLimit
// is a safety net for escaping inflation (apostrophes -> `&#39;`), matching
// the pattern in templates/destination.js and templates/package.js.
const DESCRIPTION =
  'Nissa Ole Kinyaga has guided across Kenya since 2002: Lewa, Sirikoi, Borana and beyond. Maasai heritage, Utalii College distinction, founder of Nissa Safaris.';

export function metaDescription() {
  const text = DESCRIPTION.trim();
  const len = escapedLength(text);
  if (len <= MAX_DESCRIPTION) return text;
  return truncateToEscapedLimit(text, MAX_DESCRIPTION);
}

// Holds only the portrait image, see the .about-hero note in styles.css on
// why no text content is ever nested inside this element.
function heroSection() {
  return html`<div class="about-hero">
  ${picture({ src: site.portrait, alt: 'Nissa Ole Kinyaga, founder and lead guide of Nissa Safaris', lazy: false })}
</div>`;
}

function titleSection(crumbs) {
  return html`<header class="section">
  <div class="wrap">
    ${breadcrumbNav(crumbs)}
    <h1 class="display">Nissa Ole Kinyaga</h1>
    <p class="lede">Safari guide and founder of Nissa Safaris, freelance across Kenya's private conservancies and community lodges, with Maasai heritage at the centre of every itinerary.</p>
    <div class="stat-row">
      <div>
        <div class="stat-num">20+</div>
        <div class="stat-label">Years in the field</div>
      </div>
      <div>
        <div class="stat-num">1998</div>
        <div class="stat-label">Joined Lewa Wildlife Conservancy</div>
      </div>
    </div>
  </div>
</header>`;
}

function originsSection() {
  const paragraphs = about.origins.map((para) => html`<p class="body">${para}</p>`);
  const quote = about.quotes[0];
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    ${sectionHeading({ number: '01', eyebrow: 'Origins', heading: 'Born of the forest' })}
    ${paragraphs}
    <blockquote class="pull-quote">
      <p class="quote">${quote.text}</p>
      <cite class="cite">${quote.cite}</cite>
    </blockquote>
  </div>
</section>`;
}

function trainingSection() {
  const items = about.training.map(
    (entry) => html`<li class="career-item">
      <span class="career-period">${entry.year}</span>
      <p class="body">${entry.body}</p>
    </li>`,
  );
  return html`<section class="section">
  <div class="wrap-narrow">
    ${sectionHeading({ number: '02', eyebrow: 'Training', heading: 'The formal foundation' })}
    <ul class="career-timeline">
      ${items}
    </ul>
  </div>
</section>`;
}

function careerSection() {
  const items = about.career.map(
    (entry) => html`<li class="career-item">
      <span class="career-period">${entry.period}</span>
      <h3 class="h3">${entry.title}</h3>
      <p class="body">${entry.body}</p>
    </li>`,
  );
  return html`<section class="section-alt">
  <div class="wrap-narrow">
    ${sectionHeading({ number: '03', eyebrow: 'Career', heading: 'Two decades, tracked step by step' })}
    <ul class="career-timeline">
      ${items}
    </ul>
  </div>
</section>`;
}

function workedAtSection() {
  const items = site.workedAt.map(
    (place) => html`<div class="worked-item">
      <h3 class="worked-name">${place.name}</h3>
      <p class="worked-role">${place.role}</p>
    </div>`,
  );
  return html`<section class="section">
  <div class="wrap">
    ${sectionHeading({ number: '04', eyebrow: 'Record', heading: 'Where I have guided' })}
    <div class="worked-grid">
      ${items}
    </div>
  </div>
</section>`;
}

// Verified guiding qualifications only, read straight from
// data/credentials.js so an unverified entry cannot appear here either.
// Links through to /reviews/ where the full list and the sources live.
function credentialsSection() {
  const entries = verified(guideCredentials);
  if (!entries.length) return '';
  const items = entries.map(
    (entry) => html`<div class="worked-item">
      <h3 class="worked-name">${entry.name}</h3>
      <p class="worked-role">${entry.body}</p>
    </div>`,
  );
  return html`<section class="section-alt">
  <div class="wrap">
    ${sectionHeading({ number: '05', eyebrow: 'Qualifications', heading: 'Certified guiding' })}
    <div class="worked-grid">
      ${items}
    </div>
    <p class="body cred-note">Both are examined qualifications rather than memberships. The full detail, including the independent sources that report them, is on the <a href="/reviews/">reviews and credentials</a> page.</p>
  </div>
</section>`;
}

function expertiseSection() {
  const items = about.expertise.map(
    (entry, i) => html`<div class="expertise-item">
      <span class="expertise-num">${String(i + 1).padStart(2, '0')}</span>
      <h3 class="h3">${entry.title}</h3>
      <p class="body">${entry.body}</p>
    </div>`,
  );
  return html`<section class="section-alt">
  <div class="wrap">
    ${sectionHeading({ number: '05', eyebrow: 'Wildlife expertise', heading: 'What I read in the field' })}
    <div class="expertise-grid">
      ${items}
    </div>
  </div>
</section>`;
}

function servicesSection() {
  const items = about.services.map((service) => html`<div class="service-item">${service}</div>`);
  return html`<section class="section">
  <div class="wrap">
    ${sectionHeading({ number: '06', eyebrow: 'What I arrange', heading: 'Delivered to my utmost good faith' })}
    <div class="services-grid">
      ${items}
    </div>
  </div>
</section>`;
}

// IWACO-KENYA, a Laikipia community organisation the site points visitors to.
//
// WORDING RULE. The description below is drawn from the organisation's own
// site and states what IWACO does, not what Nissa Safaris does with them.
// No donation, percentage, formal partnership or programme is claimed here,
// because none has been recorded. If a specific arrangement exists, add it
// explicitly rather than letting a reader infer one; "we support" is doing
// enough work as it is, and inventing a figure would be worse than silence.
function iwacoSection() {
  return html`<section class="section">
  <div class="wrap">
    ${sectionHeading({ number: '09', eyebrow: 'Community', heading: 'IWACO-KENYA' })}
    <div class="partner">
      <a class="partner-mark" href="https://iwacokenya.org" target="_blank" rel="noopener noreferrer">
        ${picture({
          src: '/assets/iwaco-logo.png',
          alt: 'IWACO-KENYA logo: a map of Kenya with a mother and child, ringed by the words Indigenous Women and Children Organization',
        })}
      </a>
      <div class="partner-body">
        <p class="lede">The Indigenous Women and Children Organization-Kenya works in Laikipia County, the same country Nissa spent years guiding at Borana, Lewa and Il Ngwesi.</p>
        <p class="body">Registered as a community-based organisation in 2024 and run out of Nanyuki, IWACO-KENYA works on child protection and alternative family care, economic empowerment and financial literacy for indigenous women, and support for survivors of gender-based violence. Its climate work runs alongside that: restoring rangeland, clearing invasive species and building up beekeeping and small-scale agriculture as income that does not depend on the rains.</p>
        <p class="body">That last part is the piece a safari guest will recognise. The rangeland IWACO is restoring is the same grazing that carries the wildlife people come to Laikipia to see, and the households doing the restoring are the ones who decide whether it holds.</p>
        <a class="btn btn-gold" href="https://iwacokenya.org" target="_blank" rel="noopener noreferrer">Visit IWACO-KENYA</a>
      </div>
    </div>
  </div>
</section>`;
}

function philosophySection() {
  const items = about.philosophy.map(
    (entry) => html`<div class="philosophy-item">
      <h3>${entry.title}</h3>
      <p>${entry.body}</p>
    </div>`,
  );
  const quote = about.quotes[1];
  return html`<section class="section-forest">
  ${picture({ src: '/assets/giraffe.jpg', alt: '', className: 'photo-bg', ariaHidden: true })}
  <div class="photo-overlay"></div>
  <div class="wrap photo-content">
    ${sectionHeading({ number: '07', eyebrow: 'My safari philosophy', heading: 'A safari should leave the wild better than it found it.' })}
    <div class="philosophy-grid">
      ${items}
    </div>
    <blockquote class="pull-quote-center">
      <p class="quote">${quote.text}</p>
      <cite class="cite">${quote.cite}</cite>
    </blockquote>
  </div>
</section>`;
}

/**
 * Renders the About page: Nissa's own biography, sourced from
 * docs/nissa-biography-source.md, and the Person schema the rest of the
 * site's TravelAgency/founder references anchor to.
 *
 * @returns {string} the complete HTML document
 */
export function aboutPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about/' },
  ];

  const body = html`<main id="main">
  ${heroSection()}
  ${titleSection(crumbs)}
  ${originsSection()}
  ${trainingSection()}
  ${careerSection()}
  ${workedAtSection()}
  ${credentialsSection()}
  ${expertiseSection()}
  ${servicesSection()}
  ${philosophySection()}
  ${iwacoSection()}
  ${ctaBlock({
    heading: 'Plan your safari with Nissa',
    body: "Send your travel dates and Nissa will build the itinerary himself, drawing on the conservancies and lodges he knows first-hand.",
  })}
</main>`;

  return layout({
    title: 'About Nissa Ole Kinyaga, Kenya Safari Guide | Nissa Safaris',
    description: metaDescription(),
    path: '/about/',
    image: site.portrait,
    preloadImage: site.portrait,
    type: 'profile',
    crumbs,
    schemas: [personSchema()],
    body,
  });
}
