// Run after deploying matching bot credentials. Never log credentials or send messages.
class SetupError extends Error {}

async function main() {
  const args = process.argv.slice(2);
  const originIndex = args.indexOf("--origin");
  const target =
    originIndex === -1 ? process.env.APP_URL : args[originIndex + 1];
  if (!target)
    throw new SetupError(
      "Supply --origin https://fotiha.uz for the deployed application.",
    );
  let origin: URL;
  try {
    origin = new URL(target);
  } catch {
    throw new SetupError("The deployment origin must be a valid HTTPS URL.");
  }
  if (
    origin.protocol !== "https:" ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password
  )
    throw new SetupError(
      "Use the deployment's HTTPS origin without a path or credentials.",
    );

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const username = process.env.TELEGRAM_BOT_USERNAME?.replace(/^@/, "");
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !username || !secret || !/^[A-Za-z0-9_-]{1,256}$/.test(secret))
    throw new SetupError(
      "Configure the bot token, username and valid webhook secret in apps/web/.env.local.",
    );

  async function telegram(method: string, body: Record<string, unknown> = {}) {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/${method}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20_000),
      },
    );
    const data = await response.json();
    if (!response.ok || !data.ok)
      throw new SetupError(
        `Telegram ${method} failed (${response.status}). No credentials logged.`,
      );
    return data.result;
  }

  const bot = await telegram("getMe");
  if (bot.username?.toLowerCase() !== username.toLowerCase())
    throw new SetupError(
      "The configured username does not match the bot token.",
    );

  const infoUrl = new URL("/api/telegram/info", origin);
  infoUrl.searchParams.set("setup", String(Date.now()));
  const deployed = await fetch(infoUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const info = await deployed.json();
  if (
    !deployed.ok ||
    info.botUrl?.toLowerCase() !== `https://t.me/${username}`.toLowerCase()
  )
    throw new SetupError(
      "The deployment still uses another bot. Update its Telegram variables and redeploy first. No bot settings changed.",
    );

  const webhookUrl = new URL("/api/telegram/webhook", origin).href;
  // Invalid JSON shape is rejected after checking the secret, before processing an update.
  const probe = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-telegram-bot-api-secret-token": secret,
    },
    body: "[]",
    signal: AbortSignal.timeout(20_000),
  });
  const result = await probe.json();
  if (probe.status !== 400 || result.error?.code !== "INVALID_INPUT")
    throw new SetupError(
      "The deployment did not accept the configured webhook secret. Check TELEGRAM_WEBHOOK_SECRET. No bot settings changed.",
    );

  if (args.includes("--check")) {
    const hook = await telegram("getWebhookInfo");
    console.log(
      `Bot @${username}, deployment and webhook secret verified. Webhook: ${hook.url === webhookUrl ? "configured" : "setup required"}. No settings changed or messages sent.`,
    );
    return;
  }

  await telegram("setWebhook", {
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: false,
  });
  await telegram("setChatMenuButton", {
    menu_button: {
      type: "web_app",
      text: "Fotiha",
      web_app: { url: origin.origin },
    },
  });
  const hook = await telegram("getWebhookInfo");
  const menu = await telegram("getChatMenuButton");
  if (
    hook.url !== webhookUrl ||
    menu.type !== "web_app" ||
    menu.web_app?.url?.replace(/\/$/, "") !== origin.origin
  )
    throw new SetupError(
      "Telegram settings could not be verified. Run --check to inspect delivery readiness.",
    );
  console.log(
    `Configured @${username}: webhook ${webhookUrl} and Fotiha menu button. No messages sent or pending updates dropped.`,
  );
}

main().catch((error) => {
  console.error(
    error instanceof SetupError
      ? error.message
      : "Telegram setup could not complete. Check configuration and connectivity; credentials were not logged.",
  );
  process.exitCode = 1;
});
