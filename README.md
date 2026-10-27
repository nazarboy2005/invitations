# Taklifnoma

Modular Next.js / TypeScript invitation platform. The application is separate from the reference captures; `Invitations - this folder will be removed from production` is not required to run it.

## Run locally

Requires Node.js 22+ and pnpm.

```powershell
pnpm install
pnpm dev
```

Open http://127.0.0.1:3001. The editor and browser draft recovery run without credentials. Account saving, authentication, uploads, and administration require PostgreSQL and a real login. Local uploads use private disk storage; R2 is optional for local development. There is no authentication bypass.

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
- Telegram: set `APP_URL`, bot token/username, a random `SESSION_SECRET` of at least 32 characters, and a distinct `TELEGRAM_WEBHOOK_SECRET`. Production uses an HTTPS webhook at `APP_URL/api/telegram/webhook` with Telegram's `secret_token`. For localhost, `pnpm telegram:poll` forwards Telegram updates to the local webhook handler without requiring a public domain. It refuses to replace an existing webhook; run only one poller per bot. `pnpm telegram:poll --check` checks credentials/delivery configuration without consuming updates or sending messages. An existing remote webhook can serve local login only if its application uses the same database and webhook configuration. Login retains browser binding, explicit confirmation, and mandatory own-contact phone sharing. The full Mini App launch/bootstrap UX is later work. See [Telegram's delivery API](https://core.telegram.org/bots/api#getupdates).
- Publishing: `PUBLISHING_MODE=paid` requires a verified Nodze/Click purchase for the invitation and template. Configure server-only `NODZE_API_KEY`, `NODZE_WEBHOOK_SECRET` and the registered return/webhook URLs; see [`docs/PAYMENTS.md`](docs/PAYMENTS.md). All current template prices are temporarily 1,000 UZS for user testing. Explicit `PUBLISHING_MODE=free` retains free publication. Existing public links remain valid.
- Platform admin: list permitted Telegram IDs in `PLATFORM_ADMIN_TELEGRAM_IDS` before those accounts first onboard. Existing users are not silently promoted/demoted on environment changes; use a controlled database operation for existing assignments.
- Media: without R2, development uses local disk. Set `MEDIA_STORAGE=local` and an absolute `LOCAL_MEDIA_DIR` outside `public/` for a stable folder. The current machine stores files under ignored `.data/media`. Back up this folder together with PostgreSQL; database metadata alone cannot restore files. Local files pass the same ownership, type, size, completion, and publication checks as cloud files. Images/music support up to 15 MB; receipts accept JPG/PNG/WebP/PDF up to 5 MB.
- R2: set `MEDIA_STORAGE=r2` and account/key/secret/bucket. Configure bucket CORS for the exact application origin, PUT/GET/HEAD, and Content-Type. Creator uploads use five-minute presigned PUT URLs. Draft files stay private; published images/music are anonymous only while referenced by a published invitation. Receipts always remain owner-only. Configure abandoned-upload cleanup before production. Vercel refuses local storage; a self-hosted production server may explicitly use local storage on a persistent disk. Receipt uploads currently pass through the app; a serverless host's request-size limit may be lower than the app's 5 MB cap.

Recommended Vercel project root: `apps/web`; install the pnpm workspace and build with `pnpm --filter @taklifnoma/web build`. Set environment variables in Vercel and use a pooled PostgreSQL connection. Deployment and production service verification are separate from this local implementation.

## Current implementation

The product is an Uzbek-first invitation editor and catalog. Its platform interface uses white surfaces, pomegranate actions, charcoal text, selective blush highlights, and small decorative gold details; invitation templates retain their own reference designs. It includes a modular studio and dashboard, four invitation-content locales, browser draft recovery, template previews, public invitation pages, RSVP and moderated-wish APIs, Telegram authentication foundations, PostgreSQL persistence and migrations, R2 upload adapters, and admin catalog/category/music tools.

The homepage uses a white/pomegranate editorial invitation layout with a prominent catalog action, locally hosted calligraphy accents, real design previews, a responsive catalog, a creation guide, feature details, and an FAQ.

The homepage has light desktop wheel smoothing, native phone/tablet momentum, and a sticky header that hides/reappears with scroll direction. Form controls, nested scroll areas, and reduced-motion preferences retain native behavior. The creator workspace shares the platform typography, with a four-step form, larger inputs, compact language controls, a sticky save toolbar, and responsive live preview. Catalog category changes use a brief fade and 6px entrance without animating the full grid height; reduced motion switches instantly. Full-width portrait cards show captions over a bottom gradient and open a price/action dialog with a real template inside a phone mockup; on phones this is a partial-height bottom sheet. One silent live preview plays at a time; touch playback waits for scrolling to settle. Covers and selected renderers load on demand, and catalog embeds hide scrollbar chrome.

The application source currently has 32 renderer folders under `apps/web/src/templates`. They are at different stages: some are complete and published, while others are still being integrated or reviewed. Folder presence does not make a design selectable. Without `DATABASE_URL`, the app uses its typed local fallback catalog; that fallback currently exposes 10 published templates. With PostgreSQL configured, the database controls publication, prices, categories, and supported event types.

Drafts can be edited and recovered in the browser without external credentials. Cloud saving, account login, media upload, and database-backed catalog administration need their corresponding services configured. No development sign-in bypass is provided.

Customer publishing is implemented: **Nashr qilish** saves current content, resumes after the existing Telegram login when needed, and validates enabled languages/date/venue/media. Paid mode sends the owner through Nodze/Click checkout and publishes after server verification; explicit free mode publishes immediately. The server generates exactly six case-sensitive Base62 characters, e.g. `/i/aB3xY9`; the editor and dashboard expose copy/open controls. Publication records identity locks and an editing deadline at the end of the event day in its timezone. Retries keep the same link and timestamps. Drafts remain private; ordinary saves cannot publish or replace the code. No custom domain is required for local use. Sharing with other people requires a reachable app origin. See [`docs/PAYMENTS.md`](docs/PAYMENTS.md) and the original [`docs/INVITATION_PUBLISHING_PLAN.md`](docs/INVITATION_PUBLISHING_PLAN.md).

The dashboard's **Javoblar, tilaklar va cheklar** link opens RSVP responses, wish approval/hiding, and private receipt review. Changing an RSVP from the same browser updates the previous response. Receipt uploads have no AI screening or automatic payment verification; the owner checks their account and marks received/problem manually. Disabling receipts stops new uploads and preserves existing private files.

Nodze/Click checkout, signed webhook fulfillment, authenticated status recovery, paid publication entitlement, a neutral return page and read-only online admin payment records are implemented. Setup and verification details are in [`docs/PAYMENTS.md`](docs/PAYMENTS.md). Payment tests use mocked providers only; no real checkout is attempted. Live use still requires deployment, project credentials/destination registration and reconciliation scheduling.

Remaining product work includes the complete Telegram Mini App launch experience, personalized guest-link creation/export, venue autocomplete, durable Telegram notification delivery, production deployment/configuration, and real R2 transfer verification. The user explicitly deferred receipt AI screening. External image links depend on their host's continued availability.

Schema tests use PGlite. `pnpm test:publishing` additionally runs disposable PostgreSQL and localhost HTTP fixtures using `apps/web/.env.local`; start `pnpm dev` first. It never calls Telegram messaging APIs and removes its generated database fixtures afterward. Human Telegram login and real R2 transfers are separate live checks. The current release/check results are in [`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md), [`docs/PUBLISHING_VERIFICATION.md`](docs/PUBLISHING_VERIFICATION.md), and [`docs/templates/TEMPLATE_ROADMAP.md`](docs/templates/TEMPLATE_ROADMAP.md).

Read `IMPLEMENTATION_DECISIONS.md` before changing product behavior.

The homepage features eight curated published designs, followed by a visual explanation of invitation features, the three creation steps, FAQ, and a final invitation to create. `/templates` is the full published catalog with search, categories, and the existing preview/action dialogs. Legacy `/preview` list visits redirect there; individual template-preview URLs continue to work. The Why us illustration is static sample content and does not load an additional live renderer.
