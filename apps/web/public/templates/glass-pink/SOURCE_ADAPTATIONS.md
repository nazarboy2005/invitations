# Glass Pink source adaptations

The package uses the exact Glass Pink server-rendered template subtree and the two captured Chorlove utility style sheets already bundled under `chorlove/shared`. The Next.js page runtime, snapshot soundtrack, unrelated captured Orchid gallery photos, external venue photo, sample guest wishes, fixed Chorlove contacts, and third-party website runtime are excluded. Original invitation artwork is copied under `assets/`, including the floral background retargeted to its packaged URL; the reference capture remains unchanged.

`bridge.js` binds live invitation fields and supported controls to the shared four-locale contract. Catalog music is supplied by the platform preview; public invitations use only creator-selected music.

`source/provenance.json` records the unchanged source snapshot hash and capture provenance. The preserved Chorlove markup contains one opening title and one open-button label, and both adapters replace text with `textContent`; they do not append duplicate lettering. Source CSS expected fonts at site-root `/fonts/...` paths, which were absent in the isolated app package. The original seven font files are now packaged under `assets/` and remapped by `adapter.css`.

The catalog cover is a full 432×768 portrait capture of the original source opening, including the source music control. Its SHA-256 and capture details are recorded in `source/provenance.json`; the former packaged-renderer image remains as QA evidence only.

The source capture is server-rendered HTML, and the Chorlove archive also contains the compiled page module `0wvjbn--75n3p.js`. That module provides the exact opening behavior used here: twelve ambient petals with their source positions, colors, sizes, delays, and durations; heart pulse; 0.8-second card exit; 0.6-second delayed overlay fade; the 1-second leaf reveals; 0.9-second glass-card entrance; staggered names; flower entrance; and the 0–600px parallax ranges (-180/-140/-40px). The adapter now implements those timings and keeps the package reduced-motion aware.

## Guestbook, RSVP, and optional-section parity

The captured wish list is a 460px scroll area with the original rounded translucent cards, source name/date header, Cormorant name/message typography, and 400ms reveal with 50ms card staggering at a 0.2 viewport threshold. The adapter uses platform-approved wishes and renders the API's `submittedAt` value in the source date slot; catalog sample wishes remain ephemeral. The source 🪄 control is preserved and fills the textarea from the source's generic wish suggestions without submitting automatically.

