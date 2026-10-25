# Homepage invitation steps

The closing section of the cinematic features uses the user's supplied
three-card stationery reference. It retains the existing Uzbek three-step
heading and replaces the intervening to‘yona promotion and sample disclaimer.
The cinematic animation and timing are unchanged.

The section is rendered by `components/invitation-steps.tsx`, with server-rendered
links to the catalog, studio and existing invitations. The photograph is
decorative; all explanatory copy, headings and actions are HTML. Three cards
share a row on laptops and stack vertically below a dedicated photographic
crop on phones. Hover movement respects reduced motion.

Verification: web TypeScript and an isolated production build passed. Browser
review covered 1366×768 and 1024×768 laptops, plus 390×844 and 320×568 phones.
No horizontal overflow or browser errors; the new section starts exactly at
the end of the cinematic track with no intervening block. Screenshot previews
are saved locally under `test-results/invitation-steps-*.png`.

## Artwork

Created with the built-in image generation tool, then edited with that same
tool to add the printed J & M monogram matching the cinematic sample.
WebP encoding and responsive cropping use Sharp. Assets:

- `apps/web/public/images/home/invitation-steps.webp` — 1920 × 800
- `apps/web/public/images/home/invitation-steps-mobile.webp` — 1000 × 770

### Generation prompt

Use case: photorealistic-natural. Asset type: wide photographic background for an elegant online invitation website's three-step section. Create a high-end daylight still life matching a soft romantic ivory wedding stationery campaign. Landscape 2.4:1 composition. On the right third, one large rounded-corner blank ivory cotton-paper invitation leaning slightly backward on a white limestone tabletop, accompanied by fresh white lisianthus and white roses, muted olive natural leaves and a flowing champagne blush satin ribbon. Fine embossed rectangular border on paper, completely blank center, no text, no letters or monograms. Left 52 percent is clean luminous ivory negative space for HTML heading; bottom 30 percent is pale softly out-of-focus stone for three HTML glass cards. Bright natural window light from upper right, warm white palette, soft realistic shadows and delicate paper fibers, refined editorial photograph, subtle depth of field. Flowers and card must be visibly elegant, not washed away. No UI, no buttons, no cards beyond the single physical stationery, no watermark. The image is a background only.

### Edit prompt

Edit this photograph only on the blank physical invitation paper. Preserve the exact composition, all flowers, ribbon, lighting, size and background. Add a refined warm taupe letterpress monogram with 'J' slightly above and left of 'M', with small '&' between them, centered in the upper middle of the blank card. Below monogram add tiny widely spaced text 'BIRGA BOSHLANADI' and one delicate small fine-line floral flourish. Elegant traditional serif lettering, subtle taupe ink, fully realistic printed into cotton paper, not floating UI. No other changes.
