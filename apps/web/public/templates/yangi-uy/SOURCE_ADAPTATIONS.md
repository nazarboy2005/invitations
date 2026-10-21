# Yangi Uy source package

Reference: `Invitations - this folder will be removed from production/Marxaba/Boshqa tadbirlar/templates/yangi-uy`.

The captured page body, `template.css`, `i18n.js`, `meta.js`, and `art/house-iso.webp` are copied byte-for-byte. `template.js` is copied with one dependency URL adjustment so its WebGL house animation loads the captured Three.js vendor from this isolated package. The source retains its opening, staged 3D house build and door interaction, fallback artwork, ambient dust, scroll choreography, calendar/countdown, program, venue/map links, dress code, garden gallery, RSVP, wishes, to‘yona, contacts, and music controls.

The `index.html` head is an adapter shell: it loads the application's same-origin invitation runtime, package-local fonts and original GSAP/ScrollTrigger/LZ String dependencies. It excludes the captured general sample loader and `sample-overrides.js`; creator or shared preview fixture data is injected by the separate typed adapter. The head's missing source Open Graph image (`og.jpg`) is pointed to this package's fixture-derived first-page preview instead. The body remains exactly as captured. Spectral 600 and Inter 400/500/600/700 are bundled as local WOFF2 subsets.

The typed adapter in `apps/web/src/templates/yangi-uy` delegates invitation data and APIs to the common Marxaba renderer. In preview only, it replaces the fixture's default wedding event label with a localized housewarming label; creator-authored event labels are preserved. This template remains unregistered and unpublished in this package-only task.

## Source metadata and remaining integration gaps

The captured `meta.js` declares category `yangi-uy` and event types `yangi-uy` and `osh`. `osh` exists in the shared contract; `yangi-uy` does not. A dedicated event type, localized editor option, supported-event metadata, and event-specific person/host editing need shared integration before selection/publication. This reference uses one house/family name slot (`extras.celebrant`); the common adapter presents the first available contract person in that slot, while the current invitation contract has no family-name/household-celebrant field.

The source includes an optional `venue.photo` slot, which is absent from the approved invitation contract. Leave it empty; do not substitute the house illustration or gallery. The captured metadata names `preview.webp`, but the reference folder has no such file, so this package's preview uses the actual opening renderer, artwork, and canonical presentation fixture. Preview provenance is recorded alongside the image.

## Source declarations

- Event types: `yangi-uy`, `osh`.
- Catalog category: `yangi-uy`.
- Style tags: `zamonaviy`, `ertak`.
- Motion: `3d` WebGL house animation with its source 2D/illustration fallback.
