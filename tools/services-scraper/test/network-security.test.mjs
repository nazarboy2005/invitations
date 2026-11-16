import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { once } from "node:events";
import { gzipSync } from "node:zlib";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { chromium } from "playwright";
import { Fetcher, publicIp, resolvePublicUrl } from "../src/network.mjs";
import { BrowserProxy } from "../src/browser-proxy.mjs";
import { BrowserSession } from "../src/browser.mjs";
import { scraperEnvironment } from "../src/environment.mjs";

const publicAddress = { address: "8.8.8.8", family: 4 };
const privateAddress = { address: "127.0.0.1", family: 4 };

async function fixture(t, handler) {
  const server = http.createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });
  return server;
}

// A fixture adapter, not a resolver bypass: assert the production request has a
// pinned lookup, record what it would dial, then substitute only our test server.
function transportFixture(t, server) {
  const native = http.request.bind(http);
  const calls = [];
  t.mock.method(http, "request", (value, options, callback) => {
    const url = new URL(value);
    if (url.hostname === "127.0.0.1") return native(value, options, callback);
    assert.equal(
      typeof options.lookup,
      "function",
      "must not use a second OS DNS lookup",
    );
    options.lookup(url.hostname, { all: true }, (error, addresses) => {
      assert.ifError(error);
      assert.deepEqual(addresses, [publicAddress]);
      calls.push({ url: url.href, addresses, headers: options.headers });
    });
    return native(
      `http://127.0.0.1:${server.address().port}${url.pathname}`,
      {
        ...options,
        headers: { ...options.headers, host: url.host },
      },
      callback,
    );
  });
  return calls;
}

test("HTTP downloads use only the checked DNS result, retaining the source hostname", async (t) => {
  const server = await fixture(t, (req, res) => {
    assert.equal(req.headers.host, "business.security-test.invalid");
    res.end("own fixture");
  });
  const calls = transportFixture(t, server);
  let lookups = 0;
  const fetcher = new Fetcher({
    delay: 0,
    retries: 0,
    resolve: async () => {
      lookups++;
      return lookups === 1 ? [publicAddress] : [privateAddress];
    },
  });
  const result = await fetcher.get("http://business.security-test.invalid/");
  assert.equal(result.text, "own fixture");
  assert.equal(
    lookups,
    1,
    "transport must reuse the checked address rather than resolve again",
  );
  assert.equal(calls.length, 1);
});

test("redirects and retries revalidate DNS, rejecting both direct and rebound private destinations", async (t) => {
  const server = await fixture(t, (_req, res) => {
    res.writeHead(302, {
      Location: "http://business.security-test.invalid/next",
    });
    res.end();
  });
  const calls = transportFixture(t, server);
  let lookups = 0;
  const fetcher = new Fetcher({
    delay: 0,
    retries: 1,
    resolve: async () => (++lookups === 1 ? [publicAddress] : [privateAddress]),
  });
  await assert.rejects(
    fetcher.get("http://business.security-test.invalid/"),
    /Private/,
  );
  assert.equal(calls.length, 1);
  server.removeAllListeners("request");
  server.on("request", (_req, res) => {
    res.writeHead(503);
    res.end();
  });
  lookups = 0;
  await assert.rejects(
    fetcher.get("http://business.security-test.invalid/"),
    /Private/,
  );
  assert.equal(
    calls.length,
    2,
    "only the first retry attempt may reach the transport",
  );
  server.removeAllListeners("request");
  server.on("request", (_req, res) => {
    res.writeHead(302, { Location: "http://127.0.0.1/own-fixture" });
    res.end();
  });
  lookups = 0;
  await assert.rejects(
    fetcher.get("http://business.security-test.invalid/"),
    /Private/,
  );
  assert.equal(calls.length, 3);
});

test("Maps share redirects still work and cannot redirect outside Maps", async (t) => {
  const server = await fixture(t, (req, res) => {
    if (req.url === "/maps/-/share") {
      res.writeHead(302, { Location: "https://invalid.example/" });
      res.end();
    } else res.end("business");
  });
  transportFixture(t, server);
  const fetcher = new Fetcher({
    delay: 0,
    retries: 0,
    resolve: async () => [publicAddress],
  });
  await assert.rejects(
    fetcher.get("http://yandex.uz/maps/-/share", { maps: true }),
    /Maps/,
  );
  server.removeAllListeners("request");
  server.on("request", (req, res) => {
    if (req.url === "/maps/-/share") {
      res.writeHead(302, { Location: "/maps/org/123/" });
      res.end();
    } else res.end("business");
  });
  const result = await fetcher.get("http://yandex.uz/maps/-/share", {
    maps: true,
  });
  assert.equal(result.url, "http://yandex.uz/maps/org/123/");
  assert.equal(result.text, "business");
});

