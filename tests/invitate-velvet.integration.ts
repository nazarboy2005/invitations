// Explicit opt-in. Creates a disposable Velvet draft in the configured DB,
// verifies save/reopen and the local public renderer, then removes all rows.
// The catalog template row remains unpublished throughout the test.
import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { randomUUID } from "node:crypto";
import {
  createInvitation,
  defaultLocalizedInvitationContent,
  type Invitation,
  type SessionUser,
} from "../packages/contracts/src/index";
import { closeDb, getDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { generatePublicCode } from "../apps/web/src/server/publication";

const sql = getDb();
const origin = process.env.APP_URL!;
const token = randomToken();
const owner: SessionUser = {
  id: randomUUID(),
  telegramUserId: "",
  displayName: "Disposable Velvet integration test",
  phoneShared: true,
  isAdmin: false,
};
const invitation = createInvitation("velvet");
let insertedUser = false;
let insertedSession = false;
let insertedInvitation = false;
let publicSlug: string | undefined;

invitation.eventType = "wedding";
invitation.content["uz-Latn"] = defaultLocalizedInvitationContent(
  "wedding",
  "uz-Latn",
);
invitation.content["uz-Latn"].people = [
  "Velvet Test Groom",
  "Velvet Test Bride",
];
invitation.content["uz-Latn"].greeting = "Velvet integration greeting";
invitation.content["uz-Latn"].message = "Initial Velvet invitation message";
invitation.content["uz-Latn"].venueName = "Velvet integration venue";
invitation.content["uz-Latn"].address = "Initial Velvet test address";
invitation.startsAt = "2027-06-14T18:30";
invitation.timezone = "Asia/Tashkent";

async function request(path: string, body?: unknown, method?: string) {
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
  const template = await sql`
    SELECT published FROM templates WHERE id='velvet'
  `;
  assert.equal(template[0]?.published, false, "Velvet must remain unpublished.");

  const [user] = await sql`
    INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at)
    VALUES(${owner.id},${-Math.floor(Math.random() * 1e12) - 1},${owner.displayName},'+000000000','telegram_contact',now())
    RETURNING telegram_user_id
  `;
  insertedUser = true;
  owner.telegramUserId = String(user.telegram_user_id);
  await sql`
    INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at)
    VALUES(${owner.id},${digest(token)},'Velvet integration test',now()+interval '1 hour',now()+interval '1 hour')
  `;
  insertedSession = true;
  const session = await request("/api/auth/session");
  assert.equal((await session.json()).user?.id, owner.id);

  await sql`
    INSERT INTO invitations(id,owner_id,template_id,status,data)
    VALUES(${invitation.id},${owner.id},'velvet','draft',${sql.json(invitation)})
  `;
  insertedInvitation = true;
});

after(async () => {
  await sql.begin(async (tx) => {
    if (insertedInvitation) {
      await tx`DELETE FROM jobs WHERE payload->>'wishId' IN (SELECT id::text FROM wishes WHERE invitation_id=${invitation.id})`;
      await tx`DELETE FROM gift_receipts WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM wishes WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM rsvp_responses WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM invitation_viewers WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
      await tx`DELETE FROM invitations WHERE id=${invitation.id} AND owner_id=${owner.id}`;
    }
    if (insertedSession)
      await tx`DELETE FROM sessions WHERE user_id=${owner.id}`;
    if (insertedUser) await tx`DELETE FROM users WHERE id=${owner.id}`;
  });
  const remaining = await sql`
    SELECT
      (SELECT count(*)::int FROM users WHERE id=${owner.id}) AS users,
      (SELECT count(*)::int FROM sessions WHERE user_id=${owner.id}) AS sessions,
      (SELECT count(*)::int FROM invitations WHERE id=${invitation.id}) AS invitations
  `;
  assert.deepEqual(remaining[0], { users: 0, sessions: 0, invitations: 0 });
  await closeDb();
});

test("Velvet draft saves and reopens while its catalog entry stays private", async () => {
  const opened = await request(`/api/invitations/${invitation.id}`);
  assert.equal(opened.status, 200);
  const openedInvitation = (await opened.json()).invitation as Invitation;
  assert.equal(openedInvitation.templateId, "velvet");
  assert.equal(
    openedInvitation.content["uz-Latn"].message,
    "Initial Velvet invitation message",
  );

  const updated: Invitation = {
    ...openedInvitation,
    content: {
      ...openedInvitation.content,
      "uz-Latn": {
        ...openedInvitation.content["uz-Latn"],
        message: "Saved Velvet invitation message",
        address: "Saved Velvet test address",
      },
    },
  };
  const saved = await request(
    `/api/invitations/${invitation.id}`,
    { invitation: updated },
    "PUT",
  );
  assert.equal(saved.status, 200);
  const savedInvitation = (await saved.json()).invitation as Invitation;
  assert.equal(savedInvitation.revision, 2);
  assert.equal(
    savedInvitation.content["uz-Latn"].address,
    "Saved Velvet test address",
  );

  const reopened = await request(`/api/invitations/${invitation.id}`);
  assert.equal(reopened.status, 200);
  const reopenedInvitation = (await reopened.json()).invitation as Invitation;
  assert.equal(reopenedInvitation.revision, 2);
  assert.equal(
    reopenedInvitation.content["uz-Latn"].message,
    "Saved Velvet invitation message",
  );
  assert.equal(
    reopenedInvitation.content["uz-Latn"].address,
    "Saved Velvet test address",
  );

  const publish = await request(`/api/invitations/${invitation.id}/publish`, {
    revision: 2,
  });
  assert.equal(publish.status, 409);
  assert.equal((await publish.json()).error.code, "TEMPLATE_UNAVAILABLE");

  publicSlug = generatePublicCode();
  const publicInvitation = {
    ...reopenedInvitation,
    status: "published" as const,
    slug: publicSlug,
    revision: 3,
  };
  await sql`
    UPDATE invitations
    SET status='published',slug=${publicSlug},data=${sql.json(publicInvitation)},
      first_published_at=now(),identity_locked_at=now(),edit_deadline_at=now()+interval '1 day'
    WHERE id=${invitation.id} AND owner_id=${owner.id}
  `;
  const publicPage = await fetch(`${origin}/i/${publicSlug}`);
  assert.equal(publicPage.status, 200);
  const html = await publicPage.text();
  assert.match(html, /Velvet Test Groom &amp; Velvet Test Bride invitation/);
  assert.match(html, /\/templates\/velvet\/index\.html\?lang=uz/);
  assert.doesNotMatch(html, /Javohir &amp; Madina/);

  const templatePage = await fetch(`${origin}/templates/velvet/index.html?lang=uz`);
  assert.equal(templatePage.status, 200);
  assert.match(templatePage.headers.get("content-type") ?? "", /text\/html/);
  const catalogArt = await fetch(`${origin}/templates/velvet/preview.webp`);
  assert.equal(catalogArt.status, 200);
  assert.match(catalogArt.headers.get("content-type") ?? "", /image\/webp/);
});
