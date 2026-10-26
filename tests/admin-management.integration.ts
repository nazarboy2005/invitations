// Local HTTP and disposable rows only. All Telegram delivery below is stubbed.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { processAdminBroadcasts } from "../apps/web/src/server/jobs/admin-broadcast";
import { processTelegramUpdate } from "../apps/web/src/server/auth/telegram";
import { completeInvitation } from "./fixtures/publication";
import { removeMedia } from "../apps/web/src/server/storage";
const db = getDb(),
  origin = process.env.APP_URL!;
const ids = {
  admin: randomUUID(),
  owner: randomUUID(),
  subscriber: randomUUID(),
  suspend: randomUUID(),
};
const tokens: Record<string, string> = {},
  broadcasts: string[] = [],
  updates: number[] = [];
const invitation = completeInvitation();
let paymentId: string;
async function req(
  path: string,
  role: string | null = "admin",
  body?: unknown,
  method = "POST",
  extra: Record<string, string> = {},
) {
  return fetch(origin + path, {
    redirect: "manual",
    ...(body === undefined ? {} : { method, body: JSON.stringify(body) }),
    headers: {
      Origin: origin,
      ...(role ? { Cookie: `taklifnoma_session=${tokens[role]}` } : {}),
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...extra,
    },
  });
}
async function expect(response: Response, status: number, code?: string) {
  assert.equal(response.status, status, await response.clone().text());
  assert.match(response.headers.get("Cache-Control") ?? "", /no-store/);
  const result = await response.json();
  if (code) assert.equal(result.error?.code, code);
  return result;
}
const context = (id = invitation.id) => ({
  "X-Admin-Invitation": id,
  "X-Admin-Reason": encodeURIComponent("Disposable administrator verification"),
});
async function clearRate() {
  await db`DELETE FROM rate_limits WHERE key=${"admin-write:" + ids.admin}`;
}
async function campaign(
  message = "Test <b>plain text</b>",
  selected = [ids.owner, ids.subscriber],
) {
  await clearRate();
  const created = await expect(
    await req("/api/admin/broadcasts", "admin", {
      title: "Disposable admin management QA",
      message,
      audience: "selected",
      userIds: selected,
      idempotencyKey: randomUUID(),
    }),
    201,
  );
  broadcasts.push(created.id);
  return created;
}
before(async () => {
  assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
  for (const [role, id] of Object.entries(ids)) {
    await db`INSERT INTO users(id,telegram_user_id,display_name,phone_shared_at,is_admin) VALUES(${id},${Math.floor(Math.random() * 1e12) + 1},${"Management QA " + role},now(),${role === "admin"})`;
    tokens[role] = randomToken();
    await db`INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at) VALUES(${id},${digest(tokens[role])},now()+interval '1 hour',now()+interval '1 hour')`;
    if (role !== "admin")
      await db`INSERT INTO telegram_connections(user_id,telegram_chat_id,status) SELECT id,telegram_user_id,'active' FROM users WHERE id=${id}`;
  }
  tokens.stale = randomToken();
  await db`INSERT INTO sessions(user_id,token_hash,created_at,expires_at,absolute_expires_at) VALUES(${ids.admin},${digest(tokens.stale)},now()-interval '13 hours',now()+interval '1 hour',now()+interval '1 hour')`;
  await db`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${ids.owner},${invitation.templateId},'draft',${db.json(invitation)})`;
});
after(async () => {
  const users = Object.values(ids);
  const assets =
    await db`SELECT object_key FROM media_assets WHERE owner_id=ANY(${db.array(users)}::uuid[])`;
  for (const asset of assets)
    if (asset.object_key.startsWith("local/"))
      await removeMedia(asset.object_key);
  await db.begin(async (tx) => {
    if (updates.length)
      await tx`DELETE FROM telegram_updates WHERE update_id=ANY(${tx.array(updates)}::bigint[])`;
    await tx`DELETE FROM admin_broadcast_recipients WHERE broadcast_id IN (SELECT id FROM admin_broadcasts WHERE created_by=${ids.admin})`;
    await tx`DELETE FROM admin_broadcasts WHERE created_by=${ids.admin}`;
    await tx`DELETE FROM platform_payments WHERE created_by=${ids.admin}`;
    await tx`DELETE FROM wishes WHERE invitation_id IN(SELECT id FROM invitations WHERE owner_id=ANY(${tx.array(users)}::uuid[]))`;
    await tx`DELETE FROM invitation_audit_log WHERE invitation_id IN(SELECT id FROM invitations WHERE owner_id=ANY(${tx.array(users)}::uuid[]))`;
    await tx`DELETE FROM invitations WHERE owner_id=ANY(${tx.array(users)}::uuid[])`;
    await tx`DELETE FROM media_assets WHERE owner_id=ANY(${tx.array(users)}::uuid[])`;
    await tx`DELETE FROM admin_audit_log WHERE actor_id=ANY(${tx.array(users)}::uuid[])`;
    await tx`DELETE FROM telegram_connections WHERE user_id=ANY(${tx.array(users)}::uuid[])`;
    await tx`DELETE FROM sessions WHERE user_id=ANY(${tx.array(users)}::uuid[])`;
    await tx`DELETE FROM rate_limits WHERE key=ANY(${tx.array(users.map((id) => "admin-write:" + id))}::text[])`;
    await tx`DELETE FROM users WHERE id=ANY(${tx.array(users)}::uuid[])`;
  });
  await closeDb();
});
test("management pages and APIs deny ordinary, anonymous and stale admin sessions", async () => {
  for (const path of [
    "/api/admin/users",
    "/api/admin/invitations",
    "/api/admin/payments",
    "/api/admin/broadcasts",
  ]) {
    await expect(await req(path, null), 401);
    await expect(await req(path, "owner"), 403);
    await expect(await req(path, "stale"), 401, "ADMIN_REAUTH_REQUIRED");
  }
  for (const view of ["users", "invitations", "payments", "broadcasts"]) {
    assert.equal((await req("/admin?view=" + view, "owner")).status, 404);
    assert.equal((await req("/admin?view=" + view)).status, 200);
  }
  await expect(
    await req("/api/internal/broadcasts", null),
    process.env.CRON_SECRET ? 401 : 503,
  );
});
test("users, invitation links and private owner details use bounded authenticated queries", async () => {
  const users = await expect(
    await req("/api/admin/users?q=Management%20QA"),
    200,
  );
  assert.equal(users.items.length, 4);
  const data = await expect(
    await req(`/api/admin/invitations?userId=${ids.owner}`),
    200,
  );
  assert.equal(data.total, 1);
  assert.equal(data.items[0].url, null);
  assert.equal(data.items[0].ownerId, ids.owner);
  const detail = await expect(await req(`/api/admin/users/${ids.owner}`), 200);
  assert.equal(detail.id, ids.owner);
  await expect(await req("/api/admin/users?page=-1"), 400, "INVALID_INPUT");
});
test("suspension revokes sessions, restore never revives revoked sessions, administrators are protected", async () => {
  await expect(
    await req(
      `/api/admin/users/${ids.suspend}`,
      "owner",
      { action: "suspend", reason: "Not authorized" },
      "PATCH",
    ),
    403,
  );
  await expect(
    await req(
      `/api/admin/users/${ids.suspend}`,
      "admin",
      { action: "suspend", reason: "Support security review" },
      "PATCH",
    ),
    200,
  );
  assert.equal(
    (await expect(await req("/api/auth/session", "suspend"), 200)).user,
    null,
  );
  await expect(
    await req(
      `/api/admin/users/${ids.suspend}`,
      "admin",
      { action: "restore", reason: "Review has completed" },
      "PATCH",
    ),
    200,
  );
  assert.equal(
    (await expect(await req("/api/auth/session", "suspend"), 200)).user,
    null,
  );
  await expect(
    await req(
      `/api/admin/users/${ids.admin}`,
      "admin",
      { action: "suspend", reason: "Cannot suspend own admin" },
      "PATCH",
    ),
    409,
    "PROTECTED_ADMIN",
  );
});
test("explicit admin editing preserves ownership and logs the actual actor; forged context fails", async () => {
  await clearRate();
  const updated = {
    ...invitation,
    content: {
      ...invitation.content,
      "uz-Latn": {
        ...invitation.content["uz-Latn"],
        greeting: "Administrator checked authored text",
      },
    },
  };
  await expect(
    await req(
      "/api/invitations",
      "subscriber",
      { invitation: updated },
      "POST",
      context(),
    ),
    403,
  );
  await expect(
    await req("/api/invitations", "admin", { invitation: updated }, "POST", {
      "X-Admin-Invitation": invitation.id,
    }),
    400,
    "ADMIN_REASON_REQUIRED",
  );
  await expect(
    await req(
      "/api/invitations",
      "admin",
      { invitation: updated },
      "POST",
      context(randomUUID()),
    ),
    400,
    "ADMIN_CONTEXT_MISMATCH",
  );
  const saved = await expect(
    await req(
      "/api/invitations",
      "admin",
      { invitation: updated },
      "POST",
      context(),
    ),
    201,
  );
  const [row] =
    await db`SELECT owner_id FROM invitations WHERE id=${invitation.id}`;
  assert.equal(row.owner_id, ids.owner);
  const [audit] =
    await db`SELECT actor_id FROM admin_audit_log WHERE action='invitation.update' AND target_id=${invitation.id}`;
  assert.equal(audit.actor_id, ids.admin);
  const published = await expect(
    await req(
      `/api/invitations/${invitation.id}/publish`,
      "admin",
      { revision: saved.invitation.revision },
      "POST",
      context(),
    ),
    200,
  );
  assert.match(published.invitation.slug, /^[0-9A-Za-z]{6}$/);
  const data = await expect(
    await req(`/api/admin/invitations?userId=${ids.owner}`),
    200,
  );
  assert.match(data.items[0].url, /\/i\/[A-Za-z0-9]{6}$/);
});
test("admin can moderate owner wishes with explicit scope and audit, while other users cannot", async () => {
  const [wish] =
    await db`INSERT INTO wishes(invitation_id,name,message) VALUES(${invitation.id},'QA Guest','QA wish') RETURNING id`;
  const path = `/api/invitations/${invitation.id}/activity`;
  await expect(
    await req(
      path,
      "subscriber",
      { wishId: wish.id, status: "approved" },
      "PATCH",
    ),
    404,
  );
  await expect(
    await req(
      path,
      "admin",
      { wishId: wish.id, status: "approved" },
      "PATCH",
      context(),
    ),
    200,
  );
  const [row] =
    await db`SELECT status,moderated_by FROM wishes WHERE id=${wish.id}`;
  assert.equal(row.status, "approved");
  assert.equal(row.moderated_by, ids.admin);
});
test("manual payment records are idempotent, revisioned and never enable live payments", async () => {
  await clearRate();
  const body = {
    invitationId: invitation.id,
    amountMinor: 15500001,
    reference: "QA-only",
    note: "Manual register verification",
    idempotencyKey: randomUUID(),
  };
  const [a, b] = await Promise.all([
    req("/api/admin/payments", "admin", body),
    req("/api/admin/payments", "admin", body),
  ]);
  const first = await expect(a, 201),
    second = await expect(b, 201);
  assert.equal(first.id, second.id);
  paymentId = first.id;
  await expect(
    await req("/api/admin/payments", "admin", { ...body, amountMinor: 1 }),
    409,
    "IDEMPOTENCY_CONFLICT",
  );
  await expect(
    await req(
      `/api/admin/payments/${paymentId}`,
      "admin",
      {
        revision: 1,
        status: "received",
        note: "Bank receipt checked manually",
      },
      "PATCH",
    ),
    200,
  );
  await expect(
    await req(
      `/api/admin/payments/${paymentId}`,
      "admin",
      { revision: 1, status: "refunded", note: "Stale update must fail" },
      "PATCH",
    ),
    409,
    "STALE_REVISION",
  );
  await expect(
    await req(
      `/api/admin/payments/${paymentId}`,
      "admin",
      { revision: 2, amountMinor: 1, note: "Cannot alter received amount" },
      "PATCH",
    ),
    409,
    "AMOUNT_LOCKED",
  );
  const [row] =
    await db`SELECT method,status,amount_minor FROM platform_payments WHERE id=${paymentId}`;
  assert.equal(row.method, "manual");
  assert.equal(row.status, "received");
  assert.equal(Number(row.amount_minor), 15500001);
});
test("admin creation produces an owner-bound draft and the shared editor/preview is accessible", async () => {
  await clearRate();
  const result = await expect(
    await req(`/api/admin/users/${ids.owner}/invitations`, "admin", {
      templateId: invitation.templateId,
      reason: "Create a support draft",
    }),
    201,
  );
  const [row] =
    await db`SELECT owner_id,status,data FROM invitations WHERE id=${result.id}`;
  assert.equal(row.owner_id, ids.owner);
  assert.equal(row.status, "draft");
  assert.ok(row.data.content["uz-Latn"].people.every((name: string) => !name));
  assert.equal((await req(`/admin/invitations/${result.id}/edit`)).status, 200);
  assert.equal(
    (await req(`/admin/invitations/${result.id}/edit`, "subscriber")).status,
    404,
  );
  await expect(
    await req(
      `/api/admin/invitations/${result.id}`,
      "admin",
      { action: "delete", reason: "Delete the disposable draft" },
      "PATCH",
    ),
    200,
  );
});

