# Qandil package adaptations

The original captured `index.html` body, `template.css`, `template.js`,
`lantern.js`, `lightfield.js`, `i18n.js`, `meta.js`, and illustration assets
remain unchanged and match the retained capture. `index.html` uses local font
files and the shared same-origin typed invitation bridge/runtime in its head;
it does not load the captured site's sample data or analytics.

`platform-i18n.js` adds Russian and English translations for the page title and
description, and supplies the Uzbek Cyrillic document title that the shared
translator does not generate. The invitation content, metadata description,
and template source remain localized through their existing data and source
translation paths. Qandil-specific dynamic fields are passed through the
shared typed Marxaba renderer adapter; sample wishes are opt-in to catalog
previews only.

`platform.css` hides the captured gift-note paragraph and bank-name line when
empty. The approved invitation contract has no gift-note or bank-name field,
so the source's `toyona.note` and `toyona.bank` slots receive no invented
values. Card number and holder come from the typed gift fields.

The venue markup includes a `venue.photo` slot. The shared invitation contract
and creator editor do not provide a venue-photo field. Per the user's decision,
the shared renderer uses the real map at the venue coordinates when available,
and otherwise the platform adapter hides the empty photo frame, including when
the map image fails to load. It never substitutes preview or template artwork
as venue media. This accepted fallback does not block release.

The shared runtime creates calendar rows as div-based seven-column markup,
while the captured Qandil stylesheet only styles a table. `platform.css` adds
template-scoped grid and spacing rules for the generated calendar so the month,
weekday labels, and days remain readable without changing the captured source.

The captured name-sizing routine runs before the parent preview sends its typed
invitation payload, so it can measure empty SVG text and leave later long names
cropped on narrow screens. `platform-names.js` watches only the two SVG name
slots and reruns the source sizing rule after localized data or names arrive. It
constrains oversized names to 330 SVG units after measuring so late font metrics
cannot push the lettering beyond the cover on narrow screens; the captured
animation and SVG artwork remain unchanged.

The captured gallery places its previous/next buttons in the containing gallery
section, outside the scroll track's immediate parent. The shared runtime binds
those controls from the closest gallery section so they remain functional and
wrap in both directions. The fixed decorative backdrop also extends past narrow
viewports; the package-only stylesheet clips horizontal document overflow while
leaving the captured design and scrollable gallery intact.

The source capture is untouched. The page description localization and
four-locale fixture mapping have regressions in `tests/qandil-template.test.ts`.
