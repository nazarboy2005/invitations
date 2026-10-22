# Implementation status — 2026-10-22

## Current state

- The project is an Uzbek-first invitation creation and publishing platform built with Next.js, TypeScript, React, and a pnpm workspace.
- Homepage redesign (2026-10-22): ivory/gold/charcoal styling, locally hosted display/calligraphy/body fonts, layered real template previews, responsive catalog, creation guide, feature section, FAQ, and footer are implemented. Empty catalog categories are omitted from filters. Invitation renderer designs are unchanged by the homepage redesign.
- Scroll/editor refinement (2026-10-22): the homepage has desktop wheel inertia, and the shared sticky header hides on downward scrolling and returns on upward scrolling. Touch/reduced-motion fallbacks remain native. The creator workspace now has shared platform typography, clearer four-step navigation, improved language/input/upload/option styling, a sticky save toolbar, and responsive real-renderer preview. These UI changes do not implement invitation publication.
- The local development app runs at `http://127.0.0.1:3001`. The configured database has 43 published templates, including Evelina and Aurelia. Its applied Invitate migrations use their original recorded filenames (`0077_add_evelina_template.sql`, `0078_publish_evelina.sql`, `0080_add_aurelia_template.sql`, and `0081_publish_aurelia.sql`); retain these names because the migration runner tracks exact filenames. Credentials stay local. The typed fallback currently exposes 37 published designs.
- Customer publication is implemented: authenticated save-before-publish, validation, exactly six Base62 characters, atomic free publication/audit/identity locks, timezone-aware event-day editing deadline, idempotent retries, and copy/open links in the editor/dashboard. `PUBLISHING_MODE=free` is configured. No custom domain is required for local links.
- Follow-up usability correction: after Telegram confirms identity, show the account separately and an explicit **Nashr qilishni yakunlash** / **Saqlashni yakunlash** action with next-step instructions. Do not make the user's name look like the only action. Anor's public renderer also initializes on hydration, covering iframe loads that finish before React's load handler attaches.
- When `DATABASE_URL` is absent, `apps/web/src/server/catalog.ts` uses the published entries in the typed contracts catalog. When PostgreSQL is configured, its rows determine which known templates appear and their publication, price, category, and event-compatibility values.
- There are 34 renderer folders in `apps/web/src/templates` and 49 directories in `apps/web/public/templates`. These counts include work at different implementation stages and shared assets; they are not counts of published designs.
- The repository includes an editor, browser draft recovery, dashboard, four content locales, template catalog and previews, public invitation rendering, RSVP and guest-wish APIs, Telegram authentication/session foundations, PostgreSQL migrations, R2 upload adapters, and admin foundations for templates, categories, and music.
- Reference captures are under `../Templates/Invitations - this folder will be removed from production`. An ignored local junction at the former in-project path supports existing fidelity tests. Captures are not needed to run the app and were not edited.

## Implemented foundations and limits

Browser drafts can be created and recovered without service credentials. Cloud draft persistence uses revision-aware APIs and requires PostgreSQL. Telegram account flows, media uploads, admin operations, and the database-backed catalog also require their configured services. The app does not provide a fake development user or authentication bypass.

The typed invitation contract, database schema, and template adapters cover shared invitation fields and event compatibility. RSVP and wish submission endpoints exist, with public wish visibility controlled by approval. The presence of a route or adapter does not mean its external-service workflow is fully verified.

## Remaining or incomplete end-to-end work

- Payment checkout and paid publication entitlement are later work, not prerequisites for the current free-publication milestone.
- Complete Telegram Mini App launch/bootstrap experience and deployment webhook verification (the user has confirmed website login/contact sharing).
- Personalized guest-link creation and export.
- Venue autocomplete.
- Durable Telegram notification delivery worker (the owner inbox, RSVP list and wish moderation now work on the website).
- Receipt AI screening is explicitly deferred by the user. Private image/PDF receipt uploads and manual owner review are implemented.
- Real R2 transfer verification; its credentials have not been provided. PostgreSQL publication and localhost HTTP behavior have been exercised using disposable test accounts, without a development login bypass.
- Production deployment.
- Template-specific integration and release checks for designs still marked unpublished in the catalog. See [`templates/TEMPLATE_ROADMAP.md`](templates/TEMPLATE_ROADMAP.md) and [`../apps/web/src/templates/README.md`](../apps/web/src/templates/README.md).

## Local setup requirements

Node.js 22+ and pnpm 11.25.0 are specified by the project. Run `pnpm install` and `pnpm dev` from this directory. No `.env.local` file is needed for the local editor and fallback catalog. Copy `.env.example` to `apps/web/.env.local` only when configuring database, Telegram, R2, or admin features. Do not commit credentials.

The publication work includes related tests and a production build; see [`PUBLISHING_VERIFICATION.md`](PUBLISHING_VERIFICATION.md) and [`EDITOR_INPUT_AUDIT.md`](EDITOR_INPUT_AUDIT.md) for results and remaining checks. Disposable test media is uploaded locally and removed after integration checks. No deployment, paid transactions, or Telegram messages are performed by these checks. The user previously confirmed successful human Telegram login/contact sharing.

