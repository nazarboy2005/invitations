# Luxury Uzbek templates — 2026-10-29

Selected Taklifla's distinct Midnight Palace (Tungi Saroy) and Tovus from the
unpublished source packages. Their original HTML/CSS/JS/art/fonts are the basis
of the implementation; source captures are unchanged. Template READMEs describe
every adaptation and optional source field without shared authoring support.

## Verification

- 32 focused tests: source/style/art/font hashes, all-locale payloads, stable
  IDs, private-field exclusion, canonical localized preview wishes without public leakage, blank input, shared preview isolation and
  compatible curated studio selection.
- Web typecheck and production build pass.
- `browser-report.json`: both templates at 320×740, 390×844 and 1280×800;
  opening, particle counts/keyframes, reveals, all four languages, stable program
  IDs, no horizontal overflow, long names, manual maps and empty creator data.
  Native reduced motion, actual local audio decode/play/pause, pause across
  language changes and the source closing panel are checked separately.
- Browser wish error/moderation checks use explicit mocks: failures retain text,
  tokens are forwarded and pending wishes never enter the approved list.
- Per-template `*-integration.json`: real authenticated save/reopen, publication
  transaction, saved creator content in the actual studio preview, automatic
  scene opening, four public languages, resolved guest greeting, selected
  Google Place and pasted URL edits, real pending wish persistence and switching between both published designs without shared-data loss. All generated
  accounts, invitations, responses and notification jobs are cleaned up.
- `*-reference-opening.png` and `*-reference-hero.png` render the actual source
  through its query contract, with original artwork and local captured fonts.
  Corresponding app captures show the same scenes. Additional Cyrillic controls
  and shared authored wording are deliberate integration differences.
- Long-name captures document typography fitting. Original source font sizes
  are retained for ordinary names.
- `*-personalized-cover.webp` checks the real dashboard cover renderer with
  changed creator names. Catalog covers use the same opened scene.

## Reproduce

Run the app on port 3001. Start the read-only comparison server with
`python tests/taklifla-luxury-reference.server.py`, then run
`node tests/taklifla-luxury.browser.cjs`. The fixture is created in memory from
the canonical preview JSON. Run unit checks with
`node --import tsx --test tests/taklifla-luxury-source.test.ts`.

Backend checks explicitly target the local app and configured database:
`node --env-file=apps/web/.env.local --import tsx --test tests/taklifla-tungi-saroy.integration.ts tests/taklifla-tovus.integration.ts`.
They never start payments or Telegram delivery.

## Publication and environment

Additive migration 0171 registers both designs as hidden; migration 0172
publishes after the gates pass, preserving administrator prices. Publication
evidence is in `publication-report.json`. No external app deployment or live
payment activation. No new environment variable is needed; maps use the saved
shared venue. The server-only Places key is never passed into either template.
