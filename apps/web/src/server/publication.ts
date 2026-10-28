import { randomInt } from "node:crypto";
import type postgres from "postgres";
import { getDb } from "@taklifnoma/database";
import {
  invitationSchema,
  templateById,
  type Invitation,
  type SessionUser,
} from "@taklifnoma/contracts";
import { publicationIssues } from "@taklifnoma/contracts/publication";
import { ApiError } from "./api";
import { CATALOG_PREVIEW_MUSIC } from "../modules/catalog/catalog-music";
import { inspectMedia, storageProvider } from "./storage";
import { requireAdmin, recordAdminChange } from "./admin";
import type { AdminInvitationAction } from "./admin-invitation-access";
import { paymentIdentity } from "@taklifnoma/contracts/payment";
import { enqueuePaymentNotifications } from "./payment-notifications";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export function generatePublicCode() {
  return Array.from({ length: 6 }, () => BASE62[randomInt(62)]).join("");
}
export function publicInvitationUrl(slug: string) {
  if (!process.env.APP_URL)
    throw new ApiError(503, "NOT_CONFIGURED", "Sayt manzili sozlanmagan.");
  return new URL(`/i/${encodeURIComponent(slug)}`, process.env.APP_URL).href;
}
export function assertPublishable(invitation: Invitation) {
  const issues = publicationIssues(invitation);
  if (issues.length)
    throw new ApiError(
      400,
      "PUBLICATION_INCOMPLETE",
      issues.map((issue) => issue.message).join(" "),
    );
}

