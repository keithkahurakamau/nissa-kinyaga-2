import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import packages from '../data/packages.js';

const byPath = new Map(pages().map((p) => [p.path, p.html]));

test('all four remaining pages exist', () => {
  for (const path of ['/gallery/', '/journal/', '/contact/', '/privacy/']) {
    assert.ok(byPath.has(path), `missing ${path}`);
  }
});

test('gallery photos are real img tags in the HTML, not JS-injected', () => {
  const gallery = byPath.get('/gallery/');
  const imgs = [...gallery.matchAll(/<img\b[^>]*>/g)];
  assert.ok(imgs.length >= 20, `only ${imgs.length} images in the gallery HTML`);
  for (const [img] of imgs) assert.match(img, /\salt="[^"]+"/);
});

test('the contact form lists every package as an option', () => {
  const contact = byPath.get('/contact/');
  for (const pkg of packages) {
    assert.ok(contact.includes(pkg.title), `contact select omits ${pkg.title}`);
  }
});

test('every contact form control has an associated label', () => {
  const contact = byPath.get('/contact/');
  const ids = [...contact.matchAll(/<(?:input|textarea|select)[^>]+id="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) {
    assert.ok(contact.includes(`for="${id}"`), `no <label for="${id}">`);
  }
});

test('the contact page shows both phone numbers and the email', () => {
  const contact = byPath.get('/contact/');
  assert.ok(contact.includes('nissasafaris254@gmail.com'));
  assert.ok(contact.includes('+254 707 415 444'));
  assert.ok(contact.includes('+254 722 449 514'));
});

test('the privacy page states that there is no backend', () => {
  const privacy = byPath.get('/privacy/');
  assert.match(privacy, /no backend|not sent to|nothing is sent/i);
});

test('every external link is rel="noopener noreferrer"', () => {
  for (const [path, html] of byPath) {
    const external = [...html.matchAll(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/g)].map((m) => m[0]);
    for (const anchor of external) {
      assert.match(anchor, /rel="noopener noreferrer"/, `${path}: ${anchor}`);
    }
  }
});
