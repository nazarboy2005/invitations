import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(new URL("../../apps/web/package.json", import.meta.url));
const { chromium } = require("playwright");
const origin = process.env.TEMPLATE_AUDIT_ORIGIN || "http://127.0.0.1:3011";
const directory = "docs/qa/2026-11-08-template-branding";
const folder = "apps/web/public/templates/umr-bahori";
const route = "/preview?template=yubiley-sahifasi&poster=1&qaSilent=1&qaReducedMotion=1";
const viewport = { width: 480, height: 800 };
const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.goto(origin + route, { waitUntil: "load", timeout: 90000 });
  const iframe = page.locator("iframe[src*='/templates/']").first();
  await iframe.waitFor({ state: "visible", timeout: 60000 });
  const frame = await (await iframe.elementHandle())!.contentFrame();
  await frame.waitForFunction(() => document.body.innerText.includes("Hamkorlar jamoasi"));
  await frame.evaluate(() => document.fonts.ready);
  // Local development chrome is outside the invitation composition.
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  await page.waitForTimeout(500);
  const text = await frame.locator("body").innerText();
  assert.doesNotMatch(text, /marxaba|taklifla|invitate|chorlove|wedivo/i);
  const bounds = await iframe.boundingBox();
  assert.equal(bounds?.width, viewport.width);
  assert.equal(bounds?.height, viewport.height);
  const png = await iframe.screenshot();
  const webp = await sharp(png).webp({ quality: 90, effort: 6 }).toBuffer();
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/yubiley-clean-cover.png`, png);
  await writeFile(`${folder}/preview.webp`, webp);
  await writeFile(`${folder}/preview.provenance.json`, JSON.stringify({
    captured: "2026-11-08",
    route,
    viewport,
    state: "Original first-page composition, real renderer with current shared corporate preview fixture; no provider sample company",
    image: "preview.webp",
    imageSha256: hash(webp),
    captureSha256: hash(png),
    fixture: "apps/web/src/modules/catalog/preview-sample.json",
    fixtureSha256: hash(await readFile("apps/web/src/modules/catalog/preview-sample.json")),
    encoding: "WebP quality 90, effort 6; no image synthesis or editing",
  }, null, 2) + "\n");
  console.log(JSON.stringify({ route, viewport, bytes: webp.length, sha256: hash(webp) }));
} finally { await browser.close(); }
