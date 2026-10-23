# Published-template source-fidelity audit — batch 12

Date: 2026-10-23

## Database order and catalog

Read-only query of the configured PostgreSQL catalog returned 51 published rows. The three rows immediately after `orik-guli` in ID order are Oynavand, Parda, and Paxta. Each is published at 15,000,000 minor units (150,000 UZS): Oynavand is wedding category / wedding event; Parda is wedding category / fotiha, qiz-uzatish, and wedding events; Paxta is wedding category / fotiha and wedding events. Category assignments and supported event types were queried separately.

## Source search and fidelity

Searched all 13 provider `capture-manifest.json` files in the complete capture tree. Only `Marxaba/capture-manifest.json` declares these IDs; all three complete captures are present under `Marxaba/Nikoh/templates/{oynavand,parda,paxta}`. Original captures were left untouched.

- **Oynavand:** focused assertions verify captured opening, poster artwork, styles, 3D mirror interaction, motion, local fonts/assets, and four-locale fixture mapping. Its portrait catalog image shows the source's actual opening with Javohir/Madina and has no app chrome; its source language control is part of the captured design. Empty gallery entries stay icon-only. The To‘yona note/bank slots are hidden when unsupported/empty. Source and application reduced-motion paths are present.
- **Parda:** focused assertions verify captured body (apart from the documented platform dress-code section), captured CSS/scripts/art, local fonts/runtime, localization, wishes, and unsupported To‘yona slots. Its 478×668 cover depicts the closed curtain opening and contains only the source's language control. Confirmed defect: `preview.provenance.json` records fixture hash `a88ccb99419b87f60e86f7470366f8badaa912db74ab67ad1f757aeeaf6d29c2`, while the current canonical fixture hashes to `54017a292d4a5235593d93a5e2f8bca1fe3bab89433182fac912c5d948878871`. The provenance assertion in `tests/parda-template.test.ts` fails; it remains uncertain whether the existing image needs recapture or only corrected provenance.
- **Paxta:** focused assertions verify captured body, styles, metadata, motion and source art (with the documented delayed gallery-parallax binding), four-locale copy, fixture mapping, blank-draft isolation, and unsupported venue/gift slots. Its 720×1280 cover depicts the closed opening without app chrome. Confirmed defect: the cover visibly says `14-noyabr 2026 · 18:00`, while the current fixture's `startsAt` is `2027-06-12T17:00`; the source opening binds this date dynamically. Catalog artwork is stale relative to its stated fixture.

Shared preview data is provided only for catalog and initial selection. Creator uploads replace preview-only photos, and empty public creator-photo sections remain hidden. Source-owned decoration remains visible. RSVP, wishes, To‘yona and gallery wiring were inspected in the shared renderer and focused tests.

## Focused checks and follow-up

Ran:

```text
pnpm exec tsx --test tests/oynavand-localization.test.ts tests/oynavand-preview.test.ts tests/parda-template.test.ts tests/parda-wishes.test.ts tests/paxta-localization.test.ts tests/marxaba-gallery-preview.test.ts
```

Result: 25 passed, 1 failed. The only failure is Parda's stale fixture hash assertion described above. No template or application code, database state, publication, or payment setting changed.

## Browser opening and reduced-motion follow-up

Used the existing production preview server at `http://127.0.0.1:3002/preview?template=<id>&qaSilent=1` in headless Chrome at 430×900. For reduced runs, emulated `prefers-reduced-motion: reduce` and set the documented preview-only `qaReducedMotion=1` flag. Oynavand, Parda, and Paxta each loaded their source iframe and opening control in both modes (6/6). All six controls reached the opened state: Oynavand hid `#intro`; Parda applied its `.opened` state and hid the intro; Paxta hid the intro. The reduced runs reported the browser media preference and template runtime reduced-motion flag enabled; normal runs reported both disabled.

No failed template-asset HTTP responses or page JavaScript exceptions were recorded. The normal Oynavand and Parda runs logged an app-shell `/favicon.ico` 404 (confirmed directly against the same server); no template resources returned HTTP 4xx/5xx. The shared `/templates/shared/editor-sections.js` request was aborted during iframe navigation in the six runs, and one reduced Parda run also aborted an app `/preview?_rsc=…` request during navigation; these were cancellations, not missing template assets. Only the favicon 404 produced console resource errors.

No template or artwork files were changed during browser verification.

Separate repair tasks created:

- Parda preview provenance: `01a166c4-d665-7b63-93af-59d530b56f57`.
- Paxta opening cover date/fixture mismatch: `01a166c5-6e2f-7721-8ab0-fc859b9eeff5`.

The next published database IDs after Paxta are Qandil, Qatlam, and Qiz Bazmi. The browser-verification gap recorded in the original audit is closed by the follow-up above.

## Independent repair follow-up

The two separate repair tasks have since completed outside this audit. Parda retained its existing 478×668 capture and refreshed the fixture hash in its provenance; its focused test passes 5/5. Paxta received a new 720×1280 closed-opening capture showing “Shanba, 12 iyun 2027,” matching the shared fixture; its focused suite passes 8/8. These repair-task changes were not made as part of the browser-verification follow-up.
