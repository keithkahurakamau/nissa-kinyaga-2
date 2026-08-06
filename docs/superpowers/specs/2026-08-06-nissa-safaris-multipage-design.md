# Nissa Safaris — multi-page rebuild design

**Date:** 2026-08-06
**Status:** Approved (design), pending implementation plan

## Problem

The site is a single-page personal portfolio for Nissa Ole Kinyaga, positioned as a
Silver-rated guide employed on the Borana Conservancy. Three things are wrong for the
business it now needs to serve:

1. **Positioning.** Nissa works freelance, as both a private guide and a tour company
   trading as **Nissa Safaris**. The current copy reads Borana-only, which undersells a
   career spanning Lewa, Laragai House, Borana, Maasai Mara and Tsavo East & West.
2. **No sellable inventory.** There are no bookable packages — only thematic
   "experiences" tied to one conservancy. Nothing to price, compare or book.
3. **No SEO surface.** One URL cannot rank for the twenty-odd distinct search intents
   the business depends on ("3 day samburu safari", "ol pejeta rhino safari",
   "mount kenya climbing package", "diani beach holiday"). A single page competes for
   one keyword cluster at best.

## Goals

- Convert to a multi-page site with one indexable URL per commercial intent.
- Rebrand to **Nissa Safaris**, keeping the Kinyaga story as the trust/E-E-A-T engine.
- Publish 21 priced safari packages across 8 destinations.
- Maximise every on-page and technical SEO factor available to a static site.
- Preserve the existing visual language, motion design and zero-runtime-dependency
  delivery.

## Non-goals

