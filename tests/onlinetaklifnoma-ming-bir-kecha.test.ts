import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";
import { TEMPLATES } from "../packages/contracts/src/index.ts";

const root = new URL("../apps/web/public/templates/onlinetaklifnoma-ming-bir-kecha/", import.meta.url);
const file = (name: string) => readFileSync(new URL(name, root), "utf8");

test("Ming bir kecha packages the exact recovered source artwork and fonts", () => {
  const provenance = JSON.parse(file("source/assets-provenance.json"));
  assert.equal(provenance.assets.length, 20);
  for (const asset of provenance.assets) {
    assert.match(asset.sourceUrl, /^https:\/\//);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    assert.ok(existsSync(new URL(`source/${asset.local}`, root)));
  }
  assert.ok(file("template.css").includes("71a55bb0516b6064.webp"));
  assert.ok(file("template.css").includes("Great Vibes"));
  assert.ok(file("template.css").includes("Cormorant Garamond"));
});

test("Ming bir kecha binds invitation data, app APIs, and optional owner gift data", () => {
  const html = file("index.html");
  const bridge = file("bridge.js");
  const css = file("template.css");
  assert.match(html, /data-bind="groom"/);
  assert.match(html, /data-bind="bride"/);
  assert.match(bridge, /data\.guestName/);
  assert.match(bridge, /rsvp/);
  assert.match(bridge, /wishes/);
  assert.match(bridge, /data\.toyona\?\.enabled/);
  assert.match(bridge, /clipboard/);
  assert.match(bridge, /qaSilent/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(html + bridge, /Akmal|Madina|Zarafshon|2026|1234 5678|cloudflareinsights|webhook/i);
});

test("Ming bir kecha is an unpublished wedding template", () => {
  const template = TEMPLATES.find((item) => item.id === "ming-bir-kecha");
  assert.equal(template?.published, false);
  assert.deepEqual(template?.supportedEventTypes, ["wedding"]);
  const migration = readFileSync(new URL("../packages/database/migrations/0100_register_ming_bir_kecha.sql", import.meta.url), "utf8");
  assert.match(migration, /'ming-bir-kecha'.*false/s);
});
