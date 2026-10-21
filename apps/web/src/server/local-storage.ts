import { mkdir, open, readFile, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ApiError } from "./api";

// Kept outside public/: every read still passes the media authorization route.
export function localMediaPath(key: string) {
  if (
    !key.startsWith("local/") ||
    key
      .split("/")
      .some(
        (part) =>
          !/^[a-zA-Z0-9_.-]+$/.test(part) || part === "." || part === "..",
      )
  )
    throw new ApiError(400, "INVALID_FILE_KEY", "Fayl manzili yaroqsiz.");
  // User uploads are runtime data, not build inputs. Never trace them into a deployment.
  const root = path.resolve(
    /* turbopackIgnore: true */
    process.env.LOCAL_MEDIA_DIR || path.join(process.cwd(), ".data", "media"),
  );
  const target = path.resolve(root, key.slice(6));
  if (!target.startsWith(root + path.sep))
    throw new Error("Invalid media path");
  return target;
}
export async function putLocalMedia(key: string, bytes: Buffer) {
  const target = localMediaPath(key);
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  const temporary = `${target}.${randomUUID()}.tmp`;
  const file = await open(temporary, "wx", 0o600);
  try {
    await file.writeFile(bytes);
    await file.close();
    await rename(temporary, target);
  } catch (error) {
    await file.close().catch(() => {});
    await unlink(temporary).catch(() => {});
    throw error;
  }
}
export async function inspectLocalMedia(key: string) {
  const file = await open(/* turbopackIgnore: true */ localMediaPath(key), "r");
  try {
    const info = await file.stat();
    const bytes = Buffer.alloc(Math.min(128, info.size));
    await file.read(bytes, 0, bytes.length, 0);
    return { size: info.size, bytes };
  } finally {
    await file.close();
  }
}
export async function readLocalMedia(key: string) {
  const target = localMediaPath(key);
  if ((await stat(/* turbopackIgnore: true */ target)).size > 15 * 1024 * 1024)
    throw new Error("Media exceeds limit");
  return readFile(/* turbopackIgnore: true */ target);
}
export async function removeLocalMedia(key: string) {
  await unlink(localMediaPath(key)).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "ENOENT") throw error;
  });
}
