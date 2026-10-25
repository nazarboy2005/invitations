// Explicit opt-in: run against a local app with APP_URL set. Uses a disposable
// creator session and invitation; cleanup is scoped to its generated IDs.
import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { randomUUID } from "node:crypto";
import {
  createInvitation,
  type Invitation,
  type SessionUser,
} from "../packages/contracts/src/index";
import { closeDb, getDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";

const sql = getDb();
const origin = process.env.APP_URL!;
const owner: SessionUser = {
  id: randomUUID(),
  telegramUserId: "",
  displayName: "Disposable Palov integration test",
  phoneShared: true,
  isAdmin: false,
};
const token = randomToken();
let invitation: Invitation | undefined;
let publicSlug: string | undefined;

async function request(
  path: string,
  body?: unknown,
  method?: string,
) {
  return fetch(`${origin}${path}`, {
    method: method ?? (body === undefined ? "GET" : "POST"),
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: `taklifnoma_session=${token}`,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

before(async () => {
  assert.ok(
    ["127.0.0.1", "localhost"].includes(new URL(origin).hostname),
    "Integration requests must target a local app.",
  );
  const [user] = await sql`
    INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at)
    VALUES(${owner.id},${-Math.floor(Math.random() * 1e12) - 1},${owner.displayName},'+000000000','telegram_contact',now())
    RETURNING telegram_user_id
  `;
  owner.telegramUserId = String(user.telegram_user_id);
  await sql`
    INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at)
    VALUES(${owner.id},${digest(token)},'Palov integration test',now()+interval '1 hour',now()+interval '1 hour')
  `;
  const session = await request("/api/auth/session");
  assert.equal((await session.json()).user?.id, owner.id);

  invitation = createInvitation("palov");
  invitation.eventType = "osh";
  invitation.startsAt = "2027-12-20T10:00";
  invitation.content["uz-Latn"].people = ["Palov integration test"];
  invitation.content["uz-Latn"].eventLabel = "Nahorgi osh";
  invitation.content["uz-Latn"].message = "Test taklifnoma";
  invitation.content["uz-Latn"].venueName = "Test venue";
  invitation.content["uz-Latn"].address = "Test address";
  invitation.contacts.instagramUrl = "@palov.integration.test";
  await sql`
    INSERT INTO invitations(id,owner_id,template_id,status,data)
    VALUES(${invitation.id},${owner.id},'palov','draft',${sql.json(invitation)})
  `;
});

after(async () => {
  await sql.begin(async (tx) => {
    if (invitation) {
      await tx`DELETE FROM jobs WHERE payload->>'wishId' IN (SELECT id::text FROM wishes WHERE invitation_id=${invitation.id})`;
      await tx`DELETE FROM gift_receipts WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM wishes WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM rsvp_responses WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM invitation_viewers WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM invitations WHERE id=${invitation.id} AND owner_id=${owner.id}`;
    }
    await tx`DELETE FROM sessions WHERE user_id=${owner.id}`;
    await tx`DELETE FROM users WHERE id=${owner.id}`;
  });
  const remaining = await sql`
    SELECT
      (SELECT count(*)::int FROM users WHERE id=${owner.id}) AS users,
      (SELECT count(*)::int FROM sessions WHERE user_id=${owner.id}) AS sessions,
      (SELECT count(*)::int FROM invitations WHERE owner_id=${owner.id}) AS invitations
  `;
  assert.deepEqual(remaining[0], { users: 0, sessions: 0, invitations: 0 });
  await closeDb();
});

test("published Palov drafts save, publish, and render publicly", async () => {
  assert.ok(invitation);
  const opened = await request(`/api/invitations/${invitation.id}`);
  assert.equal(opened.status, 200);
  const openedBody = await opened.json();
  assert.equal(openedBody.invitation.templateId, "palov");
  assert.equal(openedBody.invitation.contacts.instagramUrl, "@palov.integration.test");

  const updated: Invitation = {
    ...openedBody.invitation,
    contacts: {
      ...openedBody.invitation.contacts,
      instagramUrl: "https://www.instagram.com/palov.integration.test/",
    },
  };
  const saved = await request(`/api/invitations/${invitation.id}`, { invitation: updated }, "PUT");
  assert.equal(saved.status, 200);
  const savedBody = await saved.json();
  assert.equal(savedBody.invitation.revision, 2);
  assert.equal(
    savedBody.invitation.contacts.instagramUrl,
    "https://www.instagram.com/palov.integration.test/",
  );

  const reopened = await request(`/api/invitations/${invitation.id}`);
  assert.equal(reopened.status, 200);
  const reopenedBody = await reopened.json();
  assert.equal(reopenedBody.invitation.revision, 2);
  assert.equal(
    reopenedBody.invitation.contacts.instagramUrl,
    "https://www.instagram.com/palov.integration.test/",
  );

  const publish = await request(
    `/api/invitations/${invitation.id}/publish`,
    { revision: 2 },
  );
  assert.equal(publish.status, 200, await publish.clone().text());
  const published = await publish.json();
  publicSlug = published.invitation.slug;
  assert.ok(publicSlug);
  const publicPage = await fetch(`${origin}/i/${publicSlug}`);
  assert.equal(publicPage.status, 200);
  assert.match(await publicPage.text(), /templates\/chorlove\/palov\/index\.html/);
  const view = await request(`/api/public/invitations/${invitation.id}/view`, {}, "POST");
  assert.equal(view.status, 204);
  const rsvp = await request(`/api/public/invitations/${invitation.id}/rsvp`, {
    name: "Palov integration guest",
    status: "yes",
    partySize: 1,
  });
  assert.equal(rsvp.status, 201);
  assert.equal((await rsvp.json()).ok, true);
});
