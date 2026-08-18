import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../build.js';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const css = readFileSync(join(ROOT, 'styles.css'), 'utf8');
const appJs = readFileSync(join(ROOT, 'app.js'), 'utf8');
const all = pages().filter((p) => p.path.endsWith('/'));
const byPath = new Map(all.map((p) => [p.path, p.html]));

// The reveal CSS and its IntersectionObserver both shipped long before any
// element carried the attribute, so the whole system sat dead. These guard
// against it going dead again: CSS with no markup, or markup with no CSS,
// both silently produce no animation rather than an error.
test('the reveal system is actually wired to markup', () => {
  const withReveal = all.filter((p) => p.html.includes('data-reveal'));
  assert.ok(
    withReveal.length > 20,
    `only ${withReveal.length} pages use data-reveal; the reveal system is dead code again`,
  );
});

test('every reveal variant used in markup is defined in CSS', () => {
  const used = new Set();
  for (const { html } of all) {
    for (const m of html.matchAll(/data-reveal="([a-z]*)"/g)) used.add(m[1]);
  }
  assert.ok(used.size, 'no reveal variants found in markup');
  for (const variant of used) {
    const selector = variant ? `[data-reveal="${variant}"]` : '[data-reveal=""]';
    assert.ok(css.includes(selector), `reveal variant "${variant}" has no CSS rule (${selector})`);
  }
});

test('the reveal delay is applied through the property the CSS reads', () => {
  // styles.css reads var(--d); app.js must set that exact name, and via
  // CSSOM rather than a style attribute, which the CSP forbids.
  assert.match(css, /var\(--d,\s*0ms\)/);
  assert.match(appJs, /setProperty\('--d'/);
});

test('reveal has a failsafe so content cannot stay invisible', () => {
  assert.match(appJs, /setTimeout\(function\(\)\{ els\.forEach/);
  assert.match(appJs, /prefers-reduced-motion: reduce/);
});

// The /safaris/ filter attributes are spliced onto packageCard's rendered
// opening tag. Adding an attribute to that tag once broke the splice
// silently, dropping filtering without any error.
test('trip cards keep both their filter attributes and their reveal', () => {
  const index = byPath.get('/safaris/');
  const cards = [...index.matchAll(/<article class="pkg-card"[^>]*>/g)].map((m) => m[0]);
  assert.equal(cards.length, 21);
  for (const card of cards) {
    assert.match(card, /data-destinations="/, 'filter attribute lost');
    assert.match(card, /data-days="\d+"/);
    assert.match(card, /data-reveal="/, 'reveal attribute lost');
  }
});

test('back to top is a button, not a fragment link', () => {
  const home = byPath.get('/');
  assert.match(home, /<button id="nk-top"[^>]*type="button"/);
  assert.match(home, /aria-label="Back to top"/);
  assert.doesNotMatch(home, /<a[^>]*id="nk-top"/);
  assert.ok(css.includes('.nk-top'), '.nk-top has no styles');
  assert.match(css, /\.nk-top\.is-visible/);
});

// .nk-wa is 58px tall at right/bottom 24px. The two floating controls must
// not sit on top of each other at either breakpoint.
test('back to top clears the floating WhatsApp button', () => {
  const rule = css.match(/\.nk-top\s*\{[^}]*\}/)[0];
  const bottom = Number(rule.match(/bottom:\s*(\d+)px/)[1]);
  assert.ok(bottom >= 82, `.nk-top bottom ${bottom}px would overlap .nk-wa`);
});

test('every floating control is reachable and labelled', () => {
  const home = byPath.get('/');
  for (const id of ['nk-top', 'nk-wa']) {
    const tag = home.match(new RegExp(`<(button|a)[^>]*id="${id}"[^>]*>`))[0];
    assert.match(tag, /aria-label="/, `${id} has no accessible name`);
  }
});
