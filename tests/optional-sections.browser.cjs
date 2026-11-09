const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
process.env.TSX_TSCONFIG_PATH = resolve("apps/web/tsconfig.json");
require("tsx/cjs");
require.extensions[".css"] = module => { module.exports = {}; };
const { chromium } = createRequire(resolve("apps/web/package.json"))("playwright");
const { createInvitation, addLanguage } = require("../packages/contracts/src/index.ts");
const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer.tsx");

const origin = process.env.STUDIO_AUDIT_ORIGIN || "http://127.0.0.1:3001";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
const frameSource = readFileSync("apps/web/src/templates/template-frame.tsx", "utf8");
const visibilityCss = frameSource.match(/visibilityStyle\.textContent = '([^']+)'/)?.[1];
assert.ok(visibilityCss, "Use the real shared iframe visibility rule");
const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"];
const cases = [
  { id: "anor", src: "/templates/anor/source/index.html", type: "taklifnoma:initialize", selector: '[data-section="gallery"]', feature: "gallery" },
  { id: "oq-yasmin", type: "oq-yasmin:update", selector: '[data-chorlove-template="oq-yasmin"] section:nth-of-type(2)', feature: "gallery" },
  { id: "oq-yasmin", type: "oq-yasmin:update", selector: "#wishes-section", feature: "wishes" },
  { id: "oq-yasmin", type: "oq-yasmin:update", selector: "#attendance", feature: "rsvp" },
  { id: "marvarid", selector: "#rsvp", feature: "rsvp" },
  { id: "oq-chechak", selector: '[data-chorlove-template="oq-chechak"] section:nth-of-type(12)', feature: "rsvp" },
  { id: "gul-ifori", selector: "#attendance", feature: "rsvp" },
  { id: "zar-jilosi", selector: '[data-chorlove-template="zar-jilosi"] section:nth-of-type(10)', feature: "dress" },
  { id: "yashil-makon", selector: '[data-chorlove-template="yashil-makon"] section:nth-of-type(6)', feature: "program" },
  { id: "velora", selector: "#plan", feature: "program", flat: true },
  { id: "aurelia", selector: ".rsvp", feature: "rsvp", flat: true },
  { id: "baxt-kaliti", selector: ".rsvp", feature: "rsvp", flat: true },
  { id: "zaytun", selector: ".section-closing", feature: "hosts", flat: true },
  { id: "islomiy", selector: ".section-family", feature: "hosts", flat: true },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  let assertions = 0;
  try {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await context.route("**/*", route => {
      const url = new URL(route.request().url());
      if (url.pathname === "/__qa-optional-sections") return route.fulfill({ contentType: "text/html", body: "<!doctype html><main></main>" });
      if (/\/api\/public\/invitations\//.test(url.pathname)) return route.fulfill({ json: { wishes: [] } });
      return url.origin === origin || url.protocol === "data:" ? route.continue() : route.abort();
    });
    for (const c of cases) for (const preview of [true, false]) {
      const page = await context.newPage();
      await page.goto(`${origin}/__qa-optional-sections`);
      await page.evaluate(src => {
        const frame = document.createElement("iframe"); frame.src = src; document.querySelector("main").append(frame);
      }, origin + (c.src || `/templates/${c.id}/index.html`));
      const frame = page.frames().find(f => f !== page.mainFrame());
      await frame.waitForURL(origin + (c.src || `/templates/${c.id}/index.html`));
      await frame.waitForLoadState("load");
      await frame.addStyleTag({ content: visibilityCss });
      await frame.locator(c.selector).waitFor({ state: "attached" });
      for (const locale of locales) {
        let invitation = createInvitation(c.id);
        for (const language of locales) if (!invitation.enabledLocales.includes(language)) invitation = addLanguage(invitation, language);
        invitation.startsAt = "2027-06-14T18:00";
        invitation.content[locale].people = ["Regression One", "Regression Two"];
        const data = makeLegacyData(invitation, locale, "");
        data.wishesEnabled = false; data.rsvp.enabled = false;
        const message = { type: c.type || `${c.id}:update`, payload: { data, templateId: c.id, locale, enabledLocales: locales, invitationId: "empty-section-regression", preview, reducedMotion: true } };
        const send = async enabled => {
          data.gallery = enabled ? [{ id: "photo", src: "/templates/anor/source/art/stage.webp", alt: "Authored photo", caption: "" }] : [];
          data.wishesEnabled = enabled;
          data.rsvp.enabled = enabled;
          data.hosts = enabled ? "Authored family" : "";
          data.program = enabled ? [{ id: "program", time: "18:00", title: "Authored program" }] : [];
          data.dressCode = { enabled, style: enabled ? "Authored dress code" : "", text: "", note: "", colors: [] };
          const update = c.flat ? { ...message, payload: { ...data, music: "", locale, languages: locales, preview } } : message;
          await page.evaluate(message => document.querySelector("iframe").contentWindow.postMessage(message, location.origin), update);
          await frame.waitForFunction(({ selector, enabled }) => {
            const section = document.querySelector(selector);
            return section && (getComputedStyle(section).display !== "none") === enabled;
          }, { selector: c.selector, enabled }, { timeout: 10000 }).catch(async error => {
            console.error(c.id, c.feature, locale, preview, enabled, await frame.locator("section").evaluateAll(nodes => nodes.map(n => ({ id: n.id, hidden: n.hidden, display: getComputedStyle(n).display, heading: n.querySelector("h2")?.textContent }))));
            throw error;
          });
          assertions++;
        };
        // Restore after removal too: emptying the grid must not lose its source
        // card prototype or make the section permanently disappear in Studio.
        await send(true); await send(false); await send(true);
      }
      console.log(`${c.id} ${c.feature}: ${preview ? "Studio" : "public"}, four locales, populated → empty → restored`);
      await page.close();
    }
    console.log(JSON.stringify({ cases: cases.length * 2, locales: locales.length, assertions }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
