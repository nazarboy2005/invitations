# Telegram bot configuration

The application bot is [@Fotiha_Taklifnoma_bot](https://t.me/Fotiha_Taklifnoma_bot).
Keep its token only in local environment files and deployment secrets.

## Production cutover

1. In the deployment project's environment variables, update `TELEGRAM_BOT_TOKEN`
   to the new bot's token and `TELEGRAM_BOT_USERNAME` to `Fotiha_Taklifnoma_bot`.
   Update every environment/worker that uses this bot. Set production `APP_URL`
   to `https://fotiha.uz`; keep localhost in the local development file.
2. Keep `TELEGRAM_WEBHOOK_SECRET` consistent between production and
   `apps/web/.env.local`. It is separate from the bot token. Keep the existing
   `SESSION_SECRET` and `PLATFORM_ADMIN_TELEGRAM_IDS` values.
3. Set `TELEGRAM_MAIN_MINI_APP_ENABLED=false` until the new bot's Main Mini App
   is configured in BotFather. Its menu button is configured separately below.
   Any optional `TELEGRAM_*_STICKER_ID` values must come from this new bot;
   otherwise leave them empty.
4. Redeploy/restart the application and any bot/notification workers.
5. From the repository root, run:

   ```powershell
   pnpm telegram:setup --origin https://fotiha.uz
   ```

   This verifies the token/username, deployed bot identity and webhook secret
   before changing Telegram settings. It registers the HTTPS webhook and the
   **Fotiha** Mini App menu button, then reads both back to verify them. It does
   not send messages, consume updates or drop pending updates. Add `--check`
   for a read-only readiness check. The command leaves the old bot unchanged.

6. Open the new bot and press **Start**, then check the website's Telegram login
   and administrator confirmation. Existing users retain their accounts and
   roles because identity is their Telegram user ID. Users need to start the
   new bot before it can deliver messages to them.

For local development, `pnpm telegram:poll --check` validates credentials. When
no webhook is configured, `pnpm telegram:poll` can deliver updates to localhost.
Polling and webhook delivery cannot run simultaneously for the same bot.

## Visitor activity notifications

RSVP changes, new wishes, private To‘yona receipts and gift intentions each save
a durable notification job in the same transaction as the submission. The web
route attempts delivery using Next.js `after()` after returning success. This
works with webhook delivery and does not consume Telegram updates. Repeating an
unchanged RSVP or uploading the same receipt does not create another notice.

Run `pnpm telegram:notifications` under a process supervisor to recover retries,
or schedule `pnpm telegram:notifications --once` once per minute with the server
environment. A scheduler can instead call `/api/internal/guest-notifications`
with `Authorization: Bearer <CRON_SECRET>` (at least 32 characters). This runner
is independent of polling, works with a configured webhook, and reads both new
activity jobs and old `wish-notification` jobs. No live scheduler or application
deployment is installed by the code change.

Messages contain only the interaction type, invitation names, guest name and
short content, plus an activity link. Pending wishes also have approve/delete
buttons. No stickers, receipt attachments or card numbers are sent. Receipt and
gift-intention notices distinguish uploads/intentions from verified transfers.

The owner must start the bot and have an active private Telegram connection.
Rate limits and explicit temporary failures retry up to 12 attempts. A rejected
delivery is marked `failed`; interrupted or ambiguous acceptance is marked
`uncertain` for manual review, to avoid blindly repeating a possibly sent
message. Inspect the `jobs` table for these states; website activity remains
available regardless of Telegram delivery.

Telegram reference: [webhooks](https://core.telegram.org/bots/api#setwebhook) and
[menu buttons](https://core.telegram.org/bots/api#setchatmenubutton).
