import { NextResponse, after } from "next/server";
import { preparePublishedCover } from "@/server/published-cover";
import { z } from "zod";
import { invitationSchema } from "@taklifnoma/contracts";
import { getDb } from "@taklifnoma/database";
import { deleteInvitation } from "@/server/delete-invitation";
import {
  authenticatedUser,
  getOwnedInvitation,
  saveInvitation,
} from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
import { invitationRequestActor } from "@/server/admin-invitation-access";
export const runtime = "nodejs";
export const maxDuration = 60;
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
    const saved = await saveInvitation(invitation, access.owner, access.admin);
    if (saved.status === "published")
      after(() => preparePublishedCover({ invitationId: id }));
    return NextResponse.json(
      {
        invitation: saved,
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
      await deleteInvitation(tx, id, user.id);
    });
    return NextResponse.json({ ok: true }, { headers: privateHeaders });
  } catch (e) {
    return apiError(e);
  }
}
