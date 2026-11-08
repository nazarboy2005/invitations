import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { getDb, closeDb } from "../../packages/database/src/index.ts";

const sql = getDb();
const name = "0228_clean_template_display_names.sql";
const output = "docs/qa/2026-11-08-template-branding";
try {
  const result = await sql.begin(async tx => {
    await tx`SELECT pg_advisory_xact_lock(74920318)`;
    const before = await tx`SELECT * FROM templates ORDER BY id`;
    const applied = await tx`SELECT name FROM schema_migrations WHERE name=${name}`;
    if (!applied.length) {
      await tx.unsafe(await readFile(new URL(`../../packages/database/migrations/${name}`, import.meta.url), "utf8"));
      await tx`INSERT INTO schema_migrations(name) VALUES(${name})`;
    }
    const after = await tx`SELECT * FROM templates ORDER BY id`;
    const withoutNames = (rows: typeof before) => rows.map(({ name, ...rest }) => rest);
    assert.deepEqual(withoutNames(after), withoutNames(before), "Only template display names may change");
    assert.ok(after.every(row => !/\bedition\b|^(?:taklifla|taklifnomachi|invitate|chorlove|wedivo|marxaba|onlinetaklifnoma|e-invitation)[\s·—–-]/i.test(row.name)));
    return {
      migration: name,
      alreadyApplied: applied.length > 0,
      checked: after.length,
      unchangedExceptNames: true,
      renamed: after.flatMap((row, i) => row.name === before[i].name ? [] : [{ id: row.id, before: before[i].name, after: row.name }]),
      templates: after.map(row => ({ id: row.id, name: row.name, published: row.published })),
    };
  });
  await mkdir(output, { recursive: true });
  await writeFile(`${output}/database-report.json`, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({ ...result, templates: undefined }, null, 2));
} finally { await closeDb(); }
