# Turnstile

The existing widget protects public wish, RSVP, receipt and gift intention submissions.
Templates use a shared fetch gate installed by `TemplateFrame` before their public
payload is delivered. The parent invitation page installs the same gate. A managed
widget appears in a shared accessible dialog when a guest submits; viewing and
previewing invitations does not request a challenge. Requests are serialized so
combined RSVP/wish forms receive separate tokens. Cancellation, script failure and
challenge failure return a failed submission without sending the form. Each widget
is reset and removed after its request; retries receive a fresh token.

The existing API handlers call Cloudflare Siteverify. They require `success === true`,
the exact action and an exact approved hostname. There is no configuration bypass.
The token travels in the `cf-turnstile-response` request header so receipt verification
can run before reading the multipart upload. Tokens are never logged or cached.
Existing authorization, moderation, request size limits and rate limits still apply.

| Endpoint suffix   | Required action        |
| ----------------- | ---------------------- |
| `wishes`          | `guest_wish`           |
| `rsvp`            | `guest_rsvp`           |
| `receipts`        | `guest_receipt`        |
| `gift-intentions` | `guest_gift_intention` |

## Environment

Local values live in the ignored `apps/web/.env`. Next.js loads this automatically;
restart the development server after changing environment variables. `.env.local`
and existing process variables take precedence, so avoid conflicting values there.

Set these in Vercel's project environment variables before deploying:

| Variable                         | Production value                                           |
| -------------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Existing widget's public site key                          |
| `TURNSTILE_SECRET`               | Existing widget's secret; mark sensitive                   |
| `TURNSTILE_HOSTNAMES`            | `fotiha.uz,www.fotiha.uz` (only hostnames actually served) |

Redeploy after setting variables; the public site key is included at build time.
Production rejects configurations containing localhost/loopback hostnames. For
development use `localhost,127.0.0.1`; configure these in the Cloudflare widget's
hostname list to exercise the real widget locally. Preview deployments require their
own exact frontend hostnames in both the widget dashboard and the Preview environment
value. Never use a wildcard or copy the local hostname list to Production/Preview.

## Validation

Run `node --import tsx --test tests/turnstile.test.ts tests/turnstile-browser.test.ts`
and `pnpm typecheck`. Browser tests use a mocked Cloudflare API and exercise JSON,
multipart uploads, separate tokens, iframe Requests, cancellation, retries and cleanup.
Verifier tests reject missing/oversized tokens, upstream errors, action/hostname
mismatches, replay rejection responses and unsafe/missing configuration.

For a live check, use a fresh real widget token against an enabled wishes endpoint
with an invalid JSON form object (`{}`). A 400 `INVALID_INPUT` confirms the gate
passed while preventing a guest record or notification. Repeating that token must
return 403 `TURNSTILE_FAILED`. A dummy-token secret probe or mocked tests alone do
not establish live success/replay validation.
