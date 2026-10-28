const { chromium } = require("../apps/web/node_modules/playwright"),
  fs = require("fs");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const rows = JSON.parse(
      require("node:child_process").execFileSync(
        process.execPath,
        ["--import", "tsx", "tests/shared-template-maps.fixture.ts"],
        { encoding: "utf8" },
      ),
    ),
    results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: 2 }, async () => {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      page.setDefaultTimeout(10000);
      page.setDefaultNavigationTimeout(30000);
      await page.route("https://**/*", (r) => r.abort());
      while (next < rows.length) {
        const { id, url } = rows[next++];
        try {
          await page.goto(
            "http://127.0.0.1:3001/preview?template=" + id + "&qaSilent=1",
            { waitUntil: "domcontentloaded" },
          );
          await page
            .locator("main iframe")
            .first()
            .waitFor({ state: "attached", timeout: 15000 });
          const source = await (
            await page.locator("main iframe").first().elementHandle()
          ).contentFrame();
          await source.waitForURL(/\/templates\//, { timeout: 15000 });
          await source.waitForFunction(
            () => document.readyState !== "loading",
            { timeout: 10000 },
          );
          await source
            .waitForFunction(
              (url) =>
                Array.from(document.querySelectorAll("a[href]")).some(
                  (a) => a.getAttribute("href") === url,
                ),
              url,
              { timeout: 8000 },
            )
            .catch(() => {});
          const targets = [];
          targets.push(
            ...(await source
              .locator("a[href]")
              .evaluateAll((a) => a.map((x) => x.getAttribute("href")))),
          );
          results.push({
            id,
            sharedMap: targets.includes(url),
            maps: targets.filter((x) => /maps|yandex|goo.gl/.test(x)),
          });
        } catch (e) {
          results.push({ id, error: e.message });
        }
        fs.writeFileSync(
          "docs/templates/tort-fasl-verification/maps-audit.json",
          JSON.stringify(results, null, 2),
        );
        console.log(id, results.at(-1).sharedMap ? "OK" : "CHECK");
      }
      await page.close();
    }),
  );
  await browser.close();
  fs.writeFileSync(
    "docs/templates/tort-fasl-verification/maps-audit.json",
    JSON.stringify(results, null, 2),
  );
  console.log(
    JSON.stringify(
      { checked: results.length, missing: results.filter((r) => !r.sharedMap) },
      null,
      2,
    ),
  );
  if (results.some((r) => !r.sharedMap)) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
