import {
  authRoute,
  AuthError,
  json,
  readJson,
  requireConfigured,
} from "@/server/auth";
import { safeEqual } from "@/server/auth/crypto";
import { processTelegramUpdate } from "@/server/auth/telegram";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return authRoute(async () => {
    requireConfigured();
    if (
      !safeEqual(
        request.headers.get("x-telegram-bot-api-secret-token") ?? "",
        process.env.TELEGRAM_WEBHOOK_SECRET!,
      )
    )
      throw new AuthError("UNAUTHORIZED", "Invalid webhook secret", 401);
    await processTelegramUpdate(await readJson(request));
    return json({ ok: true });
  });
}
