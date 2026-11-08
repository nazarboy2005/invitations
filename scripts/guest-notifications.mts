import { processGuestNotifications } from "../apps/web/src/server/guest-notifications.ts";
import { closeDb } from "../packages/database/src/index.ts";

// Independent of getUpdates/webhooks. Run under a process supervisor, or use --once in cron.
try {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.APP_URL)
    throw new Error("Notification configuration missing");
  do {
    console.log(
      `Guest notification jobs processed: ${await processGuestNotifications()}`,
    );
    if (process.argv.includes("--once")) break;
    await new Promise((resolve) => setTimeout(resolve, 10000));
  } while (true);
} catch {
  console.error(
    "Guest notification worker failed. Check server configuration.",
  );
  process.exitCode = 1;
} finally {
  await closeDb();
}
