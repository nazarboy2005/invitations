import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "../apps/web/node_modules/playwright-core/index.mjs";

const origin = "http://127.0.0.1:3001";
const out = fileURLToPath(
  new URL(
    "../docs/templates/ivory-rose-card-verification/editorial/",
    import.meta.url,
  ),
);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (
        response.status() >= 400 &&
        /static-images|ivory-rose-card/.test(response.url())
      )
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(origin + "/templates");
    await page
      .getByRole("button", { name: "Rasm taklifnoma", exact: true })
      .click();
    const card = page.getByRole("button", {
      name: "Oq atirgul: batafsil ko‘rish",
      exact: true,
    });
    await card.scrollIntoViewIfNeeded();
    assert.equal(
      await card
        .locator("img")
        .first()
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      true,
    );
    await page.screenshot({ path: out + `catalog-${viewport.width}.png` });
    await card.click();
    const preview = page
      .getByRole("dialog")
      .locator('img[src*="ivory-rose-card"]');
    await preview.waitFor();
    await preview.evaluate((image: HTMLImageElement) => image.decode());
    assert.equal(
      await preview.evaluate(
        (image: HTMLImageElement) => image.naturalWidth / image.naturalHeight,
      ),
      5 / 7,
    );
    await page.screenshot({ path: out + `detail-${viewport.width}.png` });
    await page.getByRole("link", { name: "To‘liq ko‘rish" }).click();
    const full = page.getByAltText("Rasm taklifnoma ko‘rinishi");
    await full.waitFor();
    await full.evaluate((image: HTMLImageElement) => image.decode());
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.screenshot({
      path: out + `preview-${viewport.width}.png`,
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS: ${viewport.width}px catalog, protected detail/full preview, 5:7 artwork, no page/image errors or horizontal overflow.`,
    );
  }
} finally {
  await browser.close();
}
