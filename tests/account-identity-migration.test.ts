import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("removing account phones discards collected data and preserves Telegram identity, sessions and invitation contacts", async () => {
  const db = new PGlite();
  try {
    const migration = (name: string) =>
      readFile(
        new URL(`../packages/database/migrations/${name}`, import.meta.url),
        "utf8",
      );
    await db.exec(await migration("0001_foundation.sql"));
    const {
      rows: [user],
    } = await db.query<{ id: string }>(
      "INSERT INTO users(telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(123,'Nodir','+998901234567','telegram_contact',now()) RETURNING id",
    );
    await db.query(
      "INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at) VALUES($1,'existing-session',now()+interval '1 day',now()+interval '30 days')",
      [user.id],
    );
    await db.query(
      "INSERT INTO telegram_connections(user_id,telegram_chat_id) VALUES($1,123)",
      [user.id],
    );
    await db.query(
      "INSERT INTO invitations(owner_id,template_id,data) VALUES($1,'suzani',$2)",
      [user.id, { contacts: { phoneNumber: "+998909876543" } }],
    );
    const sql = await migration("0225_remove_account_phone.sql");
    await db.exec(sql);
    await db.exec(sql); // Safe when an interrupted migration is retried.
    const { rows: columns } = await db.query<{ column_name: string }>(
      "SELECT column_name FROM information_schema.columns WHERE table_name='users'",
    );
    for (const field of ["phone_number", "phone_source", "phone_shared_at"])
      assert.ok(!columns.some((column) => column.column_name === field));
    const { rows: accounts } = await db.query(
      "SELECT u.id,u.telegram_user_id,s.token_hash,tc.telegram_chat_id FROM users u JOIN sessions s ON s.user_id=u.id JOIN telegram_connections tc ON tc.user_id=u.id",
    );
    assert.deepEqual(accounts, [
      {
        id: user.id,
        telegram_user_id: 123,
        token_hash: "existing-session",
        telegram_chat_id: 123,
      },
    ]);
    const { rows: invitations } = await db.query<{
      data: { contacts: { phoneNumber: string } };
    }>("SELECT data FROM invitations");
    assert.equal(invitations[0].data.contacts.phoneNumber, "+998909876543");
    await db.query(
      "INSERT INTO users(telegram_user_id,display_name) VALUES(456,'New creator')",
    );
  } finally {
    await db.close();
  }
});
