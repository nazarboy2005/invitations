import { getDb } from "@taklifnoma/database";
import {
  authRoute,
  AuthError,
  browserHash,
  json,
  requireConfigured,
  toSessionUser,
  uuid,
} from "@/server/auth";
export const runtime = "nodejs";
export async function GET(request: Request) {
  return authRoute(async () => {
    requireConfigured();
    const id = uuid(new URL(request.url).searchParams.get("requestId")),
      hash = await browserHash();
    const [row] =
      await getDb()`SELECT a.state,a.expires_at,u.* FROM auth_requests a LEFT JOIN users u ON u.id=a.user_id WHERE a.id=${id} AND a.browser_hash=${hash}`;
    if (!row) throw new AuthError("NOT_FOUND", "Login request not found", 404);
    const state =
      new Date(row.expires_at).getTime() <= Date.now() ? "expired" : row.state;
    return json({
      state,
      user: state === "confirmed" ? toSessionUser(row) : null,
    });
  });
}
