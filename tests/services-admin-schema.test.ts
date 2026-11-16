import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("service URL migration preserves import history on rename/deletion and existing audit actions", async () => {
  const db = new PGlite();
  try {
    for (const name of [
      "0001_foundation.sql",
      "0151_admin_audit_log.sql",
      "0234_services_admin.sql",
      "0236_service_deletion_and_urls.sql",
    ])
      await db.exec(
        await readFile(
          new URL(`../packages/database/migrations/${name}`, import.meta.url),
          "utf8",
        ),
      );
    const {
      rows: [actor],
    } = await db.query<{ id: string }>(
      "INSERT INTO users(telegram_user_id,display_name) VALUES(1,'QA') RETURNING id",
    );
    await db.query(
      "INSERT INTO service_listings(slug,draft) VALUES('old',$1)",
      [JSON.stringify({ slug: "old" })],
    );
    await db.query(
      "INSERT INTO service_import_jobs(input,created_by,service_slug) VALUES('{}',$1,'old')",
      [actor.id],
    );
    await db.exec(
      "UPDATE service_listings SET slug='new',draft='{\"slug\":\"new\"}' WHERE slug='old'",
    );
    assert.equal(
      (
        await db.query<{ service_slug: string }>(
          "SELECT service_slug FROM service_import_jobs",
        )
      ).rows[0].service_slug,
      "new",
    );
    await db.exec("DELETE FROM service_listings WHERE slug='new'");
    assert.equal(
      (
        await db.query<{ service_slug: null }>(
          "SELECT service_slug FROM service_import_jobs",
        )
      ).rows[0].service_slug,
      null,
    );
    for (const action of [
      "service.delete",
      "service.update",
      "invitation.publish",
      "template.update",
    ])
      await db.query(
        "INSERT INTO admin_audit_log(actor_id,action,target_id,new_values) VALUES($1,$2,'qa','{}')",
        [actor.id, action],
      );
    await assert.rejects(
      db.query(
        "INSERT INTO admin_audit_log(actor_id,action,target_id,new_values) VALUES($1,'invalid','qa','{}')",
        [actor.id],
      ),
    );
  } finally {
    await db.close();
  }
});
