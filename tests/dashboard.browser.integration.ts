// Synthetic responses only: no account, invitation or payment records are changed.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, mkdir } from "node:fs/promises";
import { completeInvitation } from "./fixtures/publication";

const webRequire = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { chromium } = webRequire("playwright");
const origin = process.env.DASHBOARD_TEST_URL || "http://127.0.0.1:3001";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));

test(
  "dashboard responsive cards, filters, sharing and fixed artwork",
  { timeout: 120000 },
  async () => {
    const browser = await chromium.launch({ headless: true });
    const output = "docs/design/dashboard";
    await mkdir(output, { recursive: true });
    const webCover = await readFile(
      "docs/templates/luxury-uzbek-verification/taklifla-tovus-personalized-cover.webp",
    );
    const imageCover = await readFile(
      "apps/web/public/templates/ivory-rose-card/preview.webp",
    );
    const items = Array.from({ length: 15 }, (_, index) => {
      const invitation = completeInvitation();
      invitation.id = `dashboard-qa-${index}`;
      invitation.templateId = index % 3 === 1 ? "ivory-rose-card" : "anor";
      invitation.status = index % 3 === 0 ? "published" : "draft";
      if (invitation.status === "published")
        invitation.slug = `qa${String(index).padStart(2, "0")}ab`;
      invitation.content["uz-Latn"].people = [`Javohir ${index + 1}`, "Madina"];
      return {
        ...invitation,
        createdAt: `2026-10-${String(30 - index).padStart(2, "0")}T12:00:00Z`,
        viewCount: 128 + index,
      };
    });
    try {
      for (const width of [1280, 1024, 768, 390, 320]) {
        const context = await browser.newContext({
          viewport: { width, height: width > 600 ? 900 : 844 },
          permissions: ["clipboard-read", "clipboard-write"],
        });
        const page = await context.newPage();
        const errors: string[] = [];
        page.on("pageerror", (error: Error) => errors.push(error.message));
        let coverRequests = 0;
        await page.route("**/api/auth/session", (route: any) =>
          route.fulfill({
            json: {
              user: {
                id: "dashboard-qa",
                displayName: "Dashboard QA",
                isAdmin: false,
              },
              configured: true,
            },
          }),
        );
        await page.route("**/api/invitations", (route: any) =>
          route.fulfill({ json: { invitations: items } }),
        );
        await page.route("**/api/favorites**", (route: any) =>
          route.fulfill({ json: { templateIds: [] } }),
        );
        await page.route("**/api/invitation-covers", (route: any) => {
          coverRequests++;
          return route.fulfill({ contentType: "image/webp", body: webCover });
        });
        await page.route("**/api/static-images/preview", (route: any) =>
          route.fulfill({ contentType: "image/webp", body: imageCover }),
        );
        await page.goto(`${origin}/dashboard`);
        await page.locator("article").last().waitFor();
        await page.waitForFunction(() =>
          [...document.querySelectorAll("article:not([hidden]) img")].some(
            (img) => (img as HTMLImageElement).naturalWidth > 0,
          ),
        );
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => {
          const img = document.querySelector(
            "picture[aria-hidden] img",
          ) as HTMLImageElement;
          return img.complete && img.naturalWidth > 0;
        });
        await page.screenshot({
          path: `${output}/dashboard-${width}.png`,
          fullPage: false,
        });
        assert.equal(await page.locator("article:not([hidden])").count(), 15);
        assert.equal(
          await page
            .getByLabel("Taklifnoma holatlari bo‘yicha jami")
            .isVisible(),
          width > 900,
          "desktop summary stays hidden on phones/tablets",
        );
        const filter = page.getByRole("button", {
          name: "Taklifnoma filtrlari",
        });
        await filter.click();
        assert.equal(
          await page
            .getByRole("checkbox", { name: /^Qoralamalar/ })
            .isChecked(),
          true,
        );
        assert.equal(
          await page
            .getByRole("checkbox", { name: /^Nashr qilingan/ })
            .isChecked(),
          true,
        );
        assert.equal(await page.getByRole("radio").count(), 0);
        const filterMenu = page.locator("[popover]:popover-open");
        assert.equal(
          await filterMenu.evaluate(
            (el) => getComputedStyle(el).backdropFilter,
          ),
          "blur(24px) saturate(1.15)",
        );
        assert.notEqual(
          await filterMenu.evaluate(
            (el) => getComputedStyle(el).transitionDuration,
          ),
          "0s",
        );
        const mark = filterMenu.locator('[class*="selectionMark"]').first();
        assert.equal(
          await mark.evaluate((el) => getComputedStyle(el).borderStyle),
          "none",
        );
        assert.equal(
          await page
            .getByRole("checkbox", { name: "Veb taklifnomalar" })
            .isChecked(),
          true,
        );
        assert.equal(
          await page
            .getByRole("checkbox", { name: "Rasm taklifnomalar" })
            .isChecked(),
          true,
        );
        assert.match(
          await page.locator("article:not([hidden]) h2").first().innerText(),
          /Javohir 1/,
        );
        await page
          .getByRole("checkbox", { name: "Veb taklifnomalar" })
          .uncheck();
        assert.equal(await page.locator("article:not([hidden])").count(), 5);
        assert.equal(
          await page
            .locator('article:not([hidden]) [data-format="image"]')
            .count(),
          5,
        );
        await page
          .getByRole("checkbox", { name: "Rasm taklifnomalar" })
          .uncheck();
        await page
          .getByRole("heading", { name: "Mos taklifnoma topilmadi" })
          .waitFor();
        await page.getByRole("checkbox", { name: "Veb taklifnomalar" }).check();
        await page
          .getByRole("checkbox", { name: "Rasm taklifnomalar" })
          .check();
        await page.keyboard.press("Escape");
        const search = page.getByRole("searchbox", {
          name: "Taklifnomalarni qidirish",
        });
        const firstCover = await page
          .locator("article")
          .first()
          .locator("img")
          .getAttribute("src");
        await search.fill("Javohir 2 ");
        assert.equal(await page.locator("article:not([hidden])").count(), 1);
        await search.fill("");
        assert.equal(
          await page
            .locator("article")
            .first()
            .locator("img")
            .getAttribute("src"),
          firstCover,
          "filtering retains mounted cover URLs",
        );
        await filter.click();
        await page.getByRole("checkbox", { name: /^Nashr qilingan/ }).uncheck();
        assert.equal(await page.locator("article:not([hidden])").count(), 10);
        await page.getByRole("checkbox", { name: /^Qoralamalar/ }).uncheck();
        await page.getByRole("checkbox", { name: /^Nashr qilingan/ }).check();
        assert.equal(await page.locator("article:not([hidden])").count(), 5);
        await page.getByRole("checkbox", { name: /^Qoralamalar/ }).check();
        await page.keyboard.press("Escape");
        await page.waitForTimeout(320);
        assert.equal(
          await page.locator("[data-grid-exit]").count(),
          0,
          "exit copies are cleaned up",
        );
        const first = page.locator("article").first();
        await first
          .getByRole("button", { name: "Nusxa olish", exact: true })
          .click();
        await first
          .getByRole("button", { name: "Nusxalandi", exact: true })
          .waitFor();
        assert.equal(
          await first.getByText("Havola nusxalandi.", { exact: true }).count(),
          0,
          "copy feedback does not add a text row",
        );
        assert.equal(
          await page.evaluate(() => navigator.clipboard.readText()),
          `${origin}/i/qa00ab`,
        );
        await first.getByRole("button", { name: /qo‘shimcha amallar/ }).click();
        await page
          .getByRole("link", { name: "Taklifnomani ochish", exact: true })
          .waitFor();
        const menu = page.locator("[popover]:popover-open");
        await page.waitForTimeout(220);
        const menuBounds = await menu.boundingBox();
        if (width <= 600) {
          assert.equal(await menu.getAttribute("data-placement"), "sheet");
          assert.ok(
            menuBounds &&
              menuBounds.y >= 52 &&
              menuBounds.y + menuBounds.height <= 844 - 80,
          );
          assert.ok(
            menuBounds && Math.abs(menuBounds.width - (width - 24)) < 1,
          );
          await page.screenshot({
            path: `${output}/dashboard-${width}-card-menu.png`,
          });
        }
        assert.ok(
          menuBounds &&
            menuBounds.x >= 0 &&
            menuBounds.x + menuBounds.width <= width,
        );
        await menu
          .getByRole("button", { name: "O‘chirish", exact: true })
          .click();
        await page
          .getByRole("button", { name: "Bekor qilish", exact: true })
          .click();
        assert.equal(await page.locator("article").count(), 15);
        const dimensions = await page.locator("article").evaluateAll((cards) =>
          cards.slice(0, 2).map((card) => ({
            height: card.getBoundingClientRect().height,
            art: card
              .querySelector('[class*="cardArt"]')!
              .getBoundingClientRect().height,
          })),
        );
        assert.ok(
          dimensions[0].height > dimensions[1].height + 20,
          "image card keeps its shorter native height",
        );
        assert.ok(
          Math.abs(
            dimensions[0].height -
              dimensions[0].art -
              (dimensions[1].height - dimensions[1].art),
          ) < 35,
          "no stretched image-card body",
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `no horizontal overflow at ${width}px`,
        );
        const background = await page
          .locator("picture[aria-hidden] img")
          .evaluate((img: HTMLImageElement) => ({
            position: getComputedStyle(img.parentElement!).position,
            src: img.currentSrc,
            height: img.getBoundingClientRect().height,
          }));
        assert.equal(background.position, "fixed");
        assert.match(background.src, width <= 600 ? /mobile/ : /desktop/);
        await page.evaluate(() => window.scrollTo(0, 650));
        await page.waitForTimeout(700);
        const toolbar = page.locator("[data-catalog-pin-boundary]");
        const bounds = await toolbar.boundingBox();
        assert.ok(
          bounds && Math.abs(bounds.y - (width <= 900 ? 52 : 0)) < 2,
          "toolbar pins below mobile navbar or to desktop top",
        );
        assert.equal(
          await toolbar.evaluate((el) => getComputedStyle(el).backdropFilter),
          "blur(24px) saturate(1.15)",
        );
        assert.equal(
          await page
            .locator("picture[aria-hidden]")
            .evaluate((el) => el.getBoundingClientRect().y),
          0,
        );
        await filter.click();
        await page
          .getByRole("checkbox", { name: "Rasm taklifnomalar" })
          .waitFor();
        await page.waitForTimeout(220);
        await page.screenshot({
          path: `${output}/dashboard-${width}-scrolled.png`,
        });
        await page.keyboard.press("Escape");
        await page.emulateMedia({ reducedMotion: "reduce" });
        await filter.click();
        assert.equal(
          await page
            .locator("[popover]:popover-open")
            .evaluate((el) => getComputedStyle(el).transitionDuration),
          "0s",
        );
        await page
          .getByRole("checkbox", { name: "Rasm taklifnomalar" })
          .uncheck();
        assert.equal(await page.locator("[data-grid-exit]").count(), 0);
        assert.equal(
          await page
            .locator('[class*="cardGrid"]')
            .evaluate((el) => el.getAnimations({ subtree: true }).length),
          0,
        );
        await page.keyboard.press("Escape");
        assert.deepEqual(errors, []);
        console.log(
          `${width}px: responsive layout, unified multi-select, search, mounted covers, clipboard, menus, deletion cancel and sticky background passed (${coverRequests} cover requests)`,
        );
        await context.close();
      }
    } finally {
      await browser.close();
    }
  },
);
