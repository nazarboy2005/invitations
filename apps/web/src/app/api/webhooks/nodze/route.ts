import { apiError, readBytes } from "@/server/api";
import { consumeWebhook } from "@/server/payments";
import { after } from "next/server";
import { processPaymentNotifications } from "@/server/payment-notifications";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    const orderId = await consumeWebhook(
      await readBytes(request, 32000),
      request.headers,
    );
    after(async () => {
      await processPaymentNotifications({ orderId, limit: 2 });
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return apiError(error);
  }
}
