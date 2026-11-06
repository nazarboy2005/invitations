import { currentTelegramLaunchData } from "../session/client-session";

/** Synchronous: call only from a user click, never after awaiting a request. */
export function openCheckout(
  checkoutUrl: string,
  reservedWindow?: Window | null,
): void {
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
    reservedWindow?.close();
    app.openLink(checkoutUrl);
    return;
  }
  // A window reserved synchronously from the initiating click avoids popup
  // blockers after the checkout request finishes.
  if (reservedWindow) {
    reservedWindow.opener = null;
    reservedWindow.location.replace(checkoutUrl);
    return;
  }
  window.open(checkoutUrl, "_blank", "noopener,noreferrer");
}
