import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { createInvitation, templateById } from "@taklifnoma/contracts";
import { createTemplatePreviewSample, getTemplatePreviewWishes, hasAuthoredInvitationContent } from "../apps/web/src/modules/catalog/preview-sample";
import type { Locale } from "@taklifnoma/contracts";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => {
  module.exports = {};
};
const moduleRuntime = require("node:module") as {
  _resolveFilename: (...args: any[]) => string;
};
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/")
    ? path.resolve(webSourceRoot, request.slice(2))
    : request;
  return resolveFilename.call(this, resolved, ...args);
};

const packageRoot = new URL(
  "../apps/web/public/templates/oltin-kuz/",
  import.meta.url,
);
const sourceRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Tug'ilgan kun va Yubiley/templates/oltin-kuz/",
  import.meta.url,
);
const read = (root: URL, path: string) =>
  readFileSync(new URL(path, root), "utf8");
const sha256 = (root: URL, path: string) =>
  createHash("sha256")
    .update(readFileSync(new URL(path, root)))
    .digest("hex");

test("Oltin Kuz keeps the captured invitation body, styles, motion, and artwork", () => {
  const sourceHtml = read(sourceRoot, "index.html");
  const appHtml = read(packageRoot, "index.html");
  const sourceBody = sourceHtml.match(/<body>[\s\S]*?<\/body>/)?.[0];
  const appBody = appHtml.match(/<body>[\s\S]*?<\/body>/)?.[0];

  assert.ok(sourceBody, "captured source body exists");
  assert.equal(appBody, sourceBody, "only the app shell head is adapted");
  for (const path of ["template.css", "template.js", "meta.js"]) {
    assert.deepEqual(
      readFileSync(new URL(path, packageRoot)),
      readFileSync(new URL(path, sourceRoot)),
      `${path} remains byte-for-byte identical to the capture`,
    );
  }

  for (const path of [
    "art/chinar.webp",
    "art/venue.svg",
    "art/memory-01.svg",
    "art/memory-02.svg",
    "art/memory-03.svg",
    "art/memory-04.svg",
    "art/memory-05.svg",
    "fonts.css",
    "fonts/291655adcb38b6b495db.woff2",
    "fonts/d9ec821052ff94a77023.woff2",
  ]) {
    assert.ok(existsSync(new URL(path, packageRoot)), `${path} is packaged`);
  }
});

test("Oltin Kuz uses only local runtime/font assets and keeps sample data out", () => {
  const html = read(packageRoot, "index.html");
  const i18n = read(packageRoot, "i18n.js");
  const notes = read(packageRoot, "SOURCE_ADAPTATIONS.md");
  const metadata = JSON.parse(read(packageRoot, "preview.provenance.json")) as {
    fixture: string;
    locale: string;
    fixtureNames: string[];
    sourceOpening: string;
    sourceIndexSha256: string;
    sourceStyleSha256: string;
    previewSha256: string;
    viewport: { width: number; height: number };
  };
  const preview = readFileSync(new URL("preview.webp", packageRoot));

  assert.match(html, /\.\.\/shared\/nikoh\/platform-bridge\.js/);
  assert.match(html, /\.\.\/shared\/nikoh\/core\.js/);
  assert.match(html, /href="fonts\.css"/);
  assert.doesNotMatch(
    html,
    /fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/,
  );
  assert.doesNotMatch(
    i18n,
    /Hamida opa|Zarafshon oilaviy restorani|70 yoshlik yubileyi/,
  );
  assert.ok(!existsSync(new URL("sample-overrides.js", packageRoot)));
  assert.match(read(packageRoot, "template.js"), /prefers-reduced-motion/);
  assert.match(read(packageRoot, "template.css"), /prefers-reduced-motion/);
  assert.match(notes, /extras\.age/);
  assert.match(notes, /venue\.photo/);
  assert.match(notes, /toyona\.bank/);
  assert.equal(
    metadata.fixture,
    "apps/web/src/modules/catalog/preview-sample.json (birthday event sample)",
  );
  assert.equal(metadata.locale, "uz-Latn");
  assert.deepEqual(metadata.fixtureNames, ["Javohir"]);
  assert.match(metadata.sourceOpening, /birthday invitation opening.*chinar artwork/i);
  assert.equal(metadata.viewport.width, 480);
  assert.ok(metadata.viewport.height > metadata.viewport.width);
  assert.equal(metadata.sourceIndexSha256, sha256(sourceRoot, "index.html"));
  assert.equal(metadata.sourceStyleSha256, sha256(sourceRoot, "template.css"));
  assert.equal(
    metadata.previewSha256,
    createHash("sha256").update(preview).digest("hex"),
    "catalog opening capture remains the verified artifact",
  );
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.ok(preview.byteLength > 20_000);
});

