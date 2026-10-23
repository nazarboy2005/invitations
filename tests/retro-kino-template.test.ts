import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL("../apps/web/public/templates/retro-kino/", import.meta.url);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/retro-kino/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const renderer = readFileSync(
  new URL("../apps/web/src/templates/retro-kino/renderer.tsx", import.meta.url),
  "utf8",
);
const normalize = (value: string) => value.replace(/\r\n/g, "\n");

test("Retro Kino exposes a typed renderer entry that fixes the source template ID", () => {
  const entry = readFileSync(
    new URL("../apps/web/src/templates/retro-kino/index.ts", import.meta.url),
    "utf8",
  );
  assert.match(renderer, /ComponentProps<typeof MarxabaInvitation>/);
  assert.match(renderer, /Omit<[\s\S]*"templateId"/);
  assert.match(renderer, /<MarxabaInvitation \{\.\.\.props\} templateId="retro-kino" \/>/);
  assert.match(entry, /export \{ RetroKinoInvitation \} from "\.\/renderer"/);
  assert.doesNotMatch(renderer, /templateId:\s*string/);
});

test("Retro Kino keeps the captured invitation markup, styling, and motion", () => {
  const capturedHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  assert.equal(
    html.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim(),
    capturedHtml.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim(),
    "all visible template markup and controls must match the captured body",
  );

  const capturedCss = readFileSync(new URL("template.css", captureRoot), "utf8").replace(
    /@import url\('https:\/\/fonts\.googleapis\.com[^']+'\);\s*/,
    "",
  );
  assert.equal(normalize(readFileSync(new URL("template.css", templateRoot), "utf8")), normalize(capturedCss));
  const capturedTemplateJs = normalize(readFileSync(new URL("template.js", captureRoot), "utf8"));
  const packagedTemplateJs = normalize(readFileSync(new URL("template.js", templateRoot), "utf8"));
  const countdownCellHelper = /\s*function countdownCell\(target\)\{[\s\S]*?\}\n/;
  assert.match(packagedTemplateJs, countdownCellHelper);
  assert.equal(
    packagedTemplateJs
      .replace(countdownCellHelper, "\n")
      .replace("countdownCell(record.target)", "record.target.closest('.countdown div')"),
    capturedTemplateJs,
    "the countdown observer fix must be the only source-script adaptation",
  );
  assert.equal(
    normalize(readFileSync(new URL("meta.js", templateRoot), "utf8")),
    normalize(readFileSync(new URL("meta.js", captureRoot), "utf8")),
  );
  for (const asset of ["art/poster.webp", "art/curtains.webp"]) {
    assert.deepEqual(
      readFileSync(new URL(asset, templateRoot)),
      readFileSync(new URL(asset, captureRoot)),
      `${asset} must be an exact local copy`,
    );
  }
  assert.match(readFileSync(new URL("meta.js", templateRoot), "utf8"), /preview:\s*[\"']preview\.webp[\"']/);
  assert.ok(existsSync(new URL("preview.webp", templateRoot)), "the metadata-declared source catalog artwork is packaged");
  assert.match(readFileSync(new URL("template.js", templateRoot), "utf8"), /reducedMotion/);
  assert.match(readFileSync(new URL("template.css", templateRoot), "utf8"), /prefers-reduced-motion/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|sample-invitation\.js|social\.js/);
});

test("Retro Kino fonts are served locally for Latin and Cyrillic copy", () => {
  const css = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  for (const font of ["Bebas Neue", "Courier Prime", "Playfair Display"]) {
    assert.ok(css.includes(`font-family:'${font}'`), `${font} font face is required`);
  }
  assert.match(css, /Playfair Display';font-style:normal;font-weight:500 600/);
  assert.match(css, /Playfair Display';font-style:italic;font-weight:500 600/);
  assert.match(css, /U\+0400-045F/);
  for (const [, file] of css.matchAll(/url\(['"]?([^'")]+\.woff2)['"]?\)/g)) {
    assert.ok(existsSync(new URL(file, templateRoot)), `${file} is missing`);
  }
});

test("Retro Kino localizes every static page string and localized metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(
    readFileSync(new URL("../apps/web/public/templates/shared/nikoh/i18n.js", import.meta.url), "utf8"),
    { window },
  );
  runInNewContext(readFileSync(new URL("i18n.js", templateRoot), "utf8"), { window });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const body = html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const textNodes = Array.from(body.matchAll(/>([^<>]+)</g), (match) =>
    match[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  ).filter((text) =>
    text.length > 1 &&
    !["&", "✳"].includes(text) &&
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
  assert.deepEqual(Array.from(translations["Retro Kino · Taklifnoma"] ?? []), [
    "Ретро кино · Приглашение",
    "Retro Kino · Invitation",
  ]);
  assert.ok(translations["Lahzalar"]);
});

test("Retro Kino corrects Uzbek Cyrillic loanwords without changing other locales", () => {
  const htmlScriptOrder = Array.from(html.matchAll(/<script src="([^"]+)" defer><\/script>/g), (match) => match[1]);
  assert.ok(
    htmlScriptOrder.indexOf("uz-cyrl-copy.js") > htmlScriptOrder.indexOf("template.js"),
    "template-specific Cyrillic corrections must run after shared and captured localization",
  );

  const script = readFileSync(new URL("uz-cyrl-copy.js", templateRoot), "utf8");
  const render = (locale: string) => {
    const textNodes = [
      { nodeValue: "ПРЕМЙЕРА № 01" },
      { nodeValue: "Премйера куни" },
      { nodeValue: "Марқуее чироқлари" },
    ];
    const attributes = [{ values: {
      "aria-label": "Марқуее чироқлари",
      "data-print": "Марқуее чироқлари",
    } }];
    const metadata = [{ content: "Премйера" }];
    const document = {
      documentElement: { lang: locale },
      body: {},
      title: "Премйера",
      createTreeWalker: () => {
        let index = 0;
        return {
          currentNode: textNodes[0],
          nextNode() {
            if (index >= textNodes.length) return false;
            this.currentNode = textNodes[index++];
            return true;
          },
        };
      },
      querySelectorAll: (selector: string) =>
        selector.startsWith("meta[")
          ? metadata
          : attributes.map((element) => ({
              getAttribute: (name: string) => element.values[name] ?? null,
              setAttribute: (name: string, value: string) => { element.values[name] = value; },
            })),
    };

    runInNewContext(script, { document, NodeFilter: { SHOW_TEXT: 4 } });
    return { textNodes, attributes, metadata, title: document.title };
  };

  const cyrillic = render("uz-Cyrl");
  assert.deepEqual(cyrillic.textNodes.map(({ nodeValue }) => nodeValue), [
    "ПРЕМЬЕРА № 01",
    "Премьера куни",
    "Кино чироқлари",
  ]);
  assert.equal(cyrillic.attributes[0].values["aria-label"], "Кино чироқлари");
  assert.equal(cyrillic.attributes[0].values["data-print"], "Кино чироқлари");
  assert.equal(cyrillic.metadata[0].content, "Премьера");
  assert.equal(cyrillic.title, "Премьера");

  for (const locale of ["uz", "ru", "en"]) {
    const unchanged = render(locale);
    assert.deepEqual(unchanged.textNodes.map(({ nodeValue }) => nodeValue), [
      "ПРЕМЙЕРА № 01",
      "Премйера куни",
      "Марқуее чироқлари",
    ]);
    assert.equal(unchanged.title, "Премйера");
  }
});

test("Retro Kino countdown observer accepts both element and character-data mutation targets", () => {
  const source = readFileSync(new URL("template.js", templateRoot), "utf8");
  const helper = source.match(/function countdownCell\(target\)\{[\s\S]*?\}/)?.[0];
  assert.ok(helper, "countdown target resolver is required");
  assert.match(source, /countdownCell\(record\.target\)/);
  assert.doesNotMatch(source, /record\.target\.closest\(/);

  const resolveCell = runInNewContext(`(${helper})`) as (target: unknown) => unknown;
  const cell = {};
  const parent = {
    closest(selector: string) {
      assert.equal(selector, ".countdown div");
      return cell;
    },
  };
  assert.equal(resolveCell({ nodeType: 3, parentElement: parent }), cell);
  assert.equal(resolveCell({ nodeType: 1, closest: parent.closest }), cell);
  assert.equal(resolveCell({ nodeType: 3, parentElement: null }), null);
});
