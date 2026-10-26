import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { sendBroadcastMessage } from "../apps/web/src/server/jobs/admin-broadcast";
import {
  amountToMinor,
  paymentTransitions,
  broadcastCreateSchema,
  broadcastDeliveryText,
} from "../apps/web/src/modules/admin/management-contract";
let db: PGlite,
  actor: string,
  owner: string,
  invitation: string,
  payment: string;
before(async () => {
  db = new PGlite();
  for (const name of [
    "0001_foundation.sql",
    "0151_admin_audit_log.sql",
    "0152_admin_management.sql",
  ])
    await db.exec(
      await readFile(
        new URL("../packages/database/migrations/" + name, import.meta.url),
        "utf8",
      ),
    );
  const users = await db.query<{ id: string }>(
    "INSERT INTO users(telegram_user_id,display_name,is_admin) VALUES(1,'Admin',true),(2,'Owner',false) RETURNING id",
  );
  actor = users.rows[0].id;
  owner = users.rows[1].id;
  const result = await db.query<{ id: string }>(
    "INSERT INTO invitations(owner_id,template_id,data) VALUES($1,'suzani','{}') RETURNING id",
    [owner],
  );
  invitation = result.rows[0].id;
});
after(async () => {
  await db?.close();
});
test("UZS input uses exact minor units and rejects invalid or oversized amounts", () => {
  for (const [input, value] of [
    ["0", 0],
    ["0.01", 1],
    ["150000", 15000000],
    ["1200,45", 120045],
    ["10000000000", 1000000000000],
  ] as const)
    assert.equal(amountToMinor(input), value);
  for (const input of [
    "-1",
    "1e6",
    "Infinity",
    "NaN",
    "12.345",
    "",
    "10000000000.01",
    "1,000,000",
  ])
    assert.equal(amountToMinor(input), null, input);
});

