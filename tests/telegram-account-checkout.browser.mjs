// Local browser regression: no database, Telegram sends or provider requests.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { completeInvitation } from "./fixtures/publication.ts";

test(
  "Telegram account proceeds directly to checkout on first and repeat purchases without phone collection",
  { timeout: 120000 },
  async () => {
    const require = createRequire(
      new URL("../apps/web/package.json", import.meta.url),
    );
    const { chromium } = require(
      process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
    );
    const origin = "http://127.0.0.1:3104";
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
        "3104",
      ],
      {
        cwd: new URL("../apps/web", import.meta.url),
        windowsHide: true,
        env: {
          ...process.env,
          DATABASE_URL: "",
          TELEGRAM_BOT_USERNAME: "fixture_bot",
          NODZE_API_KEY: "",
          NODZE_WEBHOOK_SECRET: "",
          TAKLIFNOMA_BUILD_DIST_DIR: ".next-account-checkout-test",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let output = "",
      browser;
    app.stdout.on("data", (data) => {
      output += data;
    });
    app.stderr.on("data", (data) => {
      output += data;
    });
    try {
      const deadline = Date.now() + 60000;
      let ready = false;
      while (Date.now() < deadline) {
        try {
          ready = (await fetch(origin + "/api/auth/session")).ok;
        } catch {
          /* startup */
        }
        if (ready) break;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      assert.ok(ready, output.slice(-2000));
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      await context.addInitScript(() => {
        window.contactRequests = 0;
        window.Telegram = {
          WebApp: {
            platform: "android",
            requestContact() {
              window.contactRequests++;
              throw new Error("Phone must never be requested");
            },
          },
        };
      });
      const invitation = completeInvitation();
      const calls = [],
        errors = [];
      let checkouts = 0;
      await context.route("**/*", async (route) => {
        const request = route.request(),
          url = new URL(request.url());
        if (url.origin !== origin) return route.abort();
        if (!url.pathname.startsWith("/api/")) return route.continue();
        calls.push(url.pathname);
        if (url.pathname === "/api/auth/session")
          return route.fulfill({
            json: {
              configured: true,
              user: {
                id: "telegram-owner",
                telegramUserId: "123",
                displayName: "Nodir",
                isAdmin: false,
              },
            },
          });
        if (url.pathname === `/api/invitations/${invitation.id}/payment`)
          return route.fulfill({
            json: {
              invitation,

              order: null,
              template: { name: "Anor", priceMinor: 100000 },
            },
          });
        if (url.pathname === `/api/invitations/${invitation.id}/checkout`) {
          assert.deepEqual(request.postDataJSON(), {
            revision: invitation.revision,
            expectedAmountMinor: 100000,
          });
          checkouts++;
          return route.fulfill({
            json: {
              order: {
                id: "f9986cab-2ccf-4d14-afd0-bf17858ce154",
                invitationId: invitation.id,
                templateName: "Anor",
                amountMinor: 100000,
                status: "PENDING",
                checkoutUrl: "https://my.click.uz/services/pay?fixture=1",
                url: null,
              },
            },
          });
        }
        if (url.pathname.endsWith("/refresh"))
          return route.fulfill({
            json: {
              order: {
                id: "f9986cab-2ccf-4d14-afd0-bf17858ce154",
                status: "PENDING",
                amountMinor: 100000,
                templateName: "Anor",
                checkoutUrl: "https://my.click.uz/services/pay?fixture=1",
              },
            },
          });
        return route.fulfill({ status: 404, json: {} });
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(error.message));
      for (let purchase = 1; purchase <= 2; purchase++) {
        await page.goto(`${origin}/payment/return?invitation=${invitation.id}`);
        await page
          .getByRole("button", { name: "To‘lov qilish", exact: true })
          .click();
        await page
          .getByRole("button", {
            name: "Click orqali davom etish",
            exact: true,
          })
          .waitFor();
        assert.equal(checkouts, purchase);
        assert.equal(await page.evaluate(() => window.contactRequests), 0);
        assert.equal(await page.locator('input[type="tel"]').count(), 0);
        assert.equal(
          await page
            .getByRole("heading", { name: /telefon raqamingiz/i })
            .count(),
          0,
        );
      }
      assert.ok(!calls.some((path) => /phone|contact/.test(path)));
      assert.deepEqual(errors, []);
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
