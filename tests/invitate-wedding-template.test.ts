import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  createInvitation,
  defaultLocalizedInvitationContent,
  invitationSchema,
} from "../packages/contracts/src/index";
import {
  createTemplatePreviewSample,
  hasAuthoredInvitationContent,
} from "../apps/web/src/modules/catalog/preview-sample";
import { makeWeddingFields } from "../apps/web/src/templates/invitate/wedding-fields";

test("legacy invitations default to no artist lineup and empty program descriptions", () => {
  const invitation = createInvitation("invitate-wedding");
  const legacy = structuredClone(invitation) as Record<string, any>;
  delete legacy.artistLineup;
  for (const content of Object.values(legacy.content) as Record<string, any>[]) {
    delete content.programDescriptions;
  }

  const parsed = invitationSchema.parse(legacy);
  assert.deepEqual(parsed.artistLineup, []);
  assert.deepEqual(parsed.content[parsed.defaultLocale].programDescriptions, {});
});

test("catalog sample keeps source artists and descriptions in the shared fixture", () => {
  const sample = createTemplatePreviewSample("invitate-wedding");
  assert.equal(sample.program.length, 4);
  assert.equal(sample.artistLineup.length, 8);
  assert.equal(
    sample.content["uz-Latn"].programDescriptions[sample.program[0].id],
    "Iltimos, o‘zingiz bilan yaxshi kayfiyat va tabassumingizni olib keling.",
  );

  assert.equal(sample.artistLineup[0].name["uz-Latn"], "Davron Kabulov");
  assert.equal(
    sample.content["uz-Latn"].programDescriptions[sample.program[0].id],
    "Iltimos, o‘zingiz bilan yaxshi kayfiyat va tabassumingizni olib keling.",
  );
  const sampleFields = makeWeddingFields(sample, "uz-Latn");
  assert.equal(sampleFields.artists[0].name, "Davron Kabulov");
  assert.equal(sampleFields.program[0].description, sample.content["uz-Latn"].programDescriptions[sample.program[0].id]);

  const invitation = createInvitation("invitate-wedding");
  assert.deepEqual(invitation.artistLineup, []);
  assert.deepEqual(invitation.content[invitation.defaultLocale].programDescriptions, {});
  assert.equal(hasAuthoredInvitationContent(invitation), false);
});

test("artist-only or description-only edits disable the sample-preview replacement", () => {
  const descriptionOnly = createInvitation("invitate-wedding");
  descriptionOnly.program = [{ id: "details", time: "18:00" }];
  descriptionOnly.content[descriptionOnly.defaultLocale].programDescriptions = {
    details: "A creator-authored description.",
  };
  assert.equal(hasAuthoredInvitationContent(descriptionOnly), true);

  const artistOnly = createInvitation("invitate-wedding");
  artistOnly.artistLineup = [
    {
      id: "artist",
      name: { "uz-Latn": "Creator artist" },
      role: {},
      imageUrl: "",
      imageAssetId: null,
    },
  ];
  assert.equal(hasAuthoredInvitationContent(artistOnly), true);
});

test("creator content maps localized artist and program fields into the public renderer", () => {
  const invitation = createInvitation("invitate-wedding");
  invitation.eventType = "wedding";
  invitation.enabledLocales = ["uz-Latn", "ru"];
  invitation.content["uz-Latn"] = {
    ...defaultLocalizedInvitationContent("wedding", "uz-Latn"),
    programTitles: { dinner: "Kechki ovqat" },
    programDescriptions: { dinner: "Birgalikda dasturxon atrofida jam bo‘lamiz." },
  };
  invitation.content.ru = {
    ...defaultLocalizedInvitationContent("wedding", "ru"),
    programTitles: { dinner: "Ужин" },
    programDescriptions: { dinner: "Соберёмся за праздничным столом." },
  };
  invitation.program = [{ id: "dinner", time: "18:00" }];
  invitation.artistLineup = [
    {
      id: "host-1",
      name: { "uz-Latn": "Mahliyo", ru: "Махлиё" },
      role: { "uz-Latn": "Boshlovchi", ru: "Ведущая" },
      imageUrl: "https://example.test/host.jpg",
      imageAssetId: null,
    },
  ];

  const parsed = invitationSchema.parse(invitation);
  assert.equal(parsed.content["uz-Latn"].programDescriptions.dinner, "Birgalikda dasturxon atrofida jam bo‘lamiz.");
  assert.equal(parsed.artistLineup[0].name["uz-Latn"], "Mahliyo");
  assert.equal(parsed.artistLineup[0].imageUrl, "https://example.test/host.jpg");
  assert.equal(hasAuthoredInvitationContent(parsed), true);
  assert.deepEqual(makeWeddingFields(parsed, "uz-Latn"), {
    program: [
      {
        id: "dinner",
        time: "18:00",
        title: "Kechki ovqat",
        description: "Birgalikda dasturxon atrofida jam bo‘lamiz.",
      },
    ],
    artists: [
      {
        id: "host-1",
        name: "Mahliyo",
        role: "Boshlovchi",
        imageUrl: "https://example.test/host.jpg",
      },
    ],
  });
  assert.equal(makeWeddingFields(parsed, "ru").artists[0].name, "Махлиё");
  assert.equal(makeWeddingFields(parsed, "ru").artists[0].role, "Ведущая");
  assert.equal(makeWeddingFields(parsed, "ru").program[0].title, "Ужин");
  assert.equal(
    makeWeddingFields(parsed, "ru").program[0].description,
    "Соберёмся за праздничным столом.",
  );
});

test("artist source markup has no hardcoded creator-facing lineup and renders only supplied entries", () => {
  const html = readFileSync("apps/web/public/templates/invitate-wedding/index.html", "utf8");
  const bridge = readFileSync("apps/web/public/templates/invitate-wedding/wedding-adapter.js", "utf8");
  const artistSection = html.match(/<section id="artists"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(artistSection, /<section id="artists" hidden>/);
  assert.doesNotMatch(artistSection, /Davron Kabulov|Yulduz Usmonova|Boshlovchi/);
  assert.match(bridge, /artistGrid\.replaceChildren\(\)/);
  assert.match(bridge, /artists\.hidden = artistRows\.length === 0/);
});
