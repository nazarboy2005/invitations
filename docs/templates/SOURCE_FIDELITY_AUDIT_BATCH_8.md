# Published template source-fidelity audit: batch 8

Date: 2026-10-23

The configured database-backed catalog contains 51 published templates. The
next IDs in its configured ID order after `lola` are `monogram`,
`muhabbat-kitobi`, and `muhr`. Each is published at 150,000 UZS in the
`wedding` category. Event compatibility remains an independent assignment:

| ID | Supported event types |
|---|---|
| `monogram` | `wedding`, `fotiha` |
| `muhabbat-kitobi` | `wedding` |
| `muhr` | `wedding`, `fotiha`, `qiz-uzatish` |

All 13 provider manifests under `Invitations - this folder will be removed
from production` were searched. Only `Marxaba/capture-manifest.json` declares
the three reference folders, all under `Marxaba/Nikoh/templates/`. The original
capture tree was not changed.

## Fidelity findings

| Template | Source, typography, imagery, behavior | Opening / catalog art | Finding |
|---|---|---|---|
| Monogram | The captured body is retained with the documented year binding. Captured CSS, JavaScript, metadata, and translations match after the documented translation addition and empty gift-slot adapter. Bodoni Moda and Pinyon Script are served locally. Opening/seal animation, responsive rules, reduced-motion branches, gallery controls, and contract sections are guarded in focused tests. No source gallery-photo files or photo overrides are in its manifest. | `preview.webp` is 720×1200 portrait and visually shows the captured locked introduction, monogram seal, fixture greeting, and source open control. The source-owned index/footer labels are part of the source page; no app language bar is baked in. | No source or artwork defect confirmed. The stale unpublished claim in `SOURCE_ADAPTATIONS.md` was corrected to match the configured published catalog state, price, category, event support, and migration. |
| Muhabbat Kitobi | The canonical capture includes the Story section and its matching styles. The packaged body now matches after removing one stray blank line. Captured `template.css`, `template.js`, both motion files, metadata, and four still-life SVG assets match after line-ending normalization; local fonts are packaged. The captured script reads `extras.story` for chapter drawing and opening turns. The Marxaba bridge maps localized chapters from top-level `Invitation.story` to that source slot and omits duplicate generic story rendering, so chapters render once. | `preview.webp` is a clean 430×932 portrait capture of the locked source opening: closed book over the original still-life table, ribbon greeting, and “Kitobni ochish” action, without app or browser chrome. Provenance records the fixture and capture checksum. Source metadata names `preview-source.svg`, absent from the capture tree; no gallery photographs are declared in `sample-overrides.js`. | Story-section mismatch was a false positive; the only body-parity defect was extra whitespace and is corrected. The separate catalog-cover repair passed visual inspection and its focused opening-art test (5/5). |
| Muhr | Captured body, CSS, JS, seal script, metadata, translations, and all eight manifest-listed art assets match byte-for-byte (text normalized for BOM/CRLF). Local Cormorant Garamond and Marck Script faces are present. Envelope-seal opening, scene transition, interaction handlers, and reduced-motion paths are retained. No source gallery sample images are declared. | `preview.webp` is byte-identical to the captured opening envelope art and has the original portrait composition. This is the closed-letter opening artwork, without injected app controls. | No source or catalog-art defect confirmed. The venue-photo and To‘yona bank/note source-only slots remain unsupported by the shared contract and are documented as empty/adapted. |

All three map through the shared Marxaba renderer and contract adapter. The
shared fixture supplies ephemeral preview content; blank drafts remain empty.
These sources do not provide gallery sample photographs to map into preview
gallery slots. Decorative/template-owned imagery remains visible independently
of creator-uploaded gallery photos, and public creator-photo galleries remain
dependent on authored uploads.

## Verification

- Database-backed `getCatalog()` reconfirmed order, publication, price,
  categories, and event support.
- Focused command:
  `pnpm exec tsx --test tests/monogram-template.test.ts tests/monogram-preview-contract.test.ts tests/muhabbat-kitobi-preview.test.ts tests/muhabbat-kitobi-localization.test.ts tests/muhr-template.test.ts`
- Result: 22 passed, 0 failed after removing the stray blank line from the
  packaged body and mapping the typed top-level story into this capture's
  source-native `extras.story` slot. The source capture remains untouched.
- Browser interaction and reduced-motion runtime QA were not rerun. Their
  source/adaptor paths were inspected, but static checks do not establish
  animation fidelity in a browser.
- No migration, catalog state, source capture, or publication state was
  changed.

The next database-backed published IDs after Muhr are `nahor`, `nahorgi-osh`,
and `nilufar`.

The next database-backed published IDs after Muhr are `nahor`, `nahorgi-osh`,
and `nilufar`.
