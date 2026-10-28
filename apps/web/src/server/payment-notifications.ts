import type postgres from "postgres";
import { getDb } from "@taklifnoma/database";
import {
  formatPrice,
  getContent,
  invitationSchema,
} from "@taklifnoma/contracts";
import {
  paymentStateLabels,
  type PaymentState,
} from "@taklifnoma/contracts/payment";

export type TelegramPaymentOrder = {
  id: string;
  invitation_id: string;
  template_name: string;
  amount_minor: string;
  status: string;
  verified_at: Date | string | null;
  fulfilled_at: Date | string | null;
  invitation_status: string;
  slug: string | null;
  data: unknown;
};

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );

export function paymentTelegramMessage(
  order: TelegramPaymentOrder | null,
  paymentPath = "/payment/return",
) {
  const appUrl = process.env.APP_URL!;
  const paid = order?.status === "SUCCEEDED" && !!order.verified_at;
  const ready =
    paid &&
    !!order.fulfilled_at &&
    order.invitation_status === "published" &&
    /^[A-Za-z0-9]{6}$/.test(order.slug ?? "");
  const parsed = invitationSchema.safeParse(order?.data);
  const title = parsed.success
    ? getContent(parsed.data).people.join(" & ").slice(0, 180)
    : "Taklifnoma";
  const details = order
    ? `\n\n💌 <b>${escapeHtml(title || "Taklifnoma")}</b>\n🎨 Dizayn: ${escapeHtml(order.template_name.slice(0, 100))}\n💳 To‘lov: <b>${escapeHtml(formatPrice(Number(order.amount_minor)))}</b> · Click`
    : "";
  const publicUrl = ready ? new URL(`/i/${order!.slug}`, appUrl).href : null;
  const text = ready
    ? `✅ <b>To‘lov muvaffaqiyatli tasdiqlandi!</b>${details}\n\n🎉 Taklifnomangiz nashr qilindi va mehmonlar uchun tayyor.\n\n🔗 <b>Taklifnoma havolasi:</b>\n<a href="${escapeHtml(publicUrl!)}">${escapeHtml(publicUrl!)}</a>\n\n<i>Ushbu havolani yaqinlaringizga yuborishingiz mumkin.</i>`
    : paid
      ? `✅ <b>To‘lov qabul qilindi</b>${details}\n\nTaklifnomani nashr qilishni yakunlash kerak. Mini App’da tafsilotlarni tekshiring. Taklifnoma tayyor bo‘lgach, havolasini shu yerga yuboramiz.\n\n<b>Qayta to‘lov qilish shart emas.</b>`
      : order && ["FAILED", "CANCELLED", "EXPIRED"].includes(order.status)
        ? `ℹ️ <b>To‘lov yakunlanmagan</b>${details}\n\nTo‘lov tasdiqlanmadi. Buyurtmangizni Mini App’da ko‘rib chiqing.`
        : order &&
            [
              "REJECTED",
              "REFUNDED",
              "PARTIALLY_REFUNDED",
              "REFUND_PENDING",
            ].includes(order.status)
          ? `ℹ️ <b>To‘lov holati</b>${details}\n\nHolat: <b>${escapeHtml(paymentStateLabels[order.status as PaymentState])}</b>\n\nTafsilotlarni Mini App’da ko‘rishingiz mumkin.`
          : order
            ? `⏳ <b>To‘lov tasdig‘i kutilmoqda</b>${details}\n\nClick’dan tasdiq kelgach, taklifnomangizni nashr qilib, havolasini shu chatga yuboramiz.\n\n<i>To‘lov qilgan bo‘lsangiz, qayta to‘lamang.</i>`
            : "💌 <b>Taklifnomalaringiz</b>\n\nBu hisobda tanlangan to‘lov buyurtmasi topilmadi. Mini App’da taklifnomalaringizni ko‘rishingiz mumkin.";
  return {
    parse_mode: "HTML" as const,
    text,
    link_preview_options: { is_disabled: true },
    reply_markup: {
      inline_keyboard: [
        ...(publicUrl
          ? [[{ text: "💌 Taklifnomani ochish", url: publicUrl }]]
          : []),
        [
          {
            text: publicUrl
              ? "📱 Taklifnomalarim"
              : paid
                ? "📱 Nashrni yakunlash"
                : "📱 Buyurtmani ko‘rish",
            web_app: {
              url: new URL(
                publicUrl ? "/dashboard?mode=personal" : paymentPath,
                appUrl,
              ).href,
            },
          },
        ],
      ],
    },
  };
}

export async function botPaymentOrder(
  tx: postgres.TransactionSql,
  userId: string,
  orderId?: string,
) {
  const [order] = await tx<
    TelegramPaymentOrder[]
  >`SELECT p.id,p.invitation_id,p.template_name,p.amount_minor,p.status,p.verified_at,p.fulfilled_at,
    i.status AS invitation_status,i.slug,i.data FROM payment_orders p JOIN invitations i ON i.id=p.invitation_id AND i.owner_id=p.owner_id
    WHERE p.owner_id=${userId} AND (${orderId ?? null}::uuid IS NULL OR p.id=${orderId ?? null})
    ORDER BY p.created_at DESC,p.id DESC LIMIT 1`;
  return order ?? null;
}

