import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createInvitation, type Locale } from "@taklifnoma/contracts";
import { createTemplatePreviewSample, getTemplatePreviewWishes } from "../apps/web/src/modules/catalog/preview-sample";

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

const templateRoot = new URL(
  "../apps/web/public/templates/orik-guli/",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/orik-guli/",
  import.meta.url,
);
const sharedRoot = new URL(
  "../apps/web/public/templates/shared/nikoh/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");

test("O‘rik Guli localizes its visible copy and page metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(readFileSync(new URL("i18n.js", sharedRoot), "utf8"), {
    window,
  });
  runInNewContext(readFileSync(new URL("i18n.js", templateRoot), "utf8"), {
    window,
  });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const textNodes = Array.from(html.matchAll(/>([^<>]+)</g), (match) =>
    match[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim(),
  ).filter(
    (text) =>
      text.length > 1 &&
      !["&"].includes(text) &&
      !/^№?\s*[\d /·—-]+$/.test(text),
  );
  const attributes = Array.from(
    html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  const metadata = [
    ...Array.from(html.matchAll(/<title>([^<]*)<\/title>/g), (match) =>
      match[1].trim(),
    ),
    ...Array.from(
      html.matchAll(/<meta\s+name="description"\s+content="([^"]+)"/g),
      (match) => match[1].trim(),
    ),
  ];
  const missing = [...textNodes, ...attributes, ...metadata].filter(
    (text) => !translations[text],
  );
  assert.deepEqual(missing, []);
  assert.ok(translations["O‘rik Guli · Marxaba taklifnomasi"]);
  assert.ok(translations["O‘rik Guli — Marxaba raqamli taklifnomasi"]);
});

test("O‘rik Guli retains the captured page, animation code, and original art", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const sourceHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const body = (source: string) =>
    source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  for (const marker of [
    'id="intro"',
    'id="hero"',
    'id="dresscode"',
    'id="wishes"',
    'id="toyona"',
    'id="gallery"',
    'id="contacts"',
    'data-slot="groom"',
    'data-slot="bride"',
    'data-slot="greeting"',
    'data-slot="eventType"',
    'data-slot="date.day"',
    'data-slot="date.month"',
    'data-slot="date.year"',
    'data-slot="date.weekday"',
    'data-slot="date.time"',
    'data-slot="message"',
    'data-slot="hosts"',
    'data-slot="venue.name"',
    'data-slot="venue.address"',
    'data-slot="dressCode.style"',
    'data-slot="dressCode.text"',
    'data-slot="dressCode.note"',
    'data-slot="toyona.note"',
    'data-slot="toyona.cardNumber"',
    'data-slot="toyona.cardHolder"',
    'data-list="wishes"',
    'data-list="program"',
    'data-list="gallery"',
    'data-list="dresscode"',
    'data-list="contacts"',
    'data-rsvp-choice="yes"',
    'data-rsvp-choice="maybe"',
    'data-rsvp-choice="no"',
    "data-rsvp",
  ]) {
    assert.ok(
      body(html).includes(marker),
      `${marker} is missing from the packaged page`,
    );
    assert.ok(
      body(sourceHtml).includes(marker),
      `${marker} is missing from the capture`,
    );
  }
  for (const file of ["template.js", "meta.js", "fx.js", "fog.js"]) {
    assert.equal(
      normalize(readFileSync(new URL(file, templateRoot), "utf8")),
      normalize(readFileSync(new URL(file, captureRoot), "utf8")),
      `${file} should match the captured source`,
    );
  }
  const sourceCss = normalize(
    readFileSync(new URL("template.css", captureRoot), "utf8"),
  );
  const packagedCss = normalize(
    readFileSync(new URL("template.css", templateRoot), "utf8"),
  );
  const reducedMotionAdaptation = `
/* Platform adaptation: the captured page leaves several decorative transitions
   active under reduced motion. Preserve state changes while removing movement. */
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}
}
`;
  const emptyGiftSlotAdaptation =
    "\n/* Platform adaptation: omit source slots unsupported or left blank by the shared gift contract. */\n.toyona__note:empty,.gift__bank:empty{display:none}";
  assert.equal(
    packagedCss
      .replace(reducedMotionAdaptation, "")
      .replace(emptyGiftSlotAdaptation, ""),
    sourceCss,
  );
  assert.match(packagedCss, /prefers-reduced-motion:reduce/);
  const sourceI18nWindow: { MARHAMAT_I18N?: Record<string, [string, string]> } =
    {};
  const packagedI18nWindow: {
    MARHAMAT_I18N?: Record<string, [string, string]>;
  } = {};
  runInNewContext(readFileSync(new URL("i18n.js", captureRoot), "utf8"), {
    window: sourceI18nWindow,
  });
  runInNewContext(readFileSync(new URL("i18n.js", templateRoot), "utf8"), {
    window: packagedI18nWindow,
  });
  for (const [key, value] of Object.entries(
    sourceI18nWindow.MARHAMAT_I18N ?? {},
  )) {
    assert.equal(
      JSON.stringify(packagedI18nWindow.MARHAMAT_I18N?.[key]),
      JSON.stringify(value),
      `${key} translation changed`,
    );
  }
  const sourceScript = normalize(
    readFileSync(new URL("template.js", captureRoot), "utf8"),
  );
  const packagedScript = normalize(
    readFileSync(new URL("template.js", templateRoot), "utf8"),
  );
  assert.ok(sourceScript.includes("const reduced = app.reducedMotion"));
  assert.ok(packagedScript.includes("const reduced = app.reducedMotion"));
  assert.ok(packagedScript.includes("data.toyona?.enabled === false"));
  assert.ok(!packagedScript.includes("Javohir"));
  assert.ok(!packagedScript.includes("Madina"));

  const sourceBody = body(sourceHtml);
  const packagedBody = body(html);
  assert.equal(normalize(packagedBody), normalize(sourceBody));
  assert.ok(!html.includes("fonts.googleapis.com"));
  assert.ok(html.includes("platform-bridge.js"));
  const sharedCore = readFileSync(new URL("core.js", sharedRoot), "utf8");
  assert.match(sharedCore, /hideIf\('gallery',[\s\S]*?&&!data\.preview\)/);
  assert.match(sharedCore, /image\.setAttribute\('aria-hidden','true'\)/);
  assert.match(sharedCore, /placeholder\.textContent='✦'/);

  for (const asset of [
    "preview.webp",
    "art/view-0.webp",
    "art/view-1.webp",
    "art/view-2.webp",
    "art/view-3.webp",
    "art/window.webp",
    "art/hero-sky.webp",
    "art/hero-branches.webp",
    "art/finale.webp",
    "art/petals.webp",
    "art/wreath.webp",
  ]) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
    assert.deepEqual(
      readFileSync(
        new URL(
          asset.startsWith("preview.") ? `art/view-0.webp` : asset,
          templateRoot,
        ),
      ),
      readFileSync(
        new URL(
          asset.startsWith("preview.") ? `art/view-0.webp` : asset,
          captureRoot,
        ),
      ),
      `${asset} must preserve the exact captured bytes`,
    );
  }
  const fontCss = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  for (const [, asset] of fontCss.matchAll(
    /url\(["']?([^"')]+\.ttf)["']?\)/g,
  )) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
  for (const [, asset] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:#|https?:|mailto:|tel:|data:|javascript:)/i.test(asset)) continue;
    assert.ok(
      existsSync(new URL(asset, templateRoot)),
      `HTML asset path ${asset} is broken`,
    );
  }
});

