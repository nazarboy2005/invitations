import { z } from "zod";
import { authenticatedUser, getOwnedInvitation } from "@/server/invitations";
import { verifySameOrigin } from "@/server/auth";
import { ApiError, apiError, privateHeaders, readJson } from "@/server/api";
import {
  createInvitationChange,
  listInvitationChanges,
} from "@/server/invitation-changes";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Context) {
  try {
    const user = await authenticatedUser();
    const id = z.uuid().parse((await params).id);
    if (!(await getOwnedInvitation(id, user.id)))
      throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    return Response.json(
      { requests: await listInvitationChanges(user.id, id) },
      { headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request, { params }: Context) {
  try {
    verifySameOrigin(request);
    const user = await authenticatedUser();
    const id = z.uuid().parse((await params).id);
    const requestId = await createInvitationChange(
      id,
      user.id,
      await readJson(request, 24000),
    );
    return Response.json(
      { id: requestId },
      { status: 201, headers: privateHeaders },
    );
  } catch (error) {
    return apiError(error);
  }
}
