// Offline derivatives only: captured template files are never overwritten.
// Run `node scripts/optimize-template-media.mjs` after adding large template media.
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../apps/web");
const publicRoot = join(root, "public");
const output = join(publicRoot, "templates/_optimized");
const manifestFile = join(root, "src/generated/template-media.json");
const recipe = "webp-q88-1920-v1-h264-crf21-1280-original-fps";
const previous = existsSync(manifestFile)
  ? JSON.parse(readFileSync(manifestFile, "utf8"))
  : {};
const manifest = {};
mkdirSync(output, { recursive: true });
const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "_optimized") continue;
    const file = join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (
      /\.(png|jpe?g|webp|mp4)$/i.test(file) &&
      statSync(file).size >= 200_000
    )
      files.push(file);
  }
}
walk(join(publicRoot, "templates"));
let saved = 0;
for (const file of files.sort()) {
  const source = "/" + relative(publicRoot, file).replaceAll("\\", "/");
  const bytes = readFileSync(file);
  const hash = createHash("sha256")
    .update(recipe)
    .update(bytes)
    .digest("hex")
    .slice(0, 24);
  const video = extname(file).toLowerCase() === ".mp4";
  const destination = `/templates/_optimized/${hash}.${video ? "mp4" : "webp"}`;
  const target = join(publicRoot, destination);
  if (previous[source]?.url === destination && existsSync(target)) {
    manifest[source] = previous[source];
    saved += bytes.length - statSync(target).size;
    continue;
  }
  if (existsSync(target) && statSync(target).size > 0) {
    manifest[source] = {
      url: destination,
      kind: video ? "video" : "image",
      originalBytes: bytes.length,
      bytes: statSync(target).size,
    };
  } else if (video) {
    const probe = JSON.parse(
      execFileSync(
        "ffprobe",
        ["-v", "error", "-show_streams", "-of", "json", file],
        { encoding: "utf8" },
      ),
    );
    const stream = probe.streams.find((item) => item.codec_type === "video");
    // Keep every frame, the full duration, and any audio track. H.264/yuv420p
    // supports hardware decoding on the phones used by invitation guests.
    if (!stream || stream.pix_fmt?.includes("a")) continue;
    execFileSync(
      "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        file,
        "-map",
        "0:v:0",
        "-map",
        "0:a?",
        "-vf",
        "scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "21",
        "-pix_fmt",
        "yuv420p",
        "-threads",
        "2",
        "-c:a",
        "copy",
        "-movflags",
        "+faststart",
        target,
      ],
      { stdio: "pipe" },
    );
    manifest[source] = {
      url: destination,
      kind: "video",
      originalBytes: bytes.length,
      bytes: statSync(target).size,
    };
  } else {
    const metadata = await sharp(bytes).metadata();
    // Never flatten animated images into a still frame.
    if ((metadata.pages || 1) > 1) continue;
    const result = await sharp(bytes)
      .rotate()
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 88, alphaQuality: 100, effort: 5, smartSubsample: true })
      .toBuffer({ resolveWithObject: true });
    // Windows indexers may briefly hold a newly-created file open.
    for (let attempt = 0; ; attempt++) {
      try {
        writeFileSync(target, result.data);
        break;
      } catch (error) {
        if (attempt >= 3) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, 100 * (attempt + 1)),
        );
      }
    }
    manifest[source] = {
      url: destination,
      kind: "image",
      originalBytes: bytes.length,
      bytes: result.data.length,
      width: result.info.width,
      height: result.info.height,
    };
  }
  // Small savings do not justify a lossy derivative; keep the original instead.
  if (manifest[source].bytes >= bytes.length * 0.9) {
    delete manifest[source];
    rmSync(target);
  } else saved += bytes.length - manifest[source].bytes;
  console.log(`${manifest[source] ? "Optimized" : "Kept original"}: ${source}`);
}
mkdirSync(dirname(manifestFile), { recursive: true });
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `${Object.keys(manifest).length} optimized assets; ${(saved / 1e6).toFixed(1)} MB less transfer across the library.`,
);
