import { randomUUID } from "node:crypto";
import { getDb } from "@taklifnoma/database";
import { broadcastDeliveryText } from "../../modules/admin/management-contract";
import { hasAdminRole } from "../auth/admin-role";

export type BroadcastDelivery =
  | { state: "sent"; messageId: number }
  | { state: "retry"; retryAfter: number }
  | { state: "failed"; code: number }
  | { state: "uncertain" };
export async function sendBroadcastMessage(
  chatId: string,
  message: string,
): Promise<BroadcastDelivery> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Telegram is not configured");
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: broadcastDeliveryText(message),
          link_preview_options: { is_disabled: true },
        }),
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
      return { state: "sent", messageId: body.result!.message_id! };
    if (
      body.ok === false &&
      (body.error_code === 429 || response.status === 429)
    )
      return {
        state: "retry",
        retryAfter: Math.min(
          86400,
          Math.max(1, Number(body.parameters?.retry_after) || 60),
        ),
      };
    if (body.ok === false)
      return { state: "failed", code: body.error_code ?? response.status };
    return { state: "uncertain" };
  } catch {
    return { state: "uncertain" };
  }
}

/** Network ambiguity is never blindly retried: Telegram has no send idempotency key. */
export async function processAdminBroadcasts(
  options: {
    limit?: number;
    broadcastId?: string;
    send?: typeof sendBroadcastMessage;
    pause?: (ms: number) => Promise<void>;
  } = {},
) {
  const db = getDb(),
    owner = randomUUID(),
    limit = Math.max(1, Math.min(5, options.limit ?? 5));
  const send = options.send ?? sendBroadcastMessage,
    pause =
      options.pause ??
      ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const [lease] =
    await db`INSERT INTO admin_worker_leases(name,owner,expires_at) VALUES('broadcast',${owner},now()+interval '60 seconds') ON CONFLICT(name) DO UPDATE SET owner=EXCLUDED.owner,expires_at=EXCLUDED.expires_at WHERE admin_worker_leases.expires_at<now() RETURNING owner`;
  if (!lease) return { processed: 0, busy: true };
  let processed = 0,
    cooldown = 0;
  try {
    await db`UPDATE admin_broadcast_recipients SET status='uncertain',last_error='Delivery interrupted; acceptance unknown',locked_at=NULL WHERE status='processing' AND locked_at<now()-interval '2 minutes' AND (${options.broadcastId ?? ""}='' OR broadcast_id::text=${options.broadcastId ?? ""})`;
    for (let index = 0; index < limit; index++) {
      const job = await db.begin(async (tx) => {
        const [owned] =
          await tx`UPDATE admin_worker_leases SET expires_at=now()+interval '60 seconds' WHERE name='broadcast' AND owner=${owner} AND expires_at>now() RETURNING owner`;
        if (!owned) return null;
        const [row] =
          await tx`SELECT r.broadcast_id,r.user_id,r.attempts,b.message,b.confirmed_by FROM admin_broadcast_recipients r JOIN admin_broadcasts b ON b.id=r.broadcast_id WHERE b.status='queued' AND r.status='pending' AND r.available_at<=now() AND (${options.broadcastId ?? ""}='' OR b.id::text=${options.broadcastId ?? ""}) ORDER BY b.created_at,r.user_id FOR UPDATE OF r,b SKIP LOCKED LIMIT 1`;
        if (!row) return null;
        const [authority] =
          await tx`SELECT id,telegram_user_id,is_admin FROM users WHERE id=${row.confirmed_by} AND disabled_at IS NULL FOR SHARE`;
        if (!authority || !hasAdminRole(authority)) {
          await tx`UPDATE admin_broadcasts SET status='cancelled',completed_at=now() WHERE id=${row.broadcast_id}`;
          await tx`UPDATE admin_broadcast_recipients SET status='skipped',last_error='Authorizing administrator unavailable' WHERE broadcast_id=${row.broadcast_id} AND status='pending'`;
          return { skip: true as const };
        }
        const [target] =
          await tx`SELECT tc.telegram_chat_id FROM users u JOIN telegram_connections tc ON tc.user_id=u.id WHERE u.id=${row.user_id} AND u.disabled_at IS NULL AND u.phone_shared_at IS NOT NULL AND tc.status='active' AND tc.broadcast_opt_out_at IS NULL AND tc.telegram_chat_id=u.telegram_user_id`;
        if (!target) {
          await tx`UPDATE admin_broadcast_recipients SET status='skipped',last_error='Recipient unavailable or unsubscribed' WHERE broadcast_id=${row.broadcast_id} AND user_id=${row.user_id}`;
          return { skip: true as const };
        }
        await tx`UPDATE admin_broadcast_recipients SET status='processing',locked_at=now(),attempts=attempts+1 WHERE broadcast_id=${row.broadcast_id} AND user_id=${row.user_id}`;
        return {
          broadcast_id: String(row.broadcast_id),
          user_id: String(row.user_id),
          message: String(row.message),
          attempts: Number(row.attempts),
          chatId: String(target.telegram_chat_id),
          skip: false as const,
        };
      });
      if (!job) break;
      processed++;
      if (job.skip) continue;
      // Recheck cancellation after claim, immediately before contacting Telegram.
      const [active] =
        await db`SELECT id FROM admin_broadcasts WHERE id=${job.broadcast_id} AND status='queued'`;
      if (!active) {
        await db`UPDATE admin_broadcast_recipients SET status='skipped',locked_at=NULL,last_error='Campaign cancelled' WHERE broadcast_id=${job.broadcast_id} AND user_id=${job.user_id}`;
        continue;
      }
      let delivery: BroadcastDelivery;
      try {
        delivery = await send(job.chatId, job.message);
      } catch {
        delivery = { state: "uncertain" };
      }
      if (delivery.state === "sent")
        await db`UPDATE admin_broadcast_recipients SET status='sent',sent_at=now(),locked_at=NULL,telegram_message_id=${delivery.messageId},last_error=NULL WHERE broadcast_id=${job.broadcast_id} AND user_id=${job.user_id}`;
      else if (delivery.state === "retry") {
        cooldown = Math.min(86400, Math.max(1, delivery.retryAfter));
        await db`UPDATE admin_broadcast_recipients SET status=${job.attempts >= 4 ? "failed" : "pending"},locked_at=NULL,available_at=now()+${cooldown}*interval '1 second',last_error='Telegram rate limit' WHERE broadcast_id=${job.broadcast_id} AND user_id=${job.user_id}`;
        break;
      } else {
        await db`UPDATE admin_broadcast_recipients SET status=${delivery.state},locked_at=NULL,last_error=${delivery.state === "failed" ? `Telegram rejected (${delivery.code})` : "Telegram acceptance unknown; no automatic retry"} WHERE broadcast_id=${job.broadcast_id} AND user_id=${job.user_id}`;
        if (delivery.state === "failed" && delivery.code === 403)
          await db`UPDATE telegram_connections SET status='blocked',updated_at=now() WHERE user_id=${job.user_id}`;
      }
      if (index < limit - 1) await pause(350);
    }
    await db`UPDATE admin_broadcasts b SET status='completed',completed_at=now() WHERE b.status='queued' AND (${options.broadcastId ?? ""}='' OR b.id::text=${options.broadcastId ?? ""}) AND NOT EXISTS(SELECT 1 FROM admin_broadcast_recipients r WHERE r.broadcast_id=b.id AND r.status IN ('pending','processing'))`;
    return { processed, busy: false };
  } finally {
    await db`UPDATE admin_worker_leases SET expires_at=now()+${cooldown}*interval '1 second' WHERE name='broadcast' AND owner=${owner}`;
  }
}
