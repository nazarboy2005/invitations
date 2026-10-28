import test from "node:test";
import assert from "node:assert/strict";
import { completeInvitation } from "./fixtures/publication";
import { addLanguage } from "@taklifnoma/contracts";
import {
  coverKey,
  coverRequestKind,
} from "../apps/web/src/server/cover-policy";
import {
  coverRecipe,
  COVER_VIEWPORT,
} from "../apps/web/src/modules/dashboard/cover-recipe";
import { CATALOG_COVERS } from "../apps/web/src/modules/catalog/catalog-covers";

test("cover cache distinguishes edited content, language, template and private session scope", () => {
  const invitation = completeInvitation();
  const original = coverKey(invitation, "account-one");
  assert.equal(coverKey(structuredClone(invitation), "account-one"), original);
  assert.notEqual(coverKey(invitation, "account-two"), original);
  const renamed = structuredClone(invitation);
  renamed.content["uz-Latn"].people = ["Muallif", "Yangi ism"];
  assert.notEqual(coverKey(renamed, "account-one"), original);
  assert.notEqual(
    coverKey({ ...invitation, startsAt: "2027-07-15T17:00" }, "account-one"),
    original,
  );
  assert.notEqual(
    coverKey({ ...invitation, templateId: "cloud-castle" }, "account-one"),
    original,
  );
  assert.notEqual(
    coverKey(
      { ...addLanguage(invitation, "ru"), defaultLocale: "ru" },
      "account-one",
    ),
    original,
  );
});

test("cover fingerprint ignores publication state, revisions, view counters, audio and JSON key order", () => {
  const invitation = completeInvitation();
  const expected = coverKey(invitation, "owner");
  assert.equal(
    coverKey(
      { ...invitation, revision: 12, status: "published", slug: "abc123" },
      "owner",
    ),
    expected,
  );
  assert.equal(
    coverKey(
      {
        ...invitation,
        music: {
          ...invitation.music,
          enabled: true,
          url: "/music/changed.mp3",
        },
      },
      "owner",
    ),
    expected,
  );
  assert.equal(
    coverKey({ ...addLanguage(invitation, "ru") }, "owner"),
    expected,
  );
  const reordered = Object.fromEntries(Object.entries(invitation).reverse());
  assert.equal(coverKey(reordered as typeof invitation, "owner"), expected);
  assert.equal(
    coverKey({ ...invitation, viewCount: 1234 } as typeof invitation, "owner"),
    expected,
  );
});

test("portrait recipes preserve the curated opening states and special gestures", () => {
  assert.deepEqual(COVER_VIEWPORT, { width: 480, height: 800 });
  for (const id of Object.keys(CATALOG_COVERS))
    assert.notEqual(coverRecipe(id).scene, "opening", id);
  assert.equal(coverRecipe("anor").scene, "opened");
  assert.equal(coverRecipe("cloud-castle").scene, "opened");
  assert.equal(coverRecipe("nahor").scene, "lid");
  assert.equal(coverRecipe("qatlam").scene, "book");
  assert.equal(coverRecipe("muhabbat-kitobi").scene, "opening");
  for (const id of [
    "kuzgi-chinor",
    "kozgu",
    "nilufar",
    "qogoz-turna",
    "retro-kino",
    "sahifa",
    "somon-yoli",
    "toscana",
  ]) {
    assert.equal(coverRecipe(id).scene, "opened", id);
  }
  assert.equal(coverRecipe("somon-yoli").element, "#hero");
  assert.deepEqual(coverRecipe("oltin-uzuk").viewport, {
    width: 450,
    height: 800,
  });
});

test("capture requests allow static source assets and authorized media, denying APIs and external URLs", () => {
  const origin = "https://visol.example";
  for (const path of [
    "/preview?cover=1",
    "/templates/anor/source/index.html",
    "/_next/static/chunks/a.js",
    "/images/a.webp",
  ]) {
    assert.equal(coverRequestKind(origin + path, origin), "asset");
  }
  assert.equal(
    coverRequestKind(origin + "/api/media/abc-123", origin),
    "media",
  );
  for (const path of [
    "/api/auth/session",
    "/api/invitations",
    "/admin",
    "/dashboard",
    "/templates/../api/auth/session",
    "/templates/..%2fapi%2fauth",
  ]) {
    assert.equal(coverRequestKind(origin + path, origin), "deny", path);
  }
  for (const url of [
    "http://169.254.169.254/metadata",
    "http://127.0.0.1:22/templates/a",
    "https://attacker.example/collect",
    "https://user:pass@visol.example/templates/a",
    "file:///C:/private",
  ]) {
    assert.equal(coverRequestKind(url, origin), "deny", url);
  }
  assert.equal(
    coverRequestKind(
      "https://media.example/photo.webp",
      origin,
      "https://media.example",
    ),
    "asset",
  );
  assert.equal(
    coverRequestKind(
      "https://media.example.evil/photo.webp",
      origin,
      "https://media.example",
    ),
    "deny",
  );
});
