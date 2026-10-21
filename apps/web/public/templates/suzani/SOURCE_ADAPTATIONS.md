# Suzani source package and adaptations

The original capture remains unchanged at `Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/suzani/`. The package keeps its template HTML, CSS, JavaScript, metadata, artwork, and localized copy isolated under this folder. Application data and service integration are provided by the typed `apps/web/src/templates/suzani/renderer.tsx` wrapper and the shared Marxaba adapter/runtime.

The captured HTML body is preserved except for one structural change: `.hero__art` is inserted as a real, aria-hidden layer between the hero canvas and cloth. The source used `.hero:before` for this artwork, but GSAP cannot animate a pseudo-element as a normal target. `template.css` therefore changes only that pseudo-element rule into the equivalent `.hero__art` layer, and `template.js` points the existing parallax animation at it. The original artwork, stacking order, and animation parameters remain intact. `tests/suzani-template.test.ts` verifies the normalized source transformations.

`index.html` replaces the reference's remote Google Fonts imports with local `fonts.css` and bundled Cormorant Garamond and Manrope files. It also loads the isolated shared Marxaba runtime from `../shared/nikoh`, without the reference's site-level sample invitation script. `preview.webp` is the captured `art/panel.webp` at its original portrait ratio, verified by SHA-256 in the package test.

No other template-specific markup or motion changes are intended. Creator content and preview fixture data are supplied through the shared typed adapter; the captured source files remain untouched.
