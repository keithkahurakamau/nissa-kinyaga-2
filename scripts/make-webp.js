// Generates a `.webp` sibling for every `assets/*.jpg`, via the system
// `cwebp` binary — no npm dependency. `templates/partials.js`'s `picture()`
// checks for these siblings at render time and degrades to a plain `<img>`
// when one is missing, so this script is entirely optional: `npm run build`
// runs it first, but a machine without `cwebp` installed must still produce
// a working (JPEG-only) site, not a failed build.
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
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

function main() {
  if (!cwebpAvailable()) {
    console.log('cwebp not found — skipping WebP generation (install with: sudo apt install webp)');
    return;
  }

  const jpgs = readdirSync(ASSETS).filter((file) => extname(file).toLowerCase() === '.jpg');
  let written = 0;
  let skipped = 0;

  for (const file of jpgs) {
    const inPath = join(ASSETS, file);
    const outPath = join(ASSETS, `${basename(file, extname(file))}.webp`);

    if (!outdated(inPath, outPath)) {
      skipped += 1;
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
      written += 1;
      console.log(`webp: ${file} -> ${basename(outPath)}`);
    } catch (err) {
      // A single bad/corrupt source image shouldn't take down the build —
      // report it and keep going with the rest of the set.
      console.warn(`webp: failed to convert ${file}: ${err.message}`);
    }
  }

  console.log(`WebP generation complete: ${written} written, ${skipped} up to date, ${jpgs.length} total.`);
}

main();