test("compressed downloads retain decoded size limits and request deadlines", async (t) => {
  const server = await fixture(t, (_req, res) => {
    res.setHeader("Content-Encoding", "gzip");
    res.end(gzipSync(Buffer.from("hello")));
  });
  transportFixture(t, server);
  const fetcher = new Fetcher({
    delay: 0,
    retries: 0,
    timeout: 150,
    resolve: async () => [publicAddress],
  });
  assert.equal(
    (await fetcher.get("http://business.security-test.invalid/")).text,
    "hello",
  );
  server.removeAllListeners("request");
  server.on("request", (_req, res) => {
    res.setHeader("Content-Encoding", "gzip");
    res.end(gzipSync(Buffer.alloc(10000)));
  });
  await assert.rejects(
    fetcher.get("http://business.security-test.invalid/", { maxBytes: 100 }),
    /size limit/,
  );
  server.removeAllListeners("request");
  server.on("request", (_req, res) => {
    res.setHeader("Content-Encoding", "constructor");
    res.end("unsupported");
  });
  await assert.rejects(
    fetcher.get("http://business.security-test.invalid/"),
    /Unsupported response encoding/,
  );
  server.removeAllListeners("request");
  server.on("request", (_req, res) => {
    res.writeHead(200);
    res.write("start");
  });
  await assert.rejects(
    fetcher.get("http://business.security-test.invalid/"),
    /abort/i,
  );
});

test("private, mixed DNS, alternate IP spelling and transition addresses fail closed", async () => {
  assert.equal(
    publicIp("192.0.4.1"),
    true,
    "do not reject the entire 192.0/16 block",
  );
  for (const address of [
    "127.0.0.1",
    "169.254.169.254",
    "::1",
    "fc00::1",
    "2002:7f00:1::",
    "2001:db8::1",
    "192.0.2.1",
  ]) {
    assert.equal(publicIp(address), false, address);
  }
  for (const url of [
    "http://2130706433/",
    "http://0x7f000001/",
    "http://[::ffff:127.0.0.1]/",
  ]) {
    await assert.rejects(resolvePublicUrl(url), /Private/);
  }
  await assert.rejects(
    resolvePublicUrl("https://business.security-test.invalid/", {
      resolve: async () => [publicAddress, privateAddress],
    }),
    /Private/,
  );
});

async function rawProxy(proxy, requestText) {
  const socket = net.connect({
    host: "127.0.0.1",
    port: new URL(proxy.server).port,
  });
  await once(socket, "connect");
  socket.write(requestText);
  const [data] = await once(socket, "data");
  socket.destroy();
  return data.toString();
}
function proxyAuth(config) {
  return `Proxy-Authorization: Basic ${Buffer.from(`${config.username}:${config.password}`).toString("base64")}\r\n`;
}

test("browser proxy rejects private HTTP and CONNECT targets and unauthenticated use", async (t) => {
  const proxy = new BrowserProxy({ resolve: async () => [privateAddress] });
  const config = await proxy.start();
  t.after(() => proxy.close());
  for (const target of [
    "127.0.0.1",
    "169.254.169.254",
    "business.security-test.invalid",
  ]) {
    assert.match(
      await rawProxy(
        config,
        `CONNECT ${target}:443 HTTP/1.1\r\nHost: ${target}\r\n${proxyAuth(config)}\r\n`,
      ),
      /403/,
    );
    assert.match(
      await rawProxy(
        config,
        `GET http://${target}/ HTTP/1.1\r\nHost: ${target}\r\n${proxyAuth(config)}\r\n`,
      ),
      /403/,
    );
  }
  assert.match(
    await rawProxy(
      config,
      "CONNECT example.com:443 HTTP/1.1\r\nHost: example.com\r\n\r\n",
    ),
    /407/,
  );
  assert.match(
    await rawProxy(
      config,
      `CONNECT example.com:22 HTTP/1.1\r\nHost: example.com\r\n${proxyAuth(config)}\r\n`,
    ),
    /403/,
  );
});

test("browser HTTP forwarding pins DNS and removes proxy credentials", async (t) => {
  const server = await fixture(t, (req, res) => {
    assert.equal(req.headers["proxy-authorization"], undefined);
    assert.equal(req.headers.host, "business.security-test.invalid");
    res.end("own proxy fixture");
  });
  const calls = transportFixture(t, server);
  const proxy = new BrowserProxy({ resolve: async () => [publicAddress] });
  const config = await proxy.start();
  t.after(() => proxy.close());
  const response = await new Promise((accept, reject) => {
    const request = http.request(
      config.server,
      {
        path: "http://business.security-test.invalid/",
        headers: {
          "Proxy-Authorization": `Basic ${Buffer.from(`${config.username}:${config.password}`).toString("base64")}`,
        },
      },
      accept,
    );
    request.on("error", reject);
    request.end();
  });
  let body = "";
  for await (const chunk of response) body += chunk;
  assert.equal(body, "own proxy fixture");
  assert.equal(calls.length, 1);
});

