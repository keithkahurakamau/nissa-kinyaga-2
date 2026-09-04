import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const css = readFileSync(join(ROOT, 'styles.css'), 'utf8');
const appJs = readFileSync(join(ROOT, 'app.js'), 'utf8');

/**
 * The declarations of one rule, by exact selector, with comments stripped.
 *
 * Stripping matters: these rules are heavily commented, and a comment
 * containing the word "transitioned" is not a transition.
 */
function rule(selector) {
  const escaped = selector.replace(/[.#]/g, '\\$&');
  const match = css.match(new RegExp(`(^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, 'm'));
  assert.ok(match, `missing rule for ${selector}`);
  return match[2].replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Splits a CSS value list on a separator at nesting depth zero.
 *
 * A naive split breaks `rgba(20,15,9, calc(...))` into fragments; these
 * values are almost entirely nested calc() and rgba(), so depth tracking is
 * the only thing that reads them correctly.
 */
function splitTop(value, separator) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of value) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (depth === 0 && (separator === ',' ? char === ',' : /\s/.test(char))) {
      if (current.trim()) parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/* ---------------------------------------------------------------------------
   One property drives the bar
--------------------------------------------------------------------------- */

test('the bar interpolates off --nav-lift rather than transitioning a class', () => {
  assert.match(rule('.nav'), /--nav-lift:\s*0/, '.nav must declare the resting value');
  assert.match(appJs, /setProperty\('--nav-lift'/, 'app.js never publishes --nav-lift');
  for (const [name, body] of [['.nav', rule('.nav')], ['.nav-bar', rule('.nav-bar')]]) {
    assert.match(body, /var\(--nav-lift\)/, `${name} does not read --nav-lift`);
  }
});

// The old bar cross-faded these over 500ms on a scrollY > 60 threshold, which
// is both past the point a UI transition reads as responsive and a beat behind
// the gesture that caused it. Scroll-linked means there is nothing to time.
test('nothing in the bar is transitioned on a timer', () => {
  for (const name of ['.nav', '.nav-bar', '#nk-progress']) {
    assert.doesNotMatch(rule(name), /transition/,
      `${name} transitions a property that is now driven by scroll position`);
  }
});

/* ---------------------------------------------------------------------------
   The two defects this rebuild fixed, and the one it briefly introduced
--------------------------------------------------------------------------- */

// A second #nk-progress block survived the first pass of this work further
// down the file. Being later it won the cascade, so the new rule was inert and
// the old fixed strip and its halo were what actually shipped. Nothing in a
// screenshot said so.
test('there is exactly one #nk-progress rule', () => {
  const blocks = css.match(/(^|\})\s*#nk-progress\s*\{/gm) ?? [];
  assert.equal(blocks.length, 1,
    `${blocks.length} #nk-progress rules; a later duplicate silently wins the cascade`);
});

// Both axes, or the fill stops short of each edge once the bar is meant to be
// full-bleed and it reads as a floating slab. The first pass interpolated only
// the vertical padding.
test('both padding axes collapse as the bar lifts', () => {
  const padding = rule('.nav').match(/padding:\s*([^;]+);/);
  assert.ok(padding, '.nav declares no padding');
  const axes = splitTop(padding[1], ' ');
  assert.equal(axes.length, 2, `expected two padding axes, got: ${padding[1]}`);
  for (const [i, axis] of axes.entries()) {
    assert.match(axis, /1\s*-\s*var\(--nav-lift\)/,
      `padding axis ${i} does not collapse with --nav-lift: ${axis}`);
  }
});

test('the scroll edge hands over to the bar instead of stacking with it', () => {
  const scrim = css.match(/\.nav::before\s*\{([^}]*)\}/);
  assert.ok(scrim, 'missing .nav::before');
  assert.match(scrim[1], /opacity:\s*calc\(\s*1\s*-\s*var\(--nav-lift\)\s*\)/,
    'the scrim must fade out as the bar solidifies, or it keeps painting a wash below it');
  assert.match(scrim[1], /z-index:\s*-1/, 'the scrim must stay behind .nav-bar');
  assert.match(scrim[1], /pointer-events:\s*none/);
});

/* ---------------------------------------------------------------------------
   Elevation
--------------------------------------------------------------------------- */

// Depth is a contact shadow plus an ambient one, not a single blur. A layer
// with no offset is a halo, which is decoration rather than elevation.
test('the bar casts a layered shadow, and no layer is a halo', () => {
  const shadow = rule('.nav-bar').match(/box-shadow:\s*([^;]+);/);
  assert.ok(shadow, '.nav-bar casts no shadow');
  const layers = splitTop(shadow[1], ',');
  assert.ok(layers.length >= 3, `expected a stack, found ${layers.length} layer(s)`);
  for (const layer of layers) {
    // Only the lengths before the colour: rgba()'s own numbers are not offsets.
    // A bare `0` is a valid length and is how the x-offset is written here.
    const geometry = splitTop(layer, ' ').filter((part) => /^-?[\d.]+(px)?$/.test(part));
    assert.ok(geometry.length >= 3, `"${layer}" has no offset and blur`);
    const [, offsetY, blur] = geometry.map((v) => parseFloat(v));
    assert.ok(offsetY > 0, `"${layer}" has no vertical offset: light comes from above`);
    assert.ok(blur > 0, `"${layer}" is a hard shadow`);
    assert.match(layer, /var\(--nav-lift\)/, `"${layer}" does not build with the scroll`);
  }
});

/* ---------------------------------------------------------------------------
   Contrast
--------------------------------------------------------------------------- */

const luminance = (r, g, b) =>
  [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);

const contrast = (a, b) => {
  const [hi, lo] = [a, b].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// .nav-link is var(--cream) and cannot take a per-page override: the nav is
// fixed, outside the section it overlaps, so no descendant selector reaches
// it. The scroll edge gradient is the only thing standing between the links
// and an unreadable pale hero, which makes its alpha a measured number.
//
// The link text sits at y 44-64 in the resting bar (centred at 54) and the
// gradient is 112px tall, so the stops covering 39-58% are the ones that have
// to hold. Worst realistic case behind them is white.
test('the scroll edge holds AA contrast across the band the links occupy', () => {
  const scrim = css.match(/\.nav::before\s*\{([^}]*)\}/)[1];
  const height = Number(scrim.match(/height:\s*(\d+)px/)[1]);
  const stops = [...scrim.matchAll(/rgba\(20,15,9,([\d.]+)\)\s+([\d.]+)%/g)]
    .map((m) => ({ alpha: Number(m[1]), at: Number(m[2]) }));
  assert.ok(stops.length >= 4, 'the ramp needs enough stops to avoid a visible band edge');

  const alphaAt = (y) => {
    const pct = (y / height) * 100;
    for (let i = 1; i < stops.length; i += 1) {
      if (pct <= stops[i].at) {
        const span = stops[i].at - stops[i - 1].at;
        const t = span === 0 ? 0 : (pct - stops[i - 1].at) / span;
        return stops[i - 1].alpha + (stops[i].alpha - stops[i - 1].alpha) * t;
      }
    }
    return stops[stops.length - 1].alpha;
  };

  const cream = luminance(251, 247, 239);
  for (let y = 44; y <= 64; y += 2) {
    // black scrim over pure white, the worst hero this has to survive
    const behind = 255 * (1 - alphaAt(y));
    const ratio = contrast(cream, luminance(behind, behind, behind));
    assert.ok(ratio >= 4.5,
      `nav links fall to ${ratio.toFixed(2)}:1 at y=${y}px over a white hero`);
  }
});

/* ---------------------------------------------------------------------------
   Wayfinding and states
--------------------------------------------------------------------------- */

// layout.js has emitted aria-current="page" on the active item since it was
// written and nothing read it, so the bar answered "where can I go" and never
// "where am I".
test('the current page is marked in the bar, not only to a screen reader', () => {
  assert.match(css, /\.nav-link\[aria-current="page"\]::after\s*\{[^}]*scaleX\(1\)/,
    'aria-current="page" has no visual indicator');
  const indicator = css.match(/\.nav-link:not\(\.nav-cta\)::after\s*\{([^}]*)\}/);
  assert.ok(indicator, 'missing the nav link rule');
  assert.match(indicator[1], /transform-origin:\s*left/, 'the rule must draw from its start');
});

test('the bar answers hover, focus and press', () => {
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)\s*\{[^}]*nav-link/,
    'hover must be gated, or a tap draws the rule on the link being left');
  assert.match(css, /\.nav-link:not\(\.nav-cta\):focus-visible::after/, 'no keyboard affordance');
  assert.match(css, /\.nav-link:not\(\.nav-cta\):active/, 'presses do not land');
});

/* ---------------------------------------------------------------------------
   Cost
--------------------------------------------------------------------------- */

test('scroll work is coalesced and compositor-friendly', () => {
  assert.match(appJs, /requestAnimationFrame\(paint\)/, 'scroll writes are not frame-coalesced');
  assert.match(appJs, /bar\.style\.transform = 'scaleX\(/, 'the progress rule relayouts on width');
  assert.doesNotMatch(rule('#nk-progress'), /\bwidth:\s*0%/,
    'a 0% width makes the scaleX transform invisible');
  // Writing the property at raw float precision restyles the bar and its
  // descendants on every scroll event for a change no display resolves.
  assert.match(appJs, /Math\.round\([\s\S]{0,120}?\*\s*50\)\s*\/\s*50/, 'lift is not quantised');
});

test('the logo compacts without relayouting the bar', () => {
  const logo = css.match(/\.nav-logo img\s*\{([^}]*)\}/);
  assert.ok(logo, 'missing .nav-logo img');
  assert.match(logo[1], /transform:\s*scale\(calc\([^)]*var\(--nav-lift\)/,
    'the logo should scale on the compositor, not animate its height');
  assert.match(logo[1], /transform-origin:\s*left/, 'the mark must stay pinned to the column edge');
});
