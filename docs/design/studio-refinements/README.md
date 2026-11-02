# Catalog and Studio refinements — 2026-11-03

- Catalog detail panels now cap at 760px on desktop, with smaller web/image
  artwork and shorter mobile presentations. Artwork proportions are preserved.
- Venue-name edits preserve the selected Yandex destination and written address
  for primary and secondary events. Search results replace it only when selected.
  Link resolution keeps the author's descriptive name; its name suggestion is optional.
- PNG attachment and browser filenames use the canonical creator names, e.g.
  `Javohir-Madina.png`. Unicode names survive; path/header characters are sanitized.
- Shared event/program time controls use one hour/minute wheel picker with all
  60 minutes, touch scrolling, mouse wheel/dragging and keyboard navigation.

Verification passed:

- `pnpm typecheck` and `pnpm build` (including deployment runtime packaging).
- 37 focused contract, publication, filename and Studio preview/capability tests.
- `tests/static-images.integration.ts`: real local authenticated PNG download,
  filename response header, ownership/revision checks and existing one-event locks.
- `scripts/verify-studio-refinements.mts`: real editor state with controlled Yandex
  API responses, selected place → descriptive edits → pasted link → optional
  suggestion left unaccepted → canonical save/download. Also checks the actual
  browser filename, mouse scroll/drag, keyboard changes, native touch swiping,
  existing minute 37 preservation, and desktop/mobile popup and picker sizes.

The browser script creates disposable accounts/invitations and removes them in
`finally`. Map API responses are mocked for deterministic UI verification; real
provider behavior remains covered by the existing Yandex implementation. The PNG
here is a disposable test export, not a public invitation. No deployment or payment
activation was performed.
