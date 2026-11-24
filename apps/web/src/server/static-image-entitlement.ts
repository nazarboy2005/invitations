import type postgres from "postgres";
import type { Invitation } from "@taklifnoma/contracts";
import { ApiError } from "./api";
import { hasInvitationEntitlement, isAdminInvitationOwner } from "./invitation-entitlements";

/** A current admin may render; durable access is granted under the finalization lock. */
export async function assertStaticImageEntitlement(
  sql: postgres.Sql | postgres.TransactionSql,
  invitation: Invitation,
  ownerId: string,
) {
  if (
    !await hasInvitationEntitlement(sql, invitation, ownerId, {
      allowStartTimeChange: !!invitation.imageExportedAt,
    }) && !await isAdminInvitationOwner(sql, ownerId)
  )
    throw new ApiError(
      402,
      "PAYMENT_REQUIRED",
      "PNG rasmni yuklab olish uchun to‘lovni yakunlang.",
    );
}
