import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { templateById } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = process.cwd();
const pub = path.join(root, "apps/web/public/templates/golden-hour");
const source = path.join(
  root,
  "Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz",
);
const read = (base: string, file: string) =>
  readFileSync(path.join(base, file), "utf8");

test("Golden Hour is published for birthday events", () => {
  const template = templateById("golden-hour");
  assert.ok(template);
  assert.equal(template.published, true);
  assert.equal(template.previewEventType, "birthday");
  assert.deepEqual(template.categoryIds, ["birthday"]);
  assert.deepEqual(template.supportedEventTypes, ["birthday"]);
  assert.equal(template.priceMinor, 15_000_000);
  assert.equal(
    template.previewImage,
    "/templates/golden-hour/assets/images/golden-hour/pink.png",
  );
  assert.equal(
    createTemplatePreviewSample("golden-hour").eventType,
    "birthday",
  );
});

test("catalog artwork is the exact portrait hero image from the capture", () => {
  const packaged = readFileSync(
    path.join(pub, "assets/images/golden-hour/pink.png"),
  );
  const original = readFileSync(
    path.join(source, "assets/images/golden-hour/pink.png"),
  );
  assert.equal(packaged.readUInt32BE(16), 744);
  assert.equal(packaged.readUInt32BE(20), 1280);
  assert.equal(
    createHash("sha256").update(packaged).digest("hex"),
    createHash("sha256").update(original).digest("hex"),
  );
});

