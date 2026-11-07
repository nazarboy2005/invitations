// Real React component with synthetic API responses; no database or Telegram calls.
import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const webRequire = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { chromium } = webRequire(
  "playwright",
) as typeof import("../apps/web/node_modules/playwright");
const { build } = createRequire(require.resolve("tsx"))("esbuild");

test(
  "admin verification automatically completes, detects a separate login and recovers from failures",
  { timeout: 60_000 },
  async () => {
    const bundle = await build({
      absWorkingDir: fileURLToPath(new URL("../apps/web/", import.meta.url)),
      stdin: {
        contents: `import { createRoot } from "react-dom/client";
        import { AdminVerify } from "./src/modules/admin/admin-verify";
        createRoot(document.getElementById("root")).render(<AdminVerify userId="admin-qa" displayName="Verification QA" />);`,
        resolveDir: fileURLToPath(new URL("../apps/web/", import.meta.url)),
        loader: "tsx",
      },
      bundle: true,
      write: false,
      format: "iife",
      jsx: "automatic",
      define: { "process.env.NODE_ENV": '"production"' },
      plugins: [
        {
          name: "fixture-shell",
          setup(builder: any) {
            builder.onResolve({ filter: /\.module\.css$/ }, () => ({
              path: "styles",
              namespace: "fixture",
            }));
            builder.onResolve({ filter: /^next\/link$/ }, () => ({
              path: "link",
              namespace: "fixture",
            }));
            builder.onLoad(
              { filter: /.*/, namespace: "fixture" },
              ({ path }: { path: string }) => ({
                contents:
                  path === "styles"
                    ? "export default {};"
                    : 'import { createElement } from "react"; export default function Link(props) { return createElement("a", props); }',
                resolveDir: fileURLToPath(
                  new URL("../apps/web/", import.meta.url),
                ),
              }),
            );
          },
        },
      ],
    });
    const server = createServer((request, response) => {
      if (request.url === "/fixture.js") {
        response.setHeader("Content-Type", "text/javascript");
        response.end(bundle.outputFiles[0].text);
      } else {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(
          request.url === "/admin"
            ? "<h1>Admin home</h1>"
            : '<!doctype html><html><body><div id="root"></div><script src="/fixture.js"></script></body></html>',
        );
      }
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const address = server.address() as { port: number };
    const origin = `http://127.0.0.1:${address.port}`;
    const browser = await chromium.launch({ headless: true });
    const errors: string[] = [];
    try {
      async function scenario() {
        const context = await browser.newContext();
        const page = await context.newPage();
        page.on("pageerror", (error) => errors.push(error.message));
        const state = {
          verified: false,
          confirmation: "pending",
          identity: "admin-qa",
          exchangeError: "",
          exchanges: 0,
        };
        await page.route("**/api/admin/reauth", (route) => {
          if (route.request().method() === "GET")
            return route.fulfill({
              json: { user: { id: "admin-qa" }, verified: state.verified },
            });
          state.exchanges++;
          assert.deepEqual(route.request().postDataJSON(), {
            requestId: "fixture-request",
          });
          if (state.exchangeError)
            return route.fulfill({
              status: 409,
              json: { error: { message: state.exchangeError } },
            });
          state.verified = true;
          return route.fulfill({ json: { ok: true } });
        });
        await page.route("**/api/auth/telegram/start", (route) =>
          route.fulfill({
            json: {
              requestId: "fixture-request",
              loginUrl: "https://t.me/test_bot?start=fixture",
            },
          }),
        );
        await page.route("**/api/auth/telegram/status?*", (route) =>
          route.fulfill({
            json: { state: state.confirmation, user: { id: state.identity } },
          }),
        );
        await page.goto(origin + "/admin/verify");
        await page
          .getByRole("button", { name: "Telegram orqali tasdiqlash" })
          .waitFor();
        return { page, context, state };
      }

      // Confirmation finishes the exchange without a separate 'enter admin' click.
      {
        const s = await scenario();
        await s.page
          .getByRole("button", { name: "Telegram orqali tasdiqlash" })
          .click();
        await s.page.getByText("Botdagi tasdiqni kutyapmiz…").waitFor();
        s.state.confirmation = "confirmed";
        await s.page.evaluate(() => {
          window.dispatchEvent(new Event("focus"));
          window.dispatchEvent(new Event("focus"));
        });
        await s.page.waitForURL(origin + "/admin");
        assert.equal(s.state.exchanges, 1);
        await s.context.close();
      }

      // A separate login dismisses the stale screen even without a pending bot request.
      for (const event of ["focus", "pageshow", "session-changed"]) {
        const s = await scenario();
        s.state.verified = true;
        await s.page.evaluate(
          (name) => window.dispatchEvent(new Event(name)),
          event,
        );
        await s.page.waitForURL(origin + "/admin");
        assert.equal(s.state.exchanges, 0);
        await s.context.close();
      }

      for (const failure of [
        "expired",
        "consumed",
        "wrong-account",
        "exchange-failed",
      ]) {
        const s = await scenario();
        s.state.confirmation =
          failure === "expired" || failure === "consumed"
            ? failure
            : "confirmed";
        if (failure === "wrong-account") s.state.identity = "another-admin";
        if (failure === "exchange-failed")
          s.state.exchangeError = "Tasdiqlash muddati tugagan.";
        await s.page
          .getByRole("button", { name: "Telegram orqali tasdiqlash" })
          .click();
        await s.page.getByRole("alert").waitFor();
        assert.equal(s.page.url(), origin + "/admin/verify");
        assert.equal(s.state.exchanges, failure === "exchange-failed" ? 1 : 0);
        assert.equal(
          await s.page
            .getByText("Telegram hisobi tasdiqlandi.", { exact: false })
            .count(),
          0,
        );
        assert.equal(
          await s.page
            .getByRole("button", { name: "Telegram orqali tasdiqlash" })
            .isEnabled(),
          true,
        );
        // Every error leaves a usable path to a new, successful confirmation.
        s.state.confirmation = "confirmed";
        s.state.identity = "admin-qa";
        s.state.exchangeError = "";
        await s.page
          .getByRole("button", { name: "Telegram orqali tasdiqlash" })
          .click();
        await s.page.waitForURL(origin + "/admin");
        await s.context.close();
      }
      assert.deepEqual(errors, []);
    } finally {
      await browser.close();
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  },
);
