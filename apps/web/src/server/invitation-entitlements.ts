import type postgres from "postgres";
import { invitationSchema, type Invitation } from "@taklifnoma/contracts";
import {
  paymentIdentity,
  paymentIdentityMatches,
  type PaymentOrderView,
} from "@taklifnoma/contracts/payment";
import { hasAdminRole } from "./auth/admin-role";

type Sql = postgres.Sql | postgres.TransactionSql;
type MatchOptions = { allowStartTimeChange?: boolean };

/** Caller supplies an authenticated owner ID, never a request's role/owner fields. */
export async function isAdminInvitationOwner(sql: Sql, ownerId: string) {
  const [account] =
    await sql`SELECT is_admin,telegram_user_id,disabled_at FROM users WHERE id=${ownerId} FOR SHARE`;
  return !!account && hasAdminRole(account);
}

export async function hasInvitationEntitlement(
  sql: Sql,
  invitation: Invitation,
  ownerId: string,
  options: MatchOptions = {},
) {
  const orders = await sql`SELECT identity_snapshot FROM payment_orders
    WHERE invitation_id=${invitation.id} AND owner_id=${ownerId}
      AND template_id=${invitation.templateId} AND status='SUCCEEDED'
      AND verified_at IS NOT NULL FOR SHARE`;
  if (
    orders.some((order) =>
      paymentIdentityMatches(invitation, order.identity_snapshot, options),
    )
  )
    return true;
  return !!(await findAdminInvitationGrant(sql, invitation, ownerId, options));
}

export async function findAdminInvitationGrant(
  sql: Sql,
  invitation: Invitation,
  ownerId: string,
  options: MatchOptions = {},
) {
  const [grant] = await sql`SELECT * FROM admin_invitation_grants
    WHERE invitation_id=${invitation.id} AND owner_id=${ownerId}
      AND template_id=${invitation.templateId} FOR SHARE`;
  return grant &&
    paymentIdentityMatches(invitation, grant.identity_snapshot, options)
    ? grant
    : null;
}

/** Run inside the publication/download/checkout transaction. No session role is trusted. */
export async function grantAdminInvitationAccess(
  tx: postgres.TransactionSql,
  invitation: Invitation,
  ownerId: string,
) {
  // Serialize issuance on the invitation; hold the account lock while granting access.
  const [owned] = await tx`SELECT data FROM invitations
    WHERE id=${invitation.id} AND owner_id=${ownerId} AND status<>'deleted' FOR UPDATE`;
  if (
    !owned ||
    !paymentIdentityMatches(
      invitation,
      paymentIdentity(invitationSchema.parse(owned.data)),
    )
  )
    return null;
  const existing = await findAdminInvitationGrant(tx, invitation, ownerId, {
    allowStartTimeChange: !!invitation.imageExportedAt,
  });
  if (existing) return existing;
  if (!(await isAdminInvitationOwner(tx, ownerId))) return null;
  const [grant] = await tx`INSERT INTO admin_invitation_grants
    (invitation_id,owner_id,template_id,template_name,identity_snapshot,quoted_amount_minor)
    SELECT ${invitation.id},${ownerId},id,name,${paymentIdentity(invitation)},price_minor
    FROM templates WHERE id=${invitation.templateId} AND published=true AND price_minor>0
    ON CONFLICT (invitation_id) DO NOTHING RETURNING *`;
  if (grant)
    await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,new_values)
      VALUES(${invitation.id},${ownerId},'admin_access_granted',${tx.json({ grantId: grant.id, templateId: invitation.templateId })})`;
  return grant ?? null;
}

/** Same private success contract as checkout; no fabricated provider payment or revenue. */
export function adminGrantOrderView(
  grant: Record<string, unknown>,
  url: string | null,
): PaymentOrderView {
  return {
    id: String(grant.id),
    invitationId: String(grant.invitation_id),
    templateName: String(grant.template_name),
    amountMinor: Number(grant.quoted_amount_minor),
    status: "SUCCEEDED",
    checkoutUrl: null,
    url,
    publicationError: null,
  };
}
