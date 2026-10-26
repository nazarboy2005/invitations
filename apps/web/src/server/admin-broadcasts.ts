import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { requireAdmin, recordAdminChange } from "./admin";
import { ApiError } from "./api";
import { digest } from "./auth/crypto";
import {
  broadcastCreateSchema,
  broadcastActionSchema,
  type AdminBroadcast,
} from "../modules/admin/management-contract";

export async function listAdminBroadcasts(): Promise<AdminBroadcast[]> {
  await requireAdmin();
  const rows = await getDb()`SELECT b.*,u.display_name,
    count(*) FILTER(WHERE r.status='sent')::int AS sent,
    count(*) FILTER(WHERE r.status='failed')::int AS failed,
    count(*) FILTER(WHERE r.status='skipped')::int AS skipped,
    count(*) FILTER(WHERE r.status='uncertain')::int AS uncertain,
    count(*) FILTER(WHERE r.status IN ('pending','processing'))::int AS pending
    FROM admin_broadcasts b JOIN users u ON u.id=b.created_by LEFT JOIN admin_broadcast_recipients r ON r.broadcast_id=b.id
    GROUP BY b.id,u.display_name ORDER BY b.created_at DESC,b.id DESC LIMIT 50`;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    audience: row.audience,
    status: row.status,
    recipientCount: row.recipient_count,
    sent: row.sent,
    failed: row.failed,
    skipped: row.skipped,
    uncertain: row.uncertain,
    pending: row.pending,
    createdAt: new Date(row.created_at).toISOString(),
    actorName: row.display_name,
  }));
}
export async function createAdminBroadcast(
  actorId: string,
  input: z.infer<typeof broadcastCreateSchema>,
) {
  const db = getDb();
  return db.begin(async (tx) => {
    const selectionHash = digest([...input.userIds].sort().join(","));
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${actorId + input.idempotencyKey},0))`;
    const [existing] =
      await tx`SELECT * FROM admin_broadcasts WHERE created_by=${actorId} AND idempotency_key=${input.idempotencyKey}`;
    if (existing) {
      const [audit] =
        await tx`SELECT new_values->>'selectionHash' AS selection_hash FROM admin_audit_log WHERE target_id=${existing.id}::text AND action='broadcast.create' ORDER BY created_at LIMIT 1`;
      if (
        existing.title !== input.title ||
        existing.message !== input.message ||
        existing.audience !== input.audience ||
        (audit?.selection_hash && audit.selection_hash !== selectionHash)
      )
        throw new ApiError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "Bu so‘rov boshqa xabar uchun ishlatilgan.",
        );
      return { id: existing.id, recipientCount: existing.recipient_count };
    }
    const recipients =
      await tx`SELECT u.id FROM users u JOIN telegram_connections tc ON tc.user_id=u.id
      WHERE u.phone_shared_at IS NOT NULL AND u.disabled_at IS NULL AND tc.status='active' AND tc.broadcast_opt_out_at IS NULL AND tc.telegram_chat_id=u.telegram_user_id
      AND (${input.audience}='all' OR (${input.audience}='published' AND EXISTS(SELECT 1 FROM invitations i WHERE i.owner_id=u.id AND i.status='published'))
      OR (${input.audience}='drafts' AND EXISTS(SELECT 1 FROM invitations i WHERE i.owner_id=u.id AND i.status='draft'))
      OR (${input.audience}='selected' AND u.id=ANY(${tx.array(input.userIds)}::uuid[])))
      ORDER BY u.id LIMIT 10001`;
    if (recipients.length > 10000)
      throw new ApiError(
        400,
        "AUDIENCE_TOO_LARGE",
        "Auditoriyani 10 000 foydalanuvchigacha cheklang.",
      );
    const [broadcast] =
      await tx`INSERT INTO admin_broadcasts(created_by,title,message,audience,recipient_count,idempotency_key) VALUES(${actorId},${input.title},${input.message},${input.audience},${recipients.length},${input.idempotencyKey}) RETURNING id`;
    if (recipients.length)
      await tx`INSERT INTO admin_broadcast_recipients ${tx(
        recipients.map((row) => ({
          broadcast_id: broadcast.id,
          user_id: row.id,
        })),
        "broadcast_id",
        "user_id",
      )}`;
    await recordAdminChange(
      tx,
      actorId,
      "broadcast.create",
      broadcast.id,
      null,
      {
        title: input.title,
        audience: input.audience,
        recipientCount: recipients.length,
        selectionHash,
      },
    );
    return { id: broadcast.id, recipientCount: recipients.length };
  });
}
export async function manageAdminBroadcast(
  id: string,
  actorId: string,
  input: z.infer<typeof broadcastActionSchema>,
) {
  return getDb().begin(async (tx) => {
    const [broadcast] =
      await tx`SELECT * FROM admin_broadcasts WHERE id=${id} FOR UPDATE`;
    if (!broadcast) throw new ApiError(404, "NOT_FOUND", "Xabar topilmadi.");
    if (input.action === "confirm") {
      if (input.recipientCount !== broadcast.recipient_count)
        throw new ApiError(
          409,
          "AUDIENCE_CHANGED",
          "Qabul qiluvchilar sonini qayta tekshiring.",
        );
      if (broadcast.status === "queued" || broadcast.status === "completed")
        return { ok: true };
      if (broadcast.status !== "draft" || !broadcast.recipient_count)
        throw new ApiError(
          409,
          "BROADCAST_NOT_READY",
          "Yuborishga tayyor auditoriya yo‘q.",
        );
      await tx`UPDATE admin_broadcasts SET status='queued',confirmed_by=${actorId},confirmed_at=now() WHERE id=${id}`;
    } else {
      if (broadcast.status === "cancelled") return { ok: true };
      if (broadcast.status === "completed")
        throw new ApiError(
          409,
          "ALREADY_COMPLETED",
          "Yuborilgan xabarni qaytarib olib bo‘lmaydi.",
        );
      await tx`UPDATE admin_broadcasts SET status='cancelled',completed_at=now() WHERE id=${id}`;
      await tx`UPDATE admin_broadcast_recipients SET status='skipped',last_error='Campaign cancelled' WHERE broadcast_id=${id} AND status='pending'`;
    }
    await recordAdminChange(
      tx,
      actorId,
      `broadcast.${input.action}`,
      id,
      { status: broadcast.status },
      {
        status: input.action === "confirm" ? "queued" : "cancelled",
        recipientCount: broadcast.recipient_count,
      },
    );
    return { ok: true };
  });
}
