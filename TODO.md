# TODO: Remove prices from the website

- [x] Understand task & gather scope
- [x] 1. `data/packages.js` — remove PRICES object, PLACEHOLDER comment, and 21 `priceKey` fields
- [ ] 2. `templates/partials.js` — remove price line from `packageCard`, drop PRICES import/const
- [ ] 3. `templates/package.js` — remove price + price-note from `titleSection`, drop PRICES import/const
- [ ] 4. `lib/seo.js` — remove `offers` block from `touristTripSchema`, drop PRICES import
- [ ] 5. `lib/validate.js` — remove `priceKey` validation
- [ ] 6. `styles.css` — remove `.pkg-price`, `.pkg-price span`, `.pkg-price-note` rules; update note
- [ ] 7. Tests — update `packages.test.js`, `seo.test.js`, `layout.test.js`, `validate.test.js`, `no-legacy.test.js`, `styles.test.js`
- [ ] 8. FAQ copy — reword "built into the price" → "included" in `data/packages.js`
- [ ] 9. Rebuild `dist/` and run test suite
