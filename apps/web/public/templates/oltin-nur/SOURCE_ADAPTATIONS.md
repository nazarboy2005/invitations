# Oltin Nur platform adaptations

The captured template and its source assets remain isolated under this folder.
The shared Marxaba renderer supplies invitation values and API behavior.

The source has `toyona.note` and `toyona.bank` slots, but the approved gift
contract does not define those fields. `contract-adapter.css` hides these
empty slots when a creator has card details, avoiding visible blank rows while
preserving the captured gift-card design. The empty gallery sample is rendered
by the shared runtime as an icon-only placeholder; its image alt text stays
empty when no user photo exists. The source gallery is a scroll-driven
horizontal strip, not a row with explicit next/previous buttons. The shared
lightbox's next/previous controls wrap at either end; strip scrolling follows
the source animation and reduced-motion preference.

Catalog and first-step samples are ephemeral display data. They are passed
through the preview renderer only and never written through save/publication
paths. Mobile interaction, reduced-motion browser emulation, and save/reopen
service checks remain release limitations.

The catalog cover is a 720×1280 capture of the canonical Marxaba renderer's
settled `#intro` screen. Capture provenance and SHA-256 values are recorded in
`preview.provenance.json`; the raw PNG is retained as `preview-capture.png`.
The capture hides the shared `.mh-lang` control and excludes browser/app chrome
and scrollbars. The source CSS intentionally hides the names/date on the initial
cover and reveals them during the seal-opening sequence, so the cover preserves
that behavior rather than exposing those slots early.
