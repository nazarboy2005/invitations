# Paxta platform adaptations

The captured invitation body, styles, motion, metadata, and artwork are
preserved. `contract-adapter.css` hides only source fields without a supported
value in the current invitation contract:

- Venue photos are not collected or stored. The empty photo frame is hidden;
  venue text and map links remain, and the frame remains available if the
  shared runtime displays a map in it.
- The shared gift contract has no gift note or bank name. The empty note and
  unsupported bank-name slot are hidden; the preview-only card number and
  cardholder continue to render.

The shared sample fixture is used only for catalog and initial template
selection previews. Blank drafts and public invitations receive no sample
people, dates, wishes, gift details, or contacts. Browser/mobile interaction,
reduced-motion, and save/service verification remain release gates.
