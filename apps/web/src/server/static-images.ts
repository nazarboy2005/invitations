import { createHmac } from "node:crypto";
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

export async function staticImageLimit(
  request: Request,
  kind: "preview" | "download",
  userId?: string,
) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new ApiError(503, "NOT_CONFIGURED", "Xizmat sozlanmagan.");
  const address =
    request.headers
      .get(process.env.VERCEL ? "x-vercel-forwarded-for" : "x-forwarded-for")
      ?.split(",")[0]
      ?.trim() || "local";
  const key =
    "static-image:" +
    createHmac("sha256", secret)
      .update(`${kind}:${userId || address}`)
      .digest("hex");
  const [row] =
    await getDb()`INSERT INTO rate_limits(key,count) VALUES(${key},1) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.window_start<now()-interval '1 minute' THEN 1 ELSE rate_limits.count+1 END,window_start=CASE WHEN rate_limits.window_start<now()-interval '1 minute' THEN now() ELSE rate_limits.window_start END RETURNING count`;
  if (row.count > (kind === "preview" ? 90 : 12))
    throw new ApiError(
      429,
      "RATE_LIMITED",
      "Juda ko‘p so‘rov. Birozdan so‘ng qayta urining.",
    );
}

/** Free testing only: deliberately separate from Click and web publication. */
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
  const bytes = await renderStaticImage(invitation, locale, false);
  const sql = getDb();
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
    if (!template?.published || !template.compatible)
      throw new ApiError(
        409,
        "TEMPLATE_UNAVAILABLE",
        "Dizayn hozir mavjud emas.",
      );
    const [event] =
      await tx`SELECT now() AS exported_at,((${invitation.startsAt}::timestamp)::date+1)::timestamp AT TIME ZONE ${invitation.timezone} AS deadline`;
    if (!current.imageExportedAt) {
      if (new Date(event.deadline) <= new Date(event.exported_at))
        throw new ApiError(400, "EVENT_ENDED", "Tadbir sanasini tekshiring.");
      exportedAt = new Date(event.exported_at).toISOString();
      await tx`UPDATE invitations SET data=${tx.json({ ...current, imageExportedAt: exportedAt })},identity_locked_at=COALESCE(identity_locked_at,${event.exported_at}),edit_deadline_at=COALESCE(edit_deadline_at,${event.deadline}),updated_at=now() WHERE id=${id}`;
      await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${id},${owner.id},'image_finalized_free',${tx.json({ revision })},${tx.json({ revision, locale, exportedAt })})`;
    } else exportedAt = current.imageExportedAt;
  });
  return { bytes, exportedAt: exportedAt! };
}
