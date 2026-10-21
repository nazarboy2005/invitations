import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const templateRoot = new URL(
  "../apps/web/public/templates/vals/",
  import.meta.url,
);
const captureRoot = new URL(
  "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/vals/",
  import.meta.url,
);
const html = readFileSync(new URL("index.html", templateRoot), "utf8");
const body = (source: string) =>
  source.match(/<body[\s\S]*?<\/body>/)?.[0]?.trim() ?? "";
const normalize = (source: string) => source.replace(/\r\n/g, "\n");

test("Vals exposes a typed renderer entry that fixes the source template ID", () => {
  const renderer = readFileSync(
    new URL("../apps/web/src/templates/vals/renderer.tsx", import.meta.url),
    "utf8",
  );
  const entry = readFileSync(
    new URL("../apps/web/src/templates/vals/index.ts", import.meta.url),
    "utf8",
  );
  assert.match(renderer, /ComponentProps<typeof MarxabaInvitation>/);
  assert.match(renderer, /Omit<[\s\S]*"templateId"/);
  assert.match(
    renderer,
    /<MarxabaInvitation \{\.\.\.props\} templateId="vals" \/>/,
  );
  assert.match(entry, /export \{ ValsInvitation \} from "\.\/renderer"/);
  assert.doesNotMatch(renderer, /templateId:\s*string/);
});

test("Vals preserves the full captured design, animation, and artwork", () => {
  const sourceHtml = readFileSync(new URL("index.html", captureRoot), "utf8");
  assert.equal(
    body(html),
    body(sourceHtml),
    "visible template markup must match the source",
  );
  for (const file of ["template.css", "template.js", "waltz.js", "meta.js"]) {
    assert.equal(
      normalize(readFileSync(new URL(file, templateRoot), "utf8")),
      normalize(readFileSync(new URL(file, captureRoot), "utf8")),
      `${file} must remain identical to its captured implementation`,
    );
  }
  for (const asset of [
    "art/room.webp",
    "art/ballroom.webp",
    "art/chandelier.webp",
    "art/waltz.webp",
  ]) {
    assert.deepEqual(
      readFileSync(new URL(asset, templateRoot)),
      readFileSync(new URL(asset, captureRoot)),
      `${asset} must be an exact local copy`,
    );
  }
  const preview = readFileSync(new URL("preview.webp", templateRoot));
  const provenance = JSON.parse(
    readFileSync(new URL("preview.provenance.json", templateRoot), "utf8"),
  ) as {
    artifact: string;
    sha256: string;
    width: number;
    height: number;
    route: string;
    fixture: string;
    fixtureSha256: string;
    capture: {
      sourceFolder: string;
      selector: string;
      viewport: { width: number; height: number; deviceScaleFactor: number };
      source: {
        indexHtmlSha256: string;
        templateCssSha256: string;
        templateJsSha256: string;
        waltzAnimationSha256: string;
        roomArtSha256: string;
      };
    };
  };
  const sha256 = (value: Buffer) =>
    createHash("sha256").update(value).digest("hex");
  assert.equal(provenance.artifact, "preview.webp");
  assert.equal(provenance.sha256, sha256(preview));
  assert.equal(preview.toString("ascii", 0, 4), "RIFF");
  assert.equal(preview.toString("ascii", 8, 12), "WEBP");
  assert.equal(preview.toString("ascii", 12, 16), "VP8 ");
  assert.deepEqual(Array.from(preview.subarray(23, 26)), [0x9d, 0x01, 0x2a]);
  assert.equal(preview.readUInt16LE(26) & 0x3fff, 720);
  assert.equal(preview.readUInt16LE(28) & 0x3fff, 1280);
  assert.deepEqual([provenance.width, provenance.height], [720, 1280]);
  assert.equal(provenance.route, "/preview?template=vals&qaSilent=1");
  assert.equal(
    provenance.fixture,
    "apps/web/src/modules/catalog/preview-sample.json",
  );
  assert.equal(
    provenance.fixtureSha256,
    sha256(
      readFileSync(
        new URL(
          "../apps/web/src/modules/catalog/preview-sample.json",
          import.meta.url,
        ),
      ),
    ),
  );
  assert.equal(
    provenance.capture.source.indexHtmlSha256,
    sha256(readFileSync(new URL("index.html", captureRoot))),
  );
  assert.equal(
    provenance.capture.sourceFolder,
    "Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/vals",
  );
  assert.equal(provenance.capture.selector, "#intro");
  assert.deepEqual(
    provenance.capture.viewport,
    { width: 720, height: 1280, deviceScaleFactor: 1 },
  );
  for (const [file, recordedHash] of [
    ["template.css", provenance.capture.source.templateCssSha256],
    ["template.js", provenance.capture.source.templateJsSha256],
    ["waltz.js", provenance.capture.source.waltzAnimationSha256],
  ] as const) {
    assert.equal(
      recordedHash,
      sha256(readFileSync(new URL(file, captureRoot))),
      `provenance hash must describe captured ${file}`,
    );
  }
  assert.equal(
    provenance.capture.source.roomArtSha256,
    sha256(readFileSync(new URL("art/room.webp", captureRoot))),
  );
  assert.equal(
    readFileSync(new URL("meta.js", templateRoot), "utf8"),
    readFileSync(new URL("meta.js", captureRoot), "utf8"),
    "catalog metadata must remain the captured metadata",
  );
  assert.match(html, /<meta property="og:image" content="preview\.webp">/);
  assert.match(body(html), /<section class="intro" id="intro"/);
  const script = readFileSync(new URL("template.js", templateRoot), "utf8");
  assert.match(script, /reducedMotion/);
  assert.match(script, /const openOnce = \(\) =>/);
  assert.match(script, /function finishIntro\(\)/);
  assert.match(
    readFileSync(new URL("template.css", templateRoot), "utf8"),
    /prefers-reduced-motion/,
  );
  assert.doesNotMatch(
    html,
    /fonts\.googleapis\.com|sample-invitation\.js|sample-overrides\.js/,
  );
});

