import type postgres from "postgres";
import { getDb } from "@taklifnoma/database";

export type GuestNotification = {
  invitationId: string;
  recordId: string;
  name: string;
} & (
  | { kind: "response"; status: "yes" | "no" | "maybe"; note: string }
  | { kind: "wish"; message: string }
  | { kind: "receipt" }
  | {
      kind: "intention";
      amount: string;
      currencyLabel: string;
      message: string;
    }
);

function escape(value: string, limit: number) {
  return value
    .slice(0, limit)
    .replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
}

/** Keep guest text escaped and messages small. Private receipt files stay on the website. */
export function guestTelegramMessage(
  input: GuestNotification,
  invitationName: string,
  appUrl: string,
  pendingWish = true,
) {
  const titles = {
    response: "Yangi javob",
    wish: "Yangi tilak",
    receipt: "To‘yona cheki",
    intention: "Sovg‘a niyati",
  };
  const lines = [
    `<b>${titles[input.kind]}</b> · ${escape(invitationName, 100)}`,
    escape(input.name, 100),
  ];
  if (input.kind === "response") {
    lines.push(
      { yes: "Kelaman", no: "Kela olmayman", maybe: "Aniq emas" }[input.status],
    );
    if (input.note) lines.push(escape(input.note, 500));
  }
  if (input.kind === "wish") lines.push(escape(input.message, 1000));
  if (input.kind === "receipt")
    lines.push("Chek yuborildi. Pul tushganini tekshiring.");
  if (input.kind === "intention") {
    lines.push(
      `${escape(input.amount, 30)} ${escape(input.currencyLabel, 30)} · niyat, pul o‘tkazilmagan`,
    );
    if (input.message) lines.push(escape(input.message, 500));
  }
  const url = new URL(
    `/dashboard/${encodeURIComponent(input.invitationId)}/activity`,
    appUrl,
  );
  const activityButton =
    url.protocol === "https:"
      ? { text: "Faollik", web_app: { url: url.href } }
      : { text: "Faollik", url: url.href };
  return {
    parse_mode: "HTML",
    text: lines.join("\n"),
    reply_markup: {
      inline_keyboard: [
        ...(input.kind === "wish" && pendingWish
          ? [
              [
                {
                  text: "Tasdiqlash",
                  callback_data: `wish_approve:${input.recordId}`,
                },
                {
                  text: "O‘chirish",
                  callback_data: `wish_delete:${input.recordId}`,
                },
              ],
            ]
          : []),
        [activityButton],
      ],
    },
    link_preview_options: { is_disabled: true },
  };
}

type Delivery =
  | { state: "sent" | "failed" | "uncertain" }
  | { state: "retry"; after: number };
export async function sendGuestNotification(
  chatId: string,
  message: ReturnType<typeof guestTelegramMessage>,
): Promise<Delivery> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, ...message }),
        signal: AbortSignal.timeout(10000),
      },
    );
    const body = (await response.json()) as {
      ok?: boolean;
      error_code?: number;
      parameters?: { retry_after?: number };
    };
    if (response.ok && body.ok) return { state: "sent" };
    if (
      body.ok === false &&
      (body.error_code === 429 || response.status === 429)
    )
      return {
        state: "retry",
        after: Math.min(
          86400,
          Math.max(1, Number(body.parameters?.retry_after) || 60),
        ),
      };
    if (body.ok === false && (body.error_code ?? response.status) >= 500)
      return { state: "retry", after: 60 };
    if (body.ok === false) return { state: "failed" };
  } catch {
    /* Telegram may have accepted the message; do not blindly send it twice. */
  }
  return { state: "uncertain" };
}

/** Always call in the same transaction as the visitor's saved submission. */
export async function enqueueGuestNotification(
  tx: postgres.TransactionSql,
  input: GuestNotification,
  idempotencyKey: string,
) {
  const [job] = await tx`INSERT INTO jobs(type,payload,idempotency_key)
    VALUES('guest-notification',${tx.json(input)},${idempotencyKey})
    ON CONFLICT(idempotency_key) DO NOTHING RETURNING id`;
  return job?.id as string | undefined;
}

