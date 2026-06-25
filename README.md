# Nissa Ole Kinyaga — Portfolio Site

A single-page portfolio for **Nissa Ole Kinyaga**, a Silver-rated safari guide on the
Borana Conservancy in Laikipia, Kenya. Implemented from the Claude Design source
`Nissa Ole Kinyaga.dc.html`.

## Stack

Zero-dependency static site — one `index.html` with inline styles and vanilla JS.
No build step. Deploys to any static host (Vercel, Netlify, GitHub Pages) as-is.

```
index.html        # markup, styles, and all behaviour
assets/*.jpg      # 17 safari photographs
```

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

## Content to finish before launch

These are intentional placeholders left by the design:

- **Portrait** — drop a photo of Nissa into `assets/` and wire it into the Story section
- **Email / phone** — replace the placeholders in the Contact section
- **Form delivery** — the contact form shows a success state but does not send;
  connect a form service (e.g. Formspree) or an email handler
- **Social links** — Instagram / YouTube / TikTok currently point to `#`
