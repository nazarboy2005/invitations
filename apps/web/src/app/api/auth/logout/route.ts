import { cookies } from "next/headers";
import { getDb } from "@taklifnoma/database";
import {
  authRoute,
  cookieOptions,
  json,
  requireConfigured,
  SESSION_COOKIE,
  verifySameOrigin,
} from "@/server/auth";
import { digest } from "@/server/auth/crypto";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return authRoute(async () => {
    requireConfigured();
    verifySameOrigin(request);
    const jar = await cookies(),
      token = jar.get(SESSION_COOKIE)?.value;
    if (token)
      await getDb()`UPDATE sessions SET revoked_at=now() WHERE token_hash=${digest(token)}`;
    jar.set(SESSION_COOKIE, "", cookieOptions(0));
    return json({ ok: true });
  });
}
