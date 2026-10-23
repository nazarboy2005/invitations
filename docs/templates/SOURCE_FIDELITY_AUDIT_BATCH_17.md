# Published-template source-fidelity audit — batch 17 (final)

Date: 2026-10-23

## Database order

Read-only `getCatalog()` against configured PostgreSQL returned 51 published templates. IDs 49–51 (the final three rows by ID order) are:

| ID | Name | Price | Category | Supported event types |
| --- | --- | ---: | --- | --- |
| `toscana` | Toscana | 150,000 UZS | wedding | wedding, fotiha |
| `vals` | Vals | 150,000 UZS | wedding | wedding, fotiha |
| `yangi-uy` | Yangi Uy | 150,000 UZS | yangi-uy | yangi-uy, osh |

Categories and event compatibility were read independently from the configured catalog.

## Provider and capture search

Inspected all 13 provider `capture-manifest.json` files and recursively searched the archive for matching template files. Only Marxaba has exact complete captures:

- `Marxaba/Nikoh/templates/toscana`
- `Marxaba/Nikoh/templates/vals`
- `Marxaba/Boshqa tadbirlar/templates/yangi-uy`

The other manifests (Chorlove, Invitate, Invitio, Mytaklif, OnlineTaklifnoma, Taklifiy, Taklifla, Taklifnomachi, Wedivo, Wedvitation, Yoryor, Yumevite) have no exact template matches. The archive's E-invitation folder has no provider manifest. Original captures were not changed.

## Findings

### Toscana

The captured page has an opening `.intro`, hero, invitation, date, program, venue, gallery, dress code, To‘yona, RSVP/wishes, contacts, and finale. The packaged 900×1350 opening poster `preview.webp` is a byte-identical copy of captured `art/aisle.webp`, the opening's own full-viewport poster; it is portrait 2:3 and is distinct from the later `art/arch.webp` hero art. Captured CSS, metadata, and `aisle3d.js` are byte-identical. `template.js` has the documented local Three.js path and title-tween restoration adaptations. `i18n.js` adds the missing localized “The atelier” translation. Reference site runtime, sample override, and provider capture are not included in the isolated package.

The opening controls, animation, and source `app.reducedMotion` paths are present. Catalog gallery images are ephemeral shared-renderer mappings only when in sample preview; creator photos suppress samples. Public empty creator-photo galleries are hidden by the shared runtime. To‘yona card number/holder bind; the source bank-name slot is hidden because the contract has no bank-name field. Venue photo is also not supported; the adapter hides the empty easel unless a compatible photo or map exists. The existing Toscana README claims browser and integration verification, but this audit reran focused tests only, not fresh browser flows.

### Vals

The captured page has a zoetrope opening with spin/skip interaction, hero, invitation, date, program, venue, gallery, dress code, To‘yona, RSVP/wishes, contacts, and finale. The focused package test passes; existing README records a 720×1280 portrait `#intro` capture and a 2026-10-21 browser check across four locales and mobile/desktop. Source motion and reduced-motion code are present. The capture folder includes source CSS, JavaScript, `waltz.js`, fonts, and art; packaged source has the isolated runtime, local fonts/assets, and the separately packaged shared dependencies. Source/contract tests verify gallery and card/holder To‘yona mapping. Empty galleries receive no creator URLs; sample media is added only by the shared preview adapter and public rendering hides empty photo sections. The captured bank-name and venue-photo fields have no approved contract inputs and remain blank/hidden. This audit did not repeat the README's browser claims.

### Yangi Uy

The actual complete capture is `Marxaba/Boshqa tadbirlar/templates/yangi-uy` (manifest lists page and local house art). `apps/web/public/templates/yangi-uy/SOURCE_ADAPTATIONS.md` incorrectly identifies `Marxaba/Nikoh/templates/yangi-uy`, a nonexistent source path; the test uses the correct Boshqa tadbirlar path. `preview.provenance.json` repeats the wrong Nikoh source path. Packaged visible body structure was compared and retains the intro/open control, hero, invitation, date, kitchen/program, venue, dress code, garden/gallery, RSVP/wishes, To‘yona, contacts, and closing sections. Packaged CSS and house illustration match the actual capture byte-for-byte; `template.js` has the local Three.js path adaptation, with reduced-motion CSS/JS behavior. The isolated package excludes captured sample-invitation runtime and uses the shared typed adapter. Preview sample is the canonical localized fixture with blank gallery URLs; no gallery sample photographs are injected for Yangi Uy, and public galleries remain empty without real URLs. To‘yona card and holder are bound; unsupported bank remains empty.

