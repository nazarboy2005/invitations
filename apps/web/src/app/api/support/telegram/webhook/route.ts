import { createHash, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

const START_MESSAGE =
  "Assalomu alaykum! Fotiha haqida savolingizni yozing, tez orada javob beraman. 🌿";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const token = process.env.SUPPORT_TELEGRAM_BOT_TOKEN;
  if (!token) return Response.json({ error: "Not configured" }, { status: 503 });

  const webhookSecret = createHash("sha256").update(token).digest("hex");
  if (
    !safeEqual(
      request.headers.get("x-telegram-bot-api-secret-token") ?? "",
      webhookSecret,
    )
  )
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  let update: {
    message?: { chat?: { id?: number; type?: string }; text?: string };
  };
  try {
    update = await request.json();
  } catch {
    return Response.json({ error: "Invalid update" }, { status: 400 });
  }

  const chat = update.message?.chat;
  if (
    chat?.type !== "private" ||
    !chat.id ||
    !/^\/start(?:@[A-Za-z0-9_]+)?(?:\s|$)/.test(update.message?.text ?? "")
  )
    return Response.json({ ok: true });

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat.id, text: START_MESSAGE }),
      signal: AbortSignal.timeout(10000),
    },
  );
  const result = (await response.json()) as { ok?: boolean };
  if (!response.ok || !result.ok)
    return Response.json({ error: "Telegram delivery failed" }, { status: 502 });

  return Response.json({ ok: true });
}
