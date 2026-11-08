import { safeEqual } from "@/server/auth/crypto";
import { processGuestNotifications } from "@/server/guest-notifications";
import { apiError, privateHeaders } from "@/server/api";

export const runtime = "nodejs";
export const maxDuration = 180;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (
    !secret ||
    secret.length < 32 ||
    !safeEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`)
  )
    return new Response(null, { status: 401 });
  try {
    return Response.json(
      { processed: await processGuestNotifications() },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
export const POST = GET;
