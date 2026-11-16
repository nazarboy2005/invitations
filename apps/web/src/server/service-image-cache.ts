import { createHash } from "node:crypto";
import sharp from "sharp";
import { ApiError } from "./api";
import { SERVICE_PHOTO_WIDTHS } from "../modules/services/service-photo-url";

type ImageSource = {
  key: string;
  // Never cached: detects deleted/replaced source files before ANY cache hit/304.
  inspect(): Promise<string>;
  read(): Promise<Buffer>;
};

const MAX_BYTES = 32 * 1024 * 1024;
const MAX_ENTRIES = 128;
const MAX_PENDING = 64;
const MAX_TRANSFORMS = 4;
const TTL = 5 * 60 * 1000;

/** Only derived bytes are cached. Callers must authorize before calling this. */
export function createServiceImageCache() {
  const entries = new Map<string, { bytes: Buffer; expires: number }>();
  const pending = new Map<string, Promise<Buffer>>();
  let totalBytes = 0;
  let activeTransforms = 0;
  const waiting: Array<() => void> = [];

  function remove(key: string) {
    const entry = entries.get(key);
    if (entry) totalBytes -= entry.bytes.length;
    entries.delete(key);
  }

  async function imageBytes(
    key: string,
    source: ImageSource,
    width: number,
    version: string,
  ) {
    const cached = entries.get(key);
    if (cached && cached.expires > Date.now()) {
      entries.delete(key);
      entries.set(key, cached);
      return cached.bytes;
    }
    remove(key);
    const running = pending.get(key);
    if (running) return running;
    if (pending.size >= MAX_PENDING)
      throw new ApiError(503, "IMAGE_BUSY", "Rasmni qayta yuklab ko‘ring.");
    const task = (async () => {
      // Queue a normal page's parallel image loads without starting an unbounded
      // number of source reads/Sharp transformations at once.
      if (activeTransforms >= MAX_TRANSFORMS)
        await new Promise<void>((resolve) => waiting.push(resolve));
      else activeTransforms++;
      try {
        const bytes = await sharp(await source.read(), {
          limitInputPixels: 40_000_000,
        })
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
        if ((await source.inspect()) !== version)
          throw new ApiError(
            409,
            "IMAGE_CHANGED",
            "Rasm o‘zgardi. Qayta yuklab ko‘ring.",
          );
        if (bytes.length <= MAX_BYTES) {
          // Evict expired entries, then the least recently used entries.
          for (const [id, entry] of entries)
            if (entry.expires <= Date.now()) remove(id);
          while (
            entries.size >= MAX_ENTRIES ||
            totalBytes + bytes.length > MAX_BYTES
          )
            remove(entries.keys().next().value!);
          entries.set(key, { bytes, expires: Date.now() + TTL });
          totalBytes += bytes.length;
        }
        return bytes;
      } finally {
        const next = waiting.shift();
        if (next) next();
        else activeTransforms--;
      }
    })();
    pending.set(key, task);
    try {
      return await task;
    } finally {
      pending.delete(key);
    }
  }

  return async function respond(
    request: Request,
    source: ImageSource,
    { width = 1600, cacheable = true } = {},
  ) {
    if (!(SERVICE_PHOTO_WIDTHS as readonly number[]).includes(width))
      throw new ApiError(400, "INVALID_IMAGE_WIDTH", "Rasm o‘lchami yaroqsiz.");
    const version = await source.inspect();
    const key = createHash("sha256")
      .update(JSON.stringify(["service-webp-v1", source.key, version, width]))
      .digest("hex");
    const etag = `"${key}"`;
    const headers = {
      "Content-Type": "image/webp",
      "Cache-Control": cacheable
        ? "private, no-cache, must-revalidate"
        : "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
      ...(cacheable ? { ETag: etag } : {}),
    };
    const validators = request.headers.get("if-none-match")?.split(",");
    if (
      cacheable &&
      validators?.some((value) => {
        const tag = value.trim().replace(/^W\//, "");
        return tag === "*" || tag === etag;
      })
    )
      return new Response(null, { status: 304, headers });
    const bytes = await imageBytes(key, source, width, version);
    return new Response(
      request.method === "HEAD" ? null : new Uint8Array(bytes),
      {
        headers: { ...headers, "Content-Length": String(bytes.length) },
      },
    );
  };
}

const serviceImages = globalThis as typeof globalThis & {
  fotihaServiceImageCache?: ReturnType<typeof createServiceImageCache>;
};
export const serviceImageResponse = (serviceImages.fotihaServiceImageCache ??=
  createServiceImageCache());
