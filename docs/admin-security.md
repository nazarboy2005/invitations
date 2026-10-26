# Administrator workspace

`/admin` is protected on the server. Its address is not a credential. Sign in
through Telegram. Admin access comes from a trusted `users.is_admin` database
grant or the server-side `PLATFORM_ADMIN_TELEGRAM_IDS` allowlist for new and
existing accounts. Users cannot grant themselves that role through a request.
Authorized accounts see **Boshqaruv** in the account navigation.

## Assigning administrator access

Set this in `apps/web/.env.local` for local development, or in the hosting
platform's server environment settings:

```dotenv
PLATFORM_ADMIN_TELEGRAM_IDS=123456789,987654321
```

Use the accounts' **numeric Telegram user IDs**, not usernames, phone numbers,
chat/group IDs or website account UUIDs. IDs are matched exactly after verified
Telegram login; ordinary users cannot claim an ID through a request. Commas or
whitespace separate IDs; duplicates are ignored. Invalid IDs/configuration deny
authorization rather than accepting a partial list. An empty list adds no
environment-based administrators. Never prefix this variable with `NEXT_PUBLIC_`
or expose it through client configuration.

Restart/redeploy **every web, Telegram and broadcast worker process** after an
environment change. Existing signed-in accounts are checked on subsequent
requests, so an existing account does not need to be recreated. The usual phone
verification, suspension and 12-hour admin reconfirmation rules still apply.

Environment grants are not copied into `users.is_admin`. Removing an ID removes
that source of access when every process has reloaded configuration. A separate
database grant (`users.is_admin=true`) continues to grant access and must be
revoked separately by trusted database administration. The previous bootstrap
implementation stored allowlisted new users as database admins; those existing
grants also require an explicit database revocation. This implementation does
not alter any existing account's database role.

The browser dashboard does not edit server environment variables or grant roles.
Deployment operators manage this allowlist using the hosting provider's access
controls.

Opening `/` or `/dashboard` automatically resolves the server session, even
without the SDK. For Telegram launches, the client passes the SDK's opaque signed
data, or recovers the same payload from `tgWebAppData` in the URL fragment. The
server validates the signature and reconciles it with the current browser
session: a different Telegram account cannot inherit another account's cookie
or server-rendered navigation. Verified admins enter `/admin`
using a full document navigation, so the privileged page loads its own CSP and
excludes the remote SDK. Existing sessions are not silently renewed: an admin
session older than 12 hours still goes to `/admin/verify`. Login exchanges share
in-flight work to avoid consuming the same launch twice when the SDK and account
page initialize together. Phone verification and server role checks remain
required; unsigned Mini App identity fields never grant access. Older signed
launch data is accepted only to identify its matching already-authenticated
session; it cannot create a new login, switch identity or renew admin access.
Fresh launch fingerprints remain single-use for creating a session in a new
browser, while repeated requests from the matching authenticated browser retain
the original session and authentication time.

In the bot, `/admin` replies privately with **Boshqaruvga kirish** for an active,
phone-verified administrator. Recognized admins also see that button after
`/start`. These buttons open `/dashboard`, where authentication precedes the
admin redirect. Ordinary accounts receive a permission denial with only their
own Telegram ID. The command grants no roles and sends nothing until a user
invokes it.

The account heading and mobile homepage menu show **Boshqaruv** for recognized
admins. **Hisobga qaytish** opens `/dashboard?mode=personal`, allowing admins to
use their own creator account without immediately redirecting back. Invitation,
editor, catalog and guest-response deep links retain their intended destination.
On phones, the admin top bar also offers **Shaxsiy hisob** for this return.

## Management tools

- **Users:** searchable, paginated account lists and details, invitation/payment
  links, suspension/restoration and session revocation. Suspension also blocks
  Telegram authentication/actions. Restoring an account requires a new login;
  it never revives a revoked session. Administrators cannot suspend themselves
  or change roles from this interface.
- **Invitations:** search by owner/status, open/copy actual public links, create
  drafts for a user, edit/publish through the real creator editor, upload media,
  review RSVP/wishes/receipts, moderate wishes, archive publications, and delete
  drafts without financial history. Editing on behalf of a user requires an
  explicit scoped header, a fresh admin session and a reason. The server resolves
  the original owner; the actual admin is recorded in audit history. Ordinary
  requests retain owner-only access. Admin editing does not write private content
  into browser draft recovery storage.
- **Payments:** an explicitly labeled **manual register**, separate from guest
  gifts and receipts. Admins set pending amounts, record received/failed/cancelled
  payments or register refunds. Exact UZS minor units, immutable owner/template/
  currency snapshots, duplicate-request keys, revision checks and database
  transition rules protect history. Recording receipt/refund never transfers
  money, verifies a payment provider, or changes the approved free publishing
  policy. No live payment gateway is activated.
