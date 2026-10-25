# Invitate templates

Invitate integration is tracked separately from the concurrent Marxaba batch.
Process captured designs in live Invitate catalog order, skipping a design until
its source capture exists. Keep each local capture untouched. Register a
template unpublished until its release gates pass and use additive migrations
for registration and publication.

| Catalog order among captured designs | Template | State |
|---:|---|---|
| 1 | Aurelia | Published at 150,000 UZS; wedding compatibility confirmed; both captured default photos remain replaceable by creator uploads. |
| 2 | Swan | Captured source and assets exist locally. |
| 3 | Whiteless | Full captured source package, four-locale contract adapter, and source-rendered portrait opening artwork are staged. Focused package checks and web typecheck pass. Unpublished pending integrated browser/runtime verification and migration application; `0133_register_whiteless_template.sql` is the currently unique registration ID. |
| 4 | Velvet | Source package, four-locale typed adapter, platform RSVP bridge, reduced-motion support, and portrait source-opening artwork are staged. Typed/DB registration remains unpublished; browser interaction, public save/reopen, and final release checks are pending. |
| 5 | Estelle | Captured source and assets exist locally. |
| 6 | Palov | Captured source and assets exist locally. |
| 7 | Nahorgi osh | Integrated from the exact Invitate capture under `invitate-nahorgi-osh`; published for `osh` with a source-rendered portrait cover, localized typed adapter, and API-backed RSVP. |
| 8 | Fairy | Captured source and assets exist locally. |
| 9 | Bloom | Integrated from the captured Invitate source; privately registered as birthday-only. Renderer, source package, localized bridge, and source-authentic portrait opening are present. Keep unpublished and unselectable until full release verification passes. |
| 10 | Golden Hour | Captured source and assets exist locally. |
| 11 | Wedding | `invitate-wedding` is privately registered with the captured source package and four-locale adapter. The recycle-bin ZIP confirms the missing garden-strip and program-background images plus location video are not archived; current URLs return 404/404/403. The shared contract, studio, save/reopen schema, and renderer now support localized artists and program descriptions; source examples stay in the preview fixture. Focused checks pass 5/5 and web typecheck passes. The expanded DB-backed save/reopen/public-render check is blocked because this checkout has no `apps/web/.env.local`, `DATABASE_URL`, `APP_URL`, or local app/PostgreSQL service. Keep private until media and DB lifecycle gates pass; RSVP may follow separately. |
| 12 | Velora | Captured source and assets exist locally. |
| 13 | Girls Party | Captured source and assets exist locally. |
| 14 | Butterfly | Captured source and assets exist locally. |
| 15 | Safir | Isolated package preserves captured `safir.js` and `safir.css` byte-for-byte and adapts platform data/API behavior through the bridge; four locale handoffs and clean 430×931 source-opening catalog artwork are staged with provenance hashes. Typed catalog and database registration are complete via additive migration `0136_register_safir_template.sql`. Remains unpublished/unselectable pending matching viewport source/package comparisons in normal and reduced motion, production preview, public save/reopen, mobile/desktop, and final release checks. The actual React renderer passed section rendering, RSVP-modal display, and preview no-send behavior in a temporary local route; it has been removed. Browser comparison could not run in the resumption session because local browser automation was disabled. |
| — | Evelina | Published at 150,000 UZS; wedding compatibility confirmed. |

This ordering follows the currently visible live catalog sequence intersected
with the local source capture inventory. Revisit it as captures or catalog entries
change.
