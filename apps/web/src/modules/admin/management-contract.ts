import { z } from "zod";

export const PAYMENT_STATUSES = [
  "pending",
  "received",
  "failed",
  "cancelled",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const paymentLabels: Record<PaymentStatus, string> = {
  pending: "Kutilmoqda",
  received: "Qabul qilingan",
  failed: "Amalga oshmagan",
  cancelled: "Bekor qilingan",
  refunded: "Qaytarilgan",
};
export const paymentTransitions: Record<
  PaymentStatus,
  readonly PaymentStatus[]
> = {
  pending: ["received", "failed", "cancelled"],
  received: ["refunded"],
  failed: [],
  cancelled: [],
  refunded: [],
};
export const reasonSchema = z.string().trim().min(5).max(1000);
export const userActionSchema = z
  .object({
    action: z.enum(["suspend", "restore", "revoke_sessions"]),
    reason: reasonSchema,
  })
  .strict();
export const paymentCreateSchema = z
  .object({
    invitationId: z.uuid(),
    amountMinor: z.number().int().min(0).max(1_000_000_000_000),
    reference: z.string().trim().max(120).default(""),
    note: reasonSchema,
    idempotencyKey: z.uuid(),
  })
  .strict();
export const paymentUpdateSchema = z
  .object({
    revision: z.number().int().min(1),
    status: z.enum(PAYMENT_STATUSES).optional(),
    amountMinor: z.number().int().min(0).max(1_000_000_000_000).optional(),
    reference: z.string().trim().max(120).optional(),
    note: reasonSchema,
  })
  .strict()
  .refine(
    (value) =>
      value.status !== undefined ||
      value.amountMinor !== undefined ||
      value.reference !== undefined,
  );
export const broadcastCreateSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    message: z.string().trim().min(1).max(3500),
    audience: z.enum(["all", "published", "drafts", "selected"]),
    userIds: z.array(z.uuid()).max(500).default([]),
    idempotencyKey: z.uuid(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if ((value.audience === "selected") !== value.userIds.length > 0)
      ctx.addIssue({
        code: "custom",
        path: ["userIds"],
        message: "Tanlangan auditoriya uchun foydalanuvchilar kerak.",
      });
    if (new Set(value.userIds).size !== value.userIds.length)
      ctx.addIssue({
        code: "custom",
        path: ["userIds"],
        message: "Takroriy foydalanuvchi.",
      });
  });
export const broadcastActionSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("confirm"),
      recipientCount: z.number().int().min(1).max(10000),
    })
    .strict(),
  z.object({ action: z.literal("cancel") }).strict(),
]);
export function amountToMinor(value: string): number | null {
  if (!/^\d{1,11}(?:[.,]\d{1,2})?$/.test(value.trim())) return null;
  const [whole, decimals = ""] = value.trim().replace(",", ".").split(".");
  const minor = Number(whole) * 100 + Number(decimals.padEnd(2, "0"));
  return Number.isSafeInteger(minor) && minor <= 1_000_000_000_000
    ? minor
    : null;
}
export function broadcastDeliveryText(message: string) {
  return message + "\n\nUmumiy xabarlarni o‘chirish: /stop";
}
export type AdminUser = {
  id: string;
  name: string;
  username: string | null;
  telegramId: string;
  phoneLast4: string | null;
  isAdmin: boolean;
  disabledAt: string | null;
  createdAt: string;
  invitations: number;
  published: number;
  reachable: boolean;
};
export type AdminInvitation = {
  id: string;
  ownerId: string;
  ownerName: string;
  templateId: string;
  templateName: string;
  people: string;
  eventType: string;
  startsAt: string;
  status: string;
  url: string | null;
  createdAt: string;
  updatedAt: string;
};
export type AdminPayment = {
  method?: "manual" | "nodze";
  providerStatus?: string | null;
  id: string;
  invitationId: string;
  ownerName: string;
  templateName: string;
  amountMinor: number;
  status: PaymentStatus;
  reference: string;
  note: string;
  revision: number;
  createdAt: string;
  receivedAt: string | null;
  url: string | null;
};
export type AdminBroadcast = {
  id: string;
  title: string;
  message: string;
  audience: string;
  status: string;
  recipientCount: number;
  sent: number;
  failed: number;
  skipped: number;
  uncertain: number;
  pending: number;
  createdAt: string;
  actorName: string;
};
export type PageResult<T> = {
  items: T[];
  page: number;
  total: number;
  pages: number;
};
export type ManagementFilters = {
  q?: string;
  page?: string;
  status?: string;
  userId?: string;
};