/** Request-time delivery is scoped to its job; the independent runner recovers retries. */
export async function processGuestNotifications(
  options: {
    jobId?: string;
    limit?: number;
    send?: typeof sendGuestNotification;
  } = {},
) {
  if (!options.send && !process.env.TELEGRAM_BOT_TOKEN) return 0;
  const db = getDb();
  const send = options.send ?? sendGuestNotification;
  const limit = Math.max(1, Math.min(5, options.limit ?? 5));
  let processed = 0;
  for (let index = 0; index < limit; index++) {
    const claimed = await db.begin(async (tx) => {
      const [job] = await tx`SELECT id,type,payload,attempts,status FROM jobs
        WHERE type IN ('guest-notification','wish-notification')
          AND (${options.jobId ?? null}::uuid IS NULL OR id=${options.jobId ?? null})
          AND ((status='queued' AND available_at<=now()) OR (status='processing' AND locked_at<now()-interval '2 minutes'))
        ORDER BY created_at,id FOR UPDATE SKIP LOCKED LIMIT 1`;
      if (!job) return null;
      if (job.status === "processing") {
        await tx`UPDATE jobs SET status='uncertain',locked_at=NULL,last_error='Delivery interrupted; acceptance unknown' WHERE id=${job.id}`;
        return { skip: true as const };
      }
      let input = job.payload as GuestNotification;
      // Preserve compatibility with wishes queued before this worker existed.
      if (job.type === "wish-notification") {
        const [wish] =
          await tx`SELECT invitation_id,name,message,id FROM wishes WHERE id=${job.payload.wishId}`;
        if (!wish) {
          await tx`UPDATE jobs SET status='skipped',completed_at=now() WHERE id=${job.id}`;
          return { skip: true as const };
        }
        input = {
          kind: "wish",
          invitationId: wish.invitation_id,
          recordId: wish.id,
          name: wish.name,
          message: wish.message,
        };
      }
      const [target] =
        await tx`SELECT i.data,tc.telegram_chat_id AS chat_id,u.disabled_at,
        EXISTS(SELECT 1 FROM wishes WHERE id::text=${input.recordId} AND invitation_id=i.id AND deleted_at IS NULL AND status<>'deleted') AS wish_exists,
        EXISTS(SELECT 1 FROM wishes WHERE id::text=${input.recordId} AND status='pending') AS pending_wish,
        EXISTS(SELECT 1 FROM rsvp_responses WHERE id::text=${input.recordId} AND invitation_id=i.id) AS response_exists,
        EXISTS(SELECT 1 FROM gift_receipts WHERE id::text=${input.recordId} AND invitation_id=i.id) AS receipt_exists,
        EXISTS(SELECT 1 FROM pulau_gift_intentions WHERE id::text=${input.recordId} AND invitation_id=i.id) AS intention_exists
        FROM invitations i JOIN users u ON u.id=i.owner_id
        LEFT JOIN telegram_connections tc ON tc.user_id=u.id AND tc.status='active' AND tc.telegram_chat_id=u.telegram_user_id
        WHERE i.id=${input.invitationId} AND i.status<>'deleted'`;
      const exists =
        target &&
        {
          wish: target.wish_exists,
          response: target.response_exists,
          receipt: target.receipt_exists,
          intention: target.intention_exists,
        }[input.kind];
      if (!exists || target.disabled_at) {
        await tx`UPDATE jobs SET status='skipped',completed_at=now(),locked_at=NULL WHERE id=${job.id}`;
        return { skip: true as const };
      }
      if (!target.chat_id || job.attempts >= 12) {
        await tx`UPDATE jobs SET status='failed',locked_at=NULL,last_error=${!target.chat_id ? "Owner has no active Telegram connection" : "Retry limit reached"} WHERE id=${job.id}`;
        return { skip: true as const };
      }
      const content = target.data.content;
      const locale = target.data.defaultLocale;
      const invitationName =
        (content?.[locale]?.people ?? content?.["uz-Latn"]?.people ?? [])
          .filter(Boolean)
          .join(" & ") || "Taklifnoma";
      await tx`UPDATE jobs SET status='processing',locked_at=now(),attempts=attempts+1 WHERE id=${job.id}`;
      return {
        skip: false as const,
        id: job.id as string,
        attempts: Number(job.attempts) + 1,
        chatId: String(target.chat_id),
        message: guestTelegramMessage(
          input,
          invitationName,
          process.env.APP_URL!,
          target.pending_wish,
        ),
      };
    });
    if (!claimed) break;
    processed++;
    if (claimed.skip) continue;
    const result = await send(claimed.chatId, claimed.message).catch(() => ({
      state: "uncertain" as const,
    }));
    if (result.state === "sent") {
      await db`UPDATE jobs SET status='completed',completed_at=now(),locked_at=NULL,last_error=NULL WHERE id=${claimed.id}`;
    } else if (result.state === "retry" && claimed.attempts < 12) {
      await db`UPDATE jobs SET status='queued',locked_at=NULL,available_at=now()+${result.after}*interval '1 second',last_error='Telegram temporarily unavailable' WHERE id=${claimed.id}`;
    } else {
      await db`UPDATE jobs SET status=${result.state === "uncertain" ? "uncertain" : "failed"},locked_at=NULL,last_error=${result.state === "uncertain" ? "Telegram acceptance unknown; manual review required" : "Telegram rejected delivery or retry limit reached"} WHERE id=${claimed.id}`;
    }
  }
  return processed;
}
