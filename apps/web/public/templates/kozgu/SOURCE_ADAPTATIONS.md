# Ko‘zgu source and catalog artwork

The isolated package keeps the captured Ko‘zgu body, template stylesheet,
template and mirror scripts, shared artwork, and locally hosted fonts. The
captured invitation layout, styling, and interaction stay intact; typed
invitation data and public APIs enter through the platform bridge.

The package adapts the captured `index.html` head: it replaces Google Fonts
requests with bundled font files; points shared style/runtime paths to the
application's isolated `shared/nikoh` implementation; removes the captured
sample-invitation loader; loads the platform bridge and static-copy translations;
and adds the scoped contract adapter stylesheet. `platform-i18n.js`,
`contract-adapter.css`, and the typed React wrapper are platform additions.
The captured body, `template.css`, `template.js`, `mirror.js`, `meta.js`,
`i18n.js`, art helpers, and captured art remain unchanged. The original capture
folder is untouched.

`contract-adapter.css` hides the captured empty `toyona.bank` and `toyona.note`
slots because the approved invitation contract has no bank-name or gift-note
fields. The captured `venue.photo` slot has no matching editor/contract field.
The shared bridge shows a map when venue coordinates exist; otherwise the
package hides the empty photo frame. It never inserts sample media.

The captured `meta.js` names `preview.webp`, but that image is absent from the
local reference capture. The package uses the exact metadata-declared image at
`https://www.marxaba.uz/templates/kozgu/preview.webp` (720 × 1280 WebP,
SHA-256 `4e2296926d0cade11ed63a2630a5581c09579c4d439a5ce55a81440d5a14f3cf`).
`preview.provenance.json` records its source and digest, and
`tests/kozgu-template.test.ts` verifies the packaged bytes and portrait
dimensions. The source artwork itself contains the example names and date; it
is for catalog presentation only and never enters invitation data.

The captured sample invitation loader is not included. The shared typed
invitation contract supplies creator data; the centralized catalog fixture is
used only for catalog and initial template-selection previews. The approved
contract has no venue-photo, bank-name, or gift-note values. Blank unsupported
gift slots are hidden by the package adapter. The venue map is shown when
coordinates exist, and the empty venue-photo frame is hidden otherwise;
creators cannot upload a separate venue photo under the approved editor/data
contract.
