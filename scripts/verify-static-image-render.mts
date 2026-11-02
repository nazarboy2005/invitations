import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
import sharp from "sharp";
import jsQR from "jsqr";
import { yandexMapUrl } from "../packages/contracts/src/maps";
import { LOCALES, type Locale } from "../packages/contracts/src/index";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { renderStaticImage } from "../apps/web/src/server/static-image-renderer";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(path.join(root, "apps/web"));
const out = path.join(root, "docs/templates/ivory-rose-card-verification");
await mkdir(out, { recursive: true });
const sample = normalizeInvitation(
  createTemplatePreviewSample("ivory-rose-card"),
);
async function decodeLocation(png: Buffer) {
  const { data, info } = await sharp(png)
    .extract({ left: 585, top: 1710, width: 210, height: 210 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data;
}
const preview = await renderStaticImage(sample, "uz-Latn", true);
assert.equal((await sharp(preview).metadata()).width, 750);
assert.equal((await sharp(preview).metadata()).height, 1050);
await writeFile(path.join(out, "protected-preview.png"), preview);
for (const locale of LOCALES) {
  const png = await renderStaticImage(sample, locale, false);
  const meta = await sharp(png).metadata();
  assert.equal(meta.width, 1500);
  assert.equal(meta.height, 2100);
  assert.equal(meta.format, "png");
  if (locale === "uz-Latn")
    await writeFile(path.join(out, `sample-${locale}.png`), png);
  else
    await sharp(png)
      .resize(900, 1260)
      .webp({ quality: 92 })
      .toFile(path.join(out, `sample-${locale}.webp`));
  if (locale === "uz-Latn") {
    assert.equal(await decodeLocation(png), yandexMapUrl(sample.venue));
    const poster = path.join(root, "apps/web/public/templates/ivory-rose-card");
    await mkdir(poster, { recursive: true });
    await sharp(png)
      .resize(750, 1050)
      .webp({ quality: 90 })
      .toFile(path.join(poster, "preview.webp"));
    assert.notDeepEqual(png, preview);
  }
}
const moved = structuredClone(sample);
moved.venue = { latitude: 40.12, longitude: 67.83, mapUrl: "" };
assert.equal(
  await decodeLocation(await renderStaticImage(moved, "uz-Latn", false)),
  yandexMapUrl(moved.venue),
);
const written = structuredClone(sample);
written.venue = { latitude: null, longitude: null, mapUrl: "" };
const c = written.content["uz-Latn"];
assert.equal(
  await decodeLocation(await renderStaticImage(written, "uz-Latn", false)),
  yandexMapUrl(
    written.venue,
    [c.venueName, c.address, c.landmark].filter(Boolean).join(", "),
  ),
);
const long = structuredClone(sample);
for (const locale of LOCALES)
  long.content[locale].people =
    locale === "ru" || locale === "uz-Cyrl"
      ? ["Абдулазиз Абдурахмонов", "Мадинахон Рахматуллаева"]
      : ["Abdulaziz Abdurahmonov", "Madinaxon Rahmatullayeva"];
await sharp(await renderStaticImage(long, "uz-Latn", false))
  .resize(900, 1260)
  .webp({ quality: 92 })
  .toFile(path.join(out, "long-names.webp"));
for (const locale of LOCALES.slice(1))
  await renderStaticImage(long, locale as Locale, false);
const overflow = structuredClone(sample);
overflow.content["uz-Latn"].message = "Overflow ".repeat(900);
await assert.rejects(renderStaticImage(overflow, "uz-Latn", false), /sig‘madi/);
console.log(
  "PASS: four locales, long names, protected preview, overflow rejection, scannable Yandex QR (selected/changed point and written address) and 1500×2100 flattened PNG; catalog poster generated.",
);
