# Nissa Safaris Multi-Page Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the single-page Nissa Ole Kinyaga portfolio into a 37-page static **Nissa Safaris** site with 21 priced safari packages, 8 destination pages, and a maximised on-page SEO surface.

**Architecture:** A dependency-free Node build script renders JS template functions against plain-JS data modules into static HTML in `dist/`. Templates use a 25-line auto-escaping tagged-template helper (`html`) instead of a template-language parser. All styling moves from inline attributes into a single `styles.css` with design tokens and component classes. `dist/` is gitignored and built by Vercel on deploy.

**Tech Stack:** Node 22 (build-time only, **no third-party packages**), `node:test` + `node:assert` for tests, vanilla HTML/CSS/JS output, Vercel hosting.

## Global Constraints

Every task's requirements implicitly include these. Values are copied verbatim from the spec.

- **Zero third-party dependencies**, build-time and runtime. Node built-ins only. `package.json` must have no `dependencies` and no `devDependencies`.
- **Canonical domain:** `https://nissasafaris.com` (two s's). All canonicals, `og:url`, sitemap entries and JSON-LD `url` fields use this origin with a trailing slash on directory URLs.
- **Build output:** `dist/`, gitignored, reproducible via `npm run build`.
- **CSP stays strict.** No inline `<script>`, no inline event handlers (`onclick=` etc.). Because all styles move to `styles.css`, `style-src` tightens from `'self' 'unsafe-inline' https://fonts.googleapis.com` to `'self' https://fonts.googleapis.com`.
- **Alt text must describe what is in the frame, never the park** — existing photos are reused across destinations they were not shot in.
- **Prices** live only in the `PRICES` block at the top of `data/packages.js`, marked `PLACEHOLDER — EDIT BEFORE LAUNCH`.
- **Contact details:** email `nissasafaris254@gmail.com`; WhatsApp/phone `+254707415444` (main) and `+254722449514`; Instagram `@nissa_safaris_tours`.
- **Accessibility preserved:** `prefers-reduced-motion` respected, `:focus-visible` rings, labelled form controls, ARIA on custom widgets.
- **Design tokens** (from the current inline styles, do not invent new ones):
  `--ink:#241B12` `--sand:#F3ECDC` `--sand-2:#EBE1CD` `--forest:#22291E` `--cream:#FBF7EF` `--cream-2:#F6EFDE` `--gold:#C9A24B` `--gold-dark:#B28A3F` `--gold-deep:#7A5A22` `--gold-light:#E6C879` `--muted:#8A7B66` `--muted-2:#5A4A33` `--muted-3:#A99C7E` `--muted-4:#CFC5AE`
  Fonts: `Cormorant Garamond` (display), `Mulish` (body), `DM Mono` (labels).
- **Nissa's biography is factual and must not be embellished.** Retained verbatim: Maasai, raised in the Mukogodo Forest; radio signaller at Lewa Wildlife Conservancy; Kenya Utalii College advanced tour-guiding certificate; full-time guide from 2002; advanced ornithology, walking safaris, astronomy, bush first aid; Silver-rated (one of 59 in Kenya); 20+ years. Worked at: Lewa Wildlife Conservancy, Laragai House, Borana Conservancy, Maasai Mara, Tsavo East, Tsavo West.

---

## File Structure

| Path | Responsibility |
|---|---|
| `package.json` | `"type": "module"`, scripts `build` / `test` / `dev`. No deps. |
| `.gitignore` | `dist/`, `node_modules/` |
| `lib/html.js` | Auto-escaping `html` tagged template, `raw()`, `escape()`, `renderToString()` |
| `lib/seo.js` | `<head>` tag builder + JSON-LD builders (`travelAgency`, `person`, `touristTrip`, `place`, `breadcrumbs`, `faqPage`) |
| `lib/validate.js` | Schema validators for package/destination data |
| `lib/paths.js` | Slug → URL → output-path helpers, `absoluteUrl()` |
| `data/site.js` | Brand, domain, contacts, socials, nav, footer |
| `data/packages.js` | `PRICES` block + 21 package objects |
| `data/destinations.js` | 8 destination objects |
| `data/journal.js` | Journal entries migrated from `index.html` |
| `data/gallery.js` | Gallery photo manifest (currently inside `app.js`) |
| `templates/layout.js` | `<html>` shell: head, nav, footer, skip-link |
| `templates/partials.js` | `packageCard`, `ctaBlock`, `sectionHeading`, `breadcrumbNav` |
| `templates/home.js` … `templates/privacy.js` | One module per page type (11 files) |
| `build.js` | Walks data → templates → writes `dist/`, emits `sitemap.xml` + `robots.txt` |
| `scripts/make-webp.js` | One-off: generate `.webp` beside each `.jpg` |
| `styles.css` | All styling; design tokens + component classes |
| `app.js` | Existing behaviour, split into per-page init guarded by element presence |
| `vercel.json` | Headers, redirects, clean URLs |
| `test/*.test.js` | Unit tests per lib module + whole-site integration tests |

---

## Task 1: Project scaffolding and the HTML escaping helper

**Files:**
- Create: `package.json`, `.gitignore`, `lib/html.js`
- Test: `test/html.test.js`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `escape(value: unknown) => string`
  - `raw(value: unknown) => RawHtml` — an opaque object marking pre-escaped HTML
  - `html(strings: TemplateStringsArray, ...values) => RawHtml` — auto-escapes every interpolation; arrays are joined with no separator; `null`/`undefined`/`false` render as `''`
  - `renderToString(node: RawHtml | string) => string`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "nissa-safaris",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "build": "node build.js",
    "test": "node --test test/",
    "dev": "node build.js && node --run serve",
    "serve": "cd dist && python3 -m http.server 8000"
  }
}
```

- [ ] **Step 2: Create `.gitignore`**

```
dist/
node_modules/
.DS_Store
```

- [ ] **Step 3: Write the failing test at `test/html.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { escape, raw, html, renderToString } from '../lib/html.js';

