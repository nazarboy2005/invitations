import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { createServiceDirectoryCache } from "../apps/web/src/server/service-directory-cache";
import { serviceListings } from "../apps/web/src/modules/services/services-data";

test("directory cache changes with the authoritative revision and never falls back on load errors", async () => {
  const read = createServiceDirectoryCache();
  let loads = 0;
  const load = async () => {
    loads++;
    return { revision: "1", listings: [serviceListings[0]] };
  };
  assert.equal((await read("db", "1", load)).length, 1);
  assert.equal((await read("db", "1", load)).length, 1);
  assert.equal(loads, 1);
  await assert.rejects(
    read("db", "2", async () => {
      throw new Error("offline");
    }),
    /offline/,
  );
  assert.deepEqual(
    await read("db", "2", async () => ({ revision: "2", listings: [] })),
    [],
  );
  // A publication that commits between the version check and content load is safe.
  await read("db", "3", async () => ({
    revision: "4",
    listings: [serviceListings[0]],
  }));
  await read("db", "4", async () => {
    throw new Error("cache should already contain revision 4");
  });
  await assert.rejects(
    read("another-db", "4", async () => {
      throw new Error("separate database");
    }),
    /separate database/,
  );
});

test("database invalidation covers public writes, removal, ordering, rollback and truncation", async () => {
  const db = new PGlite();
  try {
    for (const name of [
      "0001_foundation.sql",
      "0151_admin_audit_log.sql",
      "0234_services_admin.sql",
      "0237_services_cache_revision.sql",
    ])
      await db.exec(
        await readFile(
          new URL(`../packages/database/migrations/${name}`, import.meta.url),
          "utf8",
        ),
      );
    const revision = async () =>
      (
        await db.query<{ revision: string }>(
          "SELECT revision::text FROM service_directory_cache_state",
        )
      ).rows[0].revision;
    assert.equal(await revision(), "1");
    await db.exec(
      `INSERT INTO service_listings(slug,draft) VALUES('qa','{"slug":"qa"}')`,
    );
    assert.equal(
      await revision(),
      "1",
      "private drafts do not invalidate public data",
    );
    await db.exec(
      `UPDATE service_listings SET published=draft,status='published'`,
    );
    assert.equal(await revision(), "2");
    await db.exec(
      `UPDATE service_listings SET draft=draft || '{"name":"private edit"}'`,
    );
    assert.equal(await revision(), "2");
    await db.exec(
      `UPDATE service_listings SET published=published || '{"images":[]}'`,
    );
    assert.equal(await revision(), "3");
    await db.exec(`UPDATE service_listings SET position=position+10`);
    assert.equal(await revision(), "4");
    await db.exec(
      `BEGIN; UPDATE service_listings SET published=NULL,status='draft'; ROLLBACK;`,
    );
    assert.equal(await revision(), "4");
    await db.exec(`UPDATE service_listings SET published=NULL,status='draft'`);
    assert.equal(await revision(), "5");
    await db.exec(
      `UPDATE service_listings SET published=draft,status='published'`,
    );
    assert.equal(await revision(), "6");
    await db.exec(`DELETE FROM service_listings`);
    assert.equal(await revision(), "7");
    await db.exec(
      `INSERT INTO service_listings(slug,draft,published,status) VALUES('qa','{"slug":"qa"}','{"slug":"qa"}','published')`,
    );
    assert.equal(await revision(), "8");
    await db.exec(`TRUNCATE service_listings CASCADE`);
    assert.equal(await revision(), "9");
  } finally {
    await db.close();
  }
});
