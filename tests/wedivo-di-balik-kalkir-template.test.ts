import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const packaged = new URL(
  "../apps/web/public/templates/wedivo-di-balik-kalkir/",
  import.meta.url,
);
const original = new URL(
  "../Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Wedivo/Web invitations/templates/3EzL4d2Ra0jKGgi2xNCr/index.html",
  import.meta.url,
);

test("keeps the captured source byte-exact and packages local type assets", async () => {
  const [capture, preserved, html, fonts] = await Promise.all([
    readFile(original),
    readFile(new URL("source/captured-template.html", packaged)),
    readFile(new URL("index.html", packaged), "utf8"),
    readFile(new URL("assets/fonts.css", packaged), "utf8"),
  ]);
  assert.deepEqual(preserved, capture);
  assert.match(html, /assets\/fonts\.css/);
  assert.match(html, /assets\/art-01\.jpg/);
  assert.doesNotMatch(
    html,
    /wedivo-parameters|wedivo-preview-stub|sample-rundown-/,
  );
  assert.doesNotMatch(
    html,
    /prewedding\/|templateBridePhoto|templateGroomPhoto|uploads\/music/,
  );
  assert.match(html, /<title>Ravshan Muhabbat — Taklifnoma<\/title>/);
  assert.doesNotMatch(
    html,
    /Wijaya|Pratama|Grand Ballroom|Jakarta Selatan|Bandung|2026-11-19|2027-01-16|Maret 2019|Agustus 2020/,
  );
  assert.doesNotMatch(html, /Jumlah tamu|termasuk kamu/);
  assert.doesNotMatch(fonts, /https?:\/\//);
  assert.match(fonts, /font-family: 'Albert Sans'/);
  assert.match(fonts, /font-family: 'Ballet'/);
  assert.match(fonts, /font-family: 'Bellefair'/);
  assert.match(fonts, /font-family: 'Castoro'/);
});

test("routes only source-present supported guest forms to platform services", async () => {
  const bridge = await readFile(new URL("adapter.js", packaged), "utf8");
  assert.match(bridge, /\/rsvp`/);
  assert.match(bridge, /\/wishes`/);
  assert.match(bridge, /partySize: map\[status\] === "yes" \? 1 : 0/);
  assert.match(bridge, /show\("sec-gifts", false\)/);
  assert.match(bridge, /current\.preview\) return/);
  assert.match(bridge, /"cv-label": "Nikoh taklifnomasi"/);
  assert.match(bridge, /"cd-d-l": "Kun"/);
  assert.match(bridge, /compose\("cd-title", "Yana ", "ozgina", " qoldi"\)/);
  assert.match(bridge, /Taklifnomani ochish/);
});
