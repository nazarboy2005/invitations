import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { getDb } from "@taklifnoma/database";
import { mediaObjectKey, putMedia, removeMedia } from "./storage";
import { ApiError } from "./api";

export async function saveServiceImage(
  ownerId: string,
  bytes: Buffer,
  alt = "",
) {
  if (bytes.length > 12 * 1024 * 1024)
    throw new ApiError(
      413,
      "IMAGE_TOO_LARGE",
      "Rasm 12 MB dan kichik bo‘lsin.",
    );
  let output;
  try {
    const source = sharp(bytes, {
      limitInputPixels: 40_000_000,
      animated: false,
    });
    const metadata = await source.metadata();
    if (
      !["jpeg", "png", "webp", "avif", "heif"].includes(metadata.format ?? "")
    )
      throw new Error("Unsupported image");
    output = await source
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new ApiError(
      400,
      "INVALID_IMAGE",
      "JPEG, PNG, WebP yoki AVIF rasm yuklang.",
    );
  }
  const id = randomUUID(),
    key = mediaObjectKey(`services/${id}.webp`);
  await putMedia(key, output.data, "image/webp");
  try {
    await getDb()`INSERT INTO service_media(id,object_key,width,height,bytes,owner_id) VALUES(${id},${key},${output.info.width},${output.info.height},${output.data.length},${ownerId})`;
  } catch (e) {
    await removeMedia(key);
    throw e;
  }
  return {
    src: `/api/services/media/${id}`,
    width: output.info.width,
    height: output.info.height,
    alt,
  };
}
