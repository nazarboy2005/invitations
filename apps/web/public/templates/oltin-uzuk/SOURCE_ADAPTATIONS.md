# Oltin Uzuk application adapter notes

The captured invitation HTML, visual styles, ring animation, and artwork remain
packaged as the template renderer. The shared Marxaba runtime maps the typed
invitation contract into the captured slots and owns the gallery controls.

- Catalog and blank template-selection previews may receive the shared,
  four-locale `preview-sample.json` fixture, including the six-item program,
  clothing palette, preview wishes, To‘yona card details, and phone/Telegram
  contacts. This sample is never part of a saved invitation or a public
  invitation.
- The source gallery remains a horizontal, scroll-snapping gallery. Empty
  preview photos render the shared icon placeholder without visible alt text.
  Previous/next and dot controls use the shared modulo index and smooth-scroll
  behavior (or instant movement under reduced motion); template-local handlers
  only arrange the captured center/side styling to avoid competing scrolls.
- The source has `toyona.note` and `toyona.bank` slots, while the shared contract
  does not. The scoped `contract-adapter.css` hides those empty slots without
  changing the captured `template.css`.
- Visual browser checks and live save/reopen behavior require the app and its
  services; these static checks do not substitute for those release gates.

The catalog now uses `catalog-cover-opening.png`, a 450×800 browser capture of
the packaged renderer's initial `#intro` page using the shared catalog fixture.
The older `preview.webp` remains in the package but is no longer the catalog
image. Capture viewport, locale, excluded UI, source and fixture hashes, and the
artwork hash are pinned in `preview.provenance.json`; the original capture tree
is unchanged.
