import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } = require("playwright");
const origin = "http://127.0.0.1:3001";
const output = path.resolve("../output/favorites");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  await page.goto(origin + "/templates", { waitUntil: "domcontentloaded" });
  const card = page.locator('article[data-template-id="anor"]');
  const heart = card.getByRole("button", { name: /saralangan/ });
  await heart.waitFor();
  await page.waitForFunction(() => !document.querySelector('article[data-template-id="anor"] button')?.hasAttribute("disabled"));
  await heart.hover();
  await page.waitForTimeout(600);
  assert.equal(await card.locator("iframe").count(), 0, "Heart hover must not start a preview");
  const unsaved = await heart.evaluate((button: HTMLElement) => {
    const style = getComputedStyle(button);
    return { color: style.color, background: style.backgroundColor, border: style.borderWidth, cursor: style.cursor };
  });
  assert.deepEqual(unsaved, { color: "rgb(255, 0, 0)", background: "rgba(0, 0, 0, 0)", border: "0px", cursor: "pointer" });
  await heart.click();
  assert.equal(await heart.locator("svg").getAttribute("fill"), "currentColor");
  await heart.focus();
  assert.equal(await card.locator("iframe").count(), 0, "Heart focus must not start a preview");
  const art = card.locator("[data-card-art]");
  let previewRequests = 0;
  page.on("request", (request: any) => { if (request.url().includes("/preview?") && request.url().includes("card=1")) previewRequests++; });
  await art.hover({ position: { x: 30, y: 100 } });
  await card.locator("iframe").waitFor({ state: "attached" });
  const samples = await page.evaluate(async () => {
    const button = document.querySelector('article[data-template-id="anor"] [data-card-art]')!;
    const rect = button.getBoundingClientRect();
    const result = [];
    for (let index = 0; index < 80; index++) {
      const target = document.elementFromPoint(rect.x + 30, rect.y + 100)!;
      result.push({ same: target === button, cursor: getComputedStyle(target).cursor });
      await new Promise(requestAnimationFrame);
    }
    return result;
  });
  assert.ok(samples.every((sample: any) => sample.same && sample.cursor === "pointer"), "Preview must never replace the button as the pointer target");
  assert.equal(previewRequests, 1, "A stationary hover must not repeatedly mount the preview");
  await heart.hover();
  await page.waitForFunction(() => !document.querySelector('article[data-template-id="anor"] iframe'));
  console.log("PASS red transparent hearts, saved fill, no heart preview, stable card cursor and one preview mount");

  await page.mouse.move(0, 0);
  await page.evaluate(() => window.scrollTo(0, 0));
  for (const width of [1440, 1024, 901]) {
    await page.setViewportSize({ width, height: 1000 });
    const layout = await page.locator("header").first().evaluate((header: HTMLElement) => {
      const nav = header.querySelector('nav[aria-label="Asosiy menyu"]')!;
      const account = header.querySelector('a[href="/dashboard"]')!;
      const favorite = header.querySelector('a[href="/templates?favorites=1"]')!;
      return { grouped: favorite.parentElement === account.parentElement, outside: !nav.contains(favorite), navRight: nav.getBoundingClientRect().right, favoritesLeft: favorite.getBoundingClientRect().left, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    assert.ok(layout.grouped && layout.outside && !layout.overflow && layout.navRight <= layout.favoritesLeft, JSON.stringify({ width, layout }));
    await page.screenshot({ path: path.join(output, `header-red-hearts-${width}.png`) });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Menyuni ochish" }).click();
  await page.getByRole("navigation", { name: "Mobil menyu" }).getByRole("link", { name: /Saralanganlar/ }).waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  console.log("PASS favorites beside account at desktop/laptop widths and accessible in mobile menu");
} finally { await browser.close(); }
