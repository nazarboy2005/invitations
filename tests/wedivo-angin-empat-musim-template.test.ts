import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";

const root = new URL(
  "../apps/web/public/templates/wedivo-angin-empat-musim/",
  import.meta.url,
);
const require = createRequire(import.meta.url);
require.extensions[".css"] = () => {};
const {
  makeAnginPayload,
} = require("../apps/web/src/templates/wedivo-angin-empat-musim/adapter");
const {
  createTemplatePreviewSample,
} = require("../apps/web/src/modules/catalog/preview-sample");

test("keeps the capture intact and packages all exact local design dependencies", async () => {
  const provenance = JSON.parse(
    await readFile(new URL("source/provenance.json", root), "utf8"),
  );
  const capture = await readFile(
    new URL(`../${provenance.capture}`, import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(capture).digest("hex"),
    provenance.captureSha256,
  );
  assert.equal(
    provenance.assets.filter((asset: { file: string }) =>
      asset.file.endsWith(".jpg"),
    ).length,
    10,
  );
  assert.equal(
    provenance.assets.filter((asset: { file: string }) =>
      asset.file.endsWith(".woff2"),
    ).length,
    11,
  );
  for (const asset of provenance.assets) {
    const bytes = await readFile(new URL(asset.file, root));
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
      asset.file,
    );
  }
});

test("removes provider runtime, source personal examples and network font dependencies", async () => {
  const [html, js, css, fonts] = await Promise.all(
    [
      "index.html",
      "source/template.js",
      "source/template.css",
      "assets/styles/fonts.css",
    ].map((path) => readFile(new URL(path, root), "utf8")),
  );
  assert.doesNotMatch(
    html,
    /wedivo-parameters|wedivo-preview-stub|sample-rundown|Aulia|Bagas|Hana|Raka|AIza/,
  );
  assert.doesNotMatch(
    html + js + css + fonts,
    /wedivo\.id\/uploads|fonts\.googleapis|fonts\.gstatic|prewedding\//,
  );
  assert.match(js, /function setupCover\(/);
  assert.match(js, /function setupGaleri\(/);
  assert.match(js, /function setupKisah\(/);
  assert.match(html, /id="vn-pax"[^>]*|id="vn-pax"/);
  assert.match(html, /data-unsupported=""[^>]*id="vn-pax"/);
  assert.match(html, /data-unsupported=""[^>]*id="sec-kado"/);
});

test("canonical preview media is ephemeral and authored uploads replace it", () => {
  const invitation = createTemplatePreviewSample("wedivo-angin-empat-musim");
  const before = JSON.stringify(invitation);
  const preview = makeAnginPayload(invitation, "en", "Guest", {
    invitationId: "qa",
    preview: true,
    sampleWishes: true,
  });
  assert.equal(preview.payload.data.gallery.length, 6);
  assert.ok(
    preview.payload.data.gallery.every((photo: { src: string }) =>
      photo.src.startsWith("/templates/wedivo-angin-empat-musim/assets/"),
    ),
  );
  assert.equal(JSON.stringify(invitation), before);
  const publicData = makeAnginPayload(invitation, "en", "Guest", {
    invitationId: "qa",
    preview: false,
    sampleWishes: true,
  });
  assert.equal(publicData.payload.data.gallery.length, 0);
  assert.equal(publicData.payload.data.wishes.length, 0);
  invitation.gallery = [
    {
      id: "creator-photo",
      url: "https://example.test/photo.webp",
      alt: "Authored",
      caption: "Caption",
    },
  ];
  const authored = makeAnginPayload(invitation, "en", "Guest", {
    invitationId: "qa",
    preview: true,
    sampleWishes: true,
  });
  assert.deepEqual(authored.payload.data.gallery, [
    {
      id: "creator-photo",
      src: "https://example.test/photo.webp",
      alt: "Authored",
      caption: "Caption",
    },
  ]);
  assert.equal("toyona" in authored.payload.data, false);
});

test("retains all stable story/program IDs and resolves the event timezone", () => {
  const invitation = createTemplatePreviewSample("wedivo-angin-empat-musim");
  invitation.startsAt = "2027-04-10T18:30";
  invitation.timezone = "Asia/Tashkent";
  invitation.story = Array.from({ length: 7 }, (_, index) => ({
    id: `story-${index}`,
    title: { en: `Chapter ${index}` },
    text: { en: `Text ${index}` },
  }));
  const result = makeAnginPayload(invitation, "en", "Guest", {
    invitationId: "qa",
  }).payload;
  assert.equal(result.timezoneOffset, 5);
  assert.equal(result.eventTimestamp, Date.parse("2027-04-10T13:30:00Z"));
  assert.deepEqual(
    result.data.story.map((item: { id: string }) => item.id),
    invitation.story.map((item: { id: string }) => item.id),
  );
  assert.deepEqual(
    result.data.program.map((item: { id: string }) => item.id),
    invitation.program.map((item: { id: string }) => item.id),
  );
});

test("services have preview guards, real APIs and no guest-count or gift success simulation", async () => {
  const js = await readFile(new URL("platform-adapter.js", root), "utf8");
  assert.match(js, /partySize:\s*status === "attending" \? 1 : 0/);
  assert.match(js, /if \(active\.preview\)/);
  assert.match(js, /submit\(form, "rsvp"/);
  assert.match(js, /"wishes",/);
  assert.match(js, /if \(!response\.ok\) throw/);
  assert.doesNotMatch(
    js,
    /cardNumber|receiptUpload|gift_receipts|alert\(|confirm\(|prompt\(/,
  );
});

test("catalog art is a clean complete portrait opening tied to the canonical fixture", async () => {
  const image = await readFile(new URL("preview.png", root));
  const provenance = JSON.parse(
    await readFile(new URL("preview.provenance.json", root), "utf8"),
  );
  assert.equal(image.readUInt32BE(16), 450);
  assert.equal(image.readUInt32BE(20), 800);
  assert.equal(
    createHash("sha256").update(image).digest("hex"),
    provenance.sha256,
  );
  const fixture = await readFile(
    new URL(
      "../apps/web/src/modules/catalog/preview-sample.json",
      import.meta.url,
    ),
  );
  assert.equal(
    createHash("sha256").update(fixture).digest("hex"),
    provenance.fixtureSha256,
  );
  assert.equal(provenance.locale, "uz-Latn");
});
