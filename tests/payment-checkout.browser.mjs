// Local, mocked browser QA only. Requires Playwright (or PLAYWRIGHT_MODULE_PATH).
// No provider requests, real payments, authentication or database fixtures.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { completeInvitation } from "./fixtures/publication.ts";
import { templateById } from "../packages/contracts/src/index.ts";

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
    const invitation = completeInvitation();
    const order = {
      id: "f9986cab-2ccf-4d14-afd0-bf17858ce154",
      invitationId: invitation.id,
      templateName: "Anor",
      amountMinor: 100000,
      status: "PENDING",
      checkoutUrl,
      url: null,
      publicationError: null,
    };
    const paymentContext = {
      invitation,
      order,
      template: { name: "Anor", priceMinor: 100000 },
      publishingMode: "paid",
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
          if (url.pathname === `/api/payments/${order.id}`)
            return verified
              ? route.fulfill({
                  json: paymentContext,
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
        assert.equal(await page.getByRole("combobox").count(), 0);
        assert.equal(new URL(page.url()).searchParams.get("order"), order.id);
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
        await page.getByText("Click ochilmayaptimi?", { exact: true }).click();
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
          new URL(page.url()).searchParams.get("order"),
          order.id,
          "URL retains original order after reload",
        );
        const refresh = page.getByRole("button", {
          name: "To‘lovni tekshirish",
          exact: true,
        });
        await refresh.waitFor();
        await page.waitForFunction(() =>
          [...document.querySelectorAll("button")].some(
            (button) =>
              button.textContent === "To‘lovni tekshirish" && !button.disabled,
          ),
        );
        confirmed = true;
        await refresh.click();
        await page
          .getByRole("heading", { name: "Taklifnomangiz tayyor" })
          .waitFor();
        assert.equal(await launch.count(), 0);
        assert.equal(await refresh.count(), 0);
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

      // Invitation-specific pages: no account-wide order list or substitution.
      const qaDir = new URL("../.tmp-payment-ux/", import.meta.url);
      await mkdir(qaDir, { recursive: true });
      const qaUser = {
        id: "ux-owner",
        displayName: "Nodir",
        telegramUserId: "123",
        phoneShared: true,
        isAdmin: false,
      };
      const paidDraft = {
        ...completeInvitation(),
        payment: { id: order.id, status: "SUCCEEDED", amountMinor: 100000 },
      };
      paidDraft.content["uz-Latn"].people = ["Nodir", "Madina"];
      const unpaidDraft = completeInvitation();
      unpaidDraft.content["uz-Latn"].people = ["Aziz", "Malika"];
      const pendingDraft = {
        ...completeInvitation(),
        payment: {
          ...paidDraft.payment,
          id: "a9986cab-2ccf-4d14-afd0-bf17858ce154",
          status: "PENDING",
        },
      };
      pendingDraft.content["uz-Latn"].people = ["Sardor", "Dilnoza"];
      const publishedInvitation = {
        ...completeInvitation(),
        status: "published",
        slug: "Ab1234",
        payment: { ...paidDraft.payment },
      };
      publishedInvitation.content["uz-Latn"].people = ["Javohir", "Sevara"];
      const cards = [paidDraft, unpaidDraft, pendingDraft, publishedInvitation];
      for (const width of [1440, 390, 320]) {
        const context = await browser.newContext({
          viewport: { width, height: 960 },
        });
        const apiCalls = [],
          errors = [];
        let state = "unpaid";
        let latestOrder = null;
        const uxContext = () => ({
          invitation:
            state === "published"
              ? { ...publishedInvitation, id: unpaidDraft.id }
              : unpaidDraft,
          template: paymentContext.template,
          publishingMode: "paid",
          order:
            state === "unpaid"
              ? latestOrder
              : {
                  ...order,
                  invitationId: unpaidDraft.id,
                  templateName:
                    state === "failed" ? "Previous design" : order.templateName,
                  status:
                    state === "paid" || state === "published"
                      ? "SUCCEEDED"
                      : state === "failed"
                        ? "FAILED"
                        : state === "refund"
                          ? "REFUNDED"
                          : "PENDING",
                  checkoutUrl: state === "pending" ? checkoutUrl : null,
                  url: state === "published" ? "/i/Ab1234" : null,
                  publicationError:
                    state === "paid"
                      ? "Galereyadagi rasmlarni tekshiring yoki olib tashlang."
                      : null,
                },
        });
        await context.route("**/*", async (route) => {
          const request = route.request(),
            url = new URL(request.url());
          if (url.origin !== origin) return route.abort();
          if (!url.pathname.startsWith("/api/")) return route.continue();
          apiCalls.push(`${request.method()} ${url.pathname}`);
          if (url.pathname === "/api/auth/session")
            return route.fulfill({ json: { user: qaUser, configured: true } });
          if (url.pathname === "/api/catalog")
            return route.fulfill({
              json: {
                templates: [templateById("anor")],
                categories: [],
                publishingMode: "paid",
              },
            });
          if (url.pathname === "/api/invitations")
            return route.fulfill({
              json:
                request.method() === "POST"
                  ? {
                      invitation: {
                        ...unpaidDraft,
                        revision: unpaidDraft.revision + 1,
                      },
                    }
                  : { invitations: cards, publishingMode: "paid" },
            });
          if (url.pathname === `/api/invitations/${unpaidDraft.id}/publish`)
            return route.fulfill({
              json: {
                invitation: {
                  ...unpaidDraft,
                  status: "published",
                  slug: "Ab1234",
                },
                url: origin + "/i/Ab1234",
              },
            });
          if (
            url.pathname === `/api/invitations/${unpaidDraft.id}/payment` ||
            url.pathname === `/api/payments/${order.id}`
          )
            return route.fulfill({ json: uxContext() });
          if (url.pathname === `/api/invitations/${unpaidDraft.id}/checkout`) {
            assert.deepEqual(request.postDataJSON(), {
              revision: unpaidDraft.revision,
              expectedAmountMinor: 100000,
            });
            latestOrder = { ...order, invitationId: unpaidDraft.id };
            return route.fulfill({ json: { order: latestOrder } });
          }
          if (url.pathname === `/api/payments/${order.id}/refresh`)
            return route.fulfill({
              json: { order: latestOrder ?? uxContext().order },
            });
          return route.fulfill({
            status: 404,
            json: { error: { message: "Taklifnoma topilmadi." } },
          });
        });
        const page = await context.newPage();
        page.on("pageerror", (error) => errors.push(error.message));
        const noOverflow = async () =>
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            true,
            `overflow at ${width}px`,
          );
        const openInvitation = async () =>
          page.goto(`${origin}/payment/return?invitation=${unpaidDraft.id}`);
        await openInvitation();
        await page
          .getByRole("button", { name: "To‘lov qilish", exact: true })
          .waitFor();
        assert.equal(
          apiCalls.some((call) => call.includes("/checkout")),
          false,
        );
        assert.equal(await page.getByRole("combobox").count(), 0);
        await page.screenshot({
          path: new URL(`unpaid-${width}.png`, qaDir).pathname.slice(1),
          fullPage: true,
        });
        await noOverflow();
        await page
          .getByRole("button", { name: "To‘lov qilish", exact: true })
          .click();
        await page
          .getByRole("button", {
            name: "Click orqali davom etish",
            exact: true,
          })
          .waitFor();
        assert.equal(
          apiCalls.filter((call) => call.includes("/checkout")).length,
          1,
        );
        assert.equal(new URL(page.url()).searchParams.get("order"), order.id);
        latestOrder = null;
        for (state of ["paid", "published", "failed", "refund", "pending"]) {
          await openInvitation();
          await page
            .getByText(
              state === "published" ? "Javohir & Sevara" : "Aziz & Malika",
              { exact: true },
            )
            .waitFor();
          if (["paid", "published"].includes(state)) {
            assert.equal(
              await page
                .getByRole("button", { name: /To‘lov|Click|tekshirish/ })
                .count(),
              0,
            );
            const action = page.getByRole("link", {
              name:
                state === "paid" ? "Nashrni yakunlash" : "Taklifnomani ochish",
              exact: true,
            });
            assert.equal(
              await action.getAttribute("href"),
              state === "paid" ? `/studio/${unpaidDraft.id}` : "/i/Ab1234",
            );
          }
          if (state === "refund")
            assert.equal(
              await page
                .getByRole("button", { name: "To‘lov qilish", exact: true })
                .count(),
              0,
            );
          if (state === "failed") {
            assert.equal(
              await page
                .getByRole("button", { name: "To‘lov qilish", exact: true })
                .count(),
              1,
            );
            assert.equal(
              await page.getByText("Previous design", { exact: true }).count(),
              0,
            );
            assert.equal(
              await page.getByText("Anor", { exact: true }).count(),
              1,
            );
          }
          await noOverflow();
          if (["paid", "published", "pending"].includes(state))
            await page.screenshot({
              path: new URL(`${state}-${width}.png`, qaDir).pathname.slice(1),
              fullPage: true,
            });
        }
        // Even with a remembered valid payment, an explicit invalid link fails.
        await page.goto(
          `${origin}/payment/return?order=11111111-1111-4111-8111-111111111111`,
        );
        await page
          .getByRole("alert")
          .filter({ hasText: "Taklifnoma topilmadi." })
          .waitFor();
        assert.equal(
          await page.getByText("Aziz & Malika", { exact: true }).count(),
          0,
        );
        assert.equal(await page.getByRole("combobox").count(), 0);
        await page.evaluate(() => localStorage.clear());
        const beforeBare = apiCalls.filter((call) =>
          call.includes("/api/payments/"),
        ).length;
        await page.goto(origin + "/payment/return");
        await page
          .getByRole("heading", { name: "Taklifnomani tanlang" })
          .waitFor();
        assert.equal(
          apiCalls.filter((call) => call.includes("/api/payments/")).length,
          beforeBare,
        );
        await page.goto(origin + "/dashboard");
        await page.getByRole("heading", { name: "Nodir & Madina" }).waitFor();
        const paidCard = page.getByRole("article").filter({
          has: page.getByRole("heading", { name: "Nodir & Madina" }),
        });
        const unpaidCard = page.getByRole("article").filter({
          has: page.getByRole("heading", { name: "Aziz & Malika" }),
        });
        const pendingCard = page.getByRole("article").filter({
          has: page.getByRole("heading", { name: "Sardor & Dilnoza" }),
        });
        // Published cards use role=link for their activity navigation.
        const publishedCard = page.locator("article").filter({
          has: page.getByRole("heading", { name: "Javohir & Sevara" }),
        });
        assert.equal(
          await paidCard.getByText("To‘langan", { exact: true }).count(),
          1,
        );
        assert.equal(
          await paidCard
            .getByRole("link", { name: "Nashrni yakunlash", exact: true })
            .getAttribute("href"),
          `/studio/${paidDraft.id}`,
        );
        assert.equal(
          await paidCard.getByRole("link", { name: /To‘lov/ }).count(),
          0,
        );
        assert.equal(
          await unpaidCard
            .getByRole("link", { name: "To‘lov qilish", exact: true })
            .getAttribute("href"),
          `/payment/return?invitation=${unpaidDraft.id}`,
        );
        assert.equal(
          await pendingCard
            .getByRole("link", { name: "To‘lovni yakunlash", exact: true })
            .getAttribute("href"),
          `/payment/return?order=${pendingDraft.payment.id}`,
        );
        assert.equal(
          await publishedCard.getByRole("link", { name: /To‘lov/ }).count(),
          0,
        );
        assert.equal(
          await page.getByText("To‘lov holati", { exact: true }).count(),
          0,
        );
        assert.equal(
          apiCalls.some((call) => call.endsWith(" /api/payments")),
          false,
        );
        await noOverflow();
        await page.screenshot({
          path: new URL(`dashboard-${width}.png`, qaDir).pathname.slice(1),
          fullPage: true,
        });
        if (width === 390) {
          state = "paid";
          await page.evaluate(
            ({ invitation, ownerId }) => {
              localStorage.setItem(
                `taklifnoma:draft:v1:${invitation.id}`,
                JSON.stringify({
                  invitation,
                  ownerId,
                  dirty: true,
                  savedAt: new Date().toISOString(),
                }),
              );
            },
            { invitation: unpaidDraft, ownerId: qaUser.id },
          );
          await page.goto(`${origin}/studio?draft=${unpaidDraft.id}`);
          const publish = page.getByRole("button", {
            name: "Nashrni yakunlash",
            exact: true,
          });
          await publish.waitFor();
          assert.equal(
            await page
              .getByRole("button", { name: /To‘lash va nashr/ })
              .count(),
            0,
          );
          const checkoutsBeforePublish = apiCalls.filter((call) =>
            call.includes("/checkout"),
          ).length;
          await publish.click();
          await page
            .getByText(
              "Taklifnomangiz nashr qilindi. Havolani mehmonlaringiz bilan ulashing.",
              { exact: true },
            )
            .waitFor();
          assert.equal(
            apiCalls.filter((call) => call.includes("/checkout")).length,
            checkoutsBeforePublish,
            "paid correction publishes without another checkout",
          );
        }
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
        if (url.pathname === `/api/payments/${order.id}`) {
          assert.equal(
            verified,
            true,
            "signed launch verified before private orders",
          );
          return route.fulfill({
            json: paymentContext,
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
        "https://t.me/fixture_bot",
      );
      assert.equal(
        calls.includes(`/api/payments/${order.id}`),
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
        new URL(page.url()).searchParams.get("order"),
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
          calls.indexOf(`/api/payments/${order.id}`),
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
        (path) => path === `/api/payments/${order.id}`,
      ).length;
      await page.goto(
        `${origin}/payment/return#tgWebAppData=${encodeURIComponent(rawLaunch)}`,
      );
      await page
        .getByRole("button", { name: "Qayta yuklash", exact: true })
        .waitFor();
      assert.equal(
        calls.filter((path) => path === `/api/payments/${order.id}`).length,
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
