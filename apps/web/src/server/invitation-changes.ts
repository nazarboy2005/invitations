import { getDb } from "@taklifnoma/database";
import { invitationSchema, type Invitation } from "@taklifnoma/contracts";
import { normalizeInvitation } from "@taklifnoma/contracts/capabilities";
import {
  applyChange,
  changeBase,
  changeRequestSchema,
  type ChangeInput,
  type ChangeRequestView,
} from "@taklifnoma/contracts/changes";
import { lastCeremonyDate, sameValue } from "@taklifnoma/contracts/policies";
import { publicationIssues } from "@taklifnoma/contracts/publication";
import { ApiError } from "./api";
import { recordAdminChange } from "./admin";

function validatedChange(invitation: Invitation, input: ChangeInput) {
  try {
    if (input.type === "postponement" && input.values.secondaryDate) {
      const date = new Date(`${input.values.secondaryDate}T00:00:00Z`);
      if (
        !Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== input.values.secondaryDate
      )
        throw new Error("INVALID_CEREMONY_DATE");
    }
    const next = invitationSchema.parse(
      normalizeInvitation(applyChange(invitation, input)),
    );
    if (
      publicationIssues(next).length ||
      sameValue(
        changeBase(invitation, input.type),
        changeBase(next, input.type),
      )
    )
      throw new Error("NO_VALID_CHANGE");
    // Normalization must never silently turn an unsupported requested value into approval.
    if (
      input.type === "identity" &&
      !sameValue(changeBase(next, "identity"), input.values)
    )
      throw new Error("UNSUPPORTED_CHANGE");
    return next;
  } catch {
    throw new ApiError(
      400,
      "INVALID_CHANGE",
      "Tuzatish qiymatlarini tekshiring. Yangi tadbir uchun yangi taklifnoma yarating.",
    );
  }
}
export async function createInvitationChange(
  id: string,
  ownerId: string,
  raw: unknown,
) {
  const input = changeRequestSchema.parse(raw);
  return getDb().begin(async (tx) => {
    const [row] =
      await tx`SELECT * FROM invitations WHERE id=${id} AND owner_id=${ownerId} AND status<>'deleted' FOR UPDATE`;
    if (!row) throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    if (!row.identity_locked_at && row.status !== "published")
      throw new ApiError(409, "NOT_LOCKED", "Qoralamani bevosita tahrirlang.");
    const invitation = normalizeInvitation(invitationSchema.parse(row.data));
    validatedChange(invitation, input);
    const [pending] =
      await tx`SELECT id FROM invitation_change_requests WHERE invitation_id=${id} AND change_type=${input.type} AND status='pending'`;
    if (pending)
      throw new ApiError(
        409,
        "REQUEST_PENDING",
        "Bu turdagi so‘rov allaqachon ko‘rib chiqilmoqda.",
      );
    const [limit] =
      await tx`INSERT INTO rate_limits(key,count) VALUES(${"correction-request:" + ownerId},1)
      ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.window_start<=now()-interval '1 day' THEN 1 ELSE rate_limits.count+1 END,
      window_start=CASE WHEN rate_limits.window_start<=now()-interval '1 day' THEN now() ELSE rate_limits.window_start END RETURNING count`;
    if (limit.count > 20)
      throw new ApiError(
        429,
        "RATE_LIMITED",
        "Bugungi so‘rovlar limiti tugadi.",
      );
    const proposed = {
      templateId: invitation.templateId,
      base: changeBase(invitation, input.type),
      values: input.values,
    };
    const [request] =
      await tx`INSERT INTO invitation_change_requests(invitation_id,requested_by,change_type,proposed_changes,reason) VALUES(${id},${ownerId},${input.type},${tx.json(proposed)},${input.reason}) RETURNING id`;
    await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,new_values) VALUES(${id},${ownerId},'correction_requested',${tx.json({ requestId: request.id, type: input.type, reason: input.reason })})`;
    return request.id as string;
  });
}
// Caller supplies an authenticated owner or has already required a fresh administrator.
export async function listInvitationChanges(
  ownerId?: string,
  invitationId?: string,
): Promise<ChangeRequestView[]> {
  const rows =
    await getDb()`SELECT c.*,i.data,u.display_name FROM invitation_change_requests c
    JOIN invitations i ON i.id=c.invitation_id JOIN users u ON u.id=i.owner_id
    WHERE i.status<>'deleted' AND (${ownerId ?? null}::uuid IS NULL OR i.owner_id=${ownerId ?? null})
      AND (${invitationId ?? null}::uuid IS NULL OR i.id=${invitationId ?? null})
    ORDER BY (c.status='pending') DESC,c.created_at DESC,c.id DESC LIMIT 100`;
  return rows
    .filter(
      (row) =>
        ["identity", "postponement"].includes(row.change_type) &&
        row.proposed_changes?.values,
    )
    .map((row) => ({
      id: row.id,
      invitationId: row.invitation_id,
      ownerName: row.display_name,
      people:
        row.data.content[row.data.defaultLocale]?.people?.join(" & ") ?? "",
      type: row.change_type,
      status: row.status,
      reason: row.reason,
      reviewNote: row.review_note,
      createdAt: new Date(row.created_at).toISOString(),
      reviewedAt: row.reviewed_at
        ? new Date(row.reviewed_at).toISOString()
        : null,
      before: row.proposed_changes.base,
      values: row.proposed_changes.values,
      timezone: row.data.timezone,
    }));
}
export async function reviewInvitationChange(
  id: string,
  actorId: string,
  decision: "approve" | "reject",
  note: string,
) {
  return getDb().begin(async (tx) => {
    const [reference] =
      await tx`SELECT invitation_id FROM invitation_change_requests WHERE id=${id}`;
    if (!reference) throw new ApiError(404, "NOT_FOUND", "So‘rov topilmadi.");
    // Always lock invitation before request, matching creation/deletion/save order.
    const [row] =
      await tx`SELECT * FROM invitations WHERE id=${reference.invitation_id} AND status<>'deleted' FOR UPDATE`;
    if (!row) throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    const [request] =
      await tx`SELECT * FROM invitation_change_requests WHERE id=${id} FOR UPDATE`;
    if (request.status !== "pending")
      throw new ApiError(
        409,
        "ALREADY_REVIEWED",
        "So‘rov allaqachon ko‘rib chiqilgan.",
      );
    const previous = normalizeInvitation(invitationSchema.parse(row.data));
    let next = previous;
    let deadline = row.edit_deadline_at;
    if (decision === "approve") {
      const input = changeRequestSchema.parse({
        type: request.change_type,
        values: request.proposed_changes.values,
        reason: request.reason,
      });
      if (
        previous.templateId !== request.proposed_changes.templateId ||
        !sameValue(
          changeBase(previous, input.type),
          request.proposed_changes.base,
        )
      )
        throw new ApiError(
          409,
          "STALE_REQUEST",
          "So‘rovdagi avvalgi qiymatlar o‘zgargan. Yangi so‘rov yuborish kerak.",
        );
      next = validatedChange(previous, input);
      if (input.type === "postponement") {
        const [event] =
          await tx`SELECT ((${lastCeremonyDate(next)}::date+1)::timestamp AT TIME ZONE ${next.timezone}) AS deadline,now() AS current_time`;
        if (new Date(event.deadline) <= new Date(event.current_time))
          throw new ApiError(
            400,
            "EVENT_ENDED",
            "Yangi tadbir kuni hali tugamagan bo‘lishi kerak.",
          );
        deadline = event.deadline;
      }
      next = { ...next, revision: previous.revision + 1 };
      await tx`UPDATE invitations SET data=${tx.json(next)},edit_deadline_at=${deadline},approved_event_date=${input.type === "postponement" ? next.startsAt.slice(0, 10) : row.approved_event_date},updated_at=now() WHERE id=${row.id}`;
    }
    await tx`UPDATE invitation_change_requests SET status=${decision === "approve" ? "approved" : "rejected"},reviewed_by=${actorId},reviewed_at=now(),review_note=${note} WHERE id=${id}`;
    const before = {
      values: changeBase(previous, request.change_type),
      editDeadlineAt: row.edit_deadline_at
        ? new Date(row.edit_deadline_at).toISOString()
        : null,
    };
    const after = {
      requestId: id,
      decision,
      note,
      values: changeBase(next, request.change_type),
      editDeadlineAt: deadline ? new Date(deadline).toISOString() : null,
    };
    await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${row.id},${actorId},'correction_reviewed',${tx.json(before)},${tx.json(after)})`;
    await recordAdminChange(
      tx,
      actorId,
      "invitation.review_correction",
      row.id,
      before,
      after,
    );
    return {
      invitationId: row.id as string,
      published: row.status === "published" && decision === "approve",
    };
  });
}