test("browser HTTPS tunnels pin the checked address and recheck a changed DNS answer", async (t) => {
  const fixture = net.createServer((socket) =>
    socket.on("data", (bytes) => socket.write(bytes)),
  );
  fixture.listen(0, "127.0.0.1");
  await once(fixture, "listening");
  const native = net.connect.bind(net);
  let connections = 0,
    resolutions = 0;
  t.mock.method(net, "connect", (options) => {
    if (options.host === "127.0.0.1") return native(options);
    assert.equal(options.host, "business.security-test.invalid");
    options.lookup(options.host, { all: true }, (error, addresses) => {
      assert.ifError(error);
      assert.deepEqual(addresses, [publicAddress]);
      connections++;
    });
    return native({ host: "127.0.0.1", port: fixture.address().port });
  });
  const proxy = new BrowserProxy({
    resolve: async () =>
      ++resolutions === 1 ? [publicAddress] : [privateAddress],
  });
  const config = await proxy.start();
  t.after(async () => {
    await proxy.close();
    await new Promise((resolve) => fixture.close(resolve));
  });
  const request = `CONNECT business.security-test.invalid:443 HTTP/1.1\r\nHost: business.security-test.invalid\r\n${proxyAuth(config)}\r\n`;
  assert.match(await rawProxy(config, request), /200 Connection Established/);
  assert.match(await rawProxy(config, request), /403/);
  assert.equal(connections, 1);
  assert.equal(resolutions, 2);
});

test("collector child processes receive no app secrets or injected runtime/proxy options", async () => {
  const env = scraperEnvironment({
    ...process.env,
    DATABASE_URL: "sentinel",
    R2_SECRET_ACCESS_KEY: "sentinel",
    TELEGRAM_BOT_TOKEN: "sentinel",
    NODE_OPTIONS: "--require=bad",
    HTTP_PROXY: "http://bad",
    NODE_TLS_REJECT_UNAUTHORIZED: "0",
    LD_PRELOAD: "bad",
    R2_ACCESS_KEY_ID: "sentinel",
    PLATFORM_ADMIN_TELEGRAM_IDS: "123",
  });
  const { stdout } = await promisify(execFile)(
    process.execPath,
    ["-e", "console.log(JSON.stringify(Object.keys(process.env)))"],
    { env },
  );
  const keys = JSON.parse(stdout).map((key) => key.toUpperCase());
  for (const forbidden of [
    "DATABASE_URL",
    "R2_SECRET_ACCESS_KEY",
    "R2_ACCESS_KEY_ID",
    "TELEGRAM_BOT_TOKEN",
    "NODE_OPTIONS",
    "HTTP_PROXY",
    "NODE_TLS_REJECT_UNAUTHORIZED",
    "LD_PRELOAD",
    "PLATFORM_ADMIN_TELEGRAM_IDS",
  ]) {
    assert.ok(!keys.includes(forbidden), forbidden);
  }
  assert.ok(keys.includes("PATH"));
});

test("browser launch requires sandbox, filtered environment and proxy; failures close the proxy", async (t) => {
  const handlers = {};
  const context = {
    route: async (_glob, handler) => {
      handlers.http = handler;
    },
    routeWebSocket: async (_glob, handler) => {
      handlers.ws = handler;
    },
  };
  let options;
  t.mock.method(chromium, "launch", async (value) => {
    options = value;
    return { newContext: async () => context, close: async () => {} };
  });
  const browser = new BrowserSession({ channel: "chrome" });
  await browser.start();
  t.after(() => browser.close());
  assert.equal(options.chromiumSandbox, true);
  assert.equal(options.env.DATABASE_URL, undefined);
  assert.equal(options.proxy.bypass, "<-loopback>");
  let closed = false;
  handlers.ws({
    close: () => {
      closed = true;
    },
  });
  assert.ok(closed);
  const frame = { page: () => ({ mainFrame: () => frame }) };
  for (const url of [
    "file:///secret",
    "https://consent.google.evil.invalid/",
    "http://127.0.0.1/",
  ]) {
    let aborted = false;
    await handlers.http({
      request: () => ({
        url: () => url,
        resourceType: () => "document",
        isNavigationRequest: () => true,
        frame: () => frame,
      }),
      abort: () => {
        aborted = true;
      },
      continue: () => {
        throw new Error("must abort");
      },
    });
    assert.ok(aborted, url);
  }
  await browser.close();
  t.mock.method(chromium, "launch", async () => {
    throw new Error("sandbox unavailable");
  });
  const failing = new BrowserSession({ channel: "chrome" });
  await assert.rejects(failing.start(), /sandbox unavailable/);
  assert.equal(failing.proxy, null);
});
