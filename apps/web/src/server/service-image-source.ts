import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { ApiError } from "./api";
import { localMediaPath } from "./local-storage";
import { storageClient } from "./storage";

function notFound(error: unknown): never {
  const failure = error as {
    code?: string;
    name?: string;
    $metadata?: { httpStatusCode?: number };
  };
  if (
    failure.code === "ENOENT" ||
    failure.name === "NotFound" ||
    failure.name === "NoSuchKey" ||
    failure.$metadata?.httpStatusCode === 404
  )
    throw new ApiError(404, "IMAGE_NOT_FOUND", "Rasm topilmadi.");
  throw error;
}

function fileImageSource(file: string) {
  return {
    key: file,
    async inspect() {
      try {
        const info = await stat(/* turbopackIgnore: true */ file, {
          bigint: true,
        });
        if (!info.isFile())
          throw new ApiError(404, "IMAGE_NOT_FOUND", "Rasm topilmadi.");
        if (info.size > 15n * 1024n * 1024n)
          throw new Error("Image exceeds limit");
        return `${info.dev}:${info.ino}:${info.size}:${info.mtimeNs}:${info.ctimeNs}`;
      } catch (error) {
        return notFound(error);
      }
    },
    async read() {
      try {
        return await readFile(/* turbopackIgnore: true */ file);
      } catch (error) {
        return notFound(error);
      }
    },
  };
}

export function bundledServiceImageSource(
  src: string,
  publicRoot = path.join(process.cwd(), "public"),
) {
  // Only original bundled photographs; never caller-selected filesystem paths.
  if (!/^\/images\/services\/[a-z0-9-]+\/[a-f0-9]+\.webp$/.test(src))
    throw new ApiError(404, "IMAGE_NOT_FOUND", "Rasm topilmadi.");
  // next.config.ts traces only the packaged service photographs for this route.
  return fileImageSource(
    path.join(/* turbopackIgnore: true */ publicRoot, src),
  );
}

export function uploadedServiceImageSource(key: string) {
  if (key.startsWith("local/")) return fileImageSource(localMediaPath(key));
  return {
    key,
    async inspect() {
      try {
        const object = await storageClient().send(
          new HeadObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
          }),
          { abortSignal: AbortSignal.timeout(10_000) },
        );
        if (
          !object.ETag ||
          !object.ContentLength ||
          object.ContentLength > 15 * 1024 * 1024
        )
          throw new Error("Invalid image object");
        return `${object.ETag}:${object.VersionId ?? ""}:${object.ContentLength}`;
      } catch (error) {
        return notFound(error);
      }
    },
    async read() {
      try {
        const object = await storageClient().send(
          new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
          }),
          { abortSignal: AbortSignal.timeout(15_000) },
        );
        if (!object.ContentLength || object.ContentLength > 15 * 1024 * 1024) {
          object.Body?.transformToWebStream()
            .cancel()
            .catch(() => {});
          throw new Error("Invalid image object");
        }
        return Buffer.from(await object.Body!.transformToByteArray());
      } catch (error) {
        return notFound(error);
      }
    },
  };
}
