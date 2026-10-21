# Korporativ source adaptations

The source capture is `Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/templates/korporativ`; it is untouched. The captured body markup, CSS, localization script, metadata, and four SVG assets are byte-identical in the app package. The template script changes only the local Three.js path to the app's shared local build. Fonts and GSAP/ScrollTrigger/LZ dependencies are local. The captured sample-overrides code is excluded.

The metadata's declared event IDs `korporativ`, `bitiruv`, and `yubiley` are registered exactly in the typed catalog and additive database seed. Categories are independent; the initial assignment uses the existing `other` category. The template remains unpublished.

The creator form allows one honoree for this design. Its source-only `extras.celebrant` reads the first localized contract person. Existing additional names in older drafts remain stored, and the shared renderer does not display a fabricated second person. The centralized preview fixture has localized corporate event content, a company/team name, six agenda items, and business-formal color guidance for Uzbek Latin, Uzbek Cyrillic, English, and Russian.

The source also contains `program[].speaker`, `extras.parking`, and `venue.photo`, none of which is represented by the approved invitation contract. `contract-adapter.css` hides these source-only blank areas; it does not borrow invitation gallery or catalog artwork. Venue name, address, and map links continue to use supported contract fields. Source metadata references `preview.webp`, which is absent from the capture; the app preview is a portrait capture of the authentic source opening using the central corporate fixture. Its dimensions and checksum are covered by the focused test.

The source opening, section structure, localized fixed copy, responsive rules, reduced-motion behavior, and assets have static regression coverage. Desktop/mobile interaction, locale switching, reduced-motion behavior in a browser, console/network inspection, and authenticated save/reopen checks remain release gates.
