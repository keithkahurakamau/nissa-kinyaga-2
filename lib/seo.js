import { html, raw } from './html.js';
import { absoluteUrl } from './paths.js';
import site from '../data/site.js';

export function headTags({ title, description, path, image, type = 'website', robots }) {
  const url = absoluteUrl(path);
  const shareImage = absoluteUrl(image ?? site.defaultShareImage);
  return html`<title>${title}</title>
<meta name="description" content="${description}">${robots ? html`
<meta name="robots" content="${robots}">` : ''}
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${shareImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${shareImage}">`;
}

export function jsonLd(object) {
  const serialised = JSON.stringify(object)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  return raw(`<script type="application/ld+json">${serialised}</script>`);
}

export function travelAgencySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${site.origin}/#organisation`,
    name: site.name,
    description: site.description,
    url: `${site.origin}/`,
    logo: absoluteUrl(site.logo),
    image: absoluteUrl(site.defaultShareImage),
    email: site.email,
    telephone: site.phones[0],
    address: { '@type': 'PostalAddress', addressCountry: 'KE', addressRegion: 'Laikipia' },
    areaServed: { '@type': 'Country', name: 'Kenya' },
    founder: { '@id': `${site.origin}/about/#nissa` },
    sameAs: [`https://instagram.com/${site.instagram}`],
    knowsLanguage: ['en', 'sw'],
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.origin}/about/#nissa`,
    name: site.guide,
    jobTitle: 'Safari Guide',
    description: `Kenya safari guide since 2002, with postings at Lewa, Sirikoi and Borana, after joining Lewa Wildlife Conservancy in 1998. Kenya Utalii College distinction; founder of Nissa Safaris.`,
    image: absoluteUrl(site.portrait),
    url: `${site.origin}/about/`,
    nationality: { '@type': 'Country', name: 'Kenya' },
    alumniOf: { '@type': 'EducationalOrganization', name: 'Kenya Utalii College' },
    worksFor: { '@id': `${site.origin}/#organisation` },
    knowsAbout: [
      'Wildlife guiding', 'Ornithology', 'Big cat tracking', 'Walking safaris',
      'Rhino conservation', 'Astronomy', 'Social anthropology',
    ],
    affiliation: site.workedAt.map((w) => ({ '@type': 'Organization', name: w.name })),
    sameAs: [`https://instagram.com/${site.instagram}`],
  };
}

export function touristTripSchema(pkg) {
  const url = `${site.origin}/safaris/${pkg.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.summary,
    url,
    image: absoluteUrl(pkg.hero),
    provider: { '@id': `${site.origin}/#organisation` },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: pkg.itinerary.length,
      itemListElement: pkg.itinerary.map((entry, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'TouristDestination', name: entry.title, description: entry.body },
      })),
    },
  };
}

export function placeSchema(dest) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: dest.name,
    description: dest.summary,
    url: `${site.origin}/destinations/${dest.slug}/`,
    image: absoluteUrl(dest.hero),
    address: { '@type': 'PostalAddress', addressCountry: 'KE' },
    touristType: 'Wildlife and nature travellers',
  };
}

// TouristDestination is a subtype of Place in the schema.org hierarchy, so
// this single @type covers both. Deliberately carries no `offers`/price,
// these are enquiry-only country overview pages (see data/journeys.js).
export function touristDestinationSchema(country) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: country.name,
    description: country.summary,
    url: `${site.origin}/journeys/${country.slug}/`,
    image: absoluteUrl(country.hero),
    address: { '@type': 'PostalAddress', addressCountry: country.countryCode },
    touristType: 'Wildlife and nature travellers',
  };
}

export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqPageSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}
