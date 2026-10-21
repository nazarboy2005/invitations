# Bulbul package notes

The public package preserves the captured `<body>`, `template.css`, `template.js`, `plaque.js`, `meta.js` (apart from the preview filename), and all source artwork. The capture metadata names `preview.webp`, but that file is absent. `preview.png` is byte-identical to the bundled 430×932 `preview-350.png`, which visibly shows the closed-cage introduction so catalog art presents the distinctive first screen rather than the orchard after opening. The capture folder has no screenshot provenance record, so this file equality confirms the selected artifact but does not independently establish which route/fixture produced it.

The application head uses local shared Marxaba runtime files and locally bundled Cormorant Garamond and Great Vibes fonts. It intentionally omits the reference's sample-invitation script; preview content is injected by the shared typed adapter. `i18n.js` contains only Bulbul page copy translations and excludes the reference helper that mutates/filters sample invitation data.

`platform-adapter.css` moves the shared lightbox close button to the upper-left corner because the app-injected language picker occupies the captured close button's upper-right position. The captured `template.css` and gallery controls remain unchanged.

Captured fields without approved creator contract support: `venue.photo` and `toyona.bank`. The venue image receives the shared decorative empty-photo treatment until creators can add venue imagery. The bank name remains blank because the approved product decision removed bank-name entry. Do not fill either slot with preview sample content.
