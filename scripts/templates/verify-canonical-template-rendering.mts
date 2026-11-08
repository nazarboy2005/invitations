import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { TEMPLATES } from "../../packages/contracts/src/index.ts";
import { templateCapabilities } from "../../packages/contracts/src/capabilities.ts";
import renames from "../../packages/contracts/src/template-renames.json";

const require = createRequire(new URL("../../apps/web/package.json", import.meta.url));
const { chromium } = require("playwright");
const origin = process.env.TEMPLATE_AUDIT_ORIGIN || "http://127.0.0.1:3011";
const renamed = new Set(renames.map(row => row.id));
const templates = TEMPLATES.filter(t => renamed.has(t.id) && t.format !== "image" && templateCapabilities(t.id).hasRenderer);
const results: object[] = [], failures: object[] = [];
const browser = await chromium.launch({ headless: true });
let cursor = 0;
try {
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cursor < templates.length) {
      const template = templates[cursor++];
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
      const errors: string[] = [], missing: string[] = [];
      try {
        const page = await context.newPage();
        page.on("pageerror", (error: Error) => errors.push(error.message));
        page.on("response", (response: any) => { if (response.status() === 404 && response.url().includes("/templates/") && !response.url().endsWith("/%23n")) missing.push(response.url()); });
        await page.goto(`${origin}/preview?template=${template.id}&qaSilent=1&qaReducedMotion=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
        const iframe = page.locator("iframe[src*='/templates/']").first();
        await iframe.waitFor({ state: "visible", timeout: 60000 });
        const frame = await (await iframe.elementHandle())!.contentFrame();
        await frame.waitForLoadState("domcontentloaded");
        await frame.waitForFunction(() => document.body.innerText.trim().length > 15, null, { timeout: 15000 });
        const text = await frame.locator("body").innerText();
        assert.doesNotMatch(text, /unknown template|taklifnoma yuklanmadi|this template is not available/i);
        const result = { id: template.id, name: template.name, frame: new URL(frame.url()).pathname, errors, missing };
        results.push(result);
        if (errors.length || missing.length) failures.push(result);
      } catch (error) { failures.push({ id: template.id, error: String(error), errors, missing }); }
      finally { await context.close(); }
    }
  }));
  await mkdir("docs/qa/2026-11-08-template-renaming", { recursive: true });
  await writeFile("docs/qa/2026-11-08-template-renaming/rendering-verification.json", JSON.stringify({ expected: templates.length, checked: results.length, failures, results }, null, 2) + "\n");
  console.log(JSON.stringify({ expected: templates.length, checked: results.length, failures }, null, 2));
  assert.equal(failures.length, 0);
} finally { await browser.close(); }
