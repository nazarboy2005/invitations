# Click publication payments through Nodze

The customer selects a design, edits, authenticates with Telegram, saves, and
presses **To‘lash va nashr qilish**. The backend reads the database price,
reserves one invitation/event, persists an immutable order/request, and calls
Nodze. The customer follows the returned Click checkout URL. Verified success
automatically publishes and exposes the existing six-character invitation link.
No card information enters this application. Guest to‘yona remains separate.

## Deployment configuration

Apply `pnpm db:migrate` against the intended database. Migrations 0160/0161 add
online orders/webhook deduplication and set existing template prices to 1,000
UZS. Fallback catalog prices match. This is intentionally test pricing; adjust
prices through platform administration later. Existing orders keep their price.

Set these server environment variables privately in Vercel (and locally when
using a publicly reachable HTTPS development deployment):

```dotenv
APP_URL=https://invitations-wk6h.vercel.app
PUBLISHING_MODE=paid
NODZE_API_BASE_URL=https://payments.nodze.org/api/v1
NODZE_API_KEY=<project key>
NODZE_WEBHOOK_SECRET=<registered endpoint secret>
CRON_SECRET=<random secret of at least 32 characters>
```

Keep the existing authentication/database/media configuration. There are no
`NEXT_PUBLIC_` payment secrets. Missing credentials deny checkout and preserve
the draft. Existing free publications keep their URLs. Local setup retains its
existing localhost `APP_URL`; real Nodze requires registered public HTTPS URLs.
Do not replace the local auth origin with the production origin just to test.

In the Nodze project register:

| Setting | Exact value for the current Vercel hostname |
| --- | --- |
| Return URL, used for both successUrl and cancelUrl | `https://invitations-wk6h.vercel.app/payment/return` |
| Backend webhook | `https://invitations-wk6h.vercel.app/api/webhooks/nodze` |
| Frontend origin, if requested | `https://invitations-wk6h.vercel.app` |

Enable the project and Click, ensure 1,000 UZS is within its amount limits, and
deploy this application before customer testing. The webhook must be reachable
without deployment-protection/login redirects. Click's own callbacks remain on
Nodze, not this app. No real checkout is needed to deploy the code.

Schedule authenticated GET `/api/internal/payments` about every minute using
`Authorization: Bearer <CRON_SECRET>`. It reconciles up to ten due orders per
invocation, oldest first. Select a scheduler compatible with the hosting plan.
Do not use the browser or an in-process timer as the only reconciliation worker.
The webhook works independently of the return page. Owner return-page status
checks provide an additional recovery path. Logs should be monitored for failed
reconciliation; do not assume an uncertain request means the customer did not pay.

Published invitation URLs are `APP_URL/i/<six case-sensitive Base62 characters>`.
The dashboard and studio expose the link. `/payment/return` shows backend status,
copy/open controls and a link back to the saved draft. URL query parameters cannot
confirm payment. When multiple orders exist the owner can select the intended one.

## Invariants

- Integers/BigInt and preserved JSON amount source text avoid float computation.
  100,000 minor units becomes JSON number `1000.00` soums.
- Owners cannot supply an authoritative amount. Their displayed expected price
  is compared with the database, and a mismatch stops checkout.
- Retry the original persisted request/key after ambiguity. No automatic new
  payment, automatic expiry or provider refund is performed.
- Pending/processing/rejected/successful orders bind template, event, names,
  date/timezone and enabled languages. Practical content edits remain allowed.
- Raw-body HMAC, timestamp window, event/header ID, exact amount/currency/payment
  identity and transactional unique event handling precede fulfillment.
- Cancellation/rejection events consult authenticated current state. Rejection
  can later succeed; out-of-order responses cannot downgrade success.
- Success persists even when publication validation fails. Correct details and
  retry publication without charging again. An archive does not trigger refund.
- Online payment records appear read-only in admin alongside the manual register.
  Manual changes cannot grant paid entitlement. Payment history blocks deletion.
- Project traffic is locally capped at 100/minute, below Nodze's 120/minute limit;
  per-order lookup cooldown is 30 seconds. Nodze 429 responses back off 60 seconds.

## Verification without real payments

```powershell
pnpm test:payments
pnpm test:payments:http
pnpm typecheck
pnpm build
```

The first command uses disposable PostgreSQL fixtures with every network call
intercepted. The HTTP suite starts a separate Next server on loopback port 3102
and a loopback Nodze stub, with isolated mock credentials/build output. It tests
actual auth/origin guards, checkout, signed webhook/redelivery, return-page
forgery resistance, publication, public rendering and stable links. Both suites
remove their fixture data and never contact real Nodze, Click or Telegram APIs.

The existing fresh-database replay suite currently fails earlier, at migration
0141, because the repository history lacks Orchid Amplop's required registration
and category/event rows. This predates the payment migrations; the configured
database already has that catalog state. Reconstructing missing historical
template migrations is separate from payment verification.
