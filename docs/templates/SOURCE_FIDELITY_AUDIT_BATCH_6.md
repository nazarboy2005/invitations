# Published template source-fidelity audit: batch 6

Date: 2026-10-23

The configured database contains 51 published templates sorted by ID. The next
three after `green-garden` are `hilol`, `konfetti`, and `korporativ`. Direct
database inspection confirms all three are published at 150,000 UZS with the
categories and event support below. Their publication migrations are applied.

Searching all 13 provider `capture-manifest.json` files for these IDs and their
template paths found the canonical captures only in
`Marxaba/capture-manifest.json`; no other provider manifest declares them. The
original capture tree was not modified.

## Source and catalog review

| Template | Captured source / parity | Catalog cover | Confirmed gaps |
|---|---|---|---|
| Hilol | `Marxaba/Osh va iftorlik/templates/hilol`. The packaged body, CSS, metadata and three source SVGs match the capture; the test checks the documented script edits and retained fixed translations. Amiri/Manrope fonts are local. Opening, controls and reduced-motion paths are present. DB: `iftorlik`; event types `iftorlik`, `osh`. | `/templates/hilol/preview.webp`, 450×800 (9:16), SHA-256 `b7d83aec205e5f368e05ec0d7a1016d83583a70757c4e46c44dbdfbf81125d1c`. It shows the actual iftar opening and source decoration, with the app-injected `mh-lang` bar at the upper right. There is no `preview.provenance.json`. | Captured `sample-overrides.js` uses `art/still-life.svg`, `art/girih-tile.svg`, and `art/city-silhouette.svg` in its preview gallery. The app preview does not map these source-owned images, so its gallery stays empty. The language bar is injected by the shared runtime after the image capture; remove that capture-only UI from catalog art and record provenance. |
| Konfetti | `Marxaba/Nikoh/templates/konfetti`. Body, CSS, i18n, metadata and all five art files match; the test guards the documented optional-element GSAP edits. Manrope/Unbounded fonts are local. Opening interaction, gallery, wishes, To‘yona, RSVP, and reduced-motion code/controls are present. DB: `birthday`; event types `birthday`, `yubiley`. | `/templates/konfetti/preview.webp`, 450×800 (9:16), SHA-256 `2b11a3ced8283cd94928094934181b29e8b7f50426952e8e0e8c0aea987a673a`. It shows the actual candle opener; the upper-right `mh-lang` bar is app-injected. Provenance records a headless capture of the packaged renderer. | Captured `sample-overrides.js` uses the four packaged `art/gallery-1.webp` … `gallery-4.webp` images for the sample gallery in all supported source locales. The app preview does not map them, leaving the gallery empty. Add these only to catalog/blank-selection preview data and remove the injected language bar from cover art. Keep creator uploads authoritative and preview images out of saved/public content. |
| Korporativ | `Marxaba/Boshqa tadbirlar/templates/korporativ`. Body, CSS, i18n, metadata and four SVGs match after line-ending normalization; the script only redirects Three.js to the local shared runtime. Inter/Space Grotesk fonts are local. Controls, wishes, To‘yona, motion/reduced-motion paths and contract mappings are covered by the package tests. DB: `other`; event types `korporativ`, `bitiruv`, `yubiley`. | `/templates/korporativ/preview.webp`, 720×1280 (9:16), SHA-256 `166044154ba434bf39f279caf7a59a95c7470e178c496282d490c81a2388c88f`. This is the metadata-declared source asset and shows the opening without app/browser UI. | Captured `sample-overrides.js` uses `art/event-01.svg`, `art/event-02.svg`, `art/event-03.svg`, and `art/venue.svg` in its localized sample galleries. These source-owned preview images are not mapped into the app's catalog/blank-selection preview. Separately, the database publishes Korporativ and migration `0074_publish_korporativ.sql` is applied, while the typed fallback sets `published: false`; its focused test asserts this stale false value. The renderer README, source adaptations and artwork provenance also say it remains unpublished. |

For all three designs, the shared runtime hides a public gallery when no image
URLs are supplied. The missing source gallery images belong in ephemeral
catalog and initial-selection previews only. Creator uploads must replace them;
they must never enter invitation drafts or public content. The captured
To‘yona number/holder controls are mapped; unsupported bank/note fields remain
empty and are hidden by the documented adapter styles.

All three captured pages retain the calendar, program, gallery, RSVP, wishes,
To‘yona, contacts, and music control markup supported by each source. Their
focused suites check those controls and fixture-to-renderer mapping. The shared
public wishes API stores new submissions as pending and returns approved,
non-deleted wishes to the renderer. Hilol and Konfetti notes record earlier
desktop interaction checks; Korporativ's earlier browser QA was explicitly
waived, so its runtime appearance and interaction state remain unverified.

## Checks

- The focused command `pnpm exec tsx --test tests/hilol-template.test.ts tests/konfetti-template.test.ts tests/korporativ-template.test.ts` passes 22/22. The Korporativ test passes while asserting the outdated unpublished fallback state described above.
- Direct `node --test` is not the repository's test runner and fails to resolve workspace aliases; use the `tsx` command above.
- The covers were visually inspected and their dimensions/checksums recorded above. The database query also verified publication status, category, event support and migrations `0065_publish_konfetti.sql`, `0072_publish_hilol.sql`, and `0074_publish_korporativ.sql` as applied.
- Existing template notes record desktop interaction/reduced-motion review for Hilol and Konfetti. Korporativ's previous browser review was explicitly waived; its docs state that locale, responsive, interaction, motion and console browser checks were not completed. No new browser session was run for this audit.
- No source captures or template implementation files were changed in this audit.

## Repair tasks

Opened one Taklifnoma project task per affected template:

- Hilol preview fidelity: `01a166a6-344f-7d61-a4e3-480c9fa2fdaf`.
- Konfetti preview fidelity: `01a166a6-3ae5-75c3-8eb3-866543f3f077`.
- Korporativ preview/publication parity: `01a166a6-417c-78b1-9c4a-071cbcf8a6e6`.

Each task is instructed to inspect active edits and the current diff before
touching the shared Marxaba preview adapter, and to stop rather than overwrite
concurrent work.

## Repair follow-up (2026-10-23)

- Hilol's 450×800 cover now shows the genuine closed iftar opening without app/development chrome. Its authentic source gallery art is localized and limited to ephemeral preview data; creator uploads take precedence. Focused Hilol checks pass 9/9.
- Konfetti's candle opener remains a clean 450×800 cover; its four captured gallery images now map to preview-only data with localized alt text and creator-upload precedence. Focused Konfetti checks pass 7/7.
- Korporativ's typed catalog fallback and package notes now match the already-published database state; source event gallery SVGs are preview-only. Focused Korporativ checks pass 10/10.
- Combined current focused suite passes 26/26. No database or publication changes were made. Korporativ's browser motion/interaction QA remains unverified as noted above.
