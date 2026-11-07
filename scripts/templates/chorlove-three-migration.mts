import { readFile, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { getDb, closeDb } from "../../packages/database/src/index";

const ids = ["stained-glass", "sunset", "swan-garden"];
const action = process.argv[2] ?? "state";
const sql = getDb();
const directory = new URL(
  "../../docs/templates/chorlove-three-verification/",
  import.meta.url,
);
await mkdir(directory, { recursive: true });
try {
  const othersBefore =
    await sql`SELECT * FROM templates WHERE id NOT IN ${sql(ids)} ORDER BY id`;
  const name =
    action === "register"
      ? "0222_register_chorlove_three.sql"
      : action === "publish"
        ? "0223_publish_chorlove_three.sql"
        : null;
  assert.ok(name || action === "state");
  if (name) {
    const source = await readFile(
      new URL(`../../packages/database/migrations/${name}`, import.meta.url),
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
  assert.deepEqual(
    await sql`SELECT * FROM templates WHERE id NOT IN ${sql(ids)} ORDER BY id`,
    othersBefore,
    "Other catalog rows must remain unchanged",
  );
  const result = {
    action,
    otherTemplatesUnchanged: othersBefore.length,
    migrations:
      await sql`SELECT name FROM schema_migrations WHERE name LIKE '0222_%' OR name LIKE '0223_%' ORDER BY name`,
    templates:
      await sql`SELECT id,name,published,price_minor,currency,format FROM templates WHERE id IN ${sql(ids)} ORDER BY id`,
    events:
      await sql`SELECT template_id,event_type FROM template_supported_event_types WHERE template_id IN ${sql(ids)} ORDER BY template_id,event_type`,
    categories:
      await sql`SELECT template_id,category_id FROM template_category_assignments WHERE template_id IN ${sql(ids)} ORDER BY template_id,category_id`,
  };
  await writeFile(
    new URL(`${action}-database.json`, directory),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await closeDb();
}
