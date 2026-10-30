import { createHash } from "node:crypto";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright-core";
import sharp from "sharp";
import type { Invitation } from "@taklifnoma/contracts";
import {
  coverRecipe,
  COVER_VIEWPORT,
  COVER_VERSION,
} from "@/modules/dashboard/cover-recipe";
import { ApiError } from "./api";
import { coverKey, coverRequestKind } from "./cover-policy";
import { SESSION_COOKIE } from "./auth";
import { coverBrowserOptions, coverCacheRoot } from "./cover-runtime";
import { readCoverFile, writeCoverFile } from "./cover-disk-cache";
import { coverFailure } from "./cover-error";
import { CoverBrowser, captureCoverPixels } from "./cover-browser";
import { coverStorage } from "./cover-storage";

const browsers = new CoverBrowser(async () =>
  chromium.launch(await coverBrowserOptions()),
);

const pending = new Map<string, Promise<Buffer>>();
const persisted = new Set<string>();
function rememberPersisted(key: string) {
  if (persisted.size >= 500) persisted.delete(persisted.values().next().value!);
  persisted.add(key);
}
let active = 0;
const buckets = new Map<string, { count: number; until: number }>();

// Cache files contain private draft content. They never live under public/ and
// there is no GET-by-hash route: a caller must submit the actual content again.
async function pruneCache(root: string) {
  const names = (await readdir(/* turbopackIgnore: true */ root)).filter(
    (name) => /^[a-f0-9]{64}\.webp$/.test(name),
  );
  const files = await Promise.all(
    names.map(async (name) => ({
      name,
      info: await stat(/* turbopackIgnore: true */ path.join(root, name)),
    })),
  );
  files.sort((a, b) => b.info.mtimeMs - a.info.mtimeMs);
  await Promise.all(
    files
      .filter(
        (file, index) =>
          index >= 500 || file.info.mtimeMs < Date.now() - 7 * 86400000,
      )
      .map((file) => unlink(path.join(root, file.name)).catch(() => {})),
  );
}

export function limitCoverGeneration(address: string) {
  const now = Date.now();
  for (const [key, bucket] of buckets)
    if (bucket.until < now) buckets.delete(key);
  const key = createHash("sha256").update(address).digest("hex");
  const bucket = buckets.get(key) ?? { count: 0, until: now + 60000 };
  if (++bucket.count > 24 || buckets.size > 2000)
    throw new ApiError(
      429,
      "COVER_LIMIT",
      "Muqova tayyorlash uchun biroz kuting.",
    );
  buckets.set(key, bucket);
}

