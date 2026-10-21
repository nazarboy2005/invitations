# Monogram package notes

The captured source folder remains untouched. The packaged page body,
`template.css`, `template.js`, and `meta.js` retain the reference
implementation. The page body has one binding change: the fixed `MMXXVI`
cover suffix now reads the invitation's `date.year`. The app translation file
adds the localized `Surat tanlash` gallery-dot label. Captured Google Fonts are
served from local Bodoni Moda and Pinyon Script files in `fonts.css`.

The application head loads the local shared Marxaba runtime and omits the
reference sample-invitation script. Creator/preview content comes from the
shared typed adapter. The capture's metadata names `preview.webp` but does not
include a bitmap. The packaged `preview.webp` is a 720 × 1200 browser capture of
the actual captured opening screen, rendered from this package's source HTML,
CSS, and JavaScript with the shared catalog fixture's Javohir and Madina
content. It uses the source's locked introduction and monogram seal, not a crop
of a later scene or a redesigned composite. Reduced motion was enabled so the
source's own animated seal appears in its settled state. The original capture
remains untouched.

The catalog definition points to `/templates/monogram/preview.webp`. This adds
catalog artwork only; Monogram remains unpublished.

The source includes `venue.photo` and `toyona.bank` slots. `venue.photo` is not
in the approved invitation contract; `toyona.bank` was explicitly removed from
the editor and data model. Keep both source slots empty rather than substituting
sample media or adding the removed bank-name field.

The packaged stylesheet hides blank To‘yona note and bank slots so unsupported
contract fields do not leave misleading empty space. This CSS adapter does not
change the captured source or the behavior when creators supply supported gift
fields.