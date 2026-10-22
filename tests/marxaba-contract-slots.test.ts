import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => {
  module.exports = {};
};
const webSourceRoot = fileURLToPath(new URL("../apps/web/src/", import.meta.url));
const moduleRuntime = require("node:module") as {
  _resolveFilename: (...args: any[]) => string;
};
const resolveFilename = moduleRuntime._resolveFilename;
moduleRuntime._resolveFilename = function (request: string, ...args: any[]) {
  const resolved = request.startsWith("@/")
    ? path.resolve(webSourceRoot, request.slice(2))
    : request;
  return resolveFilename.call(this, resolved, ...args);
};

const { makeLegacyData } = require(
  "../apps/web/src/templates/anor/renderer.tsx",
) as {
  makeLegacyData: (
    invitation: ReturnType<typeof createTemplatePreviewSample>,
    locale: "uz-Latn" | "uz-Cyrl" | "en" | "ru",
    guestName: string,
    sampleWishes?: boolean,
  ) => Record<string, any>;
};

const root = path.resolve("apps/web/public/templates");

function readSlot(value: Record<string, any>, slot: string) {
  if (slot === "extras.celebrant") return value.groom || value.bride;
  return slot.split(".").reduce<any>((current, key) => current?.[key], value);
}

test("Bulbul, Parda, Ganch and Yangi Uy bind every declared source slot/list to the shared contract", () => {
  for (const id of ["bulbul", "parda", "ganch", "yangi-uy"] as const) {
    const html = readFileSync(path.join(root, id, "index.html"), "utf8");
    const sample = createTemplatePreviewSample(id);
    const data = makeLegacyData(sample, sample.defaultLocale, "", false);
    const content = sample.content[sample.defaultLocale];
    const slots = new Set(
      Array.from(html.matchAll(/data-slot=["']([^"']+)/g), (match) =>
        match[1].trim(),
      ),
    );
    for (const slot of slots) {
      if (slot === "toyona.bank") {
        // The approved contract deliberately omits bank names; the packages
        // keep this legacy hook empty and hide it with their source adapter.
        assert.equal(data.toyona.bankName, undefined);
        continue;
      }
      assert.notEqual(
        readSlot(data, slot),
        undefined,
        `${id} source slot ${slot} must resolve through the typed shared adapter`,
      );
    }

    assert.equal(data.groom, content.people[0] ?? "");
    assert.equal(data.bride, content.people[1] ?? "");
    assert.equal(data.hosts, content.hosts);
    assert.equal(data.greeting, content.greeting);
    assert.equal(data.eventType, content.eventLabel);
    assert.equal(data.message, content.message);
    assert.ok(data.dateTime && Number.isFinite(Date.parse(data.dateTime)));
    assert.equal(data.venue.name, content.venueName);
    assert.equal(
      data.venue.address,
      [content.address, content.landmark].filter(Boolean).join(" · "),
    );
    assert.deepEqual(
      data.program.map(({ id: itemId, time, title }) => ({
        id: itemId,
        time,
        title,
      })),
      sample.program.map((item) => ({
        id: item.id,
        time: item.time,
        title: content.programTitles[item.id] ?? "",
      })),
    );
    assert.equal(data.gallery.length, sample.gallery.length);
    assert.deepEqual(data.rsvp, sample.rsvp);
    assert.equal(data.wishesEnabled, sample.wishes.enabled);
    assert.equal(data.toyona.enabled, sample.gift.enabled);
    assert.equal(data.toyona.cardNumber, sample.gift.cardNumber);
    assert.equal(data.toyona.cardHolder, sample.gift.cardHolder);
    assert.deepEqual(
      data.dressCode.colors.map(({ hex }) => hex),
      sample.dressCode.colors.map(({ hex }) => hex),
    );

    const expectedLists: Record<string, string> = {
      contacts: "contacts",
      dresscode: "dressCode.colors",
      gallery: "gallery",
      program: "program",
      wishes: "wishes",
    };
    const lists = new Set(
      Array.from(html.matchAll(/data-list=["']([^"']+)/g), (match) =>
        match[1].trim(),
      ),
    );
    for (const list of lists) {
      const path = expectedLists[list];
      assert.ok(path, `${id} has an explicit contract mapping for ${list}`);
      assert.ok(
        Array.isArray(readSlot(data, path)),
        `${id} list ${list} maps to ${path}`,
      );
    }

    assert.equal(data.toyona.bankName, undefined);
    assert.equal(data.toyona.cardNumber !== undefined, true);
    assert.equal(data.toyona.cardHolder !== undefined, true);
    assert.equal(data.toyona.note, "");
    if (id === "yangi-uy")
      assert.equal(data.groom || data.bride, sample.content[sample.defaultLocale].people[0]);
  }
});
