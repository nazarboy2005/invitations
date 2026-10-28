import type { Invitation } from "./index";

// Content may be corrected while checkout is pending; its purchased event may not change.
export function paymentIdentity(invitation: Invitation): string {
  return JSON.stringify({
    templateId: invitation.templateId,
    eventType: invitation.eventType,
    startsAt: invitation.startsAt,
    timezone: invitation.timezone,
    people: [...invitation.enabledLocales].sort().map((locale) => ({
      locale,
      people: invitation.content[locale]?.people,
      hosts: invitation.content[locale]?.hosts,
    })),
  });
}

export const PAYMENT_STATES = [
  "CREATED",
  "PENDING",
  "PROCESSING",
  "SUCCEEDED",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
  "REJECTED",
  "REFUND_PENDING",
  "PARTIALLY_REFUNDED",
  "REFUNDED",
] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];
export function nextPaymentState(
  current: PaymentState,
  incoming: PaymentState,
): PaymentState {
  if (
    [
      "SUCCEEDED",
      "FAILED",
      "CANCELLED",
      "EXPIRED",
      "REFUND_PENDING",
      "PARTIALLY_REFUNDED",
      "REFUNDED",
    ].includes(current)
  )
    return current;
  const progress: Partial<Record<PaymentState, number>> = {
    CREATED: 0,
    PENDING: 1,
    PROCESSING: 2,
    REJECTED: 3,
  };
  if ((progress[incoming] ?? Infinity) < (progress[current] ?? 0))
    return current;
  return incoming;
}
export const paymentStateLabels: Record<PaymentState, string> = {
  CREATED: "Tayyorlanmoqda",
  PENDING: "To‘lov kutilmoqda",
  PROCESSING: "Tasdiq kutilmoqda",
  SUCCEEDED: "To‘lov tasdiqlandi",
  FAILED: "To‘lov amalga oshmadi",
  CANCELLED: "Bekor qilingan",
  EXPIRED: "Muddati tugagan",
  REJECTED: "Tekshiruv talab etiladi",
  REFUND_PENDING: "Qaytarish tekshirilmoqda",
  PARTIALLY_REFUNDED: "Qisman qaytarilgan",
  REFUNDED: "Qaytarilgan",
};
export type PaymentOrderView = {
  id: string;
  invitationId: string;
  templateName: string;
  amountMinor: number;
  status: PaymentState;
  checkoutUrl: string | null;
  url: string | null;
  publicationError: string | null;
};

export type InvitationPaymentSummary = Pick<
  PaymentOrderView,
  "id" | "status" | "amountMinor"
>;

export type InvitationPaymentContext = {
  invitation: Invitation;
  order: PaymentOrderView | null;
  template: { name: string; priceMinor: number } | null;
  publishingMode: "free" | "paid";
};
