import { cookies } from "next/headers";
import { getDb } from "@taklifnoma/database";
import {
  authRoute,
  cookieOptions,
  currentSession,
  json,
  readJson,
  requireUser,
  SESSION_COOKIE,
  uuid,
  verifySameOrigin,
} from "@/server/auth";
export const runtime = "nodejs";
export async function GET() {
  return authRoute(async () => {
    const user = await requireUser(),
      current = await currentSession();
    const rows =
      await getDb()`SELECT id,user_agent,created_at,last_seen_at,expires_at FROM sessions WHERE user_id=${user.id} AND revoked_at IS NULL AND expires_at>now() AND absolute_expires_at>now() ORDER BY last_seen_at DESC`;
    return json({
      sessions: rows.map((row) => ({
        id: row.id,
        userAgent: row.user_agent,
        createdAt: row.created_at,
        lastSeenAt: row.last_seen_at,
        expiresAt: row.expires_at,
        current: row.id === current?.session_id,
      })),
    });
  });
}
export async function DELETE(request: Request) {
  return authRoute(async () => {
    verifySameOrigin(request);
    const user = await requireUser(),
      body = await readJson(request),
      db = getDb();
    if (body.sessionId)
      await db`UPDATE sessions SET revoked_at=now() WHERE id=${uuid(body.sessionId)} AND user_id=${user.id}`;
    else
      await db`UPDATE sessions SET revoked_at=now() WHERE user_id=${user.id}`;
    const current = await currentSession();
    if (!current) (await cookies()).set(SESSION_COOKIE, "", cookieOptions(0));
    return json({ ok: true });
  });
}
