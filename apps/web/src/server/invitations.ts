import { getDb } from "@taklifnoma/database";
import {
  invitationSchema,
  type Invitation,
  type SessionUser,
} from "@taklifnoma/contracts";
import { assertCreatorCanEdit } from "@taklifnoma/contracts/policies";
import { ApiError } from "./api";
import { getSessionUser } from "./auth";
import { assertPublicMedia, assertPublishable } from "./publication";
import { requireAdmin, recordAdminChange } from "./admin";
import type { AdminInvitationAction } from "./admin-invitation-access";
import { paymentIdentity } from "@taklifnoma/contracts/payment";
export async function authenticatedUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user)
    throw new ApiError(401, "LOGIN_REQUIRED", "Avval Telegram orqali kiring.");
  return user;
}
export async function getOwnedInvitation(
  id: string,
  userId: string,
): Promise<Invitation | null> {
  const rows =
    await getDb()`SELECT data,status FROM invitations WHERE id=${id} AND owner_id=${userId}`;
  return rows[0]
    ? invitationSchema.parse({ ...rows[0].data, status: rows[0].status })
    : null;
}
export async function listInvitations(
  userId: string,
): Promise<Array<Invitation & { createdAt: string; viewCount: number }>> {
  const rows =
    await getDb()`SELECT data,status,created_at,view_count FROM invitations WHERE owner_id=${userId} ORDER BY created_at DESC,id DESC LIMIT 100`;
  return rows.map((row) => ({
    ...invitationSchema.parse({ ...row.data, status: row.status }),
    createdAt: new Date(row.created_at).toISOString(),
    viewCount: Number(row.view_count ?? 0),
  }));
}
export async function saveInvitation(
  invitation: Invitation,
  user: SessionUser,
  admin?: AdminInvitationAction,
): Promise<Invitation> {
  if (admin && (await requireAdmin()).id !== admin.actorId)
    throw new ApiError(403, "FORBIDDEN", "Administrator tasdig‘i kerak.");
  const sql = getDb();
  let saved = invitation;
  await sql.begin(async (tx) => {
    const rows =
      await tx`SELECT * FROM invitations WHERE id=${invitation.id} FOR UPDATE`;
    if (rows[0] && rows[0].owner_id !== user.id)
      throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    const templates = invitation.templateId
      ? await tx`SELECT t.published, EXISTS (SELECT 1 FROM template_supported_event_types s WHERE s.template_id=t.id AND s.event_type=${invitation.eventType}) AS supports_event FROM templates t WHERE t.id=${invitation.templateId}`
      : [];
    if (
      invitation.templateId &&
      !templates[0]?.published &&
      (!rows[0] || rows[0].template_id !== invitation.templateId)
    )
      throw new ApiError(
        409,
        "TEMPLATE_UNAVAILABLE",
        "Bu dizayn hozir mavjud emas. Boshqa dizaynni tanlang.",
      );
    if (invitation.templateId && !templates[0]?.supports_event)
      throw new ApiError(
        409,
        "TEMPLATE_EVENT_MISMATCH",
        "Tanlangan dizayn bu tadbir turini qo‘llamaydi. Mos dizaynni tanlang.",
      );
    if (rows[0]) {
      const previous = invitationSchema.parse(rows[0].data);
      if (
        rows[0].status === "draft" &&
        paymentIdentity(previous) !== paymentIdentity(invitation)
      ) {
        const [order] =
          await tx`SELECT id FROM payment_orders WHERE invitation_id=${invitation.id} AND status NOT IN ('FAILED','CANCELLED','EXPIRED') LIMIT 1`;
        if (order)
          throw new ApiError(
            409,
            "CHECKOUT_IDENTITY_LOCKED",
            "To‘lov boshlangan. Ismlar, sana va dizaynni almashtirish uchun yangi taklifnoma yarating yoki to‘lov holati yakunlanishini kuting.",
          );
      }
      if (previous.revision !== invitation.revision)
        throw new ApiError(
          409,
          "STALE_REVISION",
          "Taklifnoma boshqa oynada o‘zgargan. Qoralamangiz saqlangan; yangilangan nusxani oching.",
        );
      try {
        assertCreatorCanEdit(invitationSchema.parse(rows[0].data), invitation, {
          status: rows[0].status,
          editDeadlineAt: rows[0].edit_deadline_at,
        });
      } catch (error) {
        throw new ApiError(
          403,
          error instanceof Error ? error.message : "EDIT_NOT_ALLOWED",
          "Bu o‘zgarish uchun administrator tasdig‘i kerak.",
        );
      }
      if (rows[0].status === "published") {
        assertPublishable(invitation);
        await assertPublicMedia(tx, invitation, user.id);
      }
      saved = {
        ...invitation,
        slug: rows[0].slug ?? previous.slug,
        revision: previous.revision + 1,
      };
      await tx`UPDATE invitations SET data=${tx.json(saved)},template_id=${invitation.templateId || null},updated_at=now() WHERE id=${invitation.id} AND owner_id=${user.id}`;
    } else {
      if (invitation.status !== "draft")
        throw new ApiError(
          403,
          "DRAFT_REQUIRED",
          "Yangi taklifnoma draft sifatida saqlanadi.",
        );
      saved = { ...invitation, slug: undefined };
      await tx`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${user.id},${invitation.templateId || null},'draft',${tx.json(saved)})`;
    }
    if (admin) {
      await recordAdminChange(
        tx,
        admin.actorId,
        rows[0] ? "invitation.update" : "invitation.create",
        invitation.id,
        rows[0] ? { revision: invitation.revision } : null,
        { ownerId: user.id, revision: saved.revision, reason: admin.reason },
      );
      await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${invitation.id},${admin.actorId},'admin_edit',${tx.json({ revision: invitation.revision })},${tx.json({ revision: saved.revision, reason: admin.reason })})`;
    }
  });
  return saved;
}
export async function getPublishedInvitation(idOrSlug: string) {
  const rows =
    await getDb()`SELECT id,data FROM invitations WHERE (id::text=${idOrSlug} OR slug=${idOrSlug}) AND status='published' LIMIT 1`;
  return rows[0]
    ? {
        id: rows[0].id as string,
        invitation: invitationSchema.parse(rows[0].data),
      }
    : null;
}