test("local package keeps the captured structure and avoids site runtime requests", () => {
  const html = read(pub, "index.html");
  const fonts = read(pub, "assets/css/fonts.css");
  const css = read(pub, "assets/css/golden-hour.css");
  const sourceBehavior = read(pub, "assets/js/golden-hour-source.js");
  const adapter = read(pub, "assets/js/golden-hour-adapter.js");
  for (const file of [
    "assets/css/contract-adapter.css",
    "assets/js/golden-hour-source.js",
    "assets/fonts",
    "assets/images/golden-hour/flowers.png",
    "assets/images/golden-hour/flocake.png",
    "assets/images/golden-hour/location.png",
    "assets/images/golden-hour/footerimage.png",
  ])
    assert.ok(existsSync(path.join(pub, file)), `${file} is packaged`);
  assert.match(html, /class="hero"/);
  assert.match(html, /class="timing"/);
  assert.match(html, /class="rsvp-form/);
  assert.match(html, /golden-hour-adapter\.js/);
  assert.match(html, /golden-hour-source\.js/);
  assert.doesNotMatch(html, /google-analytics|googletagmanager|lanadel\.mp3/i);
  assert.doesNotMatch(fonts, /https?:\/\//i);
  const fontUrls = [...fonts.matchAll(/url\(([^)]+)\)/g)].map(([_, url]) =>
    url.replace(/["']/g, ""),
  );
  assert.equal((fonts.match(/@font-face/g) || []).length, 39);
  assert.equal(new Set(fontUrls).size, 23);
  for (const fontUrl of fontUrls)
    assert.ok(
      existsSync(
        path.resolve(
          path.dirname(path.join(pub, "assets/css/fonts.css")),
          fontUrl,
        ),
      ),
      `${fontUrl} resolves to a local font file`,
    );
  assert.match(css, /prefers-reduced-motion/);
  assert.match(adapter, /"uz-Latn"/);
  assert.match(adapter, /"uz-Cyrl"/);
  assert.match(adapter, /en:/);
  assert.match(adapter, /ru:/);
  assert.match(adapter, /\/rsvp/);
  assert.match(adapter, /\/wishes/);
  assert.match(adapter, /data\.catalogPreview/);
  assert.match(adapter, /guestToken/);
  assert.match(sourceBehavior, /threshold: 0\.18/);
  assert.match(sourceBehavior, /setInterval\(updateCountdown, 1000\)/);
  assert.match(sourceBehavior, /musicToggle\.addEventListener\("click"/);
  assert.doesNotMatch(sourceBehavior, /window\.addEventListener\("load"/);
  assert.doesNotMatch(adapter, /MADINA|lanadel\.mp3|<\?php/i);
});

test("source stylesheet, script, and five artwork files are preserved exactly", () => {
  const assets: Array<[string, string]> = [
    ["assets/css/golden-hour.css", "assets/css/golden-hour.css"],
    ["assets/js/golden-hour.js", "assets/js/golden-hour-reference.js"],
    ["assets/audio/lanadel.mp3", "assets/audio/lanadel.mp3"],
    [
      "assets/images/golden-hour/pink.png",
      "assets/images/golden-hour/pink.png",
    ],
    [
      "assets/images/golden-hour/flowers.png",
      "assets/images/golden-hour/flowers.png",
    ],
    [
      "assets/images/golden-hour/flocake.png",
      "assets/images/golden-hour/flocake.png",
    ],
    [
      "assets/images/golden-hour/location.png",
      "assets/images/golden-hour/location.png",
    ],
    [
      "assets/images/golden-hour/footerimage.png",
      "assets/images/golden-hour/footerimage.png",
    ],
  ];
  for (const [captured, packaged] of assets) {
    assert.deepEqual(
      readFileSync(path.join(pub, packaged)),
      readFileSync(path.join(source, captured)),
      `${captured} matches its captured bytes`,
    );
  }
});

test("Golden Hour omits unsupported gift fields absent from its source", () => {
  const renderer = read(root, "apps/web/src/templates/invitate/renderer.tsx");
  const adapter = read(
    root,
    "apps/web/src/templates/invitate/golden-hour/adapter.ts",
  );
  const sharedMapper = read(root, "apps/web/src/templates/anor/renderer.tsx");
  const registry = read(root, "apps/web/src/templates/invitate/registry.ts");
  const migration = read(
    root,
    "packages/database/migrations/0127_register_golden_hour_template.sql",
  );
  for (const field of [
    "content.title",
    "content.personalGreeting",
    "content.message",
    "invitation.timezone",
    "invitation.program",
    "invitation.venue",
    "invitation.gallery",
    "invitation.rsvp",
    "invitation.wishes",
    "invitation.dressCode",
  ])
    assert.ok(adapter.includes(field), `${field} is mapped`);
  assert.match(adapter, /makeLegacyData\(invitation, locale/);
  for (const field of [
    "invitation.startsAt",
    "invitation.music",
    "invitation.contacts",
  ])
    assert.ok(
      sharedMapper.includes(field),
      `${field} is carried by the shared mapper`,
    );
  assert.match(renderer, /makeGoldenHourData/);
  assert.match(renderer, /useInvitationExtras/);
  assert.match(registry, /"golden-hour"/);
  assert.match(migration, /VALUES \('golden-hour', 'birthday'\)/);
  assert.match(migration, /published = false/);
  assert.doesNotMatch(adapter, /invitation\.gift|gift:/);
  const sourceHtml = read(source, "golden-hour.html");
  const sourceCss = read(source, "assets/css/golden-hour.css");
  const sourceJs = read(source, "assets/js/golden-hour.js");
  for (const [file, text] of [
    ["source HTML", sourceHtml],
    ["source CSS", sourceCss],
    ["source JavaScript", sourceJs],
  ] as const)
    assert.doesNotMatch(
      text,
      /gift|to.?yana|to.?yona|toyona|cardholder|cardnumber|sovg/i,
      `${file} contains no gift section or card entry`,
    );
  const packageHtml = read(pub, "index.html");
  const packageScript = read(pub, "assets/js/golden-hour-adapter.js");
  const packageCss = read(pub, "assets/css/contract-adapter.css");
  assert.doesNotMatch(packageHtml, /gift-section|gift-number|gift-copy/i);
  assert.doesNotMatch(
    packageScript,
    /gift|to.?yana|to.?yona|toyona|cardholder|cardnumber|sovg/i,
  );
  assert.match(packageCss, /data-platform-extra="receipt"/);
});
