// Local, mocked browser QA only. Requires Playwright (or PLAYWRIGHT_MODULE_PATH).
// No provider requests, real payments, authentication or database fixtures.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

test(
  "checkout handoff, recovery and authenticated Mini App return",
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
          TELEGRAM_BOT_USERNAME: "fixture_bot",
          TELEGRAM_MAIN_MINI_APP_ENABLED: "false",
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
        let verified = mode === "browser";
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
          const user = {
            id: "fixture-creator",
            telegramUserId: "123",
            displayName: "Creator",
            phoneShared: true,
            isAdmin: false,
          };
          if (url.pathname === "/api/auth/telegram/mini-app") {
            verified = true;
            return route.fulfill({ json: { user } });
          }
          if (url.pathname === "/api/auth/session")
            return route.fulfill({
              json: { user: verified ? user : null, configured: true },
            });
          if (url.pathname === "/api/payments")
            return verified
              ? route.fulfill({
                  json: { orders: [{ ...order, id: "newer-order" }, order] },
                })
              : route.fulfill({ status: 401, json: {} });
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

      // Fresh external browser: no inherited Mini App cookie, no private data.
      // Then simulate Telegram opening a fresh launch into the root route.
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      const calls = [],
        pageErrors = [];
      let verified = false,
        rejectLaunch = false;
      const rawLaunch = "start_param=payment_return&user=fixture&hash=fixture";
      const returnedUser = {
        id: "returning-owner",
        telegramUserId: "456",
        displayName: "Returning owner",
        phoneShared: true,
        isAdmin: true,
      };
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
        calls.push(url.pathname);
        if (url.pathname === "/api/auth/telegram/mini-app") {
          assert.equal(request.postDataJSON().initData, rawLaunch);
          if (rejectLaunch)
            return route.fulfill({
              status: 401,
              json: { error: { message: "Invalid launch" } },
            });
          verified = true;
          return route.fulfill({ json: { user: returnedUser } });
        }
        if (url.pathname === "/api/auth/session")
          return route.fulfill({
            json: { user: verified ? returnedUser : null, configured: true },
          });
        if (url.pathname === "/api/payments") {
          assert.equal(
            verified,
            true,
            "signed launch verified before private orders",
          );
          return route.fulfill({
            json: { orders: [{ ...order, id: "newer-order" }, order] },
          });
        }
        if (url.pathname === `/api/payments/${order.id}/refresh`)
          return route.fulfill({ json: { order } });
        return route.abort();
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await page.goto(origin + "/payment/return");
      await page
        .getByRole("link", { name: "Brauzerda hisobga kirish" })
        .waitFor();
      assert.equal(
        await page
          .getByRole("link", { name: "Telegram’da davom etish" })
          .getAttribute("href"),
        "https://t.me/fixture_bot?start=payment_return",
      );
      assert.equal(
        calls.includes("/api/payments"),
        false,
        "anonymous return cannot expose orders",
      );
      assert.equal(
        calls.includes("/api/auth/telegram/start"),
        false,
        "no repeated interactive login automatically",
      );
      await page.evaluate((id) => {
        localStorage.setItem("nodze-order:returning-owner", id);
        sessionStorage.clear();
      }, order.id);
      await page.goto(
        `${origin}/#tgWebAppData=${encodeURIComponent(rawLaunch)}`,
      );
      await page.waitForURL("**/payment/return**");
      await page
        .getByRole("button", { name: "Click orqali davom etish", exact: true })
        .waitFor();
      assert.equal(
        await page.locator("select").inputValue(),
        order.id,
        "recover account-scoped selection in fresh Mini App",
      );
      assert.equal(
        await page
          .getByRole("link", { name: "Brauzerda hisobga kirish" })
          .count(),
        0,
      );
      assert.ok(
        !page.url().includes("/admin"),
        "explicit payment launch takes priority for admins",
      );
      assert.ok(
        calls.indexOf("/api/auth/telegram/mini-app") <
          calls.indexOf("/api/payments"),
      );
      assert.deepEqual(pageErrors, []);

      // Real SDKs keep start_param in initData after navigation. Do not consume
      // that original launch again when leaving the payment page.
      await page.evaluate((data) => {
        window.Telegram = {
          WebApp: { initData: data, ready() {}, expand() {} },
        };
      }, rawLaunch);
      await page
        .getByRole("link", { name: "Taklifnomalarim", exact: true })
        .click();
      await page.waitForURL("**/admin");
      assert.ok(!page.url().includes("/payment/return"));

      // Even an existing browser account must not authorize a failed Telegram launch.
      rejectLaunch = true;
      const beforeFailure = calls.filter(
        (path) => path === "/api/payments",
      ).length;
      await page.goto(
        `${origin}/payment/return#tgWebAppData=${encodeURIComponent(rawLaunch)}`,
      );
      await page
        .getByRole("button", { name: "Qayta tekshirish", exact: true })
        .waitFor();
      assert.equal(
        calls.filter((path) => path === "/api/payments").length,
        beforeFailure,
      );
      assert.equal(
        await page.getByText(order.templateName, { exact: true }).count(),
        0,
      );
      assert.equal(
        calls.some((path) => path.includes("/checkout")),
        false,
      );
      await context.close();
    } finally {
      await browser?.close();
      app.kill();
      await Promise.all(
        generated.map((path, index) => writeFile(path, originals[index])),
      );
    }
  },
);
