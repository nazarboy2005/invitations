import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { getDb } from "@taklifnoma/database";
import { mediaObjectKey, putMedia, removeMedia } from "./storage";
import { ApiError } from "./api";
import {
  SERVICE_IMAGE_MAX_DIMENSION,
  SERVICE_IMAGE_MAX_PIXELS,
  SERVICE_IMAGE_SOURCE_MAX_BYTES,
} from "@/modules/services/service-image-policy";

export async function saveServiceImage(
  ownerId: string,
  bytes: Buffer,
  alt = "",
) {
  if (bytes.length > SERVICE_IMAGE_SOURCE_MAX_BYTES)
    throw new ApiError(
      413,
      "IMAGE_TOO_LARGE",
      "Rasm 12 MB dan kichik bo‘lsin.",
    );
  let output;
  try {
    const source = sharp(bytes, {
      limitInputPixels: SERVICE_IMAGE_MAX_PIXELS,
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
        width: SERVICE_IMAGE_MAX_DIMENSION,
        height: SERVICE_IMAGE_MAX_DIMENSION,
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
