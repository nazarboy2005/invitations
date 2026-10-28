import type postgres from "postgres";
import { ApiError } from "./api";

// Keep referenced financial and guest records; never expose a deleted row as an
// invitation or allow a late payment callback to publish it again.
export async function deleteInvitation(
  tx: postgres.TransactionSql,
  id: string,
  ownerId: string,
  actorId = ownerId,
) {
  const [row] =
    await tx`SELECT status FROM invitations WHERE id=${id} AND owner_id=${ownerId} FOR UPDATE`;
  if (!row || row.status === "deleted")
    throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
  await tx`UPDATE invitations SET status='deleted',deleted_at=now(),updated_at=now() WHERE id=${id}`;
  await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${id},${actorId},'deleted',${tx.json({ status: row.status })},${tx.json({ status: "deleted" })})`;
}