Catalog art is 478×668 (aspect ratio 0.716), is a first-viewport production-preview screenshot rather than a portrait full-page capture of the complete `.intro`, and provenance records only first viewport. `meta.js` declares `preview-browser-capture.jpg`; the app-hosted HTML points OG artwork to it. The stale source `og.jpg` does not exist in the package, but was correctly excluded from app-hosted HTML. The provenance fixture hash `a88ccb99…` exactly matches the current `preview-sample.json`. The one failing test instead expects `54017a29…`, a stale fixture hash; this is a test expectation defect, not a current fixture/provenance mismatch. No template code was changed.

## Tests and limits

Command:

```text
pnpm exec tsx --test tests/toscana-template.test.ts tests/toscana-preview-contract.test.ts tests/toscana-preview-art.test.ts tests/vals-template.test.ts tests/yangi-uy-template.test.ts
```

Result: 23 tests; 22 passed, 1 failed. Toscana: 8/8, Vals: 6/6, Yangi Uy: 8/9. Failure: `Yangi Uy catalog art verifies the production canonical fixture capture`, `tests/yangi-uy-template.test.ts:124`, because expected fixture SHA `54017a29…` differs from actual and provenance SHA `a88ccb99…`.

Static inspection covered source/capture paths, body/sections, CSS/JS/adaptation files, motion and reduced-motion code, visible gallery and To‘yona hooks, preview fixture isolation, catalog images and provenance. No template source, catalog image, package, database, publication, deployment, or payment settings changed. The original provider captures remain untouched.

## Browser follow-up (2026-10-23)

Used the local production preview at `http://127.0.0.1:3002/preview` in the in-app browser. For reduced motion, added `qaReducedMotion=1` as supported by the shared preview. Normal and reduced-motion opening interactions were exercised in each frame:

| Template | Normal interaction | Reduced-motion interaction | Console |
| --- | --- | --- | --- |
| Toscana | Clicked `#open-invitation`; after the authored walk/arch sequence, `#intro` reached `is-done`. | Clicked `#open-invitation`; `#intro` reached `is-reduced-opening is-done`. | No warnings/errors observed. |
| Vals | Clicked the zoetrope `#spin`; `#intro` reached `is-touched is-dancing` and remained in the captured dance interaction. | Clicked source `#skip`; intro left its untouched state (`is-touched`), with invitation content available. | No warnings/errors observed. |
| Yangi Uy | Clicked `#open-invitation`; intro faded to opacity 0 and the invitation page/sections remained available. | Repeated with `qaReducedMotion=1`; intro faded to opacity 0 and invitation content remained available. | No console errors. Warnings: GSAP reports `.program:before` and several empty targets not found; Three.js reports deprecated `PCFSoftShadowMap` and fallback to `PCFShadowMap`. These appear to be source/runtime warnings; no source changes were made. |

The local preview route loaded successfully (HTTP 200 per the active local session). Browser-control tools exposed console logs and DOM state but no request/response-failure event stream or HTTP response-status API for subresources. Therefore no failed network request was observed in console, but subresource HTTP status failures could not be independently ruled out. This follow-up closes the normal/reduced-motion interaction gap; catalog/public image visual review and public empty-vs-uploaded gallery runtime remain unverified. Captures and template source files remain unchanged.

## Repair ownership

Checked existing audit records and task list; no repair owner was found for the Yangi Uy catalog artifact/provenance findings. A separate repair task was opened for its source-path provenance and portrait complete-opening artwork. No repair task is needed for the stale test hash alone unless the user wants that test corrected; no template files were changed during this audit.

## Repair follow-up (2026-10-23)

Yangi Uy now uses a clean renderer capture of the complete canonical `.intro`, including the courtyard, localized opening copy, names/date, and open control, with browser/app UI excluded. The image shows the current shared preview fixture and preserves the source composition at 478×668. Provenance points to the correct `Boshqa tadbirlar/templates/yangi-uy` source folder and records the fixture/artifact hashes. Visual inspection confirms the full opening; the focused Yangi Uy suite passes 8/8. The prior 22/23 batch result is historical: the stale fixture assertion has been corrected. No database or publication state changed.
