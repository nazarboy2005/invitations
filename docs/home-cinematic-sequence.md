# Homepage cinematic sequence

Approved 2026-10-25 after reviewing the user's Bugatti Chiron screen recording.
Replaces the previous Why us cards after the eight featured templates. Four
scenes share one pinned viewport. Incoming scenes cover the previous photograph
from below over 32svh of scrolling (about 3.1 times the normal scroll speed).
Only when a scene fills the screen does its 90svh reading phase start. Its copy
starts near the bottom, moves upward and clears the top while the photograph
stays still. Then the next reveal starts. The final scene has the same reading
phase before the stage releases naturally into the next section.
Touch scrolling remains native. Reduced motion and very short landscape
viewports use ordinary stacked scenes. No live template iframe is loaded here.

Very short means under 501px tall, or desktop/tablet landscape under 641px
tall. Portrait phones at 320×568 retain the overlap, with compact sample UI.
The returning transparent header uses dark text over the new daylight scenes.

The invitation artwork is the existing catalog poster, with decorative code
compositions for personalization, venue navigation and guest replies/wishes.
All screenshots/replies/venue imagery are samples; the compact footer explains
design-dependent availability and retains optional to‘yona information.

## Follow-up refinements

- The user rejected the pale venue map card. Its replacement places a dotted
  route, location pin, city/date and a compact navigation label directly over
  the venue photograph, with no pale paper panel or “Sizni kutamiz” heading.
  A later laptop readability correction adds a small translucent smoked-plum
  backing and larger labels behind the city/date/navigation group.
- User approved regenerating all four scenes as bright daylight photography.
  The website now uses the `*-daylight.webp` files and their portrait versions,
  charcoal/pomegranate copy, and light local washes. The original dark assets
  remain as references. See `home-cinematic-daylight.md` for the current prompts,
  asset paths and verification. The platform remains light.
- Latest correction replaces the sibling/margin implementation. Copy's start
  position is measured from its own height, so it stays low until the reveal
  finishes. The same scroll position always yields the same phase in either
  direction. Phone sample artwork sits above the initial copy and fades before
  the rising copy reaches it; a feathered local shade preserves readability.
- At 1440×900, the first and second scenes start copy at y=565px. Halfway through
  the first reading phase, its copy is at y=135px, image translation stays 0px,
  and the next panel remains at y=900px. At the end, copy bottom is -31px. During
  the next 288px of scroll the next panel covers all 900px of viewport. Halfway
  through that reveal, its copy remains below the viewport at y=1015px.
- Reviewed all four scenes at 1440×900 and 390×844, plus the final scene at
  320×568. Phone copy starts low (first at y=600px on 390×844), has no horizontal
  overflow, and the final button remains visible. Checked section exit and the
  final link opening the catalog. Fresh console error checks were empty.
- TypeScript passes. Fresh browser checks reported no console errors. Revised
  venue screenshots are `test-results/home-cinematic-venue-refined.png` and
  `test-results/home-cinematic-venue-refined-mobile.png`.

## Image assets

Generated using the built-in image generation tool. Final WebP assets live in
`apps/web/public/images/home/cinematic/`: `design`, `personal`, `venue`,
`together`, with matching `-mobile` portrait versions. Desktop images are
1600×900; mobile crops are 700×1000. Live copy and UI are separate from the
photographs. Original generated PNGs remain in the tool's generated-images folder.

The filenames and prompts below describe the original moody campaign. It has
been superseded on the website by the daylight campaign documented in
`home-cinematic-daylight.md`.

## Final prompts

### Scene 1

Use case: product-mockup. Asset type: cinematic full-bleed website photograph, landscape 1920x1080. Primary request: premium wedding invitation editorial still life, first of a coordinated four-scene campaign for an Uzbek online invitation brand. Photograph only, NO text, NO letters, NO phone, NO interface, NO watermark. Deep pomegranate burgundy silk draped on a charcoal stone tabletop, a beautiful stack of unprinted ivory cotton wedding stationery with a delicate small gold wax seal, white garden roses, and one small pomegranate. Composition: keep entire LEFT 45 percent dark, uncluttered negative space for live white website copy; arrange stationery, silk and roses on RIGHT half, with clean space over the right-center tabletop where a live phone will be composited in code. Low camera angle, large soft directional side light, tactile silk and paper, restrained warm highlights, realistic lens and shallow depth of field, luxurious but intimate. No cream background, no illustration. Center-weight the right-half objects so portrait crop x=45% to 90% remains attractive.

