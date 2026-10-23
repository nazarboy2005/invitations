import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import {
  createInvitation,
  getContent,
  type Locale,
} from "@taklifnoma/contracts";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const projectRoot = process.cwd();
const sourceRoot = path.join(
  projectRoot,
  "Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/doira",
);
const packageRoot = path.join(projectRoot, "apps/web/public/templates/doira");
const rendererRoot = path.join(projectRoot, "apps/web/src/templates/doira");
const read = (base: string, file: string) =>
  readFileSync(path.join(base, file), "utf8");
const normalize = (source: string) =>
  source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const capturedHtml = read(sourceRoot, "index.html");
const packagedHtml = read(packageRoot, "index.html");
const extractBody = (html: string) =>
  normalize(html.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim() ?? "");

test("Doira exposes a typed renderer entry fixed to its template ID", () => {
  const renderer = read(rendererRoot, "renderer.tsx");
  assert.match(renderer, /ComponentProps<typeof MarxabaInvitation>/);
  assert.match(renderer, /templateId="doira"/);
  assert.match(read(rendererRoot, "index.ts"), /DoiraInvitation/);
});

test("Doira preserves the complete captured markup, scripts, styles, and artwork", () => {
  assert.equal(extractBody(packagedHtml), extractBody(capturedHtml));
  for (const file of [
    "template.css",
    "template.js",
    "sound.js",
    "drum.js",
    "effects.js",
    "scene.js",
  ]) {
    assert.equal(
      normalize(read(packageRoot, file)),
      normalize(read(sourceRoot, file)),
    );
  }
  const sourceMeta = read(sourceRoot, "meta.js")
    .replace(/\r\n/g, "\n")
    .trimEnd();
  const packageMeta = read(packageRoot, "meta.js")
    .replace(/\r\n/g, "\n")
    .trimEnd();
  assert.equal(
    packageMeta.replace('preview: "preview.png"', 'preview: "preview.webp"'),
    sourceMeta,
  );
  const files = readdirSync(path.join(sourceRoot, "art")).sort();
  assert.deepEqual(readdirSync(path.join(packageRoot, "art")).sort(), files);
  for (const file of files) {
    assert.deepEqual(
      readFileSync(path.join(packageRoot, "art", file)),
      readFileSync(path.join(sourceRoot, "art", file)),
    );
  }
  assert.match(read(packageRoot, "template.js"), /M\.reducedMotion/);
  assert.match(read(packageRoot, "scene.js"), /prefers-reduced-motion/);
  assert.match(read(packageRoot, "template.css"), /prefers-reduced-motion/);
  assert.match(packagedHtml, /href="contract-adapter\.css"/);
  const adapterCss = read(packageRoot, "contract-adapter.css");
  assert.match(adapterCss, /data-slot="toyona\.note"\]:empty/);
  assert.match(adapterCss, /data-slot="toyona\.bank"\]:empty/);
  assert.match(
    adapterCss,
    /\[data-section="gallery"\]:has\(\[data-list="gallery"\]:empty\)/,
  );
});

test("Doira maps the visible invitation content and section controls", () => {
  for (const selector of [
    'data-slot="groom"',
    'data-slot="bride"',
    'data-slot="greeting"',
    'data-slot="eventType"',
    'data-slot="date.long"',
    'data-slot="message"',
    'data-slot="hosts"',
    'data-list="program"',
    'data-slot="venue.name"',
    'data-slot="venue.address"',
    "data-dresscode",
    'data-list="gallery"',
    "data-rsvp",
    'data-list="wishes"',
    'data-section="toyona"',
    'data-slot="toyona.cardNumber"',
    'data-slot="toyona.cardHolder"',
    'data-list="contacts"',
    'id="doira-audio"',
    "data-ics",
    'id="replay-intro"',
  ])
    assert.ok(
      packagedHtml.includes(selector),
      `missing source contract hook ${selector}`,
    );
  assert.ok(packagedHtml.includes('data-photo="venue.photo"'));
  assert.ok(packagedHtml.includes('data-slot="toyona.bank"'));
  assert.ok(packagedHtml.includes('data-phase="loading"'));
});

test("Doira's shared preview fixture has complete localized sections and stays out of blank drafts", () => {
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const sample = createTemplatePreviewSample("doira", {
      defaultLocale: locale,
      enabledLocales: locales,
    });
    const content = getContent(sample, locale);
    assert.ok(content.people[0] && content.people[1], `${locale}: names`);
    assert.ok(content.eventLabel, `${locale}: event label`);
    assert.equal(sample.program.length, 6, `${locale}: program entries`);
    assert.equal(
      sample.dressCode.colors.length,
      5,
      `${locale}: clothing palette`,
    );
    assert.equal(
      sample.gift.cardNumber,
      "8600 1234 5678 9012",
      `${locale}: To‘yona`,
    );
    assert.equal(
      sample.contacts.phoneNumber,
      "+998 90 123 45 67",
      `${locale}: phone`,
    );
    assert.equal(
      sample.contacts.telegramUsername,
      "@demo",
      `${locale}: Telegram`,
    );
    assert.equal(sample.gallery.length, 6, `${locale}: icon-only Lahzalar`);
    assert.ok(
      sample.program.every((item) => content.programTitles[item.id]),
      `${locale}: localized program text`,
    );
    assert.equal(
      sample.gallery.every((item) => item.url === ""),
      true,
      `${locale}: no sample photos`,
    );
  }

  const blank = createInvitation("doira");
  assert.deepEqual(blank.content["uz-Latn"].people, []);
  assert.deepEqual(blank.program, []);
  assert.deepEqual(blank.gallery, []);
  assert.deepEqual(blank.contacts, { phoneNumber: "", telegramUsername: "" });
  assert.equal(blank.gift.cardNumber, "");
  assert.equal(blank.dressCode.enabled, false);
});

