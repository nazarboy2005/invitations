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

`platform.css` hides the captured gift-note paragraph when empty. The approved
invitation contract has no gift-note or bank-name field, so the source's
`toyona.note` and `toyona.bank` slots receive no invented values. Card number
and holder come from the typed gift fields.

The source capture is untouched. The page description localization and
four-locale fixture mapping have regressions in `tests/qandil-template.test.ts`.
