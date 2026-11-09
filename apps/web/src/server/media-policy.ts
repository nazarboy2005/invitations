import type postgres from "postgres";
import { getDb } from "@taklifnoma/database";
import { ApiError } from "./api";
import { removeMedia } from "./storage";

export function mediaBudget(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new ApiError(
      503,
      "INVALID_MEDIA_CONFIG",
      "Fayl xizmati sozlanmagan.",
    );
  return value;
}

/** Hold through reservation/approval so parallel requests cannot overspend. */
export async function assertMediaBudget(
  tx: postgres.TransactionSql,
  ownerId: string,
  bytes: number,
  options: { exceptId?: string; preparing?: boolean } = {},
) {
  await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"media-budget:" + ownerId},0))`;
  const [usage] = await tx`
    SELECT COALESCE(sum(size_bytes) FILTER (WHERE status IN ('pending','ready') AND id<>COALESCE(${options.exceptId ?? null}::uuid,'00000000-0000-0000-0000-000000000000'::uuid)),0) AS bytes,
      count(*) FILTER (WHERE status='pending' AND created_at>now()-interval '1 hour') AS pending,
      count(*) FILTER (WHERE visibility='public' AND created_at>now()-interval '1 day') AS daily
    FROM media_assets WHERE owner_id=${ownerId}`;
  if (
    Number(usage.bytes) + bytes >
    mediaBudget("MEDIA_ACCOUNT_MAX_BYTES", 1024 ** 3)
  )
    throw new ApiError(
      429,
      "STORAGE_QUOTA",
      "Fayllar uchun joy limiti tugadi. Administrator bilan bog‘laning.",
    );
  if (
    options.preparing &&
    (Number(usage.pending) >= 10 ||
      Number(usage.daily) >= mediaBudget("MEDIA_DAILY_UPLOAD_LIMIT", 300))
  )
    throw new ApiError(
      429,
      "UPLOAD_LIMIT",
      "Yuklash limiti tugadi. Birozdan so‘ng qayta urining.",
    );
}

/** URLs expire in five minutes. Clean only abandoned pending uploads, never ready assets. */
export async function cleanupAbandonedMedia(ownerId?: string) {
  return getDb().begin(async (tx) => {
    const jobs =
      await tx`SELECT id,payload FROM jobs WHERE type='media-cleanup' AND status='queued'
      AND available_at<=now() AND (${ownerId ?? null}::uuid IS NULL OR payload->>'ownerId'=${ownerId ?? null})
      ORDER BY available_at FOR UPDATE SKIP LOCKED LIMIT 20`;
    for (const job of jobs) {
      await removeMedia(job.payload.key);
      await tx`UPDATE jobs SET status='completed',completed_at=now() WHERE id=${job.id}`;
    }
    const assets = await tx`SELECT id,object_key FROM media_assets
      WHERE status IN ('pending','rejected') AND created_at<now()-interval '1 day'
        AND (${ownerId ?? null}::uuid IS NULL OR owner_id=${ownerId ?? null}::uuid)
      ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 20`;
    for (const asset of assets) {
      await removeMedia(asset.object_key);
      await tx`UPDATE media_assets SET status='expired' WHERE id=${asset.id} AND status IN ('pending','rejected')`;
    }
    return assets.length + jobs.length;
  });
}
