import { readFileSync as readSync } from "node:fs";
import { readFile as readAsync } from "node:fs/promises";

// Git can check text out with CRLF on Windows. Compare canonical text bytes;
// image/audio/font bytes remain untouched, including their provenance hashes.
function canonicalText(path: unknown, value: string | Buffer) {
  if (!/\.(?:html?|css|[cm]?js|json|svg|md|txt|tsx?)$/i.test(String(path)))
    return value;
  if (typeof value === "string") return value.replace(/\r\n/g, "\n");
  return Buffer.from(value.toString("utf8").replace(/\r\n/g, "\n"));
}

export const readFileSync: typeof readSync = ((path: any, options?: any) =>
  canonicalText(path, readSync(path, options))) as typeof readSync;

export const readFile: typeof readAsync = (async (path: any, options?: any) =>
  canonicalText(path, await readAsync(path, options))) as typeof readAsync;
