import { cookies } from "next/headers";
import { getDb } from "@taklifnoma/database";
import {
  authRoute,
  AuthError,
  browserHash,
  cookieOptions,
  json,
  readJson,
  requireConfigured,
  SESSION_COOKIE,
  toSessionUser,
  uuid,
  verifySameOrigin,
} from "@/server/auth";
import { digest, randomToken } from "@/server/auth/crypto";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return authRoute(async () => {
    requireConfigured();
    verifySameOrigin(request);
    const { requestId } = await readJson(request),
      id = uuid(requestId),
      hash = await browserHash();
    const token = randomToken(),
      jar = await cookies(),
      previousToken = jar.get(SESSION_COOKIE)?.value;
    const user = await getDb().begin(async (tx) => {
      const [auth] =
        await tx`SELECT * FROM auth_requests WHERE id=${id} AND browser_hash=${hash} FOR UPDATE`;
      if (
        !auth ||
        auth.state !== "confirmed" ||
        new Date(auth.expires_at).getTime() <= Date.now()
      )
        throw new AuthError(
          "LOGIN_NOT_READY",
          "Login is incomplete, expired, or already used",
          409,
        );
      const [row] =
        await tx`SELECT * FROM users WHERE id=${auth.user_id} AND phone_shared_at IS NOT NULL`;
      if (!row)
        throw new AuthError(
          "PHONE_REQUIRED",
          "Share your own Telegram phone number",
          403,
        );
      if (previousToken)
        await tx`UPDATE sessions SET revoked_at=now() WHERE token_hash=${digest(previousToken)}`;
      await tx`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${row.id},${digest(token)},${request.headers.get("user-agent")?.slice(0, 500) ?? ""},now()+interval '30 days',now()+interval '90 days')`;
      await tx`UPDATE auth_requests SET state='consumed', consumed_at=now() WHERE id=${id}`;
      return toSessionUser(row);
    });
    jar.set(SESSION_COOKIE, token, cookieOptions(30 * 86400));
    return json({ user });
  });
}
