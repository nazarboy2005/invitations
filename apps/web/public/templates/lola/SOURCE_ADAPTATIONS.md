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
the captured source files or the catalog-only preview fixture. Lola is published
after desktop/mobile, four-locale, interaction, source-contract, build, and
save/reopen checks passed. Browser reduced-motion emulation remains unavailable;
captured and platform CSS paths are covered by source checks.

The packaged `template.js` and `template.css` also include a focused motion
repair for a captured GSAP warning. GSAP cannot select the CSS pseudo-element
`.footer:before` as a DOM target; the adapter animates the footer's
`--footer-glow-opacity` custom property instead, and the pseudo-element reads
that property. The scroll-linked glow is preserved and the warning is removed.

The catalog artwork retains the existing captured opening and its 480 × 900
fixture presentation. Its previous screenshot included the shared runtime's
injected `.mh-lang` switcher in the otherwise empty top-right margin. The
artwork was cleaned by replacing only that margin with a fresh capture of the
same local preview route after hiding `.mh-lang` and the Next.js development
badge; all pixels outside the 160 × 70 cleanup patch are preserved losslessly.
The original reference capture and fixture remain unchanged. See
`preview.provenance.json` for the route, viewport, fixture checksum, and patch
bounds.
