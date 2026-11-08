// Compatibility for the old local polling command. Delivery no longer needs polling.
import { processGuestNotifications } from "../guest-notifications";

export function processWishNotifications(limit = 5) {
  return processGuestNotifications({ limit });
}
