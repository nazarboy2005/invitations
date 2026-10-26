import { getDb } from "@taklifnoma/database";
import { cookies } from "next/headers";
import {
  authRoute,
  AuthError,
  issueSession,
  json,
  readJson,
  requireConfigured,
  toSessionUser,
  verifySameOrigin,
  currentSession,
  SESSION_COOKIE,
  cookieOptions,
} from "@/server/auth";
import { verifyMiniAppLaunch } from "@/server/auth/crypto";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return authRoute(async () => {
    requireConfigured();
    verifySameOrigin(request);
    const { initData } = await readJson(request);
    if (typeof initData !== "string")
      throw new AuthError("INVALID_INPUT", "Telegram launch data required");
    const existing = await currentSession();
    let launch;
    try {
      launch = verifyMiniAppLaunch(
        initData,
        process.env.TELEGRAM_BOT_TOKEN!,
        Date.now(),
        existing ? String(existing.telegram_user_id) : undefined,
      );
    } catch {
      throw new AuthError(
        "INVALID_TELEGRAM_DATA",
        "Reopen the Mini App to sign in",
        401,
      );
    }
    const identity = launch.user;
    const sameAccount =
      existing && String(existing.telegram_user_id) === String(identity.id);
    if (existing && !sameAccount)
      (await cookies()).set(SESSION_COOKIE, "", {
        ...cookieOptions(0),
        expires: new Date(0),
      });
    const db = getDb();
    const [user] =
      await db`SELECT * FROM users WHERE telegram_user_id=${String(identity.id)}`;
    if (!user?.phone_shared_at)
      return json(
        {
          user: null,
          phoneRequired: true,
          botUrl: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME!.replace(/^@/, "")}?start=phone`,
        },
        403,
      );
    const used =
      await db`INSERT INTO miniapp_exchanges(init_hash,expires_at) VALUES(${launch.replayKey},now()+interval '5 minutes') ON CONFLICT DO NOTHING RETURNING init_hash`;
    if (sameAccount) return json({ user: toSessionUser(existing) });
    if (!used.length)
      throw new AuthError(
        "LAUNCH_ALREADY_USED",
        "Reopen the Mini App to refresh your login",
        409,
      );
    await issueSession(String(user.id));
    return json({ user: toSessionUser(user) });
  });
}
