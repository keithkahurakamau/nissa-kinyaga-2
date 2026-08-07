import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToString } from '../lib/html.js';
import {
  headTags, jsonLd, travelAgencySchema, personSchema,
  touristTripSchema, placeSchema, breadcrumbSchema, faqPageSchema,
} from '../lib/seo.js';
import packages from '../data/packages.js';
import destinations from '../data/destinations.js';

const parseLd = (node) => {
  const rendered = renderToString(node);
  const body = rendered.replace(/^<script type="application\/ld\+json">/, '').replace(/<\/script>$/, '');
  return JSON.parse(body);
};

test('headTags emits title, description, canonical and og:url', () => {
  const out = renderToString(headTags({
    title: 'Test Page', description: 'A description.', path: '/safaris/',
  }));
  assert.match(out, /<title>Test Page<\/title>/);
  assert.match(out, /<meta name="description" content="A description\.">/);
  assert.match(out, /<link rel="canonical" href="https:\/\/nissasafaris\.com\/safaris\/">/);
  assert.match(out, /<meta property="og:url" content="https:\/\/nissasafaris\.com\/safaris\/">/);
});

test('headTags escapes quotes in metadata', () => {
  const out = renderToString(headTags({
    title: 'A "quoted" title', description: 'x', path: '/',
  }));
  assert.match(out, /A &quot;quoted&quot; title/);
  assert.doesNotMatch(out, /content="A "quoted"/);
});

test('headTags emits absolute og:image', () => {
  const out = renderToString(headTags({
    title: 't', description: 'd', path: '/', image: '/assets/lion.jpg',
  }));
  assert.match(out, /content="https:\/\/nissasafaris\.com\/assets\/lion\.jpg"/);
});

test('jsonLd escapes angle brackets so it cannot break out of the script tag', () => {
  const out = renderToString(jsonLd({ name: '</script><img onerror=alert(1)>' }));
  assert.doesNotMatch(out, /<\/script><img/);
  assert.match(out, /\\u003c/);
});

test('travelAgencySchema is valid and names the business', () => {
  const schema = travelAgencySchema();
  assert.equal(schema['@type'], 'TravelAgency');
  assert.equal(schema.name, 'Nissa Safaris');
  assert.equal(schema.url, 'https://nissasafaris.com/');
  assert.ok(schema.areaServed);
  assert.ok(Array.isArray(schema.sameAs));
});

test('personSchema names Nissa and lists his affiliations', () => {
  const schema = personSchema();
  assert.equal(schema['@type'], 'Person');
  assert.equal(schema.name, 'Nissa Ole Kinyaga');
  assert.equal(schema.jobTitle, 'Safari Guide');
  assert.ok(schema.worksFor);
  assert.ok(schema.alumniOf);
});

test('touristTripSchema carries an Offer with the package price', () => {
  const schema = touristTripSchema(packages[0]);
  assert.equal(schema['@type'], 'TouristTrip');
  assert.equal(schema.offers['@type'], 'Offer');
  assert.equal(schema.offers.priceCurrency, 'USD');
  assert.ok(Number(schema.offers.price) > 0);
  assert.match(schema.url, /^https:\/\/nissasafaris\.com\/safaris\/.+\/$/);
});

test('touristTripSchema wraps the itinerary in an ItemList of the right length', () => {
  const pkg = packages.find((p) => p.days === 3);
  const { itinerary } = touristTripSchema(pkg);
  assert.equal(itinerary['@type'], 'ItemList');
  assert.equal(itinerary.itemListElement.length, 3);
  assert.equal(itinerary.itemListElement[0]['@type'], 'ListItem');
  assert.equal(itinerary.itemListElement[0].position, 1);
  assert.equal(itinerary.itemListElement[0].item['@type'], 'TouristDestination');
});

test('touristTripSchema uses no properties outside the Trip vocabulary', () => {
  const allowed = new Set([
    '@context', '@type', 'name', 'description', 'url', 'image', 'provider',
    'itinerary', 'offers', 'touristType', 'arrivalTime', 'departureTime',
    'partOfTrip', 'subTrip', 'tripOrigin',
  ]);
  for (const key of Object.keys(touristTripSchema(packages[0]))) {
    assert.ok(allowed.has(key), `"${key}" is not a schema.org Trip/TouristTrip property`);
  }
});

test('travelAgencySchema and personSchema cross-reference the same @ids', () => {
  const agency = travelAgencySchema();
  const person = personSchema();
  assert.equal(person.worksFor['@id'], agency['@id']);
  assert.equal(agency.founder['@id'], person['@id']);
});

test('placeSchema is a TouristAttraction in Kenya', () => {
  const schema = placeSchema(destinations[0]);
  assert.equal(schema['@type'], 'TouristAttraction');
  assert.equal(schema.address.addressCountry, 'KE');
});

test('placeSchema carries the destination name, url and image', () => {
  const schema = placeSchema(destinations[0]);
  assert.equal(schema.name, destinations[0].name);
  assert.match(schema.url, /^https:\/\/nissasafaris\.com\/destinations\/.+\/$/);
  assert.match(schema.image, /^https:\/\/nissasafaris\.com\/assets\//);
});

test('breadcrumbSchema numbers positions from 1', () => {
  const schema = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Safaris', path: '/safaris/' },
  ]);
  assert.equal(schema['@type'], 'BreadcrumbList');
  assert.equal(schema.itemListElement[0].position, 1);
  assert.equal(schema.itemListElement[1].position, 2);
  assert.equal(schema.itemListElement[1].item, 'https://nissasafaris.com/safaris/');
});

test('faqPageSchema maps q/a onto Question/Answer', () => {
  const schema = faqPageSchema([{ q: 'How long?', a: 'Three days.' }]);
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema.mainEntity[0]['@type'], 'Question');
  assert.equal(schema.mainEntity[0].name, 'How long?');
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, 'Three days.');
});
