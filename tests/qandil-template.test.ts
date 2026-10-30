import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
  hasAuthoredInvitationContent,
} from "../apps/web/src/modules/catalog/preview-sample";

const templateRoot = new URL(
  "../apps/web/public/templates/qandil/",
  import.meta.url,
);
const fixturePath = new URL(
  "../apps/web/src/modules/catalog/preview-sample.json",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/qandil/",
  import.meta.url,
);

test("Qandil retains the captured page, source scripts, style, and illustration assets", () => {
  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  const capturedHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const body = (value: string) =>
    (value.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "")
      .replace(/\r\n/g, "\n")
      .trim();
  assert.equal(body(html), body(capturedHtml));

  for (const file of [
    "template.css",
    "template.js",
    "lantern.js",
    "lightfield.js",
    "meta.js",
    "i18n.js",
  ]) {
    assert.equal(
      readFileSync(new URL(file, templateRoot), "utf8").replace(/\r\n/g, "\n"),
      readFileSync(new URL(file, captureRoot), "utf8").replace(/\r\n/g, "\n"),
      `${file} must remain an exact source copy`,
    );
  }
  const capturedArt = readdirSync(new URL("art/", captureRoot));
  for (const file of capturedArt) {
    assert.deepEqual(
      readFileSync(new URL(`art/${file}`, templateRoot)),
      readFileSync(new URL(`art/${file}`, captureRoot)),
      `art/${file} must remain an exact source copy`,
    );
  }
  assert.ok(capturedArt.includes("skyline-far.webp"));
  assert.ok(capturedArt.includes("skyline-near.webp"));
  assert.match(
    readFileSync(new URL("template.css", templateRoot), "utf8"),
    /prefers-reduced-motion/,
  );
  assert.match(
    readFileSync(new URL("template.js", templateRoot), "utf8"),
    /reducedMotion/,
  );
});

test("Qandil runs without capture sample data or external font requests", () => {
  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  assert.doesNotMatch(
    html,
    /sample-invitation\.js|fonts\.googleapis\.com|fonts\.gstatic\.com/,
  );
  assert.match(html, /shared\/nikoh\/platform-bridge\.js/);
  assert.match(html, /shared\/nikoh\/core\.js/);
  assert.match(html, /href="fonts\.css"/);
  assert.match(html, /href="platform\.css"/);

  const root = fileURLToPath(templateRoot);
  const localHtmlRefs = Array.from(
    html.matchAll(/(?:src|href)="([^"]+)"/g),
    (match) => match[1],
  ).filter((ref) => !/^https?:/i.test(ref) && !ref.startsWith("#"));
  const cssRefs = ["template.css", "fonts.css"].flatMap((file) =>
    Array.from(
      readFileSync(new URL(file, templateRoot), "utf8").matchAll(
        /url\(["']?([^"')]+)["']?\)/g,
      ),
      (match) => match[1],
    ),
  );
  for (const ref of [...localHtmlRefs, ...cssRefs].filter(
    (value) => !value.startsWith("#"),
  )) {
    assert.ok(
      existsSync(path.resolve(root, ref)),
      `local resource ${ref} must exist`,
    );
  }
  const fonts = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  assert.match(fonts, /font-family:\s*'Cormorant Garamond'/);
  assert.match(fonts, /font-family:\s*'Great Vibes'/);
  assert.ok(
    existsSync(new URL("preview.webp", templateRoot)),
    "source-rendered opening preview must be packaged",
  );
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.equal(preview.toString("ascii", 12, 16), "VP8 ");
  const width = (preview[26] | (preview[27] << 8)) & 0x3fff;
  const height = (preview[28] | (preview[29] << 8)) & 0x3fff;
  assert.deepEqual(
    [width, height],
    [300, 600],
    "the captured source opening must retain its complete portrait render",
  );
});

test("Qandil catalog artwork has source-render provenance checksums", () => {
  const provenance = JSON.parse(
    readFileSync(new URL("preview.provenance.json", templateRoot), "utf8"),
  ) as {
    artifact: string;
    artifactSha256: string;
    sourceCapture: string;
    renderedFrom: string;
    locale: string;
    viewport: { width: number; height: number; deviceScaleFactor: number };
    artifactSize: { width: number; height: number };
    referenceCapture: string;
    verified: string;
  };
  const digest = (value: Buffer) =>
    createHash("sha256").update(value).digest("hex");
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  assert.equal(provenance.artifact, "preview.webp");
  assert.match(
    readFileSync(new URL("meta.js", templateRoot), "utf8"),
    /preview:\s*"preview\.webp"/,
  );
  assert.equal(provenance.artifactSha256, digest(preview));
  assert.equal(
    provenance.sourceCapture,
    "Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/qandil",
  );
  assert.equal(
    provenance.renderedFrom,
    "Original Qandil source index.html, initial #intro opening state rendered at 478x955 and resized to 300x600",
  );
  assert.equal(
    provenance.referenceCapture,
    "Original source template rendered directly from index.html; no user-provided screenshot used",
  );
  assert.equal(provenance.locale, "uz-Latn");
  assert.deepEqual(provenance.viewport, {
    width: 478,
    height: 955,
    deviceScaleFactor: 1,
  });
  assert.deepEqual(provenance.artifactSize, { width: 300, height: 600 });
  assert.match(provenance.verified, /captured the source initial dark-room opening/i);

  for (const art of ["art/skyline-far.webp", "art/skyline-near.webp"]) {
    assert.notEqual(
      digest(preview),
      digest(readFileSync(new URL(art, templateRoot))),
      "catalog preview is a rendered opening, not a raw scene crop",
    );
  }
});

