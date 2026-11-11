import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Invitation } from "../../packages/contracts/src/index";
import { paymentIdentity } from "../../packages/contracts/src/payment";

// Disposable test records only. Never contacts a provider or grants app-level bypasses.
export async function grantTestPurchase(
  sql: postgres.Sql | postgres.TransactionSql,
  invitation: Invitation,
  ownerId: string,
) {
  const id = randomUUID();
  await sql`INSERT INTO payment_orders
    (id,invitation_id,owner_id,template_id,template_name,identity_snapshot,amount_minor,currency,request_body,idempotency_key,status,verified_at,fulfilled_at)
    SELECT ${id},${invitation.id},${ownerId},id,name,${paymentIdentity(invitation)},GREATEST(price_minor,1),'UZS','{}',${"disposable-test:" + id},'SUCCEEDED',now(),now()
    FROM templates WHERE id=${invitation.templateId}`;
}

export async function deleteTestPurchases(
  sql: postgres.Sql | postgres.TransactionSql,
  invitationIds: string[],
) {
  await sql`DELETE FROM jobs WHERE type='payment-confirmation' AND payload->>'orderId' IN
    (SELECT id::text FROM payment_orders WHERE invitation_id=ANY(${sql.array(invitationIds)}::uuid[]))`;
  await sql`DELETE FROM payment_webhook_events WHERE order_id IN
    (SELECT id FROM payment_orders WHERE invitation_id=ANY(${sql.array(invitationIds)}::uuid[]))`;
  await sql`DELETE FROM payment_orders WHERE invitation_id=ANY(${sql.array(invitationIds)}::uuid[])`;
}
