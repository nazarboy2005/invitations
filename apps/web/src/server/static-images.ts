import { getDb } from "@taklifnoma/database";
import {
  invitationSchema,
  templateById,
  type Locale,
  type SessionUser,
} from "@taklifnoma/contracts";
import { normalizeInvitation } from "@taklifnoma/contracts/capabilities";
import { ApiError } from "./api";
import { getOwnedInvitation } from "./invitations";
import { assertPublishable } from "./publication";
import { renderStaticImage } from "./static-image-renderer";
import { staticInvitationQrUrl } from "./static-location-links";
import { invitationImageFilename } from "@/modules/static-images/filename";
import { clientAddress, enforceRateLimit } from "./rate-limit";
import { assertStaticImageEntitlement } from "./static-image-entitlement";

export async function staticImageLimit(
  request: Request,
  kind: "preview" | "download",
  userId?: string,
) {
  await enforceRateLimit({
    scope: `static-image:${kind}`,
    identity: userId || clientAddress(request),
    maximum: 12,
    windowSeconds: 60,
    message: "Juda ko‘p so‘rov. Birozdan so‘ng qayta urining.",
  });
}

/** Verified download entitlement is separate from website publication. */
export async function downloadStaticImage(
  id: string,
  revision: number,
  locale: Locale,
  owner: SessionUser,
) {
  const stored = await getOwnedInvitation(id, owner.id);
  if (!stored) throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
  const invitation = normalizeInvitation(stored);
  if (templateById(invitation.templateId)?.format !== "image")
    throw new ApiError(400, "NOT_IMAGE", "Bu rasm taklifnoma emas.");
  if (invitation.revision !== revision)
    throw new ApiError(
      409,
      "STALE_REVISION",
      "Taklifnomani yangilab qayta saqlang.",
    );
  if (!invitation.enabledLocales.includes(locale))
    throw new ApiError(400, "INVALID_LOCALE", "Bu til yoqilmagan.");
  assertPublishable(invitation);
  const sql = getDb();
  // Reject unpaid requests before QR allocation or expensive PNG rendering.
  await assertStaticImageEntitlement(sql, invitation, owner.id);
  const qrUrl = await staticInvitationQrUrl(invitation, locale);
  const bytes = await renderStaticImage(invitation, locale, false, qrUrl);
  let exportedAt = stored.imageExportedAt;
  await sql.begin(async (tx) => {
    const [row] =
      await tx`SELECT * FROM invitations WHERE id=${id} AND owner_id=${owner.id} AND status='draft' FOR UPDATE`;
    if (!row) throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
    const current = invitationSchema.parse(row.data);
    if (
      current.revision !== revision ||
      current.templateId !== invitation.templateId
    )
      throw new ApiError(
        409,
        "STALE_REVISION",
        "Taklifnoma o‘zgardi. Yangilab qayta urinib ko‘ring.",
      );
    const [template] =
      await tx`SELECT published,EXISTS(SELECT 1 FROM template_supported_event_types WHERE template_id=${invitation.templateId} AND event_type=${invitation.eventType}) AS compatible FROM templates WHERE id=${invitation.templateId} FOR SHARE`;
    // Retiring a design removes new selection, but must not strand owned cards.
    // Unreleased designs still require publication before they can be exported.
    if (!template?.compatible ||
      (!template.published && !templateById(invitation.templateId)?.retired))
      throw new ApiError(
        409,
        "TEMPLATE_UNAVAILABLE",
        "Dizayn hozir mavjud emas.",
      );
    // Recheck under the invitation lock: payment/content may change while rendering.
    await assertStaticImageEntitlement(tx, current, owner.id);
    const [event] =
      await tx`SELECT now() AS exported_at,((${invitation.startsAt}::timestamp)::date+1)::timestamp AT TIME ZONE ${invitation.timezone} AS deadline`;
    if (!current.imageExportedAt) {
      if (new Date(event.deadline) <= new Date(event.exported_at))
        throw new ApiError(400, "EVENT_ENDED", "Tadbir sanasini tekshiring.");
      exportedAt = new Date(event.exported_at).toISOString();
      await tx`UPDATE invitations SET data=${tx.json({ ...current, imageExportedAt: exportedAt })},identity_locked_at=COALESCE(identity_locked_at,${event.exported_at}),edit_deadline_at=COALESCE(edit_deadline_at,${event.deadline}),approved_event_date=COALESCE(approved_event_date,${invitation.startsAt.slice(0,10)}),updated_at=now() WHERE id=${id}`;
      const action = process.env.PUBLISHING_MODE === "paid" ? "image_finalized_paid" : "image_finalized_free";
      await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${id},${owner.id},${action},${tx.json({ revision })},${tx.json({ revision, locale, exportedAt })})`;
    } else exportedAt = current.imageExportedAt;
  });
  return { bytes, exportedAt: exportedAt!, filename: invitationImageFilename(invitation, locale) };
}
