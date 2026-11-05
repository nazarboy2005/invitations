# Three original static stationery designs — 2026-11-05

The user approved the revised Oq atirgul and requested three additional static
designs with freely different arrangements. These are original compositions;
there is no external reference template or runtime to compare against.

| Design | Composition | Private package |
| --- | --- | --- |
| Lola maktubi | Burgundy botanical engraving, left-aligned calligraphy, letter-like venue/QR footer | `apps/web/src/templates/lola-maktubi` |
| Moviy ravoq | Blue porcelain arch, italic serif names, day medallion, family/QR footer | `apps/web/src/templates/moviy-ravoq-card` |
| Sahar ifori | Light ivory/blush botanicals, sage calligraphy, three-part date band and integrated QR/signature | `apps/web/src/templates/sahar-ifori` |

All three current backgrounds were generated with the built-in imagegen tool.
Their untouched original PNGs and exact prompts are saved in their packages.
Zarhal oqshom was retired at the user's request and replaced by Sahar ifori via
migrations 0216/0217. See `sahar-ifori.md` for the replacement checks. Its old SVG
source stays available for owned cards. Fonts/artwork are local and private. The shared
typed adapter and isolated browser renderer abort all network requests; no
third-party font, image, QR or template runtime is required.

Each design maps `people[0..1]`, `eventLabel`, `message`, optional `greeting` and
`hosts`, `startsAt`/`timezone`, `venueName`, `address` and `landmark`, plus a locally
generated location QR. Their localized date/venue/QR labels support Uzbek Latin,
Uzbek Cyrillic, English and Russian. Only the shared canonical JSON supplies
catalog samples; backend tests use disposable authored content with different
names/venues. Sample invitation content is never saved to creator records.

All three support wedding and fotiha, independently of their wedding category.
Migrations `0214`/`0215` were applied individually with the existing advisory lock
and migration ledger; configured database rows are published, image format,
zero UZS with both event types. The unpublished pre-existing Zumrad naqsh is
unchanged. Typed fallback and database publication agree. No application deployment
or live payment activation was performed.

## Verification

- `pnpm typecheck`: passed.
- Focused invitation/capability/edit-policy/filename/browser/deadline tests: 39/39.
- `node --import tsx scripts/verify-static-collection.mts`: four locale renders,
  long Latin/Cyrillic names, Fotiha with empty optional fields, timezone/year
  rollover, Russian month grammar, readable bounded slots, flattened 1500×2100
  PNG, watermarked 750×1050 preview, decoded short and written-address Yandex QR,
  and oversized content rejection all passed for every design.
- Canonical public posters are actual renderer output at 750×1050, with the valid
  shared sample Yandex destination. The synthetic short URL used to verify QR
  payload encoding is confined to QA renders and is not used in public posters.
- Pre-publication local browser QA passed at 1440×1000 and 390×844: full protected
  previews and saved authored Studio rendering; no horizontal overflow, page
  errors or failed image/auth API requests. Saved screenshots include both widths.
- Post-publication catalog cards and detail dialogs passed at both widths; all
  three appear in the wedding/fotiha creator picker. A selector assertion was
  corrected to target the actual card button rather than count both its nested
  template wrappers; no application change was needed for that harness issue.
- Real authenticated save/reopen and design switching preserve entered names
  and family signatures. Incompatible birthday saves are rejected. Each owned
  download returns a clean PNG and filename, locks identity without publishing a
  web slug or making a payment order, rejects identity changes/payment checkout,
  and permits address corrections/repeat download. Temporary users, sessions,
  drafts and audit rows are removed after QA.
- Production build passed with `.next-static-collection`; both static routes trace
  every required private background/font (including all calligraphy subsets and
  Forum) plus the Playwright/Chromium runtime. Deployment manifest check passed.
- Existing Oq atirgul renderer suite passed again after the shared registry change.

`collection.webp` shows all three finished catalog cards. `*-catalog.webp` are
their exact catalog posters. `*-long-*.webp`, `*-fotiha-minimal.webp` and
`*-timezone-rollover.webp` document content stress cases; `*-protected.png` show
watermarked previews. `*-preview-*`, `*-studio-*`, `*-detail-*`, `catalog-*` and
`studio-selection-desktop.png` record the actual application. `*-owned-download.png`
are real server downloads with disposable authored content.

Reproduce local UI/backend checks with:

```powershell
node --env-file=apps/web/.env.local --import tsx scripts/verify-static-collection-ui.mts
node --env-file=apps/web/.env.local --import tsx scripts/verify-static-collection-ui.mts --release
```

`--backend-only` skips repeated viewport captures while checking creator selection,
save/reopen, switching, compatibility and owned exports. These checks use only the
local application at `http://127.0.0.1:3001` and the configured database.
