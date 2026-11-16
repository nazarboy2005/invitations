import { lookup } from "node:dns/promises";
import net from "node:net";
import http from "node:http";
import https from "node:https";
import { promisify } from "node:util";
import { gunzip, inflate, brotliDecompress } from "node:zlib";
import { webUrl } from "./core.mjs";

const decompressors = new Map([
  ["gzip", promisify(gunzip)],
  ["deflate", promisify(inflate)],
  ["br", promisify(brotliDecompress)],
]);

export function publicIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b, c] = ip.split(".").map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 198 && [18, 19].includes(b)) ||
      (a === 192 && b === 0 && [0, 2].includes(c)) ||
      (a === 192 && b === 88 && c === 99) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113)
    );
  }
  const lower = ip.toLowerCase();
  if (lower.startsWith("::ffff:"))
    return net.isIPv4(lower.slice(7)) && publicIp(lower.slice(7));
  return Boolean(
    net.isIPv6(ip) &&
    /^[23]/.test(lower) &&
    // Exclude transition/documentation/benchmark/ORCHID addresses as well.
    !/^2002:|^2001:(?:db8:|:|0:|2:|1[0-9a-f]:|2[0-9a-f]:)/.test(
      new URL(`http://[${lower}]/`).hostname.slice(1, -1),
    ),
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
export async function resolvePublicUrl(
  value,
  { image = false, resolve = lookup } = {},
) {
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
  const family = net.isIP(host);
  const addresses = family
    ? [{ address: host, family }]
    : await resolve(host, { all: true });
  if (!addresses.length || addresses.some((x) => !publicIp(x.address)))
    throw new Error("Private and local network URLs are not allowed.");
  return { url: u, addresses };
}
export async function assertPublicUrl(value, options) {
  return (await resolvePublicUrl(value, options)).url;
}

// Node must dial only the addresses checked for THIS connection. Keep the URL's
// hostname intact for HTTP Host, TLS SNI and normal certificate verification.
export function pinnedLookup(addresses) {
  return (_host, options, callback) => {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    const candidates = options?.family
      ? addresses.filter((item) => item.family === options.family)
      : addresses;
    queueMicrotask(() => {
      if (!candidates.length)
        return callback(new Error("No validated address for this family."));
      if (options?.all) callback(null, candidates);
      else callback(null, candidates[0].address, candidates[0].family);
    });
  };
}

export async function requestPublic(
  value,
  {
    image = false,
    resolve = lookup,
    timeout = 25000,
    maxBytes = image ? 15_000_000 : 12_000_000,
    headers = {},
  } = {},
) {
  const signal = AbortSignal.timeout(timeout);
  const { url, addresses } = await resolvePublicUrl(value, { image, resolve });
  signal.throwIfAborted();
  const response = await new Promise((accept, reject) => {
    const request = (url.protocol === "https:" ? https : http).request(
      url,
      {
        agent: false,
        lookup: pinnedLookup(addresses),
        autoSelectFamily: true,
        signal,
        headers: { ...headers, "Accept-Encoding": "identity" },
      },
      accept,
    );
    request.on("error", reject);
    request.end();
  });
  try {
    const status = response.statusCode;
    // Never download a redirect or error body, nor follow a redirect implicitly.
    if (status < 200 || status >= 300) {
      return {
        url: url.href,
        status,
        headers: response.headers,
        bytes: Buffer.alloc(0),
      };
    }
    if (Number(response.headers["content-length"]) > maxBytes)
      throw new Error("Download exceeds size limit.");
    const chunks = [];
    let size = 0;
    for await (const chunk of response) {
      size += chunk.length;
      if (size > maxBytes) throw new Error("Download exceeds size limit.");
      chunks.push(chunk);
    }
    let bytes = Buffer.concat(chunks);
    const encoding = response.headers["content-encoding"]?.toLowerCase();
    const decompress = decompressors.get(encoding);
    if (decompress) {
      try {
        bytes = await decompress(bytes, {
          maxOutputLength: maxBytes,
        });
      } catch (error) {
        if (error.code === "ERR_BUFFER_TOO_LARGE")
          throw new Error("Download exceeds size limit.");
        throw error;
      }
    } else if (encoding && encoding !== "identity") {
      throw new Error("Unsupported response encoding.");
    }
    return { url: url.href, status, headers: response.headers, bytes };
  } finally {
    response.destroy();
  }
}
export class Fetcher {
  constructor({
    timeout = 25000,
    retries = 2,
    delay = 900,
    logger = () => {},
    resolve = lookup,
  } = {}) {
    Object.assign(this, { timeout, retries, delay, logger, resolve });
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
          const u = new URL(url);
          if (maps) validateMapsUrl(u.href);
          await this.throttle(u.hostname);
          const response = await requestPublic(u.href, {
            image,
            maxBytes,
            timeout: this.timeout,
            resolve: this.resolve,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (compatible; FotihaServicesResearch/0.1)",
              Accept: image ? "image/*" : "text/html,application/xhtml+xml",
              "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
            },
          });
          if ([301, 302, 303, 307, 308].includes(response.status)) {
            const location = response.headers.location;
            if (!location) throw new Error("Redirect without a location.");
            url = new URL(location, u).href;
            continue;
          }
          if (response.status < 200 || response.status >= 300) {
            const e = new Error(`HTTP ${response.status}`);
            e.retryable = [408, 429, 500, 502, 503, 504].includes(
              response.status,
            );
            throw e;
          }
          const bytes = response.bytes;
          return {
            url: u.href,
            bytes,
            text: image ? undefined : bytes.toString("utf8"),
            contentType: response.headers["content-type"] ?? "",
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