### Scene 2

Use case: photorealistic-natural. Asset type: full-bleed cinematic website photograph landscape 1920x1080, part of a coordinated premium Uzbek wedding invitation campaign. Photography only, NO text, NO letters, NO phone, NO interface, NO watermark. Rich charcoal shadows, pomegranate burgundy accents, white roses, restrained warm highlights, realistic tactile materials, editorial photography, luxury intimate rather than commercial stock. Scene 2: an extreme close editorial still life of ivory cotton wedding stationery, slender burgundy silk ribbon, two delicate gold wedding bands and white rose petals, lit by a narrow beam of late-afternoon light on dark burgundy silk. Arrange the glowing paper and rings on LEFT half, keep RIGHT half deeply shadowed uncluttered for white website copy. No writing or printing on paper. Diagonal composition, shallow depth, paper grain, rich contrasting shadows.

### Scene 3

Use case: photorealistic-natural. Asset type: full-bleed cinematic website photograph landscape 1920x1080, part of a coordinated premium Uzbek wedding invitation campaign. Photography only, NO text, NO letters, NO phone, NO interface, NO watermark. Rich charcoal shadows, pomegranate burgundy accents, white roses, restrained warm highlights, realistic tactile materials, editorial photography, luxury intimate rather than commercial stock. Scene 3: a beautiful elegant wedding venue courtyard in Tashkent at blue hour, symmetrical tall arched entrance, a softly illuminated stone path leading to the entrance, generous white flowers and candle lanterns, tiny burgundy floral accents. Venue on RIGHT two thirds, LEFT third is deeply shadowed soft out-of-focus garden foreground with clean negative space for white text. Beautiful photographic light, realistic Central Asian architecture with restrained modern elegance, no people, no lettering, no logos. Camera at human height with depth and inviting perspective. Preserve entrance in portrait crop of right-center.

### Scene 4

Use case: photorealistic-natural. Asset type: full-bleed cinematic website photograph landscape 1920x1080, part of a coordinated premium Uzbek wedding invitation campaign. Photography only, NO text, NO letters, NO phone, NO interface, NO watermark. Rich charcoal shadows, pomegranate burgundy accents, white roses, restrained warm highlights, realistic tactile materials, editorial photography, luxury intimate rather than commercial stock. Scene 4: very intimate close-up of two guests' hands warmly clasped together at the LOWER LEFT of frame, natural skin and elegant sleeves, distant wedding celebration amber fairy lights and creamy white floral bokeh. Dark charcoal and burgundy tones. Keep upper RIGHT half dark uncluttered for white live text, LEFT CENTER mostly softly blurred burgundy sleeves and bokeh where a live phone will be placed in code above the hands. Authentic warm emotion, shallow depth, realistic human anatomy. No faces visible, no phones, no lettering.

## Verification

- TypeScript and the isolated production build passed.
- Browser reviewed at 1440×900, 768×1024, 390×844 and 320×568.
  Incoming scenes cover the pinned previous scene, and upward scrolling
  reverses the reveal. The header returns with light text over the photographs.
- Mobile selects the portrait WebPs; 320px and 390px checks showed no horizontal
  document overflow. Small-phone guest-wish copy stays inside its sample phone.
- The final scene's catalog action opened `/templates` successfully. A fresh
  browser check had no console errors; the existing intermittent database
  fallback warning can still appear independently of this section.
- Saved previews: `test-results/home-cinematic-desktop.png` and
  `test-results/home-cinematic-mobile.png` (ignored local QA artifacts).
- Current timing previews: `test-results/cinematic-timing-desktop-start.png`,
  `test-results/cinematic-timing-desktop-reading.png` and
  `test-results/cinematic-timing-mobile-start.png`.

