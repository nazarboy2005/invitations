# Oq atirgul verification — 2026-11-03

One original generated 5:7 design, using the built-in imagegen tool. The preserved
background, exact prompt, local fonts and field mapping are in
`apps/web/src/templates/ivory-rose-card`. The catalog cover is an actual render
using the shared canonical preview JSON. No application deployment was performed.

## Passed checks

- Renderer: Uzbek Latin, Uzbek Cyrillic, English and Russian; long names in all
  four scripts; 750 × 1050 preview with pixel-baked watermarks; clean 1500 × 2100
  PNG; oversized wording rejected with 422 rather than clipped. Local fonts and
  artwork only; renderer aborts all network requests.
- Private HTTP lifecycle using disposable accounts: anonymous download 401;
  other-account access 404; wrong revision 409; disabled locale 400; wrong origin
  403; private/no-store preview; unpublished-template rejection before release.
- Final HTTP lifecycle after release: owned download succeeds; no public slug,
  publication or payment order; first-download identity lock/deadline and audit;
  name/date replacement rejected; practical address correction saves and reopens;
  old revision rejected; fresh revision downloads again; client cannot delete the
  finalization timestamp; checkout and webpage publication rejected.
- Real browser flow: desktop and 390 × 844 mobile Studio, final review, actual PNG
  download, Taklifnomalarim personalized image/status/download, catalog format
  filter, portrait artwork/detail dialog, full preview/back action and no landing
  image/link placement. No page errors in the successful run. Uses reduced motion.
- 42 related tests pass across invitation contracts/policy, publishing, payments,
  Studio capabilities/placeholder projections and event-compatible template order.
- Typecheck and production build pass. Both static API route traces include private
  artwork/fonts and the required Playwright/Chromium runtime assets.

## Database/catalog

Inspected configured migrations first: existing unrelated release entries extended
through 0206. Applied only `0207_register_ivory_rose_image.sql` (initially hidden)
and `0208_publish_ivory_rose_image.sql` after pre-release verification. The database
and public catalog expose `ivory-rose-card` / Oq atirgul, image format, wedding/fotiha
compatibility, wedding category and zero price. Existing administrator prices and
web invitation payment flows are unchanged. Publication is committed locally.

## Evidence

- `sample-uz-Latn.png`: clean full-resolution example (catalog sample, not user data).
- `sample-uz-Cyrl.webp`, `sample-en.webp`, `sample-ru.webp`: other language examples.
- `protected-preview.png`, `long-names.webp`: watermark and long-name checks.
- `studio-desktop.png`, `studio-mobile.png`, `studio-final-step.png`: editor views.
- `studio-download.png`: actual browser-downloaded personalized PNG fixture.
- `dashboard-desktop.png`, `catalog-desktop.png`, `catalog-detail.png`,
  `preview-mobile.png`: integration screenshots.

All fixture users/invitations/sessions/audits were removed after checks. No Telegram
messages, real payments or external deployment were used. Static previews deter
ordinary copying; screenshots and external raster-image editing remain possible.
