import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  TEMPLATES,
  publicTemplateId,
} from "../packages/contracts/src/index.ts";
import renames from "../packages/contracts/src/template-renames.json";

const require = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { chromium } = require("playwright");
const origin = process.env.TEMPLATE_AUDIT_ORIGIN || "http://127.0.0.1:3001";
const renamed = renames.filter(row => TEMPLATES.some(t => t.id === row.id))
  .flatMap(row => row.aliases.map(alias => ({ id: alias, canonicalId: row.id })));

// Check every renamed link, including the canonical redirect from old bookmarks.
for (const template of renamed) {
  const slug = publicTemplateId(template.id);
  const canonical = await fetch(`${origin}/preview?template=${slug}`, {
    redirect: "manual",
  });
  assert.equal(canonical.status, 200, slug);
  assert.equal(canonical.headers.get("location"), null, slug);
  await canonical.body?.cancel();
  const legacy = await fetch(
    `${origin}/preview?template=${template.id}&draft=test-draft&demo=1`,
    { redirect: "manual" },
  );
  assert.equal(legacy.status, 307, template.id);
  assert.equal(
    legacy.headers.get("location"),
    `/preview?template=${slug}&draft=test-draft&demo=1`,
  );
  await legacy.body?.cancel();
}
const invalid = await fetch(`${origin}/preview?template=missing-template`, {
  redirect: "manual",
});
assert.equal(invalid.headers.get("location"), "/templates");
await invalid.body?.cancel();

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const errors: string[] = [];
  page.on("pageerror", (error: Error) => errors.push(error.message));
  for (const id of [
    "taklifla-tort-fasl",
    "taklifla-tovus",
    "invitate-wedding",
    "taklifnomachi-1",
  ]) {
    const slug = publicTemplateId(id);
    await page.goto(`${origin}/preview?template=${id}&qaSilent=1`, {
      waitUntil: "domcontentloaded",
    });
    assert.equal(new URL(page.url()).searchParams.get("template"), slug);
    assert.equal(new URL(page.url()).pathname, "/preview");
    const iframe = page.locator("iframe[src^='/templates/']").first();
    await iframe.waitFor({ state: "visible", timeout: 60000 });
    const frame = await (await iframe.elementHandle())!.contentFrame();
    assert.ok(frame, slug);
    await frame.waitForLoadState("load");
    await frame.waitForFunction(
      () => document.body.innerText.trim().length > 20,
    );
    assert.ok(new URL(frame.url()).pathname.startsWith("/templates/"), slug);
  }
  assert.deepEqual(errors, []);
  console.log(
    `PASS: ${renamed.length} public preview links and historical redirects; four real renderers; unknown-link fallback.`,
  );
} finally {
  await browser.close();
}
