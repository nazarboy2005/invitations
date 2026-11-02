import { readFile } from "node:fs/promises";
import { getDb, closeDb } from "../packages/database/src/index";
const sql = getDb();
const action = process.argv[2] || "state";
try {
  if (action === "state") {
    console.log(
      JSON.stringify({
        migrations:
          await sql`SELECT name FROM schema_migrations ORDER BY name DESC LIMIT 5`,
        template:
          await sql`SELECT id,name,published,price_minor FROM templates WHERE id='ivory-rose-card'`,
      }),
    );
  } else {
    const name =
      action === "register"
        ? "0207_register_ivory_rose_image.sql"
        : action === "publish"
          ? "0208_publish_ivory_rose_image.sql"
          : null;
    if (!name) throw new Error("Expected state, register or publish");
    const source = await readFile(
      new URL(`../packages/database/migrations/${name}`, import.meta.url),
      "utf8",
    );
    await sql.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(74920318)`;
      if (
        (await tx`SELECT name FROM schema_migrations WHERE name=${name}`).length
      )
        return;
      await tx.unsafe(source);
      await tx`INSERT INTO schema_migrations(name) VALUES(${name})`;
    });
    console.log(
      JSON.stringify({
        migration: name,
        template:
          await sql`SELECT id,name,published,price_minor,format FROM templates WHERE id='ivory-rose-card'`,
      }),
    );
  }
} finally {
  await closeDb();
}
