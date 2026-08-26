// Content-hashed URLs for the two files every page loads.
//
// WHY THIS EXISTS. styles.css and app.js used to ship at fixed URLs with a
// one-hour cache. The home hero's image is set in CSS, so for up to an hour
// after every deploy a returning visitor kept the old stylesheet and saw the
// old hero: the site was correct and the browser was showing something else.
// That is not a cache to tune, it is a URL that lies about its contents.
//
// Hashing the filename makes the URL change whenever the bytes change, so a
// new deploy is a new URL that nothing has cached, and the old URL can be
// cached forever without ever going stale. It is the standard fix and it
// removes the whole class of problem rather than shortening the window.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Eight hex characters: ~4 billion values, far past what collision needs here. */
function hashOf(file) {
  return createHash('sha256').update(readFileSync(join(ROOT, file))).digest('hex').slice(0, 8);
}

/**
 * Maps a source filename to its hashed public URL, e.g.
 * "styles.css" -> "/styles.4f2a9c31.css".
 *
 * Computed once at module load: the build reads these files a handful of
 * times and they do not change mid-build.
 */
function hashedName(file) {
  const ext = extname(file);
  return `/${basename(file, ext)}.${hashOf(file)}${ext}`;
}

export const HASHED = {
  'styles.css': hashedName('styles.css'),
  'app.js': hashedName('app.js'),
};

/**
 * An asset URL carrying a content version, e.g.
 * "/assets/icon-192.png" -> "/assets/icon-192.png?v=4f2a9c31".
 *
 * Same reasoning as the hashed filenames above, applied to the icons, where
 * the consequence is worse rather than better. An installed app caches its
 * icon at install time, and Chrome only re-fetches when the manifest it
 * reads has actually changed. With fixed icon URLs, replacing the logo
 * changed the bytes at a URL the browser already had and considered fresh
 * for a day, so an installed app kept showing the old mark with no event
 * that would ever correct it.
 *
 * A query string rather than a renamed file, unlike styles.css: these are
 * copied into dist/ wholesale with the rest of assets/, and hashing the
 * names would mean either duplicating every icon or special-casing the copy.
 * The version changes with the bytes either way, which is the part that
 * matters.
 *
 * Not used for /favicon.ico, which must stay at exactly that path because
 * browsers and Google's favicon crawler probe it directly. It is served
 * `must-revalidate`, so it refreshes on its own.
 *
 * @param {string} url, root-relative, e.g. "/assets/icon-192.png"
 * @returns {string} the same URL with a `?v=` content hash
 */
export function versionedAsset(url) {
  return `${url}?v=${hashOf(url.replace(/^\//, ''))}`;
}
