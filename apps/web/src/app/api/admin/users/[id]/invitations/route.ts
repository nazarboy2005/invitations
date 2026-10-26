import { z } from "zod";
import { getDb } from "@taklifnoma/database";
import {
  createInvitation,
  defaultLocalizedInvitationContent,
  templateIdSchema,
  type EventType,
} from "@taklifnoma/contracts";
import { requireAdminMutation, adminError } from "@/server/admin";
import { getAdminUser } from "@/server/admin-management";
import { toSessionUser } from "@/server/auth";
import { saveInvitation } from "@/server/invitations";
import { ApiError, privateHeaders, readJson } from "@/server/api";
import { reasonSchema } from "@/modules/admin/management-contract";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireAdminMutation(request),
      id = z.uuid().parse((await params).id),
      input = z
        .object({ templateId: templateIdSchema, reason: reasonSchema })
        .strict()
        .parse(await readJson(request, 5000));
    await getAdminUser(id);
    const [row] =
      await getDb()`SELECT * FROM users WHERE id=${id} AND disabled_at IS NULL AND phone_shared_at IS NOT NULL`;
    if (!row)
      throw new ApiError(
        409,
        "ACCOUNT_UNAVAILABLE",
        "Faol va ro‘yxatdan o‘tgan hisob kerak.",
      );
    const [support] =
      await getDb()`SELECT event_type FROM template_supported_event_types WHERE template_id=${input.templateId} ORDER BY event_type LIMIT 1`;
    if (!support)
      throw new ApiError(
        409,
        "TEMPLATE_UNAVAILABLE",
        "Dizayn uchun tadbir turi belgilanmagan.",
      );
    const invitation = createInvitation(input.templateId);
    invitation.eventType = support.event_type as EventType;
    invitation.content[invitation.defaultLocale] =
      defaultLocalizedInvitationContent(
        invitation.eventType,
        invitation.defaultLocale,
      );
    const saved = await saveInvitation(invitation, toSessionUser(row), {
      actorId: actor.id,
      reason: input.reason,
    });
    return Response.json(
      { id: saved.id },
      { status: 201, headers: privateHeaders },
    );
  } catch (error) {
    return adminError(error);
  }
}
