// The installable-app layer: the web app manifest, and the build-time
// substitution that turns the readable sw.js in the repo root into the
// worker that actually ships.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import site from '../data/site.js';
import { HASHED } from './assets.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * What the worker installs up front, before the visitor has asked for
 * anything.
 *
 * Kept deliberately small. Most people who load this site are on a phone on
 * Kenyan mobile data, and a service worker that quietly pulls several
 * megabytes of photographs on first visit is spending someone else's money
 * to make a page they may never revisit slightly faster. This is the offline
 * fallback and the two files every page needs; everything else is cached as
 * it is actually visited, which is also what makes the offline copy match
 * what that particular person cared about.
 */
const PRECACHE = [
  '/offline/',
  HASHED['styles.css'],
  HASHED['app.js'],
  '/assets/icon-192.png',
  '/manifest.webmanifest',
];

/**
 * The cache-busting version for the worker's caches.
 *
 * Derived from the two hashed asset URLs plus the worker's own source, so a
 * code change invalidates the caches and a content-only change does not.
 * That distinction is deliberate: wiping the caches on every deploy would
 * throw away the pages a traveller had deliberately opened to have offline,
 * and it buys nothing, because HTML is network-first and an online visitor
 * gets the new page regardless.
 */
function buildVersion(source) {
  return createHash('sha256')
    .update(HASHED['styles.css'] + HASHED['app.js'] + source)
    .digest('hex')
    .slice(0, 12);
}

/**
 * The service worker source, with its two build-time placeholders filled in.
 *
 * @returns {string} JavaScript, written to /sw.js
 */
export function serviceWorker() {
  const source = readFileSync(join(ROOT, 'sw.js'), 'utf8');
  return source
    .replace("'__BUILD_VERSION__'", JSON.stringify(buildVersion(source)))
    .replace('__PRECACHE__', JSON.stringify(PRECACHE));
}

/**
 * The web app manifest.
 *
 * `display: standalone` rather than `fullscreen`: people navigate this site,
 * and taking the status bar away on a phone hides the clock and the signal
 * indicator from someone who may be watching both.
 *
 * @returns {object}
 */
export function manifest() {
  return {
    id: '/',
    name: `${site.name}, ${site.tagline}`,
    // Not site.name. A home screen label is cut at about twelve characters,
    // and "Nissa Safaris" lands at thirteen, so it truncates to "Nissa
    // Safari", which reads as the browser. The full name is still what the
    // install dialog and the app listing show.
    short_name: 'Nissa',
    description: site.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    // Matches <meta name="theme-color"> in templates/layout.js, and the
    // background the icons are drawn on, so the launch screen does not
    // flash a colour that appears nowhere else on the site.
    theme_color: '#22291E',
    background_color: '#22291E',
    lang: 'en',
    dir: 'ltr',
    categories: ['travel', 'lifestyle'],
    icons: [
      { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // A separate file, not icon-512 again. The logo is a square
      // composition with the "NISSA SAFARIS" wordmark running to its edges,
      // and Android crops maskable icons to a circle or squircle, which cut
      // straight through the lettering. icon-maskable-512 is the circular
      // medallion from the same logo, inset inside the safe zone, so every
      // mask lands on empty black. See scripts/make-icons.py.
      { src: '/assets/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Safaris', short_name: 'Safaris', url: '/safaris/', description: 'Every Kenya itinerary' },
      { name: 'Gallery', short_name: 'Gallery', url: '/gallery/', description: 'Photographs from the field' },
      { name: 'Contact Nissa', short_name: 'Contact', url: '/contact/', description: 'Send an enquiry' },
    ],
  };
}
