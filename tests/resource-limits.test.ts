import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import {
  assertMediaBudget,
  cleanupAbandonedMedia,
} from "../apps/web/src/server/media-policy";
import { putMedia } from "../apps/web/src/server/storage";
import { readLocalMedia } from "../apps/web/src/server/local-storage";
import {
  enforceRateLimit,
  deliveryCooldown,
} from "../apps/web/src/server/rate-limit";
import { processGuestNotifications } from "../apps/web/src/server/guest-notifications";

// Exercise the production SQL against real PostgreSQL semantics in an isolated DB.
function tag(client: any): any {
  const sql = async (parts: TemplateStringsArray, ...values: unknown[]) =>
    (
      await client.query(
        parts
          .map((part, i) => part + (i < values.length ? `$${i + 1}` : ""))
          .join(""),
        values,
      )
    ).rows;
  sql.begin = (fn: any) => client.transaction((tx: any) => fn(tag(tx)));
  sql.json = JSON.stringify;
  return sql;
}

test("shared quotas, delivery cooldowns and retention survive parallel requests", async () => {
  const db = new PGlite();
  const globals = globalThis as any;
  const previousDb = globals.fotihaDatabase;
  const previous = {
    LOCAL_MEDIA_DIR: process.env.LOCAL_MEDIA_DIR,
    APP_URL: process.env.APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    MEDIA_ACCOUNT_MAX_BYTES: process.env.MEDIA_ACCOUNT_MAX_BYTES,
  };
  const directory = await mkdtemp(
    path.join(tmpdir(), "security-cleanup-test-"),
  );
  process.env.LOCAL_MEDIA_DIR = directory;
  process.env.DATABASE_URL = "postgres://unused-test-adapter";
  process.env.SESSION_SECRET = "disposable resource limit test secret";
  process.env.MEDIA_ACCOUNT_MAX_BYTES = "100";
  globals.fotihaDatabase = tag(db);
  const sql = globals.fotihaDatabase;
  try {
    await db.exec(`
      CREATE TABLE users(id uuid PRIMARY KEY,disabled_at timestamptz);
      CREATE TABLE invitations(id uuid PRIMARY KEY,owner_id uuid,status text,data jsonb);
      CREATE TABLE media_assets(id uuid PRIMARY KEY,owner_id uuid,size_bytes bigint,status text,visibility text DEFAULT 'public',created_at timestamptz DEFAULT now(),object_key text);
      CREATE TABLE rate_limits(key text PRIMARY KEY,count integer DEFAULT 1,window_start timestamptz DEFAULT now());
      CREATE TABLE auth_requests(id uuid,expires_at timestamptz);
      CREATE TABLE miniapp_exchanges(init_hash text,expires_at timestamptz);
      CREATE TABLE invitation_viewers(invitation_id uuid,visitor_hash text,last_viewed_at timestamptz);
      CREATE TABLE telegram_connections(user_id uuid,telegram_chat_id text,status text);
      CREATE TABLE wishes(id uuid,invitation_id uuid,deleted_at timestamptz,status text);
      CREATE TABLE rsvp_responses(id uuid,invitation_id uuid);
      CREATE TABLE gift_receipts(id uuid,invitation_id uuid);
      CREATE TABLE pulau_gift_intentions(id uuid,invitation_id uuid);
      CREATE TABLE jobs(id uuid PRIMARY KEY,type text,payload jsonb,status text DEFAULT 'queued',attempts integer DEFAULT 0,available_at timestamptz DEFAULT now(),locked_at timestamptz,created_at timestamptz DEFAULT now(),completed_at timestamptz,last_error text);
    `);
    await db.exec(
      await readFile(
        "packages/database/migrations/0230_security_resource_limits.sql",
        "utf8",
      ),
    );
    const owner = randomUUID(),
      other = randomUUID();
    const reservations = await Promise.allSettled(
      Array.from({ length: 8 }, () =>
        sql.begin(async (tx: any) => {
          await assertMediaBudget(tx, owner, 30, { preparing: true });
          await tx`INSERT INTO media_assets(id,owner_id,size_bytes,status) VALUES(${randomUUID()},${owner},30,'pending')`;
        }),
      ),
    );
    assert.equal(
      reservations.filter((r) => r.status === "fulfilled").length,
      3,
    );
    assert.equal(
      Number(
        (
          await sql`SELECT sum(size_bytes) AS size FROM media_assets WHERE owner_id=${owner}`
        )[0].size,
      ),
      90,
    );
    await sql.begin((tx: any) =>
      assertMediaBudget(tx, other, 100, { preparing: true }),
    );
    const [asset] =
      await sql`SELECT id FROM media_assets WHERE owner_id=${owner} LIMIT 1`;
    await sql.begin((tx: any) =>
      assertMediaBudget(tx, owner, 35, { exceptId: asset.id }),
    );
    await assert.rejects(
      sql.begin((tx: any) =>
        assertMediaBudget(tx, owner, 41, { exceptId: asset.id }),
      ),
      (e: any) => e.code === "STORAGE_QUOTA",
    );

    const slots = await Promise.all(
      Array.from({ length: 8 }, () =>
        sql.begin((tx: any) => deliveryCooldown(tx, "test-chat", "same", 60)),
      ),
    );
    assert.equal(slots.filter((value) => value === null).length, 1);
    assert.ok(
      slots
        .filter(Boolean)
        .every((value) => Number.isFinite(new Date(value).getTime())),
    );

    const invitation = randomUUID();
    await sql`INSERT INTO invitation_viewers VALUES(${invitation},'old',now()-interval '91 days'),(${invitation},'recent',now())`;
    const limits = await Promise.allSettled(
      Array.from({ length: 8 }, () =>
        enforceRateLimit({
          scope: "test",
          identity: "same",
          maximum: 3,
          windowSeconds: 60,
        }),
      ),
    );
    assert.equal(limits.filter((r) => r.status === "fulfilled").length, 3);
    assert.deepEqual(
      (await sql`SELECT visitor_hash FROM invitation_viewers`).map(
        (r: any) => r.visitor_hash,
      ),
      ["recent"],
    );

    await sql`INSERT INTO users VALUES(${owner},null)`;
    await sql`INSERT INTO invitations VALUES(${invitation},${owner},'published',${sql.json({ defaultLocale: "uz-Latn", content: { "uz-Latn": { people: ["Test"] } } })})`;
    await sql`INSERT INTO telegram_connections VALUES(${owner},'disposable-chat','active')`;
    // Chat ID must match the verified user's Telegram ID, as in production.
    await db.exec(
      "ALTER TABLE users ADD COLUMN telegram_user_id text DEFAULT 'disposable-chat'",
    );
    for (let i = 0; i < 3; i++) {
      const id = randomUUID();
      await sql`INSERT INTO rsvp_responses VALUES(${id},${invitation})`;
      await sql`INSERT INTO jobs(id,type,payload) VALUES(${randomUUID()},'guest-notification',${sql.json({ kind: "response", recordId: id, invitationId: invitation, name: "Test", status: "yes", note: "" })})`;
    }
    process.env.APP_URL ||= "https://example.test";
    let sent = 0;
    await processGuestNotifications({
      limit: 5,
      send: async () => {
        sent++;
        return { state: "sent" };
      },
    });
    assert.equal(sent, 1);
    const queued =
      await sql`SELECT attempts,status,available_at>now() AS delayed FROM jobs WHERE status='queued'`;
    assert.equal(queued.length, 2);
    assert.ok(queued.every((row: any) => row.attempts === 0 && row.delayed));
    await db.exec(
      "UPDATE rate_limits SET window_start=now()-interval '2 seconds'; UPDATE jobs SET available_at=now()",
    );
    await processGuestNotifications({
      limit: 5,
      send: async () => {
        sent++;
        return { state: "sent" };
      },
    });
    assert.equal(sent, 2);
    assert.equal(
      (await sql`SELECT * FROM jobs WHERE status='queued'`).length,
      1,
    );

    for (const state of ["pending", "rejected", "ready"]) {
      const key = `local/test/${state}.png`;
      await putMedia(
        key,
        Buffer.from("disposable cleanup fixture"),
        "image/png",
      );
      await sql`INSERT INTO media_assets(id,owner_id,size_bytes,status,created_at,object_key) VALUES(${randomUUID()},${other},26,${state},now()-interval '2 days',${key})`;
    }
    const source = "local/test/recreated.png";
    await putMedia(
      source,
      Buffer.from("recreated before signed URL expired"),
      "image/png",
    );
    await sql`INSERT INTO jobs(id,type,payload,available_at) VALUES(${randomUUID()},'media-cleanup',${sql.json({ key: source, ownerId: other })},now())`;
    assert.equal(await cleanupAbandonedMedia(other), 3);
    for (const key of [
      source,
      "local/test/pending.png",
      "local/test/rejected.png",
    ])
      await assert.rejects(readLocalMedia(key));
    assert.ok(
      (await readLocalMedia("local/test/ready.png")).length > 0,
      "cleanup preserves approved media",
    );
    assert.equal(
      (
        await sql`SELECT status FROM media_assets WHERE owner_id=${other} AND status='expired'`
      ).length,
      2,
    );
  } finally {
    globals.fotihaDatabase = previousDb;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await db.close();
    assert.ok(directory.startsWith(path.resolve(tmpdir()) + path.sep));
    await rm(directory, { recursive: true, force: true });
  }
});
