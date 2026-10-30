import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { storageClient, storageProvider } from "./storage";
import { readLocalMedia, putLocalMedia } from "./local-storage";

function encryptionKey(secret: string) {
  return createHash("sha256")
    .update("invitation-cover-storage-v1\0")
    .update(secret)
    .digest();
}

// The existing media bucket may have a public domain. Store authenticated
// ciphertext there, never a readable screenshot of a private invitation draft.
export function sealCover(bytes: Buffer, key: string, secret: string) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), nonce);
  cipher.setAAD(Buffer.from(key));
  const encrypted = Buffer.concat([cipher.update(bytes), cipher.final()]);
  return Buffer.concat([nonce, cipher.getAuthTag(), encrypted]);
}

export function openCover(bytes: Buffer, key: string, secret: string) {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(secret),
    bytes.subarray(0, 12),
  );
  decipher.setAAD(Buffer.from(key));
  decipher.setAuthTag(bytes.subarray(12, 28));
  return Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]);
}

type CoverObjects = {
  read(key: string): Promise<Buffer | undefined>;
  write(key: string, bytes: Buffer): Promise<void>;
};

export function persistentCovers(objects: CoverObjects, secret: string) {
  return {
    async read(key: string) {
      try {
        const bytes = await objects.read(`invitation-covers/v1/${key}.bin`);
        return bytes ? openCover(bytes, key, secret) : undefined;
      } catch {
        console.error("Invitation cover storage read failed");
        return undefined;
      }
    },
    async write(key: string, bytes: Buffer) {
      try {
        await objects.write(
          `invitation-covers/v1/${key}.bin`,
          sealCover(bytes, key, secret),
        );
        return true;
      } catch {
        // A storage outage must not discard a successfully rendered cover.
        console.error("Invitation cover storage write failed");
        return false;
      }
    },
  };
}

export function coverStorage() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return undefined;
  let provider: "local" | "r2";
  try {
    provider = storageProvider();
  } catch {
    console.error("Invitation cover storage is not configured");
    return undefined;
  }
  return persistentCovers(
    {
      async read(key) {
        if (provider === "local") {
          try {
            return await readLocalMedia(`local/${key}`);
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT")
              return undefined;
            throw error;
          }
        }
        const client = storageClient();
        try {
          const response = await client.send(
            new GetObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: key,
            }),
            { abortSignal: AbortSignal.timeout(4000) },
          );
          return response.Body
            ? Buffer.from(await response.Body.transformToByteArray())
            : undefined;
        } catch (error) {
          if ((error as { name: string }).name === "NoSuchKey")
            return undefined;
          throw error;
        } finally {
          client.destroy();
        }
      },
      async write(key, bytes) {
        if (provider === "local") return putLocalMedia(`local/${key}`, bytes);
        const client = storageClient();
        try {
          await client.send(
            new PutObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: key,
              Body: bytes,
              ContentType: "application/octet-stream",
              CacheControl: "private, no-store",
            }),
            { abortSignal: AbortSignal.timeout(4000) },
          );
        } finally {
          client.destroy();
        }
      },
    },
    secret,
  );
}
