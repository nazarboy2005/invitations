import { after } from "next/server";
import { processGuestNotifications } from "./guest-notifications";

export function scheduleGuestNotification(jobId?: string) {
  if (!jobId) return;
  after(async () => {
    try {
      await processGuestNotifications({ jobId, limit: 1 });
    } catch {
      // The committed queue entry remains available to the independent runner.
      console.error(
        "Guest notification delivery deferred to the notification worker.",
      );
    }
  });
}
