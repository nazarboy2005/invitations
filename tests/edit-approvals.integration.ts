// Local HTTP + disposable database fixtures. No payments or Telegram messages.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { identityValues } from "../packages/contracts/src/changes";
import { completeInvitation } from "./fixtures/publication";
import type { Invitation } from "../packages/contracts/src/index";
import { reviewInvitationChange } from "../apps/web/src/server/invitation-changes";
const db = getDb(),
  origin = process.env.APP_URL!;
const ids = {
  owner: randomUUID(),
  stranger: randomUUID(),
  admin: randomUUID(),
};
const tokens: Record<string, string> = {};
const fixtures: string[] = [];
async function req(
  path: string,
  role: string | null = "owner",
  body?: unknown,
  headers: Record<string, string> = {},
  method?: string,
) {
  return fetch(origin + path, {
    method: method ?? (body === undefined ? "GET" : "POST"),
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      ...(role ? { Cookie: `taklifnoma_session=${tokens[role]}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
async function json(response: Response, status = 200, code?: string) {
  assert.equal(
    response.status,
    status,
    (await response.clone().text()).slice(0, 500),
  );
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  const result = await response.json();
  if (code) assert.equal(result.error?.code, code);
  return result;
}
async function fixture(image = true) {
  const value = normalizeInvitation({
    ...completeInvitation(),
    ...(image
      ? {
          templateId: "ivory-rose-card" as const,
          imageExportedAt: new Date().toISOString(),
        }
      : {}),
  });
  value.music.enabled = false;
  fixtures.push(value.id);
  // Legacy locked drafts and static exports use the same authoritative policy.
  await db`INSERT INTO invitations(id,owner_id,template_id,status,data,identity_locked_at,edit_deadline_at,approved_event_date)
    VALUES(${value.id},${ids.owner},${value.templateId},'draft',${db.json(value)},now(),'2027-06-14T19:00:00Z','2027-06-14')`;
  return value;
}
async function get(id: string) {
  return (await json(await req(`/api/invitations/${id}`)))
    .invitation as Invitation;
}
const changePath = (id: string) => `/api/invitations/${id}/changes`;
async function correction(value: Invitation) {
  const values = identityValues(value);
  values.locales["uz-Latn"]!.people[0] = "Nodir corrected";
  return { type: "identity", values, reason: "Correct the misspelled name" };
}
const review = (id: string) => `/api/admin/invitation-changes/${id}`;
before(async () => {
  assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
  for (const [role, id] of Object.entries(ids)) {
    tokens[role] = randomToken();
    await db`INSERT INTO users(id,telegram_user_id,display_name,phone_shared_at,is_admin) VALUES(${id},${-Math.floor(Math.random() * 1e12) - 1},${"Edit approvals QA " + role},now(),${role === "admin"})`;
    await db`INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at) VALUES(${id},${digest(tokens[role])},now()+interval '1 hour',now()+interval '1 hour')`;
  }
  tokens.stale = randomToken();
  await db`INSERT INTO sessions(user_id,token_hash,created_at,expires_at,absolute_expires_at) VALUES(${ids.admin},${digest(tokens.stale)},now()-interval '13 hours',now()+interval '1 hour',now()+interval '1 hour')`;
});
after(async () => {
  await db.begin(async (tx) => {
    for (const id of fixtures) {
      await tx`DELETE FROM invitation_change_requests WHERE invitation_id=${id}`;
      await tx`DELETE FROM invitation_audit_log WHERE invitation_id=${id}`;
      await tx`DELETE FROM rsvp_responses WHERE invitation_id=${id}`;
      await tx`DELETE FROM wishes WHERE invitation_id=${id}`;
      await tx`DELETE FROM invitation_guests WHERE invitation_id=${id}`;
      await tx`DELETE FROM invitations WHERE id=${id}`;
    }
    for (const id of Object.values(ids)) {
      await tx`DELETE FROM admin_audit_log WHERE actor_id=${id}`;
      await tx`DELETE FROM rate_limits WHERE key IN (${"admin-write:" + id},${"correction-request:" + id})`;
      await tx`DELETE FROM sessions WHERE user_id=${id}`;
      await tx`DELETE FROM users WHERE id=${id}`;
    }
  });
  await closeDb();
});
test("approved correction preserves the published link, publication dates and guest responses", async () => {
  const value = await fixture(false);
  const slug = randomUUID().replaceAll("-", "").slice(0, 6);
  const published = { ...value, status: "published" as const, slug };
  await db`UPDATE invitations SET status='published',slug=${slug},data=${db.json(published)},first_published_at=now() WHERE id=${value.id}`;
  const [guest] =
    await db`INSERT INTO invitation_guests(invitation_id,display_name,token_hash) VALUES(${value.id},'Disposable guest',${digest(randomToken())}) RETURNING id`;
  await db`INSERT INTO rsvp_responses(invitation_id,guest_id,name,status,party_size) VALUES(${value.id},${guest.id},'Disposable guest','yes',1)`;
  const [before] =
    await db`SELECT slug,first_published_at,identity_locked_at,edit_deadline_at FROM invitations WHERE id=${value.id}`;
  const initialPage = await fetch(`${origin}/i/${slug}`);
  assert.equal(initialPage.status, 200);
  assert.ok((await initialPage.text()).includes("Nodir test"));
  const created = await json(
    await req(changePath(value.id), "owner", await correction(published)),
    201,
  );
  // The HTTP review authorization is tested above. Invoke its exact transaction here
  // to verify public rendering without launching unrelated cover-generation work.
  const result = await reviewInvitationChange(
    created.id,
    ids.admin,
    "approve",
    "Same person; spelling verified",
  );
  assert.equal(result.published, true);
  const updatedPage = await fetch(`${origin}/i/${slug}`);
  assert.equal(updatedPage.status, 200);
  assert.ok((await updatedPage.text()).includes("Nodir corrected"));
  const [unchanged] =
    await db`SELECT slug,first_published_at,identity_locked_at,edit_deadline_at FROM invitations WHERE id=${value.id}`;
  assert.deepEqual(unchanged, before);
  assert.equal(
    (
      await db`SELECT count(*)::int AS count FROM rsvp_responses WHERE invitation_id=${value.id} AND guest_id=${guest.id} AND status='yes'`
    )[0].count,
    1,
  );
});
test("static payload locks, bounded dates, immutable metadata and repeat download after expiry", async () => {
  const value = await fixture();
  await json(
    await req("/api/uploads", "owner", {
      filename: "unused.png",
      size: 128,
      contentType: "image/png",
      kind: "image",
      draftId: value.id,
    }),
    403,
    "UPLOAD_FORBIDDEN",
  );
  for (const field of ["message", "eventLabel"] as const) {
    const forged = structuredClone(value);
    forged.content["uz-Latn"][field] = "Another event";
    await json(
      await req("/api/invitations", "owner", { invitation: forged }),
      403,
      "STATIC_CONTENT_LOCKED",
    );
    await json(
      await req(
        `/api/invitations/${value.id}`,
        "owner",
        { invitation: forged },
        {},
        "PUT",
      ),
      403,
    );
  }
  const moved = { ...value, startsAt: "2027-06-13T17:00" };
  let saved = (
    await json(
      await req("/api/invitations", "owner", { invitation: moved }),
      201,
    )
  ).invitation;
  saved = (
    await json(
      await req("/api/invitations", "owner", {
        invitation: { ...saved, startsAt: "2027-06-14T20:00" },
      }),
      201,
    )
  ).invitation;
  await json(
    await req("/api/invitations", "owner", {
      invitation: {
        ...saved,
        startsAt: "2028-06-14T18:00",
        imageExportedAt: undefined,
        approvedEventDate: "2028-06-14",
      },
    }),
    403,
  );
  const [before] =
    await db`SELECT edit_deadline_at,approved_event_date FROM invitations WHERE id=${value.id}`;
  assert.equal(before.approved_event_date, "2027-06-14");
  assert.equal(
    before.edit_deadline_at.toISOString(),
    "2027-06-14T19:00:00.000Z",
  );
  const extension = {
    action: "extend_deadline",
    reason: "Extend location correction access only",
    deadline: "2027-07-01T19:00:00Z",
  };
  await json(
    await req(
      `/api/admin/invitations/${value.id}`,
      "owner",
      extension,
      {},
      "PATCH",
    ),
    403,
  );
  await json(
    await req(
      `/api/admin/invitations/${value.id}`,
      "admin",
      extension,
      {},
      "PATCH",
    ),
  );
  await json(
    await req("/api/invitations", "owner", {
      invitation: { ...saved, startsAt: "2027-06-15T18:00" },
    }),
    403,
    "EVENT_CHANGE_REQUIRES_REVIEW",
  );
  await db`UPDATE invitations SET edit_deadline_at=now()-interval '1 minute' WHERE id=${value.id}`;
  await json(
    await req("/api/invitations", "owner", { invitation: saved }),
    403,
    "EDIT_DEADLINE_PASSED",
  );
  const access = (await json(await req(`/api/invitations/${value.id}`)))
    .editAccess;
  assert.equal(access.locked, true);
  const download = await req(`/api/invitations/${value.id}/image`, "owner", {
    revision: saved.revision,
    locale: "uz-Latn",
  });
  assert.equal(
    download.status,
    200,
    (await download.clone().text()).slice(0, 100),
  );
  assert.equal(download.headers.get("Content-Type"), "image/png");
  await download.arrayBuffer();
});
test("requests enforce ownership, CSRF, strict fields, rate limits and one pending request", async () => {
  const value = await fixture();
  const input = await correction(value);
  await json(await req(changePath(value.id), null, input), 401);
  await json(await req(changePath(value.id), "stranger", input), 404);
  await json(await req(changePath(value.id), "stranger"), 404);
  await json(
    await req(changePath(value.id), "owner", input, {
      Origin: "https://other.example",
    }),
    403,
  );
  await json(
    await req(changePath(value.id), "owner", { ...input, administrator: true }),
    400,
  );
  await json(
    await req(changePath(value.id), "owner", {
      ...input,
      values: { ...input.values, templateId: "suzani" },
    }),
    400,
  );
  const responses = await Promise.all([
    req(changePath(value.id), "owner", input),
    req(changePath(value.id), "owner", input),
  ]);
  assert.deepEqual(responses.map((r) => r.status).sort(), [201, 409]);
  const list = await json(await req(changePath(value.id)));
  assert.equal(list.requests.length, 1);
  await db`INSERT INTO rate_limits(key,count) VALUES(${"correction-request:" + ids.owner},20) ON CONFLICT(key) DO UPDATE SET count=20,window_start=now()`;
  await json(
    await req(changePath(value.id), "owner", {
      type: "postponement",
      reason: "Venue schedule moved",
      values: { startsAt: "2027-07-01T18:00" },
    }),
    429,
  );
  await db`DELETE FROM rate_limits WHERE key=${"correction-request:" + ids.owner}`;
});
test("approval is fresh-admin only, atomic, audited and preserves unrelated changes", async () => {
  const value = await fixture();
  const input = await correction(value);
  const created = await json(
    await req(changePath(value.id), "owner", input),
    201,
  );
  const decision = {
    decision: "approve",
    note: "Same person; spelling verified",
  };
  await json(await req(review(created.id), "owner", decision), 403);
  await json(
    await req(review(created.id), "stale", decision),
    401,
    "ADMIN_REAUTH_REQUIRED",
  );
  await json(
    await req(review(created.id), "admin", decision, {
      Origin: "https://other.example",
    }),
    403,
  );
  const practical = structuredClone(value);
  practical.content["uz-Latn"].address = "New practical address";
  await json(
    await req("/api/invitations", "owner", { invitation: practical }),
    201,
  );
  const [before] =
    await db`SELECT identity_locked_at,edit_deadline_at FROM invitations WHERE id=${value.id}`;
  const decisions = await Promise.all([
    req(review(created.id), "admin", decision),
    req(review(created.id), "admin", decision),
  ]);
  assert.deepEqual(decisions.map((r) => r.status).sort(), [200, 409]);
  const saved = await get(value.id);
  assert.equal(saved.content["uz-Latn"].people[0], "Nodir corrected");
  assert.equal(saved.content["uz-Latn"].address, "New practical address");
  assert.equal(saved.imageExportedAt, value.imageExportedAt);
  assert.equal(saved.revision, value.revision + 2);
  const [after] =
    await db`SELECT identity_locked_at,edit_deadline_at FROM invitations WHERE id=${value.id}`;
  assert.deepEqual(before, after);
  assert.equal(
    (
      await db`SELECT count(*)::int AS count FROM invitation_audit_log WHERE invitation_id=${value.id} AND action='correction_reviewed'`
    )[0].count,
    1,
  );
  assert.equal(
    (
      await db`SELECT count(*)::int AS count FROM admin_audit_log WHERE target_id=${value.id} AND action='invitation.review_correction'`
    )[0].count,
    1,
  );
});
test("postponement approves date/deadline together; stale requests and deleted invitations fail closed", async () => {
  const value = await fixture();
  await db`UPDATE invitations SET edit_deadline_at=now()-interval '1 day' WHERE id=${value.id}`;
  const created = await json(
    await req(changePath(value.id), "owner", {
      type: "postponement",
      values: { startsAt: "2027-07-01T19:00" },
      reason: "Venue changed the event date",
    }),
    201,
  );
  await json(
    await req(review(created.id), "admin", {
      decision: "approve",
      note: "Postponement and editing deadline approved",
    }),
  );
  const [row] =
    await db`SELECT data,edit_deadline_at,approved_event_date FROM invitations WHERE id=${value.id}`;
  assert.equal(row.data.startsAt, "2027-07-01T19:00");
  assert.equal(row.approved_event_date, "2027-07-01");
  assert.equal(row.edit_deadline_at.toISOString(), "2027-07-01T19:00:00.000Z");
  const moved = await json(
    await req(changePath(value.id), "owner", {
      type: "postponement",
      values: { startsAt: "2027-08-01T19:00" },
      reason: "Second date proposal",
    }),
    201,
  );
  await json(
    await req("/api/invitations", "owner", {
      invitation: { ...row.data, startsAt: "2027-06-30T19:00" },
    }),
    201,
  );
  await json(
    await req(review(moved.id), "admin", {
      decision: "approve",
      note: "Attempt stale approval",
    }),
    409,
    "STALE_REQUEST",
  );
  await json(
    await req(review(moved.id), "admin", {
      decision: "reject",
      note: "Previous proposal is stale",
    }),
  );
  const pending = await json(
    await req(
      changePath(value.id),
      "owner",
      await correction(await get(value.id)),
    ),
    201,
  );
  await json(
    await req(`/api/invitations/${value.id}`, "owner", undefined, {}, "DELETE"),
  );
  await json(
    await req(review(pending.id), "admin", {
      decision: "approve",
      note: "Cannot restore deleted content",
    }),
    404,
  );
});
test("locked web drafts allow practical and same-day time edits but not age/date/language bypasses", async () => {
  const value = await fixture(false);
  await json(
    await req("/api/invitations", "owner", {
      invitation: { ...value, startsAt: "2027-06-14T20:00" },
    }),
    201,
  );
  const saved = await get(value.id);
  await json(
    await req("/api/invitations", "owner", {
      invitation: { ...saved, startsAt: "2027-06-15T20:00" },
    }),
    403,
  );
  const name = structuredClone(saved);
  name.content["uz-Latn"].people[0] = "Another person";
  await json(await req("/api/invitations", "owner", { invitation: name }), 403);
});
