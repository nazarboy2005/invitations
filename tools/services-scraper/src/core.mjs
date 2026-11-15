import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const clean = (value) =>
  typeof value === "string"
    ? value
        .replace(/[\uE000-\uF8FF]/g, "")
        .replace(/\s+/g, " ")
        .trim()
    : "";
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const unique = (items, key = (x) => JSON.stringify(x)) => {
  const values = new Map();
  for (const item of items) {
    const id = key(item);
    if (!values.has(id)) values.set(id, item);
  }
  return [...values.values()];
};
export const normalize = (value) =>
  clean(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘’ʻʼ`´']/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
export const phone = (value) => {
  const digits = clean(value).replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 ? `+${digits}` : null;
};
export function webUrl(value, base) {
  try {
    const u = new URL(value, base);
    if (!["https:", "http:"].includes(u.protocol) || u.username || u.password)
      return null;
    u.hash = "";
    for (const key of [...u.searchParams.keys()])
      if (/^(utm_|gclid|fbclid|yclid)/i.test(key)) u.searchParams.delete(key);
    return u.href;
  } catch {
    return null;
  }
}
export function linkKind(url) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  return (
    {
      "instagram.com": "instagram",
      "facebook.com": "facebook",
      "t.me": "telegram",
      "telegram.me": "telegram",
      "wa.me": "whatsapp",
      "youtube.com": "youtube",
      "youtu.be": "youtube",
      "vk.com": "vk",
      "tiktok.com": "tiktok",
    }[host] ?? "website"
  );
}
export function sourceRecord(provider, url, id = null) {
  return {
    provider,
    id,
    url,
    fetchedAt: new Date().toISOString(),
    name: "",
    address: "",
    location: null,
    phones: [],
    links: [],
    emails: [],
    descriptions: [],
    images: [],
    products: [],
    categories: [],
    hours: "",
    priceHints: [],
    warnings: [],
    coverage: { products: "not_found", photos: "partial", limitedView: false },
  };
}
export function readJsonArray(text, marker) {
  const pos = text.indexOf(marker);
  if (pos < 0) return null;
  let start = pos + marker.length;
  while (/\s/.test(text[start] ?? "") && start < text.length) start++;
  if (!["[", "{"].includes(text[start])) return null;
  let depth = 0,
    quoted = false,
    escaped = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") {
      if (--depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}
export function visit(value, callback, depth = 0) {
  if (!value || typeof value !== "object" || depth > 35) return;
  callback(value);
  for (const child of Object.values(value)) visit(child, callback, depth + 1);
}
export function parseMoney(value, currencyHint = null) {
  const normalizedCurrency = (hint) =>
    /^(с[уў]м|so[‘’ʻʼ']?m|UZS)$/i.test(hint ?? "")
      ? "UZS"
      : hint?.toUpperCase();
  currencyHint = normalizedCurrency(currencyHint);
  if (typeof value === "number")
    return Number.isFinite(value) && value > 0 && currencyHint
      ? { amount: value, currency: currencyHint }
      : null;
  const text = clean(value);
  const currency = /(?:so[‘’ʻʼ']?m|с[уў]м|UZS|SOM)/i.test(text)
    ? "UZS"
    : /\$|USD/i.test(text)
      ? "USD"
      : /₽|RUB|руб/i.test(text)
        ? "RUB"
        : /€|EUR/i.test(text)
          ? "EUR"
          : currencyHint;
  if (!currency || /\d\s*[-–—]\s*\d/.test(text)) return null;
  const match = text.match(/\d[\d\s.,]*/);
  if (!match) return null;
  let number = match[0].trim().replace(/\s/g, "");
  if (/^\d{1,3}(?:[,.]\d{3})+$/.test(number))
    number = number.replace(/[,.]/g, "");
  else if (/^\d+[,.]\d{1,2}$/.test(number)) number = number.replace(",", ".");
  else if (/^\d{1,3}(?:,\d{3})+\.\d{1,2}$/.test(number))
    number = number.replace(/,/g, "");
  else if (!/^\d+(?:\.\d+)?$/.test(number)) return null;
  const amount = Number(number);
  return Number.isFinite(amount) && amount > 0 ? { amount, currency } : null;
}
export function priceUnit(text) {
  if (
    /per\s+(?:person|guest)|за\s+(?:человека|гостя)|на\s+(?:1|одного)\s*(?:гостя|человека)|(?:har bir|bir|1)\s*(?:kishi|odam)|(?:kishi|odam)\s*(?:uchun|boshiga)|киши\s*бошига|\/\s*(?:person|guest|kishi|odam|чел)/i.test(
      text,
    )
  )
    return "person";
  if (/per\s+hour|за\s+час|(?:har|bir|1)\s*soat|soatiga/i.test(text))
    return "hour";
  if (/per\s+event|за\s+мероприятие|(?:har bir|bir|1)\s*tadbir/i.test(text))
    return "event";
  if (/per\s+(?:item|piece)|за\s+штук|(?:har bir|bir|1)\s*dona/i.test(text))
    return "item";
  return null;
}
export async function atomicJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(value, null, 2) + "\n");
  await rename(temporary, file);
}
export async function readJson(file, fallback = null) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}
export function slug(value) {
  return normalize(value).replace(/\s+/g, "-").slice(0, 65) || "business";
}
export function haversine(a, b) {
  if (!a || !b) return null;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat),
    dLng = rad(b.lng - a.lng);
  return (
    6371000 *
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin(dLat / 2) ** 2 +
          Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2,
      ),
    )
  );
}
