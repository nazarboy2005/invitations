import { getDb } from "@taklifnoma/database";

type WishNotification = {
  wishId: string;
  name: string;
  message: string;
  invitationName: string;
  invitationId: string;
  chatId: string | number;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

export async function sendWishNotification(input: WishNotification) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  if (process.env.TELEGRAM_WISH_STICKER_ID) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendSticker`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: input.chatId,
        sticker: process.env.TELEGRAM_WISH_STICKER_ID,
      }),
      signal: AbortSignal.timeout(10000),
    }).catch(() => undefined);
  }
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: input.chatId,
      parse_mode: "HTML",
      text: `💌 <b>Yangi mehmon tilagi</b>\n\n💍 <b>Taklifnoma:</b> ${escapeHtml(input.invitationName.slice(0, 100))}\n👤 <b>Mehmon:</b> ${escapeHtml(input.name.slice(0, 80))}\n\n❝${escapeHtml(input.message.slice(0, 500))}❞\n\nQuyidagi tugmalar orqali tilakni boshqaring.`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Tasdiqlash", callback_data: `wish_approve:${input.wishId}` },
            { text: "❌ Rad etish va o‘chirish", callback_data: `wish_delete:${input.wishId}` },
          ],
          [{
            text: "Faollik sahifasi",
            web_app: { url: new URL(`/dashboard/${encodeURIComponent(input.invitationId)}/activity`, process.env.APP_URL).href },
          }],
        ],
      },
      link_preview_options: { is_disabled: true },
    }),
    signal: AbortSignal.timeout(10000),
  });
  const result = await response.json() as { ok?: boolean; error_code?: number };
  if (!response.ok || !result.ok) {
    const error = new Error(`Telegram sendMessage failed (${result.error_code ?? response.status})`) as Error & { telegramCode?: number };
    error.telegramCode = result.error_code ?? response.status;
    throw error;
  }
}

/** Claim and deliver a batch. Errors are persisted with bounded exponential retry. */
export async function processWishNotifications(limit = 20) {
  const db = getDb();
  const jobs = await db.begin(async (tx) => {
    const claimed = await tx`
      SELECT id,payload FROM jobs
      WHERE type='wish-notification'
        AND ((status='queued' AND available_at<=now()) OR (status='processing' AND locked_at<now()-interval '2 minutes'))
      ORDER BY created_at
      FOR UPDATE SKIP LOCKED LIMIT ${limit}`;
    if (!claimed.length) return [];
    await tx`UPDATE jobs SET status='processing',locked_at=now(),attempts=attempts+1 WHERE id IN ${tx(claimed.map((job) => job.id))}`;
    return claimed as unknown as Array<{ id: string; payload: { wishId: string }; attempts: number }>;
  });
  for (const job of jobs) {
    try {
      const [target] = await db`
        SELECT w.id,w.name,w.message,i.id AS invitation_id,
          i.data->'content' AS content,
          tc.telegram_chat_id AS chat_id
        FROM wishes w JOIN invitations i ON i.id=w.invitation_id
        JOIN users u ON u.id=i.owner_id
        JOIN telegram_connections tc ON tc.user_id=u.id AND tc.status='active'
        WHERE w.id=${job.payload.wishId} AND w.status='pending' AND w.deleted_at IS NULL AND i.status<>'deleted'`;
      if (target) {
        const content = target.content as Record<string, { people?: string[] }>;
        const people = content?.["uz-Latn"]?.people ?? content?.uz?.people ?? content?.["uz-Cyrl"]?.people ?? [];
        const invitationName = people.join(" & ") || "Taklifnoma";
        await sendWishNotification({
          wishId: target.id,
          name: target.name,
          message: target.message,
          invitationName,
          invitationId: target.invitation_id,
          chatId: target.chat_id,
        });
      }
      await db`UPDATE jobs SET status='completed',completed_at=now(),locked_at=NULL,last_error=NULL WHERE id=${job.id}`;
    } catch (error) {
      const code = (error as { telegramCode?: number }).telegramCode;
      // Telegram 403 means the owner blocked the bot or has not opened it.
      // Retrying cannot fix that and should not bury the queue.
      const permanent = code === 403;
      await db`UPDATE jobs SET status=${permanent || job.attempts >= 12 ? "failed" : "queued"},locked_at=NULL,available_at=now()+LEAST(3600,POWER(2,LEAST(attempts,10))*15)*interval '1 second',last_error=${error instanceof Error ? error.message.slice(0,500) : "Delivery failed"} WHERE id=${job.id}`;
    }
  }
  return jobs.length;
}