/** Commit notification intent alongside verified status/publication, never a network call. */
export async function enqueuePaymentNotifications(
  tx: postgres.TransactionSql,
  invitationId: string,
) {
  await tx`INSERT INTO jobs(type,payload,idempotency_key)
    SELECT 'payment-confirmation',jsonb_build_object('orderId',p.id,'ready',i.status='published' AND p.fulfilled_at IS NOT NULL),'payment-confirmation:'||p.id
    FROM payment_orders p JOIN invitations i ON i.id=p.invitation_id AND i.owner_id=p.owner_id
    WHERE p.invitation_id=${invitationId} AND p.status='SUCCEEDED' AND p.verified_at IS NOT NULL
    ON CONFLICT(idempotency_key) DO NOTHING`;
  // A payment can be verified while publication needs correction. If its first
  // confirmation was queued then, also deliver the link when publication succeeds.
  await tx`INSERT INTO jobs(type,payload,idempotency_key)
    SELECT 'payment-confirmation',jsonb_build_object('orderId',p.id,'ready',true),'payment-ready:'||p.id
    FROM payment_orders p JOIN invitations i ON i.id=p.invitation_id AND i.owner_id=p.owner_id
    WHERE p.invitation_id=${invitationId} AND p.status='SUCCEEDED' AND p.verified_at IS NOT NULL
      AND p.fulfilled_at IS NOT NULL AND i.status='published'
      AND EXISTS(SELECT 1 FROM jobs j WHERE j.idempotency_key='payment-confirmation:'||p.id AND j.payload->>'ready'='false')
    ON CONFLICT(idempotency_key) DO NOTHING`;
}

export type PaymentMessage = ReturnType<typeof paymentTelegramMessage>;
type Delivery =
  | { state: "sent" }
  | { state: "retry"; after: number }
  | { state: "failed" }
  | { state: "uncertain" };
export async function sendPaymentConfirmation(
  chatId: string,
  message: PaymentMessage,
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
      result?: { message_id?: number };
      error_code?: number;
      parameters?: { retry_after?: number };
    };
    if (response.ok && body.ok && Number.isSafeInteger(body.result?.message_id))
      return { state: "sent" };
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
    /* Acceptance may be unknown. Never blindly repeat a send. */
  }
  return { state: "uncertain" };
}

/** Scope request-time delivery to its order/invitation; cron can recover queued jobs. */
export async function processPaymentNotifications(
  options: {
    orderId?: string;
    invitationId?: string;
    limit?: number;
    send?: typeof sendPaymentConfirmation;
  } = {},
) {
  if (!options.send && !process.env.TELEGRAM_BOT_TOKEN) return 0;
  const db = getDb(),
    send = options.send ?? sendPaymentConfirmation;
  const limit = Math.max(1, Math.min(5, options.limit ?? 5));
  let processed = 0;
  for (let index = 0; index < limit; index++) {
    const job = await db.begin(async (tx) => {
      const [row] =
        await tx`SELECT j.id,j.payload,j.attempts,j.status FROM jobs j
        JOIN payment_orders p ON p.id::text=j.payload->>'orderId'
        WHERE j.type='payment-confirmation'
          AND ((${options.orderId ?? null}::uuid IS NULL) OR p.id=${options.orderId ?? null})
          AND ((${options.invitationId ?? null}::uuid IS NULL) OR p.invitation_id=${options.invitationId ?? null})
          AND ((j.status='queued' AND j.available_at<=now()) OR (j.status='processing' AND j.locked_at<now()-interval '2 minutes'))
        ORDER BY (j.payload->>'ready') DESC,j.created_at FOR UPDATE OF j SKIP LOCKED LIMIT 1`;
      if (!row) return null;
      if (row.status === "processing") {
        await tx`UPDATE jobs SET status='uncertain',locked_at=NULL,last_error='Delivery interrupted; acceptance unknown' WHERE id=${row.id}`;
        return { skip: true };
      }
      const [target] =
        await tx`SELECT u.id AS owner_id,tc.telegram_chat_id AS chat_id
        FROM payment_orders p JOIN users u ON u.id=p.owner_id
        JOIN telegram_connections tc ON tc.user_id=u.id AND tc.status='active' AND tc.telegram_chat_id=u.telegram_user_id
        WHERE p.id=${row.payload.orderId} AND p.status='SUCCEEDED' AND p.verified_at IS NOT NULL
          AND u.disabled_at IS NULL AND u.phone_shared_at IS NOT NULL`;
      const order = target
        ? await botPaymentOrder(tx, target.owner_id, row.payload.orderId)
        : null;
      const ready =
        !!order?.fulfilled_at &&
        order.invitation_status === "published" &&
        !!order.slug;
      // When correction completed before delivery, the ready message replaces
      // the obsolete pending-publication receipt rather than sending both.
      const obsolete = row.payload.ready === false && ready;
      if (!target || !order || obsolete || (row.payload.ready && !ready)) {
        await tx`UPDATE jobs SET status='skipped',completed_at=now(),locked_at=NULL WHERE id=${row.id}`;
        return { skip: true };
      }
      await tx`UPDATE jobs SET status='processing',locked_at=now(),attempts=attempts+1 WHERE id=${row.id}`;
      return {
        id: String(row.id),
        attempts: row.attempts + 1,
        chatId: String(target.chat_id),
        order,
      };
    });
    if (!job) break;
    processed++;
    if ("skip" in job) continue;
    let result: Delivery;
    try {
      result = await send(
        job.chatId,
        paymentTelegramMessage(
          job.order,
          `/payment/return?order=${job.order.id}`,
        ),
      );
    } catch {
      result = { state: "uncertain" };
    }
    const status =
      result.state === "sent"
        ? "completed"
        : result.state === "retry" && job.attempts < 8
          ? "queued"
          : result.state === "uncertain"
            ? "uncertain"
            : "failed";
    await db`UPDATE jobs SET status=${status},locked_at=NULL,
      completed_at=CASE WHEN ${status}='completed' THEN now() ELSE NULL END,
      available_at=now()+${result.state === "retry" ? result.after : 0}*interval '1 second',
      last_error=${result.state === "sent" ? null : `Telegram delivery ${result.state}`}
      WHERE id=${job.id} AND status='processing'`;
  }
  return processed;
}
