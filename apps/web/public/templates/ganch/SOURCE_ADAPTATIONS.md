# Ganch source package

The captured template body, `template.css`, `template.js`, `scene-motion.js`,
`i18n.js`, `meta.js`, and three artwork files match the local Ganch capture.
The capture remains untouched.

`index.html` keeps the original invitation markup and replaces only the page
head wiring: Google Fonts are served from the local `fonts.css` files, and the
capture's site-wide sample/runtime scripts are replaced with the shared
same-origin nikoh runtime and platform bridge. No reference sample invitation
data or site analytics are bundled. `platform-i18n.js` adds translations for
the package's platform-facing fixed copy. `preview.webp` is a source-rendered
480 × 900 opening screen, since the capture metadata names that asset but the
capture itself does not include it.

The shared typed adapter supplies names, hosts, greeting and message, event
label, date/time, venue name/address/map links, program, dress code, gallery,
RSVP, moderated wishes, gift card number/holder, phone and Telegram contacts,
and optional music. Its sample content comes only from the central
preview-only fixture; blank creator invitations remain blank.

Known contract gaps: the captured venue-photo slot has no approved field in the
shared invitation contract, and the captured To‘yona markup has an optional
bank-name slot while the approved contract intentionally has no bank-name
field. The captured `toyona.note` slot also has no approved contract field.
`contract-adapter.css` hides the empty venue-photo frame unless the shared
runtime is displaying a map, and hides the empty note and unsupported bank
slot. None of these slots receive invented or sample creator data. Program
speaker labels are not present in the captured Ganch markup.

The packaged `preview.webp` has the correct closed-door opening composition,
but visibly contains the old `A&M` monogram and old sample date baked into the
pixels. It does not match the central catalog fixture (Javohir and Madina).
Regenerate this source-rendered portrait from the canonical fixture and record
a checksum before treating catalog artwork as complete; the present image is
a release blocker, not verified canonical-fixture artwork.

Ganch is registered in the typed catalog and additive database migration as
unpublished. Keep it unavailable for selection until full browser and service
release verification passes.
