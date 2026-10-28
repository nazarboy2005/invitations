// Local HTTP + isolated disposable database rows. Does not contact Telegram.
// Run: node --env-file=apps/web/.env.local --import tsx --test tests/invitation-share.integration.ts
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import {
  addLanguage,
  defaultLocalizedInvitationContent,
} from "../packages/contracts/src/index";
import { generatePublicCode } from "../apps/web/src/server/publication";
import { completeInvitation } from "./fixtures/publication";
import artwork from "../apps/web/src/modules/catalog/share-artwork.json";

const sql = getDb();
const origin = process.env.APP_URL!;
const ownerId = randomUUID();
const slugs = {
  published: generatePublicCode(),
  draft: generatePublicCode(),
  archived: generatePublicCode(),
};
const userAgent = "TelegramBot";
before(async () => {
  assert.ok(
    ["127.0.0.1", "localhost"].includes(new URL(origin).hostname),
    "HTTP checks must target a local app",
  );
  await sql`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${ownerId},${-Math.floor(Math.random() * 1e12) - 1},'Disposable share-preview test')`;
  for (const status of ["published", "draft", "archived"] as const) {
    let invitation = completeInvitation();
    invitation = addLanguage(invitation, "ru");
    invitation.content.ru = {
      ...defaultLocalizedInvitationContent("wedding", "ru"),
      people: ["Шерзод тест", "Мадина тест"],
    };
    invitation.status = status;
    invitation.slug = slugs[status];
    await sql`INSERT INTO invitations(id,owner_id,template_id,slug,status,data) VALUES(${invitation.id},${ownerId},${invitation.templateId},${slugs[status]},${status},${sql.json(invitation)})`;
  }
});
after(async () => {
  await sql`DELETE FROM invitations WHERE owner_id=${ownerId}`;
  await sql`DELETE FROM users WHERE id=${ownerId}`;
  await closeDb();
});

test("anonymous Telegram fetch receives personalized metadata in head and a public square image", async () => {
  const response = await fetch(
    `${origin}/i/${slugs.published}?g=PRIVATE_TEST_GUEST&lang=ru`,
    {
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(60_000),
    },
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  assert.match(
    head,
    /property="og:title" content="Шерзод тест &amp; Мадина тест — Свадьба"/,
  );
  assert.match(head, /14 июня 2027/);
  assert.match(head, /property="og:site_name" content="Visol"/);
  assert.match(head, /name="twitter:card" content="summary"/);
  assert.match(head, /property="og:image:width" content="1200"/);
  assert.match(head, /property="og:image:height" content="1200"/);
  assert.match(head, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.doesNotMatch(head, /PRIVATE_TEST_GUEST|preview-sample|catalog-cover/);
  const imageUrl = head.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert.equal(imageUrl, new URL(artwork.anor, origin).href);
  const image = await fetch(imageUrl!, {
    headers: { "User-Agent": userAgent },
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type")!, /image\/jpeg/);
  assert.match(image.headers.get("cache-control")!, /immutable/);
  const bytes = new Uint8Array(await image.arrayBuffer());
  assert.equal(bytes[0], 0xff);
  assert.equal(bytes[1], 0xd8);
});

test("unsupported language uses default preview; draft, archived and malformed links reveal no invitation metadata", async () => {
  const response = await fetch(`${origin}/i/${slugs.published}?lang=en`, {
    headers: { "User-Agent": userAgent },
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200);
  const head =
    (await response.text()).match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  assert.match(head, /Nodir test &amp; Madina test — Nikoh to‘yi/);
  assert.doesNotMatch(head, /Шерзод тест/);
  for (const slug of [slugs.draft, slugs.archived, "not-a-code"]) {
    const hidden = await fetch(`${origin}/i/${slug}`, {
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(30_000),
    });
    assert.equal(hidden.status, 404, slug);
    assert.doesNotMatch(
      await hidden.text(),
      /property="og:title" content="(?:Nodir|Шерзод)/,
    );
  }
});
