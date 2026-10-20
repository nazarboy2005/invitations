import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiError } from "./api";
export function storageClient() {
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
  } = process.env;
  if (
    !R2_ACCOUNT_ID ||
    !R2_ACCESS_KEY_ID ||
    !R2_SECRET_ACCESS_KEY ||
    !R2_BUCKET_NAME
  )
    throw new ApiError(
      503,
      "STORAGE_NOT_CONFIGURED",
      "Fayl yuklash hozircha mavjud emas.",
    );
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}
export function detectMedia(
  bytes: Buffer,
  kind: string,
): { mime: string; extension: string } | null {
  if (kind === "image") {
    if (
      bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    )
      return { mime: "image/png", extension: "png" };
    if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
      return { mime: "image/jpeg", extension: "jpg" };
    if (
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP"
    )
      return { mime: "image/webp", extension: "webp" };
  }
  if (kind === "audio") {
    if (
      bytes.toString("ascii", 0, 3) === "ID3" ||
      (bytes[0] === 255 && (bytes[1] & 0xe0) === 0xe0)
    )
      return { mime: "audio/mpeg", extension: "mp3" };
    if (
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WAVE"
    )
      return { mime: "audio/wav", extension: "wav" };
    if (
      bytes.toString("ascii", 4, 8) === "ftyp" &&
      /^M4A|^mp4|^isom/.test(bytes.toString("ascii", 8, 12))
    )
      return { mime: "audio/mp4", extension: "m4a" };
  }
  return null;
}
export async function putMedia(key: string, body: Buffer, mime: string) {
  await storageClient().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: mime,
    }),
  );
}
export async function readMedia(key: string) {
  return storageClient().send(
    new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }),
  );
}
export async function presignMedia(key: string, mime: string) {
  return getSignedUrl(
    storageClient(),
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: mime,
    }),
    { expiresIn: 300 },
  );
}
export async function inspectMedia(key: string) {
  const client = storageClient();
  const head = await client.send(
    new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }),
  );
  const object = await client.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Range: "bytes=0-127",
    }),
  );
  return {
    size: head.ContentLength ?? 0,
    bytes: Buffer.from(await object.Body!.transformToByteArray()),
  };
}
export async function removeMedia(key: string) {
  return storageClient().send(
    new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }),
  );
}
export async function mediaReadUrl(key: string, mime: string) {
  return getSignedUrl(
    storageClient(),
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ResponseContentType: mime,
      ResponseContentDisposition: "inline",
    }),
    { expiresIn: 300 },
  );
}
