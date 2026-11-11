import type postgres from "postgres";
import type { Invitation } from "@taklifnoma/contracts";
import { paymentIdentityMatches } from "@taklifnoma/contracts/payment";
import { ApiError } from "./api";

/** Existing finalized cards keep repeat downloads and approved practical edits. */
export async function assertStaticImageEntitlement(
  sql: postgres.Sql | postgres.TransactionSql,
  invitation: Invitation,
  ownerId: string,
) {
  if (invitation.imageExportedAt) return;
  const mode = process.env.PUBLISHING_MODE ?? "free";
  if (mode === "free") return;
  if (mode !== "paid")
    throw new ApiError(
      503,
      "PUBLISHING_UNAVAILABLE",
      "Yuklab olish vaqtincha mavjud emas.",
    );
  const [template] =
    await sql`SELECT price_minor FROM templates WHERE id=${invitation.templateId} FOR SHARE`;
  if (template && Number(template.price_minor) === 0) return;
  const orders = await sql`SELECT identity_snapshot FROM payment_orders
    WHERE invitation_id=${invitation.id} AND owner_id=${ownerId}
      AND template_id=${invitation.templateId} AND status='SUCCEEDED'
      AND verified_at IS NOT NULL FOR SHARE`;
  if (
    !orders.some((order) =>
      paymentIdentityMatches(invitation, order.identity_snapshot),
    )
  )
    throw new ApiError(
      402,
      "PAYMENT_REQUIRED",
      "PNG rasmni yuklab olish uchun to‘lovni yakunlang.",
    );
}
