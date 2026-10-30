// Run with Linux Node to check the actual serverless Chromium package.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { default: bundled } = await import(
  require.resolve("@sparticuz/chromium")
);
const { chromium } = require("playwright-core");
const browser = await chromium.launch({
  headless: true,
  executablePath: await bundled.executablePath(),
  args: bundled.args.filter((arg) => arg !== "--single-process"),
  timeout: 15000,
});
try {
  for (let index = 0; index < 3; index++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setContent(`<h1>Personalized cover ${index}</h1>`);
    const session = await context.newCDPSession(page);
    const result = await session.send("Page.captureScreenshot", {
      format: "png",
    });
    assert.ok(Buffer.from(result.data, "base64").length > 1000);
    await session.detach();
    await context.close();
  }
  console.log(
    `Linux Chromium ${browser.version()}: 3 isolated contexts and screenshots passed`,
  );
} finally {
  await browser.close();
}
