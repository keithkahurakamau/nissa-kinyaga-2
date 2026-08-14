import { mkdir, rm, writeFile, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import packages from './data/packages.js';
import destinations from './data/destinations.js';
import journeys from './data/journeys.js';
import { validatePackage, validateDestination, validateCountry, assertAllValid } from './lib/validate.js';
import { outputPath, ORIGIN } from './lib/paths.js';
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
  await cp(join(ROOT, 'styles.css'), join(DIST, 'styles.css'));
  await cp(join(ROOT, 'app.js'), join(DIST, 'app.js'));

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