test("Qandil static copy localizes and its typed wrapper fixes the source template ID", () => {
  const dictionaryWindow: { MARHAMAT_I18N?: Record<string, [string, string]> } =
    {};
  runInNewContext(
    readFileSync(
      new URL(
        "../apps/web/public/templates/shared/nikoh/i18n.js",
        import.meta.url,
      ),
      "utf8",
    ),
    { window: dictionaryWindow },
  );
  runInNewContext(readFileSync(new URL("i18n.js", templateRoot), "utf8"), {
    window: dictionaryWindow,
  });
  runInNewContext(
    readFileSync(new URL("platform-i18n.js", templateRoot), "utf8"),
    {
      window: dictionaryWindow,
      location: { search: "?lang=uz-Latn" },
      document: { title: "Qandil" },
      URLSearchParams,
    },
  );
  const dictionary = dictionaryWindow.MARHAMAT_I18N;
  assert.ok(dictionary);

  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  const body = html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const text = Array.from(body.matchAll(/>([^<>]+)</g), (match) =>
    match[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim(),
  ).filter(
    (value) => value.length > 1 && !/^&+$/.test(value) && !/^\d+$/.test(value),
  );
  const labels = Array.from(
    body.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].trim(),
  );
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ?? "";
  const description =
    html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
  assert.deepEqual(
    [...text, ...labels, title, description].filter(
      (value) => !dictionary[value],
    ),
    [],
  );
  assert.deepEqual(
    [...dictionary[title]],
    ["Кандиль", "Qandil"],
  );
  assert.deepEqual(
    [...dictionary[description]],
    [
      "Кандиль — цифровое приглашение ",
      "Qandil — a digital invitation by ",
    ],
  );
  assert.match(
    readFileSync(new URL("platform.css", templateRoot), "utf8"),
    /#toyona \.gift__note:empty\s*\{\s*display:\s*none;/,
  );
  assert.match(
    readFileSync(new URL("platform.css", templateRoot), "utf8"),
    /#toyona \.gift__bank:empty\s*\{\s*display:\s*none;/,
    "unsupported empty bank-name slot must not leave a blank line on the gift card",
  );
  assert.match(
    readFileSync(new URL("platform.css", templateRoot), "utf8"),
    /html\s*,\s*body\s*\{\s*overflow-x:\s*clip;/,
    "the fixed decorative backdrop must not create horizontal page overflow",
  );
  const sharedRuntime = readFileSync(
    new URL("../shared/nikoh/core.js", templateRoot),
    "utf8",
  );
  assert.match(
    sharedRuntime,
    /controlRegion=track\.closest\('\[data-section="gallery"\]'\)\|\|region/,
    "gallery arrows outside the scroll track must bind from their containing section",
  );

  const cyrillicDocument = { title };
  runInNewContext(
    readFileSync(new URL("platform-i18n.js", templateRoot), "utf8"),
    {
      window: dictionaryWindow,
      location: { search: "?lang=uz-Cyrl" },
      document: cyrillicDocument,
      URLSearchParams,
    },
  );
  assert.equal(cyrillicDocument.title, "Мархаба · Қандил");

  const renderer = readFileSync(
    new URL("../apps/web/src/templates/qandil/renderer.tsx", import.meta.url),
    "utf8",
  );
  const barrel = readFileSync(
    new URL("../apps/web/src/templates/qandil/index.ts", import.meta.url),
    "utf8",
  );
  assert.match(
    renderer,
    /import type \{ Invitation, Locale \} from "@taklifnoma\/contracts"/,
  );
  assert.match(
    renderer,
    /<MarxabaInvitation \{\.\.\.props\} templateId="qandil" \/>/,
  );
  assert.match(barrel, /export \{ QandilInvitation \} from "\.\/renderer"/);
});

test("Qandil uses the shared four-locale preview data for all supported sections", () => {
  const sample = createTemplatePreviewSample("qandil");
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;

  assert.deepEqual(sample.enabledLocales, [...locales]);
  assert.equal(sample.content["uz-Latn"].people[0], "Javohir");
  for (const locale of locales) {
    const content = sample.content[locale];
    assert.ok(content.people[0]);
    assert.ok(content.people[1]);
    assert.ok(content.greeting);
    assert.ok(content.message);
    assert.ok(content.venueName);
    assert.ok(content.address);
    assert.ok(content.programHeading);
    assert.ok(
      sample.program.every((item) => content.programTitles[item.id]),
      `${locale} must have a title for every program item`,
    );
    assert.ok(
      sample.dressCode.style[locale] &&
        sample.dressCode.text[locale] &&
        sample.dressCode.note[locale] &&
        sample.dressCode.colors.every((color) => color.name[locale]),
      `${locale} must have localized dress-code copy and palette`,
    );
    assert.equal(getTemplatePreviewWishes(locale).length, 3);
  }

  assert.equal(sample.program.length, 6);
  assert.deepEqual(
    sample.gallery.map((item) => item.id),
    [
      "sample-memory-1",
      "sample-memory-2",
      "sample-memory-3",
      "sample-memory-4",
      "sample-memory-5",
      "sample-memory-6",
    ],
  );
  assert.ok(sample.gallery.every((item) => !item.url));
  assert.equal(sample.gift.enabled, true);
  assert.ok(sample.gift.cardNumber);
  assert.ok(sample.gift.cardHolder);
  assert.deepEqual(sample.contacts, {
    phoneNumber: "+998 90 123 45 67",
    telegramUsername: "@demo",
    instagramUrl: "",
  });

  const blank = createInvitation("qandil");
  assert.equal(hasAuthoredInvitationContent(blank), false);
  assert.deepEqual(blank.content["uz-Latn"].people, []);
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.gift.cardNumber, "");
  assert.deepEqual(blank.contacts, {
    phoneNumber: "",
    telegramUsername: "",
    instagramUrl: "",
  });

  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  for (const list of [
    "program",
    "gallery",
    "dresscode",
    "wishes",
    "contacts",
  ]) {
    assert.match(html, new RegExp(`data-list="${list}"`));
  }
  for (const section of [
    "program",
    "gallery",
    "dresscode",
    "wishes",
    "toyona",
    "contacts",
  ]) {
    assert.match(html, new RegExp(`data-section="${section}"`));
  }
  assert.match(html, /data-slot="toyona\.cardNumber"/);
  assert.match(html, /data-slot="toyona\.cardHolder"/);
  assert.match(html, /data-slot="toyona\.note"/);
  assert.match(html, /data-slot="toyona\.bank"/);
});