test("administrator upload context cannot seal or overwrite another invitation's asset", async () => {
  await clearRate();
  const other = completeInvitation(),
    asset = randomUUID();
  await db`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${other.id},${ids.owner},${other.templateId},'draft',${db.json(other)})`;
  await db`INSERT INTO media_assets(id,owner_id,draft_id,object_key,url,filename,mime_type,size_bytes,visibility,status) VALUES(${asset},${ids.owner},${other.id},${"local/creators/" + ids.owner + "/" + other.id + "/" + asset + ".png"},${"/api/media/" + asset},'scoped-test.png','image/png',32,'public','pending')`;
  await expect(
    await req(`/api/uploads/${asset}/complete`, "admin", {}, "POST", context()),
    403,
    "ADMIN_CONTEXT_MISMATCH",
  );
  const content = await fetch(`${origin}/api/uploads/${asset}/content`, {
    method: "PUT",
    headers: {
      Origin: origin,
      Cookie: `taklifnoma_session=${tokens.admin}`,
      "Content-Type": "image/png",
      ...context(),
    },
    body: new Uint8Array(32),
  });
  await expect(content, 403, "ADMIN_CONTEXT_MISMATCH");
  await expect(
    await req(
      `/api/uploads/${asset}/complete`,
      "subscriber",
      {},
      "POST",
      context(other.id),
    ),
    403,
  );
  assert.equal(
    (await db`SELECT status FROM media_assets WHERE id=${asset}`)[0].status,
    "pending",
  );
});
test("broadcast confirmation freezes and deduplicates eligible recipients, without sending from request creation", async () => {
  await db`UPDATE telegram_connections SET broadcast_opt_out_at=now() WHERE user_id=${ids.subscriber}`;
  const draft = await campaign();
  assert.equal(draft.recipientCount, 1);
  await expect(
    await req(
      `/api/admin/broadcasts/${draft.id}`,
      "admin",
      { action: "confirm", recipientCount: 2 },
      "PATCH",
    ),
    409,
    "AUDIENCE_CHANGED",
  );
  assert.equal(
    (await db`SELECT status FROM admin_broadcasts WHERE id=${draft.id}`)[0]
      .status,
    "draft",
  );
  await expect(
    await req(
      `/api/admin/broadcasts/${draft.id}`,
      "admin",
      { action: "confirm", recipientCount: 1 },
      "PATCH",
    ),
    200,
  );
  const delivered: string[] = [];
  await processAdminBroadcasts({
    broadcastId: draft.id,
    send: async (chat) => {
      delivered.push(chat);
      return { state: "sent", messageId: 100 };
    },
    pause: async () => {},
  });
  assert.equal(delivered.length, 1);
  assert.equal(
    (await db`SELECT status FROM admin_broadcasts WHERE id=${draft.id}`)[0]
      .status,
    "completed",
  );
  await processAdminBroadcasts({
    broadcastId: draft.id,
    send: async () => {
      throw new Error("Duplicate send");
    },
    pause: async () => {},
  });
  assert.equal(delivered.length, 1);
});
test("delivery rechecks opt-out, skips cancellation, and does not retry ambiguous sends", async () => {
  await db`UPDATE telegram_connections SET broadcast_opt_out_at=NULL WHERE user_id=${ids.subscriber}`;
  const ambiguous = await campaign("Ambiguous test", [ids.subscriber]);
  await expect(
    await req(
      `/api/admin/broadcasts/${ambiguous.id}`,
      "admin",
      { action: "confirm", recipientCount: 1 },
      "PATCH",
    ),
    200,
  );
  let attempts = 0;
  const send = async () => {
    attempts++;
    return { state: "uncertain" as const };
  };
  await processAdminBroadcasts({
    broadcastId: ambiguous.id,
    send,
    pause: async () => {},
  });
  await processAdminBroadcasts({
    broadcastId: ambiguous.id,
    send,
    pause: async () => {},
  });
  assert.equal(attempts, 1);
  const stopped = await campaign("Stop test", [ids.subscriber]);
  await expect(
    await req(
      `/api/admin/broadcasts/${stopped.id}`,
      "admin",
      { action: "confirm", recipientCount: 1 },
      "PATCH",
    ),
    200,
  );
  await db`UPDATE telegram_connections SET broadcast_opt_out_at=now() WHERE user_id=${ids.subscriber}`;
  await processAdminBroadcasts({
    broadcastId: stopped.id,
    send: async () => {
      throw new Error("Opted out user contacted");
    },
    pause: async () => {},
  });
  assert.equal(
    (
      await db`SELECT status FROM admin_broadcast_recipients WHERE broadcast_id=${stopped.id}`
    )[0].status,
    "skipped",
  );
  const cancelled = await campaign("Cancellation test", [ids.owner]);
  await expect(
    await req(
      `/api/admin/broadcasts/${cancelled.id}`,
      "admin",
      { action: "cancel" },
      "PATCH",
    ),
    200,
  );
  assert.equal(
    (await db`SELECT status FROM admin_broadcasts WHERE id=${cancelled.id}`)[0]
      .status,
    "cancelled",
  );
});

