import { processAdminBroadcasts } from "../apps/web/src/server/jobs/admin-broadcast.ts";
import { closeDb } from "../packages/database/src/index.ts";
async function main() {
  try {
    do {
      const result = await processAdminBroadcasts();
      console.log(
        `Processed: ${result.processed}${result.busy ? " (another worker is active)" : ""}`,
      );
      if (!process.argv.includes("--watch")) break;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } while (true);
  } finally {
    await closeDb();
  }
}
main().catch(() => {
  console.error("Broadcast worker failed. Check server configuration.");
  process.exitCode = 1;
});
