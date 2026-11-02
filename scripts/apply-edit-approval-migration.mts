import { readFile } from "node:fs/promises";
import { getDb, closeDb } from "../packages/database/src/index";
try {
  for (const name of [
    "0209_invitation_edit_approvals.sql",
    "0210_admin_correction_audit.sql",
  ]) {
    await getDb().begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(74920318)`;
      if (
        (await tx`SELECT name FROM schema_migrations WHERE name=${name}`).length
      )
        return;
      await tx.unsafe(
        await readFile(
          new URL(`../packages/database/migrations/${name}`, import.meta.url),
          "utf8",
        ),
      );
      await tx`INSERT INTO schema_migrations(name) VALUES(${name})`;
    });
    console.log(`Verified ${name}`);
  }
} finally {
  await closeDb();
}
