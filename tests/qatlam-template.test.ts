import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync } from "node:fs";
import { readFileSync } from "./helpers/source-files";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

const root = process.cwd();
const source = path.join(root, "Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/qatlam");
const pkg = path.join(root, "apps/web/public/templates/qatlam");
const renderer = path.join(root, "apps/web/src/templates/qatlam");
const read = (base: string, name: string) => readFileSync(path.join(base, name), "utf8");
const normalize = (source: string) => source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const body = (html: string) => normalize(html.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim() ?? "");

test("Qatlam has an isolated typed renderer entry", () => {
  assert.match(read(renderer, "renderer.tsx"), /templateId="qatlam"/);
  assert.match(read(renderer, "index.ts"), /QatlamInvitation/);
});

test("Qatlam keeps the full captured body, source scripts, styles, metadata, and art", () => {
  assert.equal(body(read(pkg, "index.html")), body(read(source, "index.html")));
  for (const name of ["template.css", "template.js", "i18n.js", "meta.js"])
    assert.equal(normalize(read(pkg, name)), normalize(read(source, name)));
  const sourceArt = readdirSync(path.join(source, "art")).sort();
  assert.deepEqual(readdirSync(path.join(pkg, "art")).sort(), sourceArt);
  for (const name of sourceArt)
    assert.deepEqual(readFileSync(path.join(pkg, "art", name)), readFileSync(path.join(source, "art", name)));
  assert.match(read(pkg, "template.js"), /M\.reducedMotion/);
  assert.match(read(pkg, "template.css"), /prefers-reduced-motion/);
});

test("Qatlam exposes the invitation content and interactions in the captured markup", () => {
  const html = read(pkg, "index.html");
  for (const selector of [
    'data-slot="groom"', 'data-slot="bride"', 'data-slot="greeting"',
    'data-slot="eventType"', 'data-slot="date.long"', 'data-slot="message"',
    'data-slot="hosts"', 'data-list="program"', 'data-slot="venue.name"',
    'data-slot="venue.address"', 'data-dresscode', 'data-list="gallery"',
    'data-rsvp', 'data-list="wishes"', 'data-section="toyona"',
    'data-slot="toyona.cardNumber"', 'data-slot="toyona.cardHolder"',
    'data-list="contacts"', 'data-music', 'data-ics', 'data-countdown',
  ]) assert.ok(html.includes(selector), `missing captured content hook ${selector}`);
});

test("Qatlam uses local source fonts and shared runtime without source demo data", () => {
  const html = read(pkg, "index.html");
  const head = html.match(/<head>[\s\S]*?<\/head>/)?.[0] ?? "";
  const fonts = `${read(pkg, "fonts.css")}\n${read(pkg, "fonts-600.css")}`;
  assert.match(fonts, /font-family: 'Great Vibes'/);
  assert.match(fonts, /font-family:Lora/);
  assert.match(fonts, /font-weight: 600/);
  assert.doesNotMatch(head, /fonts\.googleapis|fonts\.gstatic|sample-invitation|analytics/);
  for (const match of fonts.matchAll(/url\(["']?([^)'"\s]+\.woff2)/g))
    assert.ok(readFileSync(path.join(pkg, match[1])).byteLength > 0, `missing ${match[1]}`);
  assert.match(read(pkg, "SOURCE_ADAPTATIONS.md"), /venue\.photo/);
  assert.match(read(pkg, "SOURCE_ADAPTATIONS.md"), /toyona\.bank/);
  assert.match(read(pkg, "SOURCE_ADAPTATIONS.md"), /toyona\.note/);
  assert.match(read(pkg, "SOURCE_ADAPTATIONS.md"), /preview\.webp/);
  assert.match(read(pkg, "locale-copy.js"), /Qatlam · Invitation/);
});

test("Qatlam static copy and page metadata have Uzbek, Russian, and English translations", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(readFileSync(path.join(root, "apps/web/public/templates/shared/nikoh/i18n.js"), "utf8"), { window });
  runInNewContext(read(pkg, "i18n.js"), { window });
  runInNewContext(read(pkg, "locale-copy.js"), { window });
  const dictionary = window.MARHAMAT_I18N;
  assert.ok(dictionary);

  const html = read(pkg, "index.html");
  const bodyHtml = html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const visibleText = Array.from(bodyHtml.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter((value) => value.length > 1 && !/^&+$/.test(value) && !/^\d+$/.test(value));
  const accessibleText = Array.from(bodyHtml.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g), (match) => match[1].trim());
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ?? "";
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
  const socialDescription = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1] ?? "";
  assert.deepEqual(
    [...visibleText, ...accessibleText, title, description, socialDescription].filter((value) => !dictionary[value]),
    [],
    "every static text node, accessible label, and page title/description needs a translation",
  );
  assert.deepEqual(Array.from(dictionary[title] ?? []), ["Qatlam · Приглашение", "Qatlam · Invitation"]);
  assert.deepEqual(Array.from(dictionary[socialDescription] ?? []), [
    "Позолоченная книга-поп-ап с бумажной диорамой Самарканда.",
    "A gilded pop-up book with a paper Samarkand diorama.",
  ]);
});

test("Qatlam's packaged HTML and styles reference existing local assets", () => {
  const html = read(pkg, "index.html");
  const references = [
    ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]),
    ...Array.from(`${read(pkg, "template.css")}\n${read(pkg, "fonts.css")}\n${read(pkg, "fonts-600.css")}`.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g), (match) => match[1]),
  ].filter((reference) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(reference));
  for (const reference of references) {
    const cleanPath = reference.split(/[?#]/, 1)[0];
    assert.ok(readFileSync(path.resolve(pkg, cleanPath)).byteLength > 0, `missing packaged asset ${reference}`);
  }
});

test("Qatlam catalog preview is a portrait source-opening capture of the canonical fixture", () => {
  const previewPath = path.join(pkg, "preview.webp");
  const preview = readFileSync(previewPath);
  const provenance = JSON.parse(read(pkg, "preview.provenance.json")) as {
    format: string;
    width: number;
    height: number;
    sourcePage: string;
    sourceOpening: string;
    fixture: string;
    fixtureLocale: string;
    fixtureNames: string[];
    captureViewport: { width: number; height: number; deviceScaleFactor: number };
    sha256: string;
  };
  const fixture = JSON.parse(read(path.join(root, "apps/web/src/modules/catalog"), "preview-sample.json"));

  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  const chunk = preview.toString("ascii", 12, 16);
  assert.equal(chunk, "VP8 ");
  assert.deepEqual(
    [preview.readUInt16LE(26) & 0x3fff, preview.readUInt16LE(28) & 0x3fff],
    [720, 1280],
  );
  assert.equal(provenance.format, "image/webp");
  assert.equal(provenance.width, 720);
  assert.equal(provenance.height, 1280);
  assert.deepEqual(provenance.captureViewport, { width: 720, height: 1280, deviceScaleFactor: 1 });
  assert.equal(provenance.sourcePage, "/templates/qatlam/index.html?lang=uz");
  assert.equal(provenance.sourceOpening, "closed pop-up invitation cover");
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.fixtureLocale, fixture.defaultLocale);
  assert.deepEqual(provenance.fixtureNames, fixture.content[fixture.defaultLocale].people);
  assert.equal(
    provenance.sha256,
    createHash("sha256").update(preview).digest("hex"),
    "preview bytes must match the recorded rendered capture",
  );
  assert.ok(readFileSync(path.join(pkg, "art/cover.webp")).length > 0, "capture must retain source cover art");
});
import assert from "node:assert/strict";
