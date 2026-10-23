# Bitiruv source package

Reference: `Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/templates/bitiruv`.

The captured page body, `template.css`, `i18n.js`, `meta.js`, and `art/graduation-scene.webp` are copied byte-for-byte. `template.js` preserves the captured animation and interaction code with the two narrow platform adaptations described below. The page keeps the source opening choreography, WebGL graduation-cap scene and CSS fallback, scroll choreography, calendar, program, venue, dress code, yearbook/gallery, RSVP, wishes, gift, contacts, and music control. The original capture is not edited.

`index.html` is an adapter shell: its head points at the application's shared same-origin invitation runtime, package-local animation libraries, and locally bundled fonts. The source's general sample loader and `sample-overrides.js` are intentionally omitted so no source sample invitation can populate a real invitation. The captured body is unchanged. The original GSAP, ScrollTrigger, LZ String, and Three.js vendor files are packaged locally. The source script URL is adjusted to resolve Three.js from the package-local `vendor` directory. The source's WebGL resize callback has a null guard so a resize after the shared runtime disposes WebGL for the CSS fallback cannot throw. This guard does not change the animation while WebGL is active. Fonts are the exact Bebas Neue and Manrope families requested by the source, downloaded as local WOFF2 subsets.

The typed adapter is separate at `apps/web/src/templates/bitiruv`. It delegates data and API behavior to the common Marxaba renderer. The renderer maps exactly one contract person to the source celebrant and derives the monogram from that person's first character in each enabled locale; it does not invent a second honoree or initials. The editor presents one honoree field for Bitiruv and its graduation/corporate event types. Bitiruv is published at 150,000 UZS through additive migration `0073_publish_bitiruv.sql` after the contract, event compatibility, editor, save path, and release checks passed.

## Source metadata and remaining integration gaps

The captured metadata declares catalog category `bitiruv` and event types `bitiruv`, `tugilgan-kun`, and `korporativ`. The platform maps the two source IDs directly and maps `tugilgan-kun` to the existing `birthday` ID. Since category assignment is separate from event compatibility and there is no `bitiruv` catalog category, the unpublished catalog entry uses the existing `other` category. The `bitiruv`/`korporativ` event IDs are included in the shared contract, localized editor options, migration, default content and compatibility checks. A new invitation created from this template starts with its preferred `bitiruv` event type. Existing draft people are never truncated; the editor hides the add-person action in single-celebrant modes, and the source template displays the first person only.

The source contains an optional `venue.photo` slot; the approved invitation contract has no venue-photo field. Do not substitute the graduation artwork or creator gallery media there. The app-owned `contract-adapter.css` hides only this source-only photo slot, while preserving venue name, address and map links. Source metadata's `preview.webp` did not exist in the capture; the packaged preview is captured from the real opening with the shared centralized preview fixture, and its provenance is recorded beside it.

The source also contains `toyona.note` and `toyona.bank` slots, which are absent from the approved shared contract (bank-name entry is intentionally removed). The same app-owned stylesheet collapses these empty slots, along with an empty optional card-holder slot, while retaining the To‘yona section and supported card number/holder data.

## Source reference

Event types: `bitiruv`, `tugilgan-kun`, `korporativ`.
Catalog category: `bitiruv`.
Source design style tags: `zamonaviy`, `bolalar`.
Motion: `3d` WebGL caps with CSS fallback and source GSAP choreography.

## 2026-10-23 source-fidelity audit

`Marxaba/capture-manifest.json` maps the source to
`Marxaba/Boshqa tadbirlar/templates/bitiruv`; all-provider name and manifest
search found no alternate Bitiruv capture. The captured body, stylesheet,
translations, metadata, and graduation artwork match after line-ending
normalization. The page head redirects captured remote fonts and the
standalone site runtime to the bundled Bebas Neue/Manrope fonts, local
animation libraries, and shared invitation runtime. The script changes are
the documented local Three.js URL and null guard for resize after WebGL
fallback/disposal; the opening and scroll choreography stays in the source
script.

The catalog artwork is 480×720 (2:3 portrait), a render of the actual opening
with graduation-cap scene, greeting, one honoree, and open action. The catalog
card scales it to the available portrait height without cropping, so the
distinctive diploma opener remains visible. Provenance and the rendering
fixture are recorded in `preview.provenance.json`.
