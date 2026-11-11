import type postgres from "postgres";
import type { Invitation } from "@taklifnoma/contracts";
import { paymentIdentityMatches } from "@taklifnoma/contracts/payment";
import { ApiError } from "./api";

/** Every clean download needs a verified purchase for this owner's event. */
export async function assertStaticImageEntitlement(
  sql: postgres.Sql | postgres.TransactionSql,
  invitation: Invitation,
  ownerId: string,
) {
  const orders = await sql`SELECT identity_snapshot FROM payment_orders
    WHERE invitation_id=${invitation.id} AND owner_id=${ownerId}
      AND template_id=${invitation.templateId} AND status='SUCCEEDED'
      AND verified_at IS NOT NULL FOR SHARE`;
  if (
    !orders.some((order) =>
      paymentIdentityMatches(invitation, order.identity_snapshot, {
        // After first export, the server locks identity and permits date/time edits.
        allowStartTimeChange: !!invitation.imageExportedAt,
      }),
    )
  )
    throw new ApiError(
      402,
      "PAYMENT_REQUIRED",
      "PNG rasmni yuklab olish uchun to‘lovni yakunlang.",
    );
}
