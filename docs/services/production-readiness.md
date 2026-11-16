# Services readiness review — 2026-11-16

Verdict at review: the directory and admin workflow were usable, with two issues
to correct before unrestricted use. Both findings below are now fixed locally:
browser photo preparation respects the hosting payload limit, and imported
Instagram contacts are normalized and filtered. Deploy the web changes and restart
the laptop worker to activate the fixes. The agreed laptop setup needs no extra
hosting service. The scaling/maintenance improvements below remain recommendations.

This review inspected the current implementation, queried the configured database
without changing records, checked the deployed `https://fotiha.uz` site, ran focused
tests and collected one fresh business into local scratch output. It did not
publish, edit or delete services, change infrastructure, or deploy code.

## Current working behavior

- The database contains 308 published profiles, including 51 wedding halls and one
  featured partner. There are no draft/archived profiles or unpublished edits at
  the time of inspection. All draft and published records pass the editor schema.
- Admin creation has one entry point with manual and Maps choices. Existing
  profiles remain editable. Saving retains the previous published snapshot;
  publication is explicit. Revision checks prevent overwriting a concurrent edit.
- Publish requires an address, valid phone and saved photo. Imported profiles
  require review acknowledgement. Archive/unpublish preserve the editable record.
- Partner placement uses the published `featured` flag and priority. Smaller
  numbers come first; regular profiles append within their category. The general
  directory interleaves categories. Partners use the light peach/gold card and
  handshake Hamkor badge. Importing does not establish a partnership.
- Search, region/category filters, pagination, detail pages, contact/map links,
  gallery, sharing and guest/account favorites are implemented. Public pages use
  published database content rather than scraping source sites during visits.
- New media use private R2 storage and application routes. Draft images require
  a fresh admin session; published images are anonymous only while referenced by
  a public snapshot. The three newest objects were checked in R2 and through the
  deployed image route; their byte counts match storage records.
- The configured media table has eight R2 objects and no local-disk objects or
  unreferenced uploads. All Services migrations (0233–0235) are applied.
- The only import job has reached review successfully and its profile has since
  been reviewed/published. Its job status remains `review`, which is a collection
  completion status, not the profile's publication status.
- The laptop worker was offline and no jobs were queued/running. Its creator role
  passes the laptop's current admin configuration. Run `pnpm services:worker` when
  imports are needed; the actual hosted admin works with it. Keep the laptop awake
  and connected. Existing services and manual admin management need no worker.

## Findings corrected locally

### P2 — Manual photo upload exceeds Vercel's request limit

`apps/web/src/modules/admin/service-editor-panel.tsx:121` accepts a 12 MiB file,
then posts the original bytes directly to the image API at line 126. The route at
`apps/web/src/app/api/admin/services/images/route.ts:10` also accepts 12 MiB. Image
resizing happens only after the request reaches the server.