// Both publication and subsequent public edits must reference usable media.
export async function assertPublicMedia(
  tx: postgres.TransactionSql,
  invitation: Invitation,
  userId: string,
) {
  if (invitation.gift.enabled && invitation.gift.receiptUploadEnabled)
    storageProvider();
  const assets: Array<{ object_key: string; size_bytes: number }> = [];
  for (const image of invitation.gallery) {
    if (/^https?:\/\//i.test(image.url)) continue; // Creator-supplied external images are supported.
    const [asset] =
      await tx`SELECT object_key,size_bytes FROM media_assets WHERE id::text=${image.id} AND owner_id=${userId} AND url=${image.url} AND url=('/api/media/' || id::text) AND status='ready' AND visibility='public' AND mime_type LIKE 'image/%' FOR SHARE`;
    if (!asset)
      throw new ApiError(
        400,
        "MEDIA_NOT_READY",
        "Galereyadagi rasmlarni tekshiring yoki olib tashlang.",
      );
    assets.push(asset as { object_key: string; size_bytes: number });
  }
  for (const artist of invitation.artistLineup) {
    if (!artist.imageUrl.startsWith("/api/media/")) continue;
    const [asset] = await tx`
      SELECT object_key,size_bytes FROM media_assets
      WHERE id::text=${artist.imageAssetId ?? ""} AND owner_id=${userId}
        AND url=${artist.imageUrl} AND url=('/api/media/' || id::text)
        AND status='ready' AND visibility='public' AND mime_type LIKE 'image/%'
      FOR SHARE
    `;
    if (!asset)
      throw new ApiError(
        400,
        "MEDIA_NOT_READY",
        "San’atkor portretlarini tekshiring yoki olib tashlang.",
      );
    assets.push(asset as { object_key: string; size_bytes: number });
  }
  if (invitation.music.enabled && invitation.music.url) {
    if (
      invitation.music.url !== CATALOG_PREVIEW_MUSIC.url ||
      invitation.music.assetId
    ) {
      const [asset] =
        await tx`SELECT a.object_key,a.size_bytes FROM media_assets a WHERE a.id::text=${invitation.music.assetId ?? ""} AND a.url=${invitation.music.url} AND a.url=('/api/media/' || a.id::text) AND a.status='ready' AND a.visibility='public' AND a.mime_type LIKE 'audio/%' AND (a.owner_id=${userId} OR EXISTS (SELECT 1 FROM catalog_music_tracks c WHERE c.asset_id=a.id AND c.active=true)) FOR SHARE OF a`;
      if (!asset)
        throw new ApiError(
          400,
          "MEDIA_NOT_READY",
          "Musiqani qayta tanlang yoki o‘chiring.",
        );
      assets.push(asset as { object_key: string; size_bytes: number });
    }
  }
  for (const asset of assets) {
    try {
      if (
        (await inspectMedia(asset.object_key)).size !== Number(asset.size_bytes)
      )
        throw new Error("Size mismatch");
    } catch {
      throw new ApiError(
        400,
        "MEDIA_NOT_READY",
        "Yuklangan fayl topilmadi. Rasm yoki musiqani qayta yuklang.",
      );
    }
  }
}

export async function publishInvitation(
  id: string,
  revision: number,
  user: SessionUser,
  allocateCode = generatePublicCode,
  admin?: AdminInvitationAction,
) {
  if (admin && (await requireAdmin()).id !== admin.actorId)
    throw new ApiError(403, "FORBIDDEN", "Administrator tasdig‘i kerak.");
  const sql = getDb();
  return sql.begin((tx) =>
    publishInvitationInTransaction(tx, id, revision, user, allocateCode, admin),
  );
}

// Caller must authenticate first or supply a verified payment's database owner.
// Shared transaction keeps payment fulfillment, audit and publication atomic.
export async function publishInvitationInTransaction(
  tx: postgres.TransactionSql,
  id: string,
  revision: number,
  user: SessionUser,
  allocateCode = generatePublicCode,
  admin?: AdminInvitationAction,
) {
  const [row] =
    await tx`SELECT * FROM invitations WHERE id=${id} AND owner_id=${user.id} FOR UPDATE`;
  if (!row) throw new ApiError(404, "NOT_FOUND", "Taklifnoma topilmadi.");
  const previous = invitationSchema.parse(row.data);
  // A repeated successful request must not allocate a code or extend the deadline.
  if (row.status === "published" && row.slug)
    return {
      invitation: { ...previous, slug: row.slug as string },
      url: publicInvitationUrl(row.slug),
    };
  const republishing =
    row.status === "archived" &&
    !!row.slug &&
    !!row.first_published_at &&
    !!row.identity_locked_at;
  if (row.status !== "draft" && !republishing)
    throw new ApiError(
      403,
      "INVITATION_ARCHIVED",
      "Bu taklifnomani nashr qilib bo‘lmaydi.",
    );
  if (previous.revision !== revision)
    throw new ApiError(
      409,
      "STALE_REVISION",
      "Taklifnoma boshqa oynada o‘zgargan. Yangilangan nusxani oching.",
    );
  const mode = process.env.PUBLISHING_MODE ?? "free";
  if (!["free", "paid"].includes(mode))
    throw new ApiError(
      503,
      "PUBLISHING_UNAVAILABLE",
      "Nashr qilish vaqtincha mavjud emas.",
    );
  if (mode === "paid" && !republishing) {
    const [entitlement] =
      await tx`SELECT id FROM payment_orders WHERE invitation_id=${id} AND owner_id=${user.id} AND template_id=${previous.templateId} AND identity_snapshot=${paymentIdentity(previous)} AND status='SUCCEEDED' AND verified_at IS NOT NULL FOR SHARE`;
    if (!entitlement)
      throw new ApiError(
        402,
        "PAYMENT_REQUIRED",
        "Nashr qilish uchun to‘lovni yakunlang.",
      );
  }
  const [template] =
    await tx`SELECT t.published, EXISTS(SELECT 1 FROM template_supported_event_types s WHERE s.template_id=t.id AND s.event_type=${previous.eventType}) AS supports_event FROM templates t WHERE t.id=${previous.templateId} FOR SHARE OF t`;
  if (!templateById(previous.templateId) || !template?.published)
    throw new ApiError(
      409,
      "TEMPLATE_UNAVAILABLE",
      "Bu dizayn hozir mavjud emas. Boshqa dizaynni tanlang.",
    );
  if (!template.supports_event)
    throw new ApiError(
      409,
      "TEMPLATE_EVENT_MISMATCH",
      "Tanlangan dizayn tadbir turiga mos emas.",
    );
  assertPublishable(previous);
  await assertPublicMedia(tx, previous, user.id);
  if (republishing) {
    const invitation = invitationSchema.parse({
      ...previous,
      status: "published",
      slug: row.slug,
      revision: previous.revision + 1,
    });
    // Restore the same event without resetting its identity or editing window.
    await tx`UPDATE invitations SET status='published',data=${tx.json(invitation)},archived_at=NULL,updated_at=now() WHERE id=${id}`;
    await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${id},${admin?.actorId ?? user.id},'republished',${tx.json(previous)},${tx.json(invitation)})`;
    if (admin)
      await recordAdminChange(
        tx,
        admin.actorId,
        "invitation.publish",
        id,
        { status: "archived" },
        { status: "published", ownerId: user.id, reason: admin.reason },
      );
    return { invitation, url: publicInvitationUrl(row.slug) };
  }
  // Treat startsAt as a wall-clock value in the invitation's own timezone.
  // Compare the resulting instants in PostgreSQL, without relying on the
  // database session's timezone or JS coercion of a timezone-less string.
  const [event] =
    await tx`SELECT (((${previous.startsAt}::timestamp)::date + 1)::timestamp AT TIME ZONE ${previous.timezone}) <= now() AS ended, now() AS published_at, ((${previous.startsAt}::timestamp)::date + 1)::timestamp AT TIME ZONE ${previous.timezone} AS deadline`;
  if (event.ended)
    throw new ApiError(
      400,
      "EVENT_ENDED",
      "Tadbir kuni o‘tib ketgan. Sanani tekshiring.",
    );
  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = allocateCode();
    const invitation = invitationSchema.parse({
      ...previous,
      status: "published",
      slug,
      revision: previous.revision + 1,
    });
    try {
      await tx.savepoint(async (savepoint) => {
        await savepoint`UPDATE invitations SET slug=${slug},status='published',data=${savepoint.json(invitation)},first_published_at=${event.published_at},identity_locked_at=${event.published_at},edit_deadline_at=${event.deadline},updated_at=now() WHERE id=${id}`;
      });
    } catch (error) {
      if (
        (error as { code?: string; constraint_name?: string }).code ===
          "23505" &&
        (error as { constraint_name?: string }).constraint_name ===
          "invitations_slug_key"
      )
        continue;
      throw error;
    }
    await tx`INSERT INTO invitation_audit_log(invitation_id,actor_id,action,previous_values,new_values) VALUES(${id},${admin?.actorId ?? user.id},${mode === "paid" ? "published_paid" : "published_free"},${tx.json(previous)},${tx.json({ ...invitation, publication: { mode, firstPublishedAt: event.published_at, editDeadlineAt: event.deadline } })})`;
    if (mode === "paid") {
      await tx`UPDATE payment_orders SET fulfilled_at=COALESCE(fulfilled_at,now()),publication_error=NULL WHERE invitation_id=${id} AND status='SUCCEEDED'`;
      await enqueuePaymentNotifications(tx, id);
    }
    if (admin)
      await recordAdminChange(
        tx,
        admin.actorId,
        "invitation.publish",
        id,
        { status: "draft" },
        { status: "published", ownerId: user.id, reason: admin.reason },
      );
    return { invitation, url: publicInvitationUrl(slug) };
  }
  throw new ApiError(
    503,
    "CODE_ALLOCATION_FAILED",
    "Havola yaratilmadi. Qayta urinib ko‘ring.",
  );
}
