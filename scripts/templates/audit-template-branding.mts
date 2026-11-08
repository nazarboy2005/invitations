import assert from "node:assert/strict";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { TEMPLATES, publicTemplateId } from "../../packages/contracts/src/index.ts";

const require = createRequire(new URL("../../apps/web/package.json", import.meta.url));
const { chromium } = require("playwright");
const origin = process.env.TEMPLATE_AUDIT_ORIGIN || "http://127.0.0.1:3011";
const output = process.env.TEMPLATE_AUDIT_OUTPUT || "docs/qa/2026-11-08-template-branding";
const root = "apps/web/public/templates";
const files: string[] = [];
async function walk(directory: string) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!["source", "_next", "assets", "fonts"].includes(entry.name)) await walk(file);
    } else if (["index.html", "template.html", "source-fragment.html"].includes(entry.name)) files.push(file);
  }
}
await walk(root);
files.push(path.join(root, "anor/source/index.html"));
const entries = files.filter(file => file.endsWith("index.html"));
const browser = await chromium.launch({ headless: true });
const sources: object[] = [], packages: object[] = [], failures: object[] = [], visuals: object[] = [];
const localizedDrafts: object[] = [];
const provider = /taklifla|taklifnomachi|invitate|chorlove|wedivo|marxaba|onlinetaklifnoma|e-invitation|wow-card|tolipov/i;

// Examine text, metadata and accessibility labels, not private class/data names or local storage paths.
function inspectDocument() {
  const provider = /taklifla|taklifnomachi|invitate|chorlove|wedivo|marxaba|onlinetaklifnoma|e-invitation|wow-card|tolipov/i;
  const copy = document.documentElement.cloneNode(true) as HTMLElement;
  copy.querySelectorAll("script,style,noscript").forEach(node => node.remove());
  const text = (copy.textContent || "").replace(/\s+/g, " ");
  const mentions = [...text.matchAll(new RegExp(`.{0,40}(?:${provider.source}).{0,60}`, "ig"))].map(m => m[0]);
  const attributes = [...document.querySelectorAll("[alt],[title],[aria-label],meta[content]")].flatMap(el =>
    ["alt", "title", "aria-label", "content"].flatMap(key => {
      const value = el.getAttribute(key);
      return value && !value.startsWith("/templates/") && provider.test(value) ? [{ tag: el.tagName, key, value }] : [];
    }));
  const remoteLinks = [...document.querySelectorAll("[href],[src],[action],[poster]")].flatMap(el =>
    ["href", "src", "action", "poster"].flatMap(key => {
      const value = el.getAttribute(key) || "";
      return /^(?:https?:)?\/\//.test(value) && new URL(value, location.href).origin !== location.origin && provider.test(value) ? [value] : [];
    }));
  const visualCandidates = [...document.querySelectorAll("img,svg,image,link[rel*='icon']")].flatMap(el => {
    const values = ["src", "href", "alt", "title", "aria-label", "id", "class"].map(key => el.getAttribute(key) || "").join(" ");
    return /logo|badge|watermark|powered|brand/i.test(values) ? [el.outerHTML.slice(0, 600)] : [];
  });
  return { title: document.title, mentions, attributes, remoteLinks, visualCandidates };
}

try {
  const parser = await browser.newPage({ javaScriptEnabled: false });
  await parser.route("**/*", (route: any) => route.abort());
  for (const file of files) {
    await parser.setContent(await readFile(file, "utf8"), { waitUntil: "domcontentloaded" });
    const result = await parser.evaluate(inspectDocument);
    sources.push({ file, ...result });
    if (result.mentions.length || result.attributes.length || result.remoteLinks.length) failures.push({ phase: "source", file, ...result });
    if (result.visualCandidates.length) visuals.push({ phase: "source", file, candidates: result.visualCandidates });
  }
  await parser.close();
  let cursor = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cursor < entries.length) {
      const file = entries[cursor++];
      const url = "/templates/" + path.relative(root, file).replaceAll("\\", "/");
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
      const external = new Set<string>();
      await context.route("**/*", (route: any) => {
        const request = route.request().url();
        if (/^https?:/.test(request) && !request.startsWith(origin + "/")) {
          external.add(request);
          return route.abort();
        }
        return route.continue();
      });
      try {
        const page = await context.newPage();
        const response = await page.goto(origin + url, { waitUntil: "load", timeout: 60000 });
        assert.equal(response?.status(), 200, url);
        await page.waitForTimeout(350);
        const result = await page.evaluate(inspectDocument);
        const providerRequests = [...external].filter(url => provider.test(url));
        packages.push({ url, ...result, external: [...external] });
        if (result.mentions.length || result.attributes.length || result.remoteLinks.length || providerRequests.length) failures.push({ phase: "runtime", url, ...result, providerRequests });
        if (result.visualCandidates.length) visuals.push({ phase: "runtime", url, candidates: result.visualCandidates });
      } catch (error) {
        failures.push({ phase: "runtime", url, error: String(error) });
      } finally { await context.close(); }
    }
  }));
  const catalog = TEMPLATES.map(t => ({ id: t.id, name: t.name, slug: publicTemplateId(t.id), fallbackPublished: t.published }));
  for (const id of ["atlas", "shirin-bayram", "chavandoz"]) {
    for (const lang of ["uz", "uz-Cyrl", "en", "ru"]) {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      await context.route("**/*", (route: any) => route.request().url().startsWith(origin + "/") ? route.continue() : route.abort());
      await context.addInitScript(({ id, lang }: { id: string; lang: string }) => {
        window.name = JSON.stringify({ slug: id, status: "draft", defaultLang: lang, languages: ["uz", "uz-Cyrl", "en", "ru"], groom: "Javohir", bride: "Madina", dateTime: "2027-06-12T17:00:00+05:00", rsvp: { enabled: false }, music: "" });
      }, { id, lang });
      try {
        const page = await context.newPage();
        await page.goto(`${origin}/templates/${id}/index.html?lang=${lang}&qaReducedMotion=1`, { waitUntil: "load" });
        await page.waitForSelector(".marhamat-draft-watermark", { state: "attached" });
        const result = await page.evaluate(inspectDocument);
        localizedDrafts.push({ id, lang, ...result });
        if (result.mentions.length || result.attributes.length || result.remoteLinks.length) failures.push({ phase: "localized-draft", id, lang, ...result });
      } catch (error) { failures.push({ phase: "localized-draft", id, lang, error: String(error) }); }
      finally { await context.close(); }
    }
  }
  for (const t of catalog) {
    if (provider.test(t.name) || provider.test(t.slug) || /\bedition\b/i.test(t.name) || /(?:^|-)edition(?:-|$)/i.test(t.slug)) failures.push({ phase: "identity", ...t });
  }
  await mkdir(output, { recursive: true });
  await writeFile(`${output}/branding-report.json`, JSON.stringify({ checkedSources: sources.length, checkedPackages: packages.length, expectedPackages: entries.length, catalog, failures, visuals, sources, packages, localizedDrafts }, null, 2) + "\n");
  console.log(JSON.stringify({ checkedSources: sources.length, checkedPackages: packages.length, expectedPackages: entries.length, localizedDrafts: localizedDrafts.length, failures, visualCandidates: visuals.length }, null, 2));
  assert.equal(failures.length, 0, "See branding-report.json");
} finally { await browser.close(); }
