import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const sourceRoot = new URL("apps/web/public/templates/anor/source/", root);
const bridgePath = new URL("bridge.js", sourceRoot);

test("Anor adapter maps contract data while keeping sample wishes preview-only", () => {
  const renderer = readFileSync(
    new URL("apps/web/src/templates/anor/renderer.tsx", root),
    "utf8",
  );
  assert.match(
    renderer,
    /wishes:\s*sampleWishes\s*\?\s*getTemplatePreviewWishes\(locale\)\s*:\s*\[\]/,
  );
  assert.match(renderer, /program:\s*invitation\.program\.map/);
  assert.match(renderer, /gallery:\s*invitation\.gallery\.map/);
  assert.match(renderer, /dressCode:\s*\{/);
  assert.match(renderer, /cardNumber:\s*invitation\.gift\.cardNumber/);
  assert.match(renderer, /cardHolder:\s*invitation\.gift\.cardHolder/);
  assert.doesNotMatch(renderer, /sample-arrival|Javohir|Madina|8600 1234/);

  const fixture = JSON.parse(
    readFileSync(
      new URL("apps/web/src/modules/catalog/preview-sample.json", root),
      "utf8",
    ),
  );
  assert.deepEqual(fixture.enabledLocales, ["uz-Latn", "uz-Cyrl", "en", "ru"]);
  assert.equal(fixture.program.length, 6);
  assert.equal(fixture.gallery.length, 6);
  assert.equal(
    fixture.gallery.every((item: { url: string }) => item.url === ""),
    true,
  );
  assert.equal(fixture.dressCode.colors.length, 5);
  for (const locale of fixture.enabledLocales) {
    assert.equal(
      fixture.content[locale].programTitles
        ? Object.keys(fixture.content[locale].programTitles).length
        : 0,
      6,
    );
    assert.ok(fixture.dressCode.style[locale]);
    assert.ok(fixture.dressCode.text[locale]);
    assert.ok(fixture.dressCode.note[locale]);
    assert.equal(fixture.wishes[locale].length, 3);
  }
  assert.deepEqual(fixture.gift, {
    enabled: true,
    receiptUploadEnabled: false,
    cardNumber: "8600 1234 5678 9012",
    cardHolder: "AZIZ AZIZOV",
  });
  assert.deepEqual(fixture.contacts, {
    phoneNumber: "+998 90 123 45 67",
    telegramUsername: "@demo",
  });
});

test("Anor preview preserves source opening, dress code, program, wishes and gift/contact hooks", () => {
  const html = readFileSync(new URL("index.html", sourceRoot), "utf8");
  for (const fragment of [
    'id="intro"',
    'data-list="program"',
    'data-section="dresscode"',
    'data-list="dresscode"',
    'data-list="wishes"',
    'id="toyona"',
    'data-slot="toyona.cardNumber"',
    'data-slot="toyona.cardHolder"',
    'data-list="contacts"',
    'id="gallery"',
  ])
    assert.ok(html.includes(fragment), `missing source hook ${fragment}`);

  assert.match(html, /data-slot="dressCode\.style"/);
  assert.match(html, /data-slot="dressCode\.text"/);
  assert.match(html, /data-slot="dressCode\.note"/);
  const renderer = readFileSync(
    new URL("apps/web/src/templates/anor/renderer.tsx", root),
    "utf8",
  );
  assert.match(renderer, /dressCode:\s*\{/);

  const bridgeCss = readFileSync(new URL("bridge.css", sourceRoot), "utf8");
  assert.match(bridgeCss, /#toyona\s+\[data-slot="toyona\.bank"\]:empty/);
  assert.match(bridgeCss, /#toyona\s+\[data-slot="toyona\.note"\]:empty/);
  const bridge = readFileSync(bridgePath, "utf8");
  assert.match(bridge, /renderList\("dresscode"/);
  assert.match(bridge, /dresscode:\s*data\.dressCode\?\.enabled/);
});
