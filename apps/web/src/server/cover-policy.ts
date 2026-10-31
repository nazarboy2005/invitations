import { createHash } from "node:crypto";
import type { Invitation } from "@taklifnoma/contracts";
import { COVER_VERSION } from "../modules/dashboard/cover-recipe";
import { coverContent } from "../modules/dashboard/cover-content";
import { publicAssetPrefix } from "../lib/public-asset";

export function coverKey(invitation: Invitation, scope = "") {
  return createHash("sha256")
    .update(COVER_VERSION)
    .update(coverContent(invitation))
    .update(scope)
    .digest("hex");
}

export function coverRequestKind(
  address: string,
  origin: string,
  mediaOrigin?: string | null,
): "asset" | "media" | "deny" {
  const url = new URL(address);
  if (
    url.username ||
    url.password ||
    !["http:", "https:"].includes(url.protocol) ||
    /%2f|%5c/i.test(url.pathname)
  )
    return "deny";
  if (url.origin === origin) {
    if (/^\/api\/media\/[a-zA-Z0-9-]+$/.test(url.pathname)) return "media";
    if (
      url.pathname === "/preview" ||
      /^\/(?:templates|images|fonts|_next\/static)\//.test(url.pathname) ||
      (url.pathname.startsWith(publicAssetPrefix + "/") &&
        /^\/(?:templates|images)\//.test(url.pathname.slice(publicAssetPrefix.length)))
    )
      return "asset";
    return "deny";
  }
  return (mediaOrigin && url.origin === mediaOrigin) ||
    ["https://fonts.googleapis.com", "https://fonts.gstatic.com"].includes(
      url.origin,
    )
    ? "asset"
    : "deny";
}
