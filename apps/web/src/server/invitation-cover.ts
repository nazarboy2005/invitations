import { createHash, randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  rename,
  writeFile,
  readdir,
  stat,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";
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

const pending = new Map<string, Promise<Buffer>>();
let active = 0;
const buckets = new Map<string, { count: number; until: number }>();

// Cache files contain private draft content. They never live under public/ and
// there is no GET-by-hash route: a caller must submit the actual content again.
function cacheRoot() {
  return path.resolve(
    /* turbopackIgnore: true */ process.env.INVITATION_COVER_DIR ||
      path.join(process.cwd(), ".data", "invitation-covers"),
  );
}

async function pruneCache(root: string) {
  const names = (await readdir(root)).filter((name) =>
    /^[a-f0-9]{64}\.webp$/.test(name),
  );
  const files = await Promise.all(
    names.map(async (name) => ({
      name,
      info: await stat(path.join(root, name)),
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
) {
  // Analytics/dev cookies can rotate on navigation. Only the private session
  // distinguishes access to uploaded media; other cookies must not invalidate art.
  const session =
    cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${SESSION_COOKIE}=`)) ?? "";
  const key = coverKey(invitation, session);
  const root = cacheRoot();
  const file = path.join(root, `${key}.webp`);
  try {
    return await readFile(/* turbopackIgnore: true */ file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  // Preserve previously generated covers while upgrading the fingerprint.
  const legacy = createHash("sha256")
    .update(COVER_VERSION)
    .update(JSON.stringify(invitation))
    .update(cookie)
    .digest("hex");
  try {
    return await readFile(
      /* turbopackIgnore: true */ path.join(root, `${legacy}.webp`),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  if (pending.has(key)) return pending.get(key)!;
  if (active >= 2)
    throw new ApiError(
      429,
      "COVER_BUSY",
      "Muqova navbatda. Birozdan so‘ng qayta urining.",
    );
  limitCoverGeneration(address);
  const work = (async () => {
    active++;
    try {
      const bytes = await captureCover(invitation, cookie);
      await mkdir(root, { recursive: true, mode: 0o700 });
      const temporary = `${file}.${randomUUID()}.tmp`;
      await writeFile(temporary, bytes, { mode: 0o600 });
      await rename(temporary, file);
      await pruneCache(root).catch(() => {});
      return bytes;
    } finally {
      active--;
    }
  })().finally(() => pending.delete(key));
  pending.set(key, work);
  return work;
}

export async function captureCover(invitation: Invitation, cookie = "") {
  const trace = (stage: string) => {
    if (process.env.INVITATION_COVER_TRACE) console.log(stage);
  };
  trace("launch");
  const origin = new URL(process.env.APP_URL!).origin;
  const recipe = coverRecipe(invitation.templateId);
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.INVITATION_COVER_BROWSER_PATH || undefined,
  });
  const context = await browser.newContext({
    viewport: recipe.viewport,
    deviceScaleFactor: 1,
    serviceWorkers: "block",
  });
  const timeout = setTimeout(() => {
    void context.close();
  }, 55000);
  try {
    // No caller cookies in the browser, no API writes, no arbitrary remote URLs.
    // Creator media is proxied only through its existing authorization endpoint.
    const mediaOrigin = process.env.R2_PUBLIC_BASE_URL
      ? new URL(process.env.R2_PUBLIC_BASE_URL).origin
      : null;
    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (request.method() !== "GET") return route.abort();
      const kind = coverRequestKind(url.href, origin, mediaOrigin);
      if (kind === "deny") return route.abort();
      if (kind === "media") {
        const response = await fetch(url.href, {
          headers: { cookie },
          redirect: "manual",
          signal: AbortSignal.timeout(10000),
        });
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
    await frame.waitForLoadState("load");
    await page.waitForTimeout(1800);
    trace("fonts");
    await frame.evaluate(async () => {
      await document.fonts.ready;
    });
    if (invitation.templateId === "oltin-uzuk") {
      // Repeat the selected cover's documented source-only capture overrides.
      await frame.addStyleTag({
        content:
          "html.rx-on #intro .intro__fallback-scene{display:block!important;opacity:1!important}.rx--intro,#intro .scene-canvas,.mh-lang{display:none!important}",
      });
    }
    if (recipe.scene !== "opening") {
      const selector =
        recipe.scene === "lid"
          ? "#lid"
          : "#fs-open, #open-invitation, #gate-knock, #open-prompt, #open-btn, #openBtn, #openEnvelope, #si-opener, [data-open], [data-gg-source-opening], [data-chorlove-open], [data-landing-screenshot-id='invite-envelope']";
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
    const screenshot = recipe.element
      ? await frame.locator(recipe.element).screenshot({ animations: "allow" })
      : await page.screenshot({ animations: "allow" });
    return sharp(screenshot)
      .resize(COVER_VIEWPORT.width, COVER_VIEWPORT.height, {
        fit: "cover",
        position: "top",
      })
      .webp({ quality: 88 })
      .toBuffer();
  } finally {
    clearTimeout(timeout);
    await browser.close();
  }
}

async function settleImages(page: Page) {
  for (const frame of page.frames()) {
    await frame.evaluate(async () => {
      await document.fonts.ready;
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
