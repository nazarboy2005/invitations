import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "../../apps/web/node_modules/playwright-core/index.mjs";
const origin = process.env.APP_URL ?? "http://127.0.0.1:3001";
const ids = ["stained-glass", "sunset", "swan-garden"];
const catalog = await fetch(origin + "/api/catalog").then((r) => r.json());
assert.equal(
  catalog.configured,
  true,
  "Must confirm the configured database, not fallback",
);
for (const id of ids) {
  const t = catalog.templates.find((t: any) => t.id === id);
  assert.ok(t?.published);
  assert.deepEqual(t.supportedEventTypes, ["wedding"]);
}
const browser = await chromium.launch({ headless: true });
const out = fileURLToPath(
  new URL("../../docs/templates/chorlove-three-verification/", import.meta.url),
);
const result: any[] = [];
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await page.goto(origin + "/templates", { waitUntil: "domcontentloaded" });
    const search = page.getByRole("searchbox");
    await search.waitFor();
    for (const id of ids) {
      const template = catalog.templates.find((t: any) => t.id === id);
      await search.fill(template.name);
      const card = page.locator(
        `[data-template-id="${id}"] button[data-card-art]`,
      );
      await card.waitFor();
      const photo = card.locator("img").first();
      await photo.evaluate((i: HTMLImageElement) => i.decode());
      const art = await card.boundingBox();
      const natural = await photo.evaluate(
        (i: HTMLImageElement) => i.naturalWidth / i.naturalHeight,
      );
      assert.ok(
        Math.abs(art!.width / art!.height - natural) < 0.002,
        "Opening art must retain its full portrait ratio",
      );
      await page.screenshot({ path: `${out}${id}-${width}-catalog.png` });
      await card.click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      assert.ok(
        await dialog
          .getByRole("link", { name: "Yaratish", exact: false })
          .isVisible(),
      );
      await page.screenshot({
        path: `${out}${id}-${width}-catalog-detail.png`,
      });
      await dialog.getByRole("button", { name: "Yopish", exact: true }).click();
      result.push({
        id,
        width,
        published: true,
        selectable: true,
        completePortraitArtwork: true,
      });
    }
    await page.close();
  }
  await writeFile(
    `${out}catalog-report.json`,
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(
    "PASS configured database catalog and selectable portrait artwork: 3 templates × 2 viewports",
  );
} finally {
  await browser.close();
}
