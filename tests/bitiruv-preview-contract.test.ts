import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createInvitation,
  defaultLocalizedInvitationContent,
  type Locale,
} from "@taklifnoma/contracts";
import { createTemplatePreviewSample, getTemplatePreviewWishes } from "../apps/web/src/modules/catalog/preview-sample";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => { module.exports = {}; };
const moduleRuntime = require("node:module") as { _resolveFilename: (...args: any[]) => string };
const resolveFilename = moduleRuntime._resolveFilename;
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/") ? path.resolve(webSourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, ...args);
};

const locales = ["uz-Latn", "uz-Cyrl", "en", "ru"] as const satisfies readonly Locale[];
const { makeLegacyData } = require("../apps/web/src/templates/anor/renderer") as typeof import("../apps/web/src/templates/anor/renderer");

test("Bitiruv's three compatible event types render one localized honoree through the shared adapter", () => {
  const graduation = createTemplatePreviewSample("bitiruv");
  const corporate = createTemplatePreviewSample("korporativ");
  assert.equal(graduation.eventType, "bitiruv");
  assert.equal(corporate.eventType, "korporativ");

  for (const locale of locales) {
    for (const [sample, eventType] of [[graduation, "bitiruv"], [corporate, "korporativ"]] as const) {
      const mapped = makeLegacyData(sample, locale, "", true);
      assert.equal(sample.eventType, eventType);
      assert.equal(mapped.groom, sample.content[locale].people[0]);
      assert.equal(mapped.bride, "", `${eventType} must not acquire a second honoree`);
      assert.equal(mapped.eventType, sample.content[locale].eventLabel);
      assert.equal(mapped.program.length, 6);
      assert.ok(mapped.program.every((item) => item.time && item.title));
      assert.equal(mapped.dressCode.enabled, true);
      assert.ok(mapped.dressCode.style && mapped.dressCode.text && mapped.dressCode.note);
      assert.ok(mapped.dressCode.colors.length >= 4);
      assert.ok(mapped.dressCode.colors.every((color) => color.name));
      assert.deepEqual(mapped.wishes, getTemplatePreviewWishes(locale));
      assert.deepEqual(mapped.contacts.map(({ type }) => type), ["phone", "telegram"]);
      assert.equal(mapped.toyona.enabled, true);
      assert.equal(mapped.toyona.cardNumber, sample.gift.cardNumber);
      assert.equal(mapped.toyona.cardHolder, sample.gift.cardHolder);
      assert.equal(mapped.toyona.note, "");
      assert.equal(mapped.gallery.length, 6);
      assert.ok(mapped.gallery.every((item) => !item.src && !item.alt && !item.caption));
    }

    const birthday = createInvitation("bitiruv");
    birthday.eventType = "birthday";
    birthday.startsAt = graduation.startsAt;
    birthday.program = graduation.program.map((entry) => ({ ...entry }));
    birthday.content[locale] = {
      ...defaultLocalizedInvitationContent("birthday", locale),
      people: [graduation.content[locale].people[0]],
      programHeading: graduation.content[locale].programHeading,
      programTitles: { ...graduation.content[locale].programTitles },
    };
    const mappedBirthday = makeLegacyData(birthday, locale, "", true);
    assert.equal(mappedBirthday.eventType, defaultLocalizedInvitationContent("birthday", locale).eventLabel);
    assert.equal(mappedBirthday.groom, graduation.content[locale].people[0]);
    assert.equal(mappedBirthday.bride, "", "birthday compatibility still presents one source honoree");
  }
});

test("Bitiruv blank drafts keep every preview-only section and value out", () => {
  const blank = makeLegacyData(createInvitation("bitiruv"), "uz-Latn", "", false);
  assert.equal(blank.groom, "");
  assert.equal(blank.bride, "");
  assert.equal(blank.dateTime, "");
  assert.equal(blank.program.length, 0);
  assert.equal(blank.gallery.length, 0);
  assert.equal(blank.wishes.length, 0);
  assert.equal(blank.toyona.enabled, false);
  assert.equal(blank.toyona.cardNumber, "");
  assert.equal(blank.contacts.length, 0);
  assert.equal(blank.dressCode.enabled, false);
});
