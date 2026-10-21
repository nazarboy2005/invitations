# Ganch catalog artwork provenance

`preview.webp` is a 480 × 900 source-rendered portrait of the captured
template's initial, closed-door opening. Its composition follows the captured
`#intro`: the two ganch door panels are split from `art/ganch-doors-v2.webp`,
the invitation greeting/date and opening hint come from the intro slots, and
the center medallion uses `art/brass-roundel-v2.webp`. This is the opening
screen before its doors animate open; it is not a crop of the later courtyard
hero (`art/court-scene-painted.webp`).

The captured `meta.js` already points to `preview.webp`, although that file is
absent from the capture. The only captured image assets are the door texture,
the roundel, and the later courtyard scene. None is a byte-for-byte image of
the complete first page. The packaged `preview.webp` is a source-rendered
composition, but it contains the old A&M monogram and date. The rendered date
line shows 18:00 while the canonical shared fixture has 17:00 in Asia/Tashkent.
Those pixels do not match the canonical Javohir/Madina catalog fixture. Do not claim canonical
catalog-art provenance or replace it with one of the partial source assets.
Regenerate the full 480 × 900 closed-door opening with canonical fixture data,
then record its capture route and checksum. Until that can be done, catalog
art is a release blocker. The captured source and its three artwork files
remain untouched; source-art matching is verified by
`tests/ganch-preview-art.test.ts`.

The current packaged `preview.webp` SHA-256 is
`7cbd5e63ce5be687937f4adcbe1d4a6f0e13e9888665acd1fa8ffa2ea7f1f548`.
The focused preview-art test pins this checksum so the known stale catalog
image cannot be silently replaced or described as a corrected capture. Update
the checksum and provenance only after the canonical fixture opening has been
rendered from the packaged source.
