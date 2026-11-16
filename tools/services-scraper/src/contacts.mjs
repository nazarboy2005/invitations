import { linkKind, unique, webUrl } from "./core.mjs";

const instagramReserved = new Set([
  "about",
  "accounts",
  "ads",
  "api",
  "challenge",
  "developer",
  "developers",
  "direct",
  "directory",
  "emails",
  "explore",
  "legal",
  "oauth",
  "p",
  "press",
  "privacy",
  "reel",
  "reels",
  "stories",
  "terms",
  "tv",
  "web",
]);

export function isSocialPlatformUrl(value) {
  try {
    const host = new URL(value).hostname.replace(/\.$/, "");
    return (
      linkKind(value) !== "website" ||
      /(?:^|\.)(?:instagram\.com|facebook\.com|youtube\.com|tiktok\.com)$/.test(
        host,
      )
    );
  } catch {
    return false;
  }
}

// Contacts identify accounts, not social-platform navigation or individual posts.
export function contactUrl(value, base) {
  const valid = webUrl(value, base);
  if (!valid) return null;
  const url = new URL(valid);
  url.hostname = url.hostname.replace(/\.$/, "");
  if (/(?:^|\.)instagram\.com$/.test(url.hostname)) {
    if (
      url.protocol !== "https:" ||
      url.port ||
      !["instagram.com", "www.instagram.com", "m.instagram.com"].includes(
        url.hostname,
      )
    )
      return null;
    const match = /^\/([a-z0-9_][a-z0-9_.]{0,29})\/?$/i.exec(url.pathname);
    const account = match?.[1].toLowerCase();
    if (
      !account ||
      account.endsWith(".") ||
      account.includes("..") ||
      instagramReserved.has(account)
    )
      return null;
    return `https://www.instagram.com/${account}`;
  }
  return valid;
}

export function normalizeContactLinks(links = []) {
  return unique(
    links.flatMap((link) => {
      const url = contactUrl(link.url);
      return url ? [{ ...link, url, type: linkKind(url) }] : [];
    }),
    (link) => link.url,
  );
}
