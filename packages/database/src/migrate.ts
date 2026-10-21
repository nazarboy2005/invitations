import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getDb, closeDb } from "./index";

const db = getDb();
try {
  await db.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(74920318)`;
    await tx`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
    const directory = new URL("../migrations/", import.meta.url);
    for (const name of (await readdir(directory))
      .filter((n) => n.endsWith(".sql"))
      .sort()) {
      const applied =
        await tx`SELECT name FROM schema_migrations WHERE name = ${name}`;
      if (applied.length) continue;
      // Finish checks queued by the preceding migration before a later ALTER
      // touches the same table. Keep each migration's deferred trigger semantics.
      await tx`SET CONSTRAINTS ALL IMMEDIATE`;
      await tx`SET CONSTRAINTS ALL DEFERRED`;
      await tx.unsafe(
        await readFile(fileURLToPath(new URL(name, directory)), "utf8"),
      );
      await tx`INSERT INTO schema_migrations (name) VALUES (${name})`;
      console.log(`Applied ${name}`);
    }
  });
} finally {
  await closeDb();
}
