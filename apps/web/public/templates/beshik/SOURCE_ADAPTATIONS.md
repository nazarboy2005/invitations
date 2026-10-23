# Beshik source package

The isolated page keeps the captured Beshik template's structure, styling,
animation, copy, and artwork. `template.css`, `meta.js`, and the `art/` assets
are byte-for-byte copies of the untouched capture. The HTML keeps
the captured body except for changing its single-child `extras.celebrant` data
slot to the shared contract's first-person `groom` slot. The program heading is
bound to the shared `programHeading` field, and the calendar accessibility label
has Russian and English dictionary entries. `template.js` has the same narrow
mapping in its reveal callback. Its page imports use the local platform runtime,
and its Google Fonts import points to the bundled font faces.
The capture's sample override loader, invitation fixture, and standalone Marxaba
runtime are excluded.

`fonts.css` bundles the captured Fredoka 500/600 and Nunito 400–700 families,
including the Cyrillic subsets used by the supported locales. `locale-copy.js`
provides localized document and sharing metadata without changing the captured
page design. `src/templates/beshik/renderer.tsx` is a typed wrapper around the
shared invitation renderer. The typed catalog and additive migration register
the design in the `other` catalog category with `beshik-toyi` and `birthday`
event compatibility; publication remains disabled until release gates pass.

The source metadata declares `beshik-toyi` and `birthday`; both event IDs are
present in the shared contract and match the template's supported event types.
The editor treats Beshik as a one-celebrant invitation and labels the first
person field for the baby. The current contract has no venue-photo, to'yona
bank/name, or to'yona note fields; those source slots remain empty when there
is no creator data.

`contract-adapter.css` hides the unsupported empty To‘yona bank-name and note
slots while leaving the captured stylesheet and body unchanged. The venue
photo remains a contract/editor gap and receives no sample image.

No captured files were modified. The canonical catalog fixture remains the
only source of preview sample content; it is not saved or published. A scoped
adapter rule allows the shared name-fit hook to wrap the animated Beshik hero
and opening lockup when a long honoree name overflows, while normal names retain
the captured type. Focused static checks cover all four fixture locales, the
six-item program, dress palette, three preview wishes, To‘yona card/holder,
phone/Telegram contacts, icon-only empty gallery, and blank-draft isolation.
At 390×844, the captured opening and app renderer were compared, the long-name
opening/hero fit without horizontal overflow, all four locales switched, and
gallery wrap, gift disclosure, and RSVP count worked with clean console logs.
Source JS/CSS support reduced motion; runtime emulation was unavailable. Beshik
is published at 150,000 UZS through additive migration
`0064_publish_beshik.sql`. Venue photo and gift bank/note remain unsupported by
the contract and are not fabricated.

## 2026-10-23 source-fidelity audit

`Marxaba/capture-manifest.json` maps the source to
`Marxaba/Beshik to'yi/templates/beshik`. The all-provider search found no
alternate Beshik capture. `template.css`, `meta.js`, and both captured cradle
and venue WebP assets are byte-identical to the capture. In the body, only the
single-celebrant slots change from `extras.celebrant` to `groom`, and the
program heading is bound to `programHeading`. The matching JavaScript reveal
callback maps that same person to `groom`; the local page head replaces remote
fonts/site runtime with bundled Fredoka/Nunito and the shared invitation
runtime. `i18n.js` adds the calendar accessibility-label translation. The
opening animation and captured body design remain in place.

The catalog cover's provenance records the rendered source opening at
720×1280 (9:16). It shows the greeting, “Taklifnomani ochish” action, and
cradle artwork together. Catalog presentation fits the complete portrait art;
the distinctive first page is visible without cropping.