The 2026-10-22 editor/publication audit adds local authenticated uploads, byte-range audio reads, checks for missing files at publication, private manual receipt uploads, duplicate detection, owner activity and moderation, RSVP replacement, and shared optional-section adapters. Local storage is never selected implicitly in production and is refused on Vercel. Images/music remain private before publication; receipts remain private afterward. Required optional values (music selection, program time/title, map URL, contacts, card number, RSVP deadline) are validated with editor-step errors.

For the 2026-10-22 homepage redesign, `pnpm typecheck` passed. The homepage was
reviewed in the browser on desktop and at 390px/320px widths, including the hero,
catalog, lower sections, FAQ interaction, and footer. Browser diagnostics showed
no warnings or errors. No automated tests or production build were run for this
visual update.

For the scroll/editor refinement, `pnpm typecheck` passed. Browser review covered
desktop editor steps, 390px/320px forms, mobile preview switching, the narrow
calendar, and header hide/reveal behavior. The page's Lenis smoothing state and
header direction attributes were inspected during actual scrolling. No automated
tests or production build were run for this UI refinement.

## Dashboard previews and shared navigation (2026-10-22)

- Dashboard cards show the real template opening with the invitation's own content in silent, noninteractive thumbnails. Compact side-by-side cards retain editing, sharing, and owner activity links.
- Saved invitations and browser drafts are combined and sorted newest-created first; database creation dates are authoritative for saved invitations. Browser drafts now retain their creation time; legacy drafts fall back to their available save timestamp.
- Homepage, catalog, and dashboard use the same shared floating header, navigation links, typography, and scroll behavior. The studio keeps its dedicated toolbar.

- The latest source-backed releases are Muhr, Doira, and Qatlam. Their live catalog state and authenticated save/publish/public-render/reopen flows are verified. Bulbul, Parda, Ganch, and Yangi Uy remain unpublished because the original source ZIP lacks faithful opening preview images; the supported visible-window check found no browser window for capture.
- Current full unit suite: 396/421 pass; 25 source-parity assertions fail across previously packaged templates after restoring original capture files. The four remaining Marxaba packages pass their focused source/contract suites (28/28), the queued registration/migration check (1/1), and shared Emotional Piano/catalog-music check (1/1); web typecheck and production build pass. The ChatGPT in-app browser transport currently returns `Transport closed`, so fixture-rendered preview capture and browser release checks remain queued. Chorlove's 28 captured preview pages are source snapshots with embedded example data; they still need individual shared-contract adapters and local service mappings before they can be considered dynamic or published.

- 2026-10-22 Bulbul release: additive migration `0083_publish_bulbul.sql` is applied. Configured PostgreSQL and `/api/catalog` verify Bulbul published with the canonical browser-capture art and expected wedding/event mappings. Four-locale save/publish/public-render/reopen integration passed 1/1; generated test users were cleaned up. The authorized Telegram notice was delivered. No external deployment was performed.

- 2026-10-22 Parda release: applied `0084_publish_parda.sql`. Configured PostgreSQL and `/api/catalog` verify Parda published with canonical capture and expected event mappings. The in-app browser verified Uzbek Cyrillic, 390px fit, and reduced-motion opening; configured four-locale release integration passed 1/1. Telegram notice delivered after verification. A previously pending, unrelated Velvet Royale publication migration was also applied in that run; the Velvet row was immediately reset to unpublished and `/api/catalog` confirmed it absent. Its migration remains recorded as applied; any future Velvet publication needs a new migration number.

- 2026-10-22 Ganch release: additive migration `0085_publish_ganch.sql` is applied. Configured PostgreSQL and `/api/catalog` verify its published catalog row, canonical browser-capture art, and wedding/fotiha/qiz-bazmi support. In-app browser confirmed 390px fit, English, and reduced-motion opening. Configured four-locale release integration passed 1/1; test data was cleaned. Telegram notice delivered after catalog verification.

- 2026-10-22 Yangi Uy release: additive migration `0086_publish_yangi_uy.sql` is applied. Configured PostgreSQL and `/api/catalog` verify Yangi Uy published with its canonical browser-capture image and yangi-uy/osh mapping. The in-app browser confirmed 390px fit, English, and reduced-motion opening. Configured four-locale save/publish/public-render/reopen integration passed 1/1; test data was cleaned up. Telegram notice delivered after catalog verification.


- 2026-10-22 Cloud Castle (Chorlove) release: additive migration `0088_publish_cloud_castle.sql` is applied; configured PostgreSQL and the approved in-app catalog verify its published wedding mapping and browser-captured artwork. Focused checks pass 4/4, typecheck and production build pass, and the authenticated four-locale save/publish/public-render/reopen integration passes 20/20. Telegram notice delivered after verification; no external deployment.
