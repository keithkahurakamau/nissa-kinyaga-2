# Nissa Safaris, Multipage Site

A 37-page static site for **Nissa Safaris**, the freelance safari company run by
**Nissa Ole Kinyaga** out of Laikipia, Kenya. Built as data + templates and
rendered to static HTML by a zero-dependency Node build script, no framework,
no runtime JS dependencies, no client-side rendering.

## Stack

Zero third-party npm dependencies, in build or in the browser. `build.js` reads
plain-object data modules, renders them through hand-written template
functions, and writes static HTML into `dist/`. `app.js` (all client behaviour,
loaded `defer`) and `styles.css` (all styling) are copied into `dist/` as-is.

```
build.js              # orchestrates the build: pages() returns { path, html }[]
data/                 # content as plain objects, packages, destinations,
                       #   about, gallery, journal, site-wide config
templates/             # render functions, one per page type, sharing layout.js
lib/                    # html.js (escape/raw/html tagged template), paths.js
                        #   (ORIGIN, outputPath, slugify), seo.js, validate.js
scripts/make-webp.js   # optional WebP generation, see below
styles.css             # all styling, no inline styles, no CSS-in-JS
app.js                 # all client behaviour, external so CSP can stay
                        #   script-src 'self', no inline scripts/handlers
assets/*.jpg           # photographs, reused across destinations/packages;
                        #   alt text never claims a location the photo isn't from
dist/                  # build output, gitignored, not committed; Vercel
                        #   runs `npm run build` on deploy and serves this
```

`dist/` is listed in `.gitignore`. It does not exist in the repo between
builds, Vercel builds it fresh on every deploy (`vercel.json`'s
`buildCommand`/`outputDirectory`), and locally you regenerate it with
`npm run build` whenever you want to preview.

The site covers: home, a safaris index and 23 individual package pages, a
destinations index and 8 destination pages, a journeys index and 9
international country pages, about, gallery, journal, contact, reviews, an
app page, and four legal pages (terms, privacy, cookies, copyright). It also
generates `sitemap.xml`, `robots.txt`, `llms.txt`, `manifest.webmanifest` and
`sw.js`. See `docs/LAUNCH-CHECKLIST.md` for what's still outstanding.

## Commands

```bash
npm run build   # scripts/make-webp.js, then build.js, writes dist/
npm test        # node --test test/*.test.js, 250+ tests across every template,
                #   data file, and the assembled site (link integrity, sitemap,
                #   page count, caching rules, licence attribution)
npm run images  # scripts/make-webp.js on its own, regenerates assets/*.webp
                #   from assets/*.jpg via the system `cwebp` binary
npm run dev     # build.js, then serve dist/ locally
npm run serve   # serve an already-built dist/ on its own
```

Icons are generated separately and by hand, because they change roughly never
and the generator needs Pillow, which the zero-dependency build does not:

```bash
python3 scripts/make-icons.py   # every icon in assets/, from assets/logo.png
```

Run it after replacing `assets/logo.png`. It writes `favicon.ico` (three
renderings in one file: the logo at 32 and 48, and at 16 the medallion alone,
because the wordmark is unreadable at that size), `icon-32`, `apple-touch-icon`,
`icon-192`, `icon-512`, and `icon-maskable-512`. The maskable one is separate
and deliberately not the square logo: Android crops maskable icons to a circle
and would cut through the lettering.

`npm run serve` runs `python3 -m http.server 8000` from `dist/`. Port 8000 was
found already in use by another local process on the development machine, if
`npm run dev`/`npm run serve` fails to bind, either free port 8000 or edit the
`serve` script in `package.json` to a less contended port
(e.g. `python3 -m http.server 8080`) and open that port instead.

### WebP images

`npm run build` runs `scripts/make-webp.js` first, which shells out to the
system `cwebp` binary to generate a `.webp` sibling for every `assets/*.jpg`.
`templates/partials.js`'s `picture()` helper checks for these siblings at
render time and falls back to a plain `<img>` when one is missing, the build
never fails for lack of `cwebp`, it just serves JPEG-only. **`cwebp` is not
installed on the current development machine**, so no `.webp` files exist yet
and the LCP/bandwidth benefit is unrealised. Install it
(`sudo apt install webp` on Debian/Ubuntu) and run `npm run images` before
launch, see `docs/LAUNCH-CHECKLIST.md`.

