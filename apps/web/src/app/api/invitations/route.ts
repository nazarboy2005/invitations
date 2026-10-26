import { NextResponse } from "next/server";
import { z } from "zod";
import { invitationSchema } from "@taklifnoma/contracts";
import {
  authenticatedUser,
  listInvitations,
  saveInvitation,
} from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { apiError, privateHeaders, readJson } from "@/server/api";
import { invitationRequestActor } from "@/server/admin-invitation-access";
export const runtime = "nodejs";
export async function GET() {
  try {
    const user = await authenticatedUser();
    return NextResponse.json(
      { invitations: await listInvitations(user.id) },
      { headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { invitation } = z
      .object({ invitation: invitationSchema })
      .parse(await readJson(request));
    z.uuid().parse(invitation.id);
    const access = await invitationRequestActor(
      request,
      invitation.id,
      user,
      true,
    );
    return NextResponse.json(
      {
        invitation: await saveInvitation(
          invitation,
          access.owner,
          access.admin,
        ),
      },
      { status: 201, headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}
