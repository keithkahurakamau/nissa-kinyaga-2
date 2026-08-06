import { slugify } from './paths.js';

const CATEGORIES = [
  'Masai Mara & Rift Valley',
  'Amboseli & Tsavo',
  'Laikipia & the North',
  'Mount Kenya',
  'Coast',
];

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validatePackage(pkg) {
  const problems = [];
  const id = pkg?.slug ?? '(no slug)';
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
  }
  if (!nonEmptyString(pkg?.priceKey)) fail('priceKey is required');
  if (!nonEmptyString(pkg?.hero)) fail('hero asset path is required');
  if (!nonEmptyString(pkg?.heroAlt) || pkg.heroAlt.trim().length < 15) {
    fail('heroAlt is required and must describe the frame (>= 15 chars)');
  }
  if (!nonEmptyString(pkg?.summary)) fail('summary is required');
  else if (pkg.summary.length > 200) fail('summary must be <= 200 characters');
  if (!Array.isArray(pkg?.overview) || pkg.overview.length < 2) {
    fail('overview must have at least 2 paragraphs');
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
  if (!Array.isArray(pkg?.included) || pkg.included.length < 4) fail('included needs >= 4 items');
  if (!Array.isArray(pkg?.excluded) || pkg.excluded.length < 3) fail('excluded needs >= 3 items');
  if (!nonEmptyString(pkg?.bestTime)) fail('bestTime is required');
  if (!Array.isArray(pkg?.faqs) || pkg.faqs.length < 3 || pkg.faqs.length > 5) {
    fail('faqs must number between 3 and 5');
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
  const id = dest?.slug ?? '(no slug)';
  const fail = (msg) => problems.push(`${id}: ${msg}`);

  for (const field of ['slug', 'name', 'shortName', 'hero', 'summary', 'bestTime', 'gettingThere']) {
    if (!nonEmptyString(dest?.[field])) fail(`${field} is required`);
  }
  if (!nonEmptyString(dest?.heroAlt) || dest.heroAlt.trim().length < 15) {
    fail('heroAlt is required and must describe the frame (>= 15 chars)');
  }
  if (!Array.isArray(dest?.overview) || dest.overview.length < 2) {
    fail('overview must have at least 2 paragraphs');
  }
  if (!Array.isArray(dest?.wildlife) || dest.wildlife.length < 3) {
    fail('wildlife needs >= 3 entries');
  }
  return problems;
}

export function assertAllValid(items, validator, label) {
  const problems = items.flatMap((item) => validator(item));
  if (problems.length > 0) {
    throw new Error(`Invalid ${label} data:\n  ${problems.join('\n  ')}`);
  }
}
