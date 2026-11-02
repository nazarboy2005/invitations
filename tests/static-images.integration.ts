// Explicit local HTTP checks. Disposable accounts only; no Telegram or payments.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { completeInvitation } from "./fixtures/publication";

const sql = getDb();
const origin = process.env.APP_URL!;
const accounts = [randomUUID(), randomUUID()];
const tokens = [randomToken(), randomToken()];
let invitation = normalizeInvitation({
  ...completeInvitation(),
  templateId: "ivory-rose-card",
});
async function request(
  route: string,
  body: unknown,
  who = 0,
  headers: Record<string, string> = {},
) {
  return fetch(origin + route, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      ...(who >= 0 ? { Cookie: `taklifnoma_session=${tokens[who]}` } : {}),
      ...headers,
    },
    body: JSON.stringify(body),
  });
}
const image = () => `/api/invitations/${invitation.id}/image`;
before(async () => {
  assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
  for (const [i, id] of accounts.entries()) {
    await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${id},${-Math.floor(Math.random() * 1e12) - 1},'Disposable image test','+000000000','telegram_contact',now())`;
    await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${id},${digest(tokens[i])},'Image integration',now()+interval '1 hour',now()+interval '1 hour')`;
  }
  await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${accounts[0]},'ivory-rose-card','draft',${sql.json(invitation)})`;
});
after(async () => {
  await sql.begin(async (tx) => {
    await tx`DELETE FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
    await tx`DELETE FROM invitations WHERE id=${invitation.id} AND owner_id=${accounts[0]}`;
    await tx`DELETE FROM sessions WHERE user_id IN (${accounts[0]},${accounts[1]})`;
    await tx`DELETE FROM users WHERE id IN (${accounts[0]},${accounts[1]})`;
  });
  await closeDb();
});
test("private preview, owned free export, canonical revisions and one-event locks", async () => {
  const input = { revision: invitation.revision, locale: "uz-Latn" };
  assert.equal((await request(image(), input, -1)).status, 401);
  assert.equal((await request(image(), input, 1)).status, 404);
  assert.equal(
    (await request(image(), { ...input, revision: 999 })).status,
    409,
  );
  assert.equal(
    (await request(image(), { ...input, locale: "ru" })).status,
    400,
  );
  assert.equal(
    (await request(image(), input, 0, { Origin: "https://invalid.example" }))
      .status,
    403,
  );
  const preview = await request(
    "/api/static-images/preview",
    { invitation, locale: "uz-Latn" },
    -1,
  );
  assert.equal(
    preview.status,
    200,
    await preview
      .clone()
      .text()
      .then((s) => s.slice(0, 200)),
  );
  assert.equal(preview.headers.get("cache-control"), "private, no-store");
  const small = await sharp(
    Buffer.from(await preview.arrayBuffer()),
  ).metadata();
  assert.equal(small.width, 750);
  assert.equal(small.height, 1050);
  const before =
    await sql`SELECT identity_locked_at FROM invitations WHERE id=${invitation.id}`;
  assert.equal(before[0].identity_locked_at, null);
  const [template] =
    await sql`SELECT published FROM templates WHERE id='ivory-rose-card'`;
  if (!template.published) {
    const response = await request(image(), input);
    assert.equal(response.status, 409);
    console.log(
      "Hidden-template ownership/render gates pass; rerun after catalog publication for final download smoke checks.",
    );
    return;
  }
  const final = await request(image(), input);
  assert.equal(
    final.status,
    200,
    await final
      .clone()
      .text()
      .then((s) => s.slice(0, 200)),
  );
  assert.match(final.headers.get("content-disposition")!, /attachment.*\.png/);
  assert.equal(decodeURIComponent(final.headers.get("content-disposition")!.split("UTF-8''")[1]), "Nodir test-Madina test.png");
  const png = await sharp(Buffer.from(await final.arrayBuffer())).metadata();
  assert.equal(png.width, 1500);
  assert.equal(png.height, 2100);
  assert.equal(png.format, "png");
  const [row] = await sql`SELECT * FROM invitations WHERE id=${invitation.id}`;
  assert.equal(row.status, "draft");
  assert.equal(row.slug, null);
  assert.ok(row.identity_locked_at);
  assert.ok(row.data.imageExportedAt);
  assert.equal(
    (
      await sql`SELECT count(*)::int AS count FROM payment_orders WHERE invitation_id=${invitation.id}`
    )[0].count,
    0,
  );
  invitation = row.data;
  const changed = structuredClone(invitation);
  changed.content["uz-Latn"].people[0] = "Another person";
  assert.equal(
    (await request("/api/invitations", { invitation: changed })).status,
    403,
  );
  const changedDate = { ...invitation, startsAt: "2027-09-15T18:30" };
  assert.equal(
    (await request("/api/invitations", { invitation: changedDate })).status,
    403,
  );
  const corrected = structuredClone(invitation);
  corrected.content["uz-Latn"].address = "Corrected address";
  corrected.content["uz-Latn"].hosts = "Unsupported hosts must not be accepted";
  corrected.content["uz-Latn"].greeting = "Unsupported greeting must not be accepted";
  corrected.contacts.phoneNumber = "+998901234567";
  delete corrected.imageExportedAt;
  const saved = await request("/api/invitations", { invitation: corrected });
  assert.equal(saved.status, 201);
  invitation = (await saved.json()).invitation;
  assert.equal(invitation.content["uz-Latn"].address, "Corrected address");
  assert.equal(invitation.content["uz-Latn"].hosts, "");
  assert.equal(invitation.content["uz-Latn"].greeting, "");
  assert.equal(invitation.contacts.phoneNumber, "");
  assert.ok(
    invitation.imageExportedAt,
    "Client cannot remove finalization metadata",
  );
  assert.equal((await request(image(), input)).status, 409);
  assert.equal(
    (
      await request(image(), {
        revision: invitation.revision,
        locale: "uz-Latn",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request(`/api/invitations/${invitation.id}/checkout`, {
        revision: invitation.revision,
        expectedAmountMinor: 0,
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await request(`/api/invitations/${invitation.id}/publish`, {
        revision: invitation.revision,
      })
    ).status,
    400,
  );
  const reopened = await fetch(origin + `/api/invitations/${invitation.id}`, {
    headers: { Cookie: `taklifnoma_session=${tokens[0]}` },
  });
  assert.equal(
    (await reopened.json()).invitation.imageExportedAt,
    invitation.imageExportedAt,
  );
});
