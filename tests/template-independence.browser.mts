import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { publicTemplateId } from "../packages/contracts/src/index.ts";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } = require("playwright");
const origin = process.env.TEMPLATE_AUDIT_ORIGIN || "http://127.0.0.1:3011";
const output = "docs/templates/independence-verification";
const providers = /chorlove|invitate|taklifla\.|taklifnomachi\.|wedivo|marxaba|tolipov|e-invitation|wow-card|cloudflareinsights|tildacdn/;
const browser = await chromium.launch({ headless: true });
const results: object[] = [];
const failures: object[] = [];
try {
  const response = await fetch(`${origin}/api/catalog`);
  assert.equal(response.status, 200);
  const catalog = await response.json();
  const templates: Array<{ id: string; name: string }> = catalog.templates;
  assert.ok(templates.length >= 90);
  for (const template of templates) assert.doesNotMatch(template.name, providers);

  for (const source of [
    "/templates/velora/source/velora.html",
    "/templates/safir/source/safir.html",
    "/templates/lace/source/preview-frame.html",
    "/templates/manor-edition/source/reference/manor-edition.html",
    "/templates/taklifnomachi-1/source/index.html",
    "/templates/invitate-wedding/assets/captured/5b73decb38ff5c8c.js",
    "/templates/taklifnomachi-1/source/templates/1/js/QJtgeIS73Tgv.js",
  ]) assert.equal((await fetch(origin + source)).status, 404, source);
  assert.equal((await fetch(`${origin}/templates/anor/source/index.html`)).status, 200);

  const oldLink = await fetch(`${origin}/preview?template=taklifla-tovus&qaSilent=1`, { redirect: "manual" });
  assert.equal(oldLink.status, 307);
  assert.equal(oldLink.headers.get("location"), "/preview?template=tovus&qaSilent=1");

  let cursor = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cursor < templates.length) {
      const template = templates[cursor++];
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
      const external = new Set<string>();
      await context.route("**/*", (route: any) => {
        const url = route.request().url();
        if (!url.startsWith(origin) && /^https?:/.test(url)) {
          external.add(url);
          return route.abort();
        }
        return route.continue();
      });
      try {
        const page = await context.newPage();
        await page.goto(`${origin}/preview?template=${publicTemplateId(template.id)}&qaSilent=1&qaReducedMotion=1`, { waitUntil: "load", timeout: 90000 });
        await page.waitForSelector("iframe[src^='/templates/']", { timeout: 45000 });
        const handle = await page.$("iframe[src^='/templates/']");
        const frame = await handle.contentFrame();
        await frame.waitForLoadState("load");
        await page.waitForTimeout(400);
        await frame.evaluate(() => {
          document.querySelector<HTMLElement>("#openInvite, #sk-open, #qg-open, #splash-open, #os-open, #oy-open, #mw-open, #fs-open, #mp-open, #tv-open, #open-invitation, #open-prompt, #open-btn, #openBtn, #openEnvelope, #si-opener, [data-open], [data-gg-source-opening]")?.click();
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);
        const inspection = await frame.evaluate(() => ({
          text: document.body.innerText,
          title: document.title,
          links: [...document.querySelectorAll<HTMLAnchorElement>("a[href]")]
            .filter((a) => a.getClientRects().length && getComputedStyle(a).visibility !== "hidden")
            .map((a) => a.href),
          sampleMaps: [...document.querySelectorAll<HTMLIFrameElement>("iframe[src]")]
            .map((f) => f.src).filter((src) => src.includes("771288885")),
        }));
        const badLinks = inspection.links.filter((url: string) => new URL(url).origin !== origin && providers.test(url));
        const badExternal = [...external].filter((url) => url !== "https://telegram.org/js/telegram-web-app.js" && !/^https:\/\/(?:api-maps\.yandex\.ru|yandex\.(?:uz|ru|com))\//.test(url));
        const credits = inspection.text.match(/powered by|made with (?:Visol|Marxaba)|(?:Marxaba|Visol) (?:bilan|билан)|Marxaba|chorlove\.uz/gi) || [];
        const result = { id: template.id, slug: publicTemplateId(template.id), badLinks, badExternal, credits, sampleMaps: inspection.sampleMaps };
        results.push(result);
        if (badLinks.length || badExternal.length || credits.length || inspection.sampleMaps.length) failures.push(result);
      } catch (error) {
        failures.push({ id: template.id, error: String(error) });
      } finally {
        await context.close();
      }
    }
  }));
  await mkdir(output, { recursive: true });
  await writeFile(`${output}/browser-report.json`, JSON.stringify({ checked: results.length, expected: templates.length, failures, results }, null, 2) + "\n");
  console.log(JSON.stringify({ checked: results.length, expected: templates.length, failures }));
  assert.equal(failures.length, 0, "See browser-report.json");
} finally {
  await browser.close();
}
