import { NextResponse } from "next/server";
import { z } from "zod";
import { invitationSchema } from "@taklifnoma/contracts";
import { getDb } from "@taklifnoma/database";
import {
  authenticatedUser,
  getOwnedInvitation,
  saveInvitation,
} from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
import { invitationRequestActor } from "@/server/admin-invitation-access";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, { params }: Context) {
  try {
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    const access = await invitationRequestActor(request, id, user);
    const invitation = await getOwnedInvitation(id, access.owner.id);
    if (!invitation)
      throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    return NextResponse.json({ invitation }, { headers: privateHeaders });
  } catch (e) {
    return apiError(e);
  }
}
export async function PUT(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    const { invitation } = z
      .object({ invitation: invitationSchema })
      .parse(await readJson(request));
    if (id !== invitation.id)
      throw new ApiError(400, "ID_MISMATCH", "Taklifnoma mos kelmadi.");
    const access = await invitationRequestActor(request, id, user, true);
    if (!(await getOwnedInvitation(id, access.owner.id)))
      throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    return NextResponse.json(
      {
        invitation: await saveInvitation(
          invitation,
          access.owner,
          access.admin,
        ),
      },
      { headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    await getDb().begin(async (tx) => {
      const found =
        await tx`SELECT status FROM invitations WHERE id=${id} AND owner_id=${user.id} FOR UPDATE`;
      if (!found.length)
        throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
      if (found[0].status !== "draft")
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
      await tx`DELETE FROM invitations WHERE id=${id} AND owner_id=${user.id}`;
    });
    return NextResponse.json({ ok: true }, { headers: privateHeaders });
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    z.object({ action: z.literal("unpublish") })
      .strict()
      .parse(await readJson(request, 1000));
    await getDb().begin(async (tx) => {
      const rows =
        await tx`SELECT status FROM invitations WHERE id=${id} AND owner_id=${user.id} FOR UPDATE`;
      if (!rows.length)
        throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
      if (rows[0].status !== "published")
        throw new ApiError(
          409,
          "NOT_PUBLISHED",
          "Faqat nashr qilingan taklifnomani yashirish mumkin.",
        );
      await tx`UPDATE invitations SET status='archived',data=jsonb_set(data,'{status}','"archived"'::jsonb),archived_at=now(),updated_at=now() WHERE id=${id} AND owner_id=${user.id}`;
      await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${id},${user.id},'unpublished',${tx.json({ status: "published" })},${tx.json({ status: "archived" })})`;
    });
    return NextResponse.json({ ok: true }, { headers: privateHeaders });
  } catch (e) {
    return apiError(e);
  }
}
