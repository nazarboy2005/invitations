import { after } from "next/server";
import { z } from "zod";
import { requireAdminMutation, adminError } from "@/server/admin";
import { privateHeaders, readJson } from "@/server/api";
import { reviewInvitationChange } from "@/server/invitation-changes";
import { preparePublishedCover } from "@/server/published-cover";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireAdminMutation(request);
    const id = z.uuid().parse((await params).id);
    const input = z
      .object({
        decision: z.enum(["approve", "reject"]),
        note: z.string().trim().min(5).max(1000),
      })
      .strict()
      .parse(await readJson(request, 5000));
    const result = await reviewInvitationChange(
      id,
      actor.id,
      input.decision,
      input.note,
    );
    if (result.published)
      after(() => preparePublishedCover({ invitationId: result.invitationId }));
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch (error) {
    return adminError(error);
  }
}
