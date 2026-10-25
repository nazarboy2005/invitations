# Glass Pink source adaptations

The package uses the exact Glass Pink server-rendered template subtree and the two captured Chorlove utility style sheets already bundled under `chorlove/shared`. The Next.js page runtime, snapshot soundtrack, unrelated captured Orchid gallery photos, external venue photo, sample guest wishes, fixed Chorlove contacts, and third-party website runtime are excluded. Original invitation artwork is copied under `assets/`, including the floral background retargeted to its packaged URL; the reference capture remains unchanged.

`bridge.js` binds live invitation fields and supported controls to the shared four-locale contract. Catalog music is supplied by the platform preview; public invitations use only creator-selected music.

`source/provenance.json` records the unchanged source snapshot hash and capture provenance. The preserved Chorlove markup contains one opening title and one open-button label, and both adapters replace text with `textContent`; they do not append duplicate lettering. Source CSS expected fonts at site-root `/fonts/...` paths, which were absent in the isolated app package. The original seven font files are now packaged under `assets/` and remapped by `adapter.css`.

The catalog cover is a full 432×768 portrait capture of the original source opening, including the source music control. Its SHA-256 and capture details are recorded in `source/provenance.json`; the former packaged-renderer image remains as QA evidence only.

The source capture is server-rendered HTML, and the Chorlove archive also contains the compiled page module `0wvjbn--75n3p.js`. That module provides the exact opening behavior used here: twelve ambient petals with their source positions, colors, sizes, delays, and durations; heart pulse; 0.8-second card exit; 0.6-second delayed overlay fade; the 1-second leaf reveals; 0.9-second glass-card entrance; staggered names; flower entrance; and the 0–600px parallax ranges (-180/-140/-40px). The adapter now implements those timings and keeps the package reduced-motion aware.

## Guestbook, RSVP, and optional-section parity

The captured wish list is a 460px scroll area with the original rounded translucent cards, source name/date header, Cormorant name/message typography, and 400ms reveal with 50ms card staggering at a 0.2 viewport threshold. The adapter uses platform-approved wishes and renders the API's `submittedAt` value in the source date slot; catalog sample wishes remain ephemeral. The source 🪄 control is preserved and fills the textarea from the source's generic wish suggestions without submitting automatically.

The original RSVP contains only the guest name and yes/no controls. The platform adapter has no guest-count prompt and sends the API's fixed `partySize` value of 1 for yes and 0 for no. The source gift section is an interactive gift-box card with four pulsing sparkles and seven animated ornaments; the adapter shows it only when To'yona is enabled, preserves the captured decoration loops, and cancels them for reduced motion. Clicking the gift box opens the source-matched body-portal modal (z-index 2000, black/75 blurred backdrop, translucent rounded card, 250ms card entrance/exit, source gift-box image, bank-card label/number/holder, clipboard action, backdrop/close/Escape dismissal). It displays the source fallback message when no card number is configured. The captured Glass Pink page has no dress-code section, and the packaged page adds none.

The archived route module's gift modal uses a 300ms default opacity fade for the backdrop and an explicit 250ms scale/vertical entrance for its card. Its entrance is immediate under reduced motion. Copy removes spaces from the card number and the confirmation returns to the source label after 2500ms. Modal behavior is recorded in `source/provenance.json` and covered by the Glass Pink focused suite.

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
styles and subtitle binding. This browser check covers the schedule reveal and
re-entry; it does not claim fresh browser verification of every other section
reveal.
