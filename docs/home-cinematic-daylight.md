# Daylight cinematic artwork — 2026-10-25

User approved regenerating all four photographs to fit the light platform and
adding a translucent backing to the venue labels after finding them faint on
laptops. The section retains the corrected reveal/reading timing.

Generated with the built-in image generation tool. Final assets are in
`apps/web/public/images/home/cinematic/`: `design-daylight.webp`,
`personal-daylight.webp`, `venue-daylight.webp`, `together-daylight.webp`, plus
matching `-mobile.webp` variants. Desktop output is 1600×900; portrait variants
are 700×1000 with scene-specific crop centers. Earlier dark assets remain
available for reference but the website now uses the daylight filenames.

The photos use daylight, white stone, champagne textiles, white flowers and
restrained pomegranate accents. Chapter typography uses charcoal/pomegranate;
local washes are light. The venue city/date/navigation uses larger text over
a smoked plum translucent panel, with a contrasting route and location pin.

## Final prompt set

### Scene 1

Use case: photorealistic-natural. Asset type: cinematic full-bleed website photographic background, landscape 1920x1080, for a premium Uzbek online wedding invitation brand. This is a coordinated BRIGHT DAYLIGHT editorial campaign. Palette predominantly white limestone, ivory paper, champagne fabric, soft warm-grey shadows, white flowers, small restrained pomegranate/burgundy accents. Airy, luminous, elegant and realistic. Soft diffused morning window light with bright midtones and delicate natural shadows. No dark mood, no black backgrounds, no night lighting, no dramatic spotlight, no heavy vignette. Photographs only: NO text, NO lettering, NO phone, NO screens, NO UI, NO watermark. Leave composition space for real website typography and a phone added later in HTML. Scene 1, the first impression: ivory cotton wedding stationery envelopes with a small gold wax seal, white garden roses and one small pomegranate on a beautiful WHITE limestone tabletop with champagne silk and a thin burgundy ribbon. Low editorial camera angle with visible depth and paper grain. Keep LEFT 45% clean pale limestone as negative space for dark website copy. Arrange paper, roses and champagne silk mainly on the RIGHT half. The background must visibly feel pale, fresh and sunlit, with real detail in all shadows. Objects on right-center must remain attractive in a portrait crop around 65% horizontal position.

### Scene 2

Use case: photorealistic-natural. Asset type: cinematic full-bleed website photographic background, landscape 1920x1080, for a premium Uzbek online wedding invitation brand. This is a coordinated BRIGHT DAYLIGHT editorial campaign. Palette predominantly white limestone, ivory paper, champagne fabric, soft warm-grey shadows, white flowers, small restrained pomegranate/burgundy accents. Airy, luminous, elegant and realistic. Soft diffused morning window light with bright midtones and delicate natural shadows. No dark mood, no black backgrounds, no night lighting, no dramatic spotlight, no heavy vignette. Photographs only: NO text, NO lettering, NO phone, NO screens, NO UI, NO watermark. Leave composition space for real website typography and a phone added later in HTML. Scene 2, personal details: closer editorial view of unprinted ivory cotton stationery, a slender burgundy silk ribbon, two delicate gold wedding rings and white rose petals, on pale champagne silk on a WHITE marble table. Arrange tactile paper and gold rings on LEFT half; keep RIGHT 45% clean softly lit ivory/champagne negative space for dark website copy. Delicate angled composition, natural paper texture, gentle depth of field, bright airy morning light. No writing on the paper. No dark cloth. Portrait crop around 32% horizontal position should capture paper, rings and ribbon.

### Scene 3

Use case: photorealistic-natural. Asset type: cinematic full-bleed website photographic background, landscape 1920x1080, for a premium Uzbek online wedding invitation brand. This is a coordinated BRIGHT DAYLIGHT editorial campaign. Palette predominantly white limestone, ivory paper, champagne fabric, soft warm-grey shadows, white flowers, small restrained pomegranate/burgundy accents. Airy, luminous, elegant and realistic. Soft diffused morning window light with bright midtones and delicate natural shadows. No dark mood, no black backgrounds, no night lighting, no dramatic spotlight, no heavy vignette. Photographs only: NO text, NO lettering, NO phone, NO screens, NO UI, NO watermark. Leave composition space for real website typography and a phone added later in HTML. Scene 3, the destination: a beautiful elegant wedding venue courtyard in Tashkent on a bright softly sunny morning, warm WHITE limestone symmetrical tall arched entrance, restrained Central Asian carved details, white garden roses, a pale stone path leading to the entrance, a few champagne fabric accents, a tiny burgundy floral accent. Architecture on RIGHT two thirds, LEFT third softly out-of-focus pale flowers and light stone creating negative space for dark website copy. Blue sky very pale and soft. Inviting refined daytime wedding venue, realistic human-eye camera perspective, no people, no writing, no logos. Keep the arched entrance around 70% horizontal position so a portrait crop retains it. Avoid dark trees, evening, candle glow and strong black shadows.

### Scene 4

Use case: photorealistic-natural. Asset type: cinematic full-bleed website photographic background, landscape 1920x1080, for a premium Uzbek online wedding invitation brand. This is a coordinated BRIGHT DAYLIGHT editorial campaign. Palette predominantly white limestone, ivory paper, champagne fabric, soft warm-grey shadows, white flowers, small restrained pomegranate/burgundy accents. Airy, luminous, elegant and realistic. Soft diffused morning window light with bright midtones and delicate natural shadows. No dark mood, no black backgrounds, no night lighting, no dramatic spotlight, no heavy vignette. Photographs only: NO text, NO lettering, NO phone, NO screens, NO UI, NO watermark. Leave composition space for real website typography and a phone added later in HTML. Scene 4, loved ones: an intimate close view of two hands gently clasped at LOWER LEFT, one with a light ivory/champagne embroidered sleeve and delicate ring, the other with a light warm-grey suit sleeve. Background is a bright softly blurred daytime garden wedding with WHITE roses, champagne linen and sunlit creamy bokeh. Realistic hands with natural anatomy, no faces. Keep upper RIGHT half airy ivory/very pale blush negative space for dark website copy; left-center softly blurred pale sleeves and flowers with room for an HTML phone mockup above hands. Gentle warm emotion and bright daylight; no dark burgundy fabric blocks or night lights. Hands visible around lower-left 30% horizontal position.

## Verification

- TypeScript passes; the production build compiled and generated all routes.
- Visually checked all four scenes at 1366×768 and 390×844; checked the venue
  backing at 1024×768 and 320×568, plus the last scene at 320×568. No horizontal
  document overflow was present. All desktop/portrait artwork loaded.
- Venue labels have their own translucent backdrop, larger type and a brighter
  label color. The route uses a contrasting pomegranate line. The returning
  header uses dark text over the bright photographs.
- Reading-phase check: halfway through the first phone scene, the photo remains
  at 0px translation, copy is at y=197px and the next image remains at y=844px
  below the viewport. The reveal/reading timing remains the approved sequence.
- Browser console error check was empty after the complete asset set loaded.
- Preview files: `test-results/cinematic-daylight-venue-laptop.png`,
  `test-results/cinematic-daylight-design-laptop.png`,
  `test-results/cinematic-daylight-venue-mobile.png`, and
  `test-results/cinematic-daylight-design-mobile.png`.

