import { safeEqual } from "@/server/auth/crypto";
import { cleanupAbandonedMedia } from "@/server/media-policy";
import { apiError, privateHeaders } from "@/server/api";
export const runtime = "nodejs";
export const maxDuration = 60;
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
      { expired: await cleanupAbandonedMedia() },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
export const POST = GET;
