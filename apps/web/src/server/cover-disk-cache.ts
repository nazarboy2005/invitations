import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

// Disposable cache: read-only/full storage must never break image generation.
export async function readCoverFile(file: string) {
  try {
    return await readFile(/* turbopackIgnore: true */ file);
  } catch {
    return undefined;
  }
}

export async function writeCoverFile(file: string, bytes: Buffer) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    await writeFile(temporary, bytes, { mode: 0o600 });
    await rename(temporary, file);
    return true;
  } catch {
    await unlink(temporary).catch(() => {});
    return false;
  }
}
