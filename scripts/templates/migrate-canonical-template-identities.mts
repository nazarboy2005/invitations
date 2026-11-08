import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { getDb, closeDb } from "../../packages/database/src/index.ts";
import renames from "../../packages/contracts/src/template-renames.json";
import { normalizeTemplateData, resolveTemplateId } from "../../packages/contracts/src/template-identity.ts";

const migration = "0229_canonical_template_identities.sql";
const directory = "docs/qa/2026-11-08-template-renaming";
const tables = ["templates", "invitations", "template_category_assignments", "template_supported_event_types", "template_favorites", "platform_payments", "payment_orders", "invitation_change_requests"];
const canonicalDocument = (data: any) => data && typeof data === "object" && !Array.isArray(data) ? {
  ...data,
  ...(typeof data.templateId === "string" ? { templateId: resolveTemplateId(data.templateId) } : {}),
  ...(data.templateData ? { templateData: normalizeTemplateData(data.templateData) } : {}),
} : data;
const sort = (rows: any[]) => rows.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
const sql = getDb();
try {
  const result = await sql.begin(async tx => {
    await tx`SELECT pg_advisory_xact_lock(74920318)`;
    const applied = await tx`SELECT name FROM schema_migrations WHERE name=${migration}`;
    assert.equal(applied.length, 0, "This scoped migration has already been applied");
    const before: Record<string, any[]> = {};
    for (const table of tables) before[table] = await tx.unsafe(`SELECT * FROM ${table}`);
    await tx.unsafe(await readFile(new URL(`../../packages/database/migrations/${migration}`, import.meta.url), "utf8"));
    const counts: Record<string, number> = {};
    for (const table of tables) {
      const after = await tx.unsafe(`SELECT * FROM ${table}`);
      const expected = before[table].map(row => {
        const next = { ...row };
        for (const key of ["template_id", "replacement_template_id"]) if (typeof next[key] === "string") next[key] = resolveTemplateId(next[key]);
        if (table === "templates") {
          const rename = renames.find(item => item.previousId === next.id);
          if (rename) { next.id = rename.id; next.name = rename.name; }
        }
        if (table === "invitations") next.data = canonicalDocument(next.data);
        if (table === "invitation_change_requests") next.proposed_changes = canonicalDocument(next.proposed_changes);
        return next;
      });
      assert.deepEqual(sort([...after]), sort(expected), `${table}: only approved identity fields may change`);
      counts[table] = after.length;
    }
    for (const row of renames) {
      assert.equal((await tx`SELECT id FROM templates WHERE id=${row.previousId}`).length, 0);
      assert.equal((await tx`SELECT name FROM templates WHERE id=${row.id}`)[0]?.name, row.name);
    }
    assert.equal((await tx`SELECT count(*)::int AS count FROM pg_trigger WHERE tgname IN ('platform_payments_protect','payment_orders_protect') AND tgenabled='O'`)[0].count, 2);
    await tx`INSERT INTO schema_migrations(name) VALUES(${migration})`;
    return { migration, renamedIds: renames.length, counts, verifiedOnlyApprovedIdentityChanges: true, paymentSnapshotsAndProtectionPreserved: true };
  });
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/database-verification.json`, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result, null, 2));
} finally { await closeDb(); }
