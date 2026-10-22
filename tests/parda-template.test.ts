import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";

const templateRoot = new URL(
  "../apps/web/public/templates/parda/",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/parda/",
  import.meta.url,
);

test("Parda retains the complete captured source and embroidered artwork", () => {
  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  const capturedHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  const body = (value: string) =>
    (value.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "")
      .replace(/\r\n/g, "\n")
      .trim();
  const appBody = body(html).replace(
    /<section class="section section--dress" id="dresscode"[\s\S]*?<\/section>/,
    "",
  ).replace(/\n[ \t]*\n/g, "\n");
  assert.equal(appBody, body(capturedHtml));
  assert.match(body(html), /data-section="dresscode"[^>]*data-platform-added/);

  for (const file of [
    "template.css",
    "template.js",
    "curtain-mesh.js",
    "embroidery.js",
    "i18n.js",
    "meta.js",
  ]) {
    const appSource = readFileSync(new URL(file, templateRoot), "utf8").replace(
      /\r\n/g,
      "\n",
    ).replace("preview-browser-capture.jpg", "preview.webp");
    assert.equal(
      file === "template.css"
        ? appSource
            .split("/* Platform-required dress-code section in the template palette. */")[0]
            .replace(/\n$/, "")
        : appSource,
      readFileSync(new URL(file, captureRoot), "utf8").replace(/\r\n/g, "\n"),
      `${file} must remain an exact source copy`,
    );
  }
  for (const file of readdirSync(new URL("art/", captureRoot))) {
    assert.deepEqual(
      readFileSync(new URL(`art/${file}`, templateRoot)),
      readFileSync(new URL(`art/${file}`, captureRoot)),
      `art/${file} must remain an exact source copy`,
    );
  }
  assert.match(
    readFileSync(new URL("template.css", templateRoot), "utf8"),
    /prefers-reduced-motion/,
  );
  assert.match(
    readFileSync(new URL("template.js", templateRoot), "utf8"),
    /reducedMotion/,
  );
  const responsiveStyles = readFileSync(
    new URL("template.css", templateRoot),
    "utf8",
  );
  assert.match(responsiveStyles, /@media\s*\(min-width:\s*700px\)/);
  assert.match(responsiveStyles, /@media\s*\(max-height:\s*700px\)/);
  assert.match(
    responsiveStyles,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)/,
  );
});

test("Parda uses local runtime dependencies and bundled fonts only", () => {
  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  assert.doesNotMatch(
    html,
    /sample-invitation\.js|fonts\.googleapis\.com|fonts\.gstatic\.com/,
  );
  assert.match(html, /shared\/nikoh\/platform-bridge\.js/);
  assert.match(html, /shared\/nikoh\/core\.js/);
  assert.match(html, /href="fonts\.css"/);

  const root = fileURLToPath(templateRoot);
  const localRefs = Array.from(
    html.matchAll(/(?:src|href)="([^"]+)"/g),
    (m) => m[1],
  ).filter((ref) => !/^https?:/i.test(ref) && !ref.startsWith("#"));
  const cssRefs = ["template.css", "fonts.css"].flatMap((file) =>
    Array.from(
      readFileSync(new URL(file, templateRoot), "utf8").matchAll(
        /url\(["']?([^"')]+)["']?\)/g,
      ),
      (m) => m[1],
    ),
  );
  for (const ref of [...localRefs, ...cssRefs].filter(
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
  assert.ok(existsSync(new URL("art/suzani.webp", templateRoot)));
  const preview = readFileSync(new URL("preview-browser-capture.jpg", templateRoot));
  assert.equal(preview.subarray(0, 2).toString("hex"), "ffd8");
  const dimensions = preview.indexOf(Buffer.from([0xff, 0xc0]));
  assert.ok(dimensions > 0);
  assert.deepEqual([preview.readUInt16BE(dimensions + 7), preview.readUInt16BE(dimensions + 5)], [478, 668]);
  assert.match(readFileSync(new URL("meta.js", templateRoot), "utf8"), /preview-browser-capture\.jpg/);
});

test("Parda preview provenance verifies the production fixture capture", () => {
  const provenance = JSON.parse(readFileSync(new URL("preview.provenance.json", templateRoot), "utf8"));
  const preview = readFileSync(new URL("preview-browser-capture.jpg", templateRoot));
  const fixture = readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url));
  assert.equal(provenance.status, "verified");
  assert.equal(provenance.route, "/preview?template=parda&qaSilent=1");
  assert.equal(provenance.fixtureSha256, createHash("sha256").update(fixture).digest("hex"));
  assert.equal(provenance.sha256, createHash("sha256").update(preview).digest("hex"));
});

