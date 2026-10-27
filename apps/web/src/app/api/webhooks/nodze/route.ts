import { apiError, readBytes } from "@/server/api";
import { consumeWebhook } from "@/server/payments";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await consumeWebhook(await readBytes(request, 32000), request.headers);
    return new Response(null, { status: 204 });
  } catch (error) {
    return apiError(error);
  }
}
