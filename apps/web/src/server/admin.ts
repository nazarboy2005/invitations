import type { JSONValue, TransactionSql } from "postgres";
import { getDb } from "@taklifnoma/database";
import { currentSession, toSessionUser, verifySameOrigin } from "./auth";
import { ApiError, apiError, privateHeaders } from "./api";
import { assertAdminSession } from "./admin-policy";

/** Re-read database session/identity and evaluate server role policy; never cache authority. */
export async function requireAdmin(fresh = true) {
  return toSessionUser(assertAdminSession(await currentSession(), fresh));
}

export async function requireAdminMutation(request: Request, fresh = true) {
  verifySameOrigin(request);
  if (request.headers.get("sec-fetch-site") === "cross-site")
    throw new ApiError(
      403,
      "INVALID_ORIGIN",
      "So‘rov manbasi ruxsat etilmagan.",
    );
  const user = await requireAdmin(fresh);
  // Durable, atomic, per-account limit shared by every application instance.
  const [limit] = await getDb()`
    INSERT INTO rate_limits(key,count) VALUES(${"admin-write:" + user.id},1)
    ON CONFLICT(key) DO UPDATE SET
      count=CASE WHEN rate_limits.window_start<=now()-interval '1 minute' THEN 1 ELSE rate_limits.count+1 END,
      window_start=CASE WHEN rate_limits.window_start<=now()-interval '1 minute' THEN now() ELSE rate_limits.window_start END
    RETURNING count`;
  if (limit.count > 30)
    throw new ApiError(
      429,
      "RATE_LIMITED",
      "Juda ko‘p o‘zgarish yuborildi. Bir daqiqadan so‘ng qayta urining.",
    );
  return user;
}

export function adminError(error: unknown) {
  const response = apiError(error);
  for (const [key, value] of Object.entries(privateHeaders))
    response.headers.set(key, value);
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  if (error instanceof ApiError && error.status === 429)
    response.headers.set("Retry-After", "60");
  return response;
}

type AdminAction =
  | "template.update"
  | "category.create"
  | "category.update"
  | "music.create"
  | "music.update"
  | "user.suspend"
  | "user.restore"
  | "user.revoke_sessions"
  | "payment.create"
  | "payment.update"
  | "broadcast.create"
  | "broadcast.confirm"
  | "broadcast.cancel"
  | "invitation.create"
  | "invitation.update"
  | "invitation.publish"
  | "invitation.archive"
  | "invitation.delete"
  | "invitation.extend_deadline"
  | "invitation.moderate"
  | "invitation.upload";

export async function recordAdminChange(
  tx: TransactionSql,
  actorId: string,
  action: AdminAction,
  targetId: string,
  before: Record<string, JSONValue | undefined> | null,
  after: Record<string, JSONValue | undefined>,
) {
  await tx`INSERT INTO admin_audit_log(actor_id,action,target_id,previous_values,new_values)
    VALUES(${actorId},${action},${targetId},${before ? tx.json(before) : null},${tx.json(after)})`;
}

export async function getAdminAudit() {
  await requireAdmin();
  const rows =
    await getDb()`SELECT a.id,a.action,a.target_id,a.previous_values,a.new_values,a.created_at,u.display_name AS actor_name
    FROM admin_audit_log a JOIN users u ON u.id=a.actor_id ORDER BY a.created_at DESC,a.id DESC LIMIT 50`;
  return rows.map((row) => ({
    id: String(row.id),
    action: String(row.action),
    targetId: String(row.target_id),
    actorName: String(row.actor_name),
    createdAt: new Date(row.created_at).toISOString(),
    before: row.previous_values as Record<string, unknown> | null,
    after: row.new_values as Record<string, unknown>,
  }));
}
