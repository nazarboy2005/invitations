# Orchid Amplop

Orchid Amplop is isolated under this folder. Its original stylesheet is preserved verbatim from Chorlove component module 482485, with the full template markup, source motion, seven recovered source images, and local Comfortaa/Allura subsets. The iframe adapter is separate from the template package. No Chorlove site runtime, authentication, analytics, or sample invitation record is copied into the renderer.

## Source graph and assets

The captured preview frame is opening-only. Its route component is module 482485 and entry shim 838250 in 0v0-3ulc~exde.js; module 437202 in 0d2h69c7a3snv.js supplies the default gallery. The restored source frame references 16 local JavaScript chunks. Its component chunk matches the captured provenance SHA-256. The restored source image directory contains eight files; all eight are byte-identical to the package. A search across the complete restored Web invitations tree found the seven other component-referenced image paths absent. Their exact source URL responses are packaged and hashed. The package manifest and all nine font subsets validate against their SHA-256 values. The embedded CSS matches the recorded source hash.

The portrait catalog image is a 450×800 capture of the actual opener using the canonical catalog fixture, without app chrome. The remote metadata image is not used because it contains fixed couple names and provider UI. Both typed catalog rows point to assets/catalog-opening.png.

## Shared invitation mapping and source sections

- Localized couple names, host names, greeting and personalized guest greeting, message, event date/time/timezone/countdown/calendar, venue/address/map, and repeatable program are supplied by the shared invitation adapter.
- Source-designed sections are the opener/hero, couple portraits, date/program, story, gallery/lightbox, gift card, wishes, RSVP, and footer contacts. Story, gallery, gift, wishes, and RSVP visibility follows available contract data and the source's optional-section behavior. The captured source has no dress-code section or extra-family-people section; the Orchid adapter suppresses those generic platform insertions.
- The catalog/initial-selection fixture uses the six original Orchid gallery images in the exact source order (gallery-2, gallery-1, gallery-3, gallery-6, gallery-4, gallery-5). They are ephemeral. Creator uploads replace them; public invitations never receive source demo photos. Source portraits and story images are preview-only fallbacks because the shared contract has no fields for those image slots.
- Gift card number, cardholder, and optional note use the source gift-card reveal/copy layout. The platform receipt-upload form is attached inside the revealed gift card when enabled; it remains hidden when receipts are disabled.
- RSVP presents only guest name and attending/not attending. The adapter submits the existing fixed party size (1 for attending, 0 for not attending); it does not prompt for guest count. RSVP/wishes API release checks are tracked separately and are not publication blockers under the current decision.
- Uzbek Latin, Uzbek Cyrillic, English, and Russian controls are localized. The Uzbek Latin opener now matches the captured source wording, including the prayer, blessing, invitation line, and wedding label.

## Fidelity and motion

The source component declares gallery image scale 0.96→1 on entry and 1→0.96 on exit, with opacity 0→1/1→0; backdrop opacity uses the same source spring. The adapted WAAPI spring uses Framer Motion's defaults (stiffness 100, damping 10, mass 1); the current implementation's generated scale spring lasts 350 ms and opacity spring lasts 1083 ms. The previous 717 ms scale measurement was for the older 0.8→1 approximation and is superseded. Package reduced-motion mode opens and closes without motion. The captured source still animates its opener/reveals and lightbox under reduced motion; the app intentionally suppresses those animations as its accessibility adaptation. This difference is documented rather than claimed as exact reduced-motion parity. The latest source/package browser comparison attempt was invalid (the local source page returned 403 and the package screenshot captured its wrapper), so the corrected scale has not received a fresh visual browser comparison.

Normal/reduced runtime checks also confirmed six preview gallery cells, loaded local images and fonts, immediate reduced-motion opening, and no visible dress-code or extra-people section. Source and package use the same hero, emblem, envelope, couple/divider artwork, gallery assets, and footer decoration. Source captures remain untouched.

## Current release state

Migration 0132_register_orchid_amplop.sql is applied. The configured database previously confirmed the wedding-only row unpublished at 150,000 UZS and the public catalog omitted it. The current typed registry remains unpublished. No Orchid invitation record exists, so saved-draft reopen and public-invitation rendering have not been verified. These non-RSVP lifecycle checks remain open; RSVP/wishes alone do not block publication. Do not publish until the remaining non-RSVP integration gates pass.
