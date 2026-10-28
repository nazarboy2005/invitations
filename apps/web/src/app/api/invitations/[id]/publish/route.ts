import { NextResponse, after } from "next/server";
import { z } from "zod";
import { authenticatedUser } from "@/server/invitations";
import { publishInvitation } from "@/server/publication";
import { verifySameOrigin } from "@/server/auth";
import { apiError, privateHeaders, readJson } from "@/server/api";
import { invitationRequestActor } from "@/server/admin-invitation-access";
import { processPaymentNotifications } from "@/server/payment-notifications";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const { id } = await params;
    z.uuid().parse(id);
    const { revision } = z
      .object({ revision: z.number().int().positive() })
      .strict()
      .parse(await readJson(request, 1000));
    const access = await invitationRequestActor(request, id, user, true);
    const publication = await publishInvitation(
      id,
      revision,
      access.owner,
      undefined,
      access.admin,
    );
    after(async () => {
      await processPaymentNotifications({ invitationId: id, limit: 2 });
    });
    return NextResponse.json(publication, {
      headers: privateHeaders,
    });
  } catch (error) {
    return apiError(error);
  }
}
