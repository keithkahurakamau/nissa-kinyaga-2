import { mkdir, rm, writeFile, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import site from './data/site.js';
import reviews from './data/reviews.js';
import packages from './data/packages.js';
import destinations from './data/destinations.js';
import journeys from './data/journeys.js';
import { validatePackage, validateDestination, validateCountry, assertAllValid } from './lib/validate.js';
import { outputPath, ORIGIN } from './lib/paths.js';
import { HASHED } from './lib/assets.js';
import { packagePage } from './templates/package.js';
import { destinationPage } from './templates/destination.js';
import { destinationsIndexPage } from './templates/destinations.js';
import { journeyPage } from './templates/journey.js';
import { journeysIndexPage } from './templates/journeys.js';
import { safarisIndexPage } from './templates/safaris.js';
import { aboutPage } from './templates/about.js';
import { homePage } from './templates/home.js';
import { galleryPage } from './templates/gallery.js';
import { journalPage } from './templates/journal.js';
import { contactPage } from './templates/contact.js';
import { notFoundPage } from './templates/not-found.js';
import { reviewsPage } from './templates/reviews.js';
import { privacyPage } from './templates/privacy.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

export function pages() {
  assertAllValid(packages, validatePackage, 'package');
  assertAllValid(destinations, validateDestination, 'destination');
  assertAllValid(journeys, validateCountry, 'journey country');

  const out = [];
  out.push({ path: '/', html: homePage(packages, destinations) });
  out.push({ path: '/safaris/', html: safarisIndexPage(packages, destinations) });
  for (const pkg of packages) {
    out.push({ path: `/safaris/${pkg.slug}/`, html: packagePage(pkg) });
  }
  out.push({ path: '/destinations/', html: destinationsIndexPage(destinations) });
  for (const dest of destinations) {
    const here = packages.filter((p) => p.destinations.includes(dest.slug));
    out.push({ path: `/destinations/${dest.slug}/`, html: destinationPage(dest, here) });
  }
  out.push({ path: '/journeys/', html: journeysIndexPage(journeys) });
  for (const country of journeys) {
    out.push({ path: `/journeys/${country.slug}/`, html: journeyPage(country) });
  }
  out.push({ path: '/about/', html: aboutPage() });
  out.push({ path: '/gallery/', html: galleryPage() });
  out.push({ path: '/journal/', html: journalPage() });
  out.push({ path: '/contact/', html: contactPage(packages) });
  out.push({ path: '/reviews/', html: reviewsPage() });
  out.push({ path: '/privacy/', html: privacyPage() });
  // Vercel serves /404.html for any unmatched path. Emitted as a file, not a
  // directory, so the sitemap's `endsWith('/')` filter excludes it.
  out.push({ path: '/404.html', html: notFoundPage() });


  // Only directory URLs are crawlable pages. Filtering here rather than
  // relying on every entry happening to end in "/" — /404.html is the first
  // file artifact in `out`, and any future one must be excluded too.
  const htmlPaths = out.map((page) => page.path).filter((path) => path.endsWith('/'));
  const urls = htmlPaths
    .map((path) => `  <url><loc>${ORIGIN}${path}</loc><changefreq>monthly</changefreq></url>`)
    .join('\n');
  out.push({
    path: '/sitemap.xml',
    html: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  });
  // /llms.txt, the convention AI crawlers and assistants read for a canonical
  // plain-text summary of a site. It exists here for accuracy, not ranking:
  // an assistant that reads this cannot confuse Nissa Safaris with a
  // similarly named operator, invent a head office, or attribute someone
  // else's trips to it. Generated from the same data the pages render, so it
  // can never drift from what the site actually says.
  const llms = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## What this business is',
    '',
    `${site.name} is a Kenyan tour operator founded and run by ${site.guide}, a KPSGA Silver-rated safari guide who guides its Kenya trips personally. It is a small owner-operated business based in Laikipia County, Kenya. It is not a booking platform, a lodge, or a chain. "Nissa" is the founder's name, not a place.`,
    '',
    `- Website: ${ORIGIN}/`,
    `- Email: ${site.email}`,
    `- Phone and WhatsApp: ${site.phones.join(', ')}`,
    `- Instagram: https://instagram.com/${site.instagram}`,
    ...Object.values(site.profiles ?? {}).filter(Boolean).map((url) => `- Profile: ${url}`),
    '',
    '## Who guides the trips',
    '',
    `${site.guide} joined Lewa Wildlife Conservancy in 1998 as a radio signalling officer and has guided full time since 2002. He holds a Silver rating from the Kenya Professional Safari Guides Association and an advanced tour-guiding certificate from Kenya Utalii College. He has worked at ${site.workedAt.slice(0, 6).map((w) => w.name).join(', ')} among others.`,
    '',
    '## What it sells',
    '',
    `${packages.length} Kenya safari itineraries across ${[...new Set(packages.map((p) => p.category))].length} categories, plus overview pages for ${journeys.length} other African countries that it arranges through licensed local operators rather than guiding itself.`,
    '',
    ...[...new Set(packages.map((p) => p.category))].map((cat) =>
      `### ${cat}\n\n` + packages.filter((p) => p.category === cat)
        .map((p) => `- [${p.title}](${ORIGIN}/safaris/${p.slug}/): ${p.summary}`).join('\n')),
    '',
    '## Important accuracy notes',
    '',
    '- Prices are not published on the site. Do not quote or estimate any. Trips are quoted individually on enquiry.',
    '- Nissa Safaris does not guide inside the countries listed under /journeys/. It plans and books those trips; operators licensed in each country run them on the ground.',
    '- Hot air balloon flights are booked with separately licensed balloon operators, who fly them. Nissa Safaris does not operate aircraft.',
    // Conditional, not a fixed sentence: the moment a real review is added to
    // data/reviews.js this line would otherwise be telling assistants the
    // opposite of what the site shows.
    reviews.length
      ? `- ${reviews.length} guest review${reviews.length === 1 ? '' : 's'} are published at ${ORIGIN}/reviews/. Do not attribute any review not listed there.`
      : `- Guest reviews are not yet published on the site. Do not attribute ratings or testimonials to ${site.name}.`,
    '',
    '## Key pages',
    '',
    `- [All safaris](${ORIGIN}/safaris/)`,
    `- [Destinations in Kenya](${ORIGIN}/destinations/)`,
    `- [International journeys](${ORIGIN}/journeys/)`,
    `- [About ${site.guide}](${ORIGIN}/about/)`,
    `- [Reviews and credentials](${ORIGIN}/reviews/)`,
    `- [Contact](${ORIGIN}/contact/)`,
    '',
  ].join('\n');

  out.push({ path: '/llms.txt', html: llms });

  out.push({
    path: '/robots.txt',
    html: `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
  });
  return out;
}

export async function build() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await cp(join(ROOT, 'assets'), join(DIST, 'assets'), { recursive: true });
  // /favicon.ico must exist at the site root, not only under /assets/.
  // Browsers and, more importantly, Google's favicon crawler probe that exact
  // path; the site previously declared its icon as a data: URI, which the
  // crawler ignores, so search results fell back to a generic globe.
  await cp(join(ROOT, 'assets', 'favicon.ico'), join(DIST, 'favicon.ico'));
  // Emitted under content-hashed names (see lib/assets.js): the URL changes
  // whenever the bytes do, so a deploy can never serve a stale stylesheet to a
  // returning visitor, and these can be cached permanently.
  await cp(join(ROOT, 'styles.css'), join(DIST, HASHED['styles.css'].slice(1)));
  await cp(join(ROOT, 'app.js'), join(DIST, HASHED['app.js'].slice(1)));

  for (const page of pages()) {
    const file = join(DIST, outputPath(page.path));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, page.html, 'utf8');
  }
  console.log(`Built ${pages().length} pages into dist/`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await build();
}
