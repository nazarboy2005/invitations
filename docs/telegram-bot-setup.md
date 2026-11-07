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

Telegram reference: [webhooks](https://core.telegram.org/bots/api#setwebhook) and
[menu buttons](https://core.telegram.org/bots/api#setchatmenubutton).
