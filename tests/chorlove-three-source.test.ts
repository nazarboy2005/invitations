import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import {
  createInvitation,
  templateById,
} from "../packages/contracts/src/index";
import { createTemplatePreviewSample, hasAuthoredInvitationContent } from "../apps/web/src/modules/catalog/preview-sample";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { invitationForStorage, unsupportedInvitationInputs } from "../packages/contracts/src/studio-inputs";

const hash = (bytes: Buffer) =>
  createHash("sha256").update(bytes).digest("hex");
for (const id of ["stained-glass", "sunset", "swan-garden"]) {
  const root = new URL(`../apps/web/public/templates/${id}/`, import.meta.url);
  test(`${id}: immutable capture, complete local assets and catalog artwork`, async () => {
    const provenance = JSON.parse(
      await readFile(new URL("source-provenance.json", root), "utf8"),
    );
    const capture = await readFile(new URL("source/preview-frame.html", root));
    assert.equal(hash(capture), provenance.captureSha256);
    assert.equal(
      hash(await readFile(new URL("source/template-module.js", root))),
      provenance.moduleSha256,
    );
    for (const asset of provenance.assets) {
      assert.equal(
        hash(await readFile(new URL(asset.file, root))),
        asset.sha256,
        asset.file,
      );
    }
    const definition = templateById(id)!;
    assert.deepEqual(definition.supportedEventTypes, ["wedding"]);
    assert.deepEqual(definition.categoryIds, ["wedding"]);
    assert.equal(definition.priceMinor, 15000000);
    assert.equal(definition.currency, "UZS");
    await access(
      new URL(`../apps/web/public${definition.previewImage}`, import.meta.url),
    );
    const html = await readFile(new URL("index.html", root), "utf8");
    assert.doesNotMatch(html, /<script[^>]+src=["'](?:https?:|\/_next\/)/i);
    assert.doesNotMatch(html, /(?:src|poster)=["']https?:\/\//i);
    assert.doesNotMatch(
      html,
      /telegram-web-app|googletagmanager|gtag\(|self\.__next_f|Muhammad O\.|5614 6887|Abdurahmonovlar oilasi/,
    );
    assert.doesNotMatch(html, /<audio[^>]+src=/);
    assert.match(html, /data-rsvp-form/);
    assert.match(html, /data-wish-form/);
    assert.match(html, /data-map/);
    const sample = createTemplatePreviewSample(id);
    assert.equal(sample.gallery.length, 6);
    assert.deepEqual(
      createInvitation(id).gallery,
      [],
      "Preview photos must never enter a real draft",
    );
    assert.equal(hasAuthoredInvitationContent(createInvitation(id)),false,'A blank new-template draft remains eligible for preview-only fixture content');
    for (const item of sample.gallery)
      await access(new URL(`../apps/web/public${item.url}`, import.meta.url));
    const authored = createInvitation(id);
    authored.templateData = {
      previousDesign: { authoredField: "Keep this value" },
    };
    authored.contacts.instagramUrl = "https://instagram.com/authored";
    authored.artistLineup = [
      {
        id: "artist-1",
        name: { en: "Authored artist" },
        role: { en: "Host" },
        imageUrl: "",
        imageAssetId: null,
      },
    ];
    // Previously saved content survives in storage; guest projection exposes
    // only this design's supported slots. New hidden values are rejected.
    assert.deepEqual(unsupportedInvitationInputs(authored, authored), []);
    const stored = invitationForStorage(authored);
    assert.deepEqual(stored.templateData, authored.templateData);
    assert.deepEqual(stored.artistLineup, authored.artistLineup);
    assert.deepEqual(stored.contacts, authored.contacts);
    assert.ok(unsupportedInvitationInputs(authored).length > 0);
    const visible = normalizeInvitation(stored);
    assert.deepEqual(visible.templateData, {});
    assert.deepEqual(visible.artistLineup, []);
    assert.equal(visible.contacts.instagramUrl, "");
  });
}
test("standalone carousel reuses captured source engine without provider/React runtime", async () => {
  const source = await readFile(
    new URL(
      "../apps/web/public/templates/chorlove/shared/three-carousel.js",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(source, /function j\(e, t, n\)/);
  assert.doesNotMatch(source, /e\.i\(|e\.s\(|TURBOPACK|useEffect|useRef/);
});
