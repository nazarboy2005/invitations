// Local-only delivery adapter. Production uses Telegram's HTTPS webhook.
// Never log tokens, webhook secrets, update contents, or contact details.
class DeliveryError extends Error {
  constructor(
    message: string,
    readonly code?: number,
  ) {
    super(message);
  }
}
async function main() {
  const origin = process.env.APP_URL;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const deliverWishNotifications =
    process.argv.includes("--deliver-wishes") ||
    process.argv.includes("--with-wish-notifications");
  if (
    !origin ||
    !token ||
    (!secret && !deliverWishNotifications) ||
    !["127.0.0.1", "localhost"].includes(new URL(origin).hostname)
  )
    throw new DeliveryError(
      "Local APP_URL and Telegram configuration are required.",
    );
  async function telegram(method: string, body: Record<string, unknown> = {}) {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/${method}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      },
    );
    const result = await response.json();
    if (!result.ok)
      throw new DeliveryError(
        `Telegram ${method} failed (${result.error_code ?? response.status}).`,
        result.error_code,
      );
    return result.result;
  }
  const info = await telegram("getWebhookInfo");
  const bot = await telegram("getMe");
  if (
    bot.username.toLowerCase() !==
    process.env.TELEGRAM_BOT_USERNAME?.replace(/^@/, "").toLowerCase()
  )
    throw new DeliveryError(
      "TELEGRAM_BOT_USERNAME does not match the configured bot token.",
    );
  if (process.argv.includes("--check")) {
    console.log(
      `Telegram token and username are valid. Delivery: ${info.url ? "existing webhook (polling will not replace it)" : "polling available"}. No updates consumed or messages sent.`,
    );
    return;
  }
  if (info.url)
    throw new DeliveryError(
      "A webhook is already configured. Polling will not replace it.",
    );
  console.log(
    `Local Telegram delivery${deliverWishNotifications ? " and wish notifications" : ""} is running. Keep pnpm dev running; Ctrl+C to stop. Run only one polling process per bot.`,
  );
  let offset = 0;
  const { processWishNotifications } = deliverWishNotifications
    ? await import("../apps/web/src/server/jobs/wish-notification.ts")
    : { processWishNotifications: null };
  for (;;) {
    try {
      if (processWishNotifications) await processWishNotifications();
      const updates = await telegram("getUpdates", {
        offset,
        timeout: 20,
        allowed_updates: ["message", "callback_query"],
      });
      for (const update of updates) {
        const response = await fetch(new URL("/api/telegram/webhook", origin), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-telegram-bot-api-secret-token": secret,
          },
          body: JSON.stringify(update),
          signal: AbortSignal.timeout(30000),
        });
        if (!response.ok)
          throw new DeliveryError(
            `Local update delivery failed (${response.status}).`,
          );
        offset = update.update_id + 1;
      }
    } catch (error) {
      if (error instanceof DeliveryError && error.code === 409) throw error;
      console.error(
        error instanceof DeliveryError
          ? error.message
          : "Telegram delivery failed; retrying.",
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}
main().catch((error) => {
  console.error(
    error instanceof DeliveryError
      ? error.message
      : "Local Telegram delivery could not start. Check the configuration and connection.",
  );
  process.exitCode = 1;
});