test("Parda leaves unsupported To‘yona bank and note values empty", () => {
  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  const sharedContract = readFileSync(
    new URL("../packages/contracts/src/index.ts", import.meta.url),
    "utf8",
  );
  const adapter = readFileSync(
    new URL("../apps/web/src/templates/anor/renderer.tsx", import.meta.url),
    "utf8",
  );
  const giftSchema = sharedContract.match(/gift: z\.object\(\{[\s\S]*?\}\)/)?.[0] ?? "";
  const legacyGift = adapter.match(
    /toyona:\s*\{\s*enabled: invitation\.gift\.enabled,[\s\S]*?\n    \}/,
  )?.[0] ?? "";
  assert.match(html, /<p data-slot="toyona\.bank"><\/p>/);
  assert.match(html, /<p data-slot="toyona\.note"><\/p>/);
  assert.match(giftSchema, /cardNumber: z\.string/);
  assert.match(giftSchema, /cardHolder: short/);
  assert.doesNotMatch(giftSchema, /bank|note/i);
  assert.match(legacyGift, /note:\s*""/);
  assert.doesNotMatch(legacyGift, /bank\s*:/i);
  assert.doesNotMatch(legacyGift, /8600|AZIZ AZIZOV/);
});

test("Parda strings localize and typed wrapper fixes the source template ID", () => {
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
  runInNewContext(readFileSync(new URL("app-i18n.js", templateRoot), "utf8"), {
    window: dictionaryWindow,
  });
  const dictionary = dictionaryWindow.MARHAMAT_I18N;
  assert.ok(dictionary);

  const html = readFileSync(new URL("index.html", templateRoot), "utf8");
  const body = html.match(/<body[\s\S]*?<\/body>/)?.[0] ?? "";
  const visibleText = Array.from(body.matchAll(/>([^<>]+)</g), (match) =>
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
  const strings = [...visibleText, ...labels];
  assert.deepEqual(strings.filter((value) => !dictionary[value]), [], "all fixed and accessible copy has translation entries");
  for (const value of strings) {
    assert.ok(dictionary[value]?.[0], `Russian translation exists for ${value}`);
    assert.ok(dictionary[value]?.[1], `English translation exists for ${value}`);
  }
  assert.match(body, /data-slot="dressCode\.style"/);
  assert.match(body, /data-slot="dressCode\.text"/);
  assert.match(body, /data-slot="dressCode\.note"/);
  assert.match(body, /data-list="dresscode"/);

  const renderer = readFileSync(
    new URL("../apps/web/src/templates/parda/renderer.tsx", import.meta.url),
    "utf8",
  );
  const barrel = readFileSync(
    new URL("../apps/web/src/templates/parda/index.ts", import.meta.url),
    "utf8",
  );
  assert.match(
    renderer,
    /import type \{ Invitation, Locale \} from "@taklifnoma\/contracts"/,
  );
  assert.match(
    renderer,
    /<MarxabaInvitation \{\.\.\.props\} templateId="parda" \/>/,
  );
  assert.match(barrel, /export \{ PardaInvitation \} from "\.\/renderer"/);
});
