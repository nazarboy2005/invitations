import { cookies } from "next/headers";
import { getDb } from "@taklifnoma/database";
import {
  authRoute,
  cookieOptions,
  currentSession,
  json,
  missingAuthConfig,
  SESSION_COOKIE,
  toSessionUser,
} from "@/server/auth";
export const runtime = "nodejs";
export async function GET() {
  return authRoute(async () => {
    const missing = missingAuthConfig();
    if (missing.length) return json({ user: null, configured: false });
    const row = await currentSession();
    if (row) {
      // Renewal is capped at an absolute 90 days, so inactivity and absolute expiry remain enforceable.
      const expires = new Date(
        Math.min(
          Date.now() + 30 * 86400000,
          new Date(row.absolute_expires_at).getTime(),
        ),
      );
      await getDb()`UPDATE sessions SET last_seen_at=now(),expires_at=${expires} WHERE id=${row.session_id} AND revoked_at IS NULL`;
      const jar = await cookies(),
        token = jar.get(SESSION_COOKIE)?.value;
      if (token)
        jar.set(
          SESSION_COOKIE,
          token,
          cookieOptions(
            Math.max(0, Math.floor((expires.getTime() - Date.now()) / 1000)),
          ),
        );
    }
    return json({ user: row ? toSessionUser(row) : null, configured: true });
  });
}
