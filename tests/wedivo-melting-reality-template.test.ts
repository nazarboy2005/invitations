import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import { createInvitation, LOCALES } from "../packages/contracts/src/index";

const base = new URL("../apps/web/public/templates/wedivo-melting-reality/", import.meta.url);
const require = createRequire(import.meta.url);
const { makeMeltingRealityPayload } = require("../apps/web/src/templates/wedivo-melting-reality/adapter") as typeof import("../apps/web/src/templates/wedivo-melting-reality/adapter");
const { createTemplatePreviewSample } = require("../apps/web/src/modules/catalog/preview-sample") as typeof import("../apps/web/src/modules/catalog/preview-sample");
const sha = (value: Uint8Array) => createHash("sha256").update(value).digest("hex");

test("capture is unchanged and every packaged source dependency matches captured bytes", async () => {
  const provenance = JSON.parse(await readFile(new URL("source/provenance.json", base), "utf8"));
  const original = await readFile(new URL(`../${provenance.sourcePath}`, import.meta.url));
  assert.equal(sha(original), provenance.sourceSha256);
  for (const asset of provenance.assets) {
    assert.equal(sha(await readFile(new URL(asset.file, base))), asset.sha256, asset.file);
  }
  const fonts = await readFile(new URL("assets/fonts.css", base), "utf8");
  for (const family of ["Fraunces", "Newsreader", "Syne", "Caveat"]) assert.ok(fonts.includes(`'${family}'`));
  assert.doesNotMatch(fonts, /https?:\/\//);
});

test("production source excludes provider runtime, credentials, captured invitation data and headcount", async () => {
  const html = await readFile(new URL("index.html", base), "utf8");
  const engine = await readFile(new URL("source/template.js", base), "utf8");
  assert.doesNotMatch(html + engine, /AIza|Bagas|Aulia|Nayla|Aksa|sample-rundown|wedivo-parameters|wedivo-preview-stub|2026-11-19|2027-06-12|uploads\/music|prewedding\//);
  assert.doesNotMatch(html, /id="rsvp-pax(?:-lbl)?"|name="guestCount"|name="pax"/);
  assert.match(engine, /window\.MELTING\.gallery/);
  assert.match(engine, /window\.MELTING\.colorCount/);
  assert.match(engine, /window\.MELTING\.storyCount/);
  assert.match(engine, /window\.MELTING\.timezone/);
  assert.match(engine, /window\.MELTING\.userPaused/);
});

test("source painting CSS and melt geometry are reused rather than redrawn", async () => {
  const provenance = JSON.parse(await readFile(new URL("source/provenance.json", base), "utf8"));
  const original = await readFile(new URL(`../${provenance.sourcePath}`, import.meta.url), "utf8");
  let expectedCss = [...original.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]).join("\n").replace(/@import\s+url\([^)]*\)\s*;/g, "");
  for (const asset of provenance.assets) expectedCss = expectedCss.replaceAll(asset.url, `/templates/wedivo-melting-reality/${asset.file}`);
  const normalized = (text: string) => text.replaceAll("\r\n", "\n");
  assert.equal(normalized(await readFile(new URL("source/template.css", base), "utf8")), normalized(expectedCss));
  const engine = await readFile(new URL("source/template.js", base), "utf8");
  const geometry = (text: string) => text.slice(text.indexOf("        /* jam meleleh */"), text.indexOf("        /* ---------- putaran animasi tunggal ---------- */"));
  assert.ok(geometry(engine).length > 10000);
  assert.equal(normalized(geometry(engine)), normalized(geometry(original)));
});

