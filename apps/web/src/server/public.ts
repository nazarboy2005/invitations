import { createHmac, createHash } from "node:crypto";
import { getDb } from "@taklifnoma/database";
import { getPublishedInvitation } from "./invitations";
import { ApiError } from "./api";
export async function publicInvitation(id: string) {
  const result = await getPublishedInvitation(id);
  if (!result) throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
  return result;
}
export async function resolveGuest(invitationId: string, token?: string) {
  if (!token) return null;
  const hash = createHash("sha256").update(token).digest("hex");
  const rows =
    await getDb()`SELECT id,display_name,max_party_size FROM invitation_guests WHERE invitation_id=${invitationId} AND token_hash=${hash} AND revoked_at IS NULL`;
  if (!rows[0])
    throw new ApiError(400, "INVALID_GUEST", "Mehmon havolasi yaroqsiz.");
  return rows[0];
}
export async function submissionLimit(
  request: Request,
  invitationId: string,
  kind: string,
) {
  const secret = process.env.SESSION_SECRET;
  if (!secret)
    throw new ApiError(503, "NOT_CONFIGURED", "Xizmat hozircha mavjud emas.");
  const address =
    (process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")
      : request.headers.get("x-forwarded-for")
    )
      ?.split(",")[0]
      ?.trim() || "local";
  const key = createHmac("sha256", secret)
    .update(`${kind}:${invitationId}:${address}`)
    .digest("hex");
  const [row] =
    await getDb()`INSERT INTO rate_limits(key,count) VALUES(${key},1) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.window_start<now()-interval '1 minute' THEN 1 ELSE rate_limits.count+1 END,window_start=CASE WHEN rate_limits.window_start<now()-interval '1 minute' THEN now() ELSE rate_limits.window_start END RETURNING count`;
  if (row.count > 8)
    throw new ApiError(
      429,
      "RATE_LIMITED",
      "Juda ko‘p so‘rov yuborildi. Biroz kutib qayta urining.",
    );
}
