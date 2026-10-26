import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import {
  requireAdmin,
  requireAdminMutation,
  recordAdminChange,
  adminError,
} from "@/server/admin";
import { getAdminInvitationOwner } from "@/server/admin-management";
import { getOwnedInvitation } from "@/server/invitations";
import { reasonSchema } from "@/modules/admin/management-contract";
import { ApiError, privateHeaders, readJson } from "@/server/api";
const inputSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("archive"), reason: reasonSchema }).strict(),
  z.object({ action: z.literal("delete"), reason: reasonSchema }).strict(),
  z
    .object({
      action: z.literal("extend_deadline"),
      reason: reasonSchema,
      deadline: z.iso.datetime({ offset: true }),
    })
    .strict(),
]);
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Context) {
  try {
    await requireAdmin();
    const id = z.uuid().parse((await params).id),
      owner = await getAdminInvitationOwner(id);
    return Response.json(
      { owner, invitation: await getOwnedInvitation(id, owner.id) },
      { headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    const actor = await requireAdminMutation(request),
      id = z.uuid().parse((await params).id),
      input = inputSchema.parse(await readJson(request, 5000));
    await getDb().begin(async (tx) => {
      const [row] =
        await tx`SELECT id,owner_id,status,edit_deadline_at FROM invitations WHERE id=${id} FOR UPDATE`;
      if (!row) throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
      if (input.action === "archive") {
        if (row.status !== "published")
          throw new ApiError(
            409,
            "NOT_PUBLISHED",
            "Faqat nashr qilingan taklifnoma yashiriladi.",
          );
        await tx`UPDATE invitations SET status='archived',data=jsonb_set(data,'{status}','"archived"'::jsonb),archived_at=now(),updated_at=now() WHERE id=${id}`;
      } else if (input.action === "delete") {
        if (row.status !== "draft")
          throw new ApiError(
            409,
            "NOT_DRAFT",
            "Faqat qoralamani o‘chirish mumkin.",
          );
        if (
          (
            await tx`SELECT id FROM platform_payments WHERE invitation_id=${id} LIMIT 1`
          ).length
        )
          throw new ApiError(
            409,
            "PAYMENT_HISTORY_EXISTS",
            "To‘lov tarixiga bog‘langan taklifnoma o‘chirilmaydi.",
          );
        await tx`DELETE FROM invitation_change_requests WHERE invitation_id=${id}`;
        await tx`DELETE FROM invitation_audit_log WHERE invitation_id=${id}`;
        await tx`DELETE FROM invitations WHERE id=${id}`;
      } else {
        const deadline = new Date(input.deadline);
        if (
          row.status !== "published" ||
          deadline.getTime() <=
            Math.max(Date.now(), new Date(row.edit_deadline_at ?? 0).getTime())
        )
          throw new ApiError(
            409,
            "INVALID_DEADLINE",
            "Nashr qilingan taklifnoma uchun amaldagi muddatdan keyingi sanani tanlang.",
          );
        await tx`UPDATE invitations SET edit_deadline_at=${deadline},updated_at=now() WHERE id=${id}`;
      }
      await recordAdminChange(
        tx,
        actor.id,
        `invitation.${input.action}`,
        id,
        {
          status: row.status,
          editDeadlineAt: row.edit_deadline_at
            ? new Date(row.edit_deadline_at).toISOString()
            : null,
        },
        {
          reason: input.reason,
          ownerId: row.owner_id,
          ...(input.action === "extend_deadline"
            ? { editDeadlineAt: input.deadline }
            : { status: input.action === "delete" ? "deleted" : "archived" }),
        },
      );
      if (input.action !== "delete")
        await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${id},${actor.id},${"admin_" + input.action},${tx.json({ status: row.status, editDeadlineAt: row.edit_deadline_at })},${tx.json(input)})`;
    });
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch (error) {
    return adminError(error);
  }
}