export async function personalizedCover(
  invitation: Invitation,
  address: string,
  cookie: string,
  ownerId?: string,
) {
  if (invitation.status !== "published") {
    // Draft output belongs only in the caller's browser. Keep no disk/R2 copy.
    const key = `draft:${coverKey(invitation, cookie)}`;
    return generateCover(key, address, () => captureCover(invitation, cookie));
  }
  // Analytics/dev cookies can rotate on navigation. Only the private session
  // distinguishes access to uploaded media; other cookies must not invalidate art.
  const session =
    cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${SESSION_COOKIE}=`)) ?? "";
  const key = coverKey(invitation, ownerId ? `owner:${ownerId}` : session);
  const storage = ownerId ? coverStorage() : undefined;
  const save = async (bytes: Buffer) => {
    if (await storage?.write(key, bytes)) rememberPersisted(key);
  };
  const root = coverCacheRoot();
  const file = path.join(root, `${key}.webp`);
  const cached = await readCoverFile(file);
  if (cached) {
    // Also migrate images generated before persistent storage was enabled.
    if (storage && !persisted.has(key)) {
      if (await storage.read(key)) rememberPersisted(key);
      else await save(cached);
    }
    return cached;
  }
  const saved = await storage?.read(key);
  if (saved) {
    rememberPersisted(key);
    await writeCoverFile(file, saved);
    return saved;
  }
  // Preserve previously generated covers while upgrading the fingerprint.
  const legacy = createHash("sha256")
    .update(COVER_VERSION)
    .update(JSON.stringify(invitation))
    .update(cookie)
    .digest("hex");
  const previous = await readCoverFile(path.join(root, `${legacy}.webp`));
  const previousSession = ownerId
    ? await readCoverFile(
        path.join(root, `${coverKey(invitation, session)}.webp`),
      )
    : undefined;
  if (previous || previousSession) {
    const bytes = (previous || previousSession)!;
    await save(bytes);
    await writeCoverFile(file, bytes);
    return bytes;
  }
  return generateCover(key, address, async () => {
    const bytes = await captureCover(invitation, cookie);
    await save(bytes);
    if (await writeCoverFile(file, bytes))
      await pruneCache(root).catch(() => {});
    return bytes;
  });
}

async function generateCover(
  key: string,
  address: string,
  capture: () => Promise<Buffer>,
) {
  if (pending.has(key)) return pending.get(key)!;
  if (active >= 1)
    throw new ApiError(
      429,
      "COVER_BUSY",
      "Muqova navbatda. Birozdan so‘ng qayta urining.",
    );
  limitCoverGeneration(address);
  const work = (async () => {
    active++;
    try {
      return await capture();
    } finally {
      active--;
    }
  })().finally(() => pending.delete(key));
  pending.set(key, work);
  return work;
}

export async function captureCover(invitation: Invitation, cookie = "") {
  let stage = "configuration";
  const trace = (nextStage: string) => {
    stage = nextStage;
    if (process.env.INVITATION_COVER_TRACE) console.log(stage);
  };
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let succeeded = false;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const origin = new URL(process.env.APP_URL!).origin;
    const recipe = coverRecipe(invitation.templateId);
    trace("browser");
    trace("launch");
    browser = await browsers.acquire();
    timeout = setTimeout(() => {
      if (browser) void browsers.discard(browser);
    }, 35000);
    context = await browser.newContext({
      viewport: recipe.viewport,
      deviceScaleFactor: 1,
      serviceWorkers: "block",
    });
    // No caller cookies in the browser, no API writes, no arbitrary remote URLs.
    // Creator media is proxied only through its existing authorization endpoint.
    const mediaOrigin = process.env.R2_PUBLIC_BASE_URL
      ? new URL(process.env.R2_PUBLIC_BASE_URL).origin
      : null;
    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (request.method() !== "GET") return route.abort();
      // Audio contributes no pixels. Keep video available because some source
      // templates use its first frame as their actual cover artwork.
      if (/\.(?:mp3|ogg|wav|m4a|aac|flac)$/i.test(url.pathname))
        return route.abort();
      const kind = coverRequestKind(url.href, origin, mediaOrigin);
      if (kind === "deny") return route.abort();
      if (kind === "media") {
        const response = await fetch(url.href, {
          headers: { cookie },
          redirect: "manual",
          signal: AbortSignal.timeout(10000),
        }).catch(() => null);
        if (!response) return route.abort();
        const contentType = response.headers.get("Content-Type") ?? "";
        if (!response.ok || !contentType.startsWith("image/"))
          return route.abort();
        return route.fulfill({
          status: 200,
          contentType,
          body: Buffer.from(await response.arrayBuffer()),
        });
      }
      return route.continue();
    });
    await context.addInitScript((data) => {
      if (window === window.top)
        (window as Window & { __invitationCover?: unknown }).__invitationCover =
          JSON.parse(data);
      HTMLMediaElement.prototype.play = () => Promise.resolve();
    }, JSON.stringify(invitation));
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    trace("navigate");
    await page.goto(
      `${origin}/preview?template=${encodeURIComponent(invitation.templateId)}&cover=1`,
      { waitUntil: "domcontentloaded", timeout: 30000 },
    );
    await page.addStyleTag({
      content: "nextjs-portal{display:none!important}",
    });
    trace("mount");
    await page
      .locator("main iframe")
      .first()
      .waitFor({ state: "attached", timeout: 20000 });
    const frameElement = await page
      .locator("main iframe")
      .first()
      .elementHandle();
    const frame = await frameElement!.contentFrame();
    if (!frame) throw new Error("Cover renderer did not mount");
    trace("frame load");
    await frame.waitForURL(/\/templates\//, { timeout: 20000 });
    await frame.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1800);
    trace("fonts");
    await frame.evaluate(async () => {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);
    });
    if (invitation.templateId === "oltin-uzuk") {
      // Repeat the selected cover's documented source-only capture overrides.
      await frame.addStyleTag({
        content:
          "html.rx-on #intro .intro__fallback-scene{display:block!important;opacity:1!important}.rx--intro,#intro .scene-canvas,.mh-lang{display:none!important}",
      });
    }
    trace("scene");
    if (recipe.scene !== "opening") {
      const selector =
        recipe.scene === "lid"
          ? "#lid"
          : "#openInvite, #sk-open, #qg-open, #splash-open, #os-open, #oy-open, #mw-open, #splash.splash[onclick], #fs-open, #mp-open, #tv-open, #open-invitation, #gate-knock, #open-prompt, #open-btn, #openBtn, #openEnvelope, #si-opener, [data-open], [data-gg-source-opening], [data-chorlove-open], [data-landing-screenshot-id='invite-envelope']";
      const opener = frame.locator(selector).first();
      if (recipe.scene === "book") {
        const box = await opener.boundingBox();
        if (!box) throw new Error("Cover opening control missing");
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 3);
        await page.mouse.down();
        await page.mouse.move(
          box.x + box.width / 2,
          Math.min(790, box.y + box.height / 3 + 360),
          { steps: 30 },
        );
        await page.mouse.up();
        // The source also supports Enter; this completes a short drag that
        // falls below its viewport-dependent threshold without fabricating art.
        if (
          !(await frame.evaluate(() =>
            document.body.classList.contains("is-open"),
          ))
        ) {
          await opener.press("Enter");
        }
      } else {
        await opener.click({ force: true, timeout: 5000 });
      }
      if (invitation.templateId === "doira") {
        for (let tap = 0; tap < 2; tap++) {
          await page.waitForTimeout(250);
          await opener.evaluate((element) => (element as HTMLElement).click());
        }
      }
      const skip = frame.locator("#skip-intro");
      if (await skip.count())
        await skip.evaluate((element) => (element as HTMLElement).click());
      // Let the source finish its own reveal, including chained name strokes.
      await frame.evaluate(() => {
        const gsap = (
          window as Window & {
            gsap?: { globalTimeline: { timeScale(value: number): void } };
          }
        ).gsap;
        gsap?.globalTimeline.timeScale(4);
      });
      await page.waitForTimeout(4000);
    } else {
      // Some selected covers follow an automatic door reveal rather than a tap.
      await page.waitForTimeout(
        invitation.templateId === "butterfly" ? 6500 : 2000,
      );
    }
    trace("settle images");
    await settleImages(page);
    trace("freeze");
    // Freeze the selected scene; don't replay its animation on every dashboard visit.
    await frame.evaluate(() => {
      document
        .querySelectorAll("audio,video")
        .forEach((media) => (media as HTMLMediaElement).pause());
      document.getAnimations().forEach((animation) => animation.pause());
      const style = document.createElement("style");
      style.textContent =
        "html,body,*{scrollbar-width:none!important}::-webkit-scrollbar{display:none!important}";
      document.head.append(style);
    });
    trace("screenshot");
    const screenshot = await captureCoverPixels(page, recipe.element);
    const bytes = await sharp(screenshot)
      .resize(COVER_VIEWPORT.width, COVER_VIEWPORT.height, {
        fit: "cover",
        position: "top",
      })
      .webp({ quality: 88 })
      .toBuffer();
    succeeded = true;
    return bytes;
  } catch (error) {
    throw coverFailure(error, stage);
  } finally {
    await context?.close().catch(() => {});
    clearTimeout(timeout);
    if (browser) {
      if (succeeded) browsers.release(browser);
      else await browsers.discard(browser);
    }
  }
}

async function settleImages(page: Page) {
  for (const frame of page.frames()) {
    await frame.evaluate(async () => {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);
      const visible = Array.from(document.images).filter((image) => {
        const rect = image.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.top < innerHeight &&
          rect.bottom > 0
        );
      });
      await Promise.race([
        Promise.all(visible.map((image) => image.decode().catch(() => {}))),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);
    });
  }
}
