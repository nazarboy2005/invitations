import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

let db: PGlite;
let actor: string;
before(async () => {
  db = new PGlite();
  // Isolate the new audit schema from unrelated template publication migrations.
  for (const name of ["0001_foundation.sql", "0151_admin_audit_log.sql"])
    await db.exec(
      await readFile(
        new URL("../packages/database/migrations/" + name, import.meta.url),
        "utf8",
      ),
    );
  const result = await db.query<{ id: string }>(
    "INSERT INTO users(telegram_user_id,display_name,is_admin) VALUES(-1,'Admin',true) RETURNING id",
  );
  actor = result.rows[0].id;
});
after(async () => {
  await db?.close();
});

test("audit schema requires a real actor and recognizes only catalog administration actions", async () => {
  for (const [actorId, action] of [
    [null, "template.update"],
    ["00000000-0000-0000-0000-000000000001", "template.update"],
    [actor, "user.promote"],
  ]) {
    await assert.rejects(
      db.query(
        "INSERT INTO admin_audit_log(actor_id,action,target_id,new_values) VALUES($1,$2,'suzani','{}')",
        [actorId, action],
      ),
    );
  }
});
test("catalog changes roll back if their audit record cannot be persisted", async () => {
  const before = await db.query(
    "SELECT price_minor FROM templates WHERE id='suzani'",
  );
  await assert.rejects(
    db.transaction(async (tx) => {
      await tx.query("UPDATE templates SET price_minor=123 WHERE id='suzani'");
      await tx.query(
        "INSERT INTO admin_audit_log(actor_id,action,target_id,new_values) VALUES(NULL,'template.update','suzani','{}')",
      );
    }),
  );
  assert.deepEqual(
    (await db.query("SELECT price_minor FROM templates WHERE id='suzani'"))
      .rows,
    before.rows,
  );
  assert.equal(
    (await db.query("SELECT id FROM admin_audit_log")).rows.length,
    0,
  );
});
test("audit history stores structured before/after values and creation time", async () => {
  await db.transaction(async (tx) => {
    await tx.query(
      "UPDATE templates SET price_minor=25000000 WHERE id='suzani'",
    );
    await tx.query(
      "INSERT INTO admin_audit_log(actor_id,action,target_id,previous_values,new_values) VALUES($1,'template.update','suzani',$2,$3)",
      [
        actor,
        JSON.stringify({ priceMinor: 15000000 }),
        JSON.stringify({ priceMinor: 25000000 }),
      ],
    );
  });
  const result = await db.query<{
    previous_values: { priceMinor: number };
    new_values: { priceMinor: number };
    created_at: Date;
  }>("SELECT previous_values,new_values,created_at FROM admin_audit_log");
  assert.deepEqual(result.rows[0].previous_values, { priceMinor: 15000000 });
  assert.deepEqual(result.rows[0].new_values, { priceMinor: 25000000 });
  assert.ok(Number.isFinite(new Date(result.rows[0].created_at).getTime()));
});