test('escape() neutralises all five HTML metacharacters', () => {
  assert.equal(escape(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
});

test('escape() coerces non-strings', () => {
  assert.equal(escape(42), '42');
});

test('html() escapes interpolated values', () => {
  const name = '<script>alert(1)</script>';
  assert.equal(
    renderToString(html`<h1>${name}</h1>`),
    '<h1>&lt;script&gt;alert(1)&lt;/script&gt;</h1>'
  );
});

test('html() does not escape literal template text', () => {
  assert.equal(renderToString(html`<p class="a">hi</p>`), '<p class="a">hi</p>');
});

test('html() nests without double-escaping', () => {
  const inner = html`<em>R&D</em>`;
  assert.equal(renderToString(html`<p>${inner}</p>`), '<p><em>R&amp;D</em></p>');
});

test('html() joins arrays with no separator', () => {
  const items = ['a', 'b'].map((x) => html`<li>${x}</li>`);
  assert.equal(renderToString(html`<ul>${items}</ul>`), '<ul><li>a</li><li>b</li></ul>');
});

test('html() renders null, undefined and false as empty', () => {
  assert.equal(renderToString(html`<p>${null}${undefined}${false}</p>`), '<p></p>');
});

test('html() renders 0 as "0", not empty', () => {
  assert.equal(renderToString(html`<p>${0}</p>`), '<p>0</p>');
});

test('raw() opts out of escaping', () => {
  assert.equal(renderToString(html`<div>${raw('<br>')}</div>`), '<div><br></div>');
});
```

- [ ] **Step 4: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../lib/html.js'`

- [ ] **Step 5: Implement `lib/html.js`**

```js
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const RAW = Symbol('raw-html');

export function escape(value) {
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

export function raw(value) {
  return { [RAW]: String(value) };
}

function interpolate(value) {
  if (value === null || value === undefined || value === false) return '';
  if (Array.isArray(value)) return value.map(interpolate).join('');
  if (typeof value === 'object' && RAW in value) return value[RAW];
  return escape(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += interpolate(values[i]) + strings[i + 1];
  }
  return raw(out);
}

export function renderToString(node) {
  return interpolate(node);
}
```

- [ ] **Step 6: Run the test and verify it passes**

Run: `npm test`
Expected: PASS — 9 tests

- [ ] **Step 7: Commit**

```bash
git add package.json .gitignore lib/html.js test/html.test.js
git commit -m "feat: add dependency-free auto-escaping HTML template helper"
```

---

## Task 2: Path and URL helpers

**Files:**
- Create: `lib/paths.js`
- Test: `test/paths.test.js`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `ORIGIN = 'https://nissasafaris.com'`
  - `slugify(text: string) => string`
  - `absoluteUrl(pathname: string) => string`
  - `outputPath(pathname: string) => string` — `/safaris/x/` → `safaris/x/index.html`, `/` → `index.html`

- [ ] **Step 1: Write the failing test at `test/paths.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { ORIGIN, slugify, absoluteUrl, outputPath } from '../lib/paths.js';

test('ORIGIN is the canonical two-s domain', () => {
  assert.equal(ORIGIN, 'https://nissasafaris.com');
});

test('slugify lowercases and hyphenates', () => {
  assert.equal(slugify('3-Day Masai Mara Classic'), '3-day-masai-mara-classic');
});

test('slugify strips punctuation and collapses separators', () => {
  assert.equal(slugify('Mount Kenya — Sirimon to Chogoria'), 'mount-kenya-sirimon-to-chogoria');
  assert.equal(slugify('Tsavo East & Tsavo West'), 'tsavo-east-tsavo-west');
});

test('slugify trims leading and trailing hyphens', () => {
  assert.equal(slugify('  --Diani Beach--  '), 'diani-beach');
});

test('absoluteUrl joins origin and path', () => {
  assert.equal(absoluteUrl('/safaris/'), 'https://nissasafaris.com/safaris/');
  assert.equal(absoluteUrl('/'), 'https://nissasafaris.com/');
});

test('outputPath maps directory URLs to index.html', () => {
  assert.equal(outputPath('/'), 'index.html');
  assert.equal(outputPath('/safaris/'), 'safaris/index.html');
  assert.equal(outputPath('/safaris/3-day-masai-mara-classic/'), 'safaris/3-day-masai-mara-classic/index.html');
});

test('outputPath passes through file URLs', () => {
  assert.equal(outputPath('/sitemap.xml'), 'sitemap.xml');
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/paths.test.js`
Expected: FAIL — `Cannot find module '../lib/paths.js'`

- [ ] **Step 3: Implement `lib/paths.js`**

```js
export const ORIGIN = 'https://nissasafaris.com';

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function absoluteUrl(pathname) {
  return ORIGIN + pathname;
}

export function outputPath(pathname) {
  const trimmed = pathname.replace(/^\//, '');
  if (trimmed === '') return 'index.html';
  if (trimmed.endsWith('/')) return `${trimmed}index.html`;
  return trimmed;
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `node --test test/paths.test.js`
Expected: PASS — 7 tests

- [ ] **Step 5: Commit**

```bash
git add lib/paths.js test/paths.test.js
git commit -m "feat: add slug and URL path helpers"
```

---

## Task 3: Site-wide data module

**Files:**
- Create: `data/site.js`
- Test: `test/site.test.js`

**Interfaces:**
- Consumes: nothing
- Produces: default export `site` with keys `name`, `legalName`, `guide`, `tagline`, `description`, `origin`, `email`, `phones[]`, `whatsapp`, `instagram`, `logo`, `defaultShareImage`, `nav[]`, `footerLinks[]`, `credentials[]`, `workedAt[]`

- [ ] **Step 1: Write the failing test at `test/site.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import site from '../data/site.js';

test('brand and contact details match the spec verbatim', () => {
  assert.equal(site.name, 'Nissa Safaris');
  assert.equal(site.guide, 'Nissa Ole Kinyaga');
  assert.equal(site.email, 'nissasafaris254@gmail.com');
  assert.equal(site.whatsapp, '254707415444');
  assert.deepEqual(site.phones, ['+254 707 415 444', '+254 722 449 514']);
  assert.equal(site.instagram, 'nissa_safaris_tours');
});

test('nav entries all have a label and an absolute path', () => {
  assert.ok(site.nav.length >= 5);
  for (const item of site.nav) {
    assert.ok(item.label, 'nav item missing label');
    assert.match(item.href, /^\/.*\/$|^\/$/, `nav href not a directory URL: ${item.href}`);
  }
});

test('workedAt lists every place from the spec', () => {
  assert.deepEqual(site.workedAt.map((w) => w.name).sort(), [
    'Borana Conservancy',
    'Laragai House',
    'Lewa Wildlife Conservancy',
    'Maasai Mara',
    'Tsavo East',
    'Tsavo West',
  ]);
});

test('logo and portrait point at the paths the user will supply', () => {
  assert.equal(site.logo, '/assets/logo.png');
  assert.equal(site.portrait, '/assets/portrait.jpg');
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/site.test.js`
Expected: FAIL — `Cannot find module '../data/site.js'`

- [ ] **Step 3: Implement `data/site.js`**

Include exactly these keys. Nav order: Home, Safaris, Destinations, About, Gallery, Journal, Contact.

```js
import { ORIGIN } from '../lib/paths.js';

export default {
  name: 'Nissa Safaris',
  legalName: 'Nissa Safaris',
  guide: 'Nissa Ole Kinyaga',
  tagline: 'Journeys that connect you to nature',
  description:
    'Private safaris across Kenya led by Nissa Ole Kinyaga, a Silver-rated guide with over twenty years in the field — Maasai Mara, Samburu, Ol Pejeta, Tsavo, Laikipia, Mount Kenya and the Diani coast.',
  origin: ORIGIN,
  email: 'nissasafaris254@gmail.com',
  phones: ['+254 707 415 444', '+254 722 449 514'],
  whatsapp: '254707415444',
  instagram: 'nissa_safaris_tours',
  logo: '/assets/logo.png',
  portrait: '/assets/portrait.jpg',
  defaultShareImage: '/assets/lion.jpg',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Safaris', href: '/safaris/' },
    { label: 'Destinations', href: '/destinations/' },
    { label: 'About', href: '/about/' },
    { label: 'Gallery', href: '/gallery/' },
    { label: 'Journal', href: '/journal/' },
    { label: 'Contact', href: '/contact/' },
  ],
  footerLinks: [
    { label: 'All safaris', href: '/safaris/' },
    { label: 'Destinations', href: '/destinations/' },
    { label: 'About Nissa', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
    { label: 'Privacy', href: '/privacy/' },
  ],
  credentials: [
    'Silver-rated safari guide — one of 59 in Kenya',
    'Kenya Utalii College — Advanced Tour Guiding Certificate',
    'Advanced ornithology',
    'Walking safari qualification',
    'Astronomy',
    'Bush first aid',
  ],
  workedAt: [
    { name: 'Lewa Wildlife Conservancy', role: 'Radio signaller, then guide' },
    { name: 'Borana Conservancy', role: 'Safari guide' },
    { name: 'Laragai House', role: 'Private guide' },
    { name: 'Maasai Mara', role: 'Safari guide' },
    { name: 'Tsavo East', role: 'Safari guide' },
    { name: 'Tsavo West', role: 'Safari guide' },
  ],
};
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `node --test test/site.test.js`
Expected: PASS — 4 tests

- [ ] **Step 5: Commit**

```bash
git add data/site.js test/site.test.js
git commit -m "feat: add site-wide brand and contact data"
```

---

## Task 4: Package and destination schema validators

**Files:**
- Create: `lib/validate.js`
- Test: `test/validate.test.js`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `validatePackage(pkg) => string[]` — array of human-readable problems, empty when valid
  - `validateDestination(dest) => string[]`
  - `assertAllValid(items, validator, label) => void` — throws `Error` listing every problem

**Package object shape** (later tasks depend on these exact field names):

```js
{
  slug: '3-day-masai-mara-classic',   // string, matches slugify(title)
  title: '3-Day Masai Mara Classic',   // string
  days: 3,                             // integer >= 1
  nights: 2,                           // integer >= 0
  category: 'Masai Mara & Rift Valley',// one of the five category strings
  destinations: ['masai-mara'],        // non-empty array of destination slugs
  priceKey: 'mara3',                   // key into PRICES
  hero: '/assets/p03.jpg',             // asset path
  heroAlt: 'Wildebeest strung out across open grassland at first light',
  summary: '…',                        // 1–2 sentences, <= 200 chars
  overview: ['…', '…'],                // 2–3 paragraphs
  itinerary: [{ day: 1, title: '…', body: '…' }],  // length === days
  included: ['…'],                     // >= 4 items
  excluded: ['…'],                     // >= 3 items
  bestTime: '…',                       // 1–2 sentences
  faqs: [{ q: '…', a: '…' }],          // 3–5 items
  signature: false,                    // boolean
}
```

- [ ] **Step 1: Write the failing test at `test/validate.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePackage, validateDestination, assertAllValid } from '../lib/validate.js';

const valid = {
  slug: '2-day-tsavo-east',
  title: '2-Day Tsavo East',
  days: 2,
  nights: 1,
  category: 'Amboseli & Tsavo',
  destinations: ['tsavo'],
  priceKey: 'tsavo2',
  hero: '/assets/p10.jpg',
  heroAlt: 'Red dust rising behind a herd of elephant',
  summary: 'A short run into the red earth of Tsavo East.',
  overview: ['Paragraph one.', 'Paragraph two.'],
  itinerary: [
    { day: 1, title: 'Nairobi to Tsavo East', body: 'Body copy.' },
    { day: 2, title: 'Morning drive and return', body: 'Body copy.' },
  ],
  included: ['Park fees', 'Transport', 'Full-board accommodation', 'Guiding'],
  excluded: ['International flights', 'Visas', 'Tips'],
  bestTime: 'June to October, and January to February.',
  faqs: [
    { q: 'Q1?', a: 'A1.' },
    { q: 'Q2?', a: 'A2.' },
    { q: 'Q3?', a: 'A3.' },
  ],
  signature: false,
};

test('a well-formed package reports no problems', () => {
  assert.deepEqual(validatePackage(valid), []);
});

test('itinerary length must equal days', () => {
  const bad = { ...valid, days: 3 };
  assert.ok(validatePackage(bad).some((p) => p.includes('itinerary')));
});

test('slug must match the slugified title', () => {
  const bad = { ...valid, slug: 'wrong-slug' };
  assert.ok(validatePackage(bad).some((p) => p.includes('slug')));
});

test('missing required fields are each reported', () => {
  const problems = validatePackage({ slug: 'x' });
  assert.ok(problems.length >= 10);
  assert.ok(problems.some((p) => p.includes('title')));
  assert.ok(problems.some((p) => p.includes('hero')));
});

test('heroAlt must be present and non-trivial', () => {
  const bad = { ...valid, heroAlt: '' };
  assert.ok(validatePackage(bad).some((p) => p.includes('heroAlt')));
});

test('faqs must number between 3 and 5', () => {
  const bad = { ...valid, faqs: [{ q: 'Q?', a: 'A.' }] };
  assert.ok(validatePackage(bad).some((p) => p.includes('faqs')));
});

test('a well-formed destination reports no problems', () => {
  assert.deepEqual(
    validateDestination({
      slug: 'tsavo',
      name: 'Tsavo East & Tsavo West',
      shortName: 'Tsavo',
      hero: '/assets/p10.jpg',
      heroAlt: 'Dust and thorn scrub under a wide sky',
      summary: 'Kenya’s largest protected wilderness.',
      overview: ['One.', 'Two.'],
      wildlife: ['Elephant', 'Lion', 'Buffalo'],
      bestTime: 'June to October.',
      gettingThere: 'Five hours by road from Nairobi.',
      nissaNote: 'I guided here for several seasons.',
    }),
    []
  );
});

test('assertAllValid throws listing every problem', () => {
  assert.throws(
    () => assertAllValid([{ slug: 'x' }], validatePackage, 'package'),
    /package/
  );
});

test('assertAllValid passes silently when all items are valid', () => {
  assert.doesNotThrow(() => assertAllValid([valid], validatePackage, 'package'));
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/validate.test.js`
Expected: FAIL — `Cannot find module '../lib/validate.js'`

- [ ] **Step 3: Implement `lib/validate.js`**

```js
import { slugify } from './paths.js';

const CATEGORIES = [
  'Masai Mara & Rift Valley',
  'Amboseli & Tsavo',
  'Laikipia & the North',
  'Mount Kenya',
  'Coast',
];

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validatePackage(pkg) {
  const problems = [];
  const id = pkg?.slug ?? '(no slug)';
  const fail = (msg) => problems.push(`${id}: ${msg}`);

  if (!nonEmptyString(pkg?.title)) fail('title is required');
  if (!nonEmptyString(pkg?.slug)) fail('slug is required');
  else if (nonEmptyString(pkg?.title) && pkg.slug !== slugify(pkg.title)) {
    fail(`slug "${pkg.slug}" does not match slugify(title) "${slugify(pkg.title)}"`);
  }
  if (!Number.isInteger(pkg?.days) || pkg.days < 1) fail('days must be an integer >= 1');
  if (!Number.isInteger(pkg?.nights) || pkg.nights < 0) fail('nights must be an integer >= 0');
  if (!CATEGORIES.includes(pkg?.category)) fail(`category must be one of: ${CATEGORIES.join(', ')}`);
  if (!Array.isArray(pkg?.destinations) || pkg.destinations.length === 0) {
    fail('destinations must be a non-empty array of destination slugs');
  }
  if (!nonEmptyString(pkg?.priceKey)) fail('priceKey is required');
  if (!nonEmptyString(pkg?.hero)) fail('hero asset path is required');
  if (!nonEmptyString(pkg?.heroAlt) || pkg.heroAlt.trim().length < 15) {
    fail('heroAlt is required and must describe the frame (>= 15 chars)');
  }
  if (!nonEmptyString(pkg?.summary)) fail('summary is required');
  else if (pkg.summary.length > 200) fail('summary must be <= 200 characters');
  if (!Array.isArray(pkg?.overview) || pkg.overview.length < 2) {
    fail('overview must have at least 2 paragraphs');
  }
  if (!Array.isArray(pkg?.itinerary)) fail('itinerary is required');
  else {
    if (Number.isInteger(pkg?.days) && pkg.itinerary.length !== pkg.days) {
      fail(`itinerary has ${pkg.itinerary.length} entries but days is ${pkg.days}`);
    }
    pkg.itinerary.forEach((entry, i) => {
      if (entry?.day !== i + 1) fail(`itinerary[${i}].day must be ${i + 1}`);
      if (!nonEmptyString(entry?.title)) fail(`itinerary[${i}].title is required`);
      if (!nonEmptyString(entry?.body)) fail(`itinerary[${i}].body is required`);
    });
  }
  if (!Array.isArray(pkg?.included) || pkg.included.length < 4) fail('included needs >= 4 items');
  if (!Array.isArray(pkg?.excluded) || pkg.excluded.length < 3) fail('excluded needs >= 3 items');
  if (!nonEmptyString(pkg?.bestTime)) fail('bestTime is required');
  if (!Array.isArray(pkg?.faqs) || pkg.faqs.length < 3 || pkg.faqs.length > 5) {
    fail('faqs must number between 3 and 5');
  } else {
    pkg.faqs.forEach((faq, i) => {
      if (!nonEmptyString(faq?.q)) fail(`faqs[${i}].q is required`);
      if (!nonEmptyString(faq?.a)) fail(`faqs[${i}].a is required`);
    });
  }
  if (typeof pkg?.signature !== 'boolean') fail('signature must be a boolean');

  return problems;
}

export function validateDestination(dest) {
  const problems = [];
  const id = dest?.slug ?? '(no slug)';
  const fail = (msg) => problems.push(`${id}: ${msg}`);

  for (const field of ['slug', 'name', 'shortName', 'hero', 'summary', 'bestTime', 'gettingThere']) {
    if (!nonEmptyString(dest?.[field])) fail(`${field} is required`);
  }
  if (!nonEmptyString(dest?.heroAlt) || dest.heroAlt.trim().length < 15) {
    fail('heroAlt is required and must describe the frame (>= 15 chars)');
  }
  if (!Array.isArray(dest?.overview) || dest.overview.length < 2) {
    fail('overview must have at least 2 paragraphs');
  }
  if (!Array.isArray(dest?.wildlife) || dest.wildlife.length < 3) {
    fail('wildlife needs >= 3 entries');
  }
  return problems;
}

export function assertAllValid(items, validator, label) {
  const problems = items.flatMap((item) => validator(item));
  if (problems.length > 0) {
    throw new Error(`Invalid ${label} data:\n  ${problems.join('\n  ')}`);
  }
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `node --test test/validate.test.js`
Expected: PASS — 9 tests

- [ ] **Step 5: Commit**

```bash
git add lib/validate.js test/validate.test.js
git commit -m "feat: add package and destination schema validators"
```

---

## Task 5: Destination data — all 8 destinations

**Files:**
- Create: `data/destinations.js`
- Test: `test/destinations.test.js`

**Interfaces:**
- Consumes: `validateDestination`, `assertAllValid` from `lib/validate.js`
- Produces: default export — array of 8 destination objects with slugs `masai-mara`, `amboseli`, `samburu`, `ol-pejeta`, `tsavo`, `laikipia`, `mount-kenya`, `diani`

**Photo mapping** — reuse existing assets, alt text describes the frame only:

| Destination | Hero asset |
|---|---|
| `masai-mara` | `/assets/p03.jpg` |
| `amboseli` | `/assets/p14.jpg` |
| `samburu` | `/assets/kudu.jpg` |
| `ol-pejeta` | `/assets/p08.jpg` |
| `tsavo` | `/assets/p10.jpg` |
| `laikipia` | `/assets/p12.jpg` |
| `mount-kenya` | `/assets/p16.jpg` |
| `diani` | `/assets/p09.jpg` |

**`nissaNote` rule:** write a first-hand note **only** for `masai-mara`, `tsavo` and `laikipia` (Borana/Lewa/Laragai House) — the places Nissa has actually worked. For the other five, set `nissaNote: null`. The template omits the block when null. Do not invent experience.

- [ ] **Step 1: Write the failing test at `test/destinations.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import destinations from '../data/destinations.js';
import { validateDestination, assertAllValid } from '../lib/validate.js';

test('there are exactly 8 destinations with the expected slugs', () => {
  assert.equal(destinations.length, 8);
  assert.deepEqual(destinations.map((d) => d.slug).sort(), [
    'amboseli', 'diani', 'laikipia', 'masai-mara',
    'mount-kenya', 'ol-pejeta', 'samburu', 'tsavo',
  ]);
});

test('every destination passes schema validation', () => {
  assert.doesNotThrow(() => assertAllValid(destinations, validateDestination, 'destination'));
});

test('slugs are unique', () => {
  const slugs = destinations.map((d) => d.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('first-hand notes appear only where Nissa has worked', () => {
  const withNote = destinations.filter((d) => d.nissaNote).map((d) => d.slug).sort();
  assert.deepEqual(withNote, ['laikipia', 'masai-mara', 'tsavo']);
});

test('hero alt text never names a national park', () => {
  const parks = /masai mara|maasai mara|amboseli|samburu|ol pejeta|tsavo|borana|lewa|diani/i;
  for (const dest of destinations) {
    assert.doesNotMatch(dest.heroAlt, parks, `${dest.slug} heroAlt names a park`);
  }
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/destinations.test.js`
Expected: FAIL — `Cannot find module '../data/destinations.js'`

- [ ] **Step 3: Author `data/destinations.js`**

Write all 8 objects using the shape validated in Task 4, the hero mapping above, and the `nissaNote` rule. Every `overview` is 2–3 original paragraphs — do not copy text from any other site. Each object also gets:

- `metaTitle` — e.g. `'Masai Mara Safari Packages & Guide | Nissa Safaris'` (≤ 60 chars where possible)
- `metaDescription` — 140–160 chars, includes the destination name and "safari"

Reference facts to write from (verify nothing beyond these):
- **Masai Mara** — reserve in Narok County; wildebeest migration crosses the Mara River roughly July–October; big cat density; non-resident entry fee USD 200/day high season, USD 100/day low season.
- **Amboseli** — Kajiado County, under Kilimanjaro; large elephant herds; open pans and swamp.
- **Samburu** — northern reserve on the Ewaso Ng'iro river; the "Special Five": Grevy's zebra, reticulated giraffe, Beisa oryx, gerenuk, Somali ostrich.
- **Ol Pejeta** — Laikipia conservancy; largest black rhino sanctuary in East Africa; home to the last two northern white rhino; chimpanzee sanctuary.
- **Tsavo** — Tsavo East and Tsavo West together form Kenya's largest protected area; red-dust elephants; Mzima Springs in Tsavo West.
- **Laikipia** — Borana (32,000 acres) and Lewa conservancies; rhino sanctuaries; walking and horseback safaris; Mount Kenya on the horizon. **This is Nissa's home ground.**
- **Mount Kenya** — Africa's second-highest peak; Point Lenana (4,985 m) is the trekking summit; Sirimon, Chogoria and Naro Moru routes.
- **Diani** — south-coast beach below Mombasa; white sand and reef; typical safari-and-beach extension.

- [ ] **Step 4: Run the test and verify it passes**

Run: `node --test test/destinations.test.js`
Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add data/destinations.js test/destinations.test.js
git commit -m "feat: add data for 8 Kenya destinations"
```

---

## Task 6: Package data — prices block and the 6 Masai Mara & Rift Valley packages

**Files:**
- Create: `data/packages.js`
- Test: `test/packages.test.js`

**Interfaces:**
- Consumes: `validatePackage`, `assertAllValid`, `slugify`
- Produces:
  - named export `PRICES` — `{ [priceKey]: { fromUsd: number, tier: string } }`
  - default export — array of package objects (6 in this task, 21 by Task 9)

**The `PRICES` block must open the file, verbatim:**

```js
// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER — EDIT BEFORE LAUNCH
// Indicative 2026 Kenya market rates, USD per person sharing, low season,
// mid-range accommodation, party of 4. Replace every figure with Nissa's own
// rates before the site goes live. Nothing else in the codebase hard-codes a
// price.
// ─────────────────────────────────────────────────────────────────────────────
export const PRICES = { /* … */ };
```

Seed values (USD per person, from the researched bands in the spec):

| priceKey | Package | fromUsd |
|---|---|---|
| `mara2` | 2-Day Masai Mara Escape | 420 |
| `mara3` | 3-Day Masai Mara Classic | 620 |
| `mara-nakuru4` | 4-Day Masai Mara & Lake Nakuru | 880 |
| `mara-nakuru-naivasha5` | 5-Day Mara, Nakuru & Naivasha | 1,080 |
| `mara-nakuru-amboseli6` | 6-Day Mara, Nakuru & Amboseli | 1,340 |
| `best-of-kenya7` | 7-Day Best of Kenya | 1,590 |

- [ ] **Step 1: Write the failing test at `test/packages.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import packages, { PRICES } from '../data/packages.js';
import destinations from '../data/destinations.js';
import { validatePackage, assertAllValid } from '../lib/validate.js';

test('every package passes schema validation', () => {
  assert.doesNotThrow(() => assertAllValid(packages, validatePackage, 'package'));
});

test('slugs are unique', () => {
  const slugs = packages.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('every priceKey resolves to a price entry', () => {
  for (const pkg of packages) {
    assert.ok(PRICES[pkg.priceKey], `no PRICES entry for ${pkg.priceKey}`);
    assert.equal(typeof PRICES[pkg.priceKey].fromUsd, 'number');
    assert.ok(PRICES[pkg.priceKey].fromUsd > 0);
  }
});

test('every destination slug on a package exists in destinations.js', () => {
  const known = new Set(destinations.map((d) => d.slug));
  for (const pkg of packages) {
    for (const slug of pkg.destinations) {
      assert.ok(known.has(slug), `${pkg.slug} references unknown destination "${slug}"`);
    }
  }
});

test('the PLACEHOLDER price warning is present', () => {
  const source = readFileSync(new URL('../data/packages.js', import.meta.url), 'utf8');
  assert.match(source, /PLACEHOLDER — EDIT BEFORE LAUNCH/);
});

test('no price is hard-coded outside the PRICES block', () => {
  const source = readFileSync(new URL('../data/packages.js', import.meta.url), 'utf8');
  const afterPrices = source.slice(source.indexOf('export default'));
  assert.doesNotMatch(afterPrices, /\$\s?\d/, 'a dollar figure appears in package copy');
});

test('the 6 Masai Mara & Rift Valley packages are present', () => {
  const mara = packages.filter((p) => p.category === 'Masai Mara & Rift Valley');
  assert.equal(mara.length, 6);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/packages.test.js`
Expected: FAIL — `Cannot find module '../data/packages.js'`

- [ ] **Step 3: Author `data/packages.js` with `PRICES` and the 6 Mara/Rift packages**

Titles and slugs, exactly:

| Title | slug | days | nights | destinations |
|---|---|---|---|---|
| 2-Day Masai Mara Escape | `2-day-masai-mara-escape` | 2 | 1 | `['masai-mara']` |
| 3-Day Masai Mara Classic | `3-day-masai-mara-classic` | 3 | 2 | `['masai-mara']` |
| 4-Day Masai Mara & Lake Nakuru | `4-day-masai-mara-lake-nakuru` | 4 | 3 | `['masai-mara']` |
| 5-Day Mara, Nakuru & Naivasha | `5-day-mara-nakuru-naivasha` | 5 | 4 | `['masai-mara']` |
| 6-Day Mara, Nakuru & Amboseli | `6-day-mara-nakuru-amboseli` | 6 | 5 | `['masai-mara','amboseli']` |
| 7-Day Best of Kenya | `7-day-best-of-kenya` | 7 | 6 | `['masai-mara','amboseli']` |

**Copy rules — this is the reference-site risk point:**
- The package *concepts* come from the Triptick reference set; **every word must be original**. Write the itineraries from the route logic (Nairobi → park → drives → return), not by paraphrasing another operator's sentences.
- Write in Nissa's first-person voice where natural, matching the existing site ("I guide…", "we leave Nairobi at…").
- No package copy may contain a currency figure — the test above enforces this.

Hero photo mapping for these six: `p03.jpg`, `lion.jpg`, `p01.jpg`, `p13.jpg`, `p14.jpg`, `p15.jpg`. Alt text describes the frame only.

- [ ] **Step 4: Run the test and verify it passes**

Run: `node --test test/packages.test.js`
Expected: PASS — 7 tests

- [ ] **Step 5: Commit**

```bash
git add data/packages.js test/packages.test.js
git commit -m "feat: add price table and 6 Masai Mara & Rift Valley packages"
```

---

## Task 7: Package data — Amboseli & Tsavo (4) and Laikipia & the North (5)

**Files:**
- Modify: `data/packages.js`
- Modify: `test/packages.test.js`

**Interfaces:**
- Consumes: everything from Task 6
- Produces: `packages` grows to 15 entries; `PRICES` gains 9 keys

| Title | slug | days | nights | destinations | priceKey | fromUsd | signature |
|---|---|---|---|---|---|---|---|
| 3-Day Amboseli Under Kilimanjaro | `3-day-amboseli-under-kilimanjaro` | 3 | 2 | `['amboseli']` | `amboseli3` | 590 | false |
| 2-Day Tsavo East | `2-day-tsavo-east` | 2 | 1 | `['tsavo']` | `tsavo2` | 390 | false |
| 3-Day Tsavo East & Tsavo West | `3-day-tsavo-east-tsavo-west` | 3 | 2 | `['tsavo']` | `tsavo3` | 610 | false |
| 4-Day Tsavo & Amboseli | `4-day-tsavo-amboseli` | 4 | 3 | `['tsavo','amboseli']` | `tsavo-amboseli4` | 850 | false |
| 3-Day Samburu Special Five | `3-day-samburu-special-five` | 3 | 2 | `['samburu']` | `samburu3` | 650 | false |
| 2-Day Ol Pejeta Rhino Safari | `2-day-ol-pejeta-rhino-safari` | 2 | 1 | `['ol-pejeta']` | `olpejeta2` | 430 | false |
| 4-Day Samburu & Ol Pejeta | `4-day-samburu-ol-pejeta` | 4 | 3 | `['samburu','ol-pejeta']` | `samburu-olpejeta4` | 940 | false |
| 4-Day Borana & Lewa Conservation Safari | `4-day-borana-lewa-conservation-safari` | 4 | 3 | `['laikipia']` | `borana-lewa4` | 1,180 | **true** |
| 3-Day Laikipia Walking & Tracking Safari | `3-day-laikipia-walking-tracking-safari` | 3 | 2 | `['laikipia']` | `laikipia-walking3` | 890 | **true** |

Hero photos: `p14.jpg`, `p10.jpg`, `p11.jpg`, `p05.jpg`, `kudu.jpg`, `p08.jpg`, `giraffe.jpg`, `p12.jpg`, `mukogodo.jpg`.

The two **signature** packages are Nissa's own ground. Their `overview` may and should draw on his real experience at Borana, Lewa and Laragai House — this is the site's strongest differentiator. The Borana & Lewa package should fold in the genuine activities already documented on the current site: rhino tracking on foot at dawn with the anti-poaching team, day and night game drives, horseback safari, anti-poaching patrol, astronomy of the southern sky.

- [ ] **Step 1: Add the failing count assertions to `test/packages.test.js`**

```js
test('the 4 Amboseli & Tsavo packages are present', () => {
  assert.equal(packages.filter((p) => p.category === 'Amboseli & Tsavo').length, 4);
});

test('the 5 Laikipia & the North packages are present', () => {
  assert.equal(packages.filter((p) => p.category === 'Laikipia & the North').length, 5);
});

test('exactly 2 packages are flagged signature', () => {
  const signature = packages.filter((p) => p.signature).map((p) => p.slug).sort();
  assert.deepEqual(signature, [
    '3-day-laikipia-walking-tracking-safari',
    '4-day-borana-lewa-conservation-safari',
  ]);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/packages.test.js`
Expected: FAIL — 3 assertions fail on counts (`0 !== 4`, `0 !== 5`, `[] deepEqual [...]`)

- [ ] **Step 3: Author the 9 packages into `data/packages.js`**

Add the 9 `PRICES` entries and the 9 objects per the table. Same copy rules as Task 6.

- [ ] **Step 4: Run the test and verify it passes**

Run: `node --test test/packages.test.js`
Expected: PASS — 10 tests, `packages.length === 15`

- [ ] **Step 5: Commit**

```bash
git add data/packages.js test/packages.test.js
git commit -m "feat: add Amboseli, Tsavo, Samburu, Ol Pejeta and Laikipia packages"
```

---

## Task 8: Package data — Mount Kenya (3) and Coast (3)

**Files:**
- Modify: `data/packages.js`
- Modify: `test/packages.test.js`

**Interfaces:**
- Consumes: everything from Tasks 6–7
- Produces: `packages` reaches its final 21 entries

| Title | slug | days | nights | destinations | priceKey | fromUsd |
|---|---|---|---|---|---|---|
| 4-Day Mount Kenya — Naro Moru Route | `4-day-mount-kenya-naro-moru-route` | 4 | 3 | `['mount-kenya']` | `mtkenya-naromoru4` | 720 |
| 5-Day Mount Kenya — Sirimon to Chogoria | `5-day-mount-kenya-sirimon-to-chogoria` | 5 | 4 | `['mount-kenya']` | `mtkenya-sirimon5` | 980 |
| 6-Day Mount Kenya — Chogoria Traverse | `6-day-mount-kenya-chogoria-traverse` | 6 | 5 | `['mount-kenya']` | `mtkenya-chogoria6` | 1,180 |
| 4-Day Diani Beach | `4-day-diani-beach` | 4 | 3 | `['diani']` | `diani4` | 560 |
| 6-Day Tsavo & Diani | `6-day-tsavo-diani` | 6 | 5 | `['tsavo','diani']` | `tsavo-diani6` | 1,120 |
| 8-Day Masai Mara & Diani | `8-day-masai-mara-diani` | 8 | 7 | `['masai-mara','diani']` | `mara-diani8` | 1,780 |

Hero photos: `p16.jpg`, `p17.jpg`, `p18.jpg`, `p09.jpg`, `p04.jpg`, `plane.jpg`.

Mount Kenya itineraries must name real huts/camps on each route and treat **Point Lenana (4,985 m)** as the trekking summit — not Batian or Nelion, which are technical climbs. Include altitude-acclimatisation notes in `bestTime` or the FAQs.

- [ ] **Step 1: Add the failing assertions to `test/packages.test.js`**

```js
test('there are exactly 21 packages', () => {
  assert.equal(packages.length, 21);
});

test('the 3 Mount Kenya packages are present', () => {
  assert.equal(packages.filter((p) => p.category === 'Mount Kenya').length, 3);
});

test('the 3 Coast packages are present', () => {
  assert.equal(packages.filter((p) => p.category === 'Coast').length, 3);
});

test('every destination has at least one package', () => {
  const covered = new Set(packages.flatMap((p) => p.destinations));
  for (const dest of destinations) {
    assert.ok(covered.has(dest.slug), `no package visits ${dest.slug}`);
  }
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/packages.test.js`
Expected: FAIL — `15 !== 21`, plus the Mount Kenya, Coast and coverage assertions

- [ ] **Step 3: Author the 6 packages into `data/packages.js`**

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test`
Expected: PASS — all suites green, `packages.length === 21`

- [ ] **Step 5: Commit**

```bash
git add data/packages.js test/packages.test.js
git commit -m "feat: add Mount Kenya climbing and Diani coast packages"
```

---

## Task 9: SEO head and JSON-LD builders

**Files:**
- Create: `lib/seo.js`
- Test: `test/seo.test.js`

**Interfaces:**
- Consumes: `html`, `raw` from `lib/html.js`; `absoluteUrl`, `ORIGIN` from `lib/paths.js`; `site` from `data/site.js`
- Produces:
  - `headTags({ title, description, path, image, type }) => RawHtml`
  - `jsonLd(object) => RawHtml` — wraps in `<script type="application/ld+json">`
  - `travelAgencySchema() => object`
  - `personSchema() => object`
  - `touristTripSchema(pkg) => object`
  - `placeSchema(dest) => object`
  - `breadcrumbSchema(crumbs: {name, path}[]) => object`
  - `faqPageSchema(faqs: {q,a}[]) => object`

**JSON-LD is data, not markup** — it is serialised with `JSON.stringify`, then `<` `>` `&` are escaped as `\u003c` `\u003e` `\u0026` so it can never break out of the `<script>` element. This is what keeps the strict CSP intact.

- [ ] **Step 1: Write the failing test at `test/seo.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToString } from '../lib/html.js';
import {
  headTags, jsonLd, travelAgencySchema, personSchema,
  touristTripSchema, placeSchema, breadcrumbSchema, faqPageSchema,
} from '../lib/seo.js';
import packages from '../data/packages.js';
import destinations from '../data/destinations.js';

const parseLd = (node) => {
  const rendered = renderToString(node);
  const body = rendered.replace(/^<script type="application\/ld\+json">/, '').replace(/<\/script>$/, '');
  return JSON.parse(body);
};

test('headTags emits title, description, canonical and og:url', () => {
  const out = renderToString(headTags({
    title: 'Test Page', description: 'A description.', path: '/safaris/',
  }));
  assert.match(out, /<title>Test Page<\/title>/);
  assert.match(out, /<meta name="description" content="A description\.">/);
  assert.match(out, /<link rel="canonical" href="https:\/\/nissasafaris\.com\/safaris\/">/);
  assert.match(out, /<meta property="og:url" content="https:\/\/nissasafaris\.com\/safaris\/">/);
});

test('headTags escapes quotes in metadata', () => {
  const out = renderToString(headTags({
    title: 'A "quoted" title', description: 'x', path: '/',
  }));
  assert.match(out, /A &quot;quoted&quot; title/);
  assert.doesNotMatch(out, /content="A "quoted"/);
});

test('headTags emits absolute og:image', () => {
  const out = renderToString(headTags({
    title: 't', description: 'd', path: '/', image: '/assets/lion.jpg',
  }));
  assert.match(out, /content="https:\/\/nissasafaris\.com\/assets\/lion\.jpg"/);
});

test('jsonLd escapes angle brackets so it cannot break out of the script tag', () => {
  const out = renderToString(jsonLd({ name: '</script><img onerror=alert(1)>' }));
  assert.doesNotMatch(out, /<\/script><img/);
  assert.match(out, /\\u003c/);
});

test('travelAgencySchema is valid and names the business', () => {
  const schema = travelAgencySchema();
  assert.equal(schema['@type'], 'TravelAgency');
  assert.equal(schema.name, 'Nissa Safaris');
  assert.equal(schema.url, 'https://nissasafaris.com/');
  assert.ok(schema.areaServed);
  assert.ok(Array.isArray(schema.sameAs));
});

test('personSchema names Nissa and lists his affiliations', () => {
  const schema = personSchema();
  assert.equal(schema['@type'], 'Person');
  assert.equal(schema.name, 'Nissa Ole Kinyaga');
  assert.equal(schema.jobTitle, 'Safari Guide');
  assert.ok(schema.worksFor);
  assert.ok(schema.alumniOf);
});

test('touristTripSchema carries an Offer with the package price', () => {
  const schema = touristTripSchema(packages[0]);
  assert.equal(schema['@type'], 'TouristTrip');
  assert.equal(schema.offers['@type'], 'Offer');
  assert.equal(schema.offers.priceCurrency, 'USD');
  assert.ok(Number(schema.offers.price) > 0);
  assert.match(schema.url, /^https:\/\/nissasafaris\.com\/safaris\/.+\/$/);
});

test('touristTripSchema itinerary length matches the package days', () => {
  const pkg = packages.find((p) => p.days === 3);
  assert.equal(touristTripSchema(pkg).itinerary.length, 3);
});

test('placeSchema is a TouristAttraction in Kenya', () => {
  const schema = placeSchema(destinations[0]);
  assert.equal(schema['@type'], 'TouristAttraction');
  assert.equal(schema.address.addressCountry, 'KE');
});

test('breadcrumbSchema numbers positions from 1', () => {
  const schema = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Safaris', path: '/safaris/' },
  ]);
  assert.equal(schema['@type'], 'BreadcrumbList');
  assert.equal(schema.itemListElement[0].position, 1);
  assert.equal(schema.itemListElement[1].position, 2);
  assert.equal(schema.itemListElement[1].item, 'https://nissasafaris.com/safaris/');
});

test('faqPageSchema maps q/a onto Question/Answer', () => {
  const schema = faqPageSchema([{ q: 'How long?', a: 'Three days.' }]);
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema.mainEntity[0]['@type'], 'Question');
  assert.equal(schema.mainEntity[0].name, 'How long?');
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, 'Three days.');
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/seo.test.js`
Expected: FAIL — `Cannot find module '../lib/seo.js'`

- [ ] **Step 3: Implement `lib/seo.js`**

```js
import { html, raw } from './html.js';
import { absoluteUrl } from './paths.js';
import site from '../data/site.js';
import { PRICES } from '../data/packages.js';

export function headTags({ title, description, path, image, type = 'website' }) {
  const url = absoluteUrl(path);
  const shareImage = absoluteUrl(image ?? site.defaultShareImage);
  return html`<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${shareImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${shareImage}">`;
}

export function jsonLd(object) {
  const serialised = JSON.stringify(object)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  return raw(`<script type="application/ld+json">${serialised}</script>`);
}

export function travelAgencySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${site.origin}/#organisation`,
    name: site.name,
    description: site.description,
    url: `${site.origin}/`,
    logo: absoluteUrl(site.logo),
    image: absoluteUrl(site.defaultShareImage),
    email: site.email,
    telephone: site.phones[0],
    address: { '@type': 'PostalAddress', addressCountry: 'KE', addressRegion: 'Laikipia' },
    areaServed: { '@type': 'Country', name: 'Kenya' },
    founder: { '@id': `${site.origin}/about/#nissa` },
    sameAs: [`https://instagram.com/${site.instagram}`],
    knowsLanguage: ['en', 'sw'],
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.origin}/about/#nissa`,
    name: site.guide,
    jobTitle: 'Safari Guide',
    description: `Silver-rated Kenyan safari guide with over twenty years in the field.`,
    image: absoluteUrl(site.portrait),
    url: `${site.origin}/about/`,
    nationality: { '@type': 'Country', name: 'Kenya' },
    alumniOf: { '@type': 'EducationalOrganization', name: 'Kenya Utalii College' },
    worksFor: { '@id': `${site.origin}/#organisation` },
    knowsAbout: [
      'Wildlife guiding', 'Ornithology', 'Big cat tracking', 'Walking safaris',
      'Rhino conservation', 'Astronomy', 'Bush first aid',
    ],
    affiliation: site.workedAt.map((w) => ({ '@type': 'Organization', name: w.name })),
    sameAs: [`https://instagram.com/${site.instagram}`],
  };
}

export function touristTripSchema(pkg) {
  const url = `${site.origin}/safaris/${pkg.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.summary,
    url,
    image: absoluteUrl(pkg.hero),
    provider: { '@id': `${site.origin}/#organisation` },
    tourBookingPage: `${site.origin}/contact/`,
    itinerary: pkg.itinerary.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'TouristDestination', name: entry.title, description: entry.body },
    })),
    offers: {
      '@type': 'Offer',
      price: String(PRICES[pkg.priceKey].fromUsd),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${site.origin}/contact/`,
    },
  };
}

export function placeSchema(dest) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: dest.name,
    description: dest.summary,
    url: `${site.origin}/destinations/${dest.slug}/`,
    image: absoluteUrl(dest.hero),
    address: { '@type': 'PostalAddress', addressCountry: 'KE' },
    touristType: 'Wildlife and nature travellers',
  };
}

export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqPageSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `node --test test/seo.test.js`
Expected: PASS — 11 tests

- [ ] **Step 5: Commit**

```bash
git add lib/seo.js test/seo.test.js
git commit -m "feat: add SEO head tag and JSON-LD schema builders"
```

---

## Task 10: Stylesheet — design tokens and component classes

**Files:**
- Create: `styles.css`
- Test: `test/styles.test.js`

**Interfaces:**
- Consumes: nothing
- Produces: the class names every template in Tasks 11–17 uses. **This list is contractual** — templates reference these exact names:

```
Layout:     .wrap .wrap-narrow .section .section-alt .section-ink .section-forest
Nav:        .nav .nav-bar .nav-logo .nav-links .nav-link .nav-cta
            .menu .menu-open .menu-close .menu-link
Type:       .display .display-lg .h2 .h3 .h4 .lede .body .label .eyebrow .quote .cite
Buttons:    .btn .btn-ghost .btn-ink .btn-gold
Cards:      .card .card-media .card-body .pkg-card .pkg-card-media .pkg-card-body
            .pkg-meta .pkg-price .badge .badge-signature
Grids:      .grid .grid-2 .grid-3 .grid-4 .grid-auto
Package:    .pkg-hero .itinerary .itinerary-day .itinerary-num .incl-excl
            .incl .excl .faq .faq-item .best-time
Dest:       .dest-hero .dest-facts .nissa-note
Gallery:    .gal .gal-track .gal-item .galbtn .lb .lb-img .lb-meta
Form:       .form .field .field-label .field-input .field-textarea .field-check
Footer:     .footer .footer-grid .footer-links .footer-legal
Utility:    .visually-hidden .skip-link .reveal .glass .refract
Breadcrumb: .crumbs .crumb
```

- [ ] **Step 1: Write the failing test at `test/styles.test.js`**

```js
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/styles.test.js`
Expected: FAIL — `ENOENT: no such file or directory, open '.../styles.css'`

- [ ] **Step 3: Author `styles.css`**

Port the visual language from the inline styles in the existing `index.html`. Structure the file as: reset → tokens in `:root` → base elements → keyframes (`nk_pan`, `nk_fade`, `nk_rise` — keep the existing names, `app.js` references them) → components in the order of the class list above → responsive breakpoints at 1100px, 860px and 620px → `@media (prefers-reduced-motion: reduce)` disabling all animation and transition.

Preserve exactly: the Ken-Burns hero pan, glassmorphism (`backdrop-filter: blur(22px) saturate(1.2)` plus the SVG `#nk-refract` filter), the gold gradient scroll-progress bar, the grain/wash overlays, and the `clamp()`-based fluid type scale.

- [ ] **Step 4: Run the test and verify it passes**

Run: `node --test test/styles.test.js`
Expected: PASS — 6 tests

- [ ] **Step 5: Commit**

```bash
git add styles.css test/styles.test.js
git commit -m "feat: extract design tokens and component classes into styles.css"
```

---

## Task 11: Page layout shell and shared partials

**Files:**
- Create: `templates/layout.js`, `templates/partials.js`
- Test: `test/layout.test.js`

**Interfaces:**
- Consumes: `html`, `renderToString`; `headTags`, `jsonLd`, `breadcrumbSchema`; `site`
- Produces:
  - `layout({ title, description, path, image, type, schemas = [], crumbs = [], preloadImage, body }) => string` — the complete `<!DOCTYPE html>` document
  - `packageCard(pkg) => RawHtml`
  - `ctaBlock({ heading, body, packageTitle }) => RawHtml`
  - `sectionHeading({ number, eyebrow, heading }) => RawHtml`
  - `breadcrumbNav(crumbs) => RawHtml`
  - `whatsappLink(packageTitle?) => string` — `https://wa.me/254707415444?text=…`

- [ ] **Step 1: Write the failing test at `test/layout.test.js`**

```js
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
  assert.match(card, /From \$\d/);
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/layout.test.js`
Expected: FAIL — `Cannot find module '../templates/layout.js'`

- [ ] **Step 3: Implement `templates/partials.js`**

`whatsappLink` builds `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`, where the message is `Hello Nissa, I'd love to plan the ${packageTitle} with you.` when a title is given and `Hello Nissa, I'd love to plan a safari with you.` otherwise.

`packageCard` renders an `<article class="pkg-card">` containing the hero image (`loading="lazy"`, `decoding="async"`, `alt` from `pkg.heroAlt`), a `.badge-signature` when `pkg.signature`, the title as an `<h3>`, `pkg.summary`, a `.pkg-meta` line reading `${pkg.days} days · ${pkg.destinations.length} destination(s)`, a `.pkg-price` reading `From $${PRICES[pkg.priceKey].fromUsd} per person`, and a link to `/safaris/${pkg.slug}/`.

- [ ] **Step 4: Implement `templates/layout.js`**

The `<head>` carries, in order: charset, viewport (`width=device-width, initial-scale=1, viewport-fit=cover`), the CSP meta (with `style-src 'self' https://fonts.googleapis.com`), referrer, color-scheme, theme-color `#22291E`, format-detection, favicon, `headTags(...)`, font preconnects and the Google Fonts stylesheet, `<link rel="preload" as="image">` for `preloadImage` when supplied, `<link rel="stylesheet" href="/styles.css">`, then every schema through `jsonLd`. `breadcrumbSchema(crumbs)` is appended automatically when `crumbs.length > 1`.

The `<body>` carries: skip link, cursor/dot/progress elements (ids unchanged so `app.js` keeps working), nav, mobile menu, `body`, footer, consent banner, floating WhatsApp button, then `<script src="/app.js" defer></script>`.

- [ ] **Step 5: Run the test and verify it passes**

Run: `node --test test/layout.test.js`
Expected: PASS — 12 tests

- [ ] **Step 6: Commit**

```bash
git add templates/layout.js templates/partials.js test/layout.test.js
git commit -m "feat: add page layout shell and shared template partials"
```

---

## Task 12: Build script and the package page template

**Files:**
- Create: `build.js`, `templates/package.js`
- Test: `test/build.test.js`

**Interfaces:**
- Consumes: everything from Tasks 1–11
- Produces:
  - `build.js` — `npm run build` writes `dist/`; exports `pages()` returning `{ path, html }[]` for testing
  - `packagePage(pkg) => string`

The build must: clear `dist/`, validate all data (throwing on any problem), copy `assets/`, `styles.css` and `app.js` into `dist/`, then write every page.

- [ ] **Step 1: Write the failing test at `test/build.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import packages from '../data/packages.js';

const all = pages();
const byPath = new Map(all.map((p) => [p.path, p.html]));

test('one page is emitted per package', () => {
  for (const pkg of packages) {
    assert.ok(byPath.has(`/safaris/${pkg.slug}/`), `missing page for ${pkg.slug}`);
  }
});

test('every page has a unique title', () => {
  const titles = all
    .filter((p) => p.path.endsWith('/'))
    .map((p) => p.html.match(/<title>(.*?)<\/title>/)[1]);
  assert.equal(new Set(titles).size, titles.length, 'duplicate <title> found');
});

test('every page has a unique meta description of 50-165 chars', () => {
  const descriptions = all
    .filter((p) => p.path.endsWith('/'))
    .map((p) => p.html.match(/<meta name="description" content="(.*?)">/)[1]);
  assert.equal(new Set(descriptions).size, descriptions.length);
  for (const d of descriptions) {
    assert.ok(d.length >= 50 && d.length <= 165, `description length ${d.length}: ${d}`);
  }
});

test('every page canonical matches its own path', () => {
  for (const { path, html } of all) {
    if (!path.endsWith('/')) continue;
    assert.ok(
      html.includes(`<link rel="canonical" href="https://nissasafaris.com${path}">`),
      `bad canonical on ${path}`
    );
  }
});

test('a package page renders its full itinerary', () => {
  const pkg = packages.find((p) => p.days === 3);
  const page = byPath.get(`/safaris/${pkg.slug}/`);
  for (const entry of pkg.itinerary) {
    assert.ok(page.includes(entry.title), `missing itinerary entry "${entry.title}"`);
  }
});

test('a package page carries TouristTrip and FAQPage schema', () => {
  const page = byPath.get(`/safaris/${packages[0].slug}/`);
  assert.match(page, /"@type":"TouristTrip"/);
  assert.match(page, /"@type":"FAQPage"/);
  assert.match(page, /"@type":"BreadcrumbList"/);
});

test('a package page CTA reaches WhatsApp prefilled with the package name', () => {
  const pkg = packages[0];
  const page = byPath.get(`/safaris/${pkg.slug}/`);
  const match = page.match(/https:\/\/wa\.me\/254707415444\?text=([^"]+)/);
  assert.ok(match, 'no WhatsApp link on the page');
  assert.match(decodeURIComponent(match[1]), new RegExp(pkg.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('every internal href resolves to a page the build emits', () => {
  const known = new Set(all.map((p) => p.path));
  for (const { path, html } of all) {
    const hrefs = [...html.matchAll(/href="(\/[^"#]*?)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (href.startsWith('/assets/') || href === '/styles.css' || href === '/app.js') continue;
      assert.ok(known.has(href), `${path} links to ${href}, which is not built`);
    }
  }
});

test('no image is missing alt text', () => {
  for (const { path, html } of all) {
    const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    for (const img of imgs) {
      assert.ok(/\salt="/.test(img), `${path} has an <img> with no alt attribute`);
    }
  }
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/build.test.js`
Expected: FAIL — `Cannot find module '../build.js'`

- [ ] **Step 3: Implement `templates/package.js`**

`packagePage(pkg)` calls `layout(...)` with:
- `title`: `` `${pkg.title} — Kenya Safari | Nissa Safaris` ``
- `description`: `pkg.summary` padded to 50–165 characters (the build test enforces the range)
- `path`: `/safaris/${pkg.slug}/`
- `image`: `pkg.hero`, `preloadImage`: `pkg.hero`
- `type`: `'article'`
- `crumbs`: Home → Safaris → `pkg.title`
- `schemas`: `[touristTripSchema(pkg), faqPageSchema(pkg.faqs)]`

Body sections in order: `.pkg-hero` (image, `<h1>`, days/nights, from-price) → overview paragraphs → `.itinerary` (`<ol>`, one `.itinerary-day` per entry) → `.incl-excl` (two lists) → `.best-time` → `.faq` (`<h2>Common questions</h2>`, each `.faq-item` an `<h3>` + `<p>`) → `ctaBlock({ packageTitle: pkg.title })` → related packages (up to 3 sharing a destination, rendered with `packageCard`).

- [ ] **Step 4: Implement `build.js`**

```js
import { mkdir, rm, writeFile, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import packages from './data/packages.js';
import destinations from './data/destinations.js';
import { validatePackage, validateDestination, assertAllValid } from './lib/validate.js';
import { outputPath } from './lib/paths.js';
import { packagePage } from './templates/package.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

export function pages() {
  assertAllValid(packages, validatePackage, 'package');
  assertAllValid(destinations, validateDestination, 'destination');

  const out = [];
  for (const pkg of packages) {
    out.push({ path: `/safaris/${pkg.slug}/`, html: packagePage(pkg) });
  }
  return out;
}

export async function build() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await cp(join(ROOT, 'assets'), join(DIST, 'assets'), { recursive: true });
  await cp(join(ROOT, 'styles.css'), join(DIST, 'styles.css'));
  await cp(join(ROOT, 'app.js'), join(DIST, 'app.js'));

  for (const page of pages()) {
    const file = join(DIST, outputPath(page.path));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, page.html, 'utf8');
  }
  console.log(`Built ${pages().length} pages into dist/`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await build();
}
```

**Note:** the "unique title", "internal href resolves" and "unique description" tests will fail until Tasks 13–17 add the remaining pages — the package pages link to `/`, `/safaris/` and `/contact/`, which do not exist yet. Until then, run only the assertions that apply:

- [ ] **Step 5: Run the package-specific assertions and verify they pass**

Run: `node --test test/build.test.js 2>&1 | grep -E "^(not )?ok"`
Expected: the itinerary, schema, CTA, alt-text and canonical tests PASS; the "internal href resolves" test FAILS pending Tasks 13–17. Do not weaken the test — it is the acceptance gate for Task 17.

- [ ] **Step 6: Run the build end to end**

Run: `npm run build && ls dist/safaris | wc -l`
Expected: `21`

- [ ] **Step 7: Commit**

```bash
git add build.js templates/package.js test/build.test.js
git commit -m "feat: add build script and package page template"
```

---

## Task 13: Destination pages and the destinations index

**Files:**
- Create: `templates/destination.js`, `templates/destinations.js`
- Modify: `build.js`
- Test: `test/destination-pages.test.js`

**Interfaces:**
- Consumes: `layout`, `packageCard`, `placeSchema`, `breadcrumbSchema`
- Produces: `destinationPage(dest, packagesHere) => string`, `destinationsIndexPage(destinations) => string`

- [ ] **Step 1: Write the failing test at `test/destination-pages.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import destinations from '../data/destinations.js';
import packages from '../data/packages.js';

const byPath = new Map(pages().map((p) => [p.path, p.html]));

test('one page is emitted per destination, plus an index', () => {
  assert.ok(byPath.has('/destinations/'));
  for (const dest of destinations) {
    assert.ok(byPath.has(`/destinations/${dest.slug}/`), `missing ${dest.slug}`);
  }
});

test('a destination page lists every package that visits it', () => {
  for (const dest of destinations) {
    const page = byPath.get(`/destinations/${dest.slug}/`);
    const here = packages.filter((p) => p.destinations.includes(dest.slug));
    assert.ok(here.length > 0);
    for (const pkg of here) {
      assert.ok(page.includes(`/safaris/${pkg.slug}/`), `${dest.slug} omits ${pkg.slug}`);
    }
  }
});

test('destination pages carry TouristAttraction schema', () => {
  const page = byPath.get(`/destinations/${destinations[0].slug}/`);
  assert.match(page, /"@type":"TouristAttraction"/);
});

test('the first-hand note renders only where nissaNote is set', () => {
  for (const dest of destinations) {
    const page = byPath.get(`/destinations/${dest.slug}/`);
    const hasBlock = page.includes('class="nissa-note"');
    assert.equal(hasBlock, Boolean(dest.nissaNote), `nissa-note mismatch on ${dest.slug}`);
  }
});

test('the destinations index links to all 8', () => {
  const index = byPath.get('/destinations/');
  for (const dest of destinations) {
    assert.ok(index.includes(`/destinations/${dest.slug}/`), `index omits ${dest.slug}`);
  }
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/destination-pages.test.js`
Expected: FAIL — `byPath.has('/destinations/')` is false

- [ ] **Step 3: Implement `templates/destination.js` and `templates/destinations.js`**

Destination page body: `.dest-hero` → overview paragraphs → `.dest-facts` (wildlife highlights, best time, getting there) → `.nissa-note` **only when `dest.nissaNote` is truthy** → "Safaris that visit \<name\>" grid of `packageCard`s → `ctaBlock`.

Index page body: intro → `.grid-3` of destination cards, each with hero, name, summary, and a count of packages that visit it.

- [ ] **Step 4: Register both in `build.js`**

Add to `pages()`, after the package loop:

```js
out.push({ path: '/destinations/', html: destinationsIndexPage(destinations) });
for (const dest of destinations) {
  const here = packages.filter((p) => p.destinations.includes(dest.slug));
  out.push({ path: `/destinations/${dest.slug}/`, html: destinationPage(dest, here) });
}
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `node --test test/destination-pages.test.js`
Expected: PASS — 5 tests

- [ ] **Step 6: Commit**

```bash
git add templates/destination.js templates/destinations.js build.js test/destination-pages.test.js
git commit -m "feat: add destination pages and destinations index"
```

---

## Task 14: Safaris index with client-side filtering

**Files:**
- Create: `templates/safaris.js`
- Modify: `build.js`, `app.js`, `styles.css`
- Test: `test/safaris-index.test.js`

**Interfaces:**
- Consumes: `layout`, `packageCard`
- Produces: `safarisIndexPage(packages, destinations) => string`

Filtering is **progressive enhancement**: every one of the 21 cards is in the static HTML, grouped by category. The filter controls hide and show cards via a class. A visitor with JS disabled — and every crawler — sees all 21.

- [ ] **Step 1: Write the failing test at `test/safaris-index.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pages } from '../build.js';
import packages from '../data/packages.js';

const index = new Map(pages().map((p) => [p.path, p.html])).get('/safaris/');

test('the safaris index exists', () => {
  assert.ok(index);
});

test('all 21 packages are in the static HTML', () => {
  for (const pkg of packages) {
    assert.ok(index.includes(`/safaris/${pkg.slug}/`), `index omits ${pkg.slug}`);
  }
});

test('every card carries filter data attributes', () => {
  const cards = [...index.matchAll(/<article class="pkg-card"[^>]*>/g)].map((m) => m[0]);
  assert.equal(cards.length, 21);
  for (const card of cards) {
    assert.match(card, /data-destinations="/);
    assert.match(card, /data-days="\d+"/);
    assert.match(card, /data-category="/);
  }
});

test('all five category headings appear', () => {
  for (const category of [
    'Masai Mara &amp; Rift Valley', 'Amboseli &amp; Tsavo',
    'Laikipia &amp; the North', 'Mount Kenya', 'Coast',
  ]) {
    assert.ok(index.includes(category), `missing category heading ${category}`);
  }
});

test('filter controls are real form controls, not divs', () => {
  assert.match(index, /<select[^>]+id="filter-destination"/);
  assert.match(index, /<select[^>]+id="filter-duration"/);
  assert.match(index, /<label[^>]+for="filter-destination"/);
  assert.match(index, /<label[^>]+for="filter-duration"/);
});

test('the filter logic lives in app.js, not inline', () => {
  assert.doesNotMatch(index, /\son[a-z]+=/i);
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(app, /filter-destination/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/safaris-index.test.js`
Expected: FAIL — `index` is undefined

- [ ] **Step 3: Implement `templates/safaris.js`**

Body: `<h1>Kenya safari packages</h1>` → intro → filter bar (two `<select>` elements with `<label>`s, plus a "Showing N of 21" live region with `aria-live="polite"`) → one `<section>` per category, each `<h2>` plus a `.grid-3` of `packageCard`s. Cards get `data-destinations` (space-separated slugs), `data-days` and `data-category`.

- [ ] **Step 4: Add the filter behaviour to `app.js`**

Guard on element presence so the code is inert on other pages:

```js
function initSafariFilters() {
  const destSelect = document.getElementById('filter-destination');
  const daysSelect = document.getElementById('filter-duration');
  if (!destSelect || !daysSelect) return;

  const cards = [...document.querySelectorAll('.pkg-card[data-destinations]')];
  const count = document.getElementById('filter-count');

  function apply() {
    const dest = destSelect.value;
    const band = daysSelect.value;
    let shown = 0;
    for (const card of cards) {
      const days = Number(card.dataset.days);
      const matchesDest = dest === 'all' || card.dataset.destinations.split(' ').includes(dest);
      const matchesBand =
        band === 'all' ||
        (band === 'short' && days <= 3) ||
        (band === 'medium' && days >= 4 && days <= 6) ||
        (band === 'long' && days >= 7);
      const visible = matchesDest && matchesBand;
      card.hidden = !visible;
      if (visible) shown += 1;
    }
    for (const section of document.querySelectorAll('[data-category-section]')) {
      section.hidden = !section.querySelector('.pkg-card:not([hidden])');
    }
    if (count) count.textContent = `Showing ${shown} of ${cards.length} safaris`;
  }

  destSelect.addEventListener('change', apply);
  daysSelect.addEventListener('change', apply);
}
```

Call `initSafariFilters()` from the existing DOM-ready entry point.

- [ ] **Step 5: Register the page in `build.js`**

```js
out.push({ path: '/safaris/', html: safarisIndexPage(packages, destinations) });
```

- [ ] **Step 6: Run the test and verify it passes**

Run: `node --test test/safaris-index.test.js`
Expected: PASS — 6 tests

- [ ] **Step 7: Commit**

```bash
git add templates/safaris.js build.js app.js styles.css test/safaris-index.test.js
git commit -m "feat: add safaris index with progressive-enhancement filtering"
```

---

## Task 15: About page — the Kinyaga story

**Files:**
- Create: `templates/about.js`, `data/about.js`
- Modify: `build.js`
- Test: `test/about.test.js`

**Interfaces:**
- Consumes: `layout`, `personSchema`, `site`
- Produces: `aboutPage() => string`; `data/about.js` exports `{ story[], journey[], expertise[], philosophy[], quotes[] }`

**Migrate verbatim from the existing `index.html`.** The prose in `#story`, `#journey`, `#expertise` and `#philosophy` is Nissa's own voice and the site's E-E-A-T payload — move it into `data/about.js` without rewriting, then apply only these changes:

1. The `#story` third paragraph currently reads "Today I guide at Lengishu, a private home in the heart of the 32,000-acre Borana Conservancy…". Rewrite to reflect freelance work across Kenya while keeping Laikipia as home ground and retaining the Borana detail.
2. The `#journey` final entry "Silver Guide at Lengishu" becomes an entry covering the freelance present, listing Borana, Lewa, Laragai House, Maasai Mara and Tsavo.
3. Add a "Where I have guided" section rendering `site.workedAt`.
4. Keep both existing pull-quotes with their attributions, including "interview with Carrier / Luxury London, 2021".

- [ ] **Step 1: Write the failing test at `test/about.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import site from '../data/site.js';

const about = new Map(pages().map((p) => [p.path, p.html])).get('/about/');

test('the about page exists', () => {
  assert.ok(about);
});

test('carries Person schema anchored to #nissa', () => {
  assert.match(about, /"@type":"Person"/);
  assert.match(about, /"@id":"https:\/\/nissasafaris\.com\/about\/#nissa"/);
});

test('shows the new portrait', () => {
  assert.ok(about.includes(site.portrait));
});

test('retains the biographical facts from the spec', () => {
  for (const fact of [
    'Mukogodo', 'Lewa', 'Kenya Utalii College', '2002', 'ornithology', 'Silver',
  ]) {
    assert.ok(about.includes(fact), `about page lost the fact: ${fact}`);
  }
});

test('lists every place Nissa has worked', () => {
  for (const place of site.workedAt) {
    assert.ok(about.includes(place.name), `about page omits ${place.name}`);
  }
});

test('no longer describes Nissa as working only at Lengishu on Borana', () => {
  assert.doesNotMatch(about, /Today I guide at Lengishu/);
});

test('retains both attributed pull-quotes', () => {
  assert.ok(about.includes('Carrier'));
  assert.match(about, /<blockquote/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/about.test.js`
Expected: FAIL — `about` is undefined

- [ ] **Step 3: Create `data/about.js` by migrating the prose from `index.html`**

- [ ] **Step 4: Implement `templates/about.js`**

Body order: hero with portrait and `<h1>Nissa Ole Kinyaga</h1>` → story with the stat pair (20+ years, 59 Silver guides) → "Where I have guided" → journey timeline → expertise grid → philosophy on the forest background → `ctaBlock`. `schemas: [personSchema()]`.

- [ ] **Step 5: Register in `build.js`**

- [ ] **Step 6: Run the test and verify it passes**

Run: `node --test test/about.test.js`
Expected: PASS — 7 tests

- [ ] **Step 7: Commit**

```bash
git add data/about.js templates/about.js build.js test/about.test.js
git commit -m "feat: add about page carrying the Kinyaga story and Person schema"
```

---

## Task 16: Home page

**Files:**
- Create: `templates/home.js`
- Modify: `build.js`
- Test: `test/home.test.js`

**Interfaces:**
- Consumes: `layout`, `packageCard`, `travelAgencySchema`, `personSchema`
- Produces: `homePage(packages, destinations) => string`

- [ ] **Step 1: Write the failing test at `test/home.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import packages from '../data/packages.js';

const home = new Map(pages().map((p) => [p.path, p.html])).get('/');

test('the home page exists', () => {
  assert.ok(home);
});

test('has exactly one h1 and it names the brand', () => {
  const h1s = [...home.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  assert.equal(h1s.length, 1);
  assert.match(h1s[0][1], /Nissa Safaris|Kenya/);
});

test('carries TravelAgency schema', () => {
  assert.match(home, /"@type":"TravelAgency"/);
});

test('features both signature packages above the fold section', () => {
  for (const pkg of packages.filter((p) => p.signature)) {
    assert.ok(home.includes(`/safaris/${pkg.slug}/`), `home omits signature ${pkg.slug}`);
  }
});

test('links to all 8 destinations', () => {
  const links = [...home.matchAll(/\/destinations\/[a-z-]+\//g)].map((m) => m[0]);
  assert.equal(new Set(links).size, 8);
});

test('preloads its hero image with high fetch priority', () => {
  assert.match(home, /<link rel="preload" as="image" href="\/assets\/[^"]+" fetchpriority="high">/);
});

test('the meta description mentions Kenya and safari', () => {
  const description = home.match(/<meta name="description" content="(.*?)">/)[1];
  assert.match(description, /Kenya/);
  assert.match(description, /safari/i);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/home.test.js`
Expected: FAIL — `home` is undefined

- [ ] **Step 3: Implement `templates/home.js`**

Body order: cinematic hero (Ken-Burns pan on `/assets/lion.jpg`, `<h1>`, tagline, two CTAs — "See all safaris" → `/safaris/`, "Talk to Nissa" → WhatsApp) → "Meet your guide" block using the new portrait, linking `/about/` → signature safaris (the 2 signature packages, large cards) → "Popular safaris" (6 `packageCard`s: `3-day-masai-mara-classic`, `3-day-samburu-special-five`, `2-day-ol-pejeta-rhino-safari`, `3-day-tsavo-east-tsavo-west`, `5-day-mount-kenya-sirimon-to-chogoria`, `7-day-best-of-kenya`) → destinations strip linking all 8 → gallery teaser linking `/gallery/` → `ctaBlock`.

`schemas: [travelAgencySchema(), personSchema()]`, `preloadImage: '/assets/lion.jpg'`.

- [ ] **Step 4: Register in `build.js`**

- [ ] **Step 5: Run the test and verify it passes**

Run: `node --test test/home.test.js`
Expected: PASS — 7 tests

- [ ] **Step 6: Commit**

```bash
git add templates/home.js build.js test/home.test.js
git commit -m "feat: add home page"
```

---

## Task 17: Gallery, journal, contact and privacy pages

**Files:**
- Create: `templates/gallery.js`, `templates/journal.js`, `templates/contact.js`, `templates/privacy.js`, `data/gallery.js`, `data/journal.js`
- Modify: `build.js`, `app.js`
- Test: `test/remaining-pages.test.js`

**Interfaces:**
- Consumes: `layout`, `faqPageSchema`, `whatsappLink`, `packages`
- Produces: `galleryPage()`, `journalPage()`, `contactPage(packages)`, `privacyPage()`

Migrate the gallery manifest out of `app.js` into `data/gallery.js` so the build can emit real `<img>` tags server-side — today the reel is built entirely in JS, which crawlers do not index. `app.js` keeps the carousel and lightbox behaviour but reads from the DOM instead of an inline array.

The contact form's package `<select>` is generated from `data/packages.js` so it can never drift from the 21 packages.

- [ ] **Step 1: Write the failing test at `test/remaining-pages.test.js`**

```js
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/remaining-pages.test.js`
Expected: FAIL — none of the four paths exist

- [ ] **Step 3: Create `data/gallery.js` and `data/journal.js`**

Move the photo array from `app.js` into `data/gallery.js` (fields: `src`, `alt`, `category`, `title`, `story`). Move the three journal entries out of `index.html` into `data/journal.js`.

- [ ] **Step 4: Implement the four templates**

- [ ] **Step 5: Update `app.js`** to read gallery items from the rendered DOM rather than an inline array, keeping the drag, cursor-steering, keyboard and lightbox behaviour intact.

- [ ] **Step 6: Register all four in `build.js`**

- [ ] **Step 7: Run the full suite and verify everything passes**

Run: `npm test`
Expected: PASS — every suite green, **including** the `test/build.test.js` "every internal href resolves to a page the build emits" test that has been failing since Task 12.

- [ ] **Step 8: Commit**

```bash
git add templates/ data/ build.js app.js test/remaining-pages.test.js
git commit -m "feat: add gallery, journal, contact and privacy pages"
```

---

## Task 18: Sitemap, robots.txt and Vercel configuration

**Files:**
- Modify: `build.js`
- Create: `vercel.json`
- Test: `test/sitemap.test.js`

**Interfaces:**
- Consumes: `pages()` from `build.js`, `ORIGIN`
- Produces: `/sitemap.xml` and `/robots.txt` in the emitted page list

- [ ] **Step 1: Write the failing test at `test/sitemap.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pages } from '../build.js';

const byPath = new Map(pages().map((p) => [p.path, p.html]));
const sitemap = byPath.get('/sitemap.xml');

test('a sitemap is emitted', () => {
  assert.ok(sitemap);
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
});

test('the sitemap lists every HTML page and nothing else', () => {
  const htmlPaths = [...byPath.keys()].filter((p) => p.endsWith('/'));
  const listed = [...sitemap.matchAll(/<loc>https:\/\/nissasafaris\.com([^<]*)<\/loc>/g)].map((m) => m[1]);
  assert.deepEqual(listed.sort(), htmlPaths.sort());
});

test('there are 37 pages in the sitemap', () => {
  const listed = [...sitemap.matchAll(/<loc>/g)];
  assert.equal(listed.length, 37);
});

test('robots.txt allows crawling and points at the sitemap', () => {
  const robots = byPath.get('/robots.txt');
  assert.ok(robots);
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/nissasafaris\.com\/sitemap\.xml/);
  assert.doesNotMatch(robots, /^Disallow: \/$/m);
});

test('vercel.json sets security headers and redirects www to apex', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  const headerNames = config.headers
    .flatMap((entry) => entry.headers)
    .map((header) => header.key.toLowerCase());
  for (const name of [
    'strict-transport-security', 'x-frame-options',
    'x-content-type-options', 'referrer-policy',
  ]) {
    assert.ok(headerNames.includes(name), `vercel.json missing ${name}`);
  }
  assert.ok(config.redirects.some((r) => r.source.includes('www') || r.has), 'no www redirect');
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/sitemap.test.js`
Expected: FAIL — `sitemap` is undefined

- [ ] **Step 3: Add sitemap and robots generation to `build.js`**

Append to `pages()`, after every HTML page has been pushed:

```js
const htmlPaths = out.map((page) => page.path);
const urls = htmlPaths
  .map((path) => `  <url><loc>${ORIGIN}${path}</loc><changefreq>monthly</changefreq></url>`)
  .join('\n');
out.push({
  path: '/sitemap.xml',
  html: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
});
out.push({
  path: '/robots.txt',
  html: `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
});
```

- [ ] **Step 4: Create `vercel.json`**

```json
{
  "cleanUrls": true,
  "trailingSlash": true,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/(styles.css|app.js)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600, must-revalidate" }]
    }
  ],
  "redirects": [
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "www.nissasafaris.com" }],
      "destination": "https://nissasafaris.com/$1",
      "permanent": true
    }
  ]
}
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `node --test test/sitemap.test.js`
Expected: PASS — 5 tests, sitemap listing 37 URLs

