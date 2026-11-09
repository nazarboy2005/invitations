import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import ts from "typescript";

test("shared template gate protects JSON, file uploads and retries without changing payloads", async (t) => {
  const requireWeb = createRequire(
    new URL("../apps/web/package.json", import.meta.url),
  );
  const { chromium } = requireWeb(
    "playwright",
  ) as typeof import("../apps/web/node_modules/playwright");
  const server = createServer((_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end('<!doctype html><html lang="uz-Latn"><body></body></html>');
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const address = server.address() as { port: number };
  const origin = `http://127.0.0.1:${address.port}`;
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage();
  const posts: Array<{ url: string; token?: string; body: string }> = [];
  await page.route("**/api/public/**", async (route) => {
    const req = route.request();
    posts.push({
      url: req.url(),
      token: req.headers()["cf-turnstile-response"],
      body: req.postData() ?? "",
    });
    await route.fulfill({ json: { ok: true } });
  });
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `window.widgetLog=[];window.turnstile={render(el,options){const id=String(widgetLog.length);widgetLog.push({id,action:options.action});if(!window.holdChallenge)setTimeout(()=>options.callback('token-'+id),5);return id;},reset(id){widgetLog.find(w=>w.id===id).reset=true},remove(id){widgetLog.find(w=>w.id===id).removed=true}};`,
    }),
  );
  await page.goto(origin);
  const source = await readFile(
    new URL("../apps/web/src/lib/turnstile-client.ts", import.meta.url),
    "utf8",
  );
  const compiled = ts
    .transpileModule(
      source.replace(
        "process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY",
        '"test-site-key"',
      ),
      {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      },
    )
    .outputText.replace(
      "export function installTurnstileFetch",
      "function installTurnstileFetch",
    );
  await page.addScriptTag({
    content: `${compiled}\nwindow.installGate=installTurnstileFetch;installTurnstileFetch(window,location.href);`,
  });
  const result = await page.evaluate(async () => {
    const base = "/api/public/invitations/test/";
    const json = JSON.stringify({ name: "Guest", message: "Hello" });
    await Promise.all([
      fetch(base + "wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      }),
      fetch(base + "rsvp", { method: "POST", body: json }),
    ]);
    const form = new FormData();
    form.set("giverNames", "Guest");
    form.set("file", new File(["file-content"], "receipt.pdf"));
    await fetch(base + "receipts", { method: "POST", body: form });
    await fetch(base + "gift-intentions", { method: "POST", body: json });
    await fetch(base + "wishes");
    const frame = document.createElement("iframe");
    document.body.append(frame);
    await new Promise<void>((resolve) => {
      frame.onload = () => resolve();
      frame.src = "/frame";
    });
    const scope = frame.contentWindow! as Window & typeof globalThis;
    const uninstall = (window as any).installGate(scope, scope.location.href);
    const visitorFetch = scope.fetch;
    scope.fetch = (...args) => visitorFetch(...args);
    uninstall();
    (window as any).installGate(scope, scope.location.href);
    await scope.fetch(
      new scope.Request(location.origin + base + "wishes", {
        method: "POST",
        body: json,
      }),
    );
    return (window as any).widgetLog;
  });
  assert.deepEqual(
    result.map((item: any) => item.action),
    [
      "guest_wish",
      "guest_rsvp",
      "guest_receipt",
      "guest_gift_intention",
      "guest_wish",
    ],
  );
  assert.ok(result.every((item: any) => item.reset && item.removed));
  assert.equal(
    new Set(posts.filter((item) => item.token).map((item) => item.token)).size,
    5,
  );
  assert.equal(
    posts[0].body,
    JSON.stringify({ name: "Guest", message: "Hello" }),
  );
  assert.match(posts[2].body, /filename="receipt.pdf"/);
  assert.match(posts[2].body, /file-content/);
  assert.equal(posts[4].token, undefined);
  await page.evaluate(() => {
    (window as any).holdChallenge = true;
    (window as any).cancelled = fetch("/api/public/invitations/test/wishes", {
      method: "POST",
    }).then((r) => r.status);
  });
  await page.getByRole("button", { name: "Bekor qilish" }).click();
  assert.equal(await page.evaluate(() => (window as any).cancelled), 403);
  assert.equal(posts.length, 6);
  await page.evaluate(async () => {
    (window as any).holdChallenge = false;
    await fetch("/api/public/invitations/test/wishes", { method: "POST" });
  });
  assert.equal(posts.length, 7);
});
