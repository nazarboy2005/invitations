# Yangi Uy source and integration record

Reference: `Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/templates/yangi-uy`.

The captured body, `template.css`, `i18n.js`, `meta.js`, and `art/house-iso.webp` remain byte-for-byte unchanged. `template.js` has one path adaptation so the source WebGL house animation loads its captured Three.js bundle from this isolated package. The adapter head loads the local fonts, local GSAP/ScrollTrigger/LZ String dependencies, and the platform invitation bridge; it omits the reference app's sample-data loader. Preview metadata points at the fixture-rendered portrait opening with recorded dimensions, fixture name, and SHA-256.

The shared Marxaba renderer is used in creator preview and public display. The Yangi Uy source declares catalog category `yangi-uy` and compatible event types `yangi-uy` and `osh`. Its unpublished typed catalog record and additive migration `0048_add_yangi_uy_template.sql` register that category and event support separately. Yangi Uy is dispatched through the shared Marxaba source renderer and is not published/selectable pending browser and service release verification.

The reference's `extras.celebrant` household/host lockup maps to the first localized `content.people` value. The studio shows a one-person household field for Yangi Uy, with the Uzbek Latin example “Masalan, Rahmonovlar xonadoni”; names and hosts are independent editable contract fields. Catalog/initial-selection samples live only in `preview-sample.json` and use a localized Rahmonov household, housewarming copy, venue, six-item program, dress code, and the standard six empty gallery entries. That presentation fixture never enters a saved invitation.

The packaged 480×720 `preview.webp` still shows Javohir and Madina from before the housewarming fixture was integrated; the current sample is the single household name Rahmonovlar xonadoni. Its provenance marks it `stale-needs-render-after-household-fixture-integration`. The untouched source capture has no `preview.webp` despite that metadata name, and `art/house-iso.webp` is its only image asset. That isolated house illustration is not a complete first-page design. Without rendering the current source HTML/CSS/JavaScript and fixture, no authentic replacement image can be selected or given honest capture provenance; composing replacement lettering over the stale image or framing the isolated art as a page would be an approximation. Browser access was unavailable during this static audit, so the stale image remains unchanged and Yangi Uy stays unpublished.

The source gallery markup is copied unchanged, including its previous/next controls and dot navigation. Shared gallery runtime binds the repeatable contract gallery list, wraps button navigation across its item count, scrolls smoothly unless reduced motion is requested, and supplies the source's decorative star fallback when an entry has no photo. The captured source's garden trellis, staged gallery-card motion, and responsive CSS remain part of the package. Full interactive/browser verification is still a release gate.

## Known contract gap

The source has an optional `venue.photo` image slot, but the approved shared venue contract has no venue-photo field or upload flow. The adapter leaves that slot empty and does not substitute the house illustration or gallery images. This is recorded as a product/data capability gap; the remaining mapped source sections and interactions use the existing invitation and service contracts.

## Source declarations

- Event types: `yangi-uy`, `osh`.
- Catalog category: `yangi-uy`.
- Style tags: `zamonaviy`, `ertak`.
- Motion: source Three.js house build with its illustrated fallback, ambient dust, and GSAP scroll choreography.
