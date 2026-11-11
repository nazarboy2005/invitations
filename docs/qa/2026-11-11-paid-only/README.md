# Mandatory invitation payments

User requirement: remove the publishing-mode setting; all new website publication
and clean image downloads require verified payment.

- Removed the environment toggle, catalog/payment-context fields, Studio state,
  free return-page branches and free audit actions. Local and example environment
  files no longer contain the obsolete setting.
- Website publication checks the owned event/template purchase unconditionally.
  Existing public website links and restoration of their original event remain
  supported; new drafts cannot manufacture publication metadata.
- Every clean image download checks a verified purchase, even after an earlier
  free-testing export. A zero catalog price does not grant download entitlement;
  new checkout rejects nonpositive prices. Image previews retain their baked-in
  watermark.
- Purchased image events keep repeat downloads after approved practical edits.
  Only the start time is excluded from repeat-image identity comparison; owner,
  invitation, template, people, hosts, event type, locales and timezone remain bound.
- Template lifecycle QA uses scoped disposable verified-order fixtures instead
  of a free-mode override, with order/webhook/job cleanup. Historical plans are
  marked as superseded; current payment configuration is in `docs/PAYMENTS.md`.

Verification uses mocked provider calls and disposable PostgreSQL records. No
application deployment, real payment or notification delivery is part of this task.

- TypeScript: passed.
- Production build (`.next-paid-only-qa`): passed, including all 38 static pages
  and static-image/receipt-worker deployment trace checks.
- Focused payment, checkout, receipt, return navigation and publication checks:
  26 passed.
- Payment integration: all 10 scenarios passed across the suite and focused rerun.
  Updated stale expectations to the existing order API and current launch prices.
- Paid-publication transaction: rejects an unpaid administrator-owned event,
  publishes with a matching verified order, preserves the URL on retry and
  exercises scoped fixture cleanup. Entire transaction rolled back.
- Image integration: rejects unpaid access, old export metadata, zero-price
  bypass, pending payment, wrong owner and changed names. Verifies signed success,
  an actual 1500 × 2100 PNG and repeat paid downloads after permitted edits.
- Browser checkout/return integration: passed at 1440, 390 and 320 pixels.
  Covers checkout handoff/recovery, unpaid/pending/paid return states, paid Studio
  completion without another checkout and authenticated Mini App return. Updated
  stale dashboard/navigation expectations to the current interface.