- [ ] **Step 6: Commit**

```bash
git add build.js vercel.json test/sitemap.test.js
git commit -m "feat: emit sitemap and robots.txt, add Vercel headers and redirects"
```

---

## Task 19: WebP image generation

**Files:**
- Create: `scripts/make-webp.js`
- Modify: `templates/partials.js`, `build.js`
- Test: `test/images.test.js`

**Interfaces:**
- Consumes: nothing
- Produces: `picture({ src, alt, className, lazy, sizes }) => RawHtml` in `templates/partials.js` — a `<picture>` with a WebP `<source>` and a JPEG `<img>` fallback

WebP generation uses the system `cwebp` binary via `node:child_process`. **If `cwebp` is not installed, the script must print an install hint and exit 0** — the build must never depend on it, and `picture()` must degrade to a plain `<img>` when no `.webp` sibling exists.

- [ ] **Step 1: Write the failing test at `test/images.test.js`**

```js
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/images.test.js`
Expected: FAIL — `picture is not a function`

- [ ] **Step 3: Implement `picture()` in `templates/partials.js`**

- [ ] **Step 4: Implement `scripts/make-webp.js`**

For each `assets/*.jpg`, run `cwebp -q 82 <in> -o <out>` when the `.webp` is missing or older than the `.jpg`. Wrap the `cwebp` lookup in a try/catch that prints `cwebp not found — skipping WebP generation (install with: sudo apt install webp)` and exits 0.

