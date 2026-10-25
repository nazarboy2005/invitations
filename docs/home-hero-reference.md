# Homepage hero reference — 2026-10-25

The user approved matching their supplied 1699×926 Visol image, excluding the video control. The homepage uses real HTML copy, links and SVG icons over a photographic background. The create action opens `/studio`; the phone opens `/templates`; navigation opens the wedding, osh and other catalog categories and the existing about/features section. Shared catalog and studio branding is outside this hero-only change.

## Background asset

- Asset: `apps/web/public/images/home/invitation-scene.webp` (1699×926, 190,818 bytes).
- Generated using the built-in image generation tool, with the supplied reference as the edit target. The PNG output was encoded to WebP at quality 95 without resizing.
- Original reference: `codex-clipboard-fee73149-c738-4149-b25a-fc3f3654a944.png`.
- The phone and printed invitation are decorative sample artwork, independent of the real catalog and invitation renderers.
- Handwriting: a dedicated homepage copy of the existing local The Nautigal Regular font, loaded through `next/font/local`.

## Generation prompt

Use case: precise-object-edit. Edit target: the attached 1699 by 926 website reference. Produce a clean background asset for implementing this EXACT website with real HTML overlay text. Keep the entire photographic scene unchanged: exact camera, aspect ratio 1699:926, marble, light/shadow, large tilted black phone at x840-1280 y145-815, white flowers at upper right, gold object at top, printed Ali & Malika invitation at x1160-1550 y235-735, and beige silk at lower right. Preserve all existing text and artwork INSIDE the phone screen and ON the printed paper invitation exactly, including Ali & Malika, date, and the black phone-screen button. REMOVE ONLY website interface overlays outside of those physical objects: top-left visol logo and star; all top navigation labels and login outline/button; left eyebrow, large headline, paragraph, burgundy create button, video play button and text; four benefit icons/labels/dividers at lower left; thin gold corner decoration lower left; white handwritten slogan and underline on lower-right silk. Fill removed regions seamlessly with the SAME original ivory marble and silk surfaces. The left half must be clean empty ivory marble, retaining original soft illumination. Do not reposition, resize, redraw or redesign the physical objects. Do not add anything. This must look identical to the reference photographic background with only the website UI text and controls removed. Landscape 1699:926.

## Fidelity

The visual comparison is against the supplied image, not an original editable design file. The photographic asset is an edited derivative; fonts, SVG icon paths, and text rendering can differ slightly from the screenshot. Do not describe this as pixel-identical. Mobile rearranges the composition to keep the copy, benefits, and phone readable.

## Mobile reference follow-up

The user supplied a separate portrait reference (`codex-clipboard-ea016b27-68d5-4253-a46e-177a12e4b715.png`) and requested the mobile layout follow its composition. At widths up to 900px, a native picture source selects `apps/web/public/images/home/invitation-scene-mobile.webp` (1108×1420, 183,706 bytes). This image was edited with the built-in image generation tool and encoded to WebP at quality 94. Text, menu, create button, caption, curved benefits panel and scroll cue remain live HTML/SVG. Phone-size text has minimum readable sizes, so the layout is taller than a uniformly scaled screenshot. The desktop scene is unchanged.

The transparent homepage header follows downward scroll movement immediately and returns after 8px of upward scrolling. Keyboard focus and an open mobile menu keep navigation visible. Scroll does not add a background, backdrop blur or shadow. Other shared header variants retain their existing behavior.

### Mobile generation prompt

Use case: precise-object-edit. Asset: clean portrait photographic background for implementing the attached mobile website reference with real HTML text. Edit the attached image, preserving its exact photographic composition and physical objects: same cream marble, sunlight, shadows, soft foliage upper right, white peony bouquet at lower left, black phone centered toward the left below the text, Ali & Malika printed invitation behind it on the right, champagne silk at lower right, scattered petals. Preserve all artwork and lettering INSIDE the phone and ON the printed invitation, including Ali & Malika and the phone's black invitation button. Remove ONLY the website UI overlays: logo and gold star at top left; hamburger menu at top right; eyebrow and gold lines; large Eng muhim / lahzalar uchun headline; description paragraph; burgundy create button and arrow; gold handwritten Tabriklar endi onlayn caption, underline and tiny heart. Fill removed areas seamlessly with the same softly lit ivory marble background; preserve subtle existing surface texture and shadows. CROP OFF the bottom benefits UI and its cream wave panel entirely: output only the reference from y=0 to approximately y=1312, just before the curved benefits panel starts. Final size 1024 by 1312 pixels, keep object positions and scale relative to the source crop, do not shrink or reposition the phone. No website text, no navigation, no icons outside physical stationery. Keep exact phone, bouquet, paper and silk edges and composition; do not redesign the scene.

## Verification

- Final production build and its TypeScript check pass.
- Existing catalog module tests pass: 12/12.
- Browser checked at 1699×926 content size, 1024×768 viewport, and 390×1200 viewport. The tablet hero width equals the available document width (1009px); mobile hero width equals the available document width (375px).
- The create action opens the existing studio. Wedding, ceremonies and celebrations links select `wedding`, `osh` and `other` respectively.
- Screenshots: `test-results/home-hero-desktop.jpg` and `test-results/home-hero-mobile.jpg` (local QA files, ignored by Git).
- The existing database-backed dev server intermittently reports `getCatalog: read ECONNRESET`. Final production browser checks used a separate localhost server with the app's existing local catalog fallback; database settings and catalog publication state were not changed.

### Mobile/header follow-up verification

- Final production build and TypeScript checks pass after the mobile/header changes.
- Browser reviewed at 320px, 390px and 768px viewport widths, plus desktop. At 320px and 390px, document scroll width equals client width (305px and 375px respectively), with the portrait source selected and all benefits on two lines.
- The mobile menu opens, closes with Escape and outside taps, and its ceremonies link opens the selected `osh` catalog category.
- On the first 40px downward scroll, the header moves to `top: -40px`. Further downward scroll hides it fully. An upward scroll returns it to `top: 0` on phone and desktop. Computed background remains transparent and backdrop filter remains `none` in both directions.
- Saved screenshots: `test-results/home-hero-mobile-portrait.jpg`, `test-results/home-hero-mobile-narrow.jpg`, and `test-results/home-hero-desktop-mobile-update.jpg`.
