import { isIP } from "node:net";
import { createHmac } from "node:crypto";
import { getDb } from "@taklifnoma/database";
import { ApiError } from "./api";

type Limit = {
  scope: string;
  identity: string;
  maximum: number;
  windowSeconds: number;
  code?: string;
  message?: string;
};

let lastCleanupAt = 0;

/**
 * Resolve the address supplied by the hosting proxy. The origin must not be
 * directly reachable when a proxy-provided address header is trusted.
 */
export function clientAddress(request: Request): string {
  const forwarded = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")
    : request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for");
  const candidate = forwarded?.split(",")[0]?.trim() ?? "";
  return isIP(candidate) ? candidate : "unknown";
}

async function cleanExpiredLimits() {
  const now = Date.now();
  if (now - lastCleanupAt < 15 * 60_000) return;
  lastCleanupAt = now;

  // Multiple app instances may enter here together. The transaction lock keeps
  // cleanup to one bounded batch per interval across the deployment.
  await getDb().begin(async (tx) => {
    const [lock] = await tx`SELECT pg_try_advisory_xact_lock(74920319) AS acquired`;
    if (!lock?.acquired) return;
    await tx`
      WITH stale AS (
        SELECT key FROM rate_limits
        WHERE window_start < now() - interval '1 day'
        LIMIT 1000
      )
      DELETE FROM rate_limits WHERE key IN (SELECT key FROM stale)
    `;
    await tx`
      WITH stale AS (
        SELECT id FROM auth_requests
        WHERE expires_at < now() - interval '1 day'
        LIMIT 1000
      )
      DELETE FROM auth_requests WHERE id IN (SELECT id FROM stale)
    `;
    await tx`
      WITH stale AS (
        SELECT init_hash FROM miniapp_exchanges
        WHERE expires_at < now() - interval '1 day'
        LIMIT 1000
      )
      DELETE FROM miniapp_exchanges WHERE init_hash IN (SELECT init_hash FROM stale)
    `;
  });
}

/** Atomically count a request across all app instances using the shared DB. */
export async function enforceRateLimit({
  scope,
  identity,
  maximum,
  windowSeconds,
  code = "RATE_LIMITED",
  message = "Juda ko‘p so‘rov yuborildi. Biroz kutib qayta urining.",
}: Limit) {
  const secret = process.env.SESSION_SECRET;
  if (!secret)
    throw new ApiError(503, "NOT_CONFIGURED", "Xizmat hozircha mavjud emas.");

  const key = createHmac("sha256", secret)
    .update(`${scope}:${identity}`)
    .digest("hex");
  const [row] = await getDb()`
    INSERT INTO rate_limits(key,count) VALUES(${key},1)
    ON CONFLICT(key) DO UPDATE SET
      count=CASE
        WHEN rate_limits.window_start <= now() - make_interval(secs => ${windowSeconds}) THEN 1
        ELSE rate_limits.count + 1
      END,
      window_start=CASE
        WHEN rate_limits.window_start <= now() - make_interval(secs => ${windowSeconds}) THEN now()
        ELSE rate_limits.window_start
      END
    RETURNING count
  `;

  await cleanExpiredLimits();
  if (row.count > maximum)
    throw new ApiError(429, code, message);
}
