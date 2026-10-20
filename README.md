# Taklifnoma

Modular Next.js / TypeScript invitation platform. The application is separate from the reference captures; `Invitations - this folder will be removed from production` is not required to run it.

## Run locally

Requires Node.js 22+ and pnpm.

```powershell
pnpm install
pnpm dev
```

Open http://127.0.0.1:3001. The editor and browser draft recovery run without credentials. Cloud saving, authentication, media uploads, and admin operations require real configured services. There is no fake signed-in user or development authentication bypass.

```powershell
pnpm typecheck
pnpm test
pnpm build
```

## Structure

```text
apps/web/src/app/          Next.js pages and thin API routes
apps/web/src/modules/      Studio, dashboard, administration
apps/web/src/templates/    Independent invitation renderers/styles
apps/web/src/server/       Auth, invitation service, catalog, media adapters
packages/contracts/       Shared schemas, data contracts, lifecycle policies
packages/database/        PostgreSQL connection and versioned SQL migrations
tests/                    Auth, schema and lifecycle tests
```

Invitation content is independent from its design. Language variants reuse shared event/program/media identities. Server revision checks reject stale whole-document saves.

## Connect the services

Copy `.env.example` to **`apps/web/.env.local`** and fill values privately. Never commit credentials.

- PostgreSQL: set `DATABASE_URL`, then run `pnpm db:migrate`. Startup does not automatically change a live database.
- Telegram: set `APP_URL`, bot token/username, a random `SESSION_SECRET` of at least 32 characters, and a distinct `TELEGRAM_WEBHOOK_SECRET`. Configure the bot webhook to `APP_URL/api/telegram/webhook` using Telegram's `secret_token`. Local live testing needs a trusted HTTPS development URL. Login uses browser-bound requests, explicit confirmation, and mandatory own-contact phone sharing. The Mini App exchange endpoint exists; full launch/bootstrap UX is a later integration step.
- Platform admin: list permitted Telegram IDs in `PLATFORM_ADMIN_TELEGRAM_IDS` before those accounts first onboard. Existing users are not silently promoted/demoted on environment changes; use a controlled database operation for existing assignments.
- R2: set account/key/secret/bucket. Configure bucket CORS for the exact application origin, PUT/GET/HEAD, and Content-Type. Browsers upload through five-minute presigned PUT URLs; completion checks byte size/type signature. Media is anonymous only when an exact current reference of a published invitation. Receipt media is a separate future private pipeline. Configure abandoned-upload cleanup before production.

Recommended Vercel project root: `apps/web`; install the pnpm workspace and build with `pnpm --filter @taklifnoma/web build`. Set environment variables in Vercel and use a pooled PostgreSQL connection. No deployment has been created.

## Current milestone

Implemented foundation: cream interface, modular editor/dashboard, four content languages, per-document/account browser recovery, optimistic save revisions, database/auth/session foundation, draft save/reopen APIs, direct R2 upload adapters, admin template pricing/category/retirement foundations, and public RSVP/wish APIs with approval-only visibility. There are currently **no installed invitation designs**. The provisional starter designs and their app artwork have been removed; captured references remain in the local reference folder and are not production templates.

Creators can prepare template-free drafts and choose an installed design later without re-entering their data. Publishing requires a real selected template. Platform admins can create/rename categories and assign each future template to multiple categories or none. Apply migrations through `0003_remove_provisional_templates.sql` with `pnpm db:migrate` on configured databases.

Not yet integrated end-to-end: exact reference template renderers, payment checkout/publication entitlement, Mini App launch UX, personalized guest-link creation/export UI, venue autocomplete provider, creator wish inbox/notification worker, receipt AI/fallback, and production deployment. Unfinished provider operations are not reported as successful in the UI.

Schema tests run against PGlite's embedded PostgreSQL engine. Hosted PostgreSQL, Telegram, and R2 still need live integration tests with credentials.

Read `IMPLEMENTATION_DECISIONS.md` before changing product behavior.
