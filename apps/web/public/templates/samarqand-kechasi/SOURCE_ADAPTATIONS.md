# Samarqand Kechasi platform adaptations

The captured invitation layout, motion, and assets remain intact. The platform
loads `platform-adapter.css` after the captured styles to collapse empty note
and bank-name hooks, which have no fields in the approved invitation contract.
The gallery image template has an empty fallback `alt`; the shared runtime
provides a localized description when a guest photo is present, while empty
gallery entries render the template's decorative icon only.

The template receives preview examples only through the centralized
`preview-sample.json` fixture. Blank and authored invitations are adapted from
their own contract data and do not inherit sample content.

## Scoped source-asset correction

The Marxaba capture manifest and source folder contain no `art/door-leaf.webp`
for this template. The packaged copy was an unproven extra and was referenced
only by the footer portal's CSS background. The source HTML already provides
the portal's `✳` mark, so the package now uses a CSS radial treatment behind
that mark and removes the unsupported image. This keeps the portal intact
without borrowing unrelated art from another template. `tests/samarqand-preview-contract.test.ts`
guards the fallback and the absence of the uncaptured file.

The catalog cover is `preview.webp`, a 560×1280 crop of the packaged renderer's
locked `.intro` using the centralized preview fixture ephemerally. The crop
retains the source's Registon and lantern composition and opening prompt while
excluding the injected locale control and outer preview chrome. Capture setup,
fixture/source dependency hashes, and output hashes are in
`preview.provenance.json`; the uncropped PNG evidence is `preview-capture.png`.