- **Templates:** activate/deactivate designs, change prices, assign multiple
  categories, manage category names/order and supported event types. Retiring
  an in-use design requires the existing compatible replacement flow; existing
  invitation content and event compatibility protections remain enforced.
- **Broadcasts:** compose Telegram messages for all eligible users, users with
  publications/drafts, or selected accounts. Draft creation freezes the eligible
  recipient set and sends nothing. The confirmation dialog shows the exact
  message, unsubscribe footer and recipient count. Confirmation queues delivery;
  cancelling stops remaining work but cannot recall sent or in-flight messages.

Creator identity locks, publication validation and editing deadlines apply to
the shared admin editor. An administrator can explicitly extend a publication's
editing deadline, with a reason and audit record; this does not change event
identity, ownership or historical payment snapshots.

## Broadcast operation

Delivery requires a verified, active private Telegram connection belonging to
the account, with no suspension or broadcast opt-out. `/stop` opts out;
`/subscribe` opts back in. Preferences survive subsequent bot interactions.
The worker checks recipient eligibility and the confirming administrator's
current role before claiming each message. Demotion/suspension cancels remaining
delivery. A single durable lease prevents concurrent workers from sending the
same pending recipient; recipient status/attempts survive process restarts.

Messages are plain text with link previews disabled. Batches contain at most
five messages with spacing between sends. Explicit Telegram throttling postpones
work and establishes a global cooldown. A blocked bot connection is marked
unavailable. Network timeouts, malformed responses and interrupted in-flight jobs
become **uncertain**, with no automatic retry because Telegram offers no send
idempotency key. Audit/delivery history exposes the outcome without logging bot
credentials. This avoids blind retries; it cannot prove delivery after a network
ambiguity.

While the admin stays on the broadcasts view, confirmed campaigns can be drained
in small authenticated batches. Background continuation can use one of:

- `pnpm telegram:broadcasts` processes one bounded batch;
  `pnpm telegram:broadcasts --watch` continues polling.
- A trusted scheduler may call `GET` or `POST /api/internal/broadcasts` with
  `Authorization: Bearer <CRON_SECRET>`. Configure a random server-only secret
  of at least 32 characters; missing/short configuration denies access.

Starting a worker or scheduling the endpoint sends **previously confirmed**
queued broadcasts. No scheduler is deployed and no real broadcast is sent by
the implementation/tests. Configure background execution operationally before
relying on delivery continuing after closing the admin page.

## Boundaries

- Every admin page checks the database session and role before reading private
  data or rendering client controls. Missing/revoked/expired sessions and
  ordinary accounts receive a 404. Authentication failures fail closed.
  Next.js may encode that 404 interrupt inside an HTTP 200 RSC stream; the
  unauthorized stream still contains no admin controls or private data.
- Every admin API handler independently uses the common guard. The database
  identity/role and server allowlist are evaluated each time. Removing a
  database-only grant or revoking a session applies to the next request;
  environment changes take effect once all processes reload configuration.
- Admin authentication lasts 12 hours from session creation. Sliding creator
  renewal does not extend this window. `/admin/verify` reuses browser-bound
  Telegram confirmation; the final exchange validates the same user and current
  role transactionally, consumes confirmation once, revokes the old session and
  issues a new opaque cookie. This is fresh Telegram confirmation, not a claim
  of independent MFA.
- Writes validate the exact configured `APP_URL` origin and reject cross-site
  fetch metadata. They share an atomic database limit of 30 attempts per admin
  per minute. Rejected attempts do not mutate catalog records.
- Strict request schemas, parameterized queries and bounded request readers
  protect inputs. Existing event compatibility, transaction locks and template
  retirement/replacement checks remain in force.
- Catalog audio uses the same fresh-role checks at preparation, local byte
  upload, completion and library insertion. Owner checks, byte signature/size
  validation, and sealing of R2 uploads remain enforced. Library insertion
  accepts only verified R2 or local platform music assets, never personal audio.
- Catalog mutations and their before/after audit records commit in the same
  transaction. Template replacement additionally retains its per-invitation
  audit records. The workspace shows the latest 50 administrative changes,
  displayed in the explicitly labeled Tashkent timezone.
- Admin responses prohibit caching/indexing/framing and use no-referrer policy.
  A fresh nonce authorizes scripts on every request. Production has no
  `unsafe-inline` or `unsafe-eval` script allowance; inline **styles** remain
  allowed for existing form components. R2 connections/media are restricted to
  the configured account/bucket hosts.
