import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createInvitation, type Locale } from "@taklifnoma/contracts";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const templateRoot = new URL("../apps/web/public/templates/paxta/", import.meta.url);
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
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/paxta/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const sharedI18nSource = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url),
  "utf8",
);
const templateI18nSource = readFileSync(new URL("i18n.js", templateRoot), "utf8");

test("Paxta localizes its static copy and page metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(sharedI18nSource, { window });
  runInNewContext(templateI18nSource, { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const body = html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const textNodes = Array.from(body.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter(
    (text) =>
      text.length > 1 &&
      !["&", "PA X TA", "COTTON / 01"].includes(text) &&
      !/^№?\s*[\d /·—-]+$/.test(text),
  );
  const attributes = Array.from(
    body.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  const metadata = Array.from(
    html.matchAll(/<meta\s+[^>]*?(?:name="description"|property="og:(?:title|description)")[^>]*?content="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  assert.deepEqual([...textNodes, ...attributes, ...metadata].filter((text) => !translations[text]), []);
  assert.deepEqual(Array.from(translations["To‘yona"] ?? []), ["Подарок молодожёнам", "Wedding gift"]);
  assert.deepEqual(Array.from(translations["Bog‘lanish uchun"] ?? []), ["Контакты", "Get in touch"]);
  assert.ok(translations["Paxta · Taklifnoma"]);
  assert.deepEqual(Array.from(translations["COTTON / 01"] ?? []), ["ХЛОПОК / 01", "COTTON / 01"]);
});

test("Paxta hero caption uses the intended Uzbek Cyrillic, English, and Russian wording", () => {
  const adapter = readFileSync(new URL("localized-caption.js", templateRoot), "utf8");
  assert.match(html, /<script src="localized-caption\.js" defer><\/script>/);

  for (const [locale, expected] of [
    ["uz-Cyrl", "ПАХТА / 01"],
    ["en", "COTTON / 01"],
    ["ru", "ХЛОПОК / 01"],
  ] as const) {
    const caption = { textContent: "COTTON / 01" };
    const signature = { textContent: "PA X TA · 01" };
    const document = {
      readyState: "complete",
      documentElement: { dataset: { lang: locale } },
      querySelector: (selector: string) =>
        selector === ".hero__caption" ? caption : selector === ".intro__signature" ? signature : null,
    };
    runInNewContext(adapter, { document });
    assert.equal(caption.textContent, expected, `${locale} caption`);
    assert.equal(
      signature.textContent,
      { "uz-Cyrl": "ПАХТА · 01", en: "COTTON · 01", ru: "ХЛОПОК · 01" }[locale] ?? "PA X TA · 01",
      `${locale} intro signature`,
    );
  }
});

test("Paxta retains the captured layout, styles, motion, and artwork", () => {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n");
  const originalHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const sourceBody = originalHtml.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim() ?? "";
  const packagedBody = html.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim() ?? "";
  assert.equal(packagedBody, sourceBody, "the invitation body must retain the captured markup");
  assert.ok(packagedBody.includes('id="wishes" data-section="wishes"'));
  assert.ok(packagedBody.includes('id="toyona" data-section="toyona"'));
  assert.ok(packagedBody.includes('id="contacts" data-section="contacts"'));
  assert.ok(packagedBody.includes('data-slot="toyona.cardNumber"'));
  assert.ok(packagedBody.includes('data-slot="toyona.cardHolder"'));
  assert.ok(packagedBody.includes('data-list="contacts"'));
  assert.ok(!packagedBody.includes("Javohir"));
  assert.ok(!packagedBody.includes("Madina"));

  for (const file of ["template.css", "template.js", "meta.js", "social.js"]) {
    const captured = normalize(readFileSync(new URL(file, captureRoot), "utf8"));
    const expected = file === "template.js"
      ? captured
          .replace(
            "  const lite = !!(api && api.tier === 'lite');\n",
            "  const lite = !!(api && api.tier === 'lite');\n\n" +
              "  function setupGalleryParallax() {\n" +
              "    if (!window.gsap || reduced) return;\n" +
              "    const item = $('.gallery__item:first-child');\n" +
              "    if (!item || item.dataset.paxtaParallax === 'true') return;\n" +
              "    item.dataset.paxtaParallax = 'true';\n" +
              "    gsap.to(item, { y: -18, ease: 'none', scrollTrigger: { trigger: '.gallery-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });\n" +
              "  }\n\n" +
              "  function watchGalleryParallax() {\n" +
              "    const gallery = $('.gallery[data-list=\"gallery\"]');\n" +
              "    if (!gallery || !window.gsap || reduced || !('MutationObserver' in window)) return;\n" +
              "    new MutationObserver(setupGalleryParallax).observe(gallery, { childList: true });\n" +
              "    setupGalleryParallax();\n" +
              "  }\n",
          )
          .replace(
            "      gsap.to('.gallery__item:first-child', { y: -18, ease: 'none', scrollTrigger: { trigger: '.gallery-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });",
            "      setupGalleryParallax();",
          )
          .replace(
            "    setupScroll();\n    setupInteractions();",
            "    setupScroll();\n    watchGalleryParallax();\n    setupInteractions();",
          )
      : captured;
    assert.equal(
      normalize(readFileSync(new URL(file, templateRoot), "utf8")),
      expected,
      `${file} should match the captured source${file === "template.js" ? " apart from the delayed gallery motion binding" : ""}`,
    );
  }
  const packagedMotion = readFileSync(new URL("template.js", templateRoot), "utf8");
  assert.match(packagedMotion, /function setupGalleryParallax\(\)/);
  assert.match(packagedMotion, /new MutationObserver\(setupGalleryParallax\)\.observe\(gallery, \{ childList: true \}\)/);
  assert.match(packagedMotion, /item\.dataset\.paxtaParallax === 'true'/);
  assert.match(packagedMotion, /if \(!window\.gsap \|\| reduced\) return/);
  const sourceTranslations = readFileSync(new URL("i18n.js", captureRoot), "utf8");
  const packagedTranslations = readFileSync(new URL("i18n.js", templateRoot), "utf8");
  assert.equal(
    normalize(packagedTranslations),
    normalize(
      sourceTranslations
        .replace(
          '  "Muhammadjon & Mohinabonu": ["Мухаммаджон и Мохинабону", "Muhammadjon & Mohinabonu"],\n',
          "",
        )
        .replace(
          '  "PA X TA":',
          '  "Paxta · Taklifnoma": ["Хлопок · Приглашение", "Cotton · Invitation"],\n  "PA X TA":',
        ),
    ),
    "i18n.js should keep captured UI translations, remove the unused source sample-name translation, and add the localized platform title",
  );
  assert.doesNotMatch(packagedTranslations, /Muhammadjon|Mohinabonu/);
  const capturedImages = ["art/linen.webp", "art/cotton-branch.webp"];
  for (const asset of capturedImages) {
    assert.deepEqual(
      readFileSync(new URL(asset, templateRoot)),
      readFileSync(new URL(asset, captureRoot)),
      `${asset} must be an exact source copy`,
    );
  }
  const fontCss = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  assert.match(fontCss, /font-family:\s*'Fraunces'/);
  assert.match(fontCss, /font-family:\s*'Inter'/);
  for (const [, asset] of fontCss.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
  assert.doesNotMatch(html, /fonts\.googleapis\.com|sample-invitation\.js|og\.jpg/);
  assert.match(readFileSync(new URL("template.css", templateRoot), "utf8"), /prefers-reduced-motion/);
  assert.match(readFileSync(new URL("template.js", templateRoot), "utf8"), /reducedMotion/);
  assert.ok(existsSync(new URL("preview.webp", templateRoot)), "portrait preview art must be packaged");
});

test("Paxta keeps preview-only gift and contact examples in the shared fixture", () => {
  const sample = JSON.parse(
    readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url), "utf8"),
  ) as {
    gift: { enabled: boolean; cardNumber: string; cardHolder: string };
    contacts: { phoneNumber: string; telegramUsername: string };
  };
  assert.deepEqual(sample.gift, {
    enabled: true,
    receiptUploadEnabled: false,
    cardNumber: "8600 1234 5678 9012",
    cardHolder: "AZIZ AZIZOV",
  });
  assert.deepEqual(sample.contacts, {
    phoneNumber: "+998 90 123 45 67",
    telegramUsername: "@demo",
  });
});

test("Paxta maps the shared preview fixture in all locales and keeps blank drafts empty", async () => {
  const { makeLegacyData } = await import("../apps/web/src/templates/anor/renderer");
  const sample = createTemplatePreviewSample("paxta");
  assert.equal(sample.eventType, "wedding");
  assert.equal(sample.startsAt, "2027-06-12T17:00");
  const locales: Locale[] = ["uz-Latn", "uz-Cyrl", "en", "ru"];

  for (const locale of locales) {
    const data = makeLegacyData(sample, locale, "Aziz mehmon", true);
    assert.equal(data.groom, sample.content[locale].people[0]);
    assert.equal(data.bride, sample.content[locale].people[1]);
    assert.equal(data.date.long.length > 0, true);
    assert.equal(data.venue.name, sample.content[locale].venueName);
    assert.equal(data.program.length, 6);
    assert.deepEqual(data.program.map((item) => item.time), ["17:30", "18:00", "18:30", "20:00", "21:30", "22:30"]);
    assert.ok(data.program.every((item) => item.title));
    assert.equal(data.gallery.length, 6);
    assert.ok(data.gallery.every((item) => item.src === "" && item.alt === ""));
    assert.equal(data.wishes.length, 3);
    assert.ok(data.wishes.every((wish: { name: string; text: string }) => wish.name && wish.text));
    assert.equal(data.toyona.enabled, true);
    assert.equal(data.toyona.cardNumber, "8600 1234 5678 9012");
    assert.equal(data.toyona.cardHolder, "AZIZ AZIZOV");
    assert.equal("bank" in data.toyona, false);
    assert.equal(data.contacts.length, 2);
    assert.equal(data.contacts[0].value, "+998 90 123 45 67");
    assert.equal(data.contacts[1].value, "@demo");
    assert.ok(data.dressCode.text);
    assert.equal(data.dressCode.colors.length, 5);
  }

  const blank = makeLegacyData(createInvitation("paxta"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.message, "");
  assert.equal(blank.venue.name, "");
  assert.equal(blank.gallery.length, 0);
  assert.deepEqual(blank.wishes, []);
  assert.equal(blank.toyona.enabled, false);
  assert.deepEqual(blank.contacts, []);
  assert.equal(blank.dressCode.enabled, false);
});

test("Paxta source adapter hides unsupported venue and gift rows without changing captured CSS", () => {
  const adapterLink = /href="contract-adapter\.css"/.test(html);
  const adapter = readFileSync(new URL("contract-adapter.css", templateRoot), "utf8");
  const sourceCss = readFileSync(new URL("template.css", captureRoot), "utf8");
  const packagedCss = readFileSync(new URL("template.css", templateRoot), "utf8");

  assert.ok(adapterLink);
  assert.match(adapter, /\.venue__photo\.has-missing-photo:not\(\.has-venue-map\)\s*\{\s*display:\s*none/);
  assert.match(adapter, /\.gift-section > \.muted:empty/);
  assert.match(adapter, /\.gift__details \[data-slot="toyona\.bank"\]/);
  assert.equal(packagedCss.replace(/\r\n/g, "\n"), sourceCss.replace(/\r\n/g, "\n"));
  assert.ok(existsSync(new URL("SOURCE_ADAPTATIONS.md", templateRoot)));
});

test("Paxta catalog artwork is a portrait capture of the source opening with provenance", () => {
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  const provenance = JSON.parse(
    readFileSync(new URL("preview.provenance.json", templateRoot), "utf8"),
  ) as {
    artifact: string;
    width: number;
    height: number;
    route: string;
    sourceOpening: string;
    fixture: string;
    fixtureLocale: string;
    fixtureNames: string[];
    sha256: string;
    fixtureSha256: string;
    fixtureStartsAt: string;
    renderedIntroDate: string;
    renderedDateSlot: string;
    captureExcludes: string[];
    captureSource: Record<string, string>;
  };
  const sha256 = (value: Buffer) => createHash("sha256").update(value).digest("hex");
  assert.equal(provenance.artifact, "preview.webp");
  assert.deepEqual([provenance.width, provenance.height], [720, 1280]);
  assert.equal(provenance.route, "/preview?template=paxta&qaSilent=1");
  assert.equal(provenance.sourceOpening, "initial, closed invitation cover");
  assert.equal(provenance.fixture, "apps/web/src/modules/catalog/preview-sample.json");
  assert.equal(provenance.fixtureLocale, "uz-Latn");
  assert.deepEqual(provenance.fixtureNames, ["Javohir", "Madina"]);
  assert.equal(provenance.sha256, sha256(preview));

  const fixtureBytes = readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url));
  const fixture = JSON.parse(fixtureBytes.toString("utf8"));
  assert.equal(fixture.eventType, "wedding");
  assert.deepEqual(fixture.content[provenance.fixtureLocale].people, provenance.fixtureNames);
  assert.equal(provenance.fixtureSha256, sha256(fixtureBytes));
  assert.equal(provenance.fixtureStartsAt, fixture.startsAt);
  assert.equal(provenance.fixtureStartsAt, "2027-06-12T17:00");
  assert.equal(provenance.renderedDateSlot, "date.long");
  assert.equal(provenance.renderedIntroDate, "Shanba, 12 iyun 2027");
  assert.deepEqual(provenance.captureExcludes, [
    ".mh-lang app language switcher",
    "nextjs-portal development badge",
  ]);
  const packagedHtml = readFileSync(new URL("../apps/web/public/templates/paxta/index.html", import.meta.url), "utf8");
  assert.match(packagedHtml, /class="intro__date" data-slot="date\.long"|class="intro__date"[^>]*data-slot="date\.long"/);
  const captureFiles = {
    indexHtmlSha256: "index.html",
    templateCssSha256: "template.css",
    templateJsSha256: "template.js",
    cottonBranchSha256: "art/cotton-branch.webp",
    linenSha256: "art/linen.webp",
  } as const;
  for (const [hashKey, file] of Object.entries(captureFiles)) {
    assert.equal(
      provenance.captureSource[hashKey],
      sha256(readFileSync(new URL(file, captureRoot))),
      `provenance must match the untouched captured ${file}`,
    );
  }
});

test("Paxta exposes the shared typed invitation renderer without changing its data contract", () => {
  const renderer = readFileSync(
    new URL("../apps/web/src/templates/paxta/renderer.tsx", import.meta.url),
    "utf8",
  );
  const barrel = readFileSync(
    new URL("../apps/web/src/templates/paxta/index.ts", import.meta.url),
    "utf8",
  );

  assert.match(renderer, /import type \{ Invitation, Locale \} from "@taklifnoma\/contracts"/);
  assert.match(renderer, /export function PaxtaInvitation\(props: PaxtaInvitationProps\)/);
  assert.match(renderer, /<MarxabaInvitation \{\.\.\.props\} templateId="paxta" \/>/);
  assert.match(barrel, /export \{ PaxtaInvitation \} from "\.\/renderer"/);
  assert.match(barrel, /export type \{ PaxtaInvitationProps \} from "\.\/renderer"/);
});
