import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { TEMPLATES, createInvitation, publicTemplateId } from "../../packages/contracts/src/index.ts";
import { templateCapabilities } from "../../packages/contracts/src/capabilities.ts";

const require = createRequire(new URL("../../apps/web/package.json", import.meta.url));
const { chromium } = require("playwright");
const origin = process.env.STUDIO_AUDIT_ORIGIN || "http://127.0.0.1:3001";
if (!["localhost", "127.0.0.1"].includes(new URL(origin).hostname)) throw new Error("Local audit only");
const out = "docs/qa/2026-11-09-empty-sections";
mkdirSync(out, { recursive: true });
const filter = process.env.STUDIO_AUDIT_TEMPLATES?.split(",");
const designs = TEMPLATES.filter(t => t.format !== "image" && templateCapabilities(t.id).hasRenderer && (!filter || filter.includes(t.id)));
const rows: any[] = [];
const browser = await chromium.launch({ headless: true });
let next = 0;
try {
  await Promise.all(Array.from({ length: 2 }, async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await context.addInitScript(() => {
      (globalThis as any).__name = (fn: unknown) => fn;
      (globalThis as any).__auditMessages = [];
      addEventListener("message", event => {
        if (event.source === parent && event.origin === location.origin && event.data?.payload) {
          (globalThis as any).__auditMessages.push(event.data);
        }
      });
    });
    await context.route("**/*", (route: any) => {
      const url = new URL(route.request().url());
      if (/\/api\/public\/invitations\//.test(url.pathname)) return route.fulfill({ json: { wishes: [], rsvp: null } });
      return url.origin === origin || url.protocol === "data:" ? route.continue() : route.abort();
    });
    while (next < designs.length) {
      const t = designs[next++], i = createInvitation(t.id);
      i.startsAt = "2027-06-14T18:00";
      Object.assign(i.content["uz-Latn"], { people: ["QA_PERSON_ONE", "QA_PERSON_TWO"], message: "QA_INVITATION_MESSAGE", venueName: "QA_VENUE", address: "QA_ADDRESS", hosts: "", greeting: "" });
      i.rsvp.enabled = i.wishes.enabled = false;
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (e: Error) => errors.push(e.message));
      await page.addInitScript((invitation: any) => sessionStorage.setItem(`taklifnoma:full-preview:v1:${invitation.id}`, JSON.stringify(invitation)), i);
      try {
        await page.goto(`${origin}/preview?template=${publicTemplateId(t.id)}&draft=${i.id}&qaSilent=1&qaReducedMotion=1`, { waitUntil: "domcontentloaded", timeout: 120000 });
        await page.waitForFunction(() => Array.from(document.querySelectorAll("main iframe")).some(frame => /QA_PERSON_ONE|QA_INVITATION_MESSAGE/.test((frame as HTMLIFrameElement).contentDocument?.body?.textContent || "")), undefined, { timeout: 30000 });
        await page.waitForTimeout(500);
        const openInvitation = async () => {
          await page.evaluate(() => {
            for (const frame of document.querySelectorAll<HTMLIFrameElement>("iframe")) {
              const doc = frame.contentDocument;
              const opener = doc?.querySelector<HTMLElement>("[data-uchrashuv-open],#openInvite,#sk-open,#qg-open,#splash-open,#os-open,#oy-open,#mw-open,#fs-open,#mp-open,#tv-open,#open-invitation,#open-prompt,#open-btn,#openBtn,#openEnvelope,#si-opener,[data-open],[data-orchid-open],[data-gg-source-opening],[data-landing-screenshot-id='invite-envelope']");
              opener?.click();
            }
          });
          await page.waitForTimeout(1500);
        };
        await openInvitation();
        const inspect = async () => page.evaluate(() => {
          const docs: any[] = [];
          function scan(doc: Document) {
            function hidden(el: Element) {
              for (let node: Element | null = el; node; node = node.parentElement) {
                if (doc.defaultView?.getComputedStyle(node).display === "none") return true;
              }
              return false;
            }
            const containers = [...doc.querySelectorAll("section,[data-section],[data-platform-extra],.photo-sec,.t-rec,[id$='-section'],[id*='gallery'],[id*='galeri'],[id*='story'],[id*='dress'],[id*='contacts']")];
            const sections = containers.filter(el => !el.closest("template,script,style") && !hidden(el)).map(el => ({
              tag: el.tagName, id: el.id, class: el.getAttribute("class"), section: el.getAttribute("data-section") || el.getAttribute("data-platform-extra"),
              decorativeCopy: Boolean(el.querySelector('[data-e-label="common.oliveManor.dressWishes.wishesText"]')),
              headings: [...el.querySelectorAll("h1,h2,h3,[class*='title']")].filter(n => !hidden(n)).map(n => n.textContent?.trim()).filter(Boolean),
              text: [...el.querySelectorAll("*")].filter(n => !hidden(n) && !n.matches("script,style,template") && !n.children.length).map(n => n.textContent).join(" ").replace(/\s+/g, " ").trim().slice(0, 300),
              images: [...el.querySelectorAll("img[src]")].filter(n => !hidden(n)).map(n => n.getAttribute("src")),
              forms: el.querySelectorAll("form").length,
            }));
            const hiddenStyleViolations = [...doc.querySelectorAll('[hidden]:not([hidden="until-found"])')].filter(el => !hidden(el)).map(el => el.id || el.tagName);
            docs.push({ url: new URL(doc.URL).pathname, sections, hiddenStyleViolations });
            for (const frame of doc.querySelectorAll("iframe")) { try { if (frame.contentDocument?.body) scan(frame.contentDocument); } catch {} }
          }
          for (const frame of document.querySelectorAll<HTMLIFrameElement>("main iframe")) { try { if (frame.contentDocument?.body) scan(frame.contentDocument); } catch {} }
          return docs;
        });
        const preview = await inspect();
        const publicFrames = await page.evaluate(() => {
          return [...document.querySelectorAll<HTMLIFrameElement>("main iframe")].map(frame => {
            const doc = frame.contentDocument!;
            const win = doc.defaultView as any;
            const messages = new Map<string, any>();
            for (const message of win.__auditMessages || []) messages.set(message.type, message);
            const change = (value: any) => {
              if (!value || typeof value !== "object") return;
              for (const key of Object.keys(value)) {
                if (["preview", "catalogPreview", "sampleWishes", "catalogMusic"].includes(key)) value[key] = false;
                else change(value[key]);
              }
            };
            let name = win.name || JSON.stringify(messages.get("marxaba:update")?.payload || "");
            try { const value = JSON.parse(name); change(value); name = JSON.stringify(value); } catch {}
            const payloads = [...messages.values()];
            payloads.forEach(change);
            return { url: doc.URL, name, messages: payloads };
          });
        });
        // A fresh host avoids React's preview onLoad callbacks replaying preview
        // data while testing the exact same source renderer in public mode.
        const harness = `${origin}/__qa-empty-sections`;
        await page.route(harness, (route: any) => route.fulfill({ contentType: "text/html", body: '<!doctype html><main></main><script>const inputs=' + JSON.stringify(publicFrames).replaceAll("<", "\\u003c") + ';for(const input of inputs){const f=document.createElement("iframe");f.name=input.name;f.src=input.url;f.width="390";f.height="844";f.onload=()=>{const s=f.contentDocument.createElement("style");s.textContent=\'[hidden]:not([hidden="until-found"]){display:none!important}\';f.contentDocument.head.append(s);for(const message of input.messages)f.contentWindow.postMessage(message,location.origin);};document.querySelector("main").append(f);}</script>' }));
        await page.goto(harness, { waitUntil: "load", timeout: 60000 });
        await page.waitForFunction(() => Array.from(document.querySelectorAll("main iframe")).some(frame => /QA_PERSON_ONE|QA_INVITATION_MESSAGE/.test((frame as HTMLIFrameElement).contentDocument?.body?.textContent || "")), undefined, { timeout: 10000 });
        await openInvitation();
        const publicView = await inspect();
        const optionalHeading = /^(Lahzalar|Kun dasturi|To.y dasturi|Tadbir tartibi|Kiyim uslubi|Kiyinish uslubi|Libos talabi|Bog.lanish uchun|Ma.lumot uchun|Mehmonlar tilaklari|Tilaklar|Tilagingizni qoldiring|Kelasizmi\??|Tasdiqlash|Tashrifingizni\s*tasdiqlang|Mehmon javobi|RSVP|Fotostudiya)$/;
        const issues = Object.entries({ preview, public: publicView }).flatMap(([mode, docs]) => docs.flatMap((doc: any) => [
          ...doc.sections.filter((section: any) => !section.decorativeCopy).flatMap((section: any) => section.headings.filter((heading: string) => optionalHeading.test(heading)).map((heading: string) => `${mode}: empty optional section: ${heading}`)),
          ...doc.hiddenStyleViolations.map((node: string) => `${mode}: hidden element still occupies layout: ${node}`),
        ]));
        rows.push({ id: t.id, preview, public: publicView, issues, errors });
        console.log(JSON.stringify({ id: t.id, sections: preview.flatMap((d: any) => d.sections).length, errors }));
      } catch (error) {
        rows.push({ id: t.id, error: String(error), errors });
        console.log(JSON.stringify({ id: t.id, error: String(error) }));
      } finally { await page.close(); }
      writeFileSync(`${out}/observations${filter ? "-focused" : ""}.json`, JSON.stringify(rows.sort((a,b) => a.id.localeCompare(b.id)), null, 2) + "\n");
    }
    await context.close();
  }));
} finally { await browser.close(); }
console.log(JSON.stringify({ templates: rows.length, errors: rows.filter(row => row.error || row.errors.length).length }));
writeFileSync(`${out}/inventory${filter ? "-focused" : ""}.json`, JSON.stringify(rows.map(row => ({
  id: row.id, error: row.error, knownRuntimeErrors: row.errors,
  checks: Object.fromEntries(["preview", "public"].map(mode => [mode, {
    documents: row[mode]?.map((doc: any) => doc.url),
    visibleContainers: row[mode]?.reduce((count: number, doc: any) => count + doc.sections.length, 0),
    issues: row.issues?.filter((issue: string) => issue.startsWith(`${mode}:`)),
  }])),
})), null, 2) + "\n");
const issues = rows.filter(row => row.error || row.issues?.length);
if (issues.length) { console.error(JSON.stringify(issues.map(({ id, error, issues }) => ({ id, error, issues })))); process.exitCode = 1; }
