import type { JSONValue } from "postgres";
import { getDb } from "@taklifnoma/database";
import { serviceListings } from "@/modules/services/services-data";
import {
  serviceWriteSchema,
  serviceSlug,
  serviceDeleteSchema,
  type ServiceRecord,
} from "@/modules/services/service-editor-contract";
import { ApiError } from "./api";
import { recordAdminChange } from "./admin";
import { removeMedia } from "./storage";

const bundledImages = new Map(
  serviceListings.flatMap((s) => s.images.map((i) => [i.src, i] as const)),
);
export function serviceRecord(row: Record<string, unknown>): ServiceRecord {
  return {
    slug: String(row.slug),
    draft: row.draft as ServiceRecord["draft"],
    published: row.published as ServiceRecord["published"],
    status: row.published ? "active" : "hidden",
    revision: Number(row.revision),
    updatedAt: new Date(row.updated_at as string).toISOString(),
    evidence: row.evidence as ServiceRecord["evidence"],
    reviewRequired: Boolean(row.review_required),
  };
}
export async function listAdminServices() {
  const rows = await getDb()`SELECT * FROM service_listings ORDER BY position`;
  return rows.map(serviceRecord);
}
export async function getAdminService(slug: string) {
  const [row] =
    await getDb()`SELECT * FROM service_listings WHERE slug=${slug}`;
  if (!row) throw new ApiError(404, "SERVICE_NOT_FOUND", "Servis topilmadi.");
  return serviceRecord(row);
}
export async function serviceSlugAvailability(
  value: string,
  currentSlug?: string,
) {
  const slug = serviceSlug.parse(value);
  const [row] =
    await getDb()`SELECT slug FROM service_listings WHERE slug=${slug}`;
  return { slug, available: !row || slug === currentSlug };
}

