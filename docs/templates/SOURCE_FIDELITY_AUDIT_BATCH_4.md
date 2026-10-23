# Published-template source-fidelity audit — batch 4

Audited the next three IDs from configured PostgreSQL's `templates WHERE published=true ORDER BY id`: Doira, Evelina, Ganch. Captures were searched across all directories and provider manifests under `Invitations - this folder will be removed from production`; captures were left untouched.

| Template | Authoritative local capture | Source/package comparison | Catalog artwork |
| --- | --- | --- | --- |
| Doira | `Marxaba/capture-manifest.json` → `Marxaba/Nikoh/templates/doira` | Captured body, `template.css`, `template.js`, `sound.js`, `drum.js`, `effects.js`, `scene.js`, and both image assets match (text normalized for BOM/CRLF). Captured `i18n.js` has app-local additions. Captured Playfair Display and Great Vibes families are packaged locally. Reduced-motion guards exist in source JS/CSS and scene runtime. Opening interactions include three drum taps, skip, replay, language controls, and audio. To‘yona card number/cardholder are mapped; source-only bank/note slots are empty and hidden by the scoped adapter. | `preview.png` is 430×932 (0.461 ratio), visually shows the source's initial curtained doira opening, J/M monogram, locale selector, and skip control. Provenance pins its hash and source opening `#intro`; the capture's metadata names a `preview.webp` that is absent from the full capture tree. No crop or reproduction defect was confirmed. |
| Evelina | `Invitate/capture-manifest.json` → `Invitate/Web invitations/invitate.uz` | Captured hero, videos, GIF, decorative images, and both font files match byte-for-byte. HTML, CSS, and JavaScript have application adaptations; source content/data/runtime calls are stripped and the package supplies contract mapping, localization, and APIs. Opening cover, lock-cover video, hero, and original assets remain. Reduced-motion checks and the four-locale, RSVP/wish, To‘yona interaction assertions pass. To‘yona reveals card number/cardholder on click and supports copying. | `preview.webp` visually shows the actual keyhole opening with couple names/date; its recorded viewport is 480×900, and the file hash matches the provenance hash. **Confirmed provenance defect:** `sourceArtwork` points to nonexistent `assets/images/hero.png`; the captured hero is `assets/previews/template/evelina/hero.png` (SHA-256 `4915f842e8c439fdccc08471e2616770cf74001bab34c27deed4b05783851689`). A separate task is open to correct/protect provenance. |
| Ganch | `Marxaba/capture-manifest.json` → `Marxaba/Nikoh/templates/ganch` | Captured body, `template.css`, `template.js`, `scene-motion.js`, `i18n.js`, and all three image assets match after text line-ending normalization / exact binary comparison. Fonts are local. Reduced-motion paths exist in the captured JS/CSS/scene. Opening has the carved closed-door scene and open control. To‘yona card number/cardholder are mapped; unsupported bank/note slots are empty and hidden. | Existing `preview-browser-capture.jpg` (478×668; 0.716 ratio) visually depicts the carved-door source opening. The capture metadata names `preview.webp`, which is absent from the capture tree and manifest. **Confirmed provenance defect:** both focused Ganch artwork tests fail because `preview.provenance.json` uses the prior fixture hash `a88ccb…d29c2`, while the current shared fixture hash is `54017a…887871`. A separate task is open to refresh the catalog art/provenance against the current fixture and check portrait framing. Publication state is unchanged. |

## Verification

Focused command: `pnpm exec tsx --test tests/doira-template.test.ts tests/ganch-template.test.ts tests/ganch-preview-art.test.ts tests/evelina-template.test.ts`.

- Doira: 7/7 pass.
- Evelina: 6/6 pass.
- Ganch: 6/8 pass; the two failures are the same stale fixture SHA-256 assertion in `tests/ganch-template.test.ts` and `tests/ganch-preview-art.test.ts`.
- Combined: 19 passed, 2 failed. The Ganch failure is the confirmed issue assigned to a separate task.

The database's next three published IDs after Ganch are `glass-pink`, `golden-card`, and `green-garden`.

## Repair follow-up (2026-10-23)

The previously listed catalog-art provenance issues have been corrected. Evelina provenance now resolves to the captured hero path and exact source hash. Ganch now has a 430×932 portrait render of its closed-door opening, and its provenance records the current shared preview-fixture and image hashes. The current focused command above passes 22/22; the earlier 19/2 result is historical and no longer describes the current tree. Doira remains unchanged. No publication state changed.