test("Vals maps the visible invitation content and interactions to contract hooks", () => {
  const sourceBody = body(html);
  for (const binding of [
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
    'data-list="program"',
    'data-list="gallery"',
    'data-list="wishes"',
    'data-list="contacts"',
    'data-slot="toyona.cardNumber"',
    'data-slot="toyona.cardHolder"',
    'data-copy="toyona.cardNumber"',
    'data-rsvp-choice="yes"',
    'data-rsvp-choice="no"',
    'data-rsvp-choice="maybe"',
  ])
    assert.ok(
      sourceBody.includes(binding),
      `Missing typed contract hook: ${binding}`,
    );
});

test("Vals serves local Latin and Cyrillic fonts", () => {
  const css = readFileSync(new URL("fonts.css", templateRoot), "utf8");
  assert.match(css, /font-family: 'Cormorant Garamond'/);
  assert.match(css, /font-family: 'Great Vibes'/);
  assert.match(css, /U\+0400-045F/);
  for (const [, asset] of css.matchAll(/url\(['"]?([^'")]+\.woff2)['"]?\)/g)) {
    assert.ok(existsSync(new URL(asset, templateRoot)), `${asset} is missing`);
  }
});

test("Vals localizes all static text and page metadata", () => {
  const window: { MARHAMAT_I18N?: Record<string, [string, string]> } = {};
  runInNewContext(
    readFileSync(
      new URL(
        "../apps/web/public/templates/shared/nikoh/i18n.js",
        import.meta.url,
      ),
      "utf8",
    ),
    { window },
  );
  runInNewContext(readFileSync(new URL("i18n.js", templateRoot), "utf8"), {
    window,
  });
  const translations = window.MARHAMAT_I18N;
  assert.ok(translations);

  const content = `${body(html)} ${html.match(/<meta\s+[^>]*content="[^"]+"[^>]*>/g)?.join(" ") ?? ""}`;
  const textNodes = Array.from(content.matchAll(/>([^<>]+)</g), (match) =>
    match[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim(),
  ).filter(
    (text) =>
      text.length > 1 &&
      !["&", "✦"].includes(text) &&
      !/^№?\s*[\d /·—-]+$/.test(text),
  );
  const attributes = Array.from(
    body(html).matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g),
    (match) => match[1].replace(/\s+/g, " ").trim(),
  );
  assert.deepEqual(
    [...textNodes, ...attributes].filter((text) => !translations[text]),
    [],
  );
  assert.deepEqual(Array.from(translations["Vals · Taklifnoma"] ?? []), [
    "Вальс · Приглашение",
    "Waltz · Invitation",
  ]);
});