test("all four locale payloads preserve authored fields, ordered IDs and invitation data", () => {
  const invitation = createTemplatePreviewSample("wedivo-melting-reality");
  invitation.story = Array.from({ length: 6 }, (_, i) => ({ id: `story-${i}`, title: Object.fromEntries(LOCALES.map(locale => [locale, `${locale} title ${i}`])), text: Object.fromEntries(LOCALES.map(locale => [locale, `${locale} text ${i}`])) }));
  const original = structuredClone(invitation);
  for (const locale of LOCALES) {
    const message = makeMeltingRealityPayload(invitation, locale, { invitationId: "public-id", guestName: "Guest", guestToken: "guest-token", preview: false, sampleWishes: true });
    assert.equal(message.payload.data.groom, invitation.content[locale].people[0]);
    assert.equal(message.payload.data.story.length, 6);
    assert.deepEqual(message.payload.data.program.map(item => item.id), invitation.program.map(item => item.id));
    assert.deepEqual(message.payload.data.wishes, []);
    assert.ok(!("toyona" in message.payload.data));
    assert.equal(message.payload.guestToken, "guest-token");
    assert.ok(message.payload.data.greeting.includes("Guest"));
  }
  assert.deepEqual(invitation, original);
});

test("source photos and sample wishes are ephemeral; creator photos and music take precedence", () => {
  const invitation = createTemplatePreviewSample("wedivo-melting-reality");
  const options = { invitationId: "preview", preview: true, sampleWishes: true };
  const preview = makeMeltingRealityPayload(invitation, "en", options).payload.data;
  assert.equal(preview.gallery.length, 9);
  assert.equal(preview.wishes.length, 3);
  assert.ok(preview.gallery.every(item => item.src.startsWith("/templates/wedivo-melting-reality/")));
  assert.ok(invitation.gallery.every(item => !item.url));
  invitation.gallery = [{ id: "creator-photo", url: "/media/creator.jpg", caption: "Our moment", alt: "Our photo" }];
  invitation.music = { enabled: true, url: "/media/creator.mp3", assetId: null, filename: "Our music" };
  const creator = makeMeltingRealityPayload(invitation, "en", options).payload.data;
  assert.deepEqual(creator.gallery.map(item => item.id), ["creator-photo"]);
  assert.equal(creator.music.url, "/media/creator.mp3");
  const blank = createInvitation("wedivo-melting-reality");
  const published = makeMeltingRealityPayload(blank, "en", { invitationId: "public", preview: false, sampleWishes: true }).payload.data;
  assert.deepEqual(published.gallery, []);
  assert.deepEqual(published.wishes, []);
  assert.equal(published.music.enabled, false);
});

test("bridge gates preview sends and delegates real submissions with fixed party size", async () => {
  const bridge = await readFile(new URL("adapter.js", base), "utf8");
  assert.match(bridge, /event\.source!==parent\|\|event\.origin!==location\.origin/);
  assert.match(bridge, /state\.preview\)\{put\(feedback,t\("preview"\)\);return;/);
  assert.match(bridge, /partySize:status==="attending"\?1:0/);
  assert.match(bridge, /response\.ok\)throw/);
  assert.match(bridge, /\/api\/public\/invitations\//);
  assert.match(bridge, /visible\("sec-gifts",false\)/);
  assert.doesNotMatch(bridge, /\b(?:alert|prompt|confirm)\s*\(/);
});

test("Uzbek default and portrait artwork use the canonical rendered opening", async () => {
  const [html, engine, artwork, provenance, fixture] = await Promise.all([
    readFile(new URL("index.html", base), "utf8"), readFile(new URL("source/template.js", base), "utf8"),
    readFile(new URL("preview.jpg", base)), readFile(new URL("preview.provenance.json", base), "utf8"),
    readFile(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url)),
  ]);
  const proof = JSON.parse(provenance);
  assert.match(html, /<html lang="uz-Latn">/);
  assert.match(html, /<title>Tush va haqiqat<\/title>/);
  assert.doesNotMatch(engine, /"undangan-pernikahan\.ics"/);
  assert.equal(proof.locale, "uz-Latn");
  assert.equal(proof.kind, "rendered-opening");
  assert.equal(proof.imageSha256, sha(artwork));
  assert.equal(proof.fixtureSha256, sha(fixture));
  assert.ok(proof.imageDimensions.height / proof.imageDimensions.width > 1.8);
  assert.deepEqual([...artwork.subarray(0, 2)], [0xff, 0xd8]);
});
