import { processGuestNotifications } from "../apps/web/src/server/guest-notifications.ts";
import { closeDb } from "../packages/database/src/index.ts";
import { cleanupAbandonedMedia } from "../apps/web/src/server/media-policy.ts";
import { fileURLToPath } from "node:url";

// Independent of getUpdates/webhooks. Run under a process supervisor, or use --once in cron.
try {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.APP_URL)
    throw new Error("Notification configuration missing");
  // This CLI starts from the monorepo root; Next's default media root is in web/.
  process.env.LOCAL_MEDIA_DIR ||= fileURLToPath(
    new URL("../apps/web/.data/media/", import.meta.url),
  );
  let lastCleanupAt = 0;
  do {
    if (Date.now() - lastCleanupAt > 60_000) {
      await cleanupAbandonedMedia();
      lastCleanupAt = Date.now();
    }
    const processed = await processGuestNotifications();
    console.log(`Guest notification jobs processed: ${processed}`);
    if (process.argv.includes("--once")) break;
    await new Promise((resolve) =>
      setTimeout(resolve, processed ? 1000 : 5000),
    );
  } while (true);
} catch {
  console.error(
    "Guest notification worker failed. Check server configuration.",
  );
  process.exitCode = 1;
} finally {
  await closeDb();
}
