# Post-publication editing — 2026-11-03

> Update (2026-11-11): free publication/download behavior described below is superseded. All new website publication and clean PNG downloads require verified payment; no publishing-mode setting exists. QA now uses disposable paid order fixtures. See [payments](PAYMENTS.md).

## Implementation plan

1. Share a server-enforced editing policy and authoritative editing metadata with
   Studio. Preserve a separately approved event date; extending editing access must
   never silently approve another event date.
2. Web: protect names/hosts, event type/design, age and anniversary identity, main
   date/timezone, language membership, and secondary ceremony dates. Allow same-day
   start time, performers and practical details. Static: after first export permit
   only location (venue/address/landmark/map) and start date/time; dates cannot go
   beyond the originally approved event day. The user explicitly confirmed this.
3. Add owned correction/postponement requests and an administrator review queue.
   Require a reason, exact before/after review, stale-value detection, fresh admin
   authorization and atomic audit records. No generic arbitrary-JSON edit bypass.
4. Make expired editors visibly read-only while keeping requests, public viewing,
   moderation and repeat static downloads available. Re-download must not require a
   content save after editing expires. Static files already downloaded cannot update.
5. Verify contracts, API ownership/CSRF/forged payloads/concurrent review, static
   exports, revisions, deadlines and rendering; inspect desktop/mobile UI and build.

## Input decisions

Static mapped fields audited: people, event heading, invitation message, start,
timezone, venue name, written address, landmark, selected map/QR destination.
Names, wording, language, timezone and design lock after first export. Location
fields and bounded start changes remain editable until the fixed deadline. Name
corrections and later dates use review. Web retains practical text/media/program/
location/contact/RSVP/wishes/gift edits. The same person/event must be retained.

Approval changes only requested fields; it preserves URL, payment, responses,
first publication/export time and unrelated practical edits. Postponement records
the approved new date and deadline together. Identity correction does not reopen
expired editing. Rejections preserve current content and record the reason.

## Completed verification

- Applied and verified scoped migrations `0209_invitation_edit_approvals.sql` and
  `0210_admin_correction_audit.sql` on the configured database. Existing deadlines
  remain unchanged; new publications use the last declared ceremony day.
- 76 focused contract, Studio, recovery, publication, payment and admin tests pass.
- Seven integration scenarios pass using localhost HTTP, the real PostgreSQL
  database and disposable accounts: static save/export/re-download; immutable
  metadata/date bounds; owner/CSRF/admin authorization; quotas/duplicate requests;
  concurrent approvals and audit uniqueness; postponement/stale/deleted requests;
  web editing and public-link/guest-response preservation. Six run together in the
  two suites below; the public-link scenario was also run separately after addition.
- The existing first-publication concurrency and DST service tests both pass with
  explicit process-local free mode. The running application remains in its existing
  payment mode. No real checkout or Telegram messages were attempted.
- Headless browser verification passes at 1440×900 and 390×844, including actual
  name-correction submission/admin approval/reopen, disabled static wording,
  enabled location/date controls, calendar bounds, read-only expiry, reachable
  requests/downloads, no horizontal overflow and no JavaScript page errors.
- Production build, TypeScript and packaged Chromium/cover verification pass;
  `git diff --check` passes. No external application deployment was performed.
- Review also caught and fixed the canonical/versioned built-in music mismatch in
  publication validation, an administrator audit-action constraint, and differing
  server/browser Uzbek date formatting that could reset the review form.

Reproduce the new API/static checks against a running local application:

```powershell
node --env-file=apps/web/.env.local --import tsx --test tests/edit-approvals.integration.ts tests/static-images.integration.ts
node --env-file=apps/web/.env.local --import tsx scripts/verify-editing-ui.mts
```

Screenshots are retained locally under `.tmp/editing-qa/`. The new checks cover
the changed authorization and editing paths; they are not a whole-platform
penetration test or live provider/deployment certification.
