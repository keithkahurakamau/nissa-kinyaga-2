import { slugify } from './paths.js';

const CATEGORIES = [
  'Masai Mara & Rift Valley',
  'Amboseli & Tsavo',
  'Laikipia & the North',
  'Mount Kenya',
  'Coast',
  'Romance & Honeymoon',
];

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validatePackage(pkg) {
  const problems = [];
  const id = (pkg?.slug && pkg.slug.trim().length > 0) ? pkg.slug : '(no slug)';
  const fail = (msg) => problems.push(`${id}: ${msg}`);

  if (!nonEmptyString(pkg?.title)) fail('title is required');
  if (!nonEmptyString(pkg?.slug)) fail('slug is required');
  else if (nonEmptyString(pkg?.title) && pkg.slug !== slugify(pkg.title)) {
    fail(`slug "${pkg.slug}" does not match slugify(title) "${slugify(pkg.title)}"`);
  }
  if (!Number.isInteger(pkg?.days) || pkg.days < 1) fail('days must be an integer >= 1');
  if (!Number.isInteger(pkg?.nights) || pkg.nights < 0) fail('nights must be an integer >= 0');
  if (!CATEGORIES.includes(pkg?.category)) fail(`category must be one of: ${CATEGORIES.join(', ')}`);
  if (!Array.isArray(pkg?.destinations) || pkg.destinations.length === 0) {
    fail('destinations must be a non-empty array of destination slugs');
  } else {
    pkg.destinations.forEach((dest, i) => {
      if (!nonEmptyString(dest)) fail(`destinations[${i}] must be a non-empty string`);
    });
  }
  if (!nonEmptyString(pkg?.hero)) fail('hero asset path is required');
  if (!nonEmptyString(pkg?.heroAlt) || pkg.heroAlt.trim().length < 15) {
    fail('heroAlt is required and must describe the frame (>= 15 chars)');
  }
  if (!nonEmptyString(pkg?.summary)) fail('summary is required');
  else if (pkg.summary.length > 200) fail('summary must be <= 200 characters');
  if (!Array.isArray(pkg?.overview) || pkg.overview.length < 2) {
    fail('overview must have at least 2 paragraphs');
  } else {
    pkg.overview.forEach((para, i) => {
      if (!nonEmptyString(para)) fail(`overview[${i}] must be a non-empty string`);
    });
  }
  if (!Array.isArray(pkg?.itinerary)) fail('itinerary is required');
  else {
    if (Number.isInteger(pkg?.days) && pkg.itinerary.length !== pkg.days) {
      fail(`itinerary has ${pkg.itinerary.length} entries but days is ${pkg.days}`);
    }
    pkg.itinerary.forEach((entry, i) => {
      if (entry?.day !== i + 1) fail(`itinerary[${i}].day must be ${i + 1}`);
      if (!nonEmptyString(entry?.title)) fail(`itinerary[${i}].title is required`);
      if (!nonEmptyString(entry?.body)) fail(`itinerary[${i}].body is required`);
    });
  }
  if (!Array.isArray(pkg?.included) || pkg.included.length < 4) {
    fail('included needs >= 4 items');
  } else {
    pkg.included.forEach((item, i) => {
      if (!nonEmptyString(item)) fail(`included[${i}] must be a non-empty string`);
    });
  }
  if (!Array.isArray(pkg?.excluded) || pkg.excluded.length < 3) {
    fail('excluded needs >= 3 items');
  } else {
    pkg.excluded.forEach((item, i) => {
      if (!nonEmptyString(item)) fail(`excluded[${i}] must be a non-empty string`);
    });
  }
  if (!nonEmptyString(pkg?.bestTime)) fail('bestTime is required');
  // A content-quality range rather than a technical limit: fewer than three
  // and the section is not worth rendering, many more and nobody reads it.
  // Raised from five to six for the Chogoria traverse, which genuinely has
  // six things worth asking about.
  if (!Array.isArray(pkg?.faqs) || pkg.faqs.length < 3 || pkg.faqs.length > 6) {
    fail('faqs must number between 3 and 6');
  } else {
    pkg.faqs.forEach((faq, i) => {
      if (!nonEmptyString(faq?.q)) fail(`faqs[${i}].q is required`);
      if (!nonEmptyString(faq?.a)) fail(`faqs[${i}].a is required`);
    });
  }
  if (typeof pkg?.signature !== 'boolean') fail('signature must be a boolean');

  return problems;
}

