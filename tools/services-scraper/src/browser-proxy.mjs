import http from "node:http";
import net from "node:net";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { once } from "node:events";
import { resolvePublicUrl, pinnedLookup } from "./network.mjs";

function headersWithoutHopFields(headers) {
  const excluded = new Set([
    "connection",
    "proxy-connection",
    "proxy-authorization",
    "proxy-authenticate",
    "keep-alive",
    "transfer-encoding",
    "te",
    "trailer",
    "upgrade",
    ...String(headers.connection ?? "")
      .toLowerCase()
      .split(",")
      .map((x) => x.trim()),
  ]);
  return Object.fromEntries(
    Object.entries(headers).filter(([key]) => !excluded.has(key)),
  );
}

// Chromium's route callbacks are not a connection boundary: redirects, DNS and
// WebSockets can escape them. Both plain HTTP and HTTPS CONNECT must dial pins.
export class BrowserProxy {
  constructor({ resolve, timeout = 30000 } = {}) {
    this.resolve = resolve;
    this.timeout = timeout;
    this.sockets = new Set();
    this.username = randomBytes(16).toString("hex");
    this.password = randomBytes(24).toString("hex");
    this.authorization = Buffer.from(
      `Basic ${Buffer.from(`${this.username}:${this.password}`).toString("base64")}`,
    );
  }
  authenticated(request) {
    const given = Buffer.from(request.headers["proxy-authorization"] ?? "");
    return (
      given.length === this.authorization.length &&
      timingSafeEqual(given, this.authorization)
    );
  }
  track(socket) {
    this.sockets.add(socket);
    socket.on("error", () => {});
    socket.once("close", () => this.sockets.delete(socket));
    return socket;
  }
  async start() {
    this.server = http.createServer((request, response) => {
      if (!this.authenticated(request)) {
        request.resume();
        response.writeHead(407, {
          "Proxy-Authenticate": 'Basic realm="collector"',
          Connection: "close",
        });
        response.end();
        return;
      }
      void this.forward(request, response).catch(() => {
        if (!response.headersSent)
          response.writeHead(403, { Connection: "close" });
        response.end();
      });
    });
    this.server.on("connection", (socket) => this.track(socket));
    this.server.on("connect", (request, socket, head) => {
      void this.tunnel(request, socket, head).catch(() => {
        if (!socket.destroyed)
          socket.end("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
      });
    });
    // Do not let HTTP Upgrade create an unvalidated alternate tunnel.
    this.server.on("upgrade", (_request, socket) => socket.destroy());
    this.server.on("clientError", (_error, socket) => socket.destroy());
    this.server.listen(0, "127.0.0.1");
    await once(this.server, "listening");
    return {
      server: `http://127.0.0.1:${this.server.address().port}`,
      username: this.username,
      password: this.password,
      // Chromium otherwise bypasses proxies for loopback destinations.
      bypass: "<-loopback>",
    };
  }
  async forward(request, response) {
    if (!["GET", "HEAD", "POST", "OPTIONS"].includes(request.method))
      throw new Error("Unsupported proxy method.");
    const { url, addresses } = await resolvePublicUrl(request.url, {
      resolve: this.resolve,
    });
    if (url.protocol !== "http:") throw new Error("HTTPS requires CONNECT.");
    if (request.destroyed || response.destroyed) return;
    const upstream = http.request(url, {
      method: request.method,
      agent: false,
      autoSelectFamily: true,
      lookup: pinnedLookup(addresses),
      headers: { ...headersWithoutHopFields(request.headers), host: url.host },
      signal: AbortSignal.timeout(this.timeout),
    });
    upstream.on("socket", (socket) => this.track(socket));
    const finished = new Promise((accept, reject) => {
      upstream.on("error", reject);
      upstream.on("response", (incoming) => {
        response.writeHead(
          incoming.statusCode,
          headersWithoutHopFields(incoming.headers),
        );
        let bytes = 0;
        incoming.on("data", (chunk) => {
          bytes += chunk.length;
          if (bytes > 32_000_000)
            incoming.destroy(new Error("Proxy response exceeds size limit."));
        });
        incoming.on("error", (error) => {
          response.destroy();
          reject(error);
        });
        incoming.on("end", accept);
        incoming.pipe(response);
      });
    });
    let bytes = 0;
    request.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > 2_000_000)
        upstream.destroy(new Error("Proxy request exceeds size limit."));
    });
    const cancel = () => upstream.destroy();
    response.on("close", cancel);
    request.on("error", cancel);
    request.pipe(upstream);
    try {
      await finished;
    } finally {
      upstream.destroy();
    }
  }
  async tunnel(request, client, head) {
    if (!this.authenticated(request)) {
      client.end(
        'HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm="collector"\r\nConnection: close\r\n\r\n',
      );
      return;
    }
    const value = new URL(`https://${request.url}`);
    if (value.pathname !== "/" || value.search || value.hash)
      throw new Error("Invalid CONNECT authority.");
    const { url, addresses } = await resolvePublicUrl(value.href, {
      resolve: this.resolve,
    });
    if (client.destroyed) return;
    const remote = this.track(
      net.connect({
        host: url.hostname.replace(/^\[|\]$/g, ""),
        port: Number(url.port || 443),
        autoSelectFamily: true,
        lookup: pinnedLookup(addresses),
        signal: AbortSignal.timeout(this.timeout),
      }),
    );
    remote.setTimeout(this.timeout, () =>
      remote.destroy(new Error("Proxy connection timeout.")),
    );
    client.setTimeout(this.timeout, () => client.destroy());
    client.once("close", () =>
      remote.destroy(new Error("Proxy client closed.")),
    );
    remote.once("close", () => client.destroy());
    try {
      await once(remote, "connect");
    } catch {
      remote.destroy();
      throw new Error("Proxy connection failed.");
    }
    if (client.destroyed) {
      remote.destroy();
      return;
    }
    client.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    if (head.length) remote.write(head);
    remote.pipe(client);
    client.pipe(remote);
  }
  async close() {
    if (!this.server) return;
    const server = this.server;
    this.server = null;
    const closed = new Promise((resolve) => server.close(resolve));
    for (const socket of this.sockets) socket.destroy();
    await closed;
  }
}