- Admin entry links load a fresh document, and the global Telegram Mini App SDK
  is excluded on admin routes. Reconfirmation uses the bot link without loading
  third-party JavaScript into the privileged workspace.

## Verification

Start the local app and run `pnpm test:admin`. The integration suite inserts
disposable accounts, sessions, categories and music, then removes its own rows
and local files. It does not call Telegram or edit existing catalog entries.
It tests unauthorized HTML/RSC requests, all API guards, revocation/demotion,
freshness, CSRF, request validation, transactional history, audio uploads,
reauthentication replay/account/browser boundaries, nonces, and concurrent rate
limiting. `pnpm typecheck` and `pnpm build` check integration with Next.js.

Allowlist unit checks are included in `pnpm test:admin`. The optional
`tests/admin-allowlist.integration.ts` check requires a local server and test
process configured with the same **disposable** ID in both
`PLATFORM_ADMIN_TELEGRAM_IDS` and `ADMIN_ALLOWLIST_TEST_TELEGRAM_ID`. It verifies
environment-only access, reconfirmation, no persisted grant, and worker
authorization/removal with a fake Telegram sender. It skips when the fixture ID
is omitted; never set the test fixture to a real account's ID.

Apply `0151_admin_audit_log.sql` and `0152_admin_management.sql` before deploying
this version (both applied to the configured database during local work). Missing audit
storage causes writes to roll back; it must never fall back to unaudited writes.
Keep the application database credential private and limit its privileges to
the necessary tables. No external deployment or credential rotation is performed
by this local implementation. Infrastructure configuration and independent
penetration testing are outside what these code checks establish.

### Local verification, 2026-10-27

- Follow-up launch fix: **20/20** focused unit/auth/allowlist checks and **5/5**
  local HTTP/bot checks passed. Browser verification used Telegram's actual SDK
  with signed disposable identities and URL launch parameters, covering blocked
  SDK loading, no launch data with an existing admin session, both directions of
  account switching, refreshed creator navigation, and unchanged stale-session
  age. No hydration/CSP errors or live Telegram sends occurred. The production
  build passed. The publicly deployed previous bridge was verified present;
  this follow-up addresses initialization/account-binding gaps rather than
  assuming an old deployment. Live user sessions and environment values were
  not changed.
- Mini App entry update: **18/18** focused session/auth/allowlist checks passed.
  Browser checks with signed disposable launch data verified delayed SDK loading,
  one exchange per launch, homepage/account auto-entry, no SDK in the privileged
  document, mandatory stale-session reconfirmation, personal-account return,
  visible phone controls, ordinary-user separation and preserved catalog deep
  links. No hydration/CSP errors or live Telegram sends occurred. Production
  build passed after correcting a catalog fallback expression's empty-string
  type. The broader catalog suite has an unrelated stale Shahzoda source-regex
  assertion expecting `getTemplatePreviewWishes(locale)` while the renderer now
  correctly passes its template ID; that assertion remains outside this update.
- Allowlist extension: **11/11** allowlist/admin-policy unit checks and **1/1**
  environment-only admin HTTP/worker check passed. Production build and
  typechecking passed, as did **16/16** existing admin HTTP/auth regression checks.
  No existing account roles or actual environment secrets
  were modified; no Telegram messages were sent.
- Existing admin suite: **18/18 passed**, including direct HTTP requests and
  concurrent write limits. New management unit/database checks: **6/6 passed**.
  Management HTTP checks: **9/9 passed**, plus **4/4** focused upload/worker/Telegram
  preference checks. Delivery is stubbed; fixtures are deleted after testing.
- Focused existing publishing/upload/receipt/RSVP regression checks: **6/6 passed**.
  Previous full publishing verification: **21/21 passed**.
- Browser checks include actual on-behalf editor saves retaining original
  ownership, no private browser draft recovery, manual payment creation and
  broadcast draft review without sending. Desktop/phone layout verification is
  recorded in `test-results/admin-management/`. All checked views fit at 1440px,
  390px and 320px without page overflow; no hydration/CSP errors or Telegram sends
  occurred in the final browser pass.
- Standalone typechecking and the full production build passed after management
  integration. A mobile table overflow discovered during visual checks was fixed
  by containing its visually hidden column label within the scroll region.
- The full database migration suite independently fails at existing migration
  `0141_publish_chorlove_orchid_amplop.sql`, before reaching the new audit
  migration. The isolated audit migration/rollback tests pass.
- In the earlier access-hardening pass, automatic approval review blocked launching another local production server
  without a specific reason. Production-mode policy tests passed; actual HTTP
  and browser checks used the development server. No external app deployment.
