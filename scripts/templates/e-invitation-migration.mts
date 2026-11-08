import { readFile, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { getDb, closeDb } from "../../packages/database/src/index";

const ids = ["olive-manor-edition", "islamic-edition", "monochrome-editorial-edition", "xatna-edition"];
const action = process.argv[2] ?? "state";
const sql = getDb();
const directory = new URL(
  "../../docs/templates/e-invitation-repair/",
  import.meta.url,
);
await mkdir(directory, { recursive: true });
try {
  const othersBefore =
    await sql`SELECT * FROM templates WHERE id NOT IN ${sql(ids)} ORDER BY id`;
  const name = action === "publish" ? "0224_publish_complete_e_invitation_four.sql" : null;
  assert.ok(name || action === "state" || action === "hold");
  if (action === "hold") {
    // A separately deployed older app must not advertise the previous broken renderers.
    await sql`UPDATE templates SET published=false WHERE id IN ${sql(ids)}`;
  }
  if (name) {
    const source = await readFile(
      new URL(`../../packages/database/migrations/${name}`, import.meta.url),
      "utf8",
    );
    await sql.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(74920318)`;
      const applied = (await tx`SELECT name FROM schema_migrations WHERE name=${name}`).length > 0;
      await tx.unsafe(source);
      if (!applied) await tx`INSERT INTO schema_migrations(name) VALUES(${name})`;
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
      await sql`SELECT name FROM schema_migrations WHERE name LIKE '0224_%' ORDER BY name`,
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
