import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('every design token from the spec is declared', () => {
  for (const token of [
    '--ink:#241B12', '--sand:#F3ECDC', '--sand-2:#EBE1CD', '--forest:#22291E',
    '--cream:#FBF7EF', '--cream-2:#F6EFDE', '--gold:#C9A24B', '--gold-dark:#B28A3F',
    '--gold-deep:#7A5A22', '--gold-light:#E6C879', '--muted:#8A7B66',
    '--muted-2:#5A4A33', '--muted-3:#A99C7E', '--muted-4:#CFC5AE',
  ]) {
    assert.ok(css.replace(/\s/g, '').includes(token), `missing token ${token}`);
  }
});

test('reduced motion is honoured', () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test('focus-visible rings are defined', () => {
  assert.match(css, /:focus-visible/);
});

test('a skip link is styled', () => {
  assert.match(css, /\.skip-link/);
});

test('every contractual class name is present', () => {
  const required = [
    'wrap', 'section', 'nav-bar', 'nav-link', 'display', 'h2', 'lede', 'label',
    'btn', 'pkg-card', 'badge-signature', 'grid-3', 'itinerary',
    'incl-excl', 'faq', 'nissa-note', 'gal', 'lb', 'form', 'field-input',
    'footer-grid', 'visually-hidden', 'skip-link', 'reveal', 'crumbs',
  ];
  for (const name of required) {
    assert.ok(css.includes(`.${name}`), `missing class .${name}`);
  }
});

test('no horizontal overflow escape hatches are left in place', () => {
  assert.doesNotMatch(css, /overflow-x:\s*visible/);
});

// Regression guard for the mobile lightbox bug: `.lb-figure` is a flex item,
// so it paints like an inline block and beats a `z-index: auto` sibling on DOM
// order alone. When `.lb-close` had no z-index the image covered it, and on
// viewports under ~380px wide (and in landscape) the X stopped closing the
// lightbox. `.galbtn` was already carrying z-index for the same reason.
test('the lightbox close button is stacked above the figure', () => {
  const rule = css.match(/\.lb-close\s*\{[^}]*\}/);
  assert.ok(rule, 'missing .lb-close rule');
  const zIndex = rule[0].match(/z-index:\s*(\d+)/);
  assert.ok(zIndex, '.lb-close must declare a z-index or .lb-figure paints over it');
  assert.ok(Number(zIndex[1]) >= 3, '.lb-close z-index must be at least .galbtn\'s 3');
});

test('the lightbox close button meets the 44x44 touch target minimum', () => {
  const rule = css.match(/\.lb-close\s*\{[^}]*\}/)[0];
  const minWidth = rule.match(/min-width:\s*(\d+)px/);
  const minHeight = rule.match(/min-height:\s*(\d+)px/);
  assert.ok(minWidth && Number(minWidth[1]) >= 44, '.lb-close needs min-width >= 44px');
  assert.ok(minHeight && Number(minHeight[1]) >= 44, '.lb-close needs min-height >= 44px');
});

test('the lightbox sits above the consent banner and the nav', () => {
  const zOf = (selector) => {
    const rule = css.match(new RegExp(`\\${selector}\\s*\\{[^}]*\\}`));
    assert.ok(rule, `missing ${selector} rule`);
    const match = rule[0].match(/z-index:\s*(\d+)/);
    return match ? Number(match[1]) : 0;
  };
  const lightbox = zOf('.lb');
  assert.ok(lightbox > zOf('.consent'), '.lb must stack above .consent');
  // #nk-progress used to be a fixed strip of its own at z-index 120. It now
  // lives inside .nav-bar as the bar's bottom edge, so the nav's own z-index
  // is what the lightbox has to clear.
  assert.ok(lightbox > zOf('.nav'), '.lb must stack above .nav');
});
