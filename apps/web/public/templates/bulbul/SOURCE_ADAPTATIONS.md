# Bulbul package notes

The public package preserves the captured `<body>`, `template.css`, `template.js`, `plaque.js`, and source artwork. Package `meta.js` changes only its preview filename. `preview-browser-capture.jpg` is a ChatGPT in-app-browser production render of `/preview?template=bulbul&qaSilent=1` using the canonical shared fixture. Its dimensions and SHA-256, plus the fixture checksum, are recorded in `preview.provenance.json`. It is a 478 by 668 first-viewport capture; it is not a full-page image. The untouched capture has no preview image.

The application head uses local shared Marxaba runtime files and locally bundled Cormorant Garamond and Great Vibes fonts. It intentionally omits the reference's sample-invitation script; preview content is injected by the shared typed adapter. `i18n.js` contains only Bulbul page copy translations and excludes the reference helper that mutates/filters sample invitation data.

`platform-adapter.css` moves the shared lightbox close button to the upper-left corner because the app-injected language picker occupies the captured close button's upper-right position. The captured `template.css` and gallery controls remain unchanged.

Captured fields without approved creator contract support: `venue.photo` and `toyona.bank`. The venue image receives the shared decorative empty-photo treatment until creators can add venue imagery. The bank name remains blank because the approved product decision removed bank-name entry. Do not fill either slot with preview sample content.