[Vercel's documented function payload limit](https://vercel.com/docs/functions/limitations#request-body-size)
is 4.5 MB. A photo above that limit but below 12 MiB passes client validation and
can be rejected before our route runs. The editor assumes a JSON response, so the
platform rejection can also produce an unhelpful JSON parsing error.

Recommended correction: resize/compress browser-selected photos to a safe request
size before upload, retain server decoding/validation, and handle non-JSON upload
failures. Alternatively use the existing controlled direct-storage upload design
with server-side verification. Merely increasing a Next.js body limit cannot fix
the hosting limit. The laptop import path uploads directly to R2 and is unaffected.

Resolution: the browser accepts source images up to 12 MiB but decodes, resizes
and encodes them into requests capped at 4 MiB. The API enforces the same request
limit and retains server-side decoding/metadata stripping. Non-JSON error
responses now show readable errors. A real browser regression test compressed a
6,302,635-byte PNG to an 841,780-byte WebP, verified EXIF orientation and alpha,
and exercised malformed images, source-size limits and HTML/text upload failures.

### P2 — Website enrichment imports social-platform navigation as contacts

The fresh live Parvoz run demonstrates this in current source output. Google
exposes `http://instagram.com/parvoz_restaurant` as its authority/website link.
`tools/services-scraper/src/runner.mjs:265` chooses it for website enrichment.
`tools/services-scraper/src/website.mjs:53` extracts contact links from the returned
page, and `tools/services-scraper/src/schema.mjs:58` accepts matching social-domain
anchors without checking whether they identify this business's account.

The merged result contains 36 links, including Instagram's root, login, signup,
stories/reels and other accounts. The Fotiha adapter takes the first 15 links, so
these can become editable service contacts. Review prevents automatic publication
but should not be the only defense against this predictable source noise.

Recommended correction: classify known social-platform authority URLs as social
accounts, skip crawling them as independent business websites, normalize and
deduplicate account URLs, and exclude login/signup/navigation/content URLs from
contact extraction. Preserve genuine official-site contact enrichment. Add a
regression fixture for this Google-authority-to-Instagram case.

The currently published Parvoz record was checked separately and contains only
its intended Telegram and Instagram contacts. This finding concerns newly
collected draft content; no published contacts were changed by the review.

Resolution: shared contact normalization is applied during source parsing, cached
source loading, merging, manual scrape overrides and final admin adaptation.
HTTPS Instagram account variants collapse to one URL; HTTP Instagram URLs,
stories, reels/posts, login/signup/navigation and redirectors are excluded.
Social URLs are classified as contacts instead of independent websites to crawl.
Older completed cache entries are reprocessed through the contact policy. Four
new regression tests cover these paths. A fresh Parvoz collection completed with
Google/Yandex sources, two Yandex-only photos, no source errors and only its
Telegram contact: its Google-listed HTTP Instagram URL was correctly ignored.

Fix verification: all 44 scraper tests, 27 focused Services/admin tests, the real
browser upload regression, TypeScript checking and an isolated production build
passed. No database migrations
or production listing edits are required for these fixes.

## Improvements before substantially expanding the catalog

- **Data loading:** directory pages serialize every published profile to the
  browser, even when showing 12 cards. Current listing JSON is approximately
  726 KB and deployed HTML is approximately 885 KB before transfer compression.
  Admin listing retrieval also loads all drafts and evidence. Add server-side
  filtering/pagination or a smaller directory projection before large growth;
  preserve favorites, category counts and partner ordering.
- **Storage maintenance:** removing a gallery photo or abandoning an upload does
  not delete its storage object. Failed/cancelled imports clean up newly created
  media, but ordinary uploads have no general garbage collector. Add conservative
  cleanup with a grace period and checks against both drafts and published
  snapshots. There are currently no unreferenced media records.
- **Import history:** the dashboard shows the latest 30 jobs without older-history
  pagination. Imported profiles remain in the Services list, but older job rows
  will become inaccessible through this history view.
- **Price maintenance:** 93 published records store USD prices; display converts
  them using a bundled rate dated 2026-11-14. Updating this rate is currently a
  manual code/data change. Enter reviewed UZS prices for partners when possible.
- **Content:** 30 profiles lack descriptions and 189 have negotiable prices.
  These are supported states, not scraper or publication failures. One legacy
  printed-invitation profile (`taklifnomalar-6575`) lacks an address; add one
  before republishing it under the current requirements.

## Verification and limits

- TypeScript checking passed.
- 27 focused Services/admin/allowlist/audit tests and all 40 scraper tests passed.
- Fifteen deployed HTTP checks returned the expected statuses, including 12
  first-page cards, three cards on hall page five, empty search, detail pages,
  sitemap, invitation-category redirect, missing-page 404s and anonymous admin
  API rejection. Three deployed R2-backed photos returned the expected bytes.
- Deployed browser checks at 1440px and 390px passed guest save/unsave and opening
  the partner detail page. There were no page exceptions, broken images on the
  checked detail page, or directory/detail horizontal overflow. An initial
  anonymous favorites request temporarily entered its retry state; the next run
  passed, and three direct API checks returned the expected anonymous response.
- A fresh standalone run of the original Parvoz Yandex Share URL completed in
  approximately 35 seconds, accepted Yandex/Google/website sources and downloaded
  two Yandex-only photos. It wrote only ignored local scratch output and did not
  claim a queue job or write database/R2 data.
- Scraping remains a reviewed import tool: source layout changes, access challenges
  and absent content can produce partial/failed imports. Description, email,
  products and prices are not guaranteed. Products/ranges remain evidence; an
  administrator sets the appropriate headline venue price instead of treating
  restaurant menu extremes as wedding-package prices.
- A fresh authenticated production create/edit/publish/unpublish cycle was not
  performed during this read-only review. Earlier disposable local HTTP
  integration coverage is documented in `docs/services/admin.md`. This review
  does not verify hosting-account backups, billing limits or private Vercel
  project settings and does not guarantee absence of every security issue.

Local diagnostic evidence is in `.tmp/services-readiness.json`,
`.tmp/services-readiness-live/` and `.tmp/services-production-smoke.json`.
