import type { SessionUser } from "@taklifnoma/contracts";

export const PAYMENT_RETURN_START = "payment_return";
const orderIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A destination hint only: never a login credential or payment confirmation. */
export function paymentReturnPath(
  startParam: string | null | undefined,
): string | null {
  if (startParam === PAYMENT_RETURN_START) return "/payment/return";
  const id = startParam?.startsWith(PAYMENT_RETURN_START + "_")
    ? startParam.slice(PAYMENT_RETURN_START.length + 1)
    : "";
  return orderIdPattern.test(id) ? `/payment/return?order=${id}` : null;
}

export function telegramPaymentReturnLink(
  username: string | undefined,
  orderId?: string,
  mainMiniApp = false,
): string | null {
  const bot = username?.replace(/^@/, "");
  if (!bot || !/^[a-z][a-z0-9_]{4,31}$/i.test(bot)) return null;
  const start =
    PAYMENT_RETURN_START +
    (orderId && orderIdPattern.test(orderId) ? `_${orderId}` : "");
  // The confirmation/link arrives automatically. Returning should open the chat,
  // not send another /start command or generic onboarding message.
  return mainMiniApp
    ? `https://t.me/${bot}?startapp=${start}`
    : `https://t.me/${bot}`;
}

/** Call after the server has verified this launch and resolved its session. */
export function miniAppPaymentDestination(
  initData: string,
  user: SessionUser | null,
): string | null {
  if (!user?.phoneShared || !initData) return null;
  return paymentReturnPath(new URLSearchParams(initData).get("start_param"));
}

export function rememberedPaymentOrder(userId: string): string {
  try {
    return localStorage.getItem(`nodze-order:${userId}`) ?? "";
  } catch {
    return "";
  }
}

export function rememberPaymentOrder(userId: string, orderId: string): void {
  try {
    localStorage.setItem(`nodze-order:${userId}`, orderId);
  } catch {
    // Only a navigation hint. Account-owned backend records remain authoritative.
  }
}
