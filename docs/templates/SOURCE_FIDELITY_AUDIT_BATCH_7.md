# Published template source-fidelity audit: batch 7

Date: 2026-10-23

Reconfirmed against the configured database: the catalog contains 51 published
templates; the next IDs after `korporativ` are `kozgu`, `kuzgi-chinor`, and
`lola`. All three are published at 150,000 UZS. Their categories and event
compatibility are independent and verified from the configured catalog API:

| ID | Category | Supported events |
|---|---|---|
| `kozgu` | `wedding` | `wedding`, `qiz-bazmi`, `fotiha` |
| `kuzgi-chinor` | `wedding` | `wedding` |
| `lola` | `qiz-bazmi` | `qiz-uzatish`, `fotiha` |

All 13 provider `capture-manifest.json` files were inspected. The only
manifest declaring these template paths is `Marxaba/capture-manifest.json`.
The captures are respectively `Marxaba/Nikoh/templates/kozgu`,
`Marxaba/Nikoh/templates/kuzgi-chinor`, and
`Marxaba/Qiz uzatish/templates/lola`. The original reference tree was not
changed.

## Fidelity findings

| Template | Source and renderer | Artwork / behavior | Finding |
|---|---|---|---|
| Ko‘zgu | Packaged body, captured CSS/JS, mirror script, art helper, all listed image assets and local Cormorant Garamond/Great Vibes files are guarded by `tests/kozgu-template.test.ts`. The source has the mirror wipe/tap opening, canvas fog and ripple, generated name lettering, ambient motion and reduced-motion branch. Its shared contract wrapper provides event/date, program, venue/map, gallery, RSVP, wishes, To‘yona, contacts and locale controls. | Catalog uses the exact `meta.js`-declared `preview.webp` (720×1280), visually checked as the complete invitation opening without injected language bar. The file is absent from the captured manifest/tree and `preview.provenance.json` documents its exact metadata URL, checksum and embedded sample names/date. The capture has no sample gallery-image override; empty gallery remains icon-only. | No confirmed source or catalog-art defect. Its detailed interaction and locale behavior are source/test documented; this audit did not rerun browser motion QA. |
| Kuzgi Chinor | Captured body, JS and CSS (except replacing external font import with bundled font faces) are byte-equivalent after line-ending normalization. Local scene assets and font files are packaged; intro gust/opening, scroll effects, RSVP celebration, ambient leaves and reduced-motion branches remain. Shared Marxaba renderer binds the supported contract and locale controls. | Catalog opening is 450×800 (9:16) and visually shows the source's autumn avenue, names/date and open control without language-bar chrome. Opening/scene/foliage are template-owned artwork. The source gallery markup uses an empty photo slot; no source gallery sample override or source photo URL was found. | No confirmed source or cover defect. Preview gallery intentionally uses empty cards because no authentic gallery image is supplied by this source. Focused preview mapping test passes. |
| Lola | Captured body, metadata, styles, scripts and source art are tested against `Marxaba/Qiz uzatish/templates/lola`; local fonts and the recovered omitted chest-lid asset are documented. The adaptation retains generated flowers, chest opening, scroll motion, gallery/lightbox, RSVP, wishes, To‘yona and reduced-motion support. The single celebrant maps into the bride display slot. | `preview.webp` is 480×900 portrait and shows Lola's floral oval opening, fixture name/date and open button. Visual inspection confirms the upper-right injected `mh-lang` language selector was baked into the image. The original preview asset is absent from the capture manifest; current provenance says it is a browser render of the captured opening. Source art includes the bouquet/opening design; source sample override defines invitation content and no source gallery-photo list. | Confirmed catalog-art issue: remove injected language selector from the cover while retaining the genuine source opening and portrait composition. Separate fix task opened: `01a166a8-fc37-7483-ba8f-a3e5b50e1bde`. No publication change is required. |

The shared renderer provides authentic preview gallery photos only for
templates with source-owned gallery assets mapped there. The three audited
templates do not have captured sample gallery image URLs to map, so this batch
found no additional missing-gallery-photo issue. Preview sample fields remain
fixture-only; creator galleries are authored by creators and the public
renderer hides empty creator-photo galleries.

## Verification

- Configured database-backed `getCatalog()` confirmed 51 rows and the batch's
  exact sorted position, publication, price, category, and event support.
- Checked all 13 provider manifests and each declared source path; no other
  provider manifest declares these templates.
- Visually inspected all three current catalog cover files for opening-state
  visibility, portrait crop/ratio, and injected UI chrome.
- Focused command `pnpm exec tsx --test tests/kozgu-template.test.ts
  tests/kuzgi-chinor-localization.test.ts tests/lola-template.test.ts` passes
  20/20.
- No browser interaction/reduced-motion rerun was performed. Existing source
  and focused tests cover these paths, but still-image inspection is not a
  motion-fidelity claim.

No template source, shared renderer, capture, database, or publication state
was modified in this audit.
