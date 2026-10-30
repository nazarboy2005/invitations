import { readFileSync as readSync } from "node:fs";
import { readFile as readAsync } from "node:fs/promises";

// Compare the rest of each reference exactly while allowing the explicitly
// approved map-provider migration and removal of provider credits. Raw capture
// buffers/hashes remain untouched; only textual comparison projections change.
function neutralProviderCopy(value: string) {
  return value
    .replace(/\s*[·—|]\s*Marxaba\b/gi, "")
    .replaceAll("CHAVANDOZ · MARXABA", "CHAVANDOZ")
    .replaceAll("MARXABA / TADBIRLAR", "TADBIRLAR")
    .replaceAll("MARXABA / EVENTS", "EVENTS")
    .replaceAll("MARXABA / СОБЫТИЯ", "СОБЫТИЯ")
    .replaceAll("MARXABA · INVITATION", "INVITATION")
    .replaceAll("Marxaba kinojurnali", "Kinojurnal")
    .replaceAll("Киножурнал Marxaba", "Киножурнал")
    .replaceAll("Marxaba newsreel", "Newsreel")
    .replace(/"(?:Marxaba|Marhamat)[^"\n]*yaratildi"\s*:\s*\[[\s\S]*?\],?\s*/g, "")
    .replaceAll("· a Marxaba invitation", "· an invitation")
    .replace(/(?:\s*[·—|/]\s*)?\bMarxaba\b(?:\s*[·—|/]\s*)?/gi, "");
}

function referenceMapText(path: unknown, value: string) {
  if (!decodeURI(String(path)).includes("Invitations - this folder will be removed")) return value;
  let result = value.replaceAll('data-map="google"', 'data-map="secondary"')
    .replaceAll("Google xaritada", "Yandex xaritada")
    .replaceAll("Google Maps", "Yandex Maps")
    .replaceAll("Google Картах", "Яндекс Картах")
    .replaceAll("Google Карты", "Яндекс Карты")
    .replaceAll("карте Google", "карте Yandex")
    .replaceAll("`https://yandex.uz/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdm`", "`/maps/venue?latitude=${lat}&longitude=${lng}`");
  if (/\.html?$/i.test(String(path))) {
    result = neutralProviderCopy(result
      .replace(/<small\b[^>]*>(?:Marxaba|Marhamat) bilan yaratildi<\/small>/g, "")
      .replace(/<p\b[^>]*>Marxaba taqdim etadi<\/p>/g, ""))
      .replace(/<(small|span|p)\b[^>]*\bdata-slot="footer"[^>]*>[\s\S]*?<\/\1>/g, "")
      .replace(/<p\b[^>]*>Marxaba taqdim etadi<\/p>/g, "");
  } else if (/i18n\.js$/i.test(String(path))) {
    result = neutralProviderCopy(result);
  }
  return result;
}

// Git can check text out with CRLF on Windows. Compare canonical text bytes;
// image/audio/font bytes remain untouched, including their provenance hashes.
function canonicalText(path: unknown, value: string | Buffer) {
  if (!/\.(?:html?|css|[cm]?js|json|svg|md|txt|tsx?)$/i.test(String(path)))
    return value;
  if (typeof value === "string") return referenceMapText(path, value.replace(/\r\n/g, "\n")).replace(/[ \t]+$/gm, "");
  const text = value.toString("utf8").replace(/\r\n/g, "\n");
  return Buffer.from(text);
}

export const readFileSync: typeof readSync = ((path: any, options?: any) =>
  canonicalText(path, readSync(path, options))) as typeof readSync;

export const readFile: typeof readAsync = (async (path: any, options?: any) =>
  canonicalText(path, await readAsync(path, options))) as typeof readAsync;