export async function deleteAdminService(
  actorId: string,
  slug: string,
  value: unknown,
) {
  const { revision } = serviceDeleteSchema.parse(value);
  const db = getDb();
  const mediaIds = await db.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(74920320,hashtext(${slug}))`;
    const [before] =
      await tx`SELECT * FROM service_listings WHERE slug=${slug} FOR UPDATE`;
    if (!before)
      throw new ApiError(404, "SERVICE_NOT_FOUND", "Servis topilmadi.");
    if (Number(before.revision) !== revision)
      throw new ApiError(
        409,
        "SERVICE_CONFLICT",
        "Servis boshqa oynada o‘zgartirilgan. Yangilang va qayta tekshiring.",
      );
    const ids = [
      ...new Set<string>(
        [
          ...(before.draft.images ?? []),
          ...(before.published?.images ?? []),
        ].flatMap(
          (image: { src: string }) =>
            image.src.match(/^\/api\/services\/media\/([0-9a-f-]{36})$/)?.[1] ??
            [],
        ),
      ),
    ].sort();
    await tx`DELETE FROM service_favorites WHERE service_slug=${slug}`;
    await tx`DELETE FROM service_listings WHERE slug=${slug}`;
    await recordAdminChange(
      tx,
      actorId,
      "service.delete",
      slug,
      { name: before.draft.name, revision, status: before.status },
      { deleted: true },
    );
    return ids;
  });
  let cleanupPending = false;
  for (const id of mediaIds) {
    try {
      await db.begin(async (tx) => {
        const [media] =
          await tx`SELECT * FROM service_media WHERE id=${id} FOR UPDATE`;
        if (!media) return;
        // Images can be shared. Locking the media row also serializes concurrent attachments.
        const src = `/api/services/media/${id}`;
        const [used] = await tx`SELECT slug FROM service_listings WHERE
          draft->'images' @> ${tx.json([{ src }])}::jsonb OR
          published->'images' @> ${tx.json([{ src }])}::jsonb LIMIT 1`;
        if (used) return;
        await removeMedia(media.object_key);
        await tx`DELETE FROM service_media WHERE id=${id}`;
      });
    } catch {
      // The service remains deleted if storage is temporarily unavailable.
      cleanupPending = true;
    }
  }
  return { deleted: true, cleanupPending };
}
export async function writeAdminService(
  actorId: string,
  value: unknown,
  existingSlug?: string,
) {
  const input = serviceWriteSchema.parse(value),
    listing = input.listing;
  if (input.intent === "active") {
    if (!listing.address || !listing.phones.length || !listing.images.length)
      throw new ApiError(
        400,
        "INCOMPLETE_SERVICE",
        "Faol servis uchun manzil, telefon va kamida bitta rasm kiriting.",
      );
  }
  const db = getDb();
  return db.begin(async (tx) => {
    // Also serialize concurrent creates, where no existing row can be locked.
    // Sort locks so concurrent renames cannot deadlock on the URLs.
    for (const slug of [
      ...new Set([existingSlug ?? listing.slug, listing.slug]),
    ].sort())
      await tx`SELECT pg_advisory_xact_lock(74920320,hashtext(${slug}))`;
    const [before] =
      await tx`SELECT * FROM service_listings WHERE slug=${existingSlug ?? listing.slug} FOR UPDATE`;
    if (existingSlug && existingSlug !== listing.slug) {
      const [occupied] =
        await tx`SELECT slug FROM service_listings WHERE slug=${listing.slug}`;
      if (occupied)
        throw new ApiError(
          409,
          "SERVICE_SLUG_TAKEN",
          "Bu havola band. Boshqa nom tanlang.",
        );
    }
    if (existingSlug && !before)
      throw new ApiError(404, "SERVICE_NOT_FOUND", "Servis topilmadi.");
    if (
      (!existingSlug && before) ||
      (!before && input.revision !== 0) ||
      (before && Number(before.revision) !== input.revision)
    )
      throw new ApiError(
        409,
        "SERVICE_CONFLICT",
        "Servis boshqa oynada o‘zgartirilgan yoki bu havola band. Yangilang va qayta tekshiring.",
      );
    if (before?.review_required && input.intent === "active" && !input.reviewed)
      throw new ApiError(
        400,
        "REVIEW_REQUIRED",
        "Import ma’lumotlari va rasmlarni tekshirganingizni tasdiqlang.",
      );
    for (const image of [...listing.images].sort((a, b) =>
      a.src.localeCompare(b.src),
    )) {
      const bundled = bundledImages.get(image.src);
      if (
        bundled &&
        bundled.width === image.width &&
        bundled.height === image.height
      )
        continue;
      const id = image.src.match(
        /^\/api\/services\/media\/([0-9a-f-]{36})$/,
      )?.[1];
      if (!id)
        throw new ApiError(
          400,
          "INVALID_SERVICE_IMAGE",
          "Rasmni avval yuklang.",
        );
      const [media] =
        await tx`SELECT id FROM service_media WHERE id=${id} AND width=${image.width} AND height=${image.height} FOR SHARE`;
      if (!media)
        throw new ApiError(400, "INVALID_SERVICE_IMAGE", "Rasm topilmadi.");
    }
    const published = input.intent === "active" ? listing : null;
    // Preserve storage compatibility with the laptop worker. Admin visibility has two states.
    const status = published ? "published" : "draft";
    const draft = tx.json(listing as unknown as JSONValue);
    const pub = published ? tx.json(published as JSONValue) : null;
    let row;
    if (before) {
      [row] =
        await tx`UPDATE service_listings SET slug=${listing.slug},draft=${draft},published=${pub},status=${status},revision=revision+1,updated_at=now(),updated_by=${actorId},review_required=CASE WHEN ${input.intent === "active" && input.reviewed} THEN false ELSE review_required END WHERE slug=${String(before.slug)} RETURNING *`;
    } else {
      [row] =
        await tx`INSERT INTO service_listings(slug,draft,published,status,created_by,updated_by) VALUES(${listing.slug},${draft},${pub},${status},${actorId},${actorId}) RETURNING *`;
    }
    if (existingSlug && existingSlug !== listing.slug) {
      await tx`INSERT INTO service_favorites(user_id,service_slug,saved_at)
        SELECT user_id,${listing.slug},saved_at FROM service_favorites WHERE service_slug=${existingSlug}
        ON CONFLICT (user_id,service_slug) DO UPDATE SET saved_at=GREATEST(service_favorites.saved_at,excluded.saved_at)`;
      await tx`DELETE FROM service_favorites WHERE service_slug=${existingSlug}`;
    }
    const action = !before
      ? "service.create"
      : Boolean(before.published) === (input.intent === "active")
        ? "service.update"
        : input.intent === "active"
          ? "service.publish"
          : "service.unpublish";
    await recordAdminChange(
      tx,
      actorId,
      action,
      listing.slug,
      before
        ? {
            slug: before.slug,
            revision: before.revision,
            status: before.status,
            name: before.draft.name,
            featured: before.published?.featured ?? false,
          }
        : null,
      {
        revision: row.revision,
        status,
        name: listing.name,
        featured: published?.featured ?? false,
        featuredOrder: listing.featuredOrder ?? 0,
      },
    );
    return serviceRecord(row);
  });
}