export function validateDestination(dest) {
  const problems = [];
  const id = (dest?.slug && dest.slug.trim().length > 0) ? dest.slug : '(no slug)';
  const fail = (msg) => problems.push(`${id}: ${msg}`);

  for (const field of ['slug', 'name', 'shortName', 'hero', 'summary', 'bestTime', 'gettingThere']) {
    if (!nonEmptyString(dest?.[field])) fail(`${field} is required`);
  }
  if (!nonEmptyString(dest?.heroAlt) || dest.heroAlt.trim().length < 15) {
    fail('heroAlt is required and must describe the frame (>= 15 chars)');
  }
  if (!Array.isArray(dest?.overview) || dest.overview.length < 2) {
    fail('overview must have at least 2 paragraphs');
  } else {
    dest.overview.forEach((para, i) => {
      if (!nonEmptyString(para)) fail(`overview[${i}] must be a non-empty string`);
    });
  }
  if (!Array.isArray(dest?.wildlife) || dest.wildlife.length < 3) {
    fail('wildlife needs >= 3 entries');
  } else {
    dest.wildlife.forEach((entry, i) => {
      if (!nonEmptyString(entry)) fail(`wildlife[${i}] must be a non-empty string`);
    });
  }
  return problems;
}

const JOURNEY_REGIONS = ['Eastern Africa', 'Southern Africa'];

/**
 * Validates a `data/journeys.js` country entry. Deliberately has no fields
 * for itineraries, packages or prices, these are overview-and-enquiry pages
 * only (see docs/LAUNCH-CHECKLIST.md and the project brief): no set trips
 * exist yet for these nine countries, so the data shape itself should make
 * it impossible to accidentally render a fabricated day-by-day itinerary.
 */
export function validateCountry(country) {
  const problems = [];
  const id = (country?.slug && country.slug.trim().length > 0) ? country.slug : '(no slug)';
  const fail = (msg) => problems.push(`${id}: ${msg}`);

  for (const field of [
    'slug', 'region', 'name', 'shortName', 'hero', 'summary',
    'bestTime', 'gettingThere', 'metaTitle', 'metaDescription', 'countryCode',
  ]) {
    if (!nonEmptyString(country?.[field])) fail(`${field} is required`);
  }
  if (!JOURNEY_REGIONS.includes(country?.region)) {
    fail(`region must be one of: ${JOURNEY_REGIONS.join(', ')}`);
  }
  if (!nonEmptyString(country?.countryCode) || !/^[A-Z]{2}$/.test(country?.countryCode ?? '')) {
    fail('countryCode must be a 2-letter ISO 3166-1 alpha-2 code');
  }
  if (!nonEmptyString(country?.heroAlt) || country.heroAlt.trim().length < 15) {
    fail('heroAlt is required and must describe the frame (>= 15 chars)');
  }
  if (!Array.isArray(country?.overview) || country.overview.length < 2) {
    fail('overview must have at least 2 paragraphs');
  } else {
    country.overview.forEach((para, i) => {
      if (!nonEmptyString(para)) fail(`overview[${i}] must be a non-empty string`);
    });
  }
  if (!Array.isArray(country?.highlights) || country.highlights.length < 3) {
    fail('highlights needs >= 3 entries');
  } else {
    country.highlights.forEach((entry, i) => {
      if (!nonEmptyString(entry)) fail(`highlights[${i}] must be a non-empty string`);
    });
  }

  return problems;
}

export function assertAllValid(items, validator, label) {
  const problems = items.flatMap((item) => validator(item));

  // Check for duplicate slugs if items have a slug property
  if (items.length > 0 && items[0]?.slug !== undefined) {
    const slugs = new Map();
    items.forEach((item, i) => {
      if (item?.slug) {
        if (slugs.has(item.slug)) {
          problems.push(`duplicate slug "${item.slug}" at index ${i} (also at index ${slugs.get(item.slug)})`);
        } else {
          slugs.set(item.slug, i);
        }
      }
    });
  }

  if (problems.length > 0) {
    throw new Error(`Invalid ${label} data:\n  ${problems.join('\n  ')}`);
  }
}

