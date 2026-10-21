import { cookies } from "next/headers";
import { getDb } from "@taklifnoma/database";
import {
  authRoute,
  AuthError,
  BROWSER_COOKIE,
  cookieOptions,
  json,
  requireConfigured,
  verifySameOrigin,
} from "@/server/auth";
import { digest, randomToken } from "@/server/auth/crypto";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return authRoute(async () => {
    requireConfigured();
    verifySameOrigin(request);
    const jar = await cookies();
    const browser = jar.get(BROWSER_COOKIE)?.value ?? randomToken(),
      hash = digest(browser);
    const db = getDb();
    const recent =
      await db`SELECT count(*)::int AS count FROM auth_requests WHERE browser_hash=${hash} AND created_at>now()-interval '5 minutes'`;
    if (recent[0].count >= 5)
      throw new AuthError(
        "RATE_LIMITED",
        "Please wait before starting another login",
        429,
      );
    const token = randomToken();
    const [row] =
      await db`INSERT INTO auth_requests(token_hash,browser_hash,expires_at) VALUES(${digest(token)},${hash},now()+interval '5 minutes') RETURNING id`;
    jar.set(BROWSER_COOKIE, browser, cookieOptions(600));
    return json({
      requestId: row.id,
      loginUrl: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME!.replace(/^@/, "")}?start=auth_${token}`,
    });
  });
}
