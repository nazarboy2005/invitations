import { readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";
import type { Invitation, Locale } from "@taklifnoma/contracts";
import QRCode from "qrcode";
import { yandexMapUrl } from "@taklifnoma/contracts/maps";
import { templateCapabilities } from "@taklifnoma/contracts/capabilities";
import {
  imageSlots,
  IMAGE_SIZE,
  IMAGE_TEMPLATE_ID,
  IMAGE_LOCATION_QR,
} from "../templates/ivory-rose-card/layout";
import {
  ZUMRAD_NAQSH_ID,
  ZUMRAD_NAQSH_QR,
  zumradNaqshSlots,
} from "../templates/zumrad-naqsh/layout";
import { coverBrowserOptions } from "./cover-runtime";
import { CoverBrowser } from "./cover-browser";
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
const assetLoads = new Map<string, Promise<{ background: string; backgroundType: string; regular: string; italic: string }>>();
function loadAssets(templateId: string) {
  if (!assetLoads.has(templateId)) assetLoads.set(templateId, (async () => {
    const folder = templateId === ZUMRAD_NAQSH_ID ? "zumrad-naqsh" : "ivory-rose-card";
    const root = path.join(process.cwd(), "src/templates", folder, "assets");
    const backgroundName = templateId === ZUMRAD_NAQSH_ID ? "background.svg" : "background.png";
    const [background, regular, italic] = await Promise.all(
      [backgroundName, "regular.ttf", "italic.ttf"].map((name) =>
        readFile(path.join(root, name)),
      ),
    );
    return {
      background: background.toString("base64"),
      backgroundType: templateId === ZUMRAD_NAQSH_ID ? "image/svg+xml" : "image/png",
      regular: regular.toString("base64"),
      italic: italic.toString("base64"),
    };
  })().catch((error) => {
    assetLoads.delete(templateId);
    throw error;
  }));
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
  if (
    ![IMAGE_TEMPLATE_ID, ZUMRAD_NAQSH_ID].includes(invitation.templateId) ||
    !invitation.enabledLocales.includes(locale)
  )
    throw new ApiError(400, "INVALID_IMAGE", "Rasm yoki tilni tekshiring.");
  if (active >= 3)
    throw new ApiError(
      429,
      "RENDER_BUSY",
      "Rasm tayyorlanmoqda. Birozdan so‘ng qayta urining.",
    );
  active++;
  let context;
  let browser;
  try {
    const zumrad = invitation.templateId === ZUMRAD_NAQSH_ID;
    const a = await loadAssets(invitation.templateId);
    const slots = zumrad ? zumradNaqshSlots(invitation, locale) : imageSlots(invitation, locale);
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
            width: zumrad ? ZUMRAD_NAQSH_QR.size : IMAGE_LOCATION_QR.size,
            color: { dark: zumrad ? "#12392f" : "#454337", light: "#fffdf7" },
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
      *{box-sizing:border-box}html,body{margin:0;width:1500px;height:2100px;overflow:hidden}body{background:#f6efdf url(data:${a.backgroundType};base64,${a.background}) center/100% 100%;color:${zumrad ? "#f1e6c7" : "#55513d"};font-family:Card,serif}
      .slot{position:absolute;display:flex;align-items:center;justify-content:center;text-align:center;white-space:pre-wrap;overflow-wrap:anywhere;font-weight:400;line-height:1.2}
      .text{max-width:100%}.rule{position:absolute;left:650px;top:1005px;width:200px;height:1px;background:#a58e5b}
      .location-qr{position:absolute;left:${zumrad ? ZUMRAD_NAQSH_QR.x : IMAGE_LOCATION_QR.x}px;top:${zumrad ? ZUMRAD_NAQSH_QR.y : IMAGE_LOCATION_QR.y}px;width:${zumrad ? ZUMRAD_NAQSH_QR.size : IMAGE_LOCATION_QR.size}px;height:${zumrad ? ZUMRAD_NAQSH_QR.size : IMAGE_LOCATION_QR.size}px;image-rendering:pixelated}
      .watermark{position:absolute;color:#786f5d;opacity:.24;font:23px Arial,sans-serif;letter-spacing:4px;transform:rotate(-30deg);white-space:nowrap}
      </style></head><body>${zumrad ? "" : '<div class="rule"></div>'}${qr ? `<img class="location-qr" src="${qr}" alt="">` : ""}${slots.map((s) => `<div class="slot" data-key="${s.key}" data-size="${s.size}" data-min="${s.min}" style="left:${s.x}px;top:${s.y}px;width:${s.width}px;height:${s.height}px;font-size:${s.size}px;${s.italic ? "font-style:italic;" : ""}letter-spacing:${s.tracking ?? 0}px"><div class="text">${escape(s.text)}</div></div>`).join("")}${preview ? Array.from({ length: 15 }, (_, i) => `<div class="watermark" style="left:${(i % 3) * 520 - 100}px;top:${Math.floor(i / 3) * 420 + 170}px">FOTIHA · NAMUNA</div>`).join("") : ""}</body></html>`,
      { waitUntil: "load" },
    );
    const overflow = await page.evaluate(async () => {
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
    });
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
    await context?.close().catch(() => {});
    if (browser) browserPool.release(browser);
    active--;
  }
}
