# Published-template source-fidelity audit — batch 10

Date: 2026-10-23

## Database order and publication

Loaded the configured database through the application's `getCatalog()` without printing the connection string. The result was configured, with 51 published rows. The next three IDs after Nilufar are:

| Template | Published | Price | Category | Supported event types |
| --- | --- | ---: | --- | --- |
| Oltin Kuz | Yes | 150,000 UZS | `birthday` | `birthday`, `yubiley` |
| Oltin Nur | Yes | 150,000 UZS | `wedding` | `wedding` |
| Oltin Uzuk | Yes | 150,000 UZS | `wedding` | `wedding` |

Price is stored as 15,000,000 minor units. Category and event compatibility are separate database values.

## Provider capture search

Searched all 13 provider `capture-manifest.json` files under `Invitations - this folder will be removed from production`. Only `Marxaba/capture-manifest.json` declares these source folders:

- Oltin Kuz: `Marxaba/Tug'ilgan kun va Yubiley/templates/oltin-kuz`
- Oltin Nur: `Marxaba/Nikoh/templates/oltin-nur`
- Oltin Uzuk: `Marxaba/Nikoh/templates/oltin-uzuk`

The Oltin Kuz source package includes the captured `sample-overrides.js`, five memory SVGs and the venue SVG. The wedding captures contain source HTML/CSS/JavaScript, localizable copy, and their named artwork assets, but no local `preview.webp` file in either source folder. No capture was edited.

## Source and integration review

- **Oltin Kuz:** captured body, `template.css`, `meta.js`, and artwork are guarded by `tests/oltin-kuz-package.test.ts`; documented `template.js` changes preserve the source reveal while fitting long names and avoiding empty-target animation warnings. The source animation and styles include reduced-motion handling. Captured sample fixture uses `venue.photo = art/venue.svg` and gallery art `memory-01.svg`–`memory-05.svg`. Those six assets are packaged byte-identically, but `apps/web/src/templates/marxaba/renderer.tsx` does not map Oltin Kuz preview gallery or venue art. The current preview supplies blank gallery slots and a blank optional venue photo, so the distinctive original sample imagery is missing in catalog and initial selection previews. Creator-authored photos flow through the shared renderer; public empty creator galleries remain hidden.
- **Oltin Nur:** captured opener is the `.intro` section with curtain artwork, invitation copy, names/date, and a seal button; `.hero` follows it. Captured and packaged markup preserve that first section and the invitation sections. Source images and fonts are local, and the source includes opening/motion behavior. The current 720×1280 `preview.webp` displays the post-opening hero, with the names, event label, scroll cue, and source music control. It has no browser/app locale bar. The package has no cover provenance tying this image to a captured source asset.
- **Oltin Uzuk:** captured opener is `.intro`, with the hand/ring scene, invitation copy, names/date, and open button; `.hero` follows it. The source ring artwork and animation assets are packaged, with local fonts and reduced-motion handling. The current portrait `preview.webp` shows the post-opening ring hero and source music control, not the initial opener; it has no browser/app locale bar. The package has no cover provenance tying this image to a captured source asset.

Shared sample content is generated from `apps/web/src/modules/catalog/preview-sample.json` for preview only; blank invitations remain empty, and authored creator data takes precedence. Oltin Nur and Oltin Uzuk have no captured gallery sample photos to map. Their ring and velvet/gift artwork belongs to the design itself and remains visible independently of creator gallery uploads. The Oltin Kuz source gallery and venue images are explicit sample media, not creator-uploaded photos.

## Catalog artwork review

All three registry entries point to their package `preview.webp` at [packages/contracts/src/index.ts](/D:/Projects/Taklifnoma/packages/contracts/src/index.ts). Visually inspected the three portrait files. Oltin Kuz's 480×854 image shows the complete chinar-tree opening, greeting, celebrant, date and open control without screenshot chrome. Oltin Nur and Oltin Uzuk are 720×1280, but depict their post-opening hero screens as described above. Each currently includes a source music toggle drawn as part of its page; no browser chrome is visible.

## Focused verification

Command:

```text
pnpm exec tsx --test tests/oltin-kuz-package.test.ts tests/oltin-nur-preview.test.ts tests/oltin-uzuk-preview.test.ts tests/oltin-uzuk-localization.test.ts
```

Result: 16 passed, 1 failed. The failing assertion is the Oltin Kuz shared-adapter source check in `tests/oltin-kuz-package.test.ts`: it expects `extras: { celebrant: sourceData.groom || sourceData.bride }` in the renderer, while the current implementation constructs `extras` inside its outgoing adapter message. This appears to be a stale test expectation, but the suite is not fully green until repaired and rerun. The focused tests for preview sample mapping, blank draft isolation, localized static copy, captured image/style/animation assets, and optional gift rows passed.

Static inspection confirmed source and app reduced-motion code paths. This audit did not run fresh browser interaction or reduced-motion emulation, save/reopen, or live RSVP/wish submissions.

## Initial handoff at audit time (historical)

Three separate project repair tasks were requested: Oltin Kuz preview source imagery, Oltin Nur opening cover, and Oltin Uzuk opening cover. The Codex `create_thread` tool initially returned `create_thread received invalid arguments`; the owner checks and repairs were subsequently completed in separate project tasks, as recorded below.

## Repair follow-up (2026-10-23)

- Oltin Kuz's five captured memory illustrations and venue artwork are now included only in localized catalog/initial-selection preview payloads. Creator uploads replace samples; public empty galleries remain hidden and samples do not mutate invitations. Focused checks pass 8/8.
- Oltin Nur's catalog mapping now points to a clean 720×1280 render of the actual `#intro`, preserving the source behavior that hides names/date until the seal opens. Provenance pins the source and fixture inputs; focused checks pass 5/5.
- Oltin Uzuk's catalog mapping points to `catalog-cover-opening.png`, a clean 450×800 captured `#intro` showing the source-defined hand-and-ring fallback scene, greeting, names/date, and open action; its former `preview.webp` is a later hero and is not the catalog image. A capture-only override reveals the fallback and hides the competing photo rig and locale selector; packaged source files remain unchanged. Focused preview/localization checks pass 7/7.
- All three findings are resolved. Owner checks report focused results of 8/8 (Kuz), 5/5 (Nur), and 7/7 (Uzuk). No remaining blockers were reported, and no database or publication state changed.