- International/outbound packages (explicitly excluded from the Triptick reference set).
- A booking engine or payment flow. Enquiries continue to route to WhatsApp/email.
- A CMS or admin UI. Content is edited in the repo.
- Any guarantee of first-position ranking for competitive head terms (see
  [SEO — what is and isn't achievable](#seo--what-is-and-isnt-achievable)).

## Decisions taken

| Decision | Choice | Rationale |
|---|---|---|
| Canonical domain | `nissasafaris.com` (two s's) | Matches the logo artwork, the email `nissasafaris254@gmail.com` and the Instagram handle. |
| Page granularity | One full page per package | Each package targets its own long-tail keyword and carries its own `TouristTrip` schema. |
| Pricing display | "From $X per person" | Enables `Offer` schema and price-based rich results. Seeded with researched market bands as clearly-marked placeholders. |
| Imagery | Reuse the existing 23 photographs, mapped sensibly | No photos exist for the new destinations. Alt text must not claim a specific park the photo wasn't taken in. |
| Hosting | Vercel | Clean URLs, real HTTP response headers, `www`→apex redirect. Closes the clickjacking gap the README currently documents as unfixable on GitHub Pages. |
| Templating | Node build script → static HTML | See [Build architecture](#build-architecture). |

## Information architecture

```
/                        Home — hero, featured safaris, meet-your-guide, gallery teaser, CTA
/about/                  The Guide — story, journey timeline, expertise, philosophy, where he has worked
/safaris/                Package index, filterable by destination and duration
/safaris/<slug>/         × 21 package pages
/destinations/           Destination index
/destinations/<slug>/    × 8 destination pages
/gallery/                Existing carousel + lightbox
/journal/                Existing bush stories (long-tail SEO)
/contact/                Enquiry form + WhatsApp
/privacy/                Privacy note (currently a footer block)
```

37 pages: home, about, safaris index, 21 packages, destinations index, 8 destinations,
gallery, journal, contact, privacy. Existing single-page content maps as follows:

| Current section | Destination |
|---|---|
| `#story`, `#journey`, `#expertise`, `#philosophy` | `/about/` |
| `#experiences` | Superseded by `/safaris/` (the "more ways to explore Borana" grid moves to `/destinations/laikipia/`) |
| `#gallery` + lightbox | `/gallery/`, teaser on `/` |
| `#recognition` | `/about/`, teaser on `/` |
| `#journal` | `/journal/` |
| `#contact` | `/contact/`, CTA blocks throughout |
| footer `#privacy` | `/privacy/`, summarised in footer |

## Build architecture

The current site is a single 78 KB HTML file with every style written inline. Duplicating
that across 35 pages would be unmaintainable (one nav change = 35 edits) and slow (78 KB
of uncacheable inline CSS per page).

**Chosen approach: a Node build script that emits static HTML.**

```
data/
  packages.js        21 package objects — single source of truth
  destinations.js    8 destination objects
  site.js            brand, contacts, nav, socials, domain
templates/
  base.html          <head>, nav, footer, script/style includes
  package.html       package page body
  destination.html   destination page body
  ...
build.js             renders templates × data → dist/
styles.css           all styles, extracted from the inline attributes
app.js               existing behaviour, unchanged in kind
dist/                build output — what Vercel serves
```

- Node is a **build-time-only** dependency. The output in `dist/` is the same
  zero-dependency static HTML the site ships today.
- Vercel runs `npm run build` on deploy.
- Rejected alternatives:
  - *Hand-writing 35 files* — nav/footer/CSS duplicated 35 times.
  - *One shell page rendering from JS at runtime* — package pages would contain no
    HTML content for crawlers or social-preview scrapers, defeating the entire goal.

### Performance work included

- Extract inline styles to a single cached `styles.css`.
- Generate WebP alongside the existing JPEGs and serve via `<picture>`. Several current
  photos exceed 700 KB; Largest Contentful Paint is a live ranking factor.
- Keep hero images `fetchpriority="high"`, everything below the fold `loading="lazy"`.

## Package inventory

Twenty-one packages. The first eight are the Kenya packages from the Triptick reference
set, **rewritten in original wording** — no copied copy. International packages are
excluded. The remaining thirteen are new.

### Masai Mara & Rift Valley
1. 2-Day Masai Mara Escape
2. 3-Day Masai Mara Classic
3. 4-Day Masai Mara & Lake Nakuru
4. 5-Day Mara, Nakuru & Naivasha
5. 6-Day Mara, Nakuru & Amboseli
6. 7-Day Best of Kenya

### Amboseli & Tsavo
7. 3-Day Amboseli Under Kilimanjaro
8. 2-Day Tsavo East
9. 3-Day Tsavo East & Tsavo West
10. 4-Day Tsavo & Amboseli

### Laikipia & the North
11. 3-Day Samburu Special Five
12. 2-Day Ol Pejeta Rhino Safari
13. 4-Day Samburu & Ol Pejeta
14. **4-Day Borana & Lewa Conservation Safari** — signature
15. **3-Day Laikipia Walking & Tracking Safari** — signature

### Mount Kenya
16. 4-Day Mount Kenya — Naro Moru Route
17. 5-Day Mount Kenya — Sirimon to Chogoria
18. 6-Day Mount Kenya — Chogoria Traverse

### Coast
19. 4-Day Diani Beach
20. 6-Day Tsavo & Diani
21. 8-Day Masai Mara & Diani

Packages 14 and 15 are Nissa's own ground and are the only trips on the site a Nairobi
operator cannot replicate. They are featured on the home page and flagged "Signature".

### Package page structure

Every package page carries, in order: hero image + title + duration + from-price;
overview paragraph; day-by-day itinerary; what's included; what's excluded; best time to
visit; from-price with a "why prices vary" note; 3–5 FAQs; WhatsApp/enquiry CTA;
related packages.

### Destinations

Masai Mara · Amboseli · Samburu · Ol Pejeta · Tsavo · Laikipia (Borana & Lewa) ·
Mount Kenya · Diani.

Each destination page carries an overview, wildlife highlights, best time to visit,
getting there, Nissa's first-hand notes where he has actually worked there, and the
packages that visit it.

## Pricing

All prices live in one block at the top of `data/packages.js`, marked
`PLACEHOLDER — EDIT BEFORE LAUNCH`, seeded with researched 2026 market bands:

- 3-day Masai Mara: budget ≈ USD 350–650 pp, mid-range ≈ USD 1,050–1,800 pp
- 5-day Mount Kenya Sirimon–Chogoria: ≈ USD 770–1,575 pp

Twenty-one numbers, one file, one edit pass before launch. Each package renders
"From $X per person" plus a standing note that final cost depends on group size, season
and accommodation tier. `Offer` schema uses the same figure.

## SEO

### On-page and technical (delivered by this build)

- Unique `<title>`, meta description and `rel=canonical` on every page.
- Open Graph and Twitter Card tags per page, with a per-package share image.
- JSON-LD structured data:
  - `TravelAgency` — home page, with `areaServed`, contact points, social profiles
  - `Person` — Nissa on `/about/`, with credentials and employment history
  - `TouristTrip` + `Offer` — each package page
  - `Place` / `TouristAttraction` — each destination page
  - `BreadcrumbList` — sitewide
  - `FAQPage` — wherever FAQs appear
- `sitemap.xml` generated at build time; `robots.txt`.
- Internal linking mesh: destination ⇄ package ⇄ journal, plus related-package blocks.
- Descriptive, honest `alt` text on every image.
- `vercel.json`: HSTS, `X-Frame-Options`, `X-Content-Type-Options`, cache-control,
  and a `www`→apex 301.
- Existing strict CSP, accessibility work and `prefers-reduced-motion` support are
  preserved across all pages.

### Keyword targeting

| Intent | Target page |
|---|---|
| `nissa safaris`, `nissa ole kinyaga` | `/`, `/about/` |
| `freelance safari guide kenya`, `private safari guide kenya`, `silver rated guide kenya` | `/about/` |
| `<n> day <park> safari` (× 21) | individual package pages |
| `<park> safari guide`, `<park> safari packages` (× 8) | destination pages |
| `mount kenya climbing package`, `sirimon chogoria route` | Mount Kenya pages |
| `diani beach holiday package kenya`, `safari and beach kenya` | coast pages |

### SEO — what is and isn't achievable

Brand terms — "nissa safaris", "Nissa Ole Kinyaga" — should reach first position within
weeks of indexing, since there is no competition for them. Long-tail commercial terms
("3 day samburu safari", "ol pejeta rhino safari guide") are genuinely winnable, which is
the entire reason for one page per package.

Competitive head terms — "kenya safari", "masai mara safari" — are held by operators with
thousands of backlinks and years of domain authority. **On-page SEO cannot deliver those,
and this design does not claim to.** Ranking there requires off-page work that is not
code:

1. A **Google Business Profile** — free, and the highest-leverage single action available.
2. Guest reviews on that profile and on TripAdvisor/SafariBookings.
3. Backlinks from the conservancies, lodges and homes Nissa has worked with
   (Lewa, Borana, Laragai House, Lengishu).

The build ships with a short off-page checklist covering these.

## Content and asset changes

- **Logo** (`assets/logo.png`) replaces the text wordmark in nav and footer. The dark
  variant supplied works as-is against the existing palette.
- **Portrait** (`assets/portrait.jpg`) replaced with the new field portrait; used on the
  `/about/` hero and the home "meet your guide" block.
- **Repositioning.** Copy shifts from "Silver guide at Lengishu, Borana" to "freelance
  safari guide and tour operator, working across Kenya". The credentials block lists
  Lewa Wildlife Conservancy, Laragai House, Borana Conservancy, Maasai Mara, and Tsavo
  East & West. Existing story details — Mukogodo Forest upbringing, radio signaller at
  Lewa, Kenya Utalii College, full-time guiding from 2002, advanced ornithology and
  walking-safari training — are retained verbatim; they are the E-E-A-T payload.
- Contact details are unchanged: `nissasafaris254@gmail.com`, +254 707 415 444
  (WhatsApp, main), +254 722 449 514, `@nissa_safaris_tours`.

### Assets the user must supply

These cannot be produced by the build and block launch:

- `assets/logo.png` — the Nissa Safaris logo (supplied in chat, not yet on disk).
- `assets/portrait.jpg` — the new field portrait, overwriting the existing file
  (still the old Land-Rover-at-dusk shot as of this writing).

## Risks

| Risk | Mitigation |
|---|---|
| Placeholder prices go live unedited | Single clearly-marked block; launch checklist item; `PLACEHOLDER` string greppable in `dist/`. |
| Reused photos imply parks they weren't shot in | Alt text describes what is in the frame, never the park. Replace as real photos arrive. |
| Itinerary details for parks Nissa hasn't worked (Amboseli, Nakuru, Naivasha, Diani) are written from research, not experience | Flag these for Nissa's factual review before launch. First-hand notes appear only on destinations where he has actually worked. |
| Build step is a new failure mode vs. today's no-build site | `dist/` is gitignored and built by Vercel on deploy; `npm run build` reproduces it locally with zero third-party dependencies. No runtime dependency is introduced. |

## Success criteria

- All 37 pages build and deploy; every URL returns real HTML content with no JS executed.
- Every page has a unique title, description, canonical and valid JSON-LD
  (Google Rich Results Test passes for `TouristTrip`, `Person`, `FAQPage`,
  `BreadcrumbList`).
- `sitemap.xml` lists every page; `robots.txt` permits crawling.
- Lighthouse SEO 100, Accessibility ≥ 95, Performance ≥ 90 on `/` and a package page.
- No horizontal overflow from 320 px to 1920 px on every template.
- Enquiry CTA on every package page reaches WhatsApp prefilled with the package name.
