import { lookup } from "node:dns/promises";
import net from "node:net";
import { webUrl } from "./core.mjs";

export function publicIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 198 && [18, 19].includes(b))
    );
  }
  const lower = ip.toLowerCase();
  if (lower.startsWith("::ffff:"))
    return net.isIPv4(lower.slice(7)) && publicIp(lower.slice(7));
  return Boolean(
    net.isIPv6(ip) && /^[23]/.test(lower) && !lower.startsWith("2001:db8:"),
  );
}
export function providerForUrl(value) {
  const u = new URL(value),
    host = u.hostname.toLowerCase();
  if (
    (/^(?:www\.)?yandex\.(?:uz|ru|com|kz|com\.tr)$/.test(host) &&
      /^\/maps(?:\/|$)/.test(u.pathname)) ||
    (host === "yandex.com.tr" && u.pathname.startsWith("/maps"))
  )
    return "yandex";
  if (
    (/^(?:www\.|maps\.)?google\.(?:com|co\.uz|ru)$/.test(host) &&
      (/^\/maps(?:\/|$)/.test(u.pathname) ||
        (host.startsWith("maps.") && u.pathname === "/"))) ||
    host === "maps.app.goo.gl" ||
    (host === "goo.gl" && u.pathname.startsWith("/maps/"))
  )
    return "google";
  throw new Error("Use a Google Maps or Yandex Maps URL.");
}
export function validateMapsUrl(value) {
  const url = webUrl(value);
  if (!url || new URL(url).port) throw new Error("Invalid Maps URL.");
  providerForUrl(url);
  return url;
}
export async function assertPublicUrl(value, { image = false } = {}) {
  const text = webUrl(value);
  if (!text) throw new Error("Only public HTTP(S) URLs are supported.");
  const u = new URL(text),
    host = u.hostname.replace(/^\[|\]$/g, "");
  if (u.port && !["80", "443"].includes(u.port))
    throw new Error("Unsupported URL port.");
  if (
    image &&
    !/(?:^|\.)(?:googleusercontent\.com|ggpht\.com|yandex\.net|yandex\.ru|yandex\.uz)$/.test(
      host,
    )
  )
    throw new Error("Image host is not an expected Maps media host.");
  const addresses = await lookup(host, { all: true });
  if (!addresses.length || addresses.some((x) => !publicIp(x.address)))
    throw new Error("Private and local network URLs are not allowed.");
  return u;
}
export class Fetcher {
  constructor({
    timeout = 25000,
    retries = 2,
    delay = 900,
    logger = () => {},
  } = {}) {
    Object.assign(this, { timeout, retries, delay, logger });
    this.tails = new Map();
    this.last = new Map();
  }
  async throttle(host) {
    const previous = this.tails.get(host) ?? Promise.resolve();
    const next = previous
      .catch(() => {})
      .then(async () => {
        const wait = this.delay - (Date.now() - (this.last.get(host) ?? 0));
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        this.last.set(host, Date.now());
      });
    this.tails.set(host, next);
    await next;
  }
  async get(
    value,
    {
      image = false,
      maps = false,
      maxBytes = image ? 15_000_000 : 12_000_000,
    } = {},
  ) {
    let lastError;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        let url = value;
        for (let redirect = 0; redirect <= 5; redirect++) {
          const u = await assertPublicUrl(url, { image });
          if (maps) validateMapsUrl(u.href);
          await this.throttle(u.hostname);
          const response = await fetch(u, {
            redirect: "manual",
            signal: AbortSignal.timeout(this.timeout),
            headers: {
              "User-Agent":
                "Mozilla/5.0 (compatible; FotihaServicesResearch/0.1)",
              Accept: image ? "image/*" : "text/html,application/xhtml+xml",
              "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
            },
          });
          if ([301, 302, 303, 307, 308].includes(response.status)) {
            const location = response.headers.get("location");
            await response.body?.cancel();
            if (!location) throw new Error("Redirect without a location.");
            url = new URL(location, u).href;
            continue;
          }
          if (!response.ok) {
            await response.body?.cancel();
            const e = new Error(`HTTP ${response.status}`);
            e.retryable = [408, 429, 500, 502, 503, 504].includes(
              response.status,
            );
            throw e;
          }
          if (Number(response.headers.get("content-length")) > maxBytes) {
            await response.body?.cancel();
            throw new Error("Download exceeds size limit.");
          }
          const chunks = [];
          let size = 0;
          for await (const chunk of response.body) {
            size += chunk.length;
            if (size > maxBytes) {
              throw new Error("Download exceeds size limit.");
            }
            chunks.push(chunk);
          }
          const bytes = Buffer.concat(chunks);
          return {
            url: u.href,
            bytes,
            text: image ? undefined : bytes.toString("utf8"),
            contentType: response.headers.get("content-type") ?? "",
          };
        }
        throw new Error("Too many redirects.");
      } catch (error) {
        lastError = error;
        if (
          error.retryable === false ||
          /Private|not allowed|Invalid|Unsupported|Only public|expected Maps|size limit/.test(
            error.message,
          )
        )
          break;
        if (attempt < this.retries) {
          this.logger(`Retry ${attempt + 1}: ${error.message}`);
          await new Promise((r) => setTimeout(r, 800 * 2 ** attempt));
        }
      }
    }
    throw lastError;
  }
}
