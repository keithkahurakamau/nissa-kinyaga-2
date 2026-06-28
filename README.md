# Nissa Ole Kinyaga — Portfolio Site

A single-page portfolio for **Nissa Ole Kinyaga**, a Silver-rated safari guide on the
Borana Conservancy in Laikipia, Kenya. Implemented from the Claude Design source
`Nissa Ole Kinyaga.dc.html`.

## Stack

Zero-dependency static site — `index.html` (markup + inline styles) and `app.js`
(all behaviour, loaded `defer`). No build step. Deploys to any static host
(Vercel, Netlify, GitHub Pages) as-is.

```
index.html        # markup + styles
app.js            # all behaviour (external so CSP can use script-src 'self')
assets/*.jpg      # 21 safari photographs
```

Photos are re-mastered from the original WhatsApp-resolution files (full frame,
upscaled with Lanczos + unsharp for sharpness on retina/large displays).
Below-the-fold images are `loading="lazy"`.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Features ported from the design

- Cinematic hero with slow Ken-Burns pan and a golden-hour colour wash
- Scroll-progress bar, custom cursor follower, and grain/wash overlays
- Reveal-on-scroll engine (`IntersectionObserver` with staggered delays)
- Glassmorphism (`backdrop-filter` + SVG lens-refraction filter) on nav, buttons, cards
- Infinite-scroll **gallery** reel: cursor steering, click-and-drag, with a
  full-frame **lightbox** (keyboard arrows / Esc, prev-next)
- Sections: Story, Journey timeline, Expertise, Philosophy, Tour Menu, Gallery,
  Recognition, Journal, and a Contact form with a custom date-picker calendar
- Responsive layout with a full-screen mobile menu

## Contact details (live)

- **Email** — nissasafaris254@gmail.com
- **WhatsApp / phone** — +254 707 415 444 (main) · +254 722 449 514 (alternate)
- **Instagram** — [@nissa_safaris_tours](https://instagram.com/nissa_safaris_tours)
- The contact form composes the enquiry and opens WhatsApp to the main number,
  prefilled — no backend required.

## Security & privacy

- **No data collection** — there is no backend. The enquiry form composes a message
  and hands it to the visitor's own WhatsApp/email; nothing is sent to or stored on
  a server. No tracking or advertising cookies are set.
- **Strict Content-Security-Policy** (meta): `script-src 'self'` (all JS external, no
  inline scripts or inline event handlers), locked `img`/`style`/`font`/`connect`
  sources, `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`.
- HTTPS enforced (GitHub Pages); `referrer` policy set; outbound links use
  `rel="noopener noreferrer"`.
- **Cookie/consent banner** records the choice in `localStorage` (functional, not a
  tracker). Any future analytics must be initialised in `loadAnalytics()` in `app.js`
  so it only runs after explicit opt-in. A plain-language privacy note is in the footer.
- Note: clickjacking protection (`frame-ancestors`/`X-Frame-Options`) needs an HTTP
  response header, which GitHub Pages can't set. Move to a host that allows custom
  headers (e.g. Vercel/Netlify with a `_headers` file) if framing protection is required.

## Accessibility & responsiveness

- Form labels associated via `for`/`id`; `name`/`autocomplete`/`inputmode` set;
  ARIA on the custom dropdown and date-picker; visible `:focus-visible` rings.
- Respects `prefers-reduced-motion`. Honest `alt`/`aria` on imagery.
- Verified no horizontal overflow from 320 px to 1920 px; full-screen mobile menu;
  `viewport-fit=cover` for notched devices.

## Performance

- Hero image preloaded (`fetchpriority="high"`); below-the-fold images `loading="lazy"`.
- JS is a single deferred external file; fonts use `display=swap` with `preconnect`.

## Content to finish before launch

- **Portrait** — drop a photo of Nissa into `assets/` and wire it into the Story section