The original RSVP contains only the guest name and yes/no controls. The platform adapter has no guest-count prompt and sends the API's fixed `partySize` value of 1 for yes and 0 for no. The source gift section is an interactive gift-box card with four pulsing sparkles and seven animated ornaments; the adapter shows it only when To'yona is enabled, preserves the captured decoration loops, and cancels them for reduced motion. Clicking the gift box opens the source-matched body-portal modal (z-index 2000, black/75 blurred backdrop, translucent rounded card, 250ms card entrance/exit with Framer's default ease-out, source gift-box image, bank-card label/number/holder, clipboard action, backdrop/close/Escape dismissal). It displays the source fallback message when no card number is configured. The captured Glass Pink page has no dress-code section, and the packaged page adds none.

The archived route module's gift modal uses a 300ms default ease-out opacity fade for the backdrop and an explicit 250ms ease-out scale/vertical entrance for its card. Its entrance is immediate under reduced motion. Copy removes spaces from the card number and the confirmation returns to the source label after 2500ms. A final source-chunk comparison caught and fixed the package's prior CSS `ease` mismatch on both modal layers. The same source comparison aligned the modal artwork's `drop-shadow-md`, responsive card-number size (18px mobile/20px desktop), source 28px heading line height, relaxed fallback-message line height, `shadow-sm` surfaces, and Tailwind's 150ms transition curve on its close/copy controls. The package keeps Escape-key dismissal and initial close-button focus as keyboard-accessibility additions; the captured modal closes through its close button or backdrop. Modal behavior is covered by the Glass Pink focused suite.

Fresh matched browser pass (2026-10-25, 1280×720): source and package both run the original opener exit and leave the invitation visible; their gift modal cards both measure 448×402px and both close from the close control. The schedule heading, subtitle, icon rail, and first row share the same relative placement and reveal states; scrolling away restores the title to opacity 0, row time/title offsets to ±20px, marker scale to 0, and icons to opacity 0/scale .8, then re-entry restores the visible state. This pass also caught a copied-text encoding error in the four gift-box sparkle glyphs: the package showed `âœ¦` where the source shows `✦`; the package now uses the original glyph.

The preview-only reduced-motion check (`qaReducedMotion=1`) confirms the opener closes immediately, schedule icons start in their final visible state, and the gift modal opens and closes without transitions. The source archive was not run under an emulated OS reduced-motion preference in this pass.

The source timeline has a three-icon column (`coming.webp`, `cake.webp`, and `water.webp`) at the left of its event rows. These files were absent from both the capture's image folder and the package, so the exact original host files are now included in `assets/`; their captured references, byte lengths, and SHA-256 hashes are recorded in `source/provenance.json`. Their source reveal starts at opacity 0/scale .8, enters to opacity .9/scale 1 at a .3 viewport threshold, lasts 600ms, and staggers by 150ms.

The package's timeline icons now retain that source opacity/scale start state, which was missing in the previous static markup. Browser comparison at 1280×720 confirms the source and package icons settle at opacity .9/scale 1, reset to opacity 0/scale .8 after leaving the viewport, and reveal again when re-entering. The source subtitle slot is also correctly bound to `programHeading`; previously that value overwrote the title while leaving the subtitle blank. Reduced-motion preview opens without the source opener choreography and displays the schedule icons immediately in their final state. The focused Glass Pink test asserts the source icon start style and subtitle binding.

Local source-art audit (2026-10-23): Chorlove's capture manifest maps the Glass Pink preview-frame HTML and 15 Glass Pink image files, all original floral/decorative components. All 22 packaged artwork/font files compared against the archive have exact byte matches. The archived compiled page module supplies the original opener and animation behavior; the source snapshot supplies the first-page artwork. The preserved page's JSON-LD references `https://payment.chorlove.uz/media-assets/dfe335c1-c1d0-4b69-9ed8-998d277ac34f/file`, but that media URL has no local manifest entry or captured file. The local `01/02/03-chorlove-preview-frame.png` artifacts are full-page screenshots with different compositions; the catalog uses the portrait source opening capture rather than those full-page images.

Provider-wide follow-up: all available provider capture manifests, capture titles/slugs, and text references were searched for Glass Pink; the only matching page is Chorlove's `templates/glass-pink/preview-frame.html`. A SHA-256 scan of the full non-production archive confirms every packaged image/font has a byte-identical Chorlove source. Three ornaments are intentionally reused in other Chorlove templates; no Glass Pink page or artwork was found under a different provider.

The Chorlove manifest maps all six captured Glass Pink gallery slots to Orchid Amplop photos; these cross-template sample images remain excluded. The shared preview fixture's six gallery entries are empty and preview-only. The contract adapter passes through creator-uploaded photo URLs, and the public renderer hides the gallery when no creator photos or story chapters exist. No own-source Glass Pink gallery photographs were found; the package's original floral and decorative assets remain visible in the template opening.

## Source-motion repair (2026-10-23)

The archived component in `Web invitations/_next/static/chunks/0wvjbn--75n3p.js` confirms the opener choreography: twelve ambient petals; a two-second heart pulse; a three-second button sheen; a 450 ms pause followed by a 600 ms overlay fade; an 800 ms envelope exit using `cubic-bezier(.22,1,.36,1)`; 800 ms flower exits; a 850 ms petal burst; and removal of the opener at 1.05 seconds. The shared `[data-chorlove-open]` handler previously hid the opener immediately, skipping that sequence. It now leaves Glass Pink clicks to the source-specific handler, which runs the source timings and keeps the button disabled during the close. Reduced motion skips the animation and opens the invitation immediately.

The hero reveal also previously passed the Framer Motion label `easeOut` directly to the browser animation API. That API rejected the value and stopped the remaining hero animations. The bridge now uses the equivalent browser easing `ease-out`; the other source-defined transforms, durations, delays, petals and scroll parallax remain in place. The close now animates the third bottom-flower decoration along with the two corner flowers.

Fresh local-browser checks after the repair show the normal opener fading and moving its card/flowers before becoming hidden, twelve source petals in normal motion, and an immediate reduced-motion opening with zero petals. The preview fonts report loaded, the visible opening artwork loads, and the fresh normal/reduced sessions report no console errors or warnings. Focused Glass Pink tests pass 9/9, `node --check` passes, and the raw source snapshot remains byte-identical to the archive.

## Gallery and To’yona motion repair (2026-10-23)

The archived route module renders the photo gallery as a perspective carousel. The adapter now uses the captured wraparound offsets, 55% horizontal spacing capped at 120%, -140px depth steps, 35-degree Y rotations, 0.15 scale steps (minimum 0.65), source opacity levels (1, 0.75, 0.45, then hidden), and depth-based z-order. Previous/next controls, page dots, active-card selection, the fullscreen counter/arrows, and the source 200ms image entrance/exit are wired to creator-uploaded photos. Cards are generated for every supplied photo; empty gallery entries do not reveal the section. The second script no longer installs a competing single-image carousel handler.

The source To’yona card floats seven decorative image assets with their original vertical and rotation keyframes, durations, delays, and ease-in-out loops. Those loops now run only while the feature is enabled and are cancelled for reduced-motion users. The gift box’s captured hover scale remains in its original markup and CSS. No Orchid Amplop gallery sample photos are included.

## Source section reveal repair (2026-10-23)

The first source-fidelity pass had applied one 760 ms vertical reveal at a
0.08 viewport threshold to every initially transparent node. That erased the
compiled route module's per-component transforms, delays, durations, and
viewport amounts, and it did not return `whileInView` content to its initial
state when it left the viewport. The adapter now maps those reveals to the
captured route module's original choreography and repeats the transitions on
leave/re-entry: the introduction's ten staggered blocks; gallery heading;
countdown and calendar cards; venue content; schedule headings, three icons,
and each time/marker/title row; gift heading/card; wish cards; and contact
cards. In particular, the program rows retain horizontal motion for times and
titles, the marker scales from zero, and each row uses its source `0.08 * row`
delay and `0.5` visibility threshold. Reduced motion clears the hidden start
states and leaves each node at its final visible state. Contact cards now use
the captured source card container and card styling, and wish cards use the
source's rounded, translucent card styling. Local browser comparison at
1280×720 confirms the schedule icons and heading hide when scrolled away and
reveal again on re-entry, with their source-defined start and final states.
The reduced-motion preview shows those icons immediately in their final state.
The packaged gift portal also matches its 448×402px source modal, card content,
close button, Escape dismissal, and immediate open/close under reduced motion.
The focused suite asserts the source route module, asset hashes, icon start
styles and subtitle binding. A later full-page browser pass covers visible
section-heading reveal and re-entry for introduction, countdown, venue,
schedule, guestbook, RSVP, To’yona, and contacts; it does not claim every child
and card animation was sampled individually.

## Full-page reveal and guestbook correction (2026-10-25)

At 1280×720, the source and packaged preview were opened side by side. The
introduction, countdown, venue, schedule, guestbook, RSVP, To’yona, and contacts
headings were each brought into view, scrolled away, and brought back; the
headings settled visible in both after re-entry. Source/package section top
positions aligned within 1px on sampled passes. The gallery section remained
hidden in the package because the preview fixture has no creator-uploaded Glass
Pink photos or story chapters, matching the conditional empty-section behavior.

That pass found the packaged guestbook section was empty at render time except
for platform-provided wish cards. It lacked the source title, introduction, and
form. The package now uses the captured source section's title/form classes and
input/button arrangement, localizes its title and prompt, and keeps an empty
source-styled list container for creator/API wishes instead of copied sample
wishes. Browser inspection confirms the form, source magic-suggestion control,
localized heading/prompt, and three ephemeral preview-fixture cards render. The
source capture contains more example wishes, which remain excluded from product
data. At the same browser size, the source guestbook section is 939px tall and
the package is 829px with its shorter preview wish list; the outer layout and
content-dependent height differ for that reason.

Catalog verification in the local catalog detail confirms both the card and
detail preview load `/templates/glass-pink/catalog-cover-opening.png` at its
original 432×768 dimensions. This is the authentic source opening capture
recorded in provenance.

## Venue source media and map action (2026-10-25)

The browser audit found the source venue card's 1400×1000 Unsplash hero image
was omitted from the isolated package: its `<img src>` was empty and the browser
resolved it to `index.html`. The captured source points to
`photo-1712314947761-a8d718bd8c32` with its original 1400×1000 crop parameters.
The matching WebP response is now packaged at
`assets/venue-photo.webp`; its SHA-256 and source URL/response format are in
`source/provenance.json`. The static template uses that local source image.

The captured map CTA was also absent from the source-matched venue card. The
package now includes the captured button's location, icon, classes, font and
hover styles in the card's original `mt-6` slot. The existing adapter reveals it
and binds the locale label when the invitation has a user-supplied map URL or
coordinates; with neither, it stays hidden rather than linking to an invented
location. The local-only browser fixture verifies that an explicit venue URL
is preserved and coordinates produce
`https://maps.google.com/?q=41.311081,69.240562`; neither link was followed.
Both configured cases show the localized source-slot button, and the preview
fixture without map data keeps the CTA hidden.

## Final wish-card and modal motion check (2026-10-26)

The exact archived route chunk sets each guest wish card to enter from opacity
0 and y=15px, with a 400ms duration, 50ms per-card delay, and a 0.2 viewport
threshold. `bridge.js` uses those same values and the matching ease-out curve.
The archived gift overlay defaults to a 300ms ease-out fade; its card uses a
250ms ease-out entrance/exit from opacity 0, scale .92, and y=20px. The package
now matches both curves and timings. Focused tests assert the source chunk
settings and package rules.
