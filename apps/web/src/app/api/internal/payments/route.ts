import { timingSafeEqual } from "node:crypto";
import { apiError, privateHeaders } from "@/server/api";
import { reconcilePayments } from "@/server/payments";
export const runtime = "nodejs";
export const maxDuration = 180;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  if (
    !secret ||
    secret.length < 32 ||
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  )
    return new Response(null, { status: 401 });
  try {
    return Response.json(await reconcilePayments(), {
      headers: privateHeaders,
    });
  } catch (error) {
    return apiError(error);
  }
}
