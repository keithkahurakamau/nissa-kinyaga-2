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
    'btn', 'pkg-card', 'pkg-price', 'badge-signature', 'grid-3', 'itinerary',
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
