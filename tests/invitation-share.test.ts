import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import sharp from "sharp";
import {
  TEMPLATES,
  LOCALES,
  addLanguage,
  defaultLocalizedInvitationContent,
} from "../packages/contracts/src/index";
import { completeInvitation } from "./fixtures/publication";
import {
  invitationLocale,
  invitationShareMetadata,
} from "../apps/web/src/modules/catalog/invitation-share";
import artwork from "../apps/web/src/modules/catalog/share-artwork.json";
import config from "../apps/web/next.config";

test("share metadata uses authored names, square artwork, Visol branding and absolute URLs", () => {
  const invitation = completeInvitation();
  const metadata = invitationShareMetadata(
    invitation,
    "Ab1cD2",
    "https://visol.example/old?g=private",
  );
  assert.deepEqual(metadata.title, {
    absolute: "Nodir test & Madina test — Nikoh to‘yi | Visol",
  });
  assert.equal(
    metadata.openGraph?.title,
    "Nodir test & Madina test — Nikoh to‘yi",
  );
  assert.match(metadata.description!, /14 iyun 2027/);
  assert.equal(metadata.openGraph?.url, "https://visol.example/i/Ab1cD2");
  assert.equal(metadata.alternates?.canonical, metadata.openGraph?.url);
  assert.deepEqual(metadata.robots, {
    index: false,
    follow: false,
    noarchive: true,
  });
  assert.deepEqual(metadata.openGraph?.images, [
    {
      url: `https://visol.example${artwork.anor}`,
      width: 1200,
      height: 1200,
      type: "image/jpeg",
      alt: "Taklifnoma bezagi",
    },
  ]);
  assert.equal(metadata.twitter?.card, "summary");
});

test("each enabled language uses its own authored names and localized event/date text", () => {
  let invitation = completeInvitation();
  const names = {
    "uz-Latn": "Muallif",
    "uz-Cyrl": "Муаллиф",
    en: "Author",
    ru: "Автор",
  };
  for (const locale of LOCALES) {
    if (locale !== invitation.defaultLocale)
      invitation = addLanguage(invitation, locale);
    invitation.content[locale] = {
      ...defaultLocalizedInvitationContent("wedding", locale),
      people: [names[locale], `${names[locale]} 2`],
    };
  }
  const before = JSON.stringify(invitation);
  for (const locale of LOCALES) {
    const metadata = invitationShareMetadata(
      invitation,
      "Ab1cD2",
      "https://visol.example",
      locale,
    );
    assert.match(String(metadata.openGraph?.title), new RegExp(names[locale]));
    assert.ok(
      metadata.description?.includes(
        { "uz-Latn": "iyun", "uz-Cyrl": "июн", en: "June", ru: "июня" }[locale],
      ),
    );
    const url = new URL(String(metadata.openGraph?.url));
    assert.equal(
      url.searchParams.get("lang"),
      locale === invitation.defaultLocale ? null : locale,
    );
  }
  assert.equal(JSON.stringify(invitation), before);
  assert.equal(invitationLocale(invitation, ["ru", "en"]), "uz-Latn");
  assert.equal(invitationLocale(invitation, "unknown"), "uz-Latn");
});

test("disabled languages, private greeting content and catalog samples never enter share text", () => {
  const invitation = completeInvitation();
  invitation.content.ru = {
    ...invitation.content["uz-Latn"],
    people: ["Disabled translation"],
  };
  invitation.content["uz-Latn"].greeting = "PRIVATE GUEST";
  invitation.content["uz-Latn"].personalGreeting = "PRIVATE TOKEN";
  invitation.content["uz-Latn"].message = "PRIVATE MESSAGE";
  const serialized = JSON.stringify(
    invitationShareMetadata(
      invitation,
      "Ab1cD2",
      "https://visol.example?g=PRIVATE",
      "ru",
    ),
  );
  assert.match(serialized, /Nodir test/);
  assert.doesNotMatch(
    serialized,
    /Disabled translation|PRIVATE|preview-sample|catalog-cover|preview\.webp/,
  );
});

test("single-person and custom events have useful titles, and dates honor the event timezone", () => {
  const invitation = completeInvitation();
  invitation.eventType = "birthday";
  invitation.content["uz-Latn"].people = ["  Dilnoza\n  Karimova  "];
  invitation.content["uz-Latn"].eventLabel = "";
  invitation.startsAt = "2027-01-01T00:30";
  let metadata = invitationShareMetadata(
    invitation,
    "Ab1cD2",
    "https://visol.example",
  );
  assert.equal(metadata.openGraph?.title, "Dilnoza Karimova — Tug‘ilgan kun");
  assert.match(metadata.description!, /1 yanvar 2027/);
  invitation.startsAt = "2026-12-31T21:30:00Z";
  metadata = invitationShareMetadata(
    invitation,
    "Ab1cD2",
    "https://visol.example",
  );
  assert.match(metadata.description!, /1 yanvar 2027/);
  invitation.content["uz-Latn"].people = [];
  invitation.content["uz-Latn"].title = "Yangi ofis ochilishi";
  invitation.content["uz-Latn"].eventLabel = "Ochilish marosimi";
  assert.equal(
    invitationShareMetadata(invitation, "Ab1cD2", "https://visol.example")
      .openGraph?.title,
    "Yangi ofis ochilishi — Ochilish marosimi",
  );
});

test("all registered templates have a bounded, content-hashed 1200-square JPEG, with no catalog capture source", async () => {
  const sources = JSON.parse(
    readFileSync(resolve("docs/design/share-artwork-sources.json"), "utf8"),
  );
  const paths = artwork as Record<string, string>;
  for (const id of [
    "default",
    ...new Set(TEMPLATES.map((template) => template.id)),
  ]) {
    assert.ok(paths[id], `${id}: missing share artwork`);
    assert.match(
      paths[id],
      /^\/share\/templates\/[a-z0-9-]+\.[0-9a-f]{12}\.jpg$/,
    );
    const path = resolve(`apps/web/public${paths[id]}`);
    assert.ok(existsSync(path), path);
    const bytes = readFileSync(path);
    assert.ok(
      bytes.length < 500_000,
      `${id}: image too large (${bytes.length})`,
    );
    assert.ok(
      paths[id].includes(
        createHash("sha256").update(bytes).digest("hex").slice(0, 12),
      ),
    );
    const image = await sharp(bytes).metadata();
    assert.equal(image.width, 1200, id);
    assert.equal(image.height, 1200, id);
    assert.equal(image.format, "jpeg", id);
    assert.equal(image.hasAlpha, false, id);
    if (sources[id]?.source)
      assert.doesNotMatch(
        sources[id].source.replace("/previews/template/", "/"),
        /preview|catalog|gallery/i,
      );
  }
});

test("Telegram receives blocking metadata while existing crawlers retain that behavior", async () => {
  assert.ok(config.htmlLimitedBots?.test("TelegramBot (like TwitterBot)"));
  assert.ok(config.htmlLimitedBots?.test("TelegramBot"));
  for (const agent of [
    "facebookexternalhit",
    "WhatsApp",
    "Discordbot",
    "Twitterbot",
    "Slackbot",
    "Bingbot",
  ])
    assert.ok(config.htmlLimitedBots?.test(agent), agent);
  assert.equal(config.htmlLimitedBots?.test("Mozilla/5.0 Chrome/130.0"), false);
  const headers = await config.headers!();
  assert.ok(
    headers.some(
      (rule) =>
        rule.source === "/share/templates/:path*" &&
        rule.headers.some(
          (header) =>
            header.key === "Cache-Control" &&
            header.value.includes("immutable"),
        ),
    ),
  );
});