- [ ] **Step 5: Add the script to `package.json`**

```json
"images": "node scripts/make-webp.js"
```

and make `build` run it first: `"build": "node scripts/make-webp.js && node build.js"`.

- [ ] **Step 6: Replace every raw `<img>` in the templates with `picture()`**

Hero images pass `lazy: false`; everything else takes the default.

- [ ] **Step 7: Run the tests and the build**

Run: `npm test && npm run build`
Expected: PASS, and `dist/` contains the site with `<picture>` elements

- [ ] **Step 8: Commit**

```bash
git add scripts/make-webp.js templates/partials.js build.js package.json test/images.test.js
git commit -m "perf: serve WebP with JPEG fallback via picture element"
```

---

## Task 20: Delete the old single-page site, update docs, verify the whole build

**Files:**
- Delete: `index.html`
- Modify: `README.md`
- Create: `docs/LAUNCH-CHECKLIST.md`
- Test: `test/no-legacy.test.js`

- [ ] **Step 1: Write the failing test at `test/no-legacy.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { pages } from '../build.js';

test('the legacy single-page index.html is gone', () => {
  assert.equal(existsSync(new URL('../index.html', import.meta.url)), false);
});

test('no page still refers to the old brand-as-title', () => {
  for (const { path, html } of pages()) {
    if (!path.endsWith('/')) continue;
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? '';
    assert.doesNotMatch(title, /Conservation Storyteller/, `${path} keeps the old title`);
  }
});

test('the placeholder price warning is still greppable before launch', () => {
  const source = readFileSync(new URL('../data/packages.js', import.meta.url), 'utf8');
  assert.match(source, /PLACEHOLDER — EDIT BEFORE LAUNCH/);
});

test('the launch checklist exists and names the two blocking assets', () => {
  const checklist = readFileSync(new URL('../docs/LAUNCH-CHECKLIST.md', import.meta.url), 'utf8');
  assert.match(checklist, /assets\/logo\.png/);
  assert.match(checklist, /assets\/portrait\.jpg/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test test/no-legacy.test.js`
