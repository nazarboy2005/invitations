# Published-template source-fidelity audit — batch 13

Date: 2026-10-23

## Database order and catalog

Queried the configured PostgreSQL catalog through the application's database connection and catalog implementation. It returns 51 published rows in ascending template ID order. The three requested entries are positions 37–39:

| ID | Name | Price | Category | Supported event types |
| --- | --- | ---: | --- | --- |
| `qandil` | Qandil | 150,000 UZS | wedding | wedding, fotiha, qiz-uzatish |
| `qatlam` | Qatlam | 150,000 UZS | wedding | wedding, qiz-bazmi, fotiha |
| `qiz-bazmi` | Qiz Bazmi | 150,000 UZS | qiz-bazmi | birthday, fotiha, qiz-uzatish |

The next three IDs after this batch are `qogoz-turna`, `retro-kino`, and `sahifa`.

## Provider and source comparison

Searched all 13 `capture-manifest.json` files in the local reference archive and searched the full archive for all three IDs. Marxaba is the only provider with complete template-level sources for these designs: `Marxaba/Nikoh/templates/qandil`, `Marxaba/Nikoh/templates/qatlam`, and `Marxaba/Qiz uzatish/templates/qiz-bazmi`. The Invitate `qandil.png` occurrence is an unrelated fairy asset. Original capture folders were not modified.

- **Qandil:** focused checks compare captured page, CSS, scripts, fonts, and illustration assets; the checks pass. The actual 300×600 cover shows the lantern, greeting, and pull-to-open initial state. Its artwork and provenance hash check pass. The original includes a locale control in the top corner. The source has interactive lantern pulling, light/city reveal, animation and scroll sections; RSVP and gallery controls are wired by the shared bridge. Source CSS/JS honor reduced motion, and shared runtime checks the browser preference and supports `qaReducedMotion` for preview.
- **Qatlam:** focused checks compare the captured body, CSS, JavaScript, localization, metadata, and art; all pass. The 720×1280 cover depicts the closed pop-up book opening, with Javohir and Madina from the shared fixture, at portrait aspect ratio. The captured locale selector is visible at the top. The page contains the pop-up book opening interaction, program, venue, gallery, RSVP and To‘yona markup; shared contract/runtime binds supported data and interactions. Captured CSS/JS and shared runtime include reduced-motion behavior.
- **Qiz Bazmi:** focused checks confirm captured body, scripts, styles, metadata and source artwork, as well as local font dependencies, four-locale fixture mapping, and blank-draft isolation. The 450×800 cover depicts the hand-henna opening and open button, with the captured locale selector in the upper-right. Its source has animated petals, opening control, invitation/date/program/venue/gallery/RSVP/wishes/To‘yona sections; adapter and shared bridge bind platform fields and services. Source and shared runtime reduced-motion handling are present.

None of these sources has captured gallery photographs suitable for preview substitution. Their empty galleries remain empty in catalog fixtures rather than borrowing unrelated media. Creator-uploaded gallery URLs flow through the renderer, and the shared runtime hides a public gallery with no usable image URLs. Template-owned opening/decorative artwork remains visible. The shared catalog fixture is only used in catalog and initial selection previews; tests confirm blank drafts do not inherit its names, repeatable content, wishes, or payment/contact details.

## Focused checks and limits

Command:

```text
pnpm exec tsx --test tests/qandil-template.test.ts tests/qandil-preview-contract.test.ts tests/qatlam-template.test.ts tests/qiz-bazmi-template.test.ts tests/marxaba-gallery-preview.test.ts
```

Result: 31 passed, 1 failed. The Qiz Bazmi test `keeps empty preview memories icon-only and collapses unsupported empty gift note` expects an obsolete `hideIf('gallery', ... !data.preview)` implementation. The current shared runtime hides galleries without usable image URLs; other Qiz Bazmi field, artwork, fixture, and release assertions pass. A broader run including `marxaba-queued-integration.test.ts` also reports one unrelated stale expectation for Bulbul's catalog cover path after its recent cover repair.

The three actual package covers were viewed and their opening scenes and dimensions checked. Focused source tests verify package parity.

### Browser and reduced-motion follow-up

Used the existing local preview at `http://127.0.0.1:3002/preview?template=<id>&qaSilent=1` in headless Chrome at 430×900. Ran each template with normal motion and with both `prefers-reduced-motion: reduce` emulation and the preview-only `qaReducedMotion=1` flag. All six preview routes and template frames returned HTTP 200; each opening control reached the opened state (6/6). The reduced runs reported both the browser media preference and the shared runtime's reduced-motion flag as enabled. Qandil's intro was hidden and its city/light hero revealed; Qatlam unlocked the page and marked the hero alive; Qiz Bazmi completed its intro and entered `is-open`.

No failed template-asset HTTP responses were observed. The app shell requested `/favicon.ico`, which returned 404 and produced a console resource error; this is app-level chrome, not a template resource. A request for `/templates/shared/editor-sections.js` was aborted (`ERR_ABORTED`) during frame navigation, not returned as a missing asset. No page JavaScript errors were observed. The initial console/error pass did not associate the generic 404 with its URL; a follow-up identified the favicon request. Template source was not changed. Database, publication, deployment, and payment state were unchanged; no confirmed mismatch required a repair chat.
