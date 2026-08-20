import test from 'node:test';
import assert from 'node:assert/strict';
import { layout } from '../templates/layout.js';
import { packageCard, whatsappLink, breadcrumbNav } from '../templates/partials.js';
import { renderToString, html } from '../lib/html.js';
import packages from '../data/packages.js';

const page = layout({
  title: 'Test', description: 'Desc', path: '/safaris/',
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Safaris', path: '/safaris/' }],
  body: html`<main id="main"><h1>Hi</h1></main>`,
});

test('emits a complete HTML document', () => {
  assert.match(page, /^<!DOCTYPE html>/);
  assert.match(page, /<html lang="en">/);
  assert.match(page, /<\/html>\s*$/);
});

// Both carry a content hash in the filename (lib/assets.js), so the URL
// changes whenever the bytes do and a deploy can never serve a returning
// visitor a stale stylesheet. The hash is asserted as a shape, not a value,
// or every CSS edit would fail this test.
test('links the hashed stylesheet and defers the hashed script', () => {
  assert.match(page, /<link rel="stylesheet" href="\/styles\.[0-9a-f]{8}\.css">/);
  assert.match(page, /<script src="\/app\.[0-9a-f]{8}\.js" defer><\/script>/);
});

test('contains no inline script and no inline event handler', () => {
  const withoutLd = page.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  assert.doesNotMatch(withoutLd, /<script(?![^>]*\ssrc=)/);
  assert.doesNotMatch(page, /\son[a-z]+=/i);
});

test('keeps the CSP meta with style-src tightened', () => {
  assert.match(page, /Content-Security-Policy/);
  assert.match(page, /script-src 'self'/);
  assert.doesNotMatch(page, /style-src[^"]*'unsafe-inline'/);
});

test('includes a skip link targeting #main', () => {
  assert.match(page, /<a class="skip-link" href="#main">/);
});

test('renders breadcrumb JSON-LD when crumbs are supplied', () => {
  assert.match(page, /"@type":"BreadcrumbList"/);
});

test('nav renders the logo image, not a text wordmark', () => {
  assert.match(page, /<img[^>]+src="\/assets\/logo\.png"[^>]+alt="Nissa Safaris"/);
});

test('nav contains every entry from site.nav', () => {
  for (const href of ['/safaris/', '/destinations/', '/about/', '/contact/']) {
    assert.ok(page.includes(`href="${href}"`), `nav missing ${href}`);
  }
});

test('packageCard links to the package and shows no price', () => {
  const card = renderToString(packageCard(packages[0]));
  assert.match(card, new RegExp(`href="/safaris/${packages[0].slug}/"`));
  assert.doesNotMatch(card, /From KSh [\d,]+/);
  assert.match(card, /\d+ days?/);
});

test('packageCard image has non-empty alt text', () => {
  const card = renderToString(packageCard(packages[0]));
  assert.doesNotMatch(card, /alt=""/);
});

test('whatsappLink prefills the package name', () => {
  const link = whatsappLink('3-Day Masai Mara Classic');
  assert.match(link, /^https:\/\/wa\.me\/254707415444\?text=/);
  assert.match(decodeURIComponent(link), /3-Day Masai Mara Classic/);
});

test('breadcrumbNav marks the last crumb as current', () => {
  const nav = renderToString(breadcrumbNav([
    { name: 'Home', path: '/' }, { name: 'Safaris', path: '/safaris/' },
  ]));
  assert.match(nav, /aria-current="page"/);
});

// The whole point of hashing: the URL must change when the bytes change.
// Without this, a deploy can serve a returning visitor the old stylesheet,
// which is exactly how the home hero stayed on the previous photograph for
// an hour after each deploy.
test('the asset hash tracks file contents', async () => {
  const { createHash } = await import('node:crypto');
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const { HASHED } = await import('../lib/assets.js');
  const root = join(fileURLToPath(import.meta.url), '..', '..');

  for (const [source, url] of Object.entries(HASHED)) {
    const expected = createHash('sha256')
      .update(readFileSync(join(root, source)))
      .digest('hex')
      .slice(0, 8);
    assert.ok(url.includes(expected), `${source} URL ${url} does not carry its content hash`);
  }
});
