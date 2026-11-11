# Launch pricing and catalog artwork

> Update (2026-11-11): free publication/download behavior described below is superseded. All new website publication and clean PNG downloads require verified payment; no publishing-mode setting exists. QA now uses disposable paid order fixtures. See [payments](../../PAYMENTS.md).

Website prices: Osmon, Ganch and Baxmal saroy are 99,000 UZS; Palov, Xatna and
Shirin Bayram are 39,000 UZS; remaining website templates are 49,000 UZS.
Static image invitations are 5,000 UZS. Local definitions and the configured
database agree. Published counts are 3 / 25 / 3 website designs at
39,000 / 49,000 / 99,000 UZS, plus four image designs at 5,000 UZS.

Only migrations `0231_launch_template_prices.sql` and `0232_static_image_prices.sql`
were applied for this task, in separate transactions with the migration advisory
lock and ledger entries. The unrelated pending `0225_remove_account_phone.sql`
was not applied. Existing payment/order snapshots and publication flags were not
changed. No external application deployment or payment activation was performed.

Image cards use the intrinsic artwork height in the catalog and Studio picker;
website cards retain their 3:5 ratio. Osmon's static poster is a real 480×800
renderer capture, opened and scrolled 180px so names clear the listing caption.
Source artwork is preserved. The cover hash and capture state are recorded in
`docs/catalog-cover-captures.json`. Catalog auto-opening now recognizes versioned
same-origin template URLs through the existing `isTemplateDocument` helper.

Image checkout uses the existing provider/order flow, preserving the server quote.
Verified image payments grant download access instead of publishing a website.
The download endpoint checks entitlement before rendering and again under the
invitation lock. The first download still locks the event; repeat downloads and
permitted practical edits remain available without another payment. Previously
finalized free-testing cards retain access. Studio, return-page and confirmation
copy describe PNG download rather than website publication.

## Verification

- Production build, TypeScript and deployment asset trace checks passed using
  `TAKLIFNOMA_BUILD_DIST_DIR=.next-pricing-qa`.
- 22 focused checks passed across catalog covers, public assets, payment helpers,
  checkout navigation and payment notification copy.
- `tests/static-image-payments.integration.ts` passed with disposable database
  records and a completely mocked provider: correct 5,000 UZS decimal quote;
  stale/tampered price rejection; blocked unpaid/pending/wrong-owner/wrong-event
  access; signed webhook replay; no website publication; actual 1500×2100 PNG;
  preserved first-download timestamp after a permitted time/address edit; one
  order and one provider request. Test records and queued notification jobs were
  removed; no payment or Telegram message was sent.
- Production browser checks at 390px and 1440px verified website ratios remain
  3:5, all four image cards match their 750×1050 artwork, image details show
  5,000 UZS, and there is no horizontal overflow or browser error.
- Production versioned Osmon catalog animation dismisses the splash. Its new
  versioned poster is used in the catalog. Ordinary previews still require the
  creator/guest to open the invitation.
- Mocked production Studio browser flow verified one 5,000 UZS checkout, no
  download before confirmation, a PNG download after confirmation, and a return
  page offering PNG download without promising publication.

Browser screenshots and detailed JSON output are local QA artifacts under
`test-results/pricing-osmon/`. The initial root test invocation could not resolve
workspace package aliases; rerunning with `NODE_PATH=apps/web/node_modules` passed.
For the image integration test, also set `TSX_TSCONFIG_PATH=apps/web/tsconfig.json`,
load `apps/web/.env.local`, and provide `INVITATION_COVER_BROWSER_PATH` when a
bundled Playwright browser is unavailable. Provider configuration is replaced
with mock values by the test.
