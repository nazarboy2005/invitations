import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/bulbul");
const packageRoot = path.join(projectRoot, "apps/web/public/templates/bulbul");
const rendererRoot = path.join(projectRoot, "apps/web/src/templates/bulbul");
const read = (base: string, file: string) => readFileSync(path.join(base, file), "utf8");
const capturedHtml = read(sourceRoot, "index.html");
const packagedHtml = read(packageRoot, "index.html");
const extractBody = (html: string) => html.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim() ?? "";

test("Bulbul has a typed renderer entry fixed to its own template ID", () => {
  const renderer = read(rendererRoot, "renderer.tsx");
  const index = read(rendererRoot, "index.ts");
  assert.match(renderer, /ComponentProps<typeof MarxabaInvitation>/);
  assert.match(renderer, /templateId="bulbul"/);
  assert.match(index, /BulbulInvitation/);
});

test("Bulbul preserves the captured page body, source scripts, styles, metadata, and artwork", () => {
  assert.equal(extractBody(packagedHtml), extractBody(capturedHtml));
  for (const file of ["template.css", "template.js", "plaque.js"]) {
    assert.deepEqual(readFileSync(path.join(packageRoot, file)), readFileSync(path.join(sourceRoot, file)));
  }
  const sourceMeta = read(sourceRoot, "meta.js");
  const packageMeta = read(packageRoot, "meta.js");
  assert.equal(
    packageMeta.replace('preview: "preview.png"', 'preview: "preview.webp"').replace(/\r\n/g, "\n").trimEnd(),
    sourceMeta.replace(/\r\n/g, "\n").trimEnd(),
  );
  const sourceArt = path.join(sourceRoot, "art");
  const packageArt = path.join(packageRoot, "art");
  const files = readdirSync(sourceArt).sort();
  assert.deepEqual(readdirSync(packageArt).sort(), files);
  for (const file of files) {
    assert.deepEqual(readFileSync(path.join(packageArt, file)), readFileSync(path.join(sourceArt, file)));
  }
  assert.match(read(packageRoot, "template.js"), /reducedMotion/);
  assert.match(read(packageRoot, "template.css"), /prefers-reduced-motion/);
});

test("Bulbul exposes the captured sections and contract hooks", () => {
  for (const selector of [
    'data-slot="groom"', 'data-slot="bride"', 'data-slot="eventType"',
    'data-slot="date.long"', 'data-slot="greeting"', 'data-slot="message"',
    'data-slot="hosts"', 'data-list="program"', 'data-slot="venue.name"',
    'data-slot="venue.address"', 'data-dresscode', 'data-list="gallery"',
    'data-rsvp', 'data-list="wishes"', 'data-section="toyona"',
    'data-slot="toyona.cardNumber"', 'data-slot="toyona.cardHolder"',
    'data-list="contacts"', 'data-music-toggle', 'data-ics',
  ]) assert.ok(packagedHtml.includes(selector), `missing source contract hook ${selector}`);
  assert.ok(packagedHtml.includes('data-photo="venue.photo"'));
  assert.ok(packagedHtml.includes('data-slot="toyona.bank"'));
  assert.ok(!extractBody(packagedHtml).includes('data-slot="program.note"'));
});

test("Bulbul uses local source fonts and its actual portrait opening artwork", () => {
  const fontCss = read(packageRoot, "fonts.css");
  assert.match(fontCss, /font-family: 'Cormorant Garamond'/);
  assert.match(fontCss, /font-family: 'Great Vibes'/);
  assert.doesNotMatch(fontCss, /https?:\/\//);
  for (const match of fontCss.matchAll(/url\(['"]?([^)'"\s]+\.woff2)/g)) {
    assert.ok(statSync(path.join(packageRoot, match[1])).isFile(), `missing ${match[1]}`);
  }
  const image = readFileSync(path.join(packageRoot, "preview.png"));
  const capturedOpening = readFileSync(path.join(packageRoot, "preview-350.png"));
  assert.deepEqual(image, capturedOpening, "catalog artwork must show the captured closed-cage opening");
  assert.equal(image.toString("hex", 0, 8), "89504e470d0a1a0a");
  assert.equal(image.readUInt32BE(16), 430);
  assert.equal(image.readUInt32BE(20), 932);
  assert.match(packagedHtml, /og:image" content="preview\.png"/);
  assert.match(read(packageRoot, "meta.js"), /preview: "preview\.png"/);
});

test("Bulbul keeps the lightbox close control clear of the shared language picker", () => {
  const appHead = packagedHtml.match(/<head>[\s\S]*?<\/head>/)?.[0] ?? "";
  assert.match(appHead, /href="platform-adapter\.css"/);
  assert.match(read(packageRoot, "platform-adapter.css"), /\.marhamat-lightbox \.lightbox-close/);
  assert.match(read(packageRoot, "platform-adapter.css"), /left: calc\(16px \+ env\(safe-area-inset-left/);
  assert.match(read(packageRoot, "platform-adapter.css"), /\[data-slot="toyona\.bank"\]:empty/);
  assert.match(read(packageRoot, "platform-adapter.css"), /\[data-slot="toyona\.note"\]:empty/);
});

test("Bulbul page copy localizes without shipping the reference sample mutator", () => {
  const pageI18n = read(packageRoot, "i18n.js");
  assert.doesNotMatch(pageI18n, /MARHAMAT_SAMPLE_INVITATION|sample-photos|gallery\.length/);
  const context = { window: { MARHAMAT_I18N: {} } };
  runInNewContext(pageI18n, context);
  const translations = context.window.MARHAMAT_I18N as Record<string, string[]>;
  for (const key of [
    "Qafas eshigini oching", "Baxtli tong", "To‘y dasturi", "Dress-kod",
    "Lahzalar", "Tashrifingizni tasdiqlang", "Tilak yuborish", "To‘yona",
    "Bog‘lanish uchun", "Bulbul · Taklifnoma",
  ]) {
    assert.equal(translations[key]?.length, 2, `missing Russian/English copy for: ${key}`);
  }
  const appHead = packagedHtml.match(/<head>[\s\S]*?<\/head>/)?.[0] ?? "";
  assert.doesNotMatch(appHead, /fonts\.googleapis|fonts\.gstatic|sample-invitation|sample-overrides|analytics/);
});
