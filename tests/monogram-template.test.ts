import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL(
  "../apps/web/public/templates/monogram/",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/monogram/",
  import.meta.url,
);
const text = (root: URL, file: string) =>
  readFileSync(new URL(file, root), "utf8");
const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const body = (source: string) =>
  source.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";

test("Monogram preserves the captured template body, styles, animation, and metadata", () => {
  const capturedBody = body(text(captureRoot, "index.html")).replace(
    '<span data-slot="eventType"></span><span>— MMXXVI</span>',
    '<span data-slot="eventType"></span><span>— <span data-slot="date.year"></span></span>',
  );
  assert.equal(
    normalize(body(text(templateRoot, "index.html"))),
    normalize(capturedBody),
    "the only markup change binds the year to invitation data",
  );
  for (const file of ["template.css", "template.js", "meta.js", "i18n.js"]) {
    if (file === "template.css") {
      const appStyles = text(templateRoot, file).replace(
        /\n\/\* Platform adaptation: hide blank gift fields omitted from the approved invitation contract\. \*\/\n#toyona \[data-slot="toyona\.note"\]:empty,#toyona \[data-slot="toyona\.bank"\]:empty\{display:none\}\n?$/,
        "",
      );
      assert.equal(
        normalize(appStyles),
        normalize(text(captureRoot, file)),
        "the only style addition hides empty unsupported contract slots",
      );
    } else if (file === "i18n.js") {
      const appTranslations = text(templateRoot, file).replace(
        /,\s*"Surat tanlash": \["Выбрать фото", "Choose photo"\]/,
        "",
      );
      assert.equal(
        normalize(appTranslations),
        normalize(text(captureRoot, file)),
        "the only translation addition localizes the gallery control",
      );
    } else {
      assert.equal(
        normalize(text(templateRoot, file)),
        normalize(text(captureRoot, file)),
        `${file} must match the untouched capture`,
      );
    }
  }

  const html = text(templateRoot, "index.html");
  assert.ok(html.includes('id="open-invitation"'));
  for (const section of [
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
  ]) {
    assert.ok(
      body(html).includes(`data-section="${section}"`),
      `missing ${section} section`,
    );
  }
  assert.ok(
    !html.includes("fonts.googleapis.com"),
    "runtime must not fetch fonts from Google",
  );
  assert.ok(
    !html.includes("sample-invitation.js"),
    "runtime must not load Marxaba's sample invitation",
  );
  assert.ok(html.includes("../shared/nikoh/platform-bridge.js"));
  assert.match(text(templateRoot, "template.js"), /reducedMotion/);
  assert.match(
    text(templateRoot, "template.css"),
    /prefers-reduced-motion:\s*reduce/,
  );
});

test("Monogram fonts are local and cover the captured display and script faces", () => {
  const fonts = text(templateRoot, "fonts.css");
  for (const family of ["Bodoni Moda", "Pinyon Script"])
    assert.ok(fonts.includes(`font-family:"${family}"`));
  for (const [, asset] of fonts.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
  assert.ok(!fonts.includes("http"));
});

test("Monogram catalog art is a portrait WebP captured from its source opening", () => {
  const meta = text(templateRoot, "meta.js");
  const image = readFileSync(new URL("preview.webp", templateRoot));
  assert.match(meta, /preview:\s*"preview\.webp"/);
  assert.equal(image.toString("ascii", 0, 4), "RIFF");
  assert.equal(image.toString("ascii", 8, 12), "WEBP");
  assert.equal(image.toString("ascii", 12, 16), "VP8 ");
  const width = image.readUInt16LE(26) & 0x3fff;
  const height = image.readUInt16LE(28) & 0x3fff;
  assert.deepEqual([width, height], [720, 1200]);
  assert.ok(
    text(templateRoot, "SOURCE_ADAPTATIONS.md").includes(
      "actual captured opening screen",
    ),
  );
});

test("Monogram static text and accessibility labels have Uzbek, Russian, and English variants", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(text(templateRoot, "i18n.js"), { window });
  const translations = window.MARHAMAT_I18N!;
  const html = text(templateRoot, "index.html");
  const visible = [
    ...html.matchAll(/>([^<>]+)</g),
    ...html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
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
        !["&", "♫", "↗", "‹", "›", "＋", "M / 01"].includes(value) &&
        !/^№?\s*[\d /·—-]+$/.test(value),
    );
  const missing = [...new Set(visible)].filter((value) => !translations[value]);
  assert.deepEqual(missing, []);
  for (const [key, variants] of Object.entries(translations)) {
    assert.equal(
      variants.length,
      2,
      `${key} needs Russian and English strings`,
    );
    assert.ok(
      variants.every((value) => value.trim()),
      `${key} has an empty locale`,
    );
  }
});

test("Monogram routes through the shared typed Marxaba invitation renderer", () => {
  const marxabaIndex = text(
    new URL("../apps/web/src/templates/marxaba/", import.meta.url),
    "index.ts",
  );
  assert.match(marxabaIndex, /"monogram"/);
  const adapter = text(
    new URL("../apps/web/src/templates/monogram/", import.meta.url),
    "renderer.tsx",
  );
  assert.match(
    adapter,
    /import type \{ Invitation, Locale \} from "@taklifnoma\/contracts"/,
  );
  assert.match(
    adapter,
    /<MarxabaInvitation \{\.\.\.props\} templateId="monogram" \/>/,
  );
});
