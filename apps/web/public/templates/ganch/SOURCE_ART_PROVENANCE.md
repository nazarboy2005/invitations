# Ganch catalog artwork provenance

`preview.webp` is a 480 × 900 source-rendered portrait of the captured
template's initial, closed-door opening. Its composition follows the captured
`#intro`: the two ganch door panels are split from `art/ganch-doors-v2.webp`,
the invitation greeting/date and opening hint come from the intro slots, and
the center medallion uses `art/brass-roundel-v2.webp`. This is the opening
screen before its doors animate open; it is not a crop of the later courtyard
hero (`art/court-scene-painted.webp`).

The captured `meta.js` already points to `preview.webp`, although the asset was
not included in the capture. The packaged `meta.js` preserves that filename.
The original capture and artwork files remain untouched; matching packaged
copies are verified by `tests/ganch-preview-art.test.ts`.
