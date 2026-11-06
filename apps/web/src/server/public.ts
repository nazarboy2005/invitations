import { createHmac, createHash } from "node:crypto";
import { getDb } from "@taklifnoma/database";
import { getPublishedInvitation } from "./invitations";
import { ApiError } from "./api";
import { clientAddress, enforceRateLimit } from "./rate-limit";
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
  await enforceRateLimit({
    scope: `public-submission:${kind}:${invitationId}`,
    identity: clientAddress(request),
    maximum: kind === "receipt" ? 3 : kind === "wish" ? 5 : 8,
    windowSeconds: 60,
    message: "Juda ko‘p so‘rov yuborildi. Biroz kutib qayta urining.",
  });
}
