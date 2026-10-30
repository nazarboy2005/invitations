import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { readFileSync } from "./helpers/source-files";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";

const templateRoot = new URL(
  "../apps/web/public/templates/toscana/",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/toscana/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const normalize = (value: string) =>
  value.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

test("Toscana is registered for publication at the verified release gate", () => {
  const registry = readFileSync(
    new URL("../packages/contracts/src/index.ts", import.meta.url),
    "utf8",
  );
  const migration = readFileSync(
    new URL("../packages/database/migrations/0076_publish_toscana.sql", import.meta.url),
    "utf8",
  );
  assert.match(registry, /id: "toscana",[\s\S]*?published: true/);
  assert.match(migration, /VALUES \('toscana', 'Toscana', 15000000, 'UZS', true\)/);
  assert.match(migration, /\('toscana', 'wedding'\), \('toscana', 'fotiha'\)/);
});

test("Toscana keeps the captured page structure, styling, motion, and local art", () => {
  const body = (value: string) =>
    normalize((value.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "").trim());
  assert.equal(
    body(html),
    body(readFileSync(new URL("index.html", captureRoot), "utf8")),
  );

  for (const file of ["template.css", "meta.js", "aisle3d.js"]) {
    assert.equal(
      normalize(readFileSync(new URL(file, templateRoot), "utf8")),
      normalize(readFileSync(new URL(file, captureRoot), "utf8")),
      `${file} must remain an exact source copy`,
    );
  }
  const capturedScript = readFileSync(
    new URL("template.js", captureRoot),
    "utf8",
  );
  const packagedScript = readFileSync(new URL("template.js", templateRoot), "utf8");
  const capturedNormalized = capturedScript.replace(/\r\n/g, "\n");
  const packagedNormalized = packagedScript.replace(/\r\n/g, "\n");
  const sourceTweenStart = capturedNormalized.indexOf(
    "      titles.forEach(title => gsap.fromTo(",
  );
  const sourceTweenEnd = capturedNormalized.indexOf("\n", sourceTweenStart) + 1;
  const packagedTweenStart = packagedNormalized.indexOf(
    "      titles.forEach(title => {\n        // The platform bridge",
  );
  const packagedTweenClose = packagedNormalized.indexOf("\n      });", packagedTweenStart);
  assert.ok(sourceTweenStart >= 0 && packagedTweenStart >= 0 && packagedTweenClose >= 0);
  const packagedTweenEnd = packagedTweenClose + "\n      });".length + 1;
  const expectedScript = capturedNormalized
    .slice(0, sourceTweenStart)
    .concat(packagedNormalized.slice(packagedTweenStart, packagedTweenEnd))
    .concat(capturedNormalized.slice(sourceTweenEnd))
    .replace(
      "../../shared/vendor/three/three.bundle.min.js",
      "../shared/nikoh/vendor/three/three.bundle.min.js",
    );
  assert.equal(
    packagedNormalized,
    expectedScript,
    "only the local Three.js path and platform-backed title wrapper restoration may change source JavaScript",
  );
  assert.match(packagedScript, /const targets = \$\$\('\.word__in', title\);\s*if \(targets\.length\) gsap\.fromTo\(targets/);

  const capturedArt = readdirSync(new URL("art/", captureRoot));
  for (const file of capturedArt) {
    assert.deepEqual(
      readFileSync(new URL(`art/${file}`, templateRoot)),
      readFileSync(new URL(`art/${file}`, captureRoot)),
      `art/${file} must be an exact source copy`,
    );
  }
  assert.ok(
    capturedArt.includes("aisle.webp"),
    "the original portrait opening artwork must be present",
  );
  assert.match(
    readFileSync(new URL("template.css", templateRoot), "utf8"),
    /prefers-reduced-motion/,
  );
  assert.match(
    readFileSync(new URL("template.js", templateRoot), "utf8"),
    /app\.reducedMotion/,
  );
  assert.match(
    readFileSync(new URL("template.js", templateRoot), "utf8"),
    /three\.bundle\.min\.js/,
  );
});

test("Toscana has no capture sample runtime or remote font dependency", () => {
  assert.doesNotMatch(
    html,
    /sample-invitation\.js|sample-overrides\.js|fonts\.googleapis\.com|fonts\.gstatic\.com/,
  );
  assert.match(html, /shared\/nikoh\/platform-bridge\.js/);
  assert.match(html, /shared\/nikoh\/core\.js/);
  assert.match(html, /href="fonts\.css"/);

  const root = fileURLToPath(templateRoot);
  const localHtmlRefs = Array.from(
    html.matchAll(/(?:src|href)="([^"]+)"/g),
    (m) => m[1],
  ).filter((ref) => !/^https?:/i.test(ref) && !ref.startsWith("#"));
  const cssRefs = ["template.css", "fonts.css"].flatMap((file) => {
    const css = readFileSync(new URL(file, templateRoot), "utf8");
    return Array.from(css.matchAll(/url\(["']?([^"')]+)["']?\)/g), (m) => m[1]);
  });
  for (const ref of [...localHtmlRefs, ...cssRefs]) {
    const resolved = path.resolve(
      decodeURIComponent(root),
      decodeURIComponent(ref),
    );
    assert.ok(existsSync(resolved), `local resource ${ref} must exist`);
  }
  const fontCss = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  assert.match(fontCss, /font-family:\s*'Cormorant Garamond'/);
  assert.match(fontCss, /font-family:\s*'Marck Script'/);
  for (const family of ["Cormorant Garamond", "Marck Script"]) {
    assert.ok(fontCss.includes(family), `${family} must be served locally`);
  }
});

test("Toscana static copy is translated and the wrapper uses the shared typed contract", () => {
  const translations: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(
    readFileSync(
      new URL(
        "../apps/web/public/templates/shared/nikoh/i18n.js",
        import.meta.url,
      ),
      "utf8",
    ),
    { window: translations },
  );
  runInNewContext(readFileSync(new URL("i18n.js", templateRoot), "utf8"), {
    window: translations,
  });
  const dictionary = translations.MARHAMAT_I18N;
  assert.ok(dictionary);

  const body = html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const visibleText = Array.from(body.matchAll(/>([^<>]+)</g), (m) =>
    m[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim(),
  ).filter(
    (text) => text.length > 1 && !/^&+$/.test(text) && !/^\d+$/.test(text),
  );
  const labels = Array.from(
    body.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (m) => m[1].trim(),
  );
  assert.deepEqual(
    [...visibleText, ...labels].filter((text) => !dictionary[text]),
    [],
  );

  const capturedTranslations = readFileSync(
    new URL("i18n.js", captureRoot),
    "utf8",
  );
  const packagedTranslations = readFileSync(
    new URL("i18n.js", templateRoot),
    "utf8",
  );
  assert.equal(
    normalize(packagedTranslations),
    normalize(capturedTranslations).replace(
      '  "Kirish uchun bosing":',
      '  "The atelier": ["Ателье", "Atelier"],\n  "Kirish uchun bosing":',
    ),
    "the only template i18n change is the missing label translation",
  );

  const renderer = readFileSync(
    new URL("../apps/web/src/templates/toscana/renderer.tsx", import.meta.url),
    "utf8",
  );
  const barrel = readFileSync(
    new URL("../apps/web/src/templates/toscana/index.ts", import.meta.url),
    "utf8",
  );
  assert.match(
    renderer,
    /import type \{ Invitation, Locale \} from "@taklifnoma\/contracts"/,
  );
  assert.match(
    renderer,
    /<MarxabaInvitation \{\.\.\.props\} templateId="toscana" \/>/,
  );
  assert.match(barrel, /export \{ ToscanaInvitation \} from "\.\/renderer"/);
});

test("Toscana uses the approved map or hidden-empty fallback for its source venue-photo slot", () => {
  assert.match(html, /data-photo="venue\.photo"/);
  const contract = readFileSync(
    new URL("../packages/contracts/src/index.ts", import.meta.url),
    "utf8",
  );
  const venueSchema = contract.match(/venue:\s*z\.object\(\{([\s\S]*?)\}\)/)?.[1] ?? "";
  assert.doesNotMatch(venueSchema, /photo/);

  const readme = readFileSync(
    new URL("../apps/web/src/templates/toscana/README.md", import.meta.url),
    "utf8",
  );
  assert.match(readme, /`venue\.photo` slot has no field in the current[\s\S]*?creator editor/);
  assert.match(readme, /shows a map when coordinates are[\s\S]*?hides the empty-photo[\s\S]*?not a release blocker/);
  const adapter = readFileSync(new URL("../apps/web/public/templates/toscana/platform-adapter.css", import.meta.url), "utf8");
  assert.match(adapter, /\.venue__easel:has\(\.venue__print\.has-missing-photo\)\s*\{\s*display:\s*none/);
});