test("Telegram sender uses plain text, honours explicit throttling and preserves ambiguous outcomes", async () => {
  const originalFetch = globalThis.fetch,
    originalToken = process.env.TELEGRAM_BOT_TOKEN;
  process.env.TELEGRAM_BOT_TOKEN = "disposable-test-token";
  let response = Response.json({ ok: true, result: { message_id: 42 } }),
    calls = 0;
  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body));
    calls++;
    assert.equal(body.chat_id, "123");
    assert.equal(body.text, broadcastDeliveryText("<b>Plain text</b>"));
    assert.equal(body.parse_mode, undefined);
    assert.deepEqual(body.link_preview_options, { is_disabled: true });
    return response;
  };
  try {
    assert.deepEqual(await sendBroadcastMessage("123", "<b>Plain text</b>"), {
      state: "sent",
      messageId: 42,
    });
    response = Response.json(
      { ok: false, error_code: 429, parameters: { retry_after: 12 } },
      { status: 429 },
    );
    assert.deepEqual(await sendBroadcastMessage("123", "<b>Plain text</b>"), {
      state: "retry",
      retryAfter: 12,
    });
    response = Response.json({ ok: false, error_code: 403 }, { status: 403 });
    assert.deepEqual(await sendBroadcastMessage("123", "<b>Plain text</b>"), {
      state: "failed",
      code: 403,
    });
    response = new Response("upstream unavailable", { status: 502 });
    assert.deepEqual(await sendBroadcastMessage("123", "<b>Plain text</b>"), {
      state: "uncertain",
    });
    globalThis.fetch = async () => {
      calls++;
      throw new TypeError("Connection reset");
    };
    assert.deepEqual(await sendBroadcastMessage("123", "<b>Plain text</b>"), {
      state: "uncertain",
    });
    assert.equal(calls, 5);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
    else process.env.TELEGRAM_BOT_TOKEN = originalToken;
  }
});
test("broadcast schemas bind selected audiences and render a plain-text unsubscribe footer", () => {
  const base = {
    title: "Update",
    message: "<b>Plain text</b>",
    audience: "selected",
    userIds: [owner],
    idempotencyKey: crypto.randomUUID(),
  };
  assert.ok(broadcastCreateSchema.safeParse(base).success);
  assert.ok(!broadcastCreateSchema.safeParse({ ...base, userIds: [] }).success);
  assert.ok(
    !broadcastCreateSchema.safeParse({ ...base, userIds: [owner, owner] })
      .success,
  );
  assert.ok(
    !broadcastCreateSchema.safeParse({ ...base, audience: "all" }).success,
  );
  assert.ok(!broadcastCreateSchema.safeParse({ ...base, chatId: 123 }).success);
  assert.match(
    broadcastDeliveryText(base.message),
    /^<b>Plain text<\/b>[\s\S]*\/stop$/,
  );
});
test("payment register snapshots ownership and rejects forged invitation ownership", async () => {
  await assert.rejects(
    db.query(
      "INSERT INTO platform_payments(invitation_id,owner_id,template_id,template_name,amount_minor,note,idempotency_key,created_by,updated_by) VALUES($1,$2,'suzani','Suzani',15000000,'Initial record',gen_random_uuid(),$2,$2)",
      [invitation, actor],
    ),
    /foreign key/i,
  );
  const result = await db.query<{ id: string }>(
    "INSERT INTO platform_payments(invitation_id,owner_id,template_id,template_name,amount_minor,note,idempotency_key,created_by,updated_by) VALUES($1,$2,'suzani','Suzani',15000000,'Initial record',gen_random_uuid(),$3,$3) RETURNING id",
    [invitation, owner, actor],
  );
  payment = result.rows[0].id;
  await assert.rejects(
    db.query("UPDATE platform_payments SET owner_id=$1 WHERE id=$2", [
      actor,
      payment,
    ]),
    /immutable/i,
  );
  await assert.rejects(
    db.query("DELETE FROM invitations WHERE id=$1", [invitation]),
    /foreign key/i,
  );
});
test("received amounts and settled payment history cannot be rewritten or reopened", async () => {
  await db.query(
    "UPDATE platform_payments SET amount_minor=20000000 WHERE id=$1",
    [payment],
  );
  await db.query(
    "UPDATE platform_payments SET status='received',received_at=now() WHERE id=$1",
    [payment],
  );
  await assert.rejects(
    db.query("UPDATE platform_payments SET amount_minor=1 WHERE id=$1", [
      payment,
    ]),
    /pending payment/i,
  );
  await assert.rejects(
    db.query(
      "UPDATE platform_payments SET status='pending',received_at=NULL WHERE id=$1",
      [payment],
    ),
    /transition/i,
  );
  await db.query(
    "UPDATE platform_payments SET status='refunded',refunded_at=now() WHERE id=$1",
    [payment],
  );
  await assert.rejects(
    db.query(
      "UPDATE platform_payments SET status='received',refunded_at=NULL WHERE id=$1",
      [payment],
    ),
    /transition/i,
  );
  assert.deepEqual(paymentTransitions.refunded, []);
});
test("broadcast queue deduplicates recipients and requires authorization before queued delivery", async () => {
  const result = await db.query<{ id: string }>(
    "INSERT INTO admin_broadcasts(created_by,title,message,audience,recipient_count,idempotency_key) VALUES($1,'Test','Message','selected',1,gen_random_uuid()) RETURNING id",
    [actor],
  );
  const id = result.rows[0].id;
  await db.query(
    "INSERT INTO admin_broadcast_recipients(broadcast_id,user_id) VALUES($1,$2)",
    [id, owner],
  );
  await assert.rejects(
    db.query(
      "INSERT INTO admin_broadcast_recipients(broadcast_id,user_id) VALUES($1,$2)",
      [id, owner],
    ),
    /unique/i,
  );
  await assert.rejects(
    db.query("UPDATE admin_broadcasts SET status='queued' WHERE id=$1", [id]),
    /check constraint/i,
  );
});
