# Verification — 2026-10-28

- Production build and web TypeScript check pass.
- 36 targeted contract, source-package, fixture and renderer unit checks pass.
- `integration-report.json`: real authenticated save/reopen, publication
  transaction, four public locales, resolved guest greeting, selected Place and
  manual Google URL edits, real pending wish persistence. Disposable records
  and notification jobs are removed afterward.
- `publication-report.json`: registration migration 0169 and publication
  migration 0170 applied; configured public catalog exposes To‘rt fasl at
  100000 minor units / 1,000 UZS. No external app deployment.
- `maps-audit.json`: all 66 checked catalog entries expose the exact Google Maps
  mock target in the shared JSON. External requests are blocked for this DOM
  binding audit; it verifies targets, not Google's remote service availability.
  Love Sakura was checked again after its adapter correction.
- `anor-google-maps.json`: original map panel loads a Google embed URL and all
  navigation controls follow a manually supplied URL.
- `personalized-cover.webp`: actual dashboard cover renderer with changed names,
  confirming the spring scene uses creator content.
- Template `qa/browser-report.json`: source comparison at 320/390/1280 widths,
  original opening/reveal/seasonal motion, long names, four locales, empty fields,
  native reduced motion, real local audio playback and persistent pause. Wish
  transport error/moderation tests here use explicit mocks; the integration
  report separately verifies real backend persistence.

Reproduce map checks against the local app with
`node tests/shared-template-maps.browser.cjs` and
`node tests/shared-google-map.interactions.browser.cjs`.

No new map environment variable is required. The canonical mock target is
`venue.mapUrl` in `apps/web/src/modules/catalog/preview-sample.json`.
Real invitations continue to use their saved venue. `GOOGLE_MAPS_API_KEY` is
server-only for editor Places lookup; template navigation and coordinate embeds
do not receive that key.
