import { NextResponse } from "next/server";
import { z } from "zod";
import { invitationSchema } from "@taklifnoma/contracts";
import {
  authenticatedUser,
  getOwnedInvitation,
  saveInvitation,
} from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Context) {
  try {
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    const invitation = await getOwnedInvitation(id, user.id);
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
    if (!(await getOwnedInvitation(id, user.id)))
      throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    return NextResponse.json(
      { invitation: await saveInvitation(invitation, user) },
      { headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}
