import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL("../apps/web/public/templates/paxta/", import.meta.url);
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

  const fixture = readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url));
  assert.equal(sha256(fixture), "4faa5157eb048e2d1ce4a47ae0ac4c45e8edcadc1debf9ece1287380ce7333e9");
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
