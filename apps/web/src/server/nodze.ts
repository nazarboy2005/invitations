import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { PAYMENT_STATES } from "@taklifnoma/contracts/payment";
import { ApiError } from "./api";

export function decimalToMinor(value: string): bigint {
  if (!/^\d{1,17}(?:\.\d{1,2})?$/.test(value))
    throw new ApiError(
      502,
      "INVALID_PAYMENT_AMOUNT",
      "To‘lov summasi noto‘g‘ri.",
    );
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
}
export function minorToDecimal(value: bigint): string {
  if (value < 1n || value > 1000000000000n)
    throw new ApiError(400, "INVALID_PRICE", "Dizayn narxini tekshiring.");
  return `${value / 100n}.${String(value % 100n).padStart(2, "0")}`;
}
// Node 22 source text preserves exact amounts before any Number coercion.
export function parseNodzeJson(raw: string): unknown {
  return JSON.parse(raw, (key, value, context?: { source: string }) => {
    if (key !== "amount") return value;
    if (typeof value === "string") return value;
    if (typeof value !== "number" || !context?.source)
      throw new ApiError(
        502,
        "INVALID_PAYMENT_AMOUNT",
        "Aniq to‘lov summasi olinmadi.",
      );
    return context.source;
  });
}
const amountSchema = z.string().regex(/^\d{1,17}(?:\.\d{1,2})?$/);
export const nodzePaymentSchema = z.object({
  id: z.uuid(),
  orderId: z.uuid(),
  amount: amountSchema,
  currency: z.literal("UZS"),
  provider: z.literal("click"),
  status: z.enum(PAYMENT_STATES),
  checkoutUrl: z.string().nullable().optional(),
});
export type NodzePayment = z.infer<typeof nodzePaymentSchema>;
export const eventSchema = z.object({
  id: z.uuid(),
  type: z.enum(["payment.succeeded", "payment.cancelled", "payment.rejected"]),
  data: z.object({
    paymentId: z.uuid(),
    orderId: z.uuid(),
    amount: amountSchema,
    currency: z.literal("UZS"),
    status: z.enum(PAYMENT_STATES),
  }),
});
export function verifyNodzeWebhook(
  raw: Buffer,
  headers: Headers,
  now = Date.now(),
) {
  const secret = process.env.NODZE_WEBHOOK_SECRET;
  if (!secret)
    throw new ApiError(
      503,
      "PAYMENTS_NOT_CONFIGURED",
      "To‘lovlar sozlanmagan.",
    );
  const timestamp = headers.get("x-nodze-timestamp") ?? "";
  const eventId = headers.get("x-nodze-event-id") ?? "";
  const signature = headers.get("x-nodze-signature") ?? "";
  if (
    !/^\d{10,11}$/.test(timestamp) ||
    !z.uuid().safeParse(eventId).success ||
    !/^v1=[a-f0-9]{64}$/.test(signature) ||
    Math.abs(now / 1000 - Number(timestamp)) > 300
  )
    throw new ApiError(401, "INVALID_SIGNATURE", "Webhook tasdig‘i noto‘g‘ri.");
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${eventId}.`)
    .update(raw)
    .digest();
  if (!timingSafeEqual(expected, Buffer.from(signature.slice(3), "hex")))
    throw new ApiError(401, "INVALID_SIGNATURE", "Webhook tasdig‘i noto‘g‘ri.");
  const event = eventSchema.parse(parseNodzeJson(raw.toString("utf8")));
  if (
    event.id !== eventId ||
    {
      "payment.succeeded": "SUCCEEDED",
      "payment.cancelled": "CANCELLED",
      "payment.rejected": "REJECTED",
    }[event.type] !== event.data.status
  )
    throw new ApiError(400, "INVALID_EVENT", "Webhook ma’lumotlari mos emas.");
  return event;
}
export function nodzeConfig() {
  const base = new URL(
    process.env.NODZE_API_BASE_URL ?? "https://payments.nodze.org/api/v1",
  );
  const local =
    process.env.NODE_ENV !== "production" &&
    ["127.0.0.1", "localhost"].includes(base.hostname);
  if (
    (!local && base.protocol !== "https:") ||
    base.username ||
    base.password ||
    base.search ||
    base.hash ||
    !process.env.NODZE_API_KEY ||
    !process.env.NODZE_WEBHOOK_SECRET
  )
    throw new ApiError(
      503,
      "PAYMENTS_NOT_CONFIGURED",
      "To‘lov xizmati hali sozlanmagan. Qoralamangiz saqlangan.",
    );
  const returnUrl = new URL("/payment/return", process.env.APP_URL).href;
  if (!local && !returnUrl.startsWith("https://"))
    throw new ApiError(
      503,
      "PAYMENTS_NOT_CONFIGURED",
      "To‘lov uchun HTTPS sayt manzili kerak.",
    );
  return {
    base: base.href.replace(/\/$/, ""),
    key: process.env.NODZE_API_KEY,
    returnUrl,
  };
}
export function safeCheckoutUrl(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password)
    throw new ApiError(502, "INVALID_CHECKOUT", "To‘lov havolasi noto‘g‘ri.");
  return url.href;
}
export async function nodzeRequest(
  path: string,
  body?: string,
  key?: string,
): Promise<NodzePayment> {
  const config = nodzeConfig();
  let response: Response;
  try {
    response = await fetch(`${config.base}${path}`, {
      method: body ? "POST" : "GET",
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
      headers: {
        Authorization: `Bearer ${config.key}`,
        Accept: "application/json",
        ...(body
          ? { "Content-Type": "application/json", "Idempotency-Key": key! }
          : {}),
      },
      ...(body ? { body } : {}),
    });
  } catch {
    throw new ApiError(
      503,
      "PAYMENT_UNCERTAIN",
      "Ulanish uzildi. Yangi to‘lov yaratmasdan shu buyurtma bilan qayta urining.",
    );
  }
  if (!response.ok) {
    // Never forward upstream bodies, credentials or URLs into user errors/logs.
    throw new ApiError(
      response.status === 429 ? 429 : 503,
      response.status === 429 ? "PAYMENT_RATE_LIMIT" : "PAYMENT_PROVIDER_ERROR",
      response.status === 429
        ? "Bir daqiqadan so‘ng qayta tekshiring."
        : "To‘lov xizmati so‘rovni bajarmadi. Qoralamangiz saqlangan; shu buyurtma bilan qayta urining.",
    );
  }
  return nodzePaymentSchema.parse(parseNodzeJson(await response.text()));
}