test("O‘rik Guli routes through the shared typed Marxaba invitation renderer", () => {
  const marxabaIndex = readFileSync(
    new URL("../apps/web/src/templates/marxaba/index.ts", import.meta.url),
    "utf8",
  );
  const adapter = readFileSync(
    new URL(
      "../apps/web/src/templates/orik-guli/renderer.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(marxabaIndex, /"orik-guli"/);
  assert.match(
    adapter,
    /import type \{ Invitation, Locale \} from "@taklifnoma\/contracts"/,
  );
  assert.match(
    adapter,
    /<MarxabaInvitation \{\.\.\.props\} templateId="orik-guli" \/>/,
  );
});

test("O‘rik Guli maps the shared four-locale preview content to all invitation sections", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("orik-guli");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];

  for (const locale of locales) {
    const content = sample.content[locale];
    const data = makeLegacyData(sample, locale, "", true);
    assert.equal(data.groom, content.people[0], `${locale}: groom`);
    assert.equal(data.bride, content.people[1], `${locale}: bride`);
    assert.equal(data.greeting, content.greeting, `${locale}: greeting`);
    assert.equal(data.message, content.message, `${locale}: message`);
    assert.equal(data.eventType, content.eventLabel, `${locale}: event label`);
    assert.equal(data.hosts, content.hosts, `${locale}: hosts`);
    assert.equal(data.date.day, 12, `${locale}: date`);
    assert.equal(data.date.time, "17:00", `${locale}: time`);
    assert.equal(data.venue.name, content.venueName, `${locale}: venue`);
    assert.equal(
      data.venue.address,
      `${content.address} · ${content.landmark}`,
      `${locale}: venue address and landmark`,
    );

    assert.equal(data.program.length, 6, `${locale}: six program entries`);
    assert.deepEqual(data.program.map((item) => item.id), Object.keys(content.programTitles));
    assert.deepEqual(data.program.map((item) => item.title), Object.values(content.programTitles));
    assert.equal(data.gallery.length, 6, `${locale}: six gallery placeholders`);
    assert.ok(data.gallery.every((item) => item.src === "" && item.alt === ""));
    assert.equal(data.dressCode.enabled, true, `${locale}: dress code enabled`);
    assert.equal(data.dressCode.style, sample.dressCode.style[locale]);
    assert.equal(data.dressCode.text, sample.dressCode.text[locale]);
    assert.equal(data.dressCode.note, sample.dressCode.note[locale]);
    assert.deepEqual(
      data.dressCode.colors.map((color) => [color.name, color.hex]),
      sample.dressCode.colors.map((color) => [color.name[locale], color.hex]),
    );
    assert.deepEqual(data.wishes, getTemplatePreviewWishes(locale));
    assert.equal(data.wishes.length, 3, `${locale}: three sample wishes`);
    assert.equal(data.rsvp.enabled, true, `${locale}: RSVP enabled`);
    assert.equal(data.toyona.enabled, true, `${locale}: To‘yona enabled`);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.deepEqual(data.contacts.map((item) => item.value), [
      "+998 90 123 45 67",
      "@demo",
    ]);
  }

  const blank = makeLegacyData(createInvitation("orik-guli"), "uz-Latn", "", false);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.contacts.length, 0);
});
