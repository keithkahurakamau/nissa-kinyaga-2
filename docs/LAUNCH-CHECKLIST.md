# Nissa Safaris — Pre-Launch Checklist

Everything below is outstanding as of the multipage rebuild. Nothing here is
optional decoration — each item either blocks a correct deploy or is the
highest-leverage work left to do once the site is live.

## Blocking

- [ ] Save the Nissa Safaris logo to `assets/logo.png`
- [ ] Save the new field portrait to `assets/portrait.jpg` (overwrites the old one)
- [ ] Replace all 21 placeholder prices in `data/packages.js` and delete the `PLACEHOLDER` banner
- [ ] Have Nissa fact-check the Amboseli, Lake Nakuru, Lake Naivasha and Diani itineraries — he has not worked those parks
- [ ] Point `nissasafaris.com` DNS at Vercel and confirm the `www` redirect resolves
- [ ] Run `npm run images` on a machine with `cwebp` installed before deploying. `cwebp` is absent from the development machine, so no `.webp` files were generated for this build. The build degrades gracefully — plain `<img>` tags, no broken `<source>` elements — but the LCP/bandwidth benefit of WebP is unrealised until this is run once on a machine that has it. On Debian/Ubuntu: `sudo apt install webp`.
- [ ] Confirm the **"Silver-rated guide, one of 59 in Kenya"** claim. It currently appears nowhere on the site — it was removed from visible copy and from the `Person` structured data because it is absent from Nissa's own account (`docs/nissa-biography-source.md`), which cites a Kenya Utalii College distinction instead. If Nissa confirms the rating, it can be restored to the About page and JSON-LD; if he can't confirm it, the site is already correct as shipped.
- [ ] Confirm **Tsavo East, Tsavo West and Laragai House**. The client listed these in the original brief, but they do not appear in Nissa's own written account (`docs/nissa-biography-source.md`). They are currently included in `data/site.js`'s `workedAt` array and rendered on the About page — confirm with Nissa or remove them.
- [ ] Decide on `data/site.js`'s `credentials` array — it is defined but **not rendered by any template**. Either add it to the About page (e.g. alongside `workedAt`) or delete it so the data file doesn't imply a feature that doesn't exist.

## Off-page SEO — not code, and the highest-leverage work available

- [ ] Create a **Google Business Profile** for Nissa Safaris; verify it; add photos, service area and the website link
- [ ] Submit `https://nissasafaris.com/sitemap.xml` in Google Search Console
- [ ] Collect guest reviews on the Business Profile, TripAdvisor and SafariBookings
- [ ] Request backlinks from the conservancies and camps Nissa has worked with — Borana, Lewa, Sirikoi, Il Ngwesi, Tassia, Sarara, Saruni Kalama, Angama Mara, Ol Donyo
- [ ] Link the site from the `@nissa_safaris_tours` Instagram bio

## Verify after deploy

- [ ] Google Rich Results Test passes on the home, an about, a package and a destination URL
- [ ] Lighthouse: SEO 100, Accessibility ≥ 95, Performance ≥ 90 on `/` and a package page
- [ ] No horizontal scroll from 320 px to 1920 px on every template
