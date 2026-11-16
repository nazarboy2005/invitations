import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } = require("playwright");
const origin = process.env.TEST_ORIGIN ?? "http://127.0.0.1:3001";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${origin}/services`, { waitUntil: "networkidle" });
    const cards = page.locator("[data-service-card] h2");
    const first = await cards.allTextContents();
    const nav = page.getByRole("navigation", { name: "Xizmatlar sahifalari" });
    const waitForCards = (names: string[]) => page.waitForFunction(
      (expected: string[]) => JSON.stringify(Array.from(document.querySelectorAll("[data-service-card] h2"), (node) => node.textContent)) === JSON.stringify(expected),
      names,
    );
    await nav.scrollIntoViewIfNeeded();
    const y = await page.evaluate(() => window.scrollY);
    // Once loaded, result pagination must work even with no connection.
    await context.setOffline(true);
    const next = nav.getByRole("link", { name: "Keyingi sahifa" });
    await next.click();
    await page.waitForURL(/page=2/);
    await page.waitForFunction((names: string[]) =>
      document.querySelector("[data-service-card] h2")?.textContent !== names[0], first);
    const second = await cards.allTextContents();
    assert.equal(second.length, 12);
    assert.ok(second.every((name: string) => !first.includes(name)));
    assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - y) < 3);
    await next.click();
    await page.waitForURL(/page=3/);
    await nav.getByRole("link", { name: "Oldingi sahifa" }).click();
    await page.waitForURL(/page=2/);
    await waitForCards(second);
    assert.deepEqual(await cards.allTextContents(), second);
    await page.goBack();
    await page.waitForURL(/page=3/);
    await page.goForward();
    await page.waitForURL(/page=2/);
    await waitForCards(second);
    assert.deepEqual(await cards.allTextContents(), second);
    await nav.getByRole("link", { name: "Oldingi sahifa" }).click();
    await page.waitForFunction(() => !new URL(location.href).searchParams.has("page"));
    await waitForCards(first);
    assert.deepEqual(await cards.allTextContents(), first);
    assert.equal(await nav.getByRole("link", { name: "Oldingi sahifa" }).count(), 0);
    await context.close();
  }
  console.log("PASS desktop/mobile offline pagination, unique results, scroll preservation and Back/Forward");
} finally {
  await browser.close();
}
