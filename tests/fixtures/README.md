# Catalog capture fixture

`catalog-preview-2026-10-23.json` is the exact LF text from commit `7d7d1e3`
(`apps/web/src/modules/catalog/preview-sample.json`), SHA-256
`54017a292d4a5235593d93a5e2f8bca1fe3bab89433182fac912c5d948878871`.

Existing screenshot provenance records that version of the fixture. Tests verify
those historical captures against this snapshot, while live preview-contract
tests continue using the current application fixture. Updating demo content
does not retroactively change the inputs used for an existing screenshot.

Source-file assertions canonicalize CRLF to LF for text, including SVG, and
retain exact bytes for images, fonts, audio, and video. No source captures are
rewritten by the tests.
