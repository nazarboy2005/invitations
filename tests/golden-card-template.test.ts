import { readFile } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { test } from "node:test";
import { createInvitation, templateById } from "@taklifnoma/contracts";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const root = new URL("../apps/web/public/templates/golden-card/", import.meta.url);
const read = (file: string) => readFile(new URL(file, root));

test("Golden Card is published for weddings after its additive release migration", async () => {
  const template = templateById("golden-card");
  assert.ok(template);
  assert.equal(template.published, true);
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
  assert.equal(template.previewImage, "/templates/golden-card/preview-browser-capture.jpg");

  const registration = await readFile(
    new URL("../packages/database/migrations/0092_register_golden_card.sql", import.meta.url),
    "utf8",
  );
  assert.match(registration, /VALUES \('golden-card', 'Golden Card',[\s\S]*false\)/);
  assert.match(registration, /VALUES \('golden-card', 'wedding'\)/);
  const publication = await readFile(
    new URL("../packages/database/migrations/0093_publish_golden_card.sql", import.meta.url),
    "utf8",
  );
  assert.match(publication, /SET published = true[\s\S]*WHERE id = 'golden-card'/);
});

test("Golden Card preview artifact and preserved source match their checksums", async () => {
  const capture = await read("source/preview-frame.html");
  const preview = await read("preview-browser-capture.jpg");
  const provenance = JSON.parse((await read("preview.provenance.json")).toString("utf8").replace(/^\uFEFF/, ""));
  assert.equal(
    createHash("sha256").update(capture).digest("hex"),
    "75ac0b6d0edd52500a4a24cc15ed001fa6a0230571ce461a33859703180cc888",
  );
  assert.equal(provenance.source.sha256, createHash("sha256").update(capture).digest("hex"));
  assert.equal(provenance.source.bytes, capture.byteLength);
  assert.equal(provenance.source.preservedSha256, provenance.source.sha256);
  assert.equal(provenance.source.preservedBytes, provenance.source.bytes);
  assert.equal(provenance.preview.status, "captured");
  assert.equal(provenance.preview.savedArtifact, true);
  assert.equal(provenance.preview.sha256, createHash("sha256").update(preview).digest("hex"));
  assert.deepEqual([provenance.preview.dimensions, provenance.preview.bytes], ["335x469", preview.byteLength]);
  assert.equal(provenance.preview.fixture, "apps/web/src/modules/catalog/preview-sample.json");
});

