import { NextResponse, after } from "next/server";
import { preparePublishedCover } from "@/server/published-cover";
import { z } from "zod";
import { getDb } from "@taklifnoma/database";
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
export const maxDuration = 60;
export async function GET() {
  try {
    const user = await authenticatedUser();
    return NextResponse.json(
      {
        invitations: await listInvitations(user.id),
        deletedIds: (
          await getDb()`SELECT id FROM invitations WHERE owner_id=${user.id} AND status='deleted'`
        ).map((row) => row.id),
      },
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
    const saved = await saveInvitation(invitation, access.owner, access.admin);
    if (saved.status === "published")
      after(() => preparePublishedCover({ invitationId: saved.id }));
    return NextResponse.json(
      { invitation: saved },
      { status: 201, headers: privateHeaders },
    );
  } catch (e) {
    return apiError(e);
  }
}
