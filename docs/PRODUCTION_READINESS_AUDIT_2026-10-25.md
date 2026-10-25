# Production readiness audit — 2026-10-25

Follow-up: the automated test failures described in this original audit have
been repaired, and catalog card playback has been added. Current verification
is recorded in [Test repairs and catalog playback](CATALOG_VERIFICATION_2026-10-25.md).
The production notification, billing, storage, and deployment work below remains
separate from these repairs.

Assessment of the current checkout, local application, configured database, and read-only Telegram delivery configuration. Earlier implementation documents contain stale counts; the observations below come from this audit.

## Verdict

The core free invitation platform is implemented and runs locally, but the project is not ready for an unrestricted production launch. Paid checkout is absent, the automated release checks are failing, and production storage, Telegram delivery, deployment, and operations still need verification and setup.

The development application is running at http://127.0.0.1:3001. This address is reachable on this computer only.

## Implemented

| Area | Current implementation and limits |
| --- | --- |
| Website and catalog | Homepage, catalog/filtering, template previews, and creator entry points. The configured database contains 105 registered templates; 53 are published and returned by the public catalog across 7 categories. All 53 catalog cover URLs returned HTTP 200. Registered/private templates are not automatically released. |
| Invitation creation | Four-step editor, real-renderer preview, browser draft recovery, account-backed drafts, revision conflict checks, four invitation-content locales, event/template compatibility, optional gallery/music/program/dress-code/contact/gift sections. |
| Publication | Authenticated free publication, six-character Base62 public links, validation, identity locks, event-timezone editing deadlines, audit records, stable retry behavior, and archive handling. |
| Accounts | Telegram website login, own-contact phone verification, hashed session tokens, HttpOnly cookies, production secure cookies, expiry/revocation, origin checks, admin authorization, and signed/replay-protected Mini App exchange. Mini App bootstrap exists in the dashboard; the full launch/onboarding experience still needs real-device verification. There are no email/password login routes. |
| Owner tools | Invitation dashboard, editing/sharing, RSVP list, moderated wishes, private manual gift-receipt review, and admin template/category/music APIs and screens. |
| Uploads | Local private disk storage and an R2 adapter; media ownership/type/size/completion checks, private drafts, publication-dependent image/music access, and owner-only receipts. This checkout uses local disk; R2 credentials are absent. |
| Database | PostgreSQL persistence, transactions, migrations, and embedded database tests. All 154 migration files are applied to the configured database; none are pending. |

## Payments

There is no implemented customer checkout, payment-provider callback, or paid-publication entitlement flow. Template prices are catalog data; displaying a price does not charge the customer. The local environment uses `PUBLISHING_MODE=free`. Other publishing modes fail closed in `apps/web/src/server/publication.ts` rather than enabling paid publication.

To‘yona supports displaying gift/card details and uploading a receipt for manual owner review. It does not transfer money or verify that a payment settled. Receipt AI screening was explicitly deferred and is not a release requirement for the existing manual workflow.

For a paid launch, implement provider integration, server-verified and idempotent payment callbacks, order/payment state, and entitlement checks before publication. A free launch can defer this work if the product clearly communicates free publication.

## Verification performed

| Check | Result |
| --- | --- |
| `pnpm dev` | Running on 127.0.0.1:3001. |
| `pnpm typecheck` | Passed. |
| `pnpm build` | Passed, including compilation, TypeScript, and page generation. This is a build check, not a deployed production-service check. |
| `pnpm test` | 628 tests: 545 passed, 83 failed; no skipped tests. |
| `pnpm test:publishing` | 21 tests: 20 passed, 1 failed; no skipped tests. Uses disposable fixtures in the configured PostgreSQL database and local HTTP server. The failed all-published-template field-preservation test expects a contacts object without the schema's newer `instagramUrl: ''` default (`tests/publishing.integration.ts:803`). It stops before proving every template's public-render assertion. |
| Main pages | `/`, `/preview`, `/studio`, `/dashboard`, and `/admin` returned HTTP 200. A dashboard/admin HTML shell returning 200 does not grant access to its protected data. |
| Public APIs | Catalog/music/session endpoints returned HTTP 200. Anonymous session reports `user: null, configured: true`. |
| Access checks | Anonymous invitation/admin/upload requests returned 401. Invalid Telegram Mini App launch data and a webhook request without the secret returned 401. |
| Telegram read-only checks | Bot token and username valid; webhook exists, zero pending updates, and no reported last delivery error. No messages were sent and no updates were consumed. This does not prove that webhook serves this local checkout or shares its database. |
| Browser interaction | In-app browser automation timed out. Fresh visual, mobile, accessibility, and human Telegram-login verification were not completed in this audit. |

