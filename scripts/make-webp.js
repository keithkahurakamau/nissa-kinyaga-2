// Generates a `.webp` sibling for every `assets/*.jpg`, via the system
// `cwebp` binary — no npm dependency. `templates/partials.js`'s `picture()`
// checks for these siblings at render time and degrades to a plain `<img>`
// when one is missing, so this script is entirely optional: `npm run build`
// runs it first, but a machine without `cwebp` installed must still produce
// a working (JPEG-only) site, not a failed build.
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, unlinkSync } from 'node:fs';
import { basename, extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ASSETS = join(ROOT, 'assets');

function cwebpAvailable() {
  try {
    execFileSync('cwebp', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function outdated(inPath, outPath) {
  try {
    return statSync(outPath).mtimeMs < statSync(inPath).mtimeMs;
  } catch {
    return true; // outPath doesn't exist yet
  }
}

/**
 * Drops a WebP that is no smaller than the JPEG it came from.
 *
 * `picture()` in templates/partials.js always prefers the WebP when a
 * sibling exists, so a larger WebP is not a neutral extra file: it is the
 * file every visitor downloads instead of the smaller one. A handful of
 * sources (already-optimised JPEGs, and wide low-detail frames like the
 * group photograph) encode bigger at -q 85 than the original, and the right
 * answer for those is no sibling at all, which `picture()` handles by
 * degrading to a plain <img>.
 *
 * @returns {boolean} true if the WebP was removed
 */
function dropIfNotSmaller(inPath, outPath) {
  try {
    const source = statSync(inPath).size;
    const encoded = statSync(outPath).size;
    if (encoded < source) return false;
    unlinkSync(outPath);
    return true;
  } catch {
    return false;
  }
}

function main() {
  if (!cwebpAvailable()) {
    console.log('cwebp not found — skipping WebP generation (install with: sudo apt install webp)');
    return;
  }

  const jpgs = readdirSync(ASSETS).filter((file) => extname(file).toLowerCase() === '.jpg');
  let written = 0;
  let skipped = 0;
  let dropped = 0;

  for (const file of jpgs) {
    const inPath = join(ASSETS, file);
    const outPath = join(ASSETS, `${basename(file, extname(file))}.webp`);

    if (!outdated(inPath, outPath)) {
      // Still checked, so a WebP generated before this rule existed is
      // cleaned up rather than living on because it looks up to date.
      if (dropIfNotSmaller(inPath, outPath)) {
        dropped += 1;
        console.log(`webp: dropped ${basename(outPath)}, larger than the JPEG`);
      } else {
        skipped += 1;
      }
      continue;
    }

    try {
      // -q 82 -> 85. 88 was tried first: on the sharpened source it pushed
      // the full asset set from 6.59 MB to 9.66 MB (+47%) for a result that
      // was not visibly different from 85 in a side-by-side crop (checked
      // on p08.jpg, a wildlife close-up, and p18.jpg, a wide landscape with
      // sky). 85 lands at 8.51 MB (+29%), a smaller jump that still reads
      // more solid than the original 82 output on fine texture (fur,
      // foliage) at normal viewing sizes.
      execFileSync('cwebp', ['-q', '85', inPath, '-o', outPath], { stdio: 'ignore' });
      if (dropIfNotSmaller(inPath, outPath)) {
        dropped += 1;
        console.log(`webp: ${file} encodes larger than the JPEG, keeping the JPEG only`);
      } else {
        written += 1;
        console.log(`webp: ${file} -> ${basename(outPath)}`);
      }
    } catch (err) {
      // A single bad/corrupt source image shouldn't take down the build —
      // report it and keep going with the rest of the set.
      console.warn(`webp: failed to convert ${file}: ${err.message}`);
    }
  }

  console.log(`WebP generation complete: ${written} written, ${skipped} up to date, ${dropped} dropped as larger than source, ${jpgs.length} total.`);
}

main();
