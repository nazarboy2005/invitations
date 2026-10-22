import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";
import { TEMPLATES } from "../packages/contracts/src/index.ts";

const root = new URL("../apps/web/public/templates/onlinetaklifnoma-zarrin-doppi/", import.meta.url);
const file = (name: string) => readFileSync(new URL(name, root), "utf8");

test("Zarrin do‘ppi uses the exact captured embroidery and source fonts", () => {
  const provenance = JSON.parse(file("source/assets-provenance.json"));
  assert.equal(provenance.assets.length, 20);
  for (const asset of provenance.assets) {
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    assert.ok(existsSync(new URL(`source/${asset.local}`, root)));
  }
  const motif = file("source/assets/doppi-girih.svg");
  assert.match(provenance.assets[0].sourceUrl, /zarrin-doppi\/full/);
  assert.match(motif, /viewBox='0 0 120 120'/);
  assert.ok(file("template.css").includes("doppi-girih.svg"));
  assert.ok(file("template.css").includes("Cormorant Garamond"));
  assert.ok(file("template.css").includes("Great Vibes"));
});

test("Zarrin do‘ppi binds the sunnat-toyi model and app interactions", () => {
  const html = file("index.html");
  const bridge = file("bridge.js");
  const css = file("template.css");
  assert.match(html, /data-bind="groom"/);
  assert.match(html, /data-bind="eventType"/);
  assert.match(bridge, /data\.guestName/);
  assert.match(bridge, /rsvp/);
  assert.match(bridge, /wishes/);
  assert.match(bridge, /data\.toyona\?\.enabled/);
  assert.match(bridge, /clipboard/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(html + bridge, /Abdulloh|Navro.{0,3}s saroyi|2026|1234 5678|cloudflareinsights|webhook/i);
});

test("Zarrin do‘ppi is registered as an unpublished sunnat-toyi design", () => {
  const template = TEMPLATES.find((item) => item.id === "zarrin-doppi");
  assert.equal(template?.published, false);
  assert.deepEqual(template?.supportedEventTypes, ["sunnat-toyi"]);
  const migration = readFileSync(new URL("../packages/database/migrations/0101_register_zarrin_doppi.sql", import.meta.url), "utf8");
  assert.match(migration, /'zarrin-doppi'.*false/s);
});
