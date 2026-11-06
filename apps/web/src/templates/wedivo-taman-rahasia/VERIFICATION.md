# Sirli Bog‘ verification

## Passed

- Captured-source SHA-256 remains unchanged; all eight exact source JPEGs and
  eleven requested font faces have verified local hashes. Production template
  CSS has no external import or asset URL. Provider preview/runtime scripts,
  parameters, demo photos/music, demo invitation details and map key are absent.
- Focused package tests pass. JavaScript syntax checks pass. Final web
  TypeScript check passes.
- Actual headless Chrome source-versus-app normal opening review at 390×844
  and 1440×1000. Gate/key sequence completes, seeded ornaments are present,
  packet flip works, all six canonical program rows render, empty gallery and
  unsupported gift UI are hidden, preview forms are disabled, and neither
  viewport overflows horizontally. No JavaScript or local HTTP asset errors.
- All four locales at 390×844 with real `prefers-reduced-motion: reduce`:
  long names without horizontal overflow; immediate gate opening; seven
  ordered authored story chapters; sundial row activation; stone/letter reveal;
  gallery opening, authored captions, next/previous keyboard navigation and
  Escape dismissal; approved-wish listing; RSVP yes/no with party size 1/0;
  pending-wish acknowledgment without adding it to the public tree. HTTP error
  responses leave RSVP unsubmitted and show in-page failure feedback.
- Default visible-copy audit includes SVG text, form copy, program labels,
  stone navigation and the discovery counter. The key's small tag says
  “Oching”; decorative compass marks use Uzbek direction abbreviations.
- 450×800 canonical Uzbek opening cover is the actual locked `#sec-cover`,
  including gate, key, ivy, greeting and names. The temporary locale selector
  is excluded from capture only. Source and fixture hashes are recorded in
  `public/templates/wedivo-taman-rahasia/preview.provenance.json`.

`evidence/browser-results.json` records the complete six-scenario run. The
comparison WebPs pair the source and app opening/opened states at both widths.
`evidence/uz-default-text.json` records the default rendered copy.

`verify-browser.cjs` is reproducible with Playwright and installed Chrome. It
creates a temporary localhost HTTP server, derives payloads from the central
preview fixture through the actual typed adapter, and never writes invitation
records. Set `PLAYWRIGHT_MODULE` to the available Playwright package if it is
outside the repository's Node resolution. `TAMAN_COVER_ONLY=1` captures/audits
the cover; `TAMAN_SKIP_NORMAL=1` runs locale/service checks; `TAMAN_SKIP_LOCALES=1`
runs reference comparison checks. The harness's API responses and local
uploaded-photo stand-ins are explicit test fixtures, not real guest records.

## Remaining release work

- An isolated production build compiled successfully, then encountered another
  owner's temporary missing `useState` import in
  `wedivo-sundanese-puspa/renderer.tsx`. That file was not edited here. A later
  full web TypeScript run passes. Do not describe the earlier build as an
  entirely successful production build.
- The shared registry/catalog/migration/database/publication are deliberately
  coordinator-owned and untouched. Preview route, creator save/reopen and
  switching, authenticated publication/public-route parity, configured-database
  submissions, private wish moderation, and real upload/storage checks await
  that integration. The same iframe renderer is prepared for both uses.
- External map embed/network availability and actual audio playback/autoplay
  policy across browsers/physical devices are not certified by the local
  harness. External requests were blocked during deterministic comparison.
  URLs and pause/retry logic are implemented; no provider key is used.
- Resolve or explicitly accept the source-to-contract gaps in `README.md`,
  including the hidden flower-meaning chapter, before making this template
  selectable. No external deployment or live payment activation occurred.