test("Doira uses local source fonts and authentic portrait opening artwork", () => {
  const html = read(packageRoot, "index.html");
  const htmlRefs = Array.from(
    html.matchAll(/(?:src|href)="([^"]+)"/g),
    (match) => match[1],
  ).filter((ref) => !/^https?:/i.test(ref) && !ref.startsWith("#"));
  for (const ref of htmlRefs)
    assert.ok(statSync(path.join(packageRoot, ref)).isFile(), `missing ${ref}`);

  const fontCss = read(packageRoot, "fonts.css");
  assert.match(fontCss, /font-family: 'Playfair Display'/);
  assert.match(fontCss, /font-family: 'Great Vibes'/);
  assert.doesNotMatch(fontCss, /https?:\/\//);
  for (const match of fontCss.matchAll(/url\(['"]?([^)'"\s]+\.woff2)/g)) {
    assert.ok(
      statSync(path.join(packageRoot, match[1])).isFile(),
      `missing ${match[1]}`,
    );
  }
  const templateCss = read(packageRoot, "template.css");
  assert.doesNotMatch(templateCss, /https?:\/\//);
  for (const match of templateCss.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))
    if (!match[1].startsWith("data:"))
      assert.ok(
        statSync(path.join(packageRoot, match[1])).isFile(),
        `missing ${match[1]}`,
      );

  const image = readFileSync(path.join(packageRoot, "preview.png"));
  assert.equal(image.toString("hex", 0, 8), "89504e470d0a1a0a");
  assert.equal(image.readUInt32BE(16), 430);
  assert.equal(image.readUInt32BE(20), 932);
  assert.match(packagedHtml, /og:image" content="preview\.png"/);
  assert.match(read(packageRoot, "meta.js"), /preview: "preview\.png"/);
});

test("Doira catalog art provenance locks the source opening at a portrait viewport", async () => {
  const { createHash } = await import("node:crypto");
  const manifest = JSON.parse(read(packageRoot, "preview.provenance.json")) as {
    asset: string;
    sha256: string;
    width: number;
    height: number;
    sourceOpening: string;
  };
  const preview = readFileSync(path.join(packageRoot, manifest.asset));
  assert.equal(manifest.asset, "preview.png");
  assert.equal(
    createHash("sha256").update(preview).digest("hex"),
    manifest.sha256,
  );
  assert.equal(preview.toString("hex", 0, 8), "89504e470d0a1a0a");
  assert.equal(preview.readUInt32BE(16), manifest.width);
  assert.equal(preview.readUInt32BE(20), manifest.height);
  assert.equal(manifest.width, 430);
  assert.equal(manifest.height, 932);
  assert.ok(manifest.height > manifest.width * 2);

  const sourceHtml = read(sourceRoot, "index.html");
  const sourceCss = read(sourceRoot, "template.css");
  const sourceMeta = read(sourceRoot, "meta.js");
  assert.equal(manifest.sourceOpening, "#intro");
  assert.match(sourceMeta, /preview: "preview\.webp"/);
  assert.equal(existsSync(path.join(sourceRoot, "preview.webp")), false);
  assert.match(sourceHtml, /<section class="intro" id="intro"/);
  assert.match(sourceHtml, /class="drum"/);
  assert.match(sourceCss, /\.curtain--left/);
  assert.match(sourceCss, /url\(art\/velvet-curtains-v2\.webp\)/);
  assert.deepEqual(
    readFileSync(path.join(packageRoot, "art/velvet-curtains-v2.webp")),
    readFileSync(path.join(sourceRoot, "art/velvet-curtains-v2.webp")),
  );
  assert.match(read(packageRoot, "meta.js"), /preview: "preview\.png"/);
});

test("Doira localizes the opening and invitation controls without loading captured sample data", () => {
  const localI18n = read(packageRoot, "i18n.js");
  const context = { window: { MARHAMAT_I18N: {} } };
  runInNewContext(
    read(projectRoot, "apps/web/public/templates/shared/nikoh/i18n.js"),
    context,
  );
  runInNewContext(localI18n, context);
  const translations = context.window.MARHAMAT_I18N as Record<string, string[]>;
  for (const key of [
    "Doirani uch marta chaling",
    "Oqshom sizdan",
    "Ikki qalb. Bir ohang.",
    "O‘tkazib yuborish",
    "Uchrashuv kuni",
    "To‘y dasturi",
    "Dress-kod",
    "Lahzalar",
    "Tashrifingizni tasdiqlang",
    "To‘yona",
    "Tilaklar",
    "Bog‘lanish uchun",
    "Doira · Taklifnoma",
    "Taklifnomani ochish",
    "Tashrif javobi",
    "To‘y kuni taqvimi",
    "Surat tanlash",
    "Suratni kattalashtirish",
    "To‘y surati",
    "Mehmonlar sonini kamaytirish",
    "Mehmonlar sonini oshirish",
  ])
    assert.equal(
      translations[key]?.length,
      2,
      `missing Russian/English copy for ${key}`,
    );
  const accessibleLabels = Array.from(
    packagedHtml.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1],
  ).filter(Boolean);
  for (const label of accessibleLabels)
    assert.equal(
      translations[label]?.length,
      2,
      `missing translation for accessible label: ${label}`,
    );
  const head = packagedHtml.match(/<head>[\s\S]*?<\/head>/)?.[0] ?? "";
  assert.doesNotMatch(
    head,
    /fonts\.googleapis|fonts\.gstatic|sample-invitation|sample-overrides|analytics/,
  );
});
