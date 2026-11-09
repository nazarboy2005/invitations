import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiError } from "./api";
import {
  inspectLocalMedia,
  putLocalMedia,
  readLocalMedia,
  removeLocalMedia,
} from "./local-storage";

export function storageProvider(): "local" | "r2" {
  const configured = process.env.MEDIA_STORAGE;
  const hasR2 = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
  ].every((key) => process.env[key]);
  if (configured === "r2" || (!configured && hasR2)) {
    storageClient();
    return "r2";
  }
  // Serverless disks are ephemeral. Never silently use them for published media.
  if (
    (configured === "local" ||
      (!configured && process.env.NODE_ENV !== "production")) &&
    !process.env.VERCEL
  )
    return "local";
  throw new ApiError(
    503,
    "STORAGE_NOT_CONFIGURED",
    "Fayl xizmati sozlanmagan. Administrator saqlash xizmatini sozlashi kerak.",
  );
}
export function mediaObjectKey(key: string) {
  return storageProvider() === "local" ? `local/${key}` : key;
}
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
    requestChecksumCalculation: "WHEN_REQUIRED",
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
  if (key.startsWith("local/")) return putLocalMedia(key, body);
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
  if (key.startsWith("local/")) {
    const bytes = await readLocalMedia(key);
    return { Body: { transformToByteArray: async () => bytes } };
  }
  return storageClient().send(
    new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }),
  );
}
export async function presignMedia(key: string, mime: string, size: number) {
  return getSignedUrl(
    storageClient(),
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: mime,
      ContentLength: size,
    }),
    {
      expiresIn: 300,
      signableHeaders: new Set(["content-length", "content-type"]),
    },
  );
}
export async function inspectMedia(key: string) {
  if (key.startsWith("local/")) return inspectLocalMedia(key);
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
  if (key.startsWith("local/")) return removeLocalMedia(key);
  return storageClient().send(
    new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }),
  );
}
/** Read one object snapshot; never validate HEAD/range then copy a mutable key. */
export async function readUploadBytes(
  key: string,
  size: number,
): Promise<Buffer> {
  if (key.startsWith("local/")) {
    const bytes = await readLocalMedia(key);
    if (bytes.length !== size)
      throw new ApiError(400, "INVALID_FILE", "Fayl hajmi mos kelmadi.");
    return bytes;
  }
  const object = await storageClient().send(
    new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }),
    { abortSignal: AbortSignal.timeout(30_000) },
  );
  if (object.ContentLength !== size || !object.Body) {
    object.Body?.transformToWebStream()
      .cancel()
      .catch(() => {});
    throw new ApiError(400, "INVALID_FILE", "Fayl hajmi mos kelmadi.");
  }
  const reader = object.Body.transformToWebStream().getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > size) {
        await reader.cancel();
        throw new ApiError(400, "INVALID_FILE", "Fayl hajmi mos kelmadi.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  if (total !== size)
    throw new ApiError(400, "INVALID_FILE", "Fayl hajmi mos kelmadi.");
  return Buffer.concat(chunks);
}

export function verifiedMediaKey(key: string) {
  return key.startsWith("local/")
    ? `local/verified/${key.slice(6)}`
    : `verified/${key}`;
}

function publicMediaStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          reader.releaseLock();
          controller.close();
        } else controller.enqueue(value);
      } catch {
        reader.releaseLock();
        // Stream failures happen after the API error handler has returned.
        // Prevent framework logs from receiving raw storage diagnostics.
        controller.error(new Error("Media stream interrupted"));
      }
    },
    async cancel() {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    },
  });
}

export async function mediaResponse(
  request: Request,
  key: string,
  mime: string,
) {
  const headers = {
    "Content-Type": mime,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
    "Content-Disposition": mime === "application/pdf" ? "attachment" : "inline",
    ...(mime === "application/pdf"
      ? { "Content-Security-Policy": "sandbox; default-src 'none'" }
      : {}),
  };
  const range = request.headers.get("range");
  // Storage keys contain creator IDs. Stream through this authorized route
  // instead of exposing keys, account endpoints, or signed URLs in redirects.
  if (!key.startsWith("local/")) {
    if (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range))
      return new Response(null, { status: 416, headers });
    try {
      const object = await storageClient().send(
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          ...(range ? { Range: range } : {}),
        }),
        { abortSignal: request.signal },
      );
      if (!object.Body) throw new Error("Media body unavailable");
      return new Response(
        publicMediaStream(object.Body.transformToWebStream()),
        {
          status: object.ContentRange ? 206 : 200,
          headers: {
            ...headers,
            ...(object.ContentLength !== undefined
              ? { "Content-Length": String(object.ContentLength) }
              : {}),
            ...(object.ContentRange
              ? { "Content-Range": object.ContentRange }
              : {}),
          },
        },
      );
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "$metadata" in error &&
        (error.$metadata as { httpStatusCode?: number })?.httpStatusCode === 416
      )
        return new Response(null, { status: 416, headers });
      throw error;
    }
  }
  const bytes = await readLocalMedia(key);
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    let start = match?.[1] ? Number(match[1]) : 0;
    let end = match?.[2] ? Number(match[2]) : bytes.length - 1;
    if (match && !match[1] && match[2]) {
      start = Math.max(0, bytes.length - Number(match[2]));
      end = bytes.length - 1;
    }
    if (
      !match ||
      (!match[1] && !match[2]) ||
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start < 0 ||
      start >= bytes.length ||
      end < start
    )
      return new Response(null, {
        status: 416,
        headers: { ...headers, "Content-Range": `bytes */${bytes.length}` },
      });
    end = Math.min(end, bytes.length - 1);
    return new Response(new Uint8Array(bytes.subarray(start, end + 1)), {
      status: 206,
      headers: {
        ...headers,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${bytes.length}`,
      },
    });
  }
  return new Response(new Uint8Array(bytes), {
    headers: { ...headers, "Content-Length": String(bytes.length) },
  });
}
