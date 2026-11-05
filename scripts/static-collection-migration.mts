import { readFile } from "node:fs/promises";
import { getDb, closeDb } from "../packages/database/src/index";

const ids = ["lola-maktubi", "moviy-ravoq-card", "zarhal-oqshom-card"];
const sql = getDb();
const action = process.argv[2] ?? "state";
try {
  const name =
    action === "register"
      ? "0214_register_static_stationery_collection.sql"
      : action === "publish"
        ? "0215_publish_static_stationery_collection.sql"
        : null;
  if (!name && action !== "state")
    throw new Error("Expected state, register or publish");
  if (name) {
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
  }
  console.log(
    JSON.stringify({
      action,
      migrations:
        await sql`SELECT name FROM schema_migrations WHERE name LIKE '0214_%' OR name LIKE '0215_%' ORDER BY name`,
      templates:
        await sql`SELECT id,name,published,price_minor,format FROM templates WHERE id IN ${sql(ids)} ORDER BY id`,
      events:
        await sql`SELECT template_id,event_type FROM template_supported_event_types WHERE template_id IN ${sql(ids)} ORDER BY template_id,event_type`,
      categories:
        await sql`SELECT template_id,category_id FROM template_category_assignments WHERE template_id IN ${sql(ids)} ORDER BY template_id`,
    }),
  );
} finally {
  await closeDb();
}