Passing publishing integration checks cover authentication/origin/ownership/revision guards; atomic and concurrent free publication; archival and draft deletion; slug collisions/case sensitivity; timezone/DST deadlines; incomplete/retired/paid-mode rejection; media ownership/readiness; photo/music upload and public/private access; audio byte ranges; receipt privacy, deduplication and manual review; RSVP replacement and wish moderation; private-template draft save/reopen; and a full HTTP save → publish → public page → reopen → permitted-edit cycle. These checks use synthetic authenticated sessions and do not perform a human Telegram sign-in.

## Release blockers and remaining work

1. **Repair the release checks and investigate template regressions.** The 83 unit failures include contact-object assertions that omit the newer `instagramUrl` default, source byte/line-ending differences, stale fixture/artwork hashes, outdated renderer/source assertions, catalog release-state expectations, and a test referencing absent `0123_register_fairy_template.sql`. These are not 83 independently proven user-facing defects. Reconcile each with intended behavior and verify actual missing/broken assets rather than merely rewriting assertions or marking the failures harmless.
2. **Set up notification delivery independently of Telegram polling.** Wishes enqueue database jobs, but the only runner found is the localhost polling script. It refuses to run when a webhook is configured, and this bot already has a webhook. Two wish-notification jobs were queued at the read-only audit snapshot. Production needs an independently scheduled/supervised worker and delivery monitoring.
3. **Fix the notification retry cap.** `apps/web/src/server/jobs/wish-notification.ts:72` selects only `id,payload`, then casts the rows to include `attempts`. At line 110, `job.attempts >= 12` therefore compares `undefined` and never enforces the attempt limit for transient errors. Return/read the incremented attempt count and verify exhaustion/recovery before relying on production notifications.
4. **Choose durable production media storage and verify recovery.** The current local disk works for local development. For Vercel, configure and exercise R2; local mode is explicitly refused there. For self-hosting, use a persistent private disk and back it up with PostgreSQL. Verify real upload/download/range/privacy behavior in the chosen deployment, storage CORS where applicable, and abandoned-upload cleanup.
5. **Verify production authentication and Mini App flows.** Configure the real HTTPS application origin/webhook, verify Telegram delivery targets the deployed app/database, and run first-time phone onboarding, returning login, logout/session expiry, and Mini App launch on actual Telegram clients. Credential checks and synthetic sessions do not substitute for these steps.
6. **Add a repeatable deployment and operations process.** No repository CI workflow was found. Add required checks, controlled migrations, staging verification, rollback instructions, monitoring/error reporting, health checks, database/media restore drills, a job scheduler, and cleanup/retention for expired authentication/rate-limit/update records. Production load/capacity was not measured. Public assets currently total approximately 405.5 MiB across 3,039 files, so verify hosting limits, transfer size, cache behavior, and mobile loading performance.
7. **Implement billing before charging customers.** The free publication path is separate from catalog prices. Checkout and entitlement are required for a paid launch.

Additional unfinished product work includes personalized guest-link creation/export, venue autocomplete, and release QA for private templates. Guest-token resolution/rendering exists, but a complete owner-facing guest-link generation/export workflow was not found. These can be deferred if excluded from launch scope.

## Scope

This audit does not deploy the app, enable payments, change catalog publication, send Telegram messages, or install a persistent production worker. The publishing integration suite creates only its disposable fixtures and has scoped teardown. Application behavior was reviewed without implementing fixes.
