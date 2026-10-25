# Test repairs and catalog playback — 2026-10-25

## Implemented

- Catalog cards play their actual invitation renderer when hovered or focused.
- Touch devices automatically select one opening that is at least 60% visible
  and nearest the viewport center. Adjacent cards do not all run together.
- Switching cards unmounts the previous preview. Leaving the viewport, hiding
  the browser tab, or enabling reduced motion/data saving stops playback.
- Previews are silent, use presentation-only sample data, and retain the
  original full-preview and creation links. The cover remains visible until
  the renderer is ready. The subsequent category-transition implementation is
  described below; the later approved card/dialog redesign is included.
- Fixed the Chorlove Palov/Orchid frame paths. Aligned the typed Invitate
  Nahorgi Osh fallback with its existing publication migration. Restored the
  missing private Fairy registration with additive migration `0137`; this does
  not publish the design.

## Test repairs

- Source comparisons normalize only text CRLF to LF; binary files retain exact
  bytes. Separate regression tests verify both behaviors.
- Historical screenshot checks use the original preview fixture recovered
  from Git commit `7d7d1e3`, with its recorded SHA-256. Live data-contract tests
  continue using the current fixture. Captures and artifact hashes were not
  replaced to mask failures.
- Updated contact-schema expectations, the newer Bulbul cover/dimensions,
  source-path assertions, renderer-family music coverage, and stale source
  runtime assertions. Corrected Modern Floral's packaged font stylesheet
  fingerprint to match its current source-identical canonical text; the
  original capture fingerprint remains verified.
- Verified the two updated Taklifnomachi source fingerprints against the
  corresponding preserved provider captures, including direct parity checks.

## Verification

- `pnpm test`: **633/633 passed**, none skipped (628 existing tests plus five
  focused regression tests).
- TypeScript and optimized production build pass.
- Full PostgreSQL/localhost publishing verification: **21/21 passed**, none
  skipped, including all published templates' four-language field preservation
  and public-render checks. Fixture teardown completed.
- Browser checks at widths **320, 390, 820, 1024, and 1280px** found no page-level
  horizontal overflow. Anor → Atlas switching left exactly one card iframe;
  the final phone-width check showed one Beshik preview. Browser console had
  no warnings/errors. The original viewport override was restored afterward.
- Phone-width screenshot: `.data/catalog-preview-phone.jpg` (local QA artifact).

## Latest card/dialog and scrolling revision

The user approved taller cards and the previously deferred spacing changes.
Cards now use full-width 3:5 windows, matching poster/live bounds, gradient
captions, and a category badge only in All. The card opens a native modal
dialog with price and preview/create links. Phone layouts use a partial-height
bottom sheet containing a phone mockup and the same real silent renderer.

The user's slowdown/jumping report supersedes the earlier touch-inertia
experiment. Touch devices now keep native momentum; desktop wheel smoothing
uses lerp 0.16 and multiplier 1. Live card playback stops during scrolling and
waits 200ms for settling. The dialog pauses background playback. Covers load
lazily, per-card route links/prefetch are removed, and full preview renderer
families are dynamically imported. The category fade/6px entrance remains;
the large grid-height animation was removed to reduce layout work.

Catalog embeds hide source scrollbar chrome after frame readiness. Full
preview scrolling remains available. Reduced motion and Save-Data keep poster
art instead of automatic live playback, including in the detail dialog.
Physical phone swipe feel and quantitative device-performance profiling are
not claimed from browser viewport checks.

Latest verification: 633/633 unit tests and the optimized production build
pass after the renderer-registry split. Source registration assertions now
read the extracted lightweight registries; IDs and renderer exports are
unchanged. Browser checks at 320×568, 390×844, 820×1180, and desktop widths
confirm no horizontal overflow, category badge visibility, at most one outer
preview iframe while the dialog is open, correct template-specific action
URLs, full-preview navigation, Escape dismissal, focus return, and release
of the background scroll lock. During-open and after-close scroll positions
match; browser automation may scroll a card into view before clicking it.

QA screenshots: `.data/template-cards-phone.jpg` and
`.data/template-detail-phone.jpg` (local, ignored artifacts).

Popup follow-up: entry slides up in 380ms; X, backdrop, and Escape request a
420ms downward exit before unmounting. Reduced motion closes immediately.
Browser checks confirmed the dialog stays mounted/scroll-locked during exit,
then restores focus and scroll state. Phone frame height now follows the
measured inner screen (390px layout width, at least 844px logical height):
390px viewport measured 275.079px live frame over 274.953px inner screen;
desktop measured 484.069px over 484px, eliminating the exposed poster strip.
Typecheck and all 633 unit tests pass. Updated phone screenshot:
`.data/template-phone-fill-fixed.jpg`.

