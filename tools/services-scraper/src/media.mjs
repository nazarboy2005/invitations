import sharp from "sharp";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { atomicJson, hash, readJson } from "./core.mjs";

function mediaPath(directory, file) {
  const root = path.resolve(directory, "images"),
    target = path.resolve(directory, file);
  if (!target.startsWith(root + path.sep))
    throw new Error("Invalid saved media path.");
  return target;
}

async function fingerprint(bytes) {
  const pixels = await sharp(bytes)
    .greyscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer();
  let bits = 0n;
  for (let row = 0; row < 8; row++)
    for (let column = 0; column < 8; column++)
      bits =
        (bits << 1n) |
        BigInt(pixels[row * 9 + column] > pixels[row * 9 + column + 1]);
  return bits.toString(16).padStart(16, "0");
}
export function perceptualDistance(a, b) {
  let value = BigInt(`0x${a}`) ^ BigInt(`0x${b}`),
    count = 0;
  while (value) {
    count++;
    value &= value - 1n;
  }
  return count;
}
export async function downloadMedia(
  candidates,
  { fetcher, directory, limit = 8, imageSource = "mixed", logger = () => {} },
) {
  if (!["mixed", "single"].includes(imageSource))
    throw new Error("imageSource must be mixed or single.");
  const kept = [],
    duplicates = [],
    errors = [];
  await mkdir(path.join(directory, "images"), { recursive: true });
  const cacheFile = path.join(directory, ".media-cache.json"),
    cache = await readJson(cacheFile, {});
  // Alternate sources so the gallery limit cannot suppress the second provider.
  const grouped = new Map();
  for (const item of candidates) {
    const list = grouped.get(item.source) ?? [];
    list.push(item);
    grouped.set(item.source, list);
  }
  const ordered = [];
  if (imageSource === "single") {
    // Prefer the larger available gallery; fall back only if it yields no usable image.
    for (const list of [...grouped.values()].sort(
      (a, b) => b.length - a.length,
    ))
      ordered.push(...list);
  } else {
    while ([...grouped.values()].some((x) => x.length))
      for (const list of grouped.values())
        if (list.length) ordered.push(list.shift());
  }
  for (const item of ordered) {
    if (kept.length >= limit) break;
    if (
      imageSource === "single" &&
      kept.length &&
      item.source !== kept[0].source
    )
      continue;
    try {
      const saved = cache[item.url];
      if (saved?.file) {
        try {
          const data = await readFile(mediaPath(directory, saved.file));
          if (hash(data) === saved.sha256) {
            const exact = kept.find((x) => x.sha256 === saved.sha256);
            if (exact)
              duplicates.push({
                url: item.url,
                duplicateOf: exact.file,
                kind: "exact",
              });
            else kept.push({ ...saved, ...item });
            continue;
          }
        } catch {
          /* Repair missing or corrupt media from its original source. */
        }
      }
      const { bytes, contentType } = await fetcher.get(item.url, {
        image: true,
      });
      if (!/^image\//i.test(contentType))
        throw new Error("Response is not an image.");
      const image = sharp(bytes, {
        limitInputPixels: 40_000_000,
        failOn: "error",
      }).rotate();
      const meta = await image.metadata();
      if (
        !meta.width ||
        !meta.height ||
        Math.min(meta.width, meta.height) < 160 ||
        (meta.pages ?? 1) > 1
      )
        throw new Error("Image is too small, animated, or invalid.");
      const result = await image
        .resize({
          width: 1440,
          height: 1440,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 84 })
        .toBuffer({ resolveWithObject: true });
      const digest = hash(result.data),
        perceptual = await fingerprint(result.data),
        ratio = result.info.width / result.info.height;
      const exact = kept.find((x) => x.sha256 === digest);
      const similar = kept.find(
        (x) =>
          Math.abs(x.width / x.height - ratio) < 0.025 &&
          perceptualDistance(x.perceptualHash, perceptual) <= 3,
      );
      // Exact duplicates are removed; near matches stay in the review gallery.
      if (exact) {
        cache[item.url] = { ...exact, ...item };
        await atomicJson(cacheFile, cache);
        duplicates.push({
          url: item.url,
          duplicateOf: exact.file,
          kind: "exact",
        });
        continue;
      }
      const file = `images/${digest.slice(0, 24)}.webp`;
      await writeFile(path.join(directory, file), result.data);
      kept.push({
        ...item,
        needsReview: true,
        file,
        width: result.info.width,
        height: result.info.height,
        bytes: result.data.length,
        sha256: digest,
        perceptualHash: perceptual,
        ...(similar ? { possibleDuplicateOf: similar.file } : {}),
      });
      cache[item.url] = kept.at(-1);
      await atomicJson(cacheFile, cache);
      logger(`Photo ${kept.length}/${limit}: ${item.source}`);
    } catch (error) {
      errors.push({ url: item.url, source: item.source, error: error.message });
    }
  }
  return {
    images: kept,
    duplicates,
    errors,
    selection: {
      policy: imageSource,
      source: imageSource === "single" ? (kept[0]?.source ?? null) : null,
    },
  };
}
export async function verifyMedia(directory, images) {
  for (const image of images) {
    const bytes = await readFile(mediaPath(directory, image.file));
    const meta = await sharp(bytes).metadata();
    if (
      hash(bytes) !== image.sha256 ||
      meta.width !== image.width ||
      meta.height !== image.height
    )
      throw new Error(`Saved image integrity failed: ${image.file}`);
  }
}
