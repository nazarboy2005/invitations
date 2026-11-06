import { cookies } from "next/headers";
import { getDb } from "@taklifnoma/database";
import {
  authRoute,
  BROWSER_COOKIE,
  cookieOptions,
  json,
  requireConfigured,
  verifySameOrigin,
} from "@/server/auth";
import { digest, randomToken } from "@/server/auth/crypto";
import { clientAddress, enforceRateLimit } from "@/server/rate-limit";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return authRoute(async () => {
    requireConfigured();
    verifySameOrigin(request);
    const jar = await cookies();
    const browser = jar.get(BROWSER_COOKIE)?.value ?? randomToken(),
      hash = digest(browser);
    await enforceRateLimit({
      scope: "telegram-login-start:ip",
      identity: clientAddress(request),
      maximum: 20,
      windowSeconds: 300,
      code: "RATE_LIMITED",
      message: "Please wait before starting another login",
    });
    await enforceRateLimit({
      scope: "telegram-login-start:browser",
      identity: hash,
      maximum: 5,
      windowSeconds: 300,
      code: "RATE_LIMITED",
      message: "Please wait before starting another login",
    });
    const db = getDb();
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
