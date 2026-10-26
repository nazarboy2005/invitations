import type { SessionUser } from "@taklifnoma/contracts";
import { requireAdmin, requireAdminMutation } from "./admin";
import { getAdminInvitationOwner } from "./admin-management";
import { ApiError } from "./api";
import { reasonSchema } from "../modules/admin/management-contract";
export type AdminInvitationAction = { actorId: string; reason: string };
export async function invitationRequestActor(
  request: Request,
  id: string,
  user: SessionUser,
  mutation = false,
) {
  const target = request.headers.get("x-admin-invitation");
  if (!target) return { owner: user, admin: undefined };
  if (target !== id)
    throw new ApiError(
      400,
      "ADMIN_CONTEXT_MISMATCH",
      "Administrator taklifnoma konteksti mos kelmadi.",
    );
  const admin = mutation
    ? await requireAdminMutation(request)
    : await requireAdmin();
  if (admin.id !== user.id)
    throw new ApiError(403, "FORBIDDEN", "Hisob mos kelmadi.");
  let reason = "Administrator ko‘rishi";
  if (mutation) {
    try {
      reason = reasonSchema
        .max(500)
        .parse(decodeURIComponent(request.headers.get("x-admin-reason") ?? ""));
    } catch {
      throw new ApiError(
        400,
        "ADMIN_REASON_REQUIRED",
        "Administrator amalining sababini kiriting (kamida 5 belgi).",
      );
    }
  }
  return {
    owner: await getAdminInvitationOwner(id),
    admin: { actorId: admin.id, reason },
  };
}