test("Oltin Kuz entry point delegates data and API behavior to the shared adapter", () => {
  const wrapper = readFileSync(
    new URL("../apps/web/src/templates/marxaba/oltin-kuz.tsx", import.meta.url),
    "utf8",
  );
  const sharedRenderer = readFileSync(
    new URL("../apps/web/src/templates/marxaba/renderer.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    wrapper,
    /<MarxabaInvitation \{\.\.\.props\} templateId="oltin-kuz" \/>/,
  );
  assert.match(
    sharedRenderer,
    /extras: \{ celebrant: sourceData\.groom \|\| sourceData\.bride \}/,
  );
});

test("Oltin Kuz maps the shared birthday opening sample through the contract in every locale", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("oltin-kuz");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];

  assert.equal(templateById("oltin-kuz")?.previewEventType, "birthday");
  assert.equal(sample.eventType, "birthday");
  for (const locale of locales) {
    const content = sample.content[locale];
    const data = makeLegacyData(sample, locale, "", true);
    assert.equal(data.groom, content.people[0], `${locale}: celebrant`);
    assert.equal(data.bride, "", `${locale}: source remains one-person`);
    assert.equal(data.eventType, content.eventLabel, `${locale}: event label`);
    assert.equal(data.hosts, content.hosts, `${locale}: family`);
    assert.equal(data.message, content.message, `${locale}: invitation copy`);
    assert.equal(data.date.day, 12, `${locale}: event day`);
    assert.equal(data.date.time, "17:00", `${locale}: event time`);
    assert.equal(data.date.year, 2027, `${locale}: event year`);
    assert.equal(data.venue.name, content.venueName, `${locale}: venue`);
    assert.equal(
      data.venue.address,
      [content.address, content.landmark].filter(Boolean).join(" · "),
      `${locale}: address and landmark`,
    );
    assert.deepEqual(
      data.program.map(({ id, time, title }) => [id, time, title]),
      sample.program.map((item) => [item.id, item.time, content.programTitles[item.id]]),
      `${locale}: stable program IDs and localized order`,
    );
    assert.equal(data.program.length, 6, `${locale}: six program entries`);
    assert.equal(data.dressCode.style, sample.dressCode.style[locale]);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(data.dressCode.note, sample.dressCode.note[locale]);
    assert.deepEqual(
      data.dressCode.colors.map((color) => [color.name, color.hex]),
      sample.dressCode.colors.map((color) => [color.name[locale], color.hex]),
    );
    assert.equal(data.gallery.length, 6, `${locale}: preview gallery entries`);
    assert.ok(data.gallery.every((item) => item.src === "" && item.alt === ""));
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.wishes.length, 3, `${locale}: preview wishes`);
    assert.equal(data.toyona.enabled, true, `${locale}: preview gift`);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.deepEqual(data.contacts.map((item) => item.value), [
      "+998 90 123 45 67",
      "@demo",
    ]);

    const blankData = makeLegacyData(createInvitation("oltin-kuz"), locale, "");
    assert.equal(blankData.groom, "", `${locale}: blank celebrant`);
    assert.equal(blankData.message, "", `${locale}: blank message`);
    assert.equal(blankData.program.length, 0, `${locale}: blank program`);
    assert.equal(blankData.gallery.length, 0, `${locale}: blank gallery`);
    assert.equal(blankData.wishes.length, 0, `${locale}: no preview wishes in drafts`);
    assert.equal(blankData.toyona.cardNumber, "", `${locale}: blank gift`);
    assert.deepEqual(blankData.contacts, [], `${locale}: blank contacts`);
  }
});

