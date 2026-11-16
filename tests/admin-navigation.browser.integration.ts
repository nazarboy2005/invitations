// Local app only, disposable database identities, no Telegram network requests.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";

const webRequire = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { chromium } = webRequire(
  "playwright",
) as typeof import("../apps/web/node_modules/playwright");
const origin = process.env.APP_URL!;

test(
  "admin entry is explicit and admin controls stay absent for visitors and ordinary accounts",
  { timeout: 180_000 },
  async () => {
    assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
    const db = getDb();
    const fixtures = [
      { id: randomUUID(), token: randomToken(), admin: true, age: "1 day" },
      { id: randomUUID(), token: randomToken(), admin: true, age: "8 days" },
      { id: randomUUID(), token: randomToken(), admin: false, age: "1 day" },
    ];
    const browser = await chromium.launch({ headless: true });
    const errors: string[] = [];
    try {
      for (const fixture of fixtures) {
        await db`INSERT INTO users(id,telegram_user_id,display_name,is_admin) VALUES(${fixture.id},${-Math.floor(Math.random() * 1e12) - 1},'Admin navigation QA',${fixture.admin})`;
        await db`INSERT INTO sessions(user_id,token_hash,created_at,expires_at,absolute_expires_at) VALUES(${fixture.id},${digest(fixture.token)},now()-${fixture.age}::interval,now()+interval '1 day',now()+interval '2 days')`;
      }
      await mkdir("test-results/admin-navigation", { recursive: true });
      for (const fixture of [...fixtures, null]) {
        const context = await browser.newContext();
        if (fixture)
          await context.addCookies([
            { name: "taklifnoma_session", value: fixture.token, url: origin },
          ]);
        await context.route("https://telegram.org/**", (route) =>
          route.abort(),
        );
        await context.addInitScript(() => {
          (window as any).sessionSettled = false;
          window.addEventListener("taklifnoma:session-changed", () => {
            (window as any).sessionSettled = true;
          });
        });
        const page = await context.newPage();
        page.on("pageerror", (error) => errors.push(error.message));
        for (const path of ["/", "/dashboard", "/templates", "/services"]) {
          await page.goto(origin + path);
          if (path === "/" || path === "/dashboard")
            await page.waitForFunction(
              () => (window as any).sessionSettled === true,
            );
          assert.equal(new URL(page.url()).pathname, path);
          assert.equal(
            await page
              .getByText("Hisobingizni tasdiqlang", { exact: true })
              .count(),
            0,
          );
          assert.equal(
            (await page.locator('a[href="/admin"]:visible').count()) > 0,
            fixture?.admin ?? false,
          );
          if (!fixture?.admin) {
            for (const width of [1440, 390, 320]) {
              await page.setViewportSize({ width, height: 900 });
              // These controls must be absent from the DOM, including hidden
              // desktop/mobile menus, rather than merely hidden with CSS.
              assert.equal(await page.locator('a[href^="/admin"]').count(), 0);
              assert.equal(
                await page
                  .getByRole("button", {
                    name: /Admin|Boshqaruv|Telegram orqali tasdiqlash/,
                  })
                  .count(),
                0,
              );
              assert.equal(
                await page
                  .getByText(/Tasdiq (7 kun|12 soat) amal qiladi/)
                  .count(),
                0,
              );
            }
            continue;
          }
          for (const width of [1440, 1024, 901, 390, 320]) {
            await page.setViewportSize({ width, height: 900 });
            const adminLink = page
              .getByRole("link", { name: "Admin", exact: true })
              .filter({ visible: true });
            assert.equal(await adminLink.count(), 1);
            const box = await adminLink.boundingBox();
            assert.ok(box && box.x >= 0 && box.x + box.width <= width);
            if (width > 900) {
              const boxes = await page
                .getByRole("navigation", { name: "Asosiy menyu", exact: true })
                .locator("..")
                .locator("a, button")
                .evaluateAll((nodes) =>
                  nodes
                    .filter(
                      (node) => (node as HTMLElement).offsetParent !== null,
                    )
                    .map((node) => {
                      const box = node.getBoundingClientRect();
                      return {
                        label: node.textContent,
                        x: box.x,
                        right: box.right,
                      };
                    }),
                );
              for (let i = 0; i < boxes.length; i++)
                for (let j = i + 1; j < boxes.length; j++)
                  assert.ok(
                    boxes[i].right <= boxes[j].x + 1 ||
                      boxes[j].right <= boxes[i].x + 1,
                    `Header overlap at ${width}: ${boxes[i].label} / ${boxes[j].label}`,
                  );
            }
            if (
              path === "/services" &&
              fixture.age === "1 day" &&
              [1440, 390].includes(width)
            )
              await page.screenshot({
                path: `test-results/admin-navigation/header-${width}.png`,
              });
          }
        }
        if (fixture?.admin) {
          await page
            .getByRole("link", { name: "Admin", exact: true })
            .filter({ visible: true })
            .click();
          await page.waitForURL(
            origin + (fixture.age === "8 days" ? "/admin/verify" : "/admin"),
          );
          assert.equal(
            await page.locator('script[src*="telegram.org"]').count(),
            0,
          );
          if (fixture.age === "8 days") {
            await page
              .getByText("Tasdiq 7 kun amal qiladi.", { exact: false })
              .waitFor();
            await page
              .getByRole("link", { name: "Hisobga qaytish", exact: true })
              .click();
          } else {
            await page
              .getByRole("link", { name: "Shaxsiy hisob", exact: true })
              .click();
          }
          await page.waitForURL(origin + "/dashboard");
          await page
            .getByRole("heading", { name: "Taklifnomalarim", exact: true })
            .waitFor();
          assert.equal(new URL(page.url()).pathname, "/dashboard");
        } else {
          // Knowing the URL must not reveal the workspace or confirmation UI.
          for (const path of ["/admin", "/admin/verify"]) {
            const response = await page.goto(origin + path);
            assert.equal(response?.status(), 404);
            assert.equal(await page.locator('a[href^="/admin"]').count(), 0);
            assert.equal(
              await page
                .getByText("Hisobingizni tasdiqlang", { exact: true })
                .count(),
              0,
            );
            assert.equal(
              await page
                .getByRole("button", { name: "Telegram orqali tasdiqlash" })
                .count(),
              0,
            );
          }
          const response = await context.request.get(
            origin + "/api/admin/reauth",
          );
          assert.equal(response.status(), fixture ? 403 : 401);
          assert.equal(
            (await response.json()).error.code,
            fixture ? "FORBIDDEN" : "LOGIN_REQUIRED",
          );
        }
        await context.close();
      }
      assert.deepEqual(errors, []);
    } finally {
      await browser.close();
      const ids = fixtures.map((fixture) => fixture.id);
      await db`DELETE FROM sessions WHERE user_id=ANY(${db.array(ids)}::uuid[])`;
      await db`DELETE FROM users WHERE id=ANY(${db.array(ids)}::uuid[])`;
      await closeDb();
    }
  },
);
