import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { renderToString } from '../lib/html.js';
import { picture } from '../templates/partials.js';

test('picture() emits a plain img when no webp sibling exists', () => {
  const out = renderToString(picture({ src: '/assets/does-not-exist.jpg', alt: 'A test frame' }));
  assert.doesNotMatch(out, /<source/);
  assert.match(out, /<img[^>]+src="\/assets\/does-not-exist\.jpg"[^>]+alt="A test frame"/);
});

test('picture() emits a webp source when the sibling exists', { skip: !existsSync(new URL('../assets/lion.webp', import.meta.url)) }, () => {
  const out = renderToString(picture({ src: '/assets/lion.jpg', alt: 'A lion at rest' }));
  assert.match(out, /<source[^>]+type="image\/webp"[^>]+srcset="\/assets\/lion\.webp"/);
  assert.match(out, /<img[^>]+src="\/assets\/lion\.jpg"/);
});

test('picture() always carries alt text', () => {
  const out = renderToString(picture({ src: '/assets/lion.jpg', alt: 'A lion at rest' }));
  assert.match(out, /alt="A lion at rest"/);
});

test('picture() sets loading=lazy by default and eager when asked', () => {
  assert.match(renderToString(picture({ src: '/assets/lion.jpg', alt: 'x y z' })), /loading="lazy"/);
  assert.match(
    renderToString(picture({ src: '/assets/lion.jpg', alt: 'x y z', lazy: false })),
    /fetchpriority="high"/
  );
});

// picture() always prefers a WebP sibling when one exists, so a WebP larger
// than its JPEG is not a harmless extra file: it is the file every visitor
// downloads instead of the smaller one. scripts/make-webp.js drops those, and
// this fails if one is ever committed by hand or the rule is removed.
test('no WebP sibling is larger than the JPEG it replaces', async () => {
  const { readdirSync, statSync, existsSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const assets = join(fileURLToPath(import.meta.url), '..', '..', 'assets');
  const offenders = [];
  for (const file of readdirSync(assets).filter((f) => f.toLowerCase().endsWith('.jpg'))) {
    const webp = join(assets, `${file.slice(0, -4)}.webp`);
    if (!existsSync(webp)) continue;
    const jpg = statSync(join(assets, file)).size;
    const encoded = statSync(webp).size;
    if (encoded >= jpg) offenders.push(`${file}: jpg ${jpg}B, webp ${encoded}B`);
  }
  assert.deepEqual(offenders, [], 'these WebP files are no smaller than their JPEG');
});
