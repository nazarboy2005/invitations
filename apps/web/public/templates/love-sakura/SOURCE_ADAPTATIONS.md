# Love Sakura source adaptations and release gates

## Reference package

- Original page: `Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/love-sakura/preview-frame.html`.
- Original route chunk: `Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0hdebqnzl-9~n.js`.
- The full page capture remains preserved in `source/preview-frame.html`. Its text matches the original after normalizing CRLF line endings. Original image asset hashes and route motion hash are recorded in `source-assets.provenance.json`.
- The source opening section has no standalone catalog artwork file in the capture. `catalog-opening.png` is rendered directly from that first section with its captured source CSS and local fonts/images; only the names and date use the catalog preview fixture. Artwork and stylesheet hashes are in the provenance manifest.

## Adaptations

- `bridge.js` binds invitation data, locale, source optional sections, RSVP, wishes, music, and calendar to the shared platform contract and APIs.
- The captured RSVP section is retained and wired to the public RSVP API. Its source heading/form reveal is restored at the captured 20% intersection threshold, 600 ms ease-out, 15 px vertical offset. Reduced motion makes it visible immediately.
- The captured fixed music button is reused and hidden when the invitation has no track. Its source mute/unmute SVG icons, muted-first toggle, 1.5-second volume ramp, hover/tap scale, and two-second playing pulse are bound to the invitation music URL. Platform silent preview suppresses the control and playback.
- The captured four-tile countdown and single “Save The Date” button are updated in place. Calendar action keeps the source button; no extra link or countdown text is appended.
- The captured guest-wishes section follows the invitation wishes setting. The separate source attendance section keeps only its name and yes/no controls; RSVP submissions use the approved party size of 1 for attending and 0 for declining.
- The captured gift card remains visible in its source layout and its original button copies the configured card number, showing source-style feedback for 2.5 seconds. It no longer toggles a newly created detail panel.
- Original captures and source assets are not modified. The app bridge and adapter styles stay separate from the captured page.
- When the catalog fixture has no gallery image URLs, hide the entire gallery and each empty card; this avoids blank image tiles. Submitted gallery images retain the captured card grid and styling.

## Source comparison milestone

- The captured source and package each contain ten top-level sections in the same order. Their section classes match one-to-one; the attendance section keeps its source class and inline font style (attribute order and quote encoding differ only semantically).
- All 35 static source image references have the same filename multiset in the packaged page. Asset bytes are checked separately against the provenance hashes.
- Restored the archived `bg-texture.png`, referenced ten times by the source page. The file is preserved byte-for-byte in `assets/bg-texture.png` and all package references resolve locally. The capture manifest labels it `image/png`, while its file signature is JPEG; both the declared type and detected signature are recorded in `source-assets.provenance.json`.
- The captured opening CSS chunk is byte-identical after CRLF normalization. The captured global CSS chunk is byte-identical after local font URL mapping and CSS-equivalent quote normalization. No selector or declaration changes were required in those source bundles.
- Full-page browser captures of the archived source markup and packaged static markup were pixel-identical at both 450 px and 390 px CSS widths (0 differing RGB channels at 2x output). The comparison used the original captured stylesheets and local source/package image files; it validates static template markup, before dynamic invitation fields and platform adapters run.
- The focused test checks the captured RSVP motion parameters, restored adapter motion, all original asset hashes, and gallery suppression when no images are supplied.
- The archived route chunk at `0hdebqnzl-9~n.js` was rechecked directly; its SHA-256 matches the provenance record (`25137a4496253f2099597f67eb94fbb67aac07e025559f71990157cfab8bdb4f`). The chunk confirms the source reveal, music hover/tap, copy feedback, and source RSVP stepper. The platform adapter removes the stepper to meet the approved fixed 1/0 RSVP contract.
- Reconciled the recovered provider archive: it contains 26 template captures, 226 image files, and 61 JavaScript chunks, but no Love Sakura folder under `templates/` and no `images/love-sakura/` directory. The exact Love Sakura route chunk is present and matches the recorded SHA-256 above.
- The current live Love Sakura page is available at `https://chorlove.uz/templates/love-sakura`. Its ten sections canonically match the preserved source capture, with the same section opening/classes and all 35 source image references in the same order. All ten original image URLs were fetched directly; each remote SHA-256 matches both the provenance record and packaged asset bytes.
- The source opening stylesheet (`0.u3j0~_2ygfx.css`) remains live with the same SHA-256 recorded in the manifest. Its 30 font/media URL references resolve to packaged files whose bytes match the live files. The seven root `/fonts/` assets in the archived global stylesheet also match their packaged, hashed media-file copies. The current live global stylesheet differs by filename/content hash, but every CSS rule used by the 302 source-page class names is identical to the archived stylesheet. The inline names `Abril Fatface`, `Montserrat`, and `Photograph Signature` have no `@font-face` definition in the captured stylesheet, so the source's listed Georgia, sans-serif, and cursive fallbacks remain in effect.
- No standalone upstream catalog-cover image was found in the recovered archive or current template catalog. `catalog-opening.png` is a source-rendered image of the exact opening section, with its dimensions and bytes covered by the artwork provenance hash; it is a derived render rather than an upstream image file.

## Release gate status

- **Source page and image asset integrity:** verified by focused source checksum test.
- **Opening artwork:** generated at 900x1444 from the archived opening and verified visually; the coordinator has set `previewImage` to `/templates/love-sakura/catalog-opening.png`.
- **RSVP and music motion:** source parameter checks and adapter implementation are covered by the focused source test. Submission has not been exercised against a real invitation/API in this preview.
- **Whole-page source parity:** static source markup/style comparison passes at 450 px and 390 px, and the current live source page's static sections and used CSS rules match the preserved capture. Runtime platform integration still needs a local browser review with dynamic fields and real invitation/API interactions. Keep Love Sakura unpublished and unselectable until that review passes.
- **Catalog/database state:** template remains unpublished and unselectable until the preceding gates pass. No shared catalog or migration state was changed in this audit.