Expected: FAIL — `index.html` still exists

- [ ] **Step 3: Delete `index.html` and rewrite `README.md`**

The README must cover: the new build step, the file layout, `npm run build` / `npm test` / `npm run dev`, the Vercel deploy, and a pointer to the launch checklist. Carry forward the existing security, accessibility and performance sections, updating the clickjacking note — `X-Frame-Options` is now set in `vercel.json`, so the gap is closed.

- [ ] **Step 4: Write `docs/LAUNCH-CHECKLIST.md`**

It must contain, as checkboxes:

**Blocking**
- Save the Nissa Safaris logo to `assets/logo.png`
- Save the new field portrait to `assets/portrait.jpg` (overwrites the old one)
- Replace all 21 placeholder prices in `data/packages.js` and delete the `PLACEHOLDER` banner
- Have Nissa fact-check the Amboseli, Lake Nakuru, Lake Naivasha and Diani itineraries — he has not worked those parks
- Point `nissasafaris.com` DNS at Vercel and confirm the `www` redirect resolves

**Off-page SEO — not code, and the highest-leverage work available**
- Create a **Google Business Profile** for Nissa Safaris; verify it; add photos, service area and the website link
- Submit `https://nissasafaris.com/sitemap.xml` in Google Search Console
- Collect guest reviews on the Business Profile, TripAdvisor and SafariBookings
- Request backlinks from Borana, Lewa, Laragai House and Lengishu
- Link the site from the `@nissa_safaris_tours` Instagram bio

