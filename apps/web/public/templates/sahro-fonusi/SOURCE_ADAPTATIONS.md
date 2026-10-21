# Sahro Fonusi source adaptation notes

The original capture in `Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/sahro-fonusi` remains untouched. The application package preserves its body markup, template CSS, localization dictionary, metadata, and opening panorama. The integration changes are limited to these documented runtime/package adaptations:

- `index.html` replaces the reference site's global scripts and shared paths with the isolated `shared/nikoh` runtime and platform bridge, removes its sample-invitation script, loads locally bundled Amiri and Manrope fonts, and points Open Graph artwork at the packaged portrait preview.
- `template.js` changes only the lazy Three.js bundle path from `../../shared/vendor/three/three.bundle.min.js` to `../shared/nikoh/vendor/three/three.bundle.min.js`.
- `contract-adapter.css` hides the captured empty `toyona.bank` and `toyona.note` slots because the approved invitation contract intentionally has no bank-name or gift-note fields. It does not change `template.css` or captured body markup. The source's `venue.photo` slot also has no contract/editor field; the shared photo bridge provides its map or icon fallback without sample media.
- `preview.webp` is the packaged 540 × 960 portrait catalog composition derived from the source opening panorama. `preview.provenance.json` records the exact preview and source-art checksums; it does not claim a fresh browser capture.

Automated tests compare the preserved source files and exact documented script-path rewrite. Browser visual and interaction verification remains a separate release check.