Opening-glitch follow-up: native dialog autofocus had scrolled its animated
contents to 205.5px during entry. The dialog now receives native autofocus
before showModal, resets its internal scroll before paint, and transfers
focus without scrolling only after entry. Entrance overflow is clipped and
page scrollbar width is compensated during locking. Live renderer mounting
waits for the entrance to finish. Repeated mobile browser opening measured
scrollTop=0, dialog focus and zero renderers during entry, then scrollTop=0,
close-button focus and one renderer afterward. Closing retains its 420ms
animation. Typecheck and 633/633 tests pass. QA artifact:
`.data/template-popup-opening-fixed.jpg`.

Homepage discovery revision: home now renders eight curated published designs
(Anor, Atlas, Bulbul, Toscana, Konfetti, Lola, Nahorgi Osh, Yangi Uy in the
current catalog). Hidden/unavailable picks are replaced by other published
entries, capped at eight with no duplicates. Full published catalog lives at
`/templates`; `/preview` without a valid template redirects there. Individual
preview routes stay intact. Full-preview return links and site navigation use
the new catalog. The homepage removes search/category controls and links to
the full dynamically counted collection.

The new Why us section explains design/photos/music, Google Maps, guest
attendance, moderated wishes, optional to‘yona card details/receipts, and four
custom language variants. Its phone/map/reply/wish scene is explicitly sample
content and loads a static existing cover rather than another live renderer.
Page order is hero, featured designs, Why us, creation steps, FAQ, final CTA.

Verification: 636/636 unit tests pass (including three featured-selection
checks), TypeScript and optimized production build pass. Browser checks at
320, 390, 820 and 1280px found no horizontal overflow. Home shows exactly eight
cards and six benefits; full catalog shows all 53 published entries. Category
filtering returns four birthday designs; unmatched search shows the empty
state; clearing restores results. Full-catalog popup preserves one iframe,
price, and template-specific preview/create URLs. Full-catalog navigation and
return-to-home links were followed. Original template assets are unchanged.
Desktop QA screenshot: `.data/homepage-why-us-desktop.jpg`.

Visual refinement: the homepage collection CTA is now a centered, intrinsic-width
“Barcha shablonlar” button without the promotional sentence/banner. Why us has
centered “Nega aynan biz?” and supporting copy directly below. Six bordered
cards use layout, pinned-map, attendance-calendar, heart-message, giving-hand,
and language icons. Fine-pointer hover adds a small lift, warmer border/shadow,
top accent and filled icon tile. Touch does not inherit the hover movement;
reduced motion disables transitions/transforms. Language heading shortened to
“To‘rt tilda” after a 320px fit check. Checks at 320/390/1280px found no page
horizontal overflow or clipped feature headings; CTA aligns to the content
center. Typecheck and production build pass. Screenshot:
`.data/homepage-why-us-refined.jpg`.

Complete Why us redesign (supersedes the visual refinement above): replaced
the phone scene and uniform icon cards with a deep olive editorial section,
ivory/sage asymmetric panels, an arched invitation composition, illustrated
map route, guest reply, handwritten wish, sealed envelope, and language strip.
Six feature explanations remain; all sample art is decorative and marked as
sample content. No additional client component, iframe, or live renderer.
Fine-pointer hover lifts the panels and animates their individual illustrations;
reduced motion removes those movements and transitions. Phone panels stack.

Reviewed at 320/390/820/1024/1400px: no horizontal page overflow or clipped
feature text. Fixed a 320px art/headline overlap by giving the phone invitation
art its own layout space; checked the final 320px and 390px art/text separation.
Verified the desktop map hover activates its route animation and 4px panel
lift. Typecheck and production build pass; browser reports no console errors.
Final screenshot: `.data/homepage-why-us-redesigned.jpg`.

Palette correction: user rejected the green theme. Why us now uses the existing
site cream background, brown text, gold accents, and ivory/beige panels. Removed
green from the map SVG, stationery, avatars, confirmation, language strip and
hover colors. Reused platform color variables. Browser review at 1400px and
390px confirms the cream background, readable text, no horizontal overflow or
clipped feature text. Screenshot: `.data/homepage-why-us-site-palette.jpg`.

Language-panel follow-up: replaced the old badge row with “Bir quvonch.
To‘rt tilda.” and four invitation phrase samples, including language/script
labels and authored-content copy. Removed the section eyebrow and both edge
dividers; the lower divider belonged to the following process section.
Verified all three computed border widths are zero. Checked 320/390/820px
and desktop layouts; shortened the Russian sample to avoid a 320px word
overflow. Final text has no clipping or page overflow. Typecheck passes.
Screenshot: `.data/homepage-why-us-language-refined.jpg`.

Latest refinement: removed the temporary language panel. Reduced featured
catalog bottom spacing from 84px to 24px on desktop and 50px to 22px on
phones; reduced Why us top spacing to 44px on desktop/tablet and 38px on
phones. Removed now-unused language-specific markup and styles.
