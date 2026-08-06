import { mkdir, rm, writeFile, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import packages from './data/packages.js';
import destinations from './data/destinations.js';
import { validatePackage, validateDestination, assertAllValid } from './lib/validate.js';
import { outputPath } from './lib/paths.js';
import { packagePage } from './templates/package.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

export function pages() {
  assertAllValid(packages, validatePackage, 'package');
  assertAllValid(destinations, validateDestination, 'destination');

  const out = [];
  for (const pkg of packages) {
    out.push({ path: `/safaris/${pkg.slug}/`, html: packagePage(pkg) });
  }
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