test("Golden Card bridge maps authored invitation data and honors reduced motion", async () => {
  const html = (await read("index.html")).toString("utf8");
  const bridge = (await read("bridge.js")).toString("utf8");
  for (const field of ["groom", "bride", "greeting", "message", "date", "venue", "music"]) {
    assert.match(bridge, new RegExp(`data\\.${field}`));
  }
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bridge, /function fitCoverHeading\(\)/);
  assert.match(bridge, /measureText\(heading\.textContent\)/);
  assert.match(bridge, /card\.clientWidth \* 0\.48/);
  assert.match(bridge, /new ResizeObserver\(fitCoverHeading\)/);
  assert.match(bridge, /\$\{templateId\}:language/);
  assert.match(html, /data-golden="groom"/);
  assert.match(html, /data-golden="bride"/);
  assert.match(html, /data-golden="invocation"/);
  assert.match(html, /data-golden-map/);
  assert.match(bridge, /Mehribon va rahmli Alloh nomi bilan\./);
  assert.match(bridge, /data\.message \|\| words\.defaultMessage/);
  assert.doesNotMatch(html, /<script[^>]+src=["']https?:/i);
});

test("Golden Card preserves the captured page CSS and opening choreography", async () => {
  const provenance = JSON.parse((await read("preview.provenance.json")).toString("utf8"));
  const packagedCss = (await read("adapter.css")).toString("utf8");
  const cssStart = packagedCss.indexOf(".golden-card-template{");
  const cssEnd = packagedCss.indexOf("/* Platform-only controls", cssStart);
  assert.ok(cssStart >= 0 && cssEnd > cssStart);
  assert.equal(
    createHash("sha256").update(packagedCss.slice(cssStart, cssEnd)).digest("hex"),
    provenance.sourceFidelityAudit.sourceCssSha256,
  );
  assert.equal(
    provenance.sourceFidelityAudit.componentChunkSha256,
    "f054bd58d6153468c79967a1906e68bb69171b61e76f4e45f914cd1ad627b653",
  );
  assert.match(packagedCss, /\.golden-cover\{[^}]*transition:transform 1\.5s/);
  assert.match(packagedCss, /\.golden-card\.is-open \.golden-cover\{[^}]*rotateY\(-100deg\)/);
  assert.doesNotMatch(packagedCss, /fonts\.googleapis\.com|fonts\.gstatic\.com/);

  const lobsterFiles = [
    ["lobster-latin.woff2", "aed68c73817364906ff95d97be87246d106bd38d5e4397e4866ec831ee22f7ba"],
    ["lobster-latin-ext.woff2", "51a1f5b28cbdc742ecaeeabf5fed74d0446b0b1cebdd6bbf6cd93ecc36b16629"],
    ["lobster-cyrillic.woff2", "738fd39c3bd07649e0bceb56a847ce07c736799e7212c6570c3644d68188012b"],
    ["lobster-cyrillic-ext.woff2", "b306ff4a03b57d52960c21b0e741620417368794b61e358713fc86cfca41a55d"],
  ];
  for (const [file, expectedHash] of lobsterFiles) {
    assert.equal(createHash("sha256").update(await read(`assets/fonts/${file}`)).digest("hex"), expectedHash);
  }

  const bridge = (await read("bridge.js")).toString("utf8");
  const html = (await read("index.html")).toString("utf8");
  assert.match(bridge, /duration: 3400 \+ \(index % 7\) \* 500, delay: \(index % 12\) \* 420/);
  assert.match(bridge, /delay:700\+index\*120,duration:550/);
  assert.match(bridge, /delay:700,duration:300/);
  assert.equal((html.match(/class="golden-sparkle-star"/g) ?? []).length, 34);
});

test("Golden Card keeps source artwork in the renderer and preview gallery data out of drafts", async () => {
  const html = (await read("index.html")).toString("utf8");
  const styles = (await read("adapter.css")).toString("utf8");
  const provenance = JSON.parse((await read("preview.provenance.json")).toString("utf8"));
  const renderer = `${html}\n${styles}`;
  const sourceImages = Object.keys(provenance.sourceFidelityAudit.sourceImageSha256);
  assert.deepEqual(sourceImages.sort(), ["corner.png", "mandala.png", "navy-texture.jpg"]);
  for (const image of sourceImages) {
    assert.ok(renderer.includes(`/templates/golden-card/assets/${image}`));
    const packaged = await read(`assets/${image}`);
    assert.equal(
      createHash("sha256").update(packaged).digest("hex"),
      provenance.sourceFidelityAudit.sourceImageSha256[image],
    );
  }

  const preview = createTemplatePreviewSample("golden-card");
  const draft = createInvitation("golden-card");
  assert.ok(preview.gallery.length > 0);
  assert.ok(preview.gallery.every((item) => item.url === ""));
  assert.deepEqual(draft.gallery, []);
  assert.doesNotMatch(html, /gallery|photo-grid/i);
});

test("Golden Card keeps source-absent sections hidden and uses count-free opt-in RSVP", async () => {
  const source = (await read("source/preview-frame.html")).toString("utf8");
  const html = (await read("index.html")).toString("utf8");
  const bridge = (await read("bridge.js")).toString("utf8");
  const styles = (await read("adapter.css")).toString("utf8");
  const provenance = JSON.parse((await read("preview.provenance.json")).toString("utf8"));

  assert.doesNotMatch(source, /data-section=["'](?:rsvp|toyona|gift|dresscode)["']/i);
  assert.doesNotMatch(source, /RSVP|To'yona|Dress code|Kiyinish uslubi/i);
  assert.deepEqual(provenance.sourceFidelityAudit.sourceInteractions, {
    musicButtonHoverScale: 1.1,
    musicButtonTapScale: 0.9,
    musicIconFollowsPlayback: true,
    rsvp: false,
    toyona: false,
    giftDisclosure: false,
    dressCode: false,
  });
  assert.doesNotMatch(html, /data-golden-rsvp|golden-rsvp|toyona|dress.?code/i);
  assert.match(bridge, /syncRsvp\(payload, words\)/);
  assert.match(bridge, /payload\?\.data\?\.rsvp\?\.enabled === true/);
  assert.match(bridge, /\/api\/public\/invitations\/\$\{encodeURIComponent\(current\.invitationId \|\| ""\)\}\/rsvp/);
  assert.match(bridge, /partySize: answer === "yes" \? 1 : 0/);
  assert.doesNotMatch(bridge, /partySize.{0,80}(input|select)|(?:input|select).{0,80}partySize/i);
  assert.match(bridge, /if \(current\.preview\)/);
  assert.match(styles, /\.golden-card-template>\.platform-extra\{display:none!important\}/);
  assert.match(styles, /\.golden-music-toggle:hover\{transform:scale\(1\.1\)\}/);
  assert.match(styles, /\.golden-music-toggle:active\{transform:scale\(\.9\)\}/);
  assert.match(styles, /prefers-reduced-motion:reduce\).*golden-music-toggle/);
  assert.match(bridge, /musicEnabled\s*\?\s*'<path/);
});
