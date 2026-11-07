import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "../../apps/web/node_modules/playwright-core/index.mjs";

const origin = process.env.APP_URL ?? "http://127.0.0.1:3001";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
const out = fileURLToPath(
  new URL("../../docs/templates/chorlove-three-verification/", import.meta.url),
);
await mkdir(out, { recursive: true });
const ids = ["stained-glass", "sunset", "swan-garden"];
const report: any[] = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 },
  ]) {
    for (const id of ids) {
      const page = await browser.newPage({ viewport });
      const errors: string[] = [],
        missing: string[] = [],
        provider: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (
          r.status() >= 400 &&
          new URL(r.url()).pathname.startsWith("/templates/")
        )
          missing.push(`${r.status()} ${r.url()}`);
      });
      page.on("request", (r) => {
        if (
          /chorlove\.uz|google-analytics|googletagmanager|fonts\.google/.test(
            r.url(),
          )
        )
          provider.push(r.url());
      });
      await page.goto(`${origin}/preview?template=${id}&qaSilent=1`, {
        waitUntil: "domcontentloaded",
      });
      const f = page.frameLocator("iframe").first();
      await f.locator("[aria-busy=false]").waitFor();
      await f.locator("img").evaluateAll(async (imgs) => {
        await Promise.all(
          imgs
            .filter(
              (x) =>
                x.getAttribute("loading") !== "lazy" && x.getAttribute("src"),
            )
            .map((x) => (x as HTMLImageElement).decode()),
        );
      });
      await page.screenshot({
        path: `${out}${id}-${viewport.width}-opening.png`,
      });
      const opening =
        id === "stained-glass"
          ? f.locator("[data-section=hero] button").first()
          : f.locator("[data-opening]");
      const started = Date.now();
      await opening.click();
      const openingVideo =
        id === "stained-glass"
          ? f.locator("[data-section=hero] video")
          : f.locator("[data-opening] video");
      await page.waitForTimeout(350);
      assert.ok(
        await openingVideo.evaluate(
          (v) => (v as HTMLVideoElement).currentTime > 0,
        ),
        "Opening video advances",
      );
      await f.locator("[data-opened=true]").waitFor({ timeout: 14000 });
      const revealMs = Date.now() - started;
      const motion = await openingVideo.evaluate((v) => ({
        duration: (v as HTMLVideoElement).duration,
        time: (v as HTMLVideoElement).currentTime,
        frames: (v as HTMLVideoElement).getVideoPlaybackQuality()
          .totalVideoFrames,
      }));
      assert.ok(motion.frames > 0);
      if (id !== "stained-glass")
        assert.ok(
          motion.time >= 5.2,
          `Must reveal at source video threshold, not fallback: ${JSON.stringify(motion)}`,
        );
      await page.waitForTimeout(3100);
      await page.screenshot({ path: `${out}${id}-${viewport.width}-hero.png` });
      const sections = await f
        .locator("[data-section]")
        .evaluateAll((xs) =>
          xs.map((x) => (x as HTMLElement).dataset.section!),
        );
      for (const key of sections) {
        const sec = f.locator(`[data-section=${key}]`);
        if (!(await sec.isVisible())) continue;
        await sec.evaluate((n) =>
          n.scrollIntoView({ behavior: "instant", block: "center" }),
        );
        await page.waitForTimeout(1000);
        assert.ok(
          await sec.evaluate((n) => n.clientWidth <= innerWidth + 1),
          `${id}/${key} horizontal overflow`,
        );
        if (["venue", "program", "gallery", "rsvp", "scratch"].includes(key))
          await page.screenshot({
            path: `${out}${id}-${viewport.width}-${key}.png`,
          });
      }
      const gallery = f.locator("[data-section=gallery]");
      await gallery.evaluate((n) =>
        n.scrollIntoView({ behavior: "instant", block: "center" }),
      );
      await page.waitForTimeout(1100);
      const card = gallery.locator("[data-gallery-card]").first();
      await card.click();
      await f.locator(".yarl__portal[role=dialog]").waitFor();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(350);
      await page.screenshot({
        path: `${out}${id}-${viewport.width}-lightbox.png`,
      });
      await page.keyboard.press("Escape");
      await f.locator(".yarl__portal").waitFor({ state: "detached" });
      if (id !== "stained-glass") {
        await gallery.locator("[data-gallery-prev]").click();
        assert.equal(await gallery.locator("[aria-current=true]").count(), 1);
        await gallery.locator("[data-gallery-next]").click();
        assert.equal(await gallery.locator("[aria-current=true]").count(), 1);
      } else {
        const canvas = f.locator("canvas");
        await canvas.scrollIntoViewIfNeeded();
        await canvas.press("Enter");
        assert.equal(
          await canvas.evaluate((n) => n.parentElement!.style.opacity),
          "0",
          "Scratch reveal works with keyboard",
        );
      }
      const locales = [
        ["en", "Time remaining"],
        ["ru", "До торжества осталось"],
        ["uz-Cyrl", "Қолган вақт"],
        ["uz-Latn", "Qolgan vaqt"],
      ];
      for (const [locale, label] of locales) {
        const nav = f.locator("[data-languages]");
        const text = (
          { en: "En", ru: "Ru", "uz-Cyrl": "Ўз", "uz-Latn": "Uz" } as Record<
            string,
            string
          >
        )[locale];
        await nav.getByRole("button", { name: text, exact: true }).click();
        await f
          .locator(`[data-section=countdown] h2`)
          .filter({ hasText: label })
          .waitFor({ state: "attached" });
        assert.equal(
          await f.locator("[data-program-row]").count(),
          6,
          "Repeatable program retains all fixture items",
        );
      }
      const p = await f.locator("body").evaluate(() => JSON.parse(window.name));
      const send = async (message: any) => {
        await page.evaluate(
          (message) =>
            document
              .querySelector("iframe")!
              .contentWindow!.postMessage(message, location.origin),
          message,
        );
        await page.waitForTimeout(150);
      };
      const original = structuredClone(p);
      // Creator input replaces every field; long names, manually pasted venue and empty optional sections.
      const authored = structuredClone(p);
      authored.payload.preview = false;
      authored.payload.sampleScratchPhoto = undefined;
      authored.payload.data.groom = "Aleksandr-Muhammad Abdullayev";
      authored.payload.data.bride = "Yekaterina-Shahnoza Abdurahmonova";
      authored.payload.data.message = "Creator-authored invitation message";
      authored.payload.data.venue.mapUrl =
        "https://yandex.uz/maps/?text=Creator%20venue";
      authored.payload.data.program = [];
      authored.payload.data.gallery = [];
      authored.payload.data.contacts = [];
      authored.payload.data.toyona.enabled = false;
      authored.payload.data.dressCode.enabled = false;
      authored.payload.data.rsvp.enabled = false;
      authored.payload.data.wishesEnabled = false;
      authored.payload.data.music = { enabled: false, url: "" };
      await send(authored);
      for (const key of [
        "program",
        "gallery",
        "contacts",
        "gift",
        "dress",
        "rsvp",
        "wishes",
      ])
        assert.equal(
          await f.locator(`[data-section=${key}]`).isVisible(),
          false,
          `${key} hides without content`,
        );
      if (id === "stained-glass")
        assert.equal(
          await f.locator("[data-section=scratch]").isVisible(),
          false,
          "Source couple photo never appears in empty creator invitations",
        );
      const text = await f.locator("body").innerText();
      assert.ok(
        !text.includes("Muhammad O.") &&
          !text.includes("Abdurahmonovlar oilasi") &&
          !text.includes("chorlove.uz"),
      );
      assert.equal(
        await f.locator("[data-map]").first().getAttribute("href"),
        "https://yandex.uz/maps/?text=Creator%20venue",
        "Manual venue URL remains exact",
      );
      assert.ok(text.includes("Aleksandr-Muhammad Abdullayev"));
      await send(original);
      assert.equal(await f.locator("[data-program-row]").count(), 6);
      assert.equal(await f.locator("[data-gallery-card]").count(), 6);
      // Preview service controls never claim a real submission succeeded.
      const wish = f.locator("[data-wish-form]");
      await wish.locator("input").fill("Preview guest");
      await wish.locator("textarea").fill("Preview wish");
      await wish.locator("[type=submit]").click();
      assert.match(await wish.locator("[data-status]").innerText(), /Ko‘rish/);
      const rsvp = f.locator("[data-rsvp-form]");
      await rsvp.locator("input").fill("Preview guest");
      await rsvp.locator("[role=radio]").first().click();
      await rsvp.locator("[type=submit]").click();
      assert.match(await rsvp.locator("[data-status]").innerText(), /Ko‘rish/);
      // Reduced-motion uses the same renderer with instant opening and paused videos.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(
        `${origin}/preview?template=${id}&qaSilent=1&qaReducedMotion=1&qaLongNames=1`,
        { waitUntil: "domcontentloaded" },
      );
      await f.locator("[aria-busy=false]").waitFor();
      await (
        id === "stained-glass"
          ? f.locator("[data-section=hero] button").first()
          : f.locator("[data-opening]")
      ).click();
      await f.locator("[data-opened=true]").waitFor();
      assert.ok(
        await f
          .locator("video")
          .evaluateAll((videos) =>
            videos.every((v) => (v as HTMLVideoElement).paused),
          ),
      );
      await page.screenshot({
        path: `${out}${id}-${viewport.width}-reduced-long-names.png`,
      });
      assert.deepEqual(errors, []);
      assert.deepEqual(missing, []);
      assert.deepEqual(provider, []);
      report.push({
        id,
        viewport,
        revealMs,
        motion,
        sections,
        locales: locales.map((x) => x[0]),
        missing,
        errors,
        providerRequests: provider,
        emptyOptionals: true,
        previewForms: true,
        reducedMotion: true,
      });
      await writeFile(
        `${out}browser-report.json`,
        JSON.stringify(report, null, 2) + "\n",
      );
      console.log(
        `PASS ${id} ${viewport.width}: source video, sections, gallery, four locales, empty optionals, preview forms, reduced motion`,
      );
      await page.close();
    }
  }
} finally {
  await browser.close();
}
