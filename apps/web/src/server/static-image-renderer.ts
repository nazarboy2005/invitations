import { readFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type BrowserContext } from "playwright-core";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import QRCode from "qrcode";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { templateCapabilities } from "@taklifnoma/contracts/capabilities";
import { IMAGE_SIZE } from "../templates/ivory-rose-card/layout";
import { ivoryRoseCalligraphy } from "../templates/ivory-rose-card/composition";
import { STATIC_IMAGE_DESIGNS } from "../templates/static-registry";
import { coverBrowserOptions } from "./cover-runtime";
import { CoverBrowser } from "./cover-browser";
import { coverCleanup, coverDeadline } from "./cover-deadline";
import { ApiError } from "./api";

const browserPool = new CoverBrowser(async () =>
  chromium.launch(await coverBrowserOptions()),
);
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const assetLoads = new Map<
  string,
  Promise<{
    background: string;
    backgroundType: string;
    regular: string;
    italic: string;
    fontFaces: string;
  }>
>();
function loadAssets(templateId: string) {
  if (!assetLoads.has(templateId))
    assetLoads.set(
      templateId,
      (async () => {
        const design = STATIC_IMAGE_DESIGNS[templateId];
        if (!design) throw new Error("Unknown static design");
        const root = path.join(
          process.cwd(),
          "src/templates",
          design.folder,
          "assets",
        );
        const [background, regular, italic] = await Promise.all(
          [design.background, "regular.ttf", "italic.ttf"].map((name) =>
            readFile(path.join(root, name)),
          ),
        );
        let fontFaces = design.calligraphy
          ? (
              await Promise.all(
                ivoryRoseCalligraphy.map(async ({ file, range }) => {
                  const bytes = await readFile(path.join(root, file));
                  return `@font-face{font-family:CardCalligraphy;src:url(data:font/woff2;base64,${bytes.toString("base64")}) format('woff2');unicode-range:${range}}`;
                }),
              )
            ).join("")
          : "";
        if (design.displayFont) {
          const display = await readFile(path.join(root, "display.ttf"));
          fontFaces += `@font-face{font-family:CardDisplay;src:url(data:font/ttf;base64,${display.toString("base64")})}`;
        }
        return {
          background: background.toString("base64"),
          backgroundType: design.background.endsWith(".svg")
            ? "image/svg+xml"
            : "image/png",
          regular: regular.toString("base64"),
          italic: italic.toString("base64"),
          fontFaces,
        };
      })().catch((error) => {
        assetLoads.delete(templateId);
        throw error;
      }),
    );
  return assetLoads.get(templateId)!;
}
let active = 0;
/** Private, self-contained render: no network, untrusted markup or browser artwork layers. */
export async function renderStaticImage(
  invitation: Invitation,
  locale: Locale,
  preview = true,
  qrUrl?: string,
) {
  const design = Object.hasOwn(STATIC_IMAGE_DESIGNS, invitation.templateId)
    ? STATIC_IMAGE_DESIGNS[invitation.templateId]
    : undefined;
  if (!design || !invitation.enabledLocales.includes(locale))
    throw new ApiError(400, "INVALID_IMAGE", "Rasm yoki tilni tekshiring.");
  if (active >= 3)
    throw new ApiError(
      429,
      "RENDER_BUSY",
      "Rasm tayyorlanmoqda. Birozdan so‘ng qayta urining.",
    );
  active++;
  let context: BrowserContext | undefined;
  let browser;
  try {
    const a = await loadAssets(invitation.templateId);
    const slots = design.slots(invitation, locale);
    const content = invitation.content[locale];
    const destination = yandexMapUrl(
      invitation.venue,
      [content.venueName, content.address, content.landmark]
        .filter(Boolean)
        .join(", "),
    );
    const qrDestination = qrUrl ?? destination;
    const qr =
      templateCapabilities(invitation.templateId).locationQr && destination
        ? await QRCode.toDataURL(qrDestination, {
            errorCorrectionLevel: "M",
            margin: 4,
            width: design.qr.size,
            color: { dark: design.qrInk, light: design.qrPaper },
          })
        : "";
    browser = await browserPool.acquire();
    context = await browser.newContext({
      viewport: IMAGE_SIZE,
      deviceScaleFactor: preview ? 0.5 : 1,
      reducedMotion: "reduce",
    });
    await context.route("**/*", (route) => route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    await page.setContent(
      `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><style>
      @font-face{font-family:Card;src:url(data:font/ttf;base64,${a.regular})}
      @font-face{font-family:Card;src:url(data:font/ttf;base64,${a.italic});font-style:italic}
      ${a.fontFaces}
      *{box-sizing:border-box}html,body{margin:0;width:1500px;height:2100px;overflow:hidden}body{background:#f6efdf url(data:${a.backgroundType};base64,${a.background}) center/100% 100%;color:${design.ink};font-family:Card,serif}
      .slot{position:absolute;display:flex;align-items:center;justify-content:center;text-align:center;white-space:pre-wrap;overflow-wrap:anywhere;font-weight:400;line-height:1.2}
      .text{max-width:100%}.composition{position:absolute;inset:0;pointer-events:none}
      .location-qr{position:absolute;left:${design.qr.x}px;top:${design.qr.y}px;width:${design.qr.size}px;height:${design.qr.size}px;image-rendering:pixelated}
      .watermark{position:absolute;color:#786f5d;opacity:.24;font:23px Arial,sans-serif;letter-spacing:4px;transform:rotate(-30deg);white-space:nowrap}
      </style></head><body>${design.composition ?? ""}${qr ? `<img class="location-qr" src="${qr}" alt="">` : ""}${slots
        .filter((s) => qr || !s.key.startsWith("qr"))
        .map(
          (s) =>
            `<div class="slot" data-key="${s.key}" data-size="${s.size}" data-min="${s.min}" style="left:${s.x}px;top:${s.y}px;width:${s.width}px;height:${s.height}px;font-size:${s.size}px;${s.italic ? "font-style:italic;" : ""}${s.font === "calligraphy" ? "font-family:CardCalligraphy,Card,serif;" : s.font === "display" ? "font-family:CardDisplay,Card,serif;" : ""}${s.align === "left" ? "text-align:left;justify-content:flex-start;" : s.align === "right" ? "text-align:right;justify-content:flex-end;" : ""}${s.color ? `color:${s.color};` : ""}${s.lineHeight ? `line-height:${s.lineHeight};` : ""}letter-spacing:${s.tracking ?? 0}px"><div class="text">${escape(s.text)}</div></div>`,
        )
        .join(
          "",
        )}${preview ? Array.from({ length: 15 }, (_, i) => `<div class="watermark" style="left:${(i % 3) * 520 - 100}px;top:${Math.floor(i / 3) * 420 + 170}px">FOTIHA · NAMUNA</div>`).join("") : ""}</body></html>`,
      { waitUntil: "load" },
    );
    const overflow = await coverDeadline(
      () =>
        page.evaluate(async () => {
          await document.fonts.ready;
          const failed: string[] = [];
          for (const box of document.querySelectorAll<HTMLElement>(".slot")) {
            const text = box.firstElementChild as HTMLElement;
            let size = Number(box.dataset.size);
            const min = Number(box.dataset.min);
            while (
              (text.scrollHeight > box.clientHeight + 1 ||
                text.scrollWidth > box.clientWidth + 1) &&
              size > min
            )
              box.style.fontSize = `${--size}px`;
            if (
              text.scrollHeight > box.clientHeight + 1 ||
              text.scrollWidth > box.clientWidth + 1
            )
              failed.push(box.dataset.key!);
          }
          return failed;
        }),
      12000,
    );
    if (overflow.length)
      throw new ApiError(
        422,
        "IMAGE_TEXT_OVERFLOW",
        `Matn rasmga sig‘madi (${overflow.join(", ")}). Matnni qisqartiring.`,
      );
    return await page.screenshot({
      type: "png",
      animations: "disabled",
      timeout: 12000,
    });
  } finally {
    const finishedContext = context;
    if (finishedContext) await coverCleanup(() => finishedContext.close());
    if (browser) browserPool.release(browser);
    active--;
  }
}