test("Oltin Kuz supports both declared events and keeps the preview fixture out of blank drafts", () => {
  const template = templateById("oltin-kuz");
  assert.deepEqual(template?.supportedEventTypes, ["yubiley", "birthday"]);
  const migration = readFileSync(
    new URL("../packages/database/migrations/0042_add_marxaba_birthday_templates.sql", import.meta.url),
    "utf8",
  );
  assert.match(migration, /\('oltin-kuz', 'birthday'\)/);
  assert.match(migration, /\('oltin-kuz', 'yubiley'\)/);

  const blank = createInvitation("oltin-kuz");
  const sample = createTemplatePreviewSample("oltin-kuz");
  assert.equal(hasAuthoredInvitationContent(blank), false);
  assert.deepEqual(blank.content["uz-Latn"].people, []);
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.gift.cardNumber, "");
  assert.deepEqual(blank.contacts, { phoneNumber: "", telegramUsername: "" });
  assert.doesNotMatch(JSON.stringify(blank), /Javohir|Madina|8600 1234|Dilnoza opa/);
  assert.notDeepEqual(blank.content, sample.content);
});

test("Oltin Kuz empty Lahzalar is icon-only with shared wrap navigation and clean gift rows", () => {
  const core = readFileSync(
    new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url),
    "utf8",
  );
  const gallery = core.slice(core.indexOf("function setupGallery()"), core.indexOf("function setupSections()"));
  const html = read(packageRoot, "index.html");
  const adapter = read(packageRoot, "contract-adapter.css");

  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(html, /data-list="gallery"/);
  assert.match(core, /if\(!source\)image\.setAttribute\('aria-hidden','true'\)/);
  assert.match(core, /placeholder\.textContent='✦'/);
  assert.match(gallery, /index=\(number\+state\.items\.length\) % state\.items\.length/);
  assert.match(gallery, /behavior: reducedMotion\?'instant':'smooth'/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.bank"\]:empty/);
  assert.match(adapter, /\.date-card__age:has\([\s\S]*extras\.age[\s\S]*extras\.yearLabel/);
  assert.match(adapter, /\.gallery__year:empty\s*\{\s*display:\s*none/);
});

test("Oltin Kuz static text, metadata, and accessibility copy are translated", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(
    readFileSync(new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url), "utf8"),
    { window },
  );
  runInNewContext(read(packageRoot, "i18n.js"), { window });
  const translations = window.MARHAMAT_I18N!;
  const html = read(packageRoot, "index.html");
  const visible = [
    ...html.matchAll(/>([^<>]+)</g),
    ...html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    ...html.matchAll(/<title>([^<]*)<\/title>/g),
    ...html.matchAll(/<meta\s+name="description"\s+content="([^"]+)"/g),
  ]
    .map((match) =>
      (match[1] ?? "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(
      (value) =>
        value.length > 1 &&
        !["✦", "❧", "↓", "◷", "‹", "›", "00"].includes(value) &&
        !/^№?\s*[\d /·—-]+$/.test(value),
    );
  const missing = [...new Set(visible)].filter((value) => !translations[value]);
  assert.deepEqual(missing, []);
  for (const [key, variants] of Object.entries(translations)) {
    assert.equal(variants.length, 2, `${key} needs Russian and English strings`);
    assert.ok(variants.every((value) => value.trim()), `${key} has no blank locale`);
  }
});