test("queued delivery stops after the confirming administrator is demoted", async () => {
  const draft = await campaign("Role revoked test", [ids.owner]);
  await expect(
    await req(
      `/api/admin/broadcasts/${draft.id}`,
      "admin",
      {
        action: "confirm",
        recipientCount: 1,
      },
      "PATCH",
    ),
    200,
  );
  let calls = 0;
  try {
    await db`UPDATE users SET is_admin=false WHERE id=${ids.admin}`;
    await processAdminBroadcasts({
      broadcastId: draft.id,
      send: async () => {
        calls++;
        return { state: "sent", messageId: 1 };
      },
      pause: async () => {},
    });
    assert.equal(calls, 0);
    assert.equal(
      (await db`SELECT status FROM admin_broadcasts WHERE id=${draft.id}`)[0]
        .status,
      "cancelled",
    );
    assert.equal(
      (
        await db`SELECT status FROM admin_broadcast_recipients WHERE broadcast_id=${draft.id}`
      )[0].status,
      "skipped",
    );
  } finally {
    await db`UPDATE users SET is_admin=true WHERE id=${ids.admin}`;
  }
});

test("workers serialize delivery and respect Telegram cooldown without duplicate sends", async () => {
  const draft = await campaign("Worker lease test", [ids.owner]);
  await expect(
    await req(
      `/api/admin/broadcasts/${draft.id}`,
      "admin",
      {
        action: "confirm",
        recipientCount: 1,
      },
      "PATCH",
    ),
    200,
  );
  let calls = 0,
    release!: () => void,
    claimed!: () => void;
  const waiting = new Promise<void>((resolve) => {
    release = resolve;
  });
  const started = new Promise<void>((resolve) => {
    claimed = resolve;
  });
  const first = processAdminBroadcasts({
    broadcastId: draft.id,
    send: async () => {
      calls++;
      claimed();
      await waiting;
      return { state: "retry", retryAfter: 60 };
    },
    pause: async () => {},
  });
  try {
    await started;
    const second = await processAdminBroadcasts({
      broadcastId: draft.id,
      send: async () => {
        calls++;
        return { state: "sent", messageId: 2 };
      },
      pause: async () => {},
    });
    assert.equal(second.busy, true);
  } finally {
    release();
    await first;
  }
  try {
    assert.equal(calls, 1);
    assert.equal(
      (
        await processAdminBroadcasts({
          broadcastId: draft.id,
          send: async () => {
            calls++;
            return { state: "uncertain" };
          },
          pause: async () => {},
        })
      ).busy,
      true,
    );
    const [row] =
      await db`SELECT status,attempts,available_at>now() AS delayed FROM admin_broadcast_recipients WHERE broadcast_id=${draft.id}`;
    assert.equal(row.status, "pending");
    assert.equal(row.attempts, 1);
    assert.equal(row.delayed, true);
    await db`UPDATE admin_worker_leases SET expires_at=now()-interval '1 second' WHERE name='broadcast'`;
    await db`UPDATE admin_broadcast_recipients SET available_at=now() WHERE broadcast_id=${draft.id}`;
    await processAdminBroadcasts({
      broadcastId: draft.id,
      send: async () => {
        calls++;
        return { state: "sent", messageId: 3 };
      },
      pause: async () => {},
    });
    assert.equal(calls, 2);
    assert.equal(
      (await db`SELECT status FROM admin_broadcasts WHERE id=${draft.id}`)[0]
        .status,
      "completed",
    );
  } finally {
    await db`UPDATE admin_worker_leases SET expires_at=now()-interval '1 second' WHERE name='broadcast'`;
  }
});

