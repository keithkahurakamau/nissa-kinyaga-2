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

test('links the external stylesheet and defers the external script', () => {
  assert.match(page, /<link rel="stylesheet" href="\/styles\.css">/);
  assert.match(page, /<script src="\/app\.js" defer><\/script>/);
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

test('packageCard links to the package and shows its from-price', () => {
  const card = renderToString(packageCard(packages[0]));
  assert.match(card, new RegExp(`href="/safaris/${packages[0].slug}/"`));
  assert.match(card, /From KSh [\d,]+/);
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
