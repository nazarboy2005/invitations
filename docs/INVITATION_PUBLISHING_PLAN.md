# Invitation publishing plan — 2026-10-22

## Confirmed direction

The user approved implementation of this plan on 2026-10-22. In the current
prelaunch stage, a valid invitation should publish immediately when the creator
clicks Publish. Payment, checkout, and payment-provider credentials must not be
prerequisites. Retain the established account ownership, authored-content,
template-compatibility, and post-publication editing rules.

This document plans customer invitation publication. Publishing a template into
the design catalog is a separate, already existing administrator operation.

## What exists

- The backend lives in the same Next.js application: API handlers under
  `apps/web/src/app/api`, server services under `apps/web/src/server`, shared
  schemas/policies in `packages/contracts`, and PostgreSQL access/migrations in
  `packages/database`.
- Authenticated invitation save/list/load APIs and revision conflict handling
  exist. New invitations are saved as drafts; ordinary saves cannot transition
  an invitation to published.
- The database already has a unique `slug`, status, publication/identity-lock
  timestamps, editing deadline, and invitation audit log.
- `/i/[slug]` already loads a published invitation and renders its selected
  template. It supports enabled language selection and recorded guest-token
  resolution. A new site/build per invitation is unnecessary.
- Customer publication now uses `POST /api/invitations/[id]/publish` and the
  editor's **Nashr qilish** action. Editor/dashboard provide permanent-link
  copy/open controls; server logic lives in `server/publication.ts` and shared
  content validation in `packages/contracts/src/publication.ts`.
- Supplied settings are stored in ignored `apps/web/.env.local`. PostgreSQL and
  bot identity checks succeeded, and all 50 migrations are applied. R2 remains
  unconfigured; plain invitations and the bundled music do not require it.

## Confirmed public code format (2026-10-22)

The user selected exactly **six Base62 characters**. Use the existing public
route with a server-generated random code, such as `/i/aB3xY9`. The alphabet is
`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`; preserve case
through storage, lookup, and sharing. Keep the internal UUID separate. Generate
codes with unbiased cryptographic randomness, enforce case-sensitive uniqueness
in PostgreSQL, and retry a collision. There are 62^6 = 56,800,235,584 possible
codes, but random generation still needs collision handling. Never use a code as
the creator's authorization credential.

This replaces the earlier ten-character recommendation and name-based
alternatives. The random format fits all event types and the existing route.

Generate the URL on first successful publication and keep it stable through
allowed edits, language changes, and admin-approved postponement or template
replacement. Do not recycle a previously published code. Friendly aliases can
be a future feature without changing the underlying invitation identity.

Use the same base invitation for future guest links, such as
`/i/aB3xY9?g=<guest-token>`, and locale selection such as `?lang=ru`.
The public link is shareable, not an authentication credential. Keep the
existing search-engine noindex setting; anyone receiving the link can view it.

## Implemented creator experience

1. Create/edit privately and preview the real renderer with authored content.
2. Click **Nashr qilish**. Reuse the current authenticated session. If signed out,
   preserve the draft, finish the established Telegram login/contact flow, and
   resume the requested publication without requiring a new draft.
   After Telegram confirms identity, the website shows the confirmed account
   and an explicit **Nashr qilishni yakunlash** button explaining that it saves
   and publishes under that account.
3. Validate and save the latest draft. Show actionable field errors and preserve
   all input on failure. Explain the established identity lock beside the
   Publish control, without adding a payment screen or another confirmation.
4. Publish on the server immediately after successful validation and saving.
5. Show the permanent URL with **Havolani nusxalash** and **Taklifnomani ochish**.
   Show the same public link and published status in the dashboard. Clipboard
   failure should leave a selectable URL available for manual copying.

Publishing and saving are separate actions: Save keeps a draft private. Practical
updates to a published invitation keep its existing public link and remain
subject to the existing editing policy.

## Implementation sequence and outcome

The core flow below has been implemented. Review results and the remaining human
Telegram/R2 checks are in [`PUBLISHING_VERIFICATION.md`](PUBLISHING_VERIFICATION.md).
The database already supplies the required lifecycle columns and case-sensitive
unique slug constraint, so customer publishing requires no additional migration.
The migration runner now drains deferred constraints between migration files;
otherwise pending template triggers could block later `ALTER TABLE` statements.

1. **Configure persistence and accounts.** Configure PostgreSQL, apply outstanding
   required migrations after inspecting current state, and configure the existing
   Telegram authentication flow. Use the correct local `APP_URL` origin. Configure
   local private disk for localhost uploads, or R2 for deployment. Do not introduce a fake owner or mock payment. Receipt uploads use manual owner review; AI screening is deferred by the user's latest instruction.
2. **Define publication validation.** Check authenticated ownership, the saved
   revision, selected template availability and event compatibility, required
   people/event text for enabled locales, valid date/timezone, and ownership and
   readiness of referenced media. Keep optional music/photos/sections optional;
   exclude catalog sample data from persisted invitations.
3. **Add a publication service and endpoint.** Implemented endpoint:
   `POST /api/invitations/[id]/publish`, accepting the expected saved revision.
   Authenticate and check origin, then lock the invitation row in a transaction.
   Recheck ownership, revision, template eligibility, and publication validation.
   Allocate the slug; update both the row status and JSON data status together;
   advance the revision; set first-publication/identity-lock timestamps and the
   approved editing deadline; and write an audit entry. Return the published
   record and canonical public URL. General save APIs must not accept a client
   status change as publication authority.
4. **Make retries safe.** Repeated Publish requests for an already published
   invitation return the same URL without changing the initial publication time
   or extending its editing deadline. Handle concurrent requests and unique-code
   conflicts. A stale revision must not silently publish an older draft.
5. **Connect editor and dashboard.** Save the current authored draft before the
   publish request, retain edits if saving fails or changes occur during saving,
   prevent duplicate submission while busy, and synchronize returned status and
   revision into browser storage. Add success/link UI and published dashboard
   actions. Missing configuration should produce a useful message, never a fake
   successful publication.
6. **Review the complete flow.** Check first publication, unauthenticated resume,
   required-field errors, unavailable/incompatible templates, conflicts, retries,
   owner isolation, stable URLs, public rendering in enabled locales, uploaded
   media, and post-publication editing limits. Confirm unpublished drafts remain
   inaccessible through public URLs and public invitations contain authored data.

## Payment transition later

Use an explicit server-controlled publication mode, such as
`PUBLISHING_MODE=free` now and `paid` after a real payment integration exists.
Record the free publication basis in durable server data/audit history rather
than manufacturing a successful transaction. Catalog prices can remain stored;
the creator should see that payment is not required during the current stage.

Later, insert verified entitlement checking before the same publication service:
draft -> sign in -> server-created order -> verified payment -> publication.
Keep the URL, renderer, ownership rules, and invitation content model unchanged.
Recommendation: invitations legitimately published for free remain accessible
when paid publishing is introduced; do not retroactively charge to keep their
links working. Exact paid checkout/publication UX remains a future decision.

## Local versus externally shared links

No custom domain is required to implement publishing. Store the six-character
slug rather than a hard-coded absolute invitation URL. Build share links from
the configured application origin, so adding a domain later changes the origin
while preserving `/i/aB3xY9`. Previously shared URLs on an old host need that
host to remain available or redirect to the new one; changing configuration
alone cannot redirect links on a host we no longer control.

The same route works locally as `http://127.0.0.1:3001/i/aB3xY9`. Other
people need an externally reachable deployment or development URL to open it.
Making invitations published in the database does not itself deploy the app.
External deployment remains a separate task.
