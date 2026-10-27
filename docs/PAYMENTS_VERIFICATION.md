# Payment integration verification — 2026-10-28

- `pnpm test:payments`: **14/14 passed** (nine PostgreSQL integration scenarios
  and five initial payment unit checks). Every provider request was mocked.
- Final focused payment/publication/invitation/manual-register regression:
  **32/32 passed**, including an additional out-of-order-state unit check.
- `pnpm test:payments:http`: **1/1 passed**, exercising the full local HTTP
  lifecycle with a loopback mock provider and a separate Next application.
- TypeScript and the final production build passed after review fixes.
- Browser review of `/payment/return` verified the logged-out account-recovery
  page at 1280×720 and 390×844. No real account sign-in or checkout was attempted.
- Migrations 0160/0161 are applied to the configured PostgreSQL database.
  The database reports 107 templates, minimum and maximum price both 100,000
  minor units, i.e. 1,000 UZS. Typed fallback prices also use 100,000 minor units.

The payment scenarios cover ownership/origin/authentication, displayed-price
tampering, stale revisions, concurrent checkout creation, immutable snapshots,
identity reservation with permitted practical edits, exact decimals, raw-byte
HMAC/header/timestamp checks, mismatched payment/amount rejection, concurrent
duplicate webhooks, lost-response recovery with identical request/key, late
success after rejection, competing event order, lookup cooldown, missing-webhook
recovery, cancellation/retry and paid publication correction without recharging.
The HTTP suite checks that browser return parameters cannot forge success and
that verified publication renders publicly with a stable six-character link.

The broader existing database replay run produced **26 passed / 15 failed**:
all 15 failures share its setup failure at historical migration 0141, which
requires missing Orchid Amplop category/event registration. It fails before
the payment migrations. This is not a clean full-suite result; fixing missing
historical template migrations remains separate work. No old migration files
were rewritten to conceal that issue.

No real Nodze checkout, Click charge, Telegram message or external application
deployment was performed. Project API/webhook credentials are absent locally.
The local publishing mode is now paid, with the real Nodze API base configured;
checkout fails closed until the required secrets and public HTTPS configuration
are supplied. Deployment/environment/endpoint registration and a real customer
payment remain user verification steps described in `PAYMENTS.md`.