**Verify after deploy**
- Google Rich Results Test passes on the home, an about, a package and a destination URL
- Lighthouse: SEO 100, Accessibility ≥ 95, Performance ≥ 90 on `/` and a package page
- No horizontal scroll from 320 px to 1920 px on every template

- [ ] **Step 5: Run the full suite and the build**

Run: `npm test && npm run build`
Expected: PASS on every suite; `find dist -name index.html | wc -l` returns `37`

- [ ] **Step 6: Serve the build and check it by eye**

Run: `npm run dev` and open `http://localhost:8000`
Check: home, `/safaris/`, one package page, one destination page, `/about/`, `/contact/` — at 375 px and 1440 px widths. Confirm no horizontal scrollbar, the filter works, the lightbox opens, and the WhatsApp CTA prefills.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove legacy single-page site, update docs, add launch checklist"
```

---

## Self-Review

**Spec coverage**

| Spec requirement | Task |
|---|---|
| Canonical domain `nissasafaris.com` | 2 (`ORIGIN`), enforced by tests in 9, 12, 18 |
| 37-page IA | 12–17, count asserted in 18 and 20 |
| Build-time templating, no runtime deps | 1, 12 |
| `dist/` gitignored, built by Vercel | 1, 18 |
| Styles extracted to `styles.css`, CSP tightened | 10, 11 |
| WebP + LCP work | 19 |
| 21 packages, categories and signature flags | 6, 7, 8 |
| 8 destinations | 5 |
| Rewritten Triptick copy, no international | 6 (copy rules), 7, 8 |
| Prices in one `PLACEHOLDER` block | 6, guarded in 6 and 20 |
| Reused photos, alt never names a park | 5 (test), 12 (test), 19 |
| `nissaNote` only where he has worked | 5, 13 |
| Per-page title/description/canonical/OG | 9, 12 |
| All six JSON-LD types | 9, applied in 12, 13, 15, 16, 17 |
| sitemap.xml + robots.txt | 18 |
| Internal linking mesh | 12 (related packages), 13, 14, 16 |
| Vercel headers and www redirect | 18 |
| Logo replaces wordmark | 11 (test) |
| New portrait | 15, 16 |
| Freelance repositioning, all six workplaces | 3, 15 |
| Bio facts retained verbatim | 15 (test) |
| Accessibility preserved | 10, 17 |
| Off-page SEO checklist | 20 |
| Assets the user must supply | 20 |

No gaps.

**Placeholder scan** — the only occurrences of the word "placeholder" are the deliberate `PLACEHOLDER — EDIT BEFORE LAUNCH` price banner and its guarding tests. Every code step carries real code. Content-authoring steps (5, 6, 7, 8, 10, 15, 17) specify the exact schema, the exact titles and slugs, the photo mapping, the factual source material and a passing test as the acceptance gate — the prose is the deliverable, not something deferred.

**Type consistency** — checked across tasks:
- `html` / `raw` / `escape` / `renderToString` (Task 1) used identically in 9, 11, 19.
- `PRICES[pkg.priceKey].fromUsd` (Task 6) read in 9 (`touristTripSchema`) and 11 (`packageCard`).
- `pkg.slug`, `pkg.days`, `pkg.destinations`, `pkg.signature`, `pkg.heroAlt`, `pkg.faqs` — defined in Task 4's schema, used unchanged in 11, 12, 13, 14, 16.
- `dest.nissaNote` — set in 5, tested in 5, branched on in 13.
- `pages()` returns `{ path, html }[]` in 12; every later test destructures exactly those two keys.
- `outputPath` (Task 2) is the only path-to-file mapper, used once in 12.

One deliberate cross-task failure is recorded: `test/build.test.js`'s "every internal href resolves" assertion is written in Task 12 and only goes green in Task 17. Task 12 Step 5 names it explicitly so no implementer weakens the test to make their own task pass.

---

## Task Dependency Order

Tasks 1–4 are foundations. 5–8 author data. 9–11 build the rendering layer. 12–17 emit pages. 18–20 finish and verify. Execute in order; 6 → 7 → 8 must be sequential (same file), as must 12 → 13 → 14 → 16 → 17 (all modify `build.js`).
