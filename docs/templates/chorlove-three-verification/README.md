# Chorlove: Stained Glass, Sunset and Swan Garden

> Update (2026-11-11): free publication/download behavior described below is superseded. All new website publication and clean PNG downloads require verified payment; no publishing-mode setting exists. QA now uses disposable paid order fixtures. See [payments](../../PAYMENTS.md).

Checked 8 November 2026. These are three additive website integrations, registered by `0222_register_chorlove_three.sql` and published by `0223_publish_chorlove_three.sql`. The configured database and `/api/catalog` confirm all three are published, selectable web designs with wedding category/event support. Each uses `price_minor=15000000`, UZS, matching the existing Chorlove release convention. All 131 other database template rows were unchanged by each migration.

The previous inventory is updated at `D:/Projects/Fotiha/output/provider-template-inventory.md` and its JSON counterpart. Chorlove now has **28 saved previews, 18 website source packages, 18 typed catalog entries and 15 local published flags**. These fallback counts are distinct from the targeted database confirmation for these three releases.

## Implementation and field mapping

The packages are in `apps/web/public/templates/{stained-glass,sunset,swan-garden}`. Each keeps an exact reference capture/module and checksummed local assets, its source HTML composition, original videos, artwork and motion. Shared captured CSS/fonts remain local under `templates/chorlove/shared/_next`. The original reference directory was not edited. Per-package READMEs explain source adaptations and recovered originals.

`ChorloveInvitation` is used by catalog/full preview, Studio and public invitations. The separate bridge maps:

| Shared contract | Source presentation / behavior |
|---|---|
| Localized people, greeting, personal greeting, message, event label and hosts | Hero, envelope guest greeting and footer; authored text replaces samples |
| Event date, timezone and program IDs/titles/times | Localized date, countdown, local calendar download and repeatable source timeline |
| Venue, saved Yandex URL and coordinates | Original map presentation; platform map frame for coordinates and direct saved link for manually pasted destinations |
| Creator gallery/media/alt text/captions | Source gallery and zoom/swipe/thumbnail dialog; Stained Glass scratch reveal uses the creator's first uploaded image |
| Dress code and palette | Original dress section and repeatable color swatches |
| Creator music and contacts | Source play/pause and contact controls; explicit guest pause survives locale updates |
| RSVP and wishes | Existing one-person RSVP API; existing moderated-wishes API with safe text insertion and error handling |
| Gift and receipt settings | Source card controls and the existing private receipt-upload adapter |
| Story and additional people | Existing optional-section adapter inside the invitation flow |

Preview media comes from the shared preview fixture only. Real invitations hide galleries and the scratch-photo section without creator uploads. Creator content, optional data and media references survive switching among these three designs. Their capabilities explicitly retain authored data that has no native rendered slot, including prior template data. Language changes update in place without restarting the opening, clearing form input or resetting the guest's music choice.

Catalog art is the actual source opening poster at its complete portrait ratio. Personalized dashboard covers use the same renderer's opened scene with reduced motion and authored names. No provider app runtime, analytics, source sample soundtrack or source service is required by the runnable pages.

## Verification evidence

- `browser-report.json`: all three designs at 390×844 and 1280×800, including actual decoded opening-video frames, source timing, all sections, galleries, four locales, empty optionals, preview form behavior, long names and reduced motion. No template asset errors, browser exceptions or provider/Google-font/analytics requests.
- `catalog-report.json`: configured database publication, selectable detail dialogs and complete portrait artwork for all three at mobile and desktop sizes.
- `preflight-lifecycle.json`: authenticated private save/reopen, real creator photo/music uploads, localized content, repeatable program, optional story/dress/gift settings and event-compatibility rejection.
- `release-lifecycle.json`: **3/3 pass** for saved Studio rendering, switching away/back without content/media loss, real public rendering with creator uploads, one-person RSVP persistence, pending-wish privacy, music pause across language changes and personalized cover generation.
- `register-database.json` / `publish-database.json`: scoped migration records, event/category assignments and unchanged counts for other template rows.
- `*-reference-opening.png` / `*-reference-hero.png` and matching application images: local reference-versus-application comparisons. The reference uses its original sample copy; the app uses the shared fixture or explicitly authored test data.
- Final interaction smoke checks cover source carousel previous/next wrapping, scratch keyboard reveal, gallery keyboard close, three intended lightbox toolbar controls and in-place language changes.
- Source/provenance tests: **4/4 pass**. Web typecheck and production build pass, including the existing cover-deployment asset check.

The application is configured for paid invitation publication. The release test first verifies its HTTP `PAYMENT_REQUIRED` guard, then uses the shared publication transaction with a free-mode override scoped only to the disposable test process. It does not change the running app's settings or call a payment provider. Disposable creator, invitation, media, RSVP and wish records are removed afterward. External application deployment is separate from catalog publication.

## Existing unrelated test failures

The broader preview fixture suite has three existing failures: Love Sakura's empty-content detection, generic empty template-selection detection and Glass Pink's empty-content detection. The Studio capability suite has two existing failures: reference identity for the existing Ivory Rose capability object and the old expectation that music starts enabled. These same results were reproduced using the unchanged `HEAD` contract implementation: all three empty-content predicates return true, the capability objects are not reference-identical and default music is disabled. This task does not change those templates or their policies.

## Local reproduction

```powershell
python -X utf8 scripts/templates/package-chorlove-three.py
node --import tsx --test tests/chorlove-three-source.test.ts
node --import tsx scripts/templates/verify-chorlove-three.mts
node --import tsx scripts/templates/verify-chorlove-three-catalog.mts
$env:TSX_TSCONFIG_PATH='apps/web/tsconfig.json'
node --env-file=apps/web/.env.local --import tsx scripts/templates/verify-chorlove-three-lifecycle.mts --release
```

Use a local app with its configured environment. The migration helper applies only the named additive registration/publication migration; it does not apply unrelated pending migrations.
