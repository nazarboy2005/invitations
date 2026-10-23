# Published-template source-fidelity audit — batch 2

Date: 2026-10-23

## Database order and source search

The configured database lists Beshik, Bitiruv, and Bog‘i Eram as published
rows 4–6 by template ID. The source archive and its manifest identify Marxaba
as the complete template source for all three. Other provider matches were
checked; OnlineTaklifnoma's `jannat-bogi` is not an alternate Bog‘i Eram
capture. Reference captures remain untouched.

## Findings

- **Beshik:** Captured styles, scripts, body, and art are retained; HTML/JS
  differences bind the single celebrant and local runtime through the platform
  adapter. The 720×1280 cover shows the cradle opening. Captured Beshik artwork
  is used only in catalog/initial-selection previews when no creator photo is
  uploaded; blank invitation content remains empty.
- **Bitiruv:** Captured structure, CSS, translations, metadata, and art match
  after line-ending normalization. The JavaScript uses the local Three.js path
  and a null-safe resize guard. The 480×720 cover depicts the diploma/hat
  opening, honoree, greeting, and open action. The single-honoree adapter,
  reduced-motion path, and empty optional photo/To‘yona behavior are covered by
  focused checks.
- **Bog‘i Eram:** Captured CSS, metadata, and design art are retained; isolated
  adapters provide localization, platform wiring, and contract mapping. Two
  animation sprite assets were absent from the local capture archives and were
  retrieved from the exact manifest-declared URLs, then verified by SHA-256,
  MIME type, and dimensions. This supports the packaged animation but is not a
  byte comparison against an archived copy. Confirmed cover mismatch: the
  current image shows the later post-gate garden scene; the captured opening is
  a closed layered gate with greeting and tap prompt. A separate cover repair
  task is already tracking this finding.

## Preview and verification

The canonical fixture remains preview-only. Source-owned preview art is
ephemeral, creator images replace it, and public creator-photo galleries stay
hidden when empty; template-owned opening artwork remains visible.

The combined focused suite for batches 1 and 2 passed **48/48** after updating
stale shared-renderer assertions. These are source/contract checks; fresh
browser animation and interaction runs were not performed in this audit. No
database, publication, deployment, or payment state changed.

## Repair follow-up (2026-10-23)

Bog‘i Eram's source-parity chat confirmed the capture manifest lacks the two dove sprite entries and no exact aliases exist in any local provider tree. `template.js` does use those sheets, so they represent captured source effects, but the packaged bytes remain unverified against the original. The cover chat confirmed the preview still shows the post-opening garden; the permitted browser surface can display the true closed-gate intro but cannot save an isolated iframe image into the workspace. No substitute art was created. Keep both sprite provenance and the catalog opening cover explicitly unresolved; the exact source behavior/art must not be called fully verified. Focused source-parity checks previously passed 6/6.

## Official source-asset follow-up (2026-10-23)

The reported cover mismatch is a false positive against the source site's actual catalog: captured `meta.js` declares `preview.webp`, and the canonical `https://www.marxaba.uz/templates/bogi-eram/preview.webp` is byte-identical to the packaged catalog image (720×1280, 105,350 bytes, SHA-256 `c913cd24…9d8dc`). The source site uses the garden scene as its cover while the invitation runtime opens on the closed gate. Both are authentic source states; no cover replacement is needed. The two sprite files omitted from the offline capture archive also match the exact canonical URLs requested by captured `template.js`: `doves.webp` SHA-256 `75b7f313…92bee0` and `bird-sprite.webp` SHA-256 `27400e5e…a11691`. This resolves the prior sprite-byte uncertainty against the canonical source URLs; it is not a claim that those bytes were present in the local archive. Focused Bog‘i Eram checks pass 6/6.
