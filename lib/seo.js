import { html, raw } from './html.js';
import { absoluteUrl } from './paths.js';
import site from '../data/site.js';
import packages from '../data/packages.js';
import journeys from '../data/journeys.js';
import { guideCredentials, verified } from '../data/credentials.js';

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
  // Everything here is checkable against the site's own data. The point of
  // this block is entity resolution: a search engine or an AI assistant
  // reading it should be able to say exactly what this business is, who runs
  // it, where it operates and what it sells, without inferring any of it from
  // a similar-sounding name elsewhere.
  const catalog = [...new Set(packages.map((pkg) => pkg.category))];

  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${site.origin}/#organisation`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    // `disambiguatingDescription` exists for precisely this: telling a
    // consumer of the data apart from things it could be confused with. Nissa
    // Safaris is a one-guide operation, not a large agency, and "Nissa" is the
    // guide rather than a place, which is the confusion worth pre-empting.
    disambiguatingDescription:
      `${site.name} is a Kenyan tour operator founded and run by the safari guide ${site.guide}, who guides its Kenya trips personally. It is a small owner-operated business based in Laikipia, not a booking platform or a chain, and "Nissa" is the founder's name rather than a place or a lodge.`,
    slogan: site.tagline,
    url: `${site.origin}/`,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(site.logo),
      caption: `${site.name} logo`,
    },
    image: absoluteUrl(site.defaultShareImage),
    email: site.email,
    telephone: site.phones[0],
    address: { '@type': 'PostalAddress', addressCountry: 'KE', addressRegion: 'Laikipia' },
    areaServed: [
      { '@type': 'Country', name: 'Kenya' },
      ...journeys.map((country) => ({ '@type': 'Country', name: country.name })),
    ],
    founder: { '@id': `${site.origin}/about/#nissa` },
    employee: { '@id': `${site.origin}/about/#nissa` },
    contactPoint: site.phones.map((phone) => ({
      '@type': 'ContactPoint',
      telephone: phone,
      email: site.email,
      contactType: 'reservations',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Swahili', 'Maa'],
    })),
    // Only profiles actually supplied (data/site.js `profiles`) are listed;
    // an empty string would otherwise emit a broken identity claim.
    sameAs: [
      `https://instagram.com/${site.instagram}`,
      ...Object.values(site.profiles ?? {}).filter(Boolean),
    ],
    knowsLanguage: ['en', 'sw'],
    // Topical breadth, drawn from what the site actually covers rather than
    // stuffed with terms it does not serve.
    knowsAbout: [
      'Kenya safari', 'Safari guiding', 'Wildlife photography safaris',
      'Masai Mara wildebeest migration', 'Big Five safaris', 'Black rhino conservation',
      'Walking safaris', 'Night game drives', 'Birdwatching in Kenya',
      'Hot air balloon safaris', 'Laikipia conservancies', 'Samburu special five',
      'Mount Kenya trekking', 'Diani Beach', 'Honeymoon safaris',
      'Family safaris', 'Conservation tourism', 'Maasai culture',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Kenya safari itineraries',
      itemListElement: catalog.map((category) => ({
        '@type': 'OfferCatalog',
        name: category,
        itemListElement: packages
          .filter((pkg) => pkg.category === category)
          .map((pkg) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'TouristTrip',
              name: pkg.title,
              url: `${site.origin}/safaris/${pkg.slug}/`,
            },
          })),
      })),
    },
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
    // Built from data/credentials.js rather than hardcoded, so a credential
    // that is not `verified: true` there can never appear in structured data
    // either. The KPSGA Silver rating was previously held back pending
    // confirmation; two published interviews state it independently, which
    // is recorded as `source` on the entry.
    hasCredential: verified(guideCredentials).map((entry) => ({
      '@type': 'EducationalOccupationalCredential',
      name: entry.name,
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: entry.body },
    })),
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
