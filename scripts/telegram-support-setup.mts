import { createHash } from "node:crypto";

class SetupError extends Error {}

async function main() {
  const args = process.argv.slice(2);
  const originIndex = args.indexOf("--origin");
  const target = originIndex < 0 ? process.env.APP_URL : args[originIndex + 1];
  const token = process.env.SUPPORT_TELEGRAM_BOT_TOKEN;
  if (!target || !token)
    throw new SetupError(
      "Set APP_URL and SUPPORT_TELEGRAM_BOT_TOKEN, or provide --origin.",
    );

  const origin = new URL(target);
  if (
    origin.protocol !== "https:" ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password
  )
    throw new SetupError("Use the deployment HTTPS origin without a path.");

  async function telegram(method: string, body: Record<string, unknown> = {}) {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/${method}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      },
    );
    const result = await response.json();
    if (!response.ok || !result.ok)
      throw new SetupError(`Telegram ${method} failed (${response.status}).`);
    return result.result;
  }

  const bot = await telegram("getMe");
  if (bot.username?.toLowerCase() !== "fotiha_support_bot")
    throw new SetupError("The configured token is not the Fotiha support bot.");

  const webhookUrl = new URL("/api/support/telegram/webhook", origin).href;
  const webhookSecret = createHash("sha256").update(token).digest("hex");
  const probe = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-telegram-bot-api-secret-token": webhookSecret,
    },
    body: "invalid-json",
    signal: AbortSignal.timeout(20000),
  });
  if (probe.status !== 400)
    throw new SetupError(
      "The deployed support webhook did not validate. No Telegram settings changed.",
    );

  if (args.includes("--check")) {
    const hook = await telegram("getWebhookInfo");
    console.log(
      `Support bot verified. Webhook: ${hook.url === webhookUrl ? "configured" : "setup required"}. No settings changed.`,
    );
    return;
  }

  await telegram("setWebhook", {
    url: webhookUrl,
    secret_token: webhookSecret,
    allowed_updates: ["message"],
    drop_pending_updates: false,
  });
  const hook = await telegram("getWebhookInfo");
  if (hook.url !== webhookUrl)
    throw new SetupError("Telegram did not retain the support webhook URL.");
  console.log("Support bot webhook configured and verified.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Setup failed.";
  console.error(message);
  process.exitCode = 1;
});
