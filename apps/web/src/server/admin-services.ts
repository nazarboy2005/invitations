import type { JSONValue } from "postgres";
import { getDb } from "@taklifnoma/database";
import { serviceListings } from "@/modules/services/services-data";
import {
  serviceWriteSchema,
  type ServiceRecord,
} from "@/modules/services/service-editor-contract";
import { ApiError } from "./api";
import { recordAdminChange } from "./admin";

const bundledImages = new Map(
  serviceListings.flatMap((s) => s.images.map((i) => [i.src, i] as const)),
);
export function serviceRecord(row: Record<string, unknown>): ServiceRecord {
  return {
    slug: String(row.slug),
    draft: row.draft as ServiceRecord["draft"],
    published: row.published as ServiceRecord["published"],
    status: row.status as ServiceRecord["status"],
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
export async function writeAdminService(
  actorId: string,
  value: unknown,
  existingSlug?: string,
) {
  const input = serviceWriteSchema.parse(value),
    listing = input.listing;
  if (existingSlug && existingSlug !== listing.slug)
    throw new ApiError(
      400,
      "IMMUTABLE_SLUG",
      "Mavjud servis havolasini almashtirib bo‘lmaydi.",
    );
  if (input.intent === "publish") {
    if (!listing.address || !listing.phones.length || !listing.images.length)
      throw new ApiError(
        400,
        "INCOMPLETE_SERVICE",
        "Nashr uchun manzil, telefon va kamida bitta rasm kiriting.",
      );
  }
  const db = getDb();
  return db.begin(async (tx) => {
    // Also serialize concurrent creates, where no existing row can be locked.
    await tx`SELECT pg_advisory_xact_lock(74920320,hashtext(${listing.slug}))`;
    const [before] =
      await tx`SELECT * FROM service_listings WHERE slug=${listing.slug} FOR UPDATE`;
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
    if (
      before?.review_required &&
      input.intent === "publish" &&
      !input.reviewed
    )
      throw new ApiError(
        400,
        "REVIEW_REQUIRED",
        "Import ma’lumotlari va rasmlarni tekshirganingizni tasdiqlang.",
      );
    for (const image of listing.images) {
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
        await tx`SELECT id FROM service_media WHERE id=${id} AND width=${image.width} AND height=${image.height}`;
      if (!media)
        throw new ApiError(400, "INVALID_SERVICE_IMAGE", "Rasm topilmadi.");
    }
    const published =
      input.intent === "publish"
        ? listing
        : input.intent === "save"
          ? (before?.published ?? null)
          : null;
    const status = published
      ? "published"
      : input.intent === "archive" ||
          (input.intent === "save" && before?.status === "archived")
        ? "archived"
        : "draft";
    const draft = tx.json(listing as unknown as JSONValue);
    const pub = published ? tx.json(published as JSONValue) : null;
    let row;
    if (before) {
      [row] =
        await tx`UPDATE service_listings SET draft=${draft},published=${pub},status=${status},revision=revision+1,updated_at=now(),updated_by=${actorId},review_required=CASE WHEN ${input.intent === "publish" && input.reviewed} THEN false ELSE review_required END WHERE slug=${listing.slug} RETURNING *`;
    } else {
      [row] =
        await tx`INSERT INTO service_listings(slug,draft,published,status,created_by,updated_by) VALUES(${listing.slug},${draft},${pub},${status},${actorId},${actorId}) RETURNING *`;
    }
    const action = !before
      ? "service.create"
      : input.intent === "save"
        ? "service.update"
        : (`service.${input.intent}` as
            "service.publish" | "service.unpublish" | "service.archive");
    await recordAdminChange(
      tx,
      actorId,
      action,
      listing.slug,
      before
        ? {
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
