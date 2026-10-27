# Nodze Payments integration guide

The dashboard guide is at [/admin/docs](https://payments.nodze.org/admin/docs). It includes the full
API walkthrough, copyable examples, troubleshooting, and downloads of this file and the backend
examples. The guide, schema and sample downloads require an administrator session; the owner can
download and share these files with an integrator without sharing a login or live credentials.

## Quick start

1. An owner creates a project, registers exact HTTPS return URLs and the backend webhook destination, and issues a scoped API key. Save the webhook secret when it is shown once. Enable the project and Click for that project after provider onboarding.
2. From the trusted business backend, calculate the order price from your product/order database. Reserve inventory or fulfillability **before** creating a payment. Never forward a browser-supplied amount as authoritative.
3. POST `/api/v1/payments` with `Authorization: Bearer YOUR_KEY`, `Content-Type: application/json`, and a stable `Idempotency-Key` for this operation. Keep the original body and key for network retries. Idempotency keys are 8-128 characters from letters, digits, `._:-`, scoped by project and operation, and retained without automatic expiry.
4. Save the returned internal `id` against your order and redirect the customer to `checkoutUrl`. Click has one return URL: this implementation uses `successUrl` as that neutral destination, validates `cancelUrl` too, and never infers success from either route.
5. Fulfill exactly once after a verified `payment.succeeded` event or authenticated GET `/api/v1/payments/{id}` confirming `SUCCEEDED`. Persist deduplication and order fulfillment in one local database transaction. Manual cancellation changes local records only. Provider refunds and reversals are disabled.

## API behavior

Owners can issue API keys that expire after 1–366 days (90 days by default) or choose **Never
expires**. A non-expiring key remains valid until revoked or rotated, and still stops working when
its project is disabled. Project settings and the credential inventory show the expiry and current
status. When rotating a key, choose either a replacement with a 90-day expiry or Never expires;
the form defaults to Never expires for an existing non-expiring key. Old credentials stop working
immediately after rotation. Only the hashed key is stored; save the secret when it is shown once.

Destination URLs must start with `https://`; `htts://` is a spelling error. A frontend origin is
only the scheme and hostname, such as `https://your-business.uz`. Return URLs and backend webhooks
may include the appropriate exact path. Surrounding whitespace is trimmed before registration.
Validation errors appear next to the URL field and retain the entered address and destination
type. Private network addresses, wildcard hosts, embedded credentials, fragments and custom ports
remain prohibited.

### Return page, webhook and origin examples

| Destination | Example route in your application | Purpose |
|---|---|---|
| Return URL | `https://your-app.vercel.app/payment/return` | Browser page that asks your backend for the actual payment status |
| Backend webhook | `https://your-app.vercel.app/api/webhooks/nodze` | Server POST endpoint that verifies signed events and updates the order database |
| Frontend origin | `https://your-app.vercel.app` | Registry entry for future browser features; does not enable CORS or authenticate API requests |

Implement these routes in your application first. Registration does not create them. Register
return URLs under the project, then send the same exact strings as `successUrl`/`cancelUrl` in
payment creation. The backend webhook is configured once per project, not sent with each payment.
One neutral return page may be registered and used for both return fields because Click uses one
browser return destination. Trailing slashes and query strings must match the registered value.
A Vercel server route can receive webhooks, provided it preserves the raw request body and does
not redirect to a login or deployment-protection page.

The platform owner separately registers Click's Prepare and Complete callback URLs:
`https://payments.nodze.org/callbacks/click/prepare` and
`https://payments.nodze.org/callbacks/click/complete`. Click calls Nodze; Nodze calls your business
webhook. Business integrations do not send requests to Click's callback routes.

Interactive docs at `/swagger-ui/index.html` and generated JSON at `/api-docs/project-api` require an administrator login. The checked-in `docs/openapi.json` can be shared with backend integrators without granting admin access. The project API itself never accepts admin cookies as project authentication. Do not embed API keys in browser apps or mobile clients. Browser origins are registered separately for future browser features; no cross-origin browser API is enabled in this version.

Amounts are exact decimal **soums (UZS)**, maximum 17 integer digits and 2 decimals. JSON clients should avoid binary floating point for financial computation. Dates are UTC. Creation returns 201 (including an idempotent retry), provider refund requests return 501. Every project query is scoped by its credential, including list and lookup. Missing and other-project resources both return 404. Lists use zero-based `page`, `size` 1-100 (default 25), and optional exact `status`. Query newest first. Retrying the same order with a new key returns 409 rather than creating a second payment.

Error bodies use `application/problem+json`: `status`, `detail` where applicable, and machine-readable `code`. Validation is 400, absent/expired/revoked keys 401, missing/cross-project data 404, idempotency/state conflicts 409, rate limit 429, provider operations disabled 501, unavailable provider 503. Framework validation errors may use the standard Problem Detail fields without a custom code. Rate limit: 120 requests per project per UTC minute. 429 responses include `Retry-After: 60`; wait before retrying with jitter. Do not retry 4xx blindly.

## Endpoint reference

The default deployment origin is `https://payments.nodze.org`. Set `NODZE_URL` to that origin,
without `/api/v1`. Every project API endpoint requires `Authorization: Bearer YOUR_PROJECT_KEY`.

| Method / path | Success | Purpose |
|---|---|---|
| GET `/api/v1/projects/me` | 200 | Project identity, currency, min/max amount and Click setting |
| GET `/api/v1/providers` | 200 | Configured provider capabilities, not a live bank availability check |
| POST `/api/v1/payments` | 201 | Create or retrieve the same idempotent checkout |
| GET `/api/v1/payments/{id}` | 200 | Current payment by its Nodze UUID, scoped to this project |
| GET `/api/v1/payments?page=0&size=25&status=SUCCEEDED` | 200 | Newest-first list; optional exact status; `{items,page,size,total}` envelope |
| POST `/api/v1/payments/{id}/refunds` | 501 | Provider operations disabled; owned resource checked, no Click request or financial state change |
| GET `/actuator/health` | 200 / 503 | Public aggregate health; no authentication required |

### Create-payment request

```sh
curl --fail-with-body -X POST "$NODZE_URL/api/v1/payments" \
  -H "Authorization: Bearer $NODZE_API_KEY" \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: create-INV-10001' \
  --data '{"orderId":"INV-10001","amount":50000.00,"currency":"UZS","provider":"click","description":"Digital invitation","successUrl":"https://your-app.vercel.app/payment/return","cancelUrl":"https://your-app.vercel.app/payment/return"}'
```

Replace example domains with exact registered URLs and calculate the price from your trusted order
database. Do not blindly copy a browser-provided amount.

| Field | Requirement |
|---|---|
| `orderId` | Required, nonblank, at most 120 characters, unique in the project |
| `amount` | Required exact decimal UZS soums; minimum 0.01; at most 17 integer digits and 2 decimals; project min/max also apply |
| `currency` | Required literal `UZS` |
| `provider` | Required literal `click` |
| `description` | Required, nonblank, at most 500 characters |
| `customerReference` | Optional internal reference, at most 120 characters |
| `successUrl` | Required, at most 2,048 characters, exact registered return URL; used as Click's neutral return |
| `cancelUrl` | Required, at most 2,048 characters, exact registered return URL; also validated |

The response contains `id`, `orderId`, `amount`, `currency`, `provider`, `status`, `description`,
`customerReference`, `createdAt`, `completedAt` and `checkoutUrl`. Save `id` against your own order
before redirecting to the actual returned checkout URL. Creation normally returns PENDING and a
null `completedAt`. Checkout URL can be null in subsequent states or when Click is unavailable.
Use the Nodze UUID, not your order ID or Click's transaction number, for payment lookup.

`GET /api/v1/projects/me` exposes `id`, `name`, `currency`, `minAmount`, `maxAmount` and
`clickEnabled`. Provider capability objects contain `code`, `available`, `hostedCheckout`,
`fullReversal`, `partialRefund` and `invoices`. Both platform and project enablement must be ready.

### Recover from an uncertain request

Keep one idempotency key and the original body for each logical create operation.
Same key/body returns the existing result; a changed body returns 409. A new key for an existing
project/order also returns 409. A timeout or 5xx can happen after commit: retry the original
request with bounded backoff, or retrieve the known UUID. Do not assume that a timeout means no
payment exists. Honor `Retry-After` on 429; additional peer-level abuse limits may apply.

## Payment states

| State | Meaning |
|---|---|
| CREATED | Internal initial state, reserved for adapters that need it |
| PENDING | Checkout issued; no confirmation |
| PROCESSING | Click Prepare accepted; outcome may be uncertain |
| SUCCEEDED | Click Complete successfully verified and committed |
| FAILED / CANCELLED / EXPIRED | Terminal unsuccessful states; adapters may support subsets |
| REJECTED | An owner recorded a local rejection with a reason; this is not a provider cancellation or refund. An existing prepared attempt may still resolve through a verified Complete callback. |
| REFUND_PENDING | Historical unresolved refund record, retained for manual review; no automatic processing |
| PARTIALLY_REFUNDED | Reserved for future providers with verified partial refunds |
| REFUNDED | Historical confirmed refund; local cancellation cannot create this state |

A timeout never means FAILED. Click's provider flow transitions PENDING → PROCESSING → SUCCEEDED or CANCELLED. The platform does not automatically expire an order with an uncertain provider outcome. Use reconciliation to investigate aged states. The administrator REJECTED decision is separate, as described below; reserved adapter states are not invented Click outcomes.

Owners can reject a CREATED, PENDING or PROCESSING payment from **Transactions → Payment details**
after checking the provider outcome. A reason (1–500 characters) and explicit confirmation are
required. The immutable decision records the administrator and UTC time. It removes the payment
from the awaiting-confirmation count; it is excluded from successful volume but remains in
all-attempt volume and the transaction inventory. Confirmed/refunded and other terminal payments
cannot be rejected. This action does not call Click to cancel or refund funds.

For a prepared payment, a later valid Complete takes precedence over REJECTED, resolving it as
SUCCEEDED or CANCELLED while retaining the rejection and recording its resolution. New Prepare
requests are refused after rejection. Reconciliation continues to inspect older rejected payments
and records discrepancies without changing the financial state. Integrations must accept REJECTED
and a subsequent verified outcome for the same order; only `payment.succeeded` or an authenticated
SUCCEEDED status authorizes fulfillment. Do not assume webhook arrival order; read the current
authenticated payment status when resolving competing events. Rejection reasons and actor details
are available in the admin history; the webhook uses the normal payment data envelope.

## Outgoing webhooks

```json
{"id":"EVENT_UUID","type":"payment.succeeded","createdAt":"2026-10-26T12:00:00Z","data":{"paymentId":"PAYMENT_UUID","orderId":"INV-10001","amount":50000.00,"currency":"UZS","status":"SUCCEEDED"}}
```

Event types currently emitted: `payment.succeeded`, `payment.cancelled`, `payment.rejected`. Historical refund events may remain available for deduplicated redelivery. `payment.rejected` reports an administrator decision, not Click confirmation. All event payloads are durable and immutable. Headers:

```text
X-Nodze-Event-Id: EVENT_UUID
X-Nodze-Timestamp: UNIX_SECONDS
X-Nodze-Signature: v1=LOWERCASE_HEX_HMAC_SHA256
```

Sign the exact UTF-8 bytes of `timestamp + "." + eventId + "." + rawRequestBody`, using the registered endpoint's secret as UTF-8 key. Compare signatures in constant time. Reject absent/malformed headers, timestamps outside ±300 seconds and a body `id` that differs from the event header. Validate expected event types and payment/order/amount/currency against your own records. Preserve raw request bytes before JSON middleware changes them. Receiver clocks must be synchronized.

Insert eventId into a unique deduplication table and update the business order in **one transaction**. A duplicate can return 2xx after checking it was previously handled. Acknowledge only after commit. A delivery can be duplicated if the worker crashes after the receiver commits. Timestamps/signatures change on retry; event ID and body remain the same. Manual redelivery intentionally retains the event ID.

Retries: at most eight attempts, exponential delay starting at 30 seconds, capped at one hour, plus jitter. Non-2xx, redirect, TLS, network, timeout and URL-policy errors retry. After that, state becomes DEAD. Operators can inspect attempts and manually redeliver. Disabled destinations pause delivery. New endpoints do not receive previously dispatched events automatically. URL hostnames must resolve entirely to public addresses; redirects and alternative ports are refused. Keep your webhook fast and return a small empty 2xx response.

## Refunds and operational limitations

Provider refunds and reversals are disabled by product policy. POST `/api/v1/payments/{id}/refunds` returns 501 (`provider_operation_disabled`) for an owned payment and 404 for another project's or missing payment. It creates no refund, changes no financial state, and sends no Click request. The reversal worker and Click DELETE method have been removed. Legacy flags cannot re-enable them. Historical refund records remain readable and require manual review; local cancellation uses the owner-only REJECTED decision described above.

This release supports a single configured Click service for the central company. Confirm multi-business use with Click before onboarding each project. Future provider names in the capability API are placeholders with `available=false`, not supported payment methods. No raw card details, tokenization, invoice creation, fees or net revenue are exposed.

Attempted volume includes every payment attempt. Successful volume includes confirmed payments,
including payments later refunded, before refunds and fees. Pending and REJECTED payments are not
successful volume. Neither total is net settlement or net business revenue.

## Troubleshooting and end-to-end testing

* **Rejected in Click, PROCESSING locally:** inspect Prepare/Complete records, callback delivery
  results and reconciliation. A missing stored Complete can mean it was not sent, was unreachable,
  or failed validation. Check Click's merchant cabinet before another charge or admin rejection.
* **Phone result updates later:** displays can refresh at different times. Fulfillment uses the
  verified callback or authenticated API state, not the phone display or browser return.
* **Webhook missing or DEAD:** check endpoint enablement, workers, public DNS, redirects/login
  pages, response codes, clock skew and raw-body signature verification. Redeliver after fixing
  the receiver, retaining transactional event-ID deduplication.
* **401:** verify that the API credential is active and its project is enabled. **404:** check the
  Nodze UUID and project. **400:** check fields, amount limits and exact return URLs. **409:**
  retrieve the original order/payment and review the state or idempotency conflict.
* **Browser/CORS failure:** move the Nodze call to your backend. Origin registration does not
  enable browser API access. Keep API and endpoint signing secrets server-side.

The owner's Test checkout page creates **real provider payments**, not a simulated sandbox. Use
a dedicated project and intentionally selected amount. Enable the built-in signed inbox to test
delivery without another business application; test your real webhook/fulfillment separately.
Verify success, cancellation, duplicate submission and redelivery, and database-only administrator rejection. Compare the same payment and amount with Click's merchant cabinet.
Download test evidence from the tracking page. Reconciliation records MATCHED, DISCREPANCY or
UNCERTAIN findings without automatically repairing financial state. See [TEST_CHECKOUT.md](TEST_CHECKOUT.md)
or download it from `/admin/docs/download/test-checkout.md`.

## Runnable backend examples

See `examples/create-payment.mjs`, `examples/fastapi_example.py`, `examples/SpringPaymentClient.java`, and `examples/create-payment.sh`. Set environment variables in the backend's secret manager. These examples request checkout or verify events; checkout creation alone does not confirm a charge. A customer completing checkout uses the configured provider service. Replace example domains with exact registered URLs. The Python and Node examples also demonstrate raw-body webhook verification; add transactional deduplication using your actual order database before production.

The same files are readable and downloadable on the dashboard guide, under
`/admin/docs/download/{filename}`. The Node file is a helper module; connect its verified event to
your durable consumer. The FastAPI route intentionally returns 503 until the actual database
transaction is implemented. Do not acknowledge events with an unconditional 200.

JavaScript consumers must preserve decimal source text rather than parse amounts through Number. The Node helper returns amounts as decimal strings using source-preserving JSON.parse (verified on Node 22); the Java example uses a typed BigDecimal response and Python uses Decimal. Do not convert these values to binary floating point.
