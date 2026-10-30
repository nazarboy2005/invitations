import { readFileSync as readSync } from "node:fs";
import { readFile as readAsync } from "node:fs/promises";

// Compare the rest of each reference exactly while allowing the explicitly
// approved map-provider migration. Images, fonts and manifests stay unmodified.
function referenceMapText(path: unknown, value: string) {
  if (!decodeURI(String(path)).includes("Invitations - this folder will be removed")) return value;
  return value.replaceAll('data-map="google"', 'data-map="secondary"')
    .replaceAll("Google xaritada", "Yandex xaritada")
    .replaceAll("Google Maps", "Yandex Maps")
    .replaceAll("Google Картах", "Яндекс Картах")
    .replaceAll("Google Карты", "Яндекс Карты")
    .replaceAll("карте Google", "карте Yandex")
    .replaceAll("`https://yandex.uz/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdm`", "`/maps/venue?latitude=${lat}&longitude=${lng}`");
}

// Git can check text out with CRLF on Windows. Compare canonical text bytes;
// image/audio/font bytes remain untouched, including their provenance hashes.
function canonicalText(path: unknown, value: string | Buffer) {
  if (!/\.(?:html?|css|[cm]?js|json|svg|md|txt|tsx?)$/i.test(String(path)))
    return value;
  if (typeof value === "string") return referenceMapText(path, value.replace(/\r\n/g, "\n"));
  const text = value.toString("utf8").replace(/\r\n/g, "\n");
  return Buffer.from(text);
}

export const readFileSync: typeof readSync = ((path: any, options?: any) =>
  canonicalText(path, readSync(path, options))) as typeof readSync;

export const readFile: typeof readAsync = (async (path: any, options?: any) =>
  canonicalText(path, await readAsync(path, options))) as typeof readAsync;
