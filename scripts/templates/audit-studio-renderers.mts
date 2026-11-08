import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { TEMPLATES, createInvitation, publicTemplateId } from "../../packages/contracts/src/index.ts";
import { templateCapabilities } from "../../packages/contracts/src/capabilities.ts";

const require = createRequire(new URL("../../apps/web/package.json", import.meta.url));
const { chromium } = require("playwright");
const origin = process.env.STUDIO_AUDIT_ORIGIN || "http://127.0.0.1:3001";
if (!["localhost", "127.0.0.1"].includes(new URL(origin).hostname)) throw new Error("Local audit only");
const out = "docs/qa/2026-11-08-studio-inputs";
mkdirSync(out, { recursive: true });
const tokens = {
  hosts: "QA_HOSTS", greeting: "QA_GREETING", eventLabel: "QA_EVENT_LABEL",
  message: "QA_MESSAGE", venueName: "QA_VENUE", address: "QA_ADDRESS", landmark: "QA_LANDMARK",
  programHeading: "QA_PROGRAM_HEADING", programTitle: "QA_PROGRAM_TITLE", programDescriptions: "QA_PROGRAM_DESCRIPTION",
  story: "QA_STORY_TEXT", dressStyle: "QA_DRESS_STYLE", dressText: "QA_DRESS_TEXT", dressNote: "QA_DRESS_NOTE",
  dressColorNames: "QA_COLOR_NAME", phone: "+998901234567", telegram: "qa_telegram", gift: "QA_CARD_HOLDER",
};
const rows: any[] = [];
const browser = await chromium.launch({ headless: true });
let next = 0;
const filter = process.env.STUDIO_AUDIT_TEMPLATES?.split(",");
const designs = TEMPLATES.filter(t => t.format !== "image" && !["girlsparty", "estelle", "bloom", "whiteless"].includes(t.id) && (!filter || filter.includes(t.id)));
try {
  await Promise.all(Array.from({ length: 2 }, async () => {
    const context = await browser.newContext({ viewport: { width: 1200, height: 1000 }, reducedMotion: "reduce" });
    await context.addInitScript("globalThis.__name = (fn) => fn;");
    await context.route("**/api/media/QA_PHOTO_*", (route: any) => route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") }));
    await context.route("**/*", (route: any) => {
      const url = new URL(route.request().url());
      return url.origin === origin || url.protocol === "data:" ? route.continue() : route.abort();
    });
    while (next < designs.length) {
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      const t = designs[next++], c = templateCapabilities(t.id), i = createInvitation(t.id);
      i.startsAt = "2027-06-14T18:01";
      Object.assign(i.content["uz-Latn"], { ...Object.fromEntries(Object.entries(tokens).filter(([key]) => key in i.content["uz-Latn"])), people: ["QA_PERSON_ONE", "QA_PERSON_TWO", "QA_PERSON_THREE"], title: "QA_TITLE", programTitles: { p: tokens.programTitle }, programDescriptions: { p: tokens.programDescriptions } });
      i.program = [{ id: "p", time: "18:01" }];
      i.story = [{ id: "s", title: { "uz-Latn": "QA_STORY_TITLE" }, text: { "uz-Latn": tokens.story } }];
      i.dressCode = { enabled: true, style: { "uz-Latn": tokens.dressStyle }, text: { "uz-Latn": tokens.dressText }, note: { "uz-Latn": tokens.dressNote }, colors: [{ id: "c", name: { "uz-Latn": tokens.dressColorNames }, hex: "#123abc" }] };
      i.gallery = Array.from({ length: 8 }, (_, n) => ({ id: `g${n}`, url: `/api/media/QA_PHOTO_${n + 1}`, alt: `QA_PHOTO_ALT_${n + 1}`, caption: `QA_PHOTO_CAPTION_${n + 1}` }));
      i.contacts = { phoneNumber: tokens.phone, telegramUsername: tokens.telegram, instagramUrl: "" };
      i.venue = { latitude: 41.31, longitude: 69.28, mapUrl: "https://yandex.uz/maps/?ll=69.28,41.31" };
      i.gift = { enabled: true, receiptUploadEnabled: false, cardNumber: "8600123412341234", cardHolder: tokens.gift };
      i.rsvp = { enabled: true, deadline: "2027-06-01", maxPartySize: 1 };
      i.wishes.enabled = true;
      i.music.enabled = false;
      const errors: string[] = [];
      const onError = (error: Error) => errors.push(error.message);
      page.on("pageerror", onError);
      await page.addInitScript((invitation: any) => { try { sessionStorage.setItem(`taklifnoma:full-preview:v1:${invitation.id}`, JSON.stringify(invitation)); } catch {} }, i);
      try {
        await page.goto(`${origin}/preview?template=${publicTemplateId(t.id)}&draft=${i.id}&qaSilent=1&qaReducedMotion=1`, { waitUntil: "domcontentloaded", timeout: 120000 });
        await page.waitForFunction(() => Array.from(document.querySelectorAll("iframe")).some(frame => frame.contentDocument?.readyState === "complete" && frame.contentDocument?.body?.textContent?.includes("QA_PERSON_ONE")), undefined, { timeout: 25000 }).catch(() => {});
        await page.waitForTimeout(700);
        if (filter) await page.waitForTimeout(2500);
        // Reveal source-owned card details, without submitting forms or navigating.
        await page.evaluate(() => {
          for (const frame of document.querySelectorAll("main iframe")) {
            const doc = frame.contentDocument;
            if (!doc) continue;
            const root = doc.querySelector("[data-chorlove-template]");
            if (root?.getAttribute("data-chorlove-template") === "modern-floral") root.querySelectorAll("section")[8]?.querySelector<HTMLButtonElement>("button")?.click();
            if (root?.getAttribute("data-chorlove-template") === "green-gold") root.querySelectorAll("section")[8]?.querySelector<HTMLButtonElement>("button")?.click();
            doc.querySelector<HTMLButtonElement>('[data-chorlove-gift] button')?.click();
            if (doc.querySelector("[data-chorlove-template='palace-rose']")) root?.querySelectorAll("section")[8]?.querySelector<HTMLButtonElement>("button")?.click();
          }
        });
        const observed = await page.evaluate((tokens: Record<string, string>) => {
          let text = "", attributes = "", photos = new Set<string>();
          const extras: unknown[] = [];
          const scan = (doc: Document) => {
            const walk = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
            while (walk.nextNode()) if (!walk.currentNode.parentElement?.closest("script,style,template")) text += walk.currentNode.textContent + "\n";
            for (const el of doc.querySelectorAll("img,a,[style],[aria-label],[title]")) {
              attributes += [el.getAttribute("href"), el.getAttribute("alt"), el.getAttribute("title"), el.getAttribute("style"), el.getAttribute("aria-label")].join(" ") + "\n";
              for (const m of (el.outerHTML || "").matchAll(/QA_PHOTO_\d+/g)) photos.add(m[0]);
            }
            for (const frame of doc.querySelectorAll("iframe")) { try { if (frame.contentDocument?.body) scan(frame.contentDocument); } catch {} }
            extras.push({ url: doc.URL, script: !!doc.querySelector("script[data-editor-sections]"), payload: !!(doc.defaultView as any)?.__taklifnomaExtras, story: (doc.defaultView as any)?.__taklifnomaExtras?.data?.story, sections: [...doc.querySelectorAll("[data-platform-extra]")].map(e => e.getAttribute("data-platform-extra")), nativeStory: !!doc.querySelector('[data-section="story"]') });
          };
          // Only template documents, not the preview toolbar or serialized state.
          for (const frame of document.querySelectorAll("main iframe")) { try { if (frame.contentDocument?.body) scan(frame.contentDocument); } catch {} }
          return { fields: Object.fromEntries(Object.entries(tokens).map(([key, token]) => [key, text.includes(token) || attributes.includes(token)])), colors: /18,\s*58,\s*188|#123abc/i.test(attributes), photos: [...photos].sort(), extras };
        }, tokens);
        const expected: Record<string, boolean> = { ...c.inputs, message: true, venueName: true, address: true, landmark: true, programTitle: c.program, programDescriptions: c.program && c.inputs.programDescriptions, programHeading: c.program && c.inputs.programHeading, story: c.story > 0, dressStyle: c.dressCode && c.inputs.dressStyle, dressText: c.dressCode && c.inputs.dressText, dressNote: c.dressCode && c.inputs.dressNote, dressColorNames: c.dressCode && c.inputs.dressColorNames, phone: c.phone && c.contactLimit > 1, telegram: c.telegram, gift: c.gift };
        const missing = Object.entries(expected).filter(([key, enabled]) => enabled && key in tokens && !observed.fields[key]).map(([key]) => key);
        const unexpected = Object.entries(expected).filter(([key, enabled]) => !enabled && key in tokens && observed.fields[key] && !(key === "phone" && c.contactLimit === 1)).map(([key]) => key);
        rows.push({ id: t.id, ...observed, missing, unexpected, errors });
        console.log(JSON.stringify({ id: t.id, missing, unexpected, photos: observed.photos.length, errors }));
      } catch (error) {
        rows.push({ id: t.id, error: String(error) });
        console.log(JSON.stringify({ id: t.id, error: String(error) }));
      } finally {
        page.off("pageerror", onError);
        // A fresh page avoids accumulation of initialization scripts.
      }
      await page.close();
    }
    await context.close();
  }));
} finally { await browser.close(); }
writeFileSync(`${out}/renderer-observations${filter ? "-focused" : ""}.json`, JSON.stringify(rows.sort((a, b) => a.id.localeCompare(b.id)), null, 2) + "\n");
console.log(JSON.stringify({ templates: rows.length, review: rows.filter(r => r.error || r.missing?.length || r.unexpected?.length).length }));
