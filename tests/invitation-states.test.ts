import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { invitationSchema } from "../packages/contracts/src/index";
import { completeInvitation } from "./fixtures/publication";

test("the invitation contract exposes only draft and published states", () => {
  const invitation = completeInvitation();
  for (const status of ["draft", "published"])
    assert.ok(invitationSchema.safeParse({ ...invitation, status }).success);
  for (const status of ["archived", "deleted"])
    assert.equal(
      invitationSchema.safeParse({ ...invitation, status }).success,
      false,
    );
});

test("legacy archive migration preserves event locks and links, with a private deletion tombstone", async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE TABLE invitations (
      id text PRIMARY KEY, status text CHECK(status IN ('draft','published','archived')),
      data jsonb, slug text, identity_locked_at timestamptz,
      edit_deadline_at timestamptz, archived_at timestamptz, updated_at timestamptz
    );
    INSERT INTO invitations VALUES ('legacy','archived','{"status":"archived","revision":7}',
      'Abc123','2026-10-01Z','2026-12-01Z','2026-10-20Z','2026-10-20Z');`);
    const before = (
      await db.query(
        "SELECT slug,identity_locked_at,edit_deadline_at FROM invitations",
      )
    ).rows[0];
    await db.exec(
      await readFile(
        new URL(
          "../packages/database/migrations/0162_two_invitation_states.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    const [row] = (
      await db.query<{
        status: string;
        data: { status: string; revision: number };
        archived_at: null;
      }>("SELECT * FROM invitations")
    ).rows;
    assert.equal(row.status, "draft");
    assert.deepEqual(row.data, { status: "draft", revision: 7 });
    assert.equal(row.archived_at, null);
    assert.deepEqual(
      (
        await db.query(
          "SELECT slug,identity_locked_at,edit_deadline_at FROM invitations",
        )
      ).rows[0],
      before,
    );
    await db.exec(
      "UPDATE invitations SET status='deleted',deleted_at=now() WHERE id='legacy'",
    );
    assert.equal(
      (
        await db.query(
          "SELECT id FROM invitations WHERE status IN ('draft','published')",
        )
      ).rows.length,
      0,
    );
    await assert.rejects(
      db.exec("UPDATE invitations SET status='archived' WHERE id='legacy'"),
      /check constraint/,
    );
  } finally {
    await db.close();
  }
});