test("Qandil styles the shared generated calendar as a spaced seven-column calendar", () => {
  const css = readFileSync(new URL("platform.css", templateRoot), "utf8");
  assert.match(css, /\.calendar-top\s*\{[^}]*display:\s*flex;[^}]*gap:\s*7px;/s);
  assert.match(css, /\.calendar-weekdays,\s*\.calendar-days\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(7,\s*minmax\(0,\s*1fr\)\);/s);
  assert.match(css, /\.calendar-day\.is-event\s*\{[^}]*border-radius:\s*50%;[^}]*background:\s*var\(--amber\);/s);
  assert.match(
    readFileSync(new URL("../shared/nikoh/core.js", templateRoot), "utf8"),
    /calendar-weekdays.*calendar-days/,
    "the shared bridge calendar markup must use the classes styled above",
  );
});

test("Qandil hides its venue-photo frame without a creator photo or working map", () => {
  const css = readFileSync(new URL("platform.css", templateRoot), "utf8");
  assert.match(
    css,
    /#venue\s+\.venue__photo\.has-missing-photo\s*,\s*#venue\s+\.venue__photo:has\(img\.is-map\):not\(\.has-venue-map\)\s*\{\s*display:\s*none;/,
    "the source placeholder should not appear when venue coordinates or photo are missing",
  );
});

test("Qandil refits its captured SVG names when the platform payload arrives after source initialization", () => {
  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  const sourceScript = html.indexOf('src="template.js"');
  const adapterScript = html.indexOf('src="platform-names.js"');
  assert.ok(adapterScript >= 0 && adapterScript < sourceScript);

  const adapter = readFileSync(new URL("platform-names.js", templateRoot), "utf8");
  assert.match(adapter, /new MutationObserver\(scheduleFit\)/);
  assert.match(adapter, /document\.fonts\.load/);
  assert.match(adapter, /name\.getBBox\(\)\.width/);
  assert.match(adapter, /width > 330/);
  assert.match(adapter, /setAttribute\("textLength", "330"\)/);
  assert.match(adapter, /setAttribute\("lengthAdjust", "spacingAndGlyphs"\)/);
});

test("Qandil is registered as published with matching event support", () => {
  const registry = readFileSync(new URL("../packages/contracts/src/index.ts", import.meta.url), "utf8");
  const registration = registry.match(/id: "qandil",[\s\S]*?published: (true|false),/);
  assert.equal(registration?.[1], "true");
  const migration = readFileSync(new URL("../packages/database/migrations/0049_publish_qandil.sql", import.meta.url), "utf8");
  assert.match(migration, /VALUES \('qandil', 'Qandil', 15000000, 'UZS', true\)/);
  assert.match(migration, /'qandil', 'fotiha'/);
  assert.match(migration, /'qandil', 'qiz-uzatish'/);
  assert.match(migration, /VALUES \('qandil', 'wedding'\)/);
});
