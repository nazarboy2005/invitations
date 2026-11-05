import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
import sharp from "sharp";
import jsQR from "jsqr";
import { LOCALES, type Invitation } from "../packages/contracts/src/index";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { yandexMapUrl } from "../packages/contracts/src/maps";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { renderStaticImage } from "../apps/web/src/server/static-image-renderer";
import { STATIC_IMAGE_DESIGNS } from "../apps/web/src/templates/static-registry";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(path.join(root, "apps/web"));
const out = path.join(root, "docs/templates/static-stationery-verification");
await mkdir(out, { recursive: true });
const ids = ["lola-maktubi", "moviy-ravoq-card", "zarhal-oqshom-card"];
const shortUrl = "https://fotiha.uz/Ab12Cd34";
const posters: Buffer[] = [];
for (const id of ids) {
  const design = STATIC_IMAGE_DESIGNS[id];
  const sample = normalizeInvitation(createTemplatePreviewSample(id));
  async function decode(png: Buffer, scale = 1) {
    const { data, info } = await sharp(png)
      .extract({
        left: Math.round(design.qr.x * scale),
        top: Math.round(design.qr.y * scale),
        width: Math.round(design.qr.size * scale),
        height: Math.round(design.qr.size * scale),
      })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data;
  }
  async function catalogPoster() {
    // The public poster's QR must resolve to the canonical sample venue, never
    // the synthetic short URL used to verify payload encoding below.
    const png = await renderStaticImage(sample, "uz-Latn", false);
    assert.equal(await decode(png), yandexMapUrl(sample.venue));
    const poster = await sharp(png)
      .resize(750, 1050)
      .webp({ quality: 93 })
      .toBuffer();
    const publicDir = path.join(root, "apps/web/public/templates", id);
    await mkdir(publicDir, { recursive: true });
    await writeFile(path.join(publicDir, "preview.webp"), poster);
    await writeFile(path.join(out, `${id}-catalog.webp`), poster);
    posters.push(poster);
  }
  if (process.argv.includes("--posters-only")) {
    await catalogPoster();
    continue;
  }
  async function evidence(
    invitation: Invitation,
    locale: (typeof LOCALES)[number],
    suffix: string,
  ) {
    const png = await renderStaticImage(invitation, locale, false, shortUrl);
    const metadata = await sharp(png).metadata();
    assert.equal(metadata.width, 1500);
    assert.equal(metadata.height, 2100);
    assert.equal(await decode(png), shortUrl);
    await sharp(png)
      .resize(750, 1050)
      .webp({ quality: 93 })
      .toFile(path.join(out, `${id}-${suffix}.webp`));
    return png;
  }
  for (const locale of LOCALES) {
    const png = await evidence(sample, locale, locale);
    const slots = design.slots(sample, locale);
    assert.equal(slots.find((s) => s.key === "date.day")?.text, "12");
    assert.equal(
      slots
        .find((s) => s.key === "date.month")
        ?.text.includes(
          locale === "ru"
            ? "ИЮНЯ"
            : locale === "uz-Cyrl"
              ? "ИЮН"
              : locale === "en"
                ? "JUNE"
                : "IYUN",
        ),
      true,
    );
    for (const s of slots)
      assert.ok(
        s.x >= 0 && s.y >= 0 && s.x + s.width <= 1500 && s.y + s.height <= 2100,
        `${id}: ${s.key} outside canvas`,
      );
    if (locale === "uz-Latn") {
      await catalogPoster();
      const protectedPreview = await renderStaticImage(
        sample,
        locale,
        true,
        shortUrl,
      );
      assert.equal((await sharp(protectedPreview).metadata()).width, 750);
      await writeFile(path.join(out, `${id}-protected.png`), protectedPreview);
      assert.notDeepEqual(
        await sharp(png).resize(750, 1050).raw().toBuffer(),
        await sharp(protectedPreview).raw().toBuffer(),
      );
    }
    const long = structuredClone(sample);
    long.content[locale].people =
      locale === "ru" || locale === "uz-Cyrl"
        ? ["Абдулазиз Абдурахмонов", "Мадинахон Рахматуллаева"]
        : ["Abdulaziz Abdurahmonov", "Madinaxon Rahmatullayeva"];
    await evidence(long, locale, `long-${locale}`);
  }
  const minimal = normalizeInvitation(
    createTemplatePreviewSample(id, {
      defaultLocale: "uz-Latn",
      enabledLocales: [...LOCALES],
      eventType: "fotiha",
    }),
  );
  for (const locale of LOCALES) {
    Object.assign(minimal.content[locale], {
      greeting: "",
      hosts: "",
      address: "",
      landmark: "",
    });
  }
  await evidence(minimal, "uz-Latn", "fotiha-minimal");
  const zoned = structuredClone(sample);
  zoned.startsAt = "2027-12-31T22:30:00Z";
  const zonedSlots = design.slots(zoned, "uz-Latn");
  assert.equal(zonedSlots.find((s) => s.key === "date.day")?.text, "01");
  assert.ok(zonedSlots.some((s) => s.text.includes("2028")));
  assert.ok(zonedSlots.some((s) => s.text.includes("03:30")));
  await evidence(zoned, "uz-Latn", "timezone-rollover");
  const written = structuredClone(sample);
  written.venue = { latitude: null, longitude: null, mapUrl: "" };
  const c = written.content["uz-Latn"];
  assert.equal(
    await decode(await renderStaticImage(written, "uz-Latn", false)),
    yandexMapUrl(
      written.venue,
      [c.venueName, c.address, c.landmark].filter(Boolean).join(", "),
    ),
  );
  const overflow = structuredClone(sample);
  overflow.content["uz-Latn"].message = "Overflow ".repeat(900);
  await assert.rejects(
    renderStaticImage(overflow, "uz-Latn", false),
    /sig‘madi/,
  );
  console.log(
    `PASS ${id}: four locales, long names, Fotiha/empty optionals, timezone, QR, preview/export, overflow`,
  );
}
await sharp({
  create: { width: 2250, height: 1050, channels: 3, background: "#ede8df" },
})
  .composite(
    posters.map((input, index) => ({ input, left: index * 750, top: 0 })),
  )
  .webp({ quality: 95 })
  .toFile(path.join(out, "collection.webp"));
console.log(`Evidence and canonical catalog posters saved: ${out}`);
