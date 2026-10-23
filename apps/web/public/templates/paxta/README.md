# Paxta package adaptation

The captured Paxta HTML, styles, scripts, and assets remain unchanged. The
app-only `localized-caption.js` adapter runs after the shared invitation
runtime and corrects the `COTTON / 01` hero caption and spaced intro signature
for locales where the shared Uzbek Cyrillic fallback would otherwise
transliterate the English word or split Uzbek Paxta. It renders `ПАХТА / 01`
and `ПАХТА · 01` in Uzbek Cyrillic, `COTTON / 01` and `COTTON · 01` in
English, and `ХЛОПОК / 01` and `ХЛОПОК · 01` in Russian. The focused regression lives in
`tests/paxta-localization.test.ts`.

`preview.webp` is a 720 × 1280 capture of the source renderer’s closed
invitation opening, rendered with the current shared catalog fixture. The
opening date is “Shanba, 12 iyun 2027,” from the fixture start time
`2027-06-12T17:00` bound to the source `date.long` slot. The capture excludes
the injected language selector and Next.js development badge. Its screenshot
was ephemeral and is not stored in the package; artifact and fixture hashes,
displayed date, and source hashes are recorded in `preview.provenance.json` and
checked by the focused test.

The packaged `template.js` has one documented runtime adaptation: its captured
gallery-card parallax waits for a card to be rendered. The platform sends
preview fixture content after iframe startup, so this preserves the source
effect without creating a GSAP target warning; reduced-motion still skips it.
