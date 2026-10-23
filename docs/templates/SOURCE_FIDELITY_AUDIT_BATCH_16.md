# Published-template source-fidelity audit — batch 16

Date: 2026-10-23

## Catalog order and compatibility

Read-only call to the application's `getCatalog()` against the configured PostgreSQL database returned 51 published templates. Positions 46–48 are the requested consecutive entries after Shahzoda:

| ID | Name | Price | Category | Supported event types |
| --- | --- | ---: | --- | --- |
| `shirin-bayram` | Shirin Bayram | 150,000 UZS | birthday | birthday |
| `somon-yoli` | Somon Yo‘li | 150,000 UZS | wedding | wedding |
| `suzani` | Suzani | 150,000 UZS | wedding | wedding, fotiha |

The category and event columns were read independently from the catalog API's database-backed result. The next IDs after Suzani are `toscana`, `vals`, and `yangi-uy` (not necessarily the next templates if catalog ordering changes).

## Capture/provider search

Inspected every provider-level `capture-manifest.json` in the local capture tree and searched all provider capture folders for each exact ID. The 13 manifests under Chorlove, Invitate, Invitio, Marxaba, Mytaklif, OnlineTaklifnoma, Taklifiy, Taklifla, Taklifnomachi, Wedivo, Wedvitation, Yoryor, and Yumevite were all read. Only Marxaba declares the complete captures for this batch:

- `Marxaba/Tug'ilgan kun va Yubiley/templates/shirin-bayram`
- `Marxaba/Nikoh/templates/somon-yoli`
- `Marxaba/Nikoh/templates/suzani`

The E-invitation archive contains no provider capture manifest and no exact-ID capture match. Name-only related assets elsewhere in Marxaba (including Parda's Suzani art) are not alternate complete sources. Original source captures were left untouched.

## Template findings

- **Shirin Bayram:** The packaged body matches the captured body; captured CSS, metadata, localization, and birthday JavaScript match, with only the documented local Three.js URL rewrite in JavaScript. Required local font files and bundled motion dependencies are present. The source's closed opening is the 720×1280 catalog cover: cake/balloons, greeting, canonical fixture name/date, and open control are visible without browser/app chrome. Birthday-only support matches source metadata. The two source age hooks remain empty because there is no approved age field in the shared contract/editor; this is documented in `SOURCE_ADAPTATIONS.md`. It remains an unresolved capability gap, not a fabricated value. Gallery slots are blank in previews; public no-upload galleries are hidden by the shared runtime, while template-owned cake/balloon art remains. Reduced-motion CSS/JS paths are present.
- **Somon Yo‘li:** Packaged captured CSS and both source art assets are byte-identical; the cover is the 1080×1920 wedding hero the user chose, with astrolabe, canonical couple/date, and motto. The initial invitation opening remains the source galaxy poster and its interaction is intact. Data contract checks cover six localized program entries, dress code, guest wishes, card/holder To‘yona, contacts, empty gallery behavior, and empty-draft isolation. Unsupported bank/note values are hidden. The captured Three.js loader is locally packaged through shared dependencies; reduced-motion CSS and JavaScript paths exist.
- **Suzani:** Captured opening, interactive stitch/medallion lock, hero, gallery, To‘yona, and remaining sections are present; source transformations (pseudo-element to animatable layer) are documented and tested. Reduced-motion and narrow/desktop CSS breakpoints are present. To‘yona card/holder bind; unsupported note/bank and venue-photo frame are hidden. Shared runtime hides the creator-photo section when no real URLs exist, while opening and decorative textile art remain. The captured `meta.js` points to `preview.webp`, absent from the source folder. The active repair task (`01a166d5-36c1-7813-8e25-4c793a1288f3`) supplied a clean 450×800 render of the packaged locked `#intro` with the canonical fixture. Capture and WebP hashes, fixture, renderer input hashes, viewport, crop, and control exclusions are recorded in `apps/web/public/templates/suzani/preview.provenance.json`; the focused cover assertion passes.

For all three, the centralized fixture is preview-only, creator values flow through the shared adapter, and no sample is saved or published. No new interaction gap was confirmed from the code review. Media preview photos remain ephemeral; creator-uploaded gallery photos replace them and public photo sections remain hidden without uploads.

## Focused checks and limitations

Command:

```text
pnpm exec tsx --test tests/shirin-bayram-template.test.ts tests/somon-yoli-template.test.ts tests/somon-yoli-preview-contract.test.ts tests/suzani-template.test.ts
```

Original batch focused run: 20 passed, 1 failed. The sole failure is the Shirin Bayram fixture test's final regex assertion for `extras.celebrant`; it expects a differently spaced source string. The current `MarxabaInvitation` message still adds `extras.celebrant: sourceData.groom || sourceData.bride`, so the failing assertion is stale and does not indicate a mapping defect. Somon Yo‘li and Suzani suites passed. After Suzani cover repair, its focused suite separately passes 5/5; the stale assertion was reconfirmed by rerunning the combined command.

Catalog images were opened and visually inspected in a side-by-side portrait contact sheet; image dimensions and cover provenance were inspected. Static checks cover source parity, interactions, reduced-motion paths, localized fixtures, empty galleries, creator-media handling, and sample isolation.

### Browser verification follow-up (2026-10-23)

Used the local production preview route in headless Chrome at 450×800, with normal mode and browser `prefers-reduced-motion: reduce` emulation plus the preview-only reduced-motion flag. All six template documents loaded with their full section sets and opening artwork loaded. The open interaction reached the hidden-intro/open state for Shirin Bayram and Suzani in both modes, and Somon Yo‘li in normal mode. In Somon Yo‘li reduced mode, the opening remained visible after the first click; source has an intro-wide click handler to finish the opening, but that second interaction was not successfully verified. Computed CSS animation count was zero in all reduced runs. No uncaught page errors or completed HTTP error responses occurred. One generic console 404 appeared in normal Shirin Bayram, without a corresponding completed failing response. `/templates/shared/editor-sections.js` requests were aborted during navigation in each run; one preview RSC request also aborted in Shirin's reduced run. No missing template asset was confirmed. Reduced-mode opening completion for Somon Yo‘li and live gallery/venue media behavior remain unverified. Captures and results are in `C:\Users\user\AppData\Local\Temp\taklifnoma-batch15-browser`; temporary QA evidence only, not source or application artwork.

The Suzani repair changed only its packaged preview image, provenance, adaptation note, focused test, and decision record; original reference captures and database/publication/deployment/payment state remain unchanged. The separate repair chat remains active. No task was created for the known stale Shirin Bayram assertion; confirm ownership before opening one to prevent duplication.
