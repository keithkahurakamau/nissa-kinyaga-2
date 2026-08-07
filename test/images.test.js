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
