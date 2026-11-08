# Visitor activity and Telegram notifications

Reviewed all 130 distinct typed catalog templates, not just published designs.
The complete per-template features and source dependency evidence are in
`template-inventory.md` and `template-inventory.json`. The source scan follows
entry-document scripts and module imports; it does not claim a new browser
lifecycle test for every design.

Corrections: Uchrashuv declares its existing online response controls; Velora and
Velvet collect RSVP notes rather than separately moderated wishes. Girlsparty,
Estelle, Bloom and Whiteless lack packaged entry documents, remain unpublished,
and have visitor forms disabled. Removed the duplicate Orchid Amplop definition.

Migration 0226 was applied on its own and verified against all 134 configured
database rows, including four database-only queued/retired IDs. Publication and
pricing were unchanged. The unrelated pending migration 0225 was not applied.

Activity sections require actual template support and an enabled form. Existing
submissions remain accessible after an owner disables an optional form. A phone
number or a response deadline alone is not an online response form. Empty image
invitations show a simple no-submissions state. Switching tabs resets pagination;
each tab uses its own has-more flag.

All four submission types enqueue notifications transactionally. New jobs are
attempted with Next.js `after()`; retries can be recovered by the independent CLI
or protected cron endpoint. Telegram polling is not required. Changed responses
send another notice; identical responses and duplicate receipts do not. Messages
contain short content and an activity link; receipts stay private and wishes
retain their moderation buttons. No sticker is sent. Ambiguous delivery is kept
for manual review rather than blindly duplicated.

Validation:

- TypeScript check passed.
- Read-only `pnpm telegram:poll --check` confirmed the configured bot token and
  username are valid and a webhook is active. No updates were consumed. The two
  pre-existing legacy wish jobs were left untouched; the new runner supports
  their format when production delivery is started.
- Eight focused message/feature/migration/wish checks passed, plus three focused
  existing catalog-capability/projection checks.
- PostgreSQL + local HTTP + browser integration passed (see
  `integration-result.json`): all four saved submission types; immediate delivery
  of six intercepted Telegram messages; unchanged RSVP/duplicate receipt
  suppression; retry recovery, retry exhaustion and concurrent claiming;
  authorization and private receipt access; five mobile activity layouts with
  the correct tabs and no horizontal page overflow or browser errors.
- Screenshots were inspected. All disposable users, invitations, submissions,
  notification jobs and the local uploaded receipt were removed afterward.

No real Telegram messages were sent. No external application deployment or live
scheduler setup was performed. Production needs the updated application and a
retry runner/schedule as described in `docs/telegram-bot-setup.md`.

To reproduce the integration, start a separate test server on port 3012 with
`APP_URL=http://127.0.0.1:3012`, `MEDIA_STORAGE=local`, a dedicated
`LOCAL_MEDIA_DIR`, `TELEGRAM_BOT_TOKEN=visitor-activity-test-token`, and
`TAKLIFNOMA_BUILD_DIST_DIR=.next-visitor-activity`. Set `GUEST_TELEGRAM_TEST_LOG` to
the absolute `.tmp/guest-notification-deliveries.jsonl` path and preload
`tests/fixtures/guest-telegram-interceptor.cjs` through `NODE_OPTIONS=--require
<absolute-path>`. Then run
`node --env-file=apps/web/.env.local --import tsx --test tests/guest-activity.integration.ts`.
The interceptor is essential: the test asserts its captured deliveries and must
never use the real bot transport.
