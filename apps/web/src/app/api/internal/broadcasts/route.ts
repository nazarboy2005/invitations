import { safeEqual } from "@/server/auth/crypto";
import { processAdminBroadcasts } from "@/server/jobs/admin-broadcast";
import { ApiError, privateHeaders } from "@/server/api";
import { adminError } from "@/server/admin";
export const maxDuration = 60;
export async function GET(request: Request) {
  try {
    const secret = process.env.CRON_SECRET;
    if (!secret || secret.length < 32)
      throw new ApiError(503, "NOT_CONFIGURED", "Worker is not configured");
    if (
      !safeEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`)
    )
      throw new ApiError(401, "UNAUTHORIZED", "Unauthorized");
    return Response.json(await processAdminBroadcasts(), {
      headers: privateHeaders,
    });
  } catch (error) {
    return adminError(error);
  }
}
export const POST = GET;
