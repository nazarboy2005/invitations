import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { templateById } from "../packages/contracts/src/index";

const root = new URL("../apps/web/public/templates/green-white/", import.meta.url);
const archive = new URL(
  "../Invitations - this folder will be removed from production/Chorlove/Web invitations/",
  import.meta.url,
);

test("Green White preserves its captured page and original design assets", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  const source = await readFile(new URL("source/preview-frame.html", root));
  const original = await readFile(
    new URL("templates/green-white/preview-frame.html", archive),
  );
  assert.deepEqual(source, original);
  assert.equal(createHash("sha256").update(source).digest("hex"), manifest.source.sha256);
  assert.equal(source.length, manifest.source.bytes);

  for (const asset of manifest.copiedDesignAssets) {
    const bytes = await readFile(new URL(asset.file, root));
    const archiveFile = asset.archiveFile.replace(/^Chorlove\/Web invitations\//, "");
    assert.deepEqual(bytes, await readFile(new URL(archiveFile, archive)), asset.file);
    assert.equal(bytes.length, asset.bytes, asset.file);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, asset.file);
  }
  for (const style of manifest.capturedStylesheets) {
    const bytes = await readFile(new URL(style.file, root));
    const archiveFile = style.archiveFile.replace(/^Chorlove\/Web invitations\//, "");
    assert.deepEqual(bytes, await readFile(new URL(archiveFile, archive)), style.file);
  }
  assert.equal(manifest.copiedDesignAssets.length, 8);
  assert.deepEqual(manifest.missingSourceAssets, ["images/green-white/arka2.webp"]);
  const recovered = manifest.sourceAssetsFromLive.find((asset: { file: string }) => asset.file === "assets/arka2.jpg");
  assert.ok(recovered);
  const recoveredBytes = await readFile(new URL(recovered.file, root));
  assert.equal(recoveredBytes.length, recovered.bytes);
  assert.equal(createHash("sha256").update(recoveredBytes).digest("hex"), recovered.sha256);
  assert.equal(recovered.mimeType, "image/jpeg");
  assert.match(recovered.sourceUrl, /green-white%2Farka2\.webp&w=1200&q=75/);
  await assert.rejects(readFile(new URL("images/green-white/arka2.webp", archive)));
});

test("Green White runtime is isolated and maps the captured sections to the shared contract", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const names = (html.match(/<section\b/g) || []).length;
  assert.equal(names, 14);
  assert.match(html, /data-chorlove-template="green-white"/);
  assert.match(html, /src="\/templates\/green-white\/bridge\.js"/);
  assert.doesNotMatch(html, /<script[^>]+_next\/static|googletagmanager|telegram\.org\/js|Patrick Watson/i);
  assert.doesNotMatch(html, /orchid-amplop|gallery-[1-6]\.webp|chorlove\.uz|Muhammad|Xadicha|5614/);
  assert.equal((html.match(/src="\/templates\/green-white\/assets\//g) || []).length, 58);
  assert.match(html, /src="\/templates\/green-white\/assets\/arka2\.jpg"/);
  assert.match(bridge, /dressCode/);
  assert.match(bridge, /navigator\.clipboard\.writeText/);
  assert.match(bridge, /\/api\/public\/invitations\/.*\/\$\{kind\}/);
  assert.match(bridge, /encodeURIComponent\(payload\.invitationId/);
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bridge, /Math\.min\(Number\(payload\.data\.rsvp\?\.maxPartySize\) \|\| 1, 100\)/);
  assert.match(bridge, /\$\{id\}:language/);
  assert.match(bridge, /\$\{id\}:update/);
  const publicRoot = new URL("../apps/web/public/", import.meta.url);
  const dependencies = [...html.matchAll(/(?:src|href)="(\/templates\/[^"#]+)"/g)].map((match) => match[1]);
  for (const dependency of dependencies) {
    await readFile(new URL(dependency.slice(1), publicRoot));
  }
});

test("Green White built-in controls are localized in all four supported locales", async () => {
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const match = bridge.match(/const copy = (\{[\s\S]*?\n  \});/);
  assert.ok(match);
  const copy = runInNewContext(`(${match[1]})`);
  const fields = [
    "welcome", "title", "couple", "invite", "date", "countdown", "countdownCaption",
    "venue", "map", "gift", "giftHeading", "cardHolder", "copy", "copied", "copyError",
    "gallery", "dressCode", "dressIntro", "wishes", "wishIntro", "wish", "rsvp", "rsvpPrompt",
    "yes", "no", "send", "guest", "guestFull", "saved", "submitted", "error", "preview",
    "guestRequired", "wishRequired", "chooseResponse", "responseLabel", "partySize", "days",
    "hours", "minutes", "seconds", "photo", "close", "next", "previous", "hosts", "contact",
    "language", "playMusic", "pauseMusic", "musicUnavailable", "footer",
  ];
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"]) {
    for (const field of fields) assert.equal(typeof copy[locale][field], "string", `${locale}.${field}`);
  }
  assert.equal(copy["uz-Cyrl"].rsvp, "\u041a\u0435\u043b\u0430\u0441\u0438\u0437\u043c\u0438?");
  assert.equal(copy.ru.rsvp, "\u0412\u044b \u043f\u0440\u0438\u0434\u0451\u0442\u0435?");
});

test("Green White is registered for internal wedding preview and remains unpublished", async () => {
  const item = templateById("green-white");
  assert.ok(item);
  assert.equal(item.published, false);
  assert.equal(item.priceMinor, 15000000);
  assert.deepEqual(item.categoryIds, ["wedding"]);
  assert.deepEqual(item.supportedEventTypes, ["wedding"]);
  const migration = await readFile(
    new URL("../packages/database/migrations/0113_register_green_white.sql", import.meta.url),
    "utf8",
  );
  assert.match(migration, /VALUES \('green-white', 'Green White', 15000000, 'UZS', false\)/);
  assert.match(migration, /VALUES \('green-white', 'wedding'\)/);
});
