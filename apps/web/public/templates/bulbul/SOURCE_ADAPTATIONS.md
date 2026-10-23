# Bulbul package notes

The public package preserves the captured `<body>`, `template.css`, `template.js`, `plaque.js`, and source artwork. Package `meta.js` changes only its preview filename. `catalog-cover-opening.png` is a direct 430 by 932 portrait render of the packaged source page at the untouched `#intro` state, before opening. The capture shows the full golden cage opening and complete language selector. Its SHA-256, capture method, source package, and reference manifest are recorded in `preview.provenance.json`. The Marxaba capture manifest records the intro HTML and artwork layers but no preview image, so this source render supplies the catalog artwork without reconstructing the design.

`preview-browser-capture.jpg` remains an untouched 478 by 668 first-viewport capture of the production preview route; it is QA evidence only and is no longer the catalog cover. Existing `preview.png` and `preview-350/550/750.png` files are retained untouched and are not used as catalog art because their render provenance was undocumented.

The application head uses local shared Marxaba runtime files and locally bundled Cormorant Garamond and Great Vibes fonts. It intentionally omits the reference's sample-invitation script; preview content is injected by the shared typed adapter. `i18n.js` contains only Bulbul page copy translations and excludes the reference helper that mutates/filters sample invitation data.

`platform-adapter.css` moves the shared lightbox close button to the upper-left corner because the app-injected language picker occupies the captured close button's upper-right position. The captured `template.css` and gallery controls remain unchanged.

Captured fields without approved creator contract support: `venue.photo` and `toyona.bank`. The venue image receives the shared decorative empty-photo treatment until creators can add venue imagery. The bank name remains blank because the approved product decision removed bank-name entry. Do not fill either slot with preview sample content.
