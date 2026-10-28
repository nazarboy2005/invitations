// Local, mocked browser QA only. Requires Playwright (or PLAYWRIGHT_MODULE_PATH).
// No provider requests, real payments, authentication or database fixtures.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

test(
  "checkout fresh tap, recovery, order retention and verified-status UI",
  { timeout: 180000 },
  async () => {
    const require = createRequire(
      new URL("../apps/web/package.json", import.meta.url),
    );
    const { chromium } = require(
      process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
    );
    const origin = "http://127.0.0.1:3103";
    const checkoutUrl =
      "https://my.click.uz:443/services/pay?token=a%2fb%2Bc&order=existing";
    const order = {
      id: "original-order",
      invitationId: "original-invitation",
      templateName: "Anor",
      amountMinor: 100000,
      status: "PENDING",
      checkoutUrl,
      url: null,
      publicationError: null,
    };
    const generated = ["next-env.d.ts", "tsconfig.json"].map(
      (name) => new URL(`../apps/web/${name}`, import.meta.url),
    );
    const originals = await Promise.all(
      generated.map((path) => readFile(path, "utf8")),
    );
    const app = spawn(
      process.execPath,
      [
        require.resolve("next/dist/bin/next"),
        "dev",
        "--hostname",
        "127.0.0.1",
        "--port",
        "3103",
      ],
      {
        cwd: new URL("../apps/web", import.meta.url),
        windowsHide: true,
        env: {
          ...process.env,
          DATABASE_URL: "",
          NODZE_API_KEY: "",
          NODZE_WEBHOOK_SECRET: "",
          TAKLIFNOMA_BUILD_DIST_DIR: ".next-payment-browser-test",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let output = "";
    app.stdout.on("data", (data) => {
      output += data;
    });
    app.stderr.on("data", (data) => {
      output += data;
    });
    let browser;
    try {
      const deadline = Date.now() + 60000;
      let ready = false;
      while (Date.now() < deadline) {
        try {
          ready = (await fetch(origin + "/payment/return")).ok;
        } catch {
          /* Starting. */
        }
        if (ready) break;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      assert.ok(ready, output.slice(-3000));
      browser = await chromium.launch({ channel: "chrome", headless: true });
      for (const mode of ["telegram", "unavailable", "browser"]) {
        const context = await browser.newContext({
          viewport: { width: 390, height: 844 },
        });
        const requests = [],
          errors = [];
        let confirmed = false;
        await context.addInitScript(
          ({ mode }) => {
            window.launches = [];
            window.open = (...args) => {
              window.launches.push({
                args,
                active: navigator.userActivation.isActive,
                browser: true,
              });
              return null;
            };
            if (mode !== "browser")
              window.Telegram = {
                WebApp: {
                  initData: "fixture-launch",
                  platform: "android",
                  ready() {},
                  ...(mode === "telegram"
                    ? {
                        openLink(url) {
                          window.launches.push({
                            args: [url],
                            active: navigator.userActivation.isActive,
                          });
                          if (window.failLaunch)
                            throw new Error("fixture bridge failure");
                        },
                      }
                    : {}),
                },
              };
            Object.defineProperty(navigator, "clipboard", {
              configurable: true,
              value: {
                writeText: async () => {
                  throw new Error("fixture clipboard denied");
                },
              },
            });
          },
          { mode },
        );
        await context.route("**/*", async (route) => {
          const request = route.request(),
            url = new URL(request.url());
          if (url.origin !== origin) {
            if (url.hostname === "telegram.org")
              return route.fulfill({
                body: "",
                contentType: "application/javascript",
              });
            return route.abort();
          }
          if (!url.pathname.startsWith("/api/")) return route.continue();
          requests.push(`${request.method()} ${url.pathname}`);
          if (url.pathname === "/api/payments")
            return route.fulfill({
              json: { orders: [{ ...order, id: "newer-order" }, order] },
            });
          if (url.pathname === `/api/payments/${order.id}/refresh`)
            return route.fulfill({
              json: {
                order: confirmed
                  ? {
                      ...order,
                      status: "SUCCEEDED",
                      checkoutUrl: null,
                      url: "/i/Ab1234",
                    }
                  : order,
              },
            });
          return route.abort();
        });
        const page = await context.newPage();
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`${origin}/payment/return?order=${order.id}`);
        const launch = page.getByRole("button", {
          name: "Click orqali davom etish",
          exact: true,
        });
        await launch.waitFor();
        await page.waitForFunction(
          () => document.querySelector("select")?.value === "original-order",
        );
        assert.deepEqual(
          await page.evaluate(() => window.launches),
          [],
          "no automatic launch",
        );
        await launch.click();
        if (mode === "unavailable") {
          await page
            .getByRole("status")
            .filter({ hasText: "Havolani ochib bo‘lmadi" })
            .waitFor();
          assert.deepEqual(await page.evaluate(() => window.launches), []);
        } else {
          const calls = await page.evaluate(() => window.launches);
          assert.equal(calls.length, 1);
          assert.equal(calls[0].args[0], checkoutUrl);
          assert.equal(
            calls[0].active,
            true,
            "native launch stays on fresh user activation",
          );
        }
        assert.equal(
          await page
            .getByText("To‘lov kutilmoqda", { exact: true })
            .isVisible(),
          true,
        );
        if (mode === "telegram") {
          await page.evaluate(() => {
            window.failLaunch = true;
          });
          await launch.click();
          await page
            .getByRole("status")
            .filter({ hasText: "Havolani ochib bo‘lmadi" })
            .waitFor();
        }
        await page
          .getByRole("button", {
            name: "To‘lov havolasini nusxalash",
            exact: true,
          })
          .click();
        assert.equal(
          await page
            .getByRole("textbox", { name: "To‘lov havolasi" })
            .inputValue(),
          checkoutUrl,
        );
        assert.equal(await page.getByText(/Open in browser/).isVisible(), true);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await page.evaluate(() => {
          sessionStorage.clear();
        });
        await context.addInitScript(() => {
          Storage.prototype.getItem = Storage.prototype.setItem = () => {
            throw new Error("fixture storage denied");
          };
        });
        await page.reload();
        await launch.waitFor();
        assert.equal(
          await page.locator("select").inputValue(),
          order.id,
          "URL retains original order after reload",
        );
        confirmed = true;
        const refresh = page.getByRole("button", {
          name: "Holatni tekshirish",
          exact: true,
        });
        await refresh.waitFor();
        await refresh.click();
        await page.getByText("To‘lov tasdiqlandi", { exact: true }).waitFor();
        assert.ok(
          requests.filter((item) => item.endsWith(`/${order.id}/refresh`))
            .length >= 2,
        );
        assert.equal(
          requests.some((item) => item.includes("/checkout")),
          false,
          "launch/recovery never creates payment",
        );
        assert.deepEqual(errors, []);
        await context.close();
      }
    } finally {
      await browser?.close();
      app.kill();
      await Promise.all(
        generated.map((path, index) => writeFile(path, originals[index])),
      );
    }
  },
);
