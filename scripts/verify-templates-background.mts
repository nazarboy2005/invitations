import { chromium } from "../apps/web/node_modules/playwright-core/index.mjs";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const origin = "http://127.0.0.1:3001";
const out = fileURLToPath(
  new URL("../docs/design/templates-page/", import.meta.url),
);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1536, height: 960 },
    reducedMotion: "reduce",
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(origin + "/templates");
  const backdrop = page.locator("[data-catalog-background]");
  await backdrop.waitFor({ state: "attached" });
  const source = await backdrop.evaluate(
    (el) => getComputedStyle(el).backgroundImage,
  );
  const imageUrl = source.slice(5, -2);
  assert.equal((await page.request.get(imageUrl)).status(), 200);
  await page.evaluate(async (url) => {
    const image = new Image();
    image.src = url;
    await image.decode();
  }, imageUrl);
  assert.equal(
    await backdrop.evaluate((el) => getComputedStyle(el).position),
    "fixed",
  );
  assert.equal(
    await page.locator("h1").innerText(),
    "Har bir quvonchga\no‘ziga xos dizayn.",
  );
  assert.match(
    await page.getByRole("link", { name: "Fotiha bosh sahifa" }).innerText(),
    /Fotiha/,
  );
  const formats = page.getByRole("group", { name: "Taklifnoma formati" });
  assert.equal(await formats.getByRole("button").count(), 2);
  const webButton = formats.getByRole("button", {
    name: "Veb taklifnoma",
    exact: true,
  });
  const imageButton = formats.getByRole("button", {
    name: "Rasm taklifnoma",
    exact: true,
  });
  const [webBox, imageBox, formatBox] = await Promise.all([
    webButton.boundingBox(),
    imageButton.boundingBox(),
    formats.boundingBox(),
  ]);
  assert.ok(
    Math.abs(
      (webBox!.x + imageBox!.x + imageBox!.width) / 2 -
        (formatBox!.x + formatBox!.width / 2),
    ) < 2,
  );
  const categories = page.getByRole("navigation", {
    name: "Dizayn kategoriyalari",
  });
  assert.ok((await categories.boundingBox())!.y > webBox!.y);
  const cards = page.locator("button[data-card-art]");
  await cards.first().waitFor();
  await page.locator("button[data-card-art] img").evaluateAll(async (imgs) => {
    await Promise.all(
      imgs.slice(0, 4).map((img) => (img as HTMLImageElement).decode()),
    );
  });
  const firstCard = await cards.first().boundingBox();
  assert.ok(Math.abs(firstCard!.width / firstCard!.height - 3 / 5) < 0.002);
  const fixedBefore = await backdrop.boundingBox();
  await page.waitForFunction(() => document.querySelector<HTMLElement>("[data-catalog-filters]")?.dataset.pinned === "false");
  await page.screenshot({ path: out + "desktop.png" });
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: "instant" }));
  await page.waitForFunction(() => window.scrollY >= 650);
  await page.waitForFunction(() => document.querySelector<HTMLElement>("[data-catalog-filters]")?.dataset.pinned === "true");
  assert.deepEqual(await backdrop.boundingBox(), fixedBefore);
  assert.equal(
    await backdrop.evaluate((el) => getComputedStyle(el).backgroundImage),
    source,
  );
  assert.ok((await cards.first().boundingBox())!.y < firstCard!.y - 600);
  await page.screenshot({ path: out + "desktop-scrolled.png" });
  await imageButton.click();
  assert.equal(await categories.isVisible(), false);
  const imageCard = page.locator('button[data-card-art][data-format="image"]');
  await imageCard.first().waitFor();
  const imageCardBox = await imageCard.first().boundingBox();
  assert.ok(
    Math.abs(imageCardBox!.width / imageCardBox!.height - 5 / 7) < 0.002,
  );
  await page.screenshot({ path: out + "image-format.png" });
  await webButton.click();
  assert.equal(await categories.isVisible(), true);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: out + "mobile.png" });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  const mobileFixed = await backdrop.boundingBox();
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
  await page.waitForFunction(() => window.scrollY >= 600);
  assert.deepEqual(await backdrop.boundingBox(), mobileFixed);
  await page.screenshot({ path: out + "mobile-scrolled.png" });
  await page.goto(origin + "/templates?favorites=1");
  await backdrop.waitFor({ state: "attached" });
  assert.equal(
    await backdrop.evaluate((el) => getComputedStyle(el).backgroundImage),
    source,
  );
  await page.goto(origin + "/");
  assert.equal(await backdrop.count(), 0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: one fixed background on catalog/favorites, centered two-option format row, web-only categories, unchanged web/image card proportions, desktop/mobile scrolling without overflow, no landing placement or page errors.",
  );
} finally {
  await browser.close();
}
