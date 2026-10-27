import { getDb } from "@taklifnoma/database";
import { z } from "zod";
import { requireAdmin, recordAdminChange } from "./admin";
import { ApiError } from "./api";
import { toSessionUser } from "./auth";
import { hasAdminRole } from "./auth/admin-role";
import { publicInvitationUrl } from "./publication";
import {
  paymentTransitions,
  type AdminUser,
  type AdminInvitation,
  type AdminPayment,
  type PageResult,
  type ManagementFilters,
  paymentCreateSchema,
  paymentUpdateSchema,
  userActionSchema,
} from "../modules/admin/management-contract";

const iso = (value: unknown) =>
  value ? new Date(String(value)).toISOString() : null;
export function managementQuery(filters: ManagementFilters) {
  const parsed = z
    .object({
      q: z.string().trim().max(120).default(""),
      page: z.coerce.number().int().min(1).max(10000).default(1),
      status: z.string().max(30).default(""),
      userId: z.union([z.uuid(), z.literal("")]).default(""),
    })
    .parse(filters);
  return {
    ...parsed,
    search: "%" + parsed.q.replace(/[\\%_]/g, "\\$&") + "%",
    offset: (parsed.page - 1) * 20,
  };
}
function result<T>(items: T[], page: number, total: number): PageResult<T> {
  return { items, page, total, pages: Math.max(1, Math.ceil(total / 20)) };
}
export function adminPublicUrl(slug: unknown) {
  return typeof slug === "string" && /^[0-9A-Za-z]{6}$/.test(slug)
    ? publicInvitationUrl(slug)
    : null;
}
export async function listAdminUsers(
  filters: ManagementFilters,
): Promise<PageResult<AdminUser>> {
  await requireAdmin();
  const q = managementQuery(filters);
  const db = getDb();
  const predicate = db`(u.display_name ILIKE ${q.search} OR coalesce(u.telegram_username,'') ILIKE ${q.search} OR u.telegram_user_id::text ILIKE ${q.search} OR u.id::text=${q.q}) AND (${q.status}='' OR (${q.status}='active' AND u.disabled_at IS NULL) OR (${q.status}='suspended' AND u.disabled_at IS NOT NULL))`;
  const [rows, [count]] = await Promise.all([
    db`SELECT u.id,u.display_name,u.telegram_username,u.telegram_user_id,right(u.phone_number,4) AS phone_last4,u.is_admin,u.disabled_at,u.created_at,
      (SELECT count(*)::int FROM invitations i WHERE i.owner_id=u.id) AS invitations,
      (SELECT count(*)::int FROM invitations i WHERE i.owner_id=u.id AND i.status='published') AS published,
      EXISTS(SELECT 1 FROM telegram_connections tc WHERE tc.user_id=u.id AND tc.status='active' AND tc.broadcast_opt_out_at IS NULL AND tc.telegram_chat_id=u.telegram_user_id) AS reachable
      FROM users u WHERE ${predicate} ORDER BY u.created_at DESC,u.id DESC LIMIT 20 OFFSET ${q.offset}`,
    db`SELECT count(*)::int AS total FROM users u WHERE ${predicate}`,
  ]);
  return result(
    rows.map((row) => ({
      id: row.id,
      name: row.display_name,
      username: row.telegram_username,
      telegramId: String(row.telegram_user_id),
      phoneLast4: row.phone_last4,
      isAdmin: hasAdminRole(row),
      disabledAt: iso(row.disabled_at),
      createdAt: iso(row.created_at)!,
      invitations: row.invitations,
      published: row.published,
      reachable: row.reachable,
    })),
    q.page,
    count.total,
  );
}
export async function listAdminInvitations(
  filters: ManagementFilters,
): Promise<PageResult<AdminInvitation>> {
  await requireAdmin();
  const q = managementQuery(filters),
    db = getDb();
  const predicate = db`(${q.status}='' OR i.status=${q.status}) AND (${q.userId}='' OR i.owner_id::text=${q.userId}) AND (i.id::text=${q.q} OR coalesce(i.slug,'') ILIKE ${q.search} OR u.display_name ILIKE ${q.search} OR (i.data->'content'->(i.data->>'defaultLocale')->'people')::text ILIKE ${q.search})`;
  const [rows, [count]] = await Promise.all([
    db`SELECT i.id,i.owner_id,u.display_name,i.template_id,coalesce(t.name,'Dizayn tanlanmagan') AS template_name,i.data->>'eventType' AS event_type,i.data->>'startsAt' AS starts_at,i.data->'content'->(i.data->>'defaultLocale')->'people' AS people,i.status,i.slug,i.created_at,i.updated_at FROM invitations i JOIN users u ON u.id=i.owner_id LEFT JOIN templates t ON t.id=i.template_id WHERE ${predicate} ORDER BY i.updated_at DESC,i.id DESC LIMIT 20 OFFSET ${q.offset}`,
    db`SELECT count(*)::int AS total FROM invitations i JOIN users u ON u.id=i.owner_id WHERE ${predicate}`,
  ]);
  return result(
    rows.map((row) => ({
      id: row.id,
      ownerId: row.owner_id,
      ownerName: row.display_name,
      templateId: row.template_id ?? "",
      templateName: row.template_name,
      people: Array.isArray(row.people) ? row.people.join(" & ") : "",
      eventType: row.event_type ?? "",
      startsAt: row.starts_at ?? "",
      status: row.status,
      url: adminPublicUrl(row.slug),
      createdAt: iso(row.created_at)!,
      updatedAt: iso(row.updated_at)!,
    })),
    q.page,
    count.total,
  );
}
export async function getAdminUser(id: string) {
  await requireAdmin();
  z.uuid().parse(id);
  const [row] =
    await getDb()`SELECT u.id,u.display_name,u.telegram_user_id,u.telegram_username,u.phone_number,u.disabled_at,u.disabled_reason,u.is_admin,u.created_at,tc.status AS telegram_status,tc.broadcast_opt_out_at FROM users u LEFT JOIN telegram_connections tc ON tc.user_id=u.id WHERE u.id=${id}`;
  if (!row) throw new ApiError(404, "NOT_FOUND", "Foydalanuvchi topilmadi.");
  return {
    id: row.id as string,
    name: String(row.display_name),
    telegramId: String(row.telegram_user_id),
    username: row.telegram_username as string | null,
    phone: row.phone_number as string | null,
    disabledAt: iso(row.disabled_at),
    disabledReason: row.disabled_reason as string | null,
    isAdmin: hasAdminRole(row),
    createdAt: iso(row.created_at)!,
    telegramStatus: row.telegram_status as string | null,
    optedOut: !!row.broadcast_opt_out_at,
  };
}
export async function manageUser(
  id: string,
  actorId: string,
  input: z.infer<typeof userActionSchema>,
) {
  return getDb().begin(async (tx) => {
    const [target] =
      await tx`SELECT id,telegram_user_id,is_admin,disabled_at,disabled_reason FROM users WHERE id=${id} FOR UPDATE`;
    if (!target)
      throw new ApiError(404, "NOT_FOUND", "Foydalanuvchi topilmadi.");
    if (
      target.id === actorId ||
      (hasAdminRole(target) && input.action !== "revoke_sessions")
    )
      throw new ApiError(
        409,
        "PROTECTED_ADMIN",
        "Administrator hisobini bu amal bilan o‘zgartirib bo‘lmaydi.",
      );
    if (input.action === "suspend")
      await tx`UPDATE users SET disabled_at=now(),disabled_reason=${input.reason},updated_at=now() WHERE id=${id}`;
    if (input.action === "restore")
      await tx`UPDATE users SET disabled_at=NULL,disabled_reason=NULL,updated_at=now() WHERE id=${id}`;
    const sessions =
      input.action !== "restore"
        ? await tx`UPDATE sessions SET revoked_at=now() WHERE user_id=${id} AND revoked_at IS NULL RETURNING id`
        : [];
    await recordAdminChange(
      tx,
      actorId,
      `user.${input.action}`,
      id,
      { disabledAt: iso(target.disabled_at) },
      { reason: input.reason, revokedSessions: sessions.length },
    );
    return { ok: true, revokedSessions: sessions.length };
  });
}
export async function listAdminPayments(
  filters: ManagementFilters,
): Promise<PageResult<AdminPayment>> {
  await requireAdmin();
  const q = managementQuery(filters),
    db = getDb();
  const predicate = db`(${q.status}='' OR p.status=${q.status}) AND (${q.userId}='' OR p.owner_id::text=${q.userId}) AND (u.display_name ILIKE ${q.search} OR p.reference ILIKE ${q.search} OR p.id::text=${q.q} OR p.invitation_id::text=${q.q})`;
  const [rows, [count]] = await Promise.all([
    db`SELECT p.*,u.display_name,i.slug FROM admin_payment_records p JOIN users u ON u.id=p.owner_id JOIN invitations i ON i.id=p.invitation_id WHERE ${predicate} ORDER BY p.created_at DESC,p.id DESC LIMIT 20 OFFSET ${q.offset}`,
    db`SELECT count(*)::int AS total FROM admin_payment_records p JOIN users u ON u.id=p.owner_id WHERE ${predicate}`,
  ]);
  return result(
    rows.map((row) => ({
      id: row.id,
      invitationId: row.invitation_id,
      ownerName: row.display_name,
      templateName: row.template_name,
      amountMinor: Number(row.amount_minor),
      method: row.method,
      providerStatus: row.provider_status,
      status: row.status,
      reference: row.reference,
      note: row.note,
      revision: row.revision,
      createdAt: iso(row.created_at)!,
      receivedAt: iso(row.received_at),
      url: adminPublicUrl(row.slug),
    })),
    q.page,
    count.total,
  );
}
export async function createAdminPayment(
  actorId: string,
  input: z.infer<typeof paymentCreateSchema>,
) {
  return getDb().begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${actorId + input.idempotencyKey},0))`;
    const [existing] =
      await tx`SELECT * FROM platform_payments WHERE created_by=${actorId} AND idempotency_key=${input.idempotencyKey}`;
    if (existing) {
      if (
        existing.invitation_id !== input.invitationId ||
        Number(existing.amount_minor) !== input.amountMinor ||
        existing.reference !== input.reference ||
        existing.note !== input.note
      )
        throw new ApiError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "So‘rov boshqa ma’lumot bilan ishlatilgan.",
        );
      return { id: existing.id };
    }
    const [invitation] =
      await tx`SELECT i.owner_id,i.template_id,t.name FROM invitations i JOIN templates t ON t.id=i.template_id WHERE i.id=${input.invitationId} FOR SHARE OF i,t`;
    if (!invitation)
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Dizayni tanlangan taklifnoma topilmadi.",
      );
    const [payment] =
      await tx`INSERT INTO platform_payments(invitation_id,owner_id,template_id,template_name,amount_minor,reference,note,idempotency_key,created_by,updated_by) VALUES(${input.invitationId},${invitation.owner_id},${invitation.template_id},${invitation.name},${input.amountMinor},${input.reference},${input.note},${input.idempotencyKey},${actorId},${actorId}) RETURNING id`;
    await recordAdminChange(tx, actorId, "payment.create", payment.id, null, {
      invitationId: input.invitationId,
      amountMinor: input.amountMinor,
      method: "manual",
      status: "pending",
      reference: input.reference,
      note: input.note,
    });
    return { id: payment.id };
  });
}
export async function updateAdminPayment(
  id: string,
  actorId: string,
  input: z.infer<typeof paymentUpdateSchema>,
) {
  return getDb().begin(async (tx) => {
    const [before] =
      await tx`SELECT * FROM platform_payments WHERE id=${id} FOR UPDATE`;
    if (!before)
      throw new ApiError(404, "NOT_FOUND", "To‘lov yozuvi topilmadi.");
    if (before.revision !== input.revision)
      throw new ApiError(
        409,
        "STALE_REVISION",
        "To‘lov boshqa oynada o‘zgargan. Sahifani yangilang.",
      );
    const status = input.status ?? before.status,
      amount = input.amountMinor ?? Number(before.amount_minor);
    if (
      status !== before.status &&
      !paymentTransitions[
        before.status as keyof typeof paymentTransitions
      ].includes(status)
    )
      throw new ApiError(
        409,
        "INVALID_TRANSITION",
        "To‘lov holatini bu tarzda o‘zgartirib bo‘lmaydi.",
      );
    if (
      amount !== Number(before.amount_minor) &&
      (before.status !== "pending" || status !== "pending")
    )
      throw new ApiError(
        409,
        "AMOUNT_LOCKED",
        "Faqat kutilayotgan to‘lov summasi o‘zgartiriladi.",
      );
    await tx`UPDATE platform_payments SET status=${status},amount_minor=${amount},reference=${input.reference ?? before.reference},note=${input.note},revision=revision+1,updated_by=${actorId},updated_at=now(),received_at=CASE WHEN ${status}='received' THEN COALESCE(received_at,now()) ELSE received_at END,refunded_at=CASE WHEN ${status}='refunded' THEN COALESCE(refunded_at,now()) ELSE refunded_at END WHERE id=${id}`;
    await recordAdminChange(
      tx,
      actorId,
      "payment.update",
      id,
      {
        status: before.status,
        amountMinor: Number(before.amount_minor),
        reference: before.reference,
      },
      {
        status,
        amountMinor: amount,
        reference: input.reference ?? before.reference,
        note: input.note,
      },
    );
    return { ok: true };
  });
}
export async function getAdminInvitationOwner(id: string) {
  z.uuid().parse(id);
  const [row] =
    await getDb()`SELECT u.* FROM invitations i JOIN users u ON u.id=i.owner_id WHERE i.id=${id}`;
  if (!row) throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
  return toSessionUser(row);
}