test("private Telegram commands persist broadcast preferences and deduplicate update replay", async () => {
  const [user] =
    await db`SELECT telegram_user_id FROM users WHERE id=${ids.owner}`;
  const chatId = Number(user.telegram_user_id),
    originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (input) => {
    assert.equal(new URL(String(input)).hostname, "api.telegram.org");
    calls++;
    return Response.json({ ok: true, result: { message_id: 999 } });
  };
  try {
    const stop = Math.floor(Math.random() * 1e12) + 1,
      subscribe = stop + 1;
    updates.push(stop, subscribe);
    const update = (id: number, text: string) => ({
      update_id: id,
      message: {
        message_id: 1,
        chat: { id: chatId, type: "private" },
        from: { id: chatId, first_name: "Management QA owner" },
        text,
      },
    });
    await processTelegramUpdate(update(stop, "/stop"));
    await processTelegramUpdate(update(stop, "/stop"));
    assert.equal(calls, 1);
    assert.ok(
      (
        await db`SELECT broadcast_opt_out_at FROM telegram_connections WHERE user_id=${ids.owner}`
      )[0].broadcast_opt_out_at,
    );
    await processTelegramUpdate(update(subscribe, "/subscribe"));
    assert.equal(calls, 2);
    assert.equal(
      (
        await db`SELECT broadcast_opt_out_at FROM telegram_connections WHERE user_id=${ids.owner}`
      )[0].broadcast_opt_out_at,
      null,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
