# Love Sakura source adaptations and release gates

## Reference package

- Original page: `Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/love-sakura/preview-frame.html`.
- Original route chunk: `Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0hdebqnzl-9~n.js`.
- The full page capture remains preserved in `source/preview-frame.html`. Its text matches the original after normalizing CRLF line endings. Original image asset hashes and route motion hash are recorded in `source-assets.provenance.json`.
- The source opening section has no standalone catalog artwork file in the capture. `catalog-opening.png` is rendered directly from that first section with its captured source CSS and local fonts/images; only the names and date use the catalog preview fixture. Artwork and stylesheet hashes are in the provenance manifest.

## Adaptations

- `bridge.js` binds invitation data, locale, optional sections, RSVP, wishes, music, calendar, and contact links to the shared platform contract and APIs.
- The captured RSVP section is retained and wired to the public RSVP API. Its source heading/form reveal is restored at the captured 20% intersection threshold, 600 ms ease-out, 15 px vertical offset. Reduced motion makes it visible immediately.
- Music hover/tap scaling and the source playing pulse are restored. Platform preview suppresses playback as configured.
- Original captures and source assets are not modified. The app bridge and adapter styles stay separate from the captured page.

## Release gate status

- **Source page and image asset integrity:** verified by focused source checksum test.
- **Opening artwork:** generated at 900x1444 from the archived opening and verified visually; catalog pointer still needs the coordinator to set `previewImage` to `/templates/love-sakura/catalog-opening.png`.
- **RSVP and music motion:** source parameter checks and adapter implementation are covered by the focused source test; preview confirms the restored RSVP section appears. Submission has not been exercised against a real invitation/API in this preview.
- **Whole-page source parity:** not yet approved. Do not publish until each original section, responsive layout, fonts, animations, and interactive state has been compared against the preserved capture and all differences outside shared data/API/locale/reduced-motion adaptation are resolved.
- **Catalog/database state:** template remains unpublished and unselectable until the preceding gates pass. No shared catalog or migration state was changed in this audit.
