import { after } from "next/server";
import { processGuestNotifications } from "./guest-notifications";
import { getDb } from "@taklifnoma/database";

export function scheduleGuestNotification(jobId?: string) {
  if (!jobId) return;
  after(async () => {
    try {
      await processGuestNotifications({ jobId, limit: 1 });
      // A normal RSVP+wish burst can share a chat cooldown. Give it a bounded
      // background retry without delaying the form response or requiring cron.
      const [job] =
        await getDb()`SELECT status,available_at FROM jobs WHERE id=${jobId}`;
      const delay =
        job?.status === "queued"
          ? new Date(job.available_at).getTime() - Date.now()
          : Infinity;
      if (delay <= 1500) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.max(0, delay) + 100),
        );
        await processGuestNotifications({ jobId, limit: 1 });
      }
    } catch {
      // The committed queue entry remains available to the independent runner.
      console.error(
        "Guest notification delivery deferred to the notification worker.",
      );
    }
  });
}
