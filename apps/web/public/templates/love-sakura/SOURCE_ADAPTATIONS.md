# Love Sakura source adaptations and release gates

## Reference package

- Original page: `Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/love-sakura/preview-frame.html`.
- Original route chunk: `Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0hdebqnzl-9~n.js`.
- The full page capture remains preserved in `source/preview-frame.html`. Its text matches the original after normalizing CRLF line endings. Original image asset hashes and route motion hash are recorded in `source-assets.provenance.json`.
- The source opening section has no standalone catalog artwork file in the capture. `catalog-opening.png` is rendered directly from that first section with its captured source CSS and local fonts/images; only the names and date use the catalog preview fixture. Artwork and stylesheet hashes are in the provenance manifest.

## Adaptations

- `bridge.js` binds invitation data, locale, optional sections, RSVP, wishes, music, calendar, and contact links to the shared platform contract and APIs.
- The captured RSVP section is retained and wired to the public RSVP API. Its source heading/form reveal is restored at the captured 20% intersection threshold, 600 ms ease-out, 15 px vertical offset. Reduced motion makes it visible immediately.
- The captured fixed music button is reused and hidden when the invitation has no track. Its source mute/unmute SVG icons, muted-first toggle, 1.5-second volume ramp, hover/tap scale, and two-second playing pulse are bound to the invitation music URL. Platform silent preview suppresses the control and playback.
- Original captures and source assets are not modified. The app bridge and adapter styles stay separate from the captured page.
- When the catalog fixture has no gallery image URLs, hide the entire gallery and each empty card; this avoids blank image tiles. Submitted gallery images retain the captured card grid and styling.

## Source comparison milestone

- The captured source and package each contain ten top-level sections in the same order. Their section classes match one-to-one; the attendance section keeps its source class and inline font style (attribute order and quote encoding differ only semantically).
- All 35 static source image references have the same filename multiset in the packaged page. Asset bytes are checked separately against the provenance hashes.
- Restored the archived `bg-texture.png`, referenced ten times by the source page. The file is preserved byte-for-byte in `assets/bg-texture.png` and all package references resolve locally. The capture manifest labels it `image/png`, while its file signature is JPEG; both the declared type and detected signature are recorded in `source-assets.provenance.json`.
- The captured opening CSS chunk is byte-identical after CRLF normalization. The captured global CSS chunk is byte-identical after local font URL mapping and CSS-equivalent quote normalization. No selector or declaration changes were required in those source bundles.
- Full-page browser captures of the archived source markup and packaged static markup were pixel-identical at both 450 px and 390 px CSS widths (0 differing RGB channels at 2x output). The comparison used the original captured stylesheets and local source/package image files; it validates static template markup, before dynamic invitation fields and platform adapters run.
- The focused test checks the captured RSVP motion parameters, restored adapter motion, all original asset hashes, and gallery suppression when no images are supplied.

## Release gate status

- **Source page and image asset integrity:** verified by focused source checksum test.
- **Opening artwork:** generated at 900x1444 from the archived opening and verified visually; the coordinator has set `previewImage` to `/templates/love-sakura/catalog-opening.png`.
- **RSVP and music motion:** source parameter checks and adapter implementation are covered by the focused source test; preview confirms the restored RSVP section appears. Submission has not been exercised against a real invitation/API in this preview.
- **Whole-page source parity:** static source markup/style comparison passes at 450 px and 390 px. Runtime platform integration still needs browser review with dynamic fields and a real invitation/API interaction run. Do not publish until those remaining integration checks pass and any differences outside shared data/API/locale/reduced-motion adaptation are resolved.
- **Catalog/database state:** template remains unpublished and unselectable until the preceding gates pass. No shared catalog or migration state was changed in this audit.
