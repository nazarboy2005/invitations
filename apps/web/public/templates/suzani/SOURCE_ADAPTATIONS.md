# Suzani source package and adaptations

The original capture remains unchanged at `Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/suzani/`. The package keeps its template HTML, CSS, JavaScript, metadata, artwork, and localized copy isolated under this folder. Application data and service integration are provided by the typed `apps/web/src/templates/suzani/renderer.tsx` wrapper and the shared Marxaba adapter/runtime.

The captured HTML body is preserved except for one structural change: `.hero__art` is inserted as a real, aria-hidden layer between the hero canvas and cloth. The source used `.hero:before` for this artwork, but GSAP cannot animate a pseudo-element as a normal target. `template.css` therefore changes that pseudo-element rule into a `.hero__art` layer, and `template.js` points the existing parallax animation at it. The source's broad `.hero > *:not(.satin-hatch)` rule otherwise overrides the inserted layer's absolute positioning, so `contract-adapter.css` restores its original absolute position and negative stacking order. This preserves the source artwork placement and animation while keeping the platform-specific correction separate. `tests/suzani-template.test.ts` verifies the normalized source transformations.

`index.html` replaces the reference's remote Google Fonts imports with local `fonts.css` and bundled Cormorant Garamond and Manrope files. It also loads the isolated shared Marxaba runtime from `../shared/nikoh`, without the reference's site-level sample invitation script. `preview.webp` is the captured `art/panel.webp` at its original portrait ratio, verified by SHA-256 in the package test.

No other template-specific markup or motion changes are intended. Creator content and preview fixture data are supplied through the shared typed adapter; the captured source files remain untouched.

The captured `venue.photo` hook has no approved contract field, and the optional
`toyona.bank` and `toyona.note` hooks have no supported creator fields.
`contract-adapter.css` hides the empty venue-photo frame unless the shared
runtime is using it to display a map, hides the source's static “Manzil” photo
caption over that map, and removes the blank gift note and unsupported bank
slot. The approved gift card number and holder remain bound to the typed gift
contract. `preview.provenance.json` records the catalog image as an exact copy
of the captured `art/panel.webp` asset, including its dimensions and checksum.
