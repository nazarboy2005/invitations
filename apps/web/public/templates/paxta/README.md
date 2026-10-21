# Paxta package adaptation

The captured Paxta HTML, styles, scripts, and assets remain unchanged. The
app-only `localized-caption.js` adapter runs after the shared invitation
runtime and corrects the `COTTON / 01` hero caption and spaced intro signature
for locales where the shared Uzbek Cyrillic fallback would otherwise
transliterate the English word or split Uzbek Paxta. It renders `ПАХТА / 01`
and `ПАХТА · 01` in Uzbek Cyrillic, `COTTON / 01` and `COTTON · 01` in
English, and `ХЛОПОК / 01` and `ХЛОПОК · 01` in Russian. The focused regression lives in
`tests/paxta-localization.test.ts`.

`preview.webp` is portrait artwork of the closed invitation opening, rendered
with the shared catalog fixture. Its dimensions, artifact hash, fixture, and
hashes for the captured page, styles, script, and artwork are recorded in
`preview.provenance.json` and verified by the focused test.

The packaged `template.js` has one documented runtime adaptation: its captured
gallery-card parallax waits for a card to be rendered. The platform sends
preview fixture content after iframe startup, so this preserves the source
effect without creating a GSAP target warning; reduced-motion still skips it.
