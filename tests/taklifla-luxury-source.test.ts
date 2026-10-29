import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { createInvitation, LOCALES } from "../packages/contracts/src/index";
import { makeTungiSaroyPayload } from "../apps/web/src/templates/taklifla-tungi-saroy/adapter";
import { makeTovusPayload } from "../apps/web/src/templates/taklifla-tovus/adapter";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { getTemplatePreviewWishes } from "../apps/web/src/modules/catalog/preview-sample";

const designs = [
  {
    id: "taklifla-tungi-saroy",
    project: (i: any, l: any, o: any) =>
      makeTungiSaroyPayload(i, l, { ...o, guestName: "<Mehmon>" }),
    manifest: "source/provenance.json",
    runtime: [
      "platform-adapter.js",
      "labels.js",
      "index.html",
      "source/template-motion.js",
    ],
  },
  {
    id: "taklifla-tovus",
    project: (i: any, l: any, o: any) => makeTovusPayload(i, l, "<Mehmon>", o),
    manifest: "dependencies.json",
    runtime: ["bridge.js", "copy.js", "index.html", "source/motion.js"],
  },
];
for (const design of designs) {
  test(`${design.id}: preview wishes use shared localized text and never enter a public payload`, () => {
    const invitation = createTemplatePreviewSample(design.id);
    for (const locale of LOCALES) {
      const preview = design.project(invitation, locale, {
        invitationId: "qa",
        preview: true,
        sampleWishes: true,
      });
      assert.deepEqual(
        preview.payload.variants[locale].wishes,
        getTemplatePreviewWishes(locale).map(({ name, text }) => ({
          name,
          message: text,
        })),
      );
      const actual = design.project(invitation, locale, {
        invitationId: "real",
        preview: false,
        sampleWishes: true,
      });
      assert.deepEqual(actual.payload.variants[locale].wishes, []);
    }
  });
  test(`${design.id}: exact captured CSS, artwork and fonts; no provider runtime`, () => {
    const root = resolve(`apps/web/public/templates/${design.id}`);
    const meta = JSON.parse(
      readFileSync(resolve(root, design.manifest), "utf8"),
    );
    const sha = (p: string) =>
      createHash("sha256").update(readFileSync(p)).digest("hex");
    assert.equal(sha(resolve(meta.capture)), meta.captureSha256 ?? meta.sha256);
    for (const asset of meta.dependencies ?? meta.assets)
      assert.equal(
        sha(resolve(root, asset.path ?? asset.file)),
        asset.sha256,
        asset.path ?? asset.file,
      );
    const source = readFileSync(resolve(meta.capture), "utf8");
    const css = source.match(/<style>([\s\S]*?)<\/style>/)![1];
    assert.equal(
      readFileSync(resolve(root, "source/template.css"), "utf8").replaceAll(
        "\r\n",
        "\n",
      ),
      css.replaceAll("\r\n", "\n"),
    );
    const runtime = design.runtime
      .map((f) => readFileSync(resolve(root, f), "utf8"))
      .join("\n");
    assert.doesNotMatch(
      runtime,
      /cloudflareinsights|localStorage|\/api\/v1\/public|tvDemoWishes|mpDemoWishes|998901234567/,
    );
    assert.doesNotMatch(runtime, /name=["']partySize|name=["']pax/);
  });
  test(`${design.id}: shared fixture, all locales, stable IDs and saved map preference`, () => {
    const invitation = createTemplatePreviewSample(design.id);
    invitation.venue.mapUrl = "https://maps.app.goo.gl/author-map";
    for (const locale of LOCALES)
      invitation.content[locale].personalGreeting = "Salom {name}";
    invitation.gift.cardNumber = "private-unneeded-card";
    const before = JSON.stringify(invitation);
    for (const locale of LOCALES) {
      const { payload } = design.project(invitation, locale, {
        invitationId: "qa",
        guestToken: "opaque",
        preview: false,
      });
      const v = payload.variants[locale];
      assert.equal(v.greeting, "Salom <Mehmon>");
      assert.deepEqual(
        v.program.map((x: any) => x.id),
        invitation.program.map((x) => x.id),
      );
      assert.equal(payload.mapUrl ?? v.venue.mapUrl, invitation.venue.mapUrl);
      assert.equal(payload.guestToken, "opaque");
      assert.doesNotMatch(JSON.stringify(payload), /private-unneeded-card/);
    }
    assert.equal(JSON.stringify(invitation), before);
  });
  test(`${design.id}: blank creator data never falls back to source invitation samples`, () => {
    const invitation = createInvitation(design.id);
    invitation.startsAt = "";
    for (const locale of invitation.enabledLocales)
      invitation.content[locale].people = [];
    const { payload } = design.project(invitation, "uz-Latn", {
      invitationId: "blank",
      preview: false,
    });
    const v = payload.variants["uz-Latn"];
    assert.deepEqual(v.people, []);
    assert.deepEqual(v.program, []);
    assert.equal(payload.mapUrl ?? v.venue.mapUrl, "");
    assert.equal(payload.music.url, "");
    assert.doesNotMatch(
      JSON.stringify(payload),
      /Navro.z Saroyi|Karimov|Rahimov|2026-12-12|private-unneeded-card/,
    );
  });
}
