# Published-template source-fidelity audit — batch 9

Date: 2026-10-23

## Database order and publication

Loaded the configured database URL from `apps/web/.env.local` without printing it and called the application's `getCatalog()` against PostgreSQL. It returned `configured: true`, 51 published templates, and these consecutive IDs after Muhr:

| Template | Published | Price | Category | Supported event types |
| --- | --- | ---: | --- | --- |
| Nahor | Yes | 150,000 UZS | `osh` | `osh` |
| Nahorgi Osh | Yes | 150,000 UZS | `osh` | `osh`, `sunnat-toyi`, `wedding` |
| Nilufar | Yes | 150,000 UZS | `wedding` | `fotiha`, `wedding` |

The category assignment and event compatibility are separate database values.

## Capture search and package fidelity

Searched all 13 `capture-manifest.json` files in `Invitations - this folder will be removed from production`, then compared the canonical source declarations with the packaged renderer folders. The complete source for all three IDs is declared in `Marxaba/capture-manifest.json`: Nahor and Nahorgi Osh under `Osh va iftorlik/templates`, Nilufar under `Nikoh/templates`. `Invitate/capture-manifest.json` contains a separate page named Nahorgi osh and unrelated files whose names include “Nilufar”; those are not the Marxaba Nilufar template source. No reference capture was edited.

The focused tests compare captured body markup, authored CSS/JS/localization/meta, art, and local runtime dependencies. They also check four-locale contract mapping, preview-fixture isolation, empty optional fields, event compatibility, source fonts/assets, and motion flags. The Nahor and Nilufar provenance and package notes were reviewed; Nahorgi Osh's venue-photo and gift-note/bank gaps remain documented.

## Visual catalog-art review

- **Nahor:** `apps/web/public/templates/nahor/preview.webp` is a 480×720 portrait of the correct closed qozon opening. The app-injected locale selector is visibly embedded at the upper-right. This is a confirmed catalog-art discrepancy. The captured source and opening interaction stay unchanged; separate repair task `01a166b8-375e-7680-a746-abcda7e8de0f` will recapture clean art from the packaged renderer and update its provenance/assertions.
- **Nahorgi Osh:** `apps/web/public/templates/nahorgi-osh/preview.webp` is a 720×1280 portrait render of the source `.intro`, with the surrounding source background. Provenance states that the platform locale control is excluded. The full distinctive opening is visible without injected controls.
- **Nilufar:** `apps/web/public/templates/nilufar/preview.webp` is 1080×1920 and byte-identical to the captured `art/poster-pond.webp`, the actual opening background named by provenance. It is source artwork, without app or browser chrome.

## Preview media, creator photos, and interactions

The three templates use the centralized preview fixture through the shared adapter for catalog/initial selection only. Test assertions confirm blank new invitations are not populated with fixture data. Nahor's and Nahorgi Osh's source folders provide opening/decorative art, not default gallery photographs; Nilufar's `poster-pond.webp` is opening artwork rather than a creator-gallery image. Preview gallery slots therefore remain without sample photo URLs. Authored creator gallery URLs flow through the shared renderer and replace preview gallery content; public empty creator-photo galleries are hidden. Template-owned opening artwork remains visible.

Checked source and packaged To‘yona fields, RSVP, moderated-wishes wiring, date/program/venue bindings, gallery interaction hooks, music behavior, and reduced-motion support. Test cases confirm empty creator To‘yona rows are hidden and preview values do not enter a blank invitation. This audit did not submit a live RSVP/wish or run a fresh browser session for interactive motion.

## Focused verification

Command: `pnpm exec tsx --test tests/nahor-template.test.ts tests/nahorgi-osh-template.test.ts tests/nilufar-template.test.ts`

Result: 25 passed, 0 failed. It includes source parity and preview mapping assertions for the three templates. Local cover files were also opened and visually inspected. Nahor's cover defect is the only confirmed discrepancy in this batch.
