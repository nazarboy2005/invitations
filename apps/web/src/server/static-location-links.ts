import { randomInt } from "node:crypto";
import { getDb } from "@taklifnoma/database";
import {
  type Invitation,
  type Locale,
} from "@taklifnoma/contracts";
import { templateCapabilities } from "@taklifnoma/contracts/capabilities";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function generateLocationCode() {
  return Array.from({ length: 8 }, () => BASE62[randomInt(BASE62.length)]).join("");
}

function canonicalYandexDestination(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "";
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    !/^(?:www\.)?yandex\.(?:uz|ru|com)$/.test(url.hostname) ||
    !(url.pathname === "/maps" || url.pathname.startsWith("/maps/"))
  )
    return "";
  url.hostname = "yandex.uz";
  url.pathname = url.pathname.replace(/^\/maps\/?/, "/maps/");
  url.searchParams.set("lang", "uz_UZ");
  url.hash = "";
  return url.toString();
}

function publicLocationUrl(code: string) {
  const appUrl = process.env.APP_URL;
  if (!appUrl) throw new Error("APP_URL is required to create static location links.");
  return new URL(`/${code}`, appUrl).href;
}

/**
 * Codes are immutable and destinations are deduplicated. A previously
 * downloaded invitation therefore keeps resolving after its venue is edited.
 */
export async function shortenYandexDestination(destination: string) {
  const targetUrl = canonicalYandexDestination(destination);
  if (!targetUrl) throw new Error("Static location links only accept Yandex Maps destinations.");

  const sql = getDb();
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateLocationCode();
    try {
      const inserted = await sql`
        INSERT INTO static_location_short_links(code,target_url)
        VALUES(${code},${targetUrl})
        ON CONFLICT(target_url) DO NOTHING
        RETURNING code
      `;
      if (inserted[0]) return publicLocationUrl(inserted[0].code as string);

      const existing = await sql`
        SELECT code FROM static_location_short_links WHERE target_url=${targetUrl}
      `;
      if (existing[0]) return publicLocationUrl(existing[0].code as string);
    } catch (error) {
      const dbError = error as { code?: string; constraint_name?: string };
      if (dbError.code === "23505" && dbError.constraint_name === "static_location_short_links_pkey")
        continue;
      throw error;
    }
  }
  throw new Error("Could not allocate a unique static location code.");
}

export async function staticInvitationQrUrl(invitation: Invitation, locale: Locale) {
  if (!templateCapabilities(invitation.templateId).locationQr) return "";
  const content = invitation.content[locale];
  if (!content) return "";
  const destination = yandexMapUrl(
    invitation.venue,
    [content.venueName, content.address, content.landmark].filter(Boolean).join(", "),
  );
  return destination ? shortenYandexDestination(destination) : "";
}
