# Vals release QA

The Vals renderer uses the isolated capture at
`apps/web/public/templates/vals` through the shared `MarxabaInvitation` typed
adapter. `tests/vals-template.test.ts` compares the visible body, captured
styles, scripts, metadata, and artwork against the untouched
`Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/vals`
capture. The catalog image is a 720×1280 browser render of the complete `#intro`
opening using the canonical preview fixture. Its source and fixture checksums
are in `apps/web/public/templates/vals/preview.provenance.json`.

Release review (2026-10-21): Uzbek Latin, Uzbek Cyrillic, English, and Russian
were checked after opening; desktop and 390px mobile viewports had no horizontal
overflow. The source opening, skip and spin controls, full invitation sections,
sample program/gallery/wishes/contacts, and reduced-motion opening were checked.
No Vals asset or script request failed and no Vals-frame console errors appeared.
The local preview page separately requests a missing app-level `/favicon.ico`.

Known product/service gaps: the captured venue section has a `venue.photo` slot,
but the approved invitation contract and editor intentionally have no venue-photo
field. Do not populate it with sample media; it remains an explicit content gap.
The source also has a bank-name slot, while the approved gift contract has no
bank-name field and the user asked to remove that field; it remains blank by
design. RSVP and wishes are preview-only during this review. Live service,
database, and external deployment verification remain outside this release QA.
Keep the template unpublished until the project-wide integration and service
gates pass.
