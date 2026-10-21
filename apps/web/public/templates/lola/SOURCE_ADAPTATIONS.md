# Lola platform adaptations

The captured invitation body, template styles, motion scripts, metadata, and
art remain intact. This adapter stylesheet handles source fields that the
approved invitation contract does not currently provide:

- Lola asks for a venue photograph, but the shared editor/contract has no
  venue-photo field. When no photo is available, hide only its empty photo
  frame; keep the venue name, address, and map links. If coordinates allow the
  shared runtime to load a map into that frame, keep the frame visible.
- The source has a gift note slot and a bank-name slot. The current gift
  contract supports card number and cardholder only, so empty notes and the
  unsupported bank line are hidden without adding fields or sample data.

The stylesheet is loaded after the captured template styles. It does not alter
the captured source files or the catalog-only preview fixture. The source
package remains unpublished until browser, mobile, reduced-motion,
save/reopen, and service checks pass.