## Contact details (live)

- **Email**, nissasafaris254@gmail.com
- **WhatsApp / phone**, +254 707 415 444 (main) · +254 722 449 514 (alternate)
- **Instagram**, [@nissa_safaris_tours](https://instagram.com/nissa_safaris_tours)
- The contact page composes the enquiry and opens WhatsApp to the main number,
  prefilled, no backend required.

## Security & privacy

- **No data collection**, there is no backend. The enquiry form composes a
  message and hands it to the visitor's own WhatsApp/email; nothing is sent to
  or stored on a server. No tracking or advertising cookies are set.
- **Strict Content-Security-Policy**: `script-src 'self'` (all JS external, no
  inline scripts or inline event handlers), locked `img`/`style`/`font`/`connect`
  sources, `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`.
- **Clickjacking protection is set.** `vercel.json` sends `X-Frame-Options: DENY`
  as a real HTTP response header on every route, alongside
  `Strict-Transport-Security` (HSTS, 2-year max-age, includeSubDomains, preload),
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
  and a locked-down `Permissions-Policy`. This was previously unfixable on
  GitHub Pages, which can't set custom response headers; moving to Vercel closes
  that gap.
- HTTPS enforced via HSTS; a `www` → apex redirect is configured in
  `vercel.json`; outbound links use `rel="noopener noreferrer"`.
- **No cookies at all.** The consent banner records the choice in
  `localStorage` (functional, not a tracker), dated so it expires after twelve
  months, and changeable at `/cookies/`. Any future analytics must be
  initialised only after explicit opt-in, inside `loadAnalytics()` in `app.js`.
  `test/legal.test.js` checks the cookie policy against what the code actually
  stores.

## Installable app (PWA)

The site installs to a home screen and works offline. `/app/` explains it to
visitors; the machinery is `sw.js` (source, with two build-time placeholders),
`lib/pwa.js` (the manifest, and the substitution that fills them in) and
`/offline/` (the fallback screen).

The caching rules exist to avoid repeating the stale-`styles.css` bug that
`lib/assets.js` was written to fix, one order of magnitude worse:

- **HTML is network-first, always.** The cache is a fallback for being
  offline, never a shortcut for being slow. This is what makes a deploy
  visible immediately to a returning visitor.
- **Content-hashed assets are cache-first**, because their URL changes when
  their bytes do, so a cached copy cannot be wrong.
- **Photographs are cache-first in a capped, trimmed cache.**
- **`/api/` is never cached**, at all. Google's terms forbid storing review
  content (see `api/google-reviews.js`).
- **`/sw.js` is served `max-age=0`** (`vercel.json`). A cached service worker
  is a frozen site.

Precaching is deliberately small: the offline page, the two hashed assets, an
icon and the manifest. Most visitors are on Kenyan mobile data, and pulling
megabytes of photographs on first visit spends their money on pages they may
never open. Everything else caches as it is actually visited.

`test/pwa.test.js` covers the manifest, the icon sizes, and each caching rule
above.

## Accessibility & responsiveness

- Form labels associated via `for`/`id`; `name`/`autocomplete`/`inputmode` set;
  visible `:focus-visible` rings throughout.
- Respects `prefers-reduced-motion`. Honest `alt` text on every image, never
  claims a park or location the photo isn't actually from.
- Spot-checked for horizontal overflow at 320 px and 1440 px; a full sweep of every template is on the launch checklist;
  `viewport-fit=cover` for notched devices.

## Performance

- Hero images preloaded (`fetchpriority="high"`); below-the-fold images
  `loading="lazy"`.
- WebP served with a JPEG `<picture>` fallback where `.webp` siblings exist
  (see "WebP images" above); JS is a single deferred external file; fonts use
  `display=swap` with `preconnect`.

## Before launch

See `docs/LAUNCH-CHECKLIST.md` for the full list. In short: the logo and a new
portrait have been supplied and processed; package prices have been removed
from the site pending Nissa's real rates, with enquiries going through
WhatsApp/contact; a handful of itineraries and biographical claims need his
confirmation, WebP generation needs to run once on a machine with `cwebp`, and
DNS + off-page SEO work is outstanding.
