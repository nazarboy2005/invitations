import { currentTelegramLaunchData } from "../session/client-session";

/** Synchronous: call only from a user click, never after awaiting a request. */
export function openCheckout(checkoutUrl: string): void {
  const url = new URL(checkoutUrl);
  if (url.protocol !== "https:" || url.username || url.password)
    throw new Error("To‘lov havolasi noto‘g‘ri. Holatni qayta tekshiring.");

  const app = window.Telegram?.WebApp;
  const inTelegram = Boolean(
    currentTelegramLaunchData() ||
    (app?.platform && app.platform !== "unknown"),
  );
  if (inTelegram) {
    if (
      !app?.openLink ||
      (app.isVersionAtLeast && !app.isVersionAtLeast("6.1"))
    )
      throw new Error(
        "Telegram havolani ocholmadi. Havolani nusxalab Chrome’da oching yoki Telegramni yangilang.",
      );
    // Pass Nodze's exact HTTPS URL. Never guess a Click scheme or intent URL.
    app.openLink(checkoutUrl);
    return;
  }
  // Keep the status page available. Browser/Telegram settings control the actual
  // destination; a new tab is not proof of an external browser or app launch.
  window.open(checkoutUrl, "_blank", "noopener,noreferrer");
}
