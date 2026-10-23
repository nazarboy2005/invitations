import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  createTemplatePreviewSample,
  getTemplatePreviewWishes,
  hasAuthoredInvitationContent,
} from "../apps/web/src/modules/catalog/preview-sample";
import { createInvitation } from "@taklifnoma/contracts";

const html = readFileSync(
  new URL("../apps/web/public/templates/oltin-nur/index.html", import.meta.url),
  "utf8",
);
const core = readFileSync(
  new URL("../apps/web/public/templates/shared/nikoh/core.js", import.meta.url),
  "utf8",
);
const coverPng = readFileSync(
  new URL("../apps/web/public/templates/oltin-nur/preview-capture.png", import.meta.url),
);
const coverWebp = readFileSync(
  new URL("../apps/web/public/templates/oltin-nur/preview.webp", import.meta.url),
);
const coverProvenance = JSON.parse(
  readFileSync(
    new URL("../apps/web/public/templates/oltin-nur/preview.provenance.json", import.meta.url),
    "utf8",
  ),
);
const capturedIndex = readFileSync(
  new URL(
    "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/oltin-nur/index.html",
    import.meta.url,
  ),
);
const captureManifest = readFileSync(
  new URL(
    "../Invitations - this folder will be removed from production/Marxaba/capture-manifest.json",
    import.meta.url,
  ),
);
const capturedStyles = readFileSync(
  new URL(
    "../Invitations - this folder will be removed from production/Marxaba/Nikoh/templates/oltin-nur/template.css",
    import.meta.url,
  ),
  "utf8",
);
const meta = readFileSync(
  new URL("../apps/web/public/templates/oltin-nur/meta.js", import.meta.url),
  "utf8",
);

function sha256(bytes: Buffer) {
  return createHash("sha256").update(bytes).digest("hex");
}

test("Oltin Nur catalog cover is the clean, portrait source intro with pinned provenance", () => {
  assert.match(meta, /preview: "preview\.webp"/);
  assert.deepEqual([coverPng.readUInt32BE(16), coverPng.readUInt32BE(20)], [720, 1280]);
  assert.equal(coverPng.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(coverWebp.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(coverWebp.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(coverProvenance.render.viewport.width, 720);
  assert.equal(coverProvenance.render.viewport.height, 1280);
  assert.equal(coverProvenance.render.pageSelector, "#intro");
  assert.deepEqual(coverProvenance.render.excluded, [
    ".mh-lang language switcher",
    "browser and app chrome",
    "scrollbars",
  ]);
  assert.equal(
    coverProvenance.artifacts.capture.sha256,
    sha256(coverPng),
  );
  assert.equal(coverProvenance.artifacts.catalog.sha256, sha256(coverWebp));
  assert.equal(coverProvenance.artifacts.catalog.width, 720);
  assert.equal(coverProvenance.artifacts.catalog.height, 1280);
  assert.equal(
    coverProvenance.source.dependencies.find(
      (dependency: { path: string }) => dependency.path === "capture-manifest.json",
    ).sha256,
    sha256(captureManifest),
  );
  assert.match(captureManifest.toString("utf8"), /Nikoh\/templates\/oltin-nur\/index\.html/);
  assert.equal(
    coverProvenance.source.dependencies.find(
      (dependency: { path: string }) => dependency.path.endsWith("/index.html"),
    ).sha256,
    sha256(capturedIndex),
  );
  assert.equal(
    coverProvenance.source.dependencies.find(
      (dependency: { path: string }) => dependency.path.endsWith("/template.css"),
    ).sha256,
    sha256(Buffer.from(capturedStyles)),
  );
  assert.match(capturedStyles, /names stay a secret on the cover/);
  assert.match(capturedStyles, /\.intro__name-lockup,\.intro__date,\.beam-title\{display:none\}/);
});

test("Oltin Nur's ephemeral sample covers its clothing, six-item program, wishes, gifts, and contacts", () => {
  const sample = createTemplatePreviewSample("oltin-nur");
  const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const;
  assert.deepEqual(sample.enabledLocales, locales);
  assert.equal(sample.program.length, 6);
  assert.equal(sample.dressCode.colors.length, 5);
  assert.equal(sample.gift.enabled, true);
  assert.equal(sample.gift.cardNumber, "8600 1234 5678 9012");
  assert.equal(sample.contacts.phoneNumber, "+998 90 123 45 67");
  assert.equal(sample.contacts.telegramUsername, "@demo");
  assert.equal(sample.gallery.length, 6);
  assert.ok(sample.gallery.every((photo) => !photo.url && !photo.alt && !photo.caption));

  for (const locale of locales) {
    const content = sample.content[locale];
    assert.equal(content.people.length, 2);
    assert.ok(content.programHeading);
    assert.ok(content.eventLabel);
    assert.ok(sample.dressCode.style[locale]);
    assert.ok(sample.dressCode.text[locale]);
    assert.ok(sample.dressCode.note[locale]);
    assert.ok(sample.dressCode.colors.every((color) => color.name[locale]));
    assert.ok(content.programTitles);
    assert.ok(sample.program.every((item) => content.programTitles[item.id]));
    assert.equal(getTemplatePreviewWishes(locale).length, 3);
  }
  assert.equal(sample.content["uz-Latn"].people[0], "Javohir");
  assert.equal(sample.content["uz-Latn"].people[1], "Madina");
});

test("Oltin Nur keeps the source sections and renders empty gallery photos as an icon", () => {
  for (const section of ["program", "dresscode", "gallery", "toyona", "contacts"])
    assert.match(html, new RegExp(`data-section="${section}"`));
  assert.match(html, /data-list="program"/);
  assert.match(html, /data-list="dresscode"/);
  assert.match(html, /data-list="wishes"/);
  assert.match(html, /data-list="contacts"/);
  assert.match(html, /data-photo alt="To‘y surati"/);
  assert.match(core, /if\(!source\)image\.setAttribute\('aria-hidden','true'\)/);
  assert.match(core, /placeholder\.textContent='✦'/);
  const stepper = core.slice(core.indexOf("function setupGallery()"), core.indexOf("function setupSections()"));
  assert.match(stepper, /index=\(number\+state\.items\.length\) % state\.items\.length/);
  assert.match(stepper, /behavior: reducedMotion\?'instant':'smooth'/);
});

test("Oltin Nur sample text is isolated from a new saved invitation", () => {
  const blank = createInvitation("oltin-nur");
  const sample = createTemplatePreviewSample("oltin-nur");
  assert.equal(hasAuthoredInvitationContent(blank), false);
  assert.equal(blank.content["uz-Latn"].people.length, 0);
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.gift.cardNumber, "");
  assert.notDeepEqual(blank.content, sample.content);
  assert.doesNotMatch(JSON.stringify(blank), /Javohir|Madina|8600 1234|Dilnoza opa/);
});

test("unsupported empty To'yona rows are hidden in a scoped adapter", () => {
  const adapter = readFileSync(
    new URL("../apps/web/public/templates/oltin-nur/contract-adapter.css", import.meta.url),
    "utf8",
  );
  const notes = readFileSync(
    new URL("../apps/web/public/templates/oltin-nur/SOURCE_ADAPTATIONS.md", import.meta.url),
    "utf8",
  );
  assert.match(html, /href="contract-adapter\.css"/);
  assert.match(adapter, /#toyona \[data-slot="toyona\.note"\]:empty/);
  assert.match(adapter, /#gift-modal \[data-slot="toyona\.bank"\]:empty/);
  assert.match(notes, /never written through save\/publication[\s\S]*?paths/);
});
