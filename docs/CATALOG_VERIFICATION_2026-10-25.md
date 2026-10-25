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
