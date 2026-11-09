import { createHash } from "node:crypto";
import { getDb } from "@taklifnoma/database";
import { getPublishedInvitation } from "./invitations";
import { ApiError } from "./api";
import { clientAddress, enforceRateLimit } from "./rate-limit";
import { digest, randomToken } from "./auth/crypto";
import { mediaBudget } from "./media-policy";

export const PUBLIC_VISITOR_COOKIE = "taklifnoma_rsvp";

export function publicVisitorToken(request: Request) {
  const prefix = `${PUBLIC_VISITOR_COOKIE}=`;
  const raw = request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix))
    ?.slice(prefix.length);
  return raw && /^[a-zA-Z0-9_-]{43}$/.test(raw) ? raw : undefined;
}

// Consume aggregate budgets only after Turnstile succeeds: unverified requests
// must not exhaust the shared invitation budget for legitimate guests.
export async function verifiedSubmissionLimit(
  request: Request,
  invitationId: string,
  kind: string,
) {
  await enforceRateLimit({
    scope: "verified-guest-ip",
    identity: clientAddress(request),
    maximum: 60,
    windowSeconds: 60,
  });
  await enforceRateLimit({
    scope: `verified-guests:${kind}`,
    identity: invitationId,
    maximum:
      kind === "receipt"
        ? mediaBudget("RECEIPTS_PER_INVITATION_MINUTE", 60)
        : mediaBudget("SUBMISSIONS_PER_INVITATION_MINUTE", 300),
    windowSeconds: 60,
  });
  await enforceRateLimit({
    scope: "verified-guests-daily",
    identity: invitationId,
    maximum: mediaBudget("SUBMISSIONS_PER_INVITATION_DAY", 10_000),
    windowSeconds: 86400,
  });
}

export function publicVisitorIdentity(
  invitationId: string,
  guest: { id?: unknown } | null,
  token: string,
) {
  return digest(`${invitationId}:${guest ? `guest:${guest.id}` : token}`);
}

export function newPublicVisitorToken() {
  return randomToken();
}
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
