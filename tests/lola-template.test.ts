import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { createInvitation, type Locale } from "@taklifnoma/contracts";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => {
  module.exports = {};
};
const moduleRuntime = require("node:module") as {
  _resolveFilename: (...args: any[]) => string;
};
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(
  new URL("../apps/web/src/", import.meta.url),
);
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/")
    ? path.resolve(webSourceRoot, request.slice(2))
    : request;
  return resolveFilename.call(this, resolved, ...args);
};

const appRoot = new URL("../apps/web/public/templates/lola/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Qiz uzatish/templates/lola/",
  import.meta.url,
);
const captureManifest = JSON.parse(
  readFileSync(
    new URL(
      "../Invitations - this folder will be removed from production/Marxaba/capture-manifest.json",
      import.meta.url,
    ),
    "utf8",
  ),
) as { resources: Record<string, { file: string; type: string }> };
const sharedRoot = new URL(
  "../apps/web/public/templates/shared/nikoh/",
  import.meta.url,
);
const read = (base: URL, file: string) =>
  readFileSync(new URL(file, base), "utf8");
const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const html = read(appRoot, "index.html");
const body = (source: string) =>
  source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";

test("Lola retains the captured invitation body, template styles, scripts, metadata and artwork", () => {
  const capturedBody = body(read(captureRoot, "index.html")).replaceAll(
    'data-slot="extras.celebrant"',
    'data-slot="bride"',
  );
  assert.equal(normalize(body(html)), normalize(capturedBody));
  for (const file of [
    "template.css",
    "motion.css",
    "template.js",
    "motion.js",
    "meta.js",
  ]) {
    if (file === "template.js") {
      assert.equal(
        normalize(read(appRoot, file)).replace(
          "gsap.to('.footer', { '--footer-glow-opacity': .42",
          "gsap.to('.footer:before', { opacity: .42",
        ),
        normalize(read(captureRoot, file)),
        "the platform animation targets the footer and its CSS custom property",
      );
      continue;
    }
    if (file === "template.css") {
      assert.equal(
        normalize(read(appRoot, file)).replace(
          "opacity:var(--footer-glow-opacity,0)",
          "opacity:0",
        ),
        normalize(read(captureRoot, file)),
        "the platform footer glow reads the value animated on its DOM element",
      );
      continue;
    }
    assert.equal(
      normalize(read(appRoot, file)),
      normalize(read(captureRoot, file)),
    );
  }
  assert.match(read(appRoot, "template.js"), /gsap\.to\('\.footer', \{ '--footer-glow-opacity': \.42/);
  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(
    read(appRoot, "contract-adapter.css"),
    /\.venue-arch\.has-missing-photo:not\(\.has-venue-map\)\s*\{\s*display:\s*none/,
  );
  assert.match(
    read(appRoot, "contract-adapter.css"),
    /\.sandiq-modal \[data-slot="toyona\.bank"\]\s*\{\s*display:\s*none/,
  );
  assert.ok(existsSync(new URL("SOURCE_ADAPTATIONS.md", appRoot)));
  for (const asset of [
    "bouquet.webp",
    "paper.webp",
    "pressed-tulip.webp",
    "sandiq.webp",
  ]) {
    assert.deepEqual(
      readFileSync(new URL(`art/${asset}`, appRoot)),
      readFileSync(new URL(`art/${asset}`, captureRoot)),
    );
  }
  assert.equal(
    createHash("sha256")
      .update(readFileSync(new URL("art/sandiq-lid.webp", appRoot)))
      .digest("hex"),
    "d0745f0cd6b8711be237d3b75812d0b7f67e206de5ca8fbe373c27e166b39622",
    "recovered lid asset must remain byte-identical to the original Marxaba asset",
  );
  assert.match(read(appRoot, "motion.js"), /prefers-reduced-motion: reduce/);
  assert.match(body(html), /id="open-invitation"/);
  assert.deepEqual(
    Array.from(
      read(appRoot, "meta.js").matchAll(/"(qiz-uzatish|fotiha)"/g),
      (match) => match[1],
    ),
    ["qiz-uzatish", "fotiha"],
  );
});

test("Lola restores the lid asset omitted from the immutable capture manifest", () => {
  const sourceBase = "https://www.marxaba.uz/templates/lola/";
  for (const name of ["bouquet.webp", "paper.webp", "pressed-tulip.webp", "sandiq.webp"]) {
    assert.equal(
      captureManifest.resources[`${sourceBase}art/${name}`]?.file,
      `Qiz uzatish/templates/lola/art/${name}`,
      `${name} is present in the original capture manifest`,
    );
  }
  assert.equal(
    captureManifest.resources[`${sourceBase}art/sandiq-lid.webp`],
    undefined,
    "the untouched capture manifest omitted the CSS-referenced lid",
  );
  const sourceCss = read(captureRoot, "template.css");
  assert.match(sourceCss, /url\(['"]art\/sandiq-lid\.webp['"]\)/);
  assert.equal(
    read(appRoot, "template.css").replace(
      "opacity:var(--footer-glow-opacity,0)",
      "opacity:0",
    ),
    sourceCss,
  );

  const lid = readFileSync(new URL("art/sandiq-lid.webp", appRoot));
  assert.equal(lid.toString("ascii", 0, 4), "RIFF");
  assert.equal(lid.toString("ascii", 8, 12), "WEBP");
  assert.equal(lid.toString("ascii", 12, 16), "VP8X");
  assert.deepEqual(
    [1 + lid.readUIntLE(24, 3), 1 + lid.readUIntLE(27, 3)],
    [800, 300],
    "the recovered lid retains its original transparent landscape dimensions",
  );
  assert.ok(lid[20] & 0x10, "the recovered lid retains alpha transparency");
  assert.equal(
    createHash("sha256").update(lid).digest("hex"),
    "d0745f0cd6b8711be237d3b75812d0b7f67e206de5ca8fbe373c27e166b39622",
    "the recovered lid is byte-identical to the authentic Lola asset",
  );
});

test("Lola uses offline local fonts and has no captured demo imports or remote font requests", () => {
  const fonts = read(appRoot, "fonts.css");
  for (const family of ["Cormorant Infant", "Nunito"])
    assert.ok(fonts.includes(`font-family: '${family}'`));
  assert.match(fonts, /font-style: italic/);
  assert.doesNotMatch(fonts, /https?:\/\//);
  for (const [, fontPath] of fonts.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
    assert.ok(
      existsSync(new URL(fontPath, appRoot)),
      `Missing local font ${fontPath}`,
    );
  }
  const localReferences = [
    ...Array.from(
      html.matchAll(/(?:src|href)="([^"]+)"/g),
      (match) => match[1],
    ),
    ...Array.from(
      read(appRoot, "template.css").matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g),
      (match) => match[1],
    ),
  ].filter((value) => !/^(?:https?:|#|data:|mailto:|tel:)/i.test(value));
  for (const reference of localReferences) {
    assert.ok(
      existsSync(new URL(reference, appRoot)),
      `Missing local template/runtime asset ${reference}`,
    );
  }
  assert.doesNotMatch(
    html,
    /fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/,
  );
  assert.match(
    html,
    /shared\/nikoh\/platform-bridge\.js[\s\S]*lola-data\.js[\s\S]*shared\/nikoh\/core\.js/,
  );
});

test("Lola maps a single honoree into its source name slot for every enabled language", () => {
  const script = read(appRoot, "lola-data.js");
  const window = {
    MARHAMAT_REMOTE: {
      slug: "",
      groom: "Zuhra",
      bride: "",
      i18n: {
        uz: { groom: "Zuhra", bride: "" },
        "uz-Cyrl": { groom: "Зуҳра", bride: "" },
        en: { groom: "Zuhra", bride: "" },
        ru: { groom: "Зухра", bride: "" },
      },
    },
    addEventListener: () => {},
  };
  runInNewContext(script, {
    window,
    location: { pathname: "/templates/lola/index.html" },
  });
  assert.equal(window.MARHAMAT_REMOTE.bride, "Zuhra");
  assert.equal(window.MARHAMAT_REMOTE.i18n["uz-Cyrl"].bride, "Зуҳра");
  assert.equal(window.MARHAMAT_REMOTE.i18n.en.bride, "Zuhra");
  assert.equal(window.MARHAMAT_REMOTE.i18n.ru.bride, "Зухра");
  assert.doesNotMatch(script, /Malika|Javohir|Madina/);

  const untouched = { groom: "Person A", bride: "Person B" };
  runInNewContext(script, {
    window: { MARHAMAT_REMOTE: untouched, addEventListener: () => {} },
    location: { pathname: "/templates/other/index.html" },
  });
  assert.equal(untouched.bride, "Person B");
});

test("Lola fixed copy adds Russian and English translations while shared runtime handles Uzbek Cyrillic", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(read(sharedRoot, "i18n.js"), { window });
  runInNewContext(read(appRoot, "lola-i18n.js"), { window });
  const translations = window.MARHAMAT_I18N!;
  for (const key of [
    "Oqshomdan lavhalar",
    "To‘y dasturi",
    "Lahzalar",
    "Tilaklar",
    "Bog‘lanish uchun",
    "Kelinga sovg‘a uchun",
    "Taklifnomani ochish",
  ]) {
    assert.ok(translations[key]?.[0], `Russian translation missing: ${key}`);
    assert.ok(translations[key]?.[1], `English translation missing: ${key}`);
  }
  assert.match(
    read(appRoot, "lola-i18n.js"),
    /Object\.assign\(\{\}, window\.MARHAMAT_I18N/,
  );
  const ignored = new Set([
    "&",
    "♫",
    "❀",
    "✿",
    "❀ ❀ ❀ ❀ ❀ ❀ ❀",
    "↗",
    "↓",
    "‹",
    "›",
    "×",
    "−",
    "+",
    "00",
    "Marhamat",
  ]);
  const visible = Array.from(body(html).matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter(
    (value) =>
      value.length > 1 && !ignored.has(value) && !value.includes("data-"),
  );
  const attributes = Array.from(
    body(html).matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].trim(),
  );
  const untranslated = [
    ...new Set(
      [...visible, ...attributes].filter((value) => !translations[value]),
    ),
  ];
  assert.deepEqual(
    untranslated,
    [],
    `Untranslated fixed source copy: ${untranslated.join(" | ")}`,
  );
});

test("Lola delegates rendering to the shared typed adapter and retains all source sections", () => {
  const renderer = readFileSync(
    new URL("../apps/web/src/templates/lola/renderer.tsx", import.meta.url),
    "utf8",
  );
  const barrel = readFileSync(
    new URL("../apps/web/src/templates/lola/index.ts", import.meta.url),
    "utf8",
  );
  assert.match(renderer, /Invitation, Locale/);
  assert.match(
    renderer,
    /<MarxabaInvitation \{\.\.\.props\} templateId="lola" \/>/,
  );
  assert.match(barrel, /LolaInvitation/);
  for (const section of [
    "hero",
    "invitation-text",
    "date",
    "program",
    "venue",
    "dresscode",
    "gallery",
    "rsvp",
    "wishes",
    "toyona",
    "contacts",
    "footer",
  ]) {
    assert.match(body(html), new RegExp(`data-section="${section}"`));
  }
});

test("Lola receives the central sample only in template previews and blank creator drafts remain empty", async () => {
  const { makeLegacyData } =
    await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("lola");
  assert.equal(sample.eventType, "qiz-uzatish");
  assert.equal(sample.startsAt, "2027-06-12T17:00");
  assert.deepEqual(sample.content["uz-Latn"].people, ["Madina"]);
  assert.equal(sample.content["uz-Latn"].hosts, "Madina oilasi");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  for (const locale of locales) {
    const data = makeLegacyData(sample, locale, "Aziz mehmon", true);
    assert.equal(data.groom, sample.content[locale].people[0]);
    assert.equal(data.bride, sample.content[locale].people[1] ?? "");
    assert.equal(
      data.greeting,
      sample.content[locale].personalGreeting.replaceAll(
        "{name}",
        "Aziz mehmon",
      ),
    );
    assert.equal(data.program.length, 6);
    assert.equal(data.gallery.length, 6);
    assert.equal(data.program[1].time, "18:00");
    assert.ok(data.program[1].title);
    assert.equal(data.wishes.length, 3);
    assert.ok(data.wishes.every((wish: { name: string; text: string }) => wish.name && wish.text));
    assert.equal(data.toyona.enabled, true);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.equal("bank" in data.toyona, false);
    assert.equal(data.toyona.note, "");
    assert.equal(data.contacts.length, 2);
    assert.equal(data.contacts[0].value, "+998 90 123 45 67");
    assert.equal(data.contacts[1].value, "@demo");
    assert.ok(data.dressCode.text);
    assert.equal(data.dressCode.colors.length, 5);
  }
  const blank = makeLegacyData(createInvitation("lola"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.message, "");
  assert.equal(blank.venue.name, "");
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
});

test("Lola catalog artwork is a portrait render of its opening, separate from the capture assets", () => {
  const missingSources = Array.from(
    read(appRoot, "template.css").matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g),
    (match) => match[1],
  ).filter(
    (value) => value.startsWith("art/") && !existsSync(new URL(value, appRoot)),
  );
  assert.deepEqual(missingSources, []);
  assert.match(body(html), /data-photo="venue\.photo"/);
  assert.match(read(appRoot, "meta.js"), /preview: "preview\.webp"/);
  assert.equal(
    captureManifest.resources["https://www.marxaba.uz/templates/lola/preview.webp"],
    undefined,
    "the captured manifest has no catalog preview asset",
  );
  const preview = readFileSync(new URL("preview.webp", appRoot));
  const provenance = JSON.parse(read(appRoot, "preview.provenance.json")) as {
    artifact: string;
    artifactSha256: string;
    format: string;
    encoding: string;
    width: number;
    height: number;
    sourceCapture: string;
    renderedFrom: string;
    previewRoute: string;
    fixture: string;
    fixtureSha256: string;
    locale: string;
    viewport: { width: number; height: number; deviceScaleFactor: number };
    captureCleanup: string;
    verificationNote: string;
    sourceNote: string;
  };
  assert.ok(
    preview.length > 20_000,
    "rendered portrait opening must be a real image",
  );
  assert.equal(preview.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.equal(preview.toString("ascii", 12, 16), "VP8L");
  assert.equal(provenance.encoding, "lossless");
  assert.equal(preview[20], 0x2f, "lossless WebP signature byte");
  assert.deepEqual(
    [
      (preview.readUInt32LE(21) & 0x3fff) + 1,
      ((preview.readUInt32LE(21) >>> 14) & 0x3fff) + 1,
    ],
    [480, 900],
    "catalog artwork preserves the full 8:15 opening portrait",
  );
  assert.equal(provenance.artifact, "preview.webp");
  assert.equal(provenance.artifactSha256, createHash("sha256").update(preview).digest("hex"));
  assert.equal(provenance.format, "image/webp");
  assert.deepEqual([provenance.width, provenance.height], [480, 900]);
  assert.equal(provenance.sourceCapture, "Invitations - this folder will be removed from production/Marxaba/Qiz uzatish/templates/lola");
  assert.equal(provenance.renderedFrom, "captured Lola opening after opening motion settles");
  assert.equal(provenance.previewRoute, "/preview?template=lola&qaSilent=1");
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(
    provenance.fixtureSha256,
    createHash("sha256")
      .update(readFileSync(new URL("./fixtures/catalog-preview-2026-10-23.json", import.meta.url)))
      .digest("hex"),
    "preview provenance pins the exact shared fixture used for the render",
  );
  assert.equal(provenance.locale, "uz-Latn");
  assert.deepEqual(provenance.viewport, { width: 480, height: 900, deviceScaleFactor: 1 });
  assert.match(provenance.captureCleanup, /\.mh-lang/);
  assert.match(provenance.captureCleanup, /x=320, y=0, width=160, height=70/);
  assert.match(provenance.verificationNote, /hidden before capture/);
  assert.match(provenance.sourceNote, /omitted from the capture manifest/);
  assert.match(provenance.sourceNote, /recovered byte-for-byte from the same deployed Lola template/);
  assert.match(provenance.sourceNote, /no approximation was used/);
  assert.notEqual(
    createHash("sha256").update(preview).digest("hex"),
    createHash("sha256")
      .update(readFileSync(new URL("art/bouquet.webp", appRoot)))
      .digest("hex"),
    "catalog art must show the opening render rather than a copied scene asset",
  );
  for (const sourceAsset of ["paper.webp", "pressed-tulip.webp", "sandiq.webp", "sandiq-lid.webp"])
    assert.notEqual(
      createHash("sha256").update(preview).digest("hex"),
      createHash("sha256")
        .update(readFileSync(new URL(`art/${sourceAsset}`, appRoot)))
        .digest("hex"),
      `catalog artwork is a browser render, not the ${sourceAsset} scene asset`,
    );
});
