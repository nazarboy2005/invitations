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

No captured files were modified. The canonical catalog fixture remains the
only source of preview sample content; it is not saved or published. Beshik
stays unpublished pending browser locale, mobile, reduced-motion, interaction,
and service verification.
