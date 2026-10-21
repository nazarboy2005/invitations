# Publishing verification — 2026-10-22

## Implemented flow

1. The creator edits privately and clicks **Nashr qilish**.
2. Required fields are checked with links to their editor step/language.
3. The existing Telegram account/contact flow runs when needed and retains the
   pending publish action. No anonymous owner or development sign-in was added.
4. The current authored invitation is saved with its revision. Changes during
   saving prevent publication of an older snapshot. Form controls are disabled
   while the request is running.
5. The server locks the owned row, checks revision/template/content/media, and
   publishes immediately in free mode. A six-character Base62 code, JSON/row
   status, revision, publication/identity timestamps, event-local end-of-day
   deadline, and `published_free` audit entry commit together.
6. The editor shows a selectable URL and copy/open actions. The dashboard shows
   the same stable code. Clipboard failure leaves manual copying available.

The database's unique text slug constraint resolves concurrent code allocation.
A collision rolls back to a savepoint and retries, with a bounded failure that
leaves the draft private. A repeated successful request returns the same code
without advancing the revision, rewriting the audit, or extending the deadline.
Ordinary save requests cannot publish, unpublish, or replace the assigned code.

## Latest editor/media audit (2026-10-22)

- `pnpm test:publishing`: **18/18 passed**, including real PostgreSQL + localhost photo/music prepare/PUT/complete, private draft reads, public reads after publication, audio ranges, immutable completed local uploads, private/deduplicated manual receipts, owner review, RSVP replacement and wish moderation.
- All **15 database-published templates** saved/published/reopened with every shared editor field and four enabled languages; stored content/options/media identities matched the authored input. Each resulting public URL returned 200. This is contract/HTTP coverage, not a claim of visual inspection of every field in every design.
- Related schema/migration/storage/draft/Anor checks: **44/44 passed**. A final focused regression run passed **21/21** (overlaps previous groups); a final private-receipt run also passed after adding the destination snapshot display.
- `pnpm typecheck` and the final production build passed; build has no warnings. Runtime-only private local files are excluded from build tracing.
- Full suite: **359 passed, 41 failed, 400 total**. Failure names match the previous 41 template/capture failures exactly. No regression tests or original captures were weakened.
- Browser: authored Anor draft and full-page opening reviewed; enabling dress code now renders its text/palette/note through the shared adapter. Preview guest submissions remain disabled. Screenshot: ignored `.data/editor-input-audit.png`.
- Migration `0051_manual_gift_receipts.sql` applied. Local media directory and provider are configured in ignored `.env.local`. Integration fixtures/bytes are removed after each run; no AI calls, Telegram messages, real receipt data, or customer invitation edits.

The full input mapping and deployment limits are recorded in [`EDITOR_INPUT_AUDIT.md`](EDITOR_INPUT_AUDIT.md).

## Original publication milestone checks

| Check                                                                                          | Result                                                                                  |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Publication unit + PostgreSQL/localhost HTTP integration tests                                 | 13 passed                                                                               |
| Related auth, contracts/policies, draft recovery, storage, migration and Anor regression tests | 66 passed                                                                               |
| TypeScript                                                                                     | Passed                                                                                  |
| Production build                                                                               | Passed                                                                                  |
| Production public-page smoke check on temporary port 3002                                      | Opened the real Anor renderer with authored fixture names, date and venue               |
| Desktop + 390px/320px creator review                                                           | Publish panel, clickable validation errors, busy controls and Telegram handoff reviewed |
| Public renderers                                                                               | Anor and Sahifa displayed authored fixture content and opened successfully              |
| Supplied bot token/username and webhook metadata                                               | Valid; existing webhook preserved                                                       |
| Credential storage                                                                             | `apps/web/.env.local` is Git-ignored; values are absent from committed docs/tests       |

The publication integration suite covers authentication/origin/ownership,
request validation, stale revisions, concurrent retries, unique-code collisions,
case preservation, transaction rollback, initial locks/audit, timezone/DST
deadlines, past-event and incomplete-language rejection, retired/incompatible
templates, foreign media, unavailable storage, built-in music, archived records,
save/publish/public-render/reopen, practical edits, event/name/status locks,
expired editing access, and read-only public viewing afterward. Its generated
database accounts, sessions, invitations, media metadata and audits are removed
after the suite. Tests do not send Telegram messages or fabricate payments.

Browser review found and fixed an Anor initialization race: an SSR iframe could
finish loading before React attached its load handler. The adapter now sends
authored content on hydration and on iframe load. This preserves the captured
design/source and handles both load orders. A regression guard and real browser
reload/open checks cover the fix.

## Wider suite is not fully green

Original milestone `pnpm test`: **356 passed, 41 failed, 397 total**; latest audit: **359 passed, 41 failed, 400 total**. The remaining failures concern
existing template/capture fidelity, dependency byte comparisons, cover artwork,
and provenance checks. They are outside the publication implementation; these
tests and captured source were not weakened to make them pass. Examples include
Qandil cover encoding/provenance, Ganch opening-art expectations, and source-byte
comparisons in Beshik, Bitiruv and other templates. Several comparisons are
sensitive to line endings. Do not report the entire repository as 100% passing.

The original capture directory has moved to
`../Templates/Invitations - this folder will be removed from production`. A
Git-ignored local directory junction at the former path enables those existing
tests to find it. The original captures were not edited. Raw local outputs are
in ignored `.data/related-test-output.txt`, `.data/publishing-test-output.txt`,
`.data/full-test-output.txt` and `.data/build-output.txt`.

## Remaining live checks and service limits

- The user confirmed that Telegram login/contact confirmation succeeded and
  their account name appeared on return. The final browser account-confirmation
  step was unclear, so it now shows a separate account card, next-step copy and
  **Nashr qilishni yakunlash** / **Saqlashni yakunlash**. The final real-account
  publication/copy step is still a manual check. Authenticated HTTP integration
  tests use disposable database sessions, never an application sign-in bypass.
- R2 credentials were not supplied, so real R2 transfer/CORS checks remain open.
  Local image/music/receipt transfers are verified. Publication checks managed-media
  ownership/readiness and stored object existence/size; local receipt uploads require no R2 or AI credentials.
  External image links and the bundled music do not require R2; availability of
  creator-supplied external URLs remains the creator's responsibility.
- Browser diagnostics recorded an initial `MutationObserver.observe` TypeError
  on some automated public iframe loads, without a usable source stack. It did
  not recur on reload, and both public invitation contents/opening interactions
  worked after the Anor hydration fix. This run does not certify every browser
  diagnostic as resolved.
- The optional localhost poller passes its read-only credential check and
  refuses to replace the active webhook. Its message-forwarding loop was not
  started. An existing remote webhook can support local sign-in only when its
  app shares the configured database and Telegram settings.
- No application was deployed, no webhook was replaced, and no paid transaction
  was activated by this task. Local links require a reachable deployment before
  guests on other devices can use them. Stored codes survive origin changes;
  previously shared hosts still need to remain available or redirect.
- Keep codes reserved with their invitation rows. Before introducing permanent
  invitation deletion, add a durable code reservation policy so deleted codes
  cannot be recycled.

## Repeat the checks

```powershell
pnpm dev
# Another terminal, using the private local environment:
pnpm test:publishing
pnpm typecheck
pnpm build
pnpm telegram:poll --check
```

Run `pnpm telegram:poll` only for a development bot without an active webhook.
Production uses the existing HTTPS webhook handler.
