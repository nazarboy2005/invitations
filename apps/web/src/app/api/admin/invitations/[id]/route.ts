import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import { deleteInvitation } from "@/server/delete-invitation";
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
      if (!row || row.status === "deleted")
        throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
      if (input.action === "delete") {
        await deleteInvitation(tx, id, row.owner_id, actor.id);
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
            : { status: "deleted" }),
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
