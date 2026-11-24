import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { updateTemplatePin } from "../apps/web/src/server/template-pinning";
import { getCatalog } from "../apps/web/src/server/catalog";
import { recordAdminChange } from "../apps/web/src/server/admin";
import { orderCatalogTemplates } from "../apps/web/src/modules/catalog/template-order";
import { TEMPLATES } from "../packages/contracts/src/index";

// Run the production SQL and catalog adapter against an isolated PostgreSQL engine.
function tag(client: any): any {
  const sql = async (parts: TemplateStringsArray, ...values: unknown[]) =>
    (
      await client.query(
        parts
          .map((part, i) => part + (i < values.length ? `$${i + 1}` : ""))
          .join(""),
        values,
      )
    ).rows;
  sql.json = JSON.stringify;
  sql.begin = (fn: any) => client.transaction((tx: any) => fn(tag(tx)));
  return sql;
}

test("pins persist, re-pins lead, and audit failures roll back without affecting publication or price", async () => {
  const db = new PGlite();
  const globals = globalThis as any;
  const previousDb = globals.fotihaDatabase;
  const previousUrl = process.env.DATABASE_URL;
  const sql = tag(db);
  globals.fotihaDatabase = sql;
  process.env.DATABASE_URL = "postgres://unused-isolated-pinning-test";
  try {
    const directory = new URL(
      "../packages/database/migrations/",
      import.meta.url,
    );
    // Only the catalog/audit schema: unrelated historical publication guards
    // intentionally prevent some full-history migrations from being replayed.
    for (const name of [
      "0001_foundation.sql",
      "0002_template_categories.sql",
      "0007_template_event_compatibility.sql",
      "0151_admin_audit_log.sql",
      "0226_template_visitor_features.sql",
      "0240_template_pinning.sql",
    ]) {
      await db.exec(await readFile(new URL(name, directory), "utf8"));
    }
    await db.exec(
      "ALTER TABLE templates ADD COLUMN format text NOT NULL DEFAULT 'web'",
    );
    for (const template of TEMPLATES.filter((t) =>
      ["anor", "kozgu", "ganch"].includes(t.id),
    )) {
      await sql`INSERT INTO templates(id,name,price_minor,published) VALUES(${template.id},${template.name},${template.priceMinor},true)`;
      await sql`INSERT INTO template_category_assignments(template_id,category_id) VALUES(${template.id},'wedding')`;
      await sql`INSERT INTO template_supported_event_types(template_id,event_type) VALUES(${template.id},'wedding')`;
    }
    const [actor] =
      await sql`INSERT INTO users(telegram_user_id,display_name,is_admin) VALUES(-1,'Pin test',true) RETURNING id`;
    const initial = await getCatalog(true);
    assert.equal(initial.configured, true);
    assert.ok(initial.templates.every((t) => t.pinnedOrder === null));
    const pin = (id: string, pinned: boolean, actorId = actor.id) =>
      sql.begin(async (tx: any) => {
        const [before] =
          await tx`SELECT pinned_order::text FROM templates WHERE id=${id} FOR UPDATE`;
        const pinnedOrder = await updateTemplatePin(tx, id, pinned);
        await recordAdminChange(
          tx,
          actorId,
          "template.update",
          id,
          { pinnedOrder: before.pinned_order },
          { pinned, pinnedOrder },
        );
        return pinnedOrder;
      });
    const first = await pin("anor", true);
    const second = await pin("kozgu", true);
    assert.ok(BigInt(second!) > BigInt(first!));
    assert.equal(
      await pin("anor", true),
      first,
      "repeated pin requests preserve order",
    );
    let catalog = await getCatalog();
    assert.deepEqual(
      orderCatalogTemplates(catalog.templates, "wedding")
        .slice(0, 2)
        .map((t) => t.id),
      ["kozgu", "anor"],
    );
    assert.equal(await pin("anor", false), null);
    const third = await pin("anor", true);
    assert.ok(BigInt(third!) > BigInt(second!));
    catalog = await getCatalog();
    assert.deepEqual(
      orderCatalogTemplates(catalog.templates, "wedding")
        .slice(0, 2)
        .map((t) => t.id),
      ["anor", "kozgu"],
    );
    await assert.rejects(
      pin("anor", false, "00000000-0000-0000-0000-000000000001"),
    );
    assert.equal(
      (await getCatalog()).templates.find((t) => t.id === "anor")!.pinnedOrder,
      third,
      "audit and pin share a transaction",
    );
    await sql`UPDATE templates SET price_minor=123 WHERE id='anor'`;
    assert.equal(
      (await getCatalog()).templates.find((t) => t.id === "anor")!.pinnedOrder,
      third,
      "price edits do not refresh pins",
    );
    await pin("anor", false);
    await pin("kozgu", false);
    await sql`UPDATE templates SET price_minor=${initial.templates.find((t) => t.id === "anor")!.priceMinor} WHERE id='anor'`;
    assert.deepEqual(
      await getCatalog(true),
      initial,
      "unpin restores the original catalog",
    );
    const [audit] =
      await sql`SELECT new_values FROM admin_audit_log WHERE target_id='anor' AND new_values->>'pinnedOrder'=${third}`;
    assert.deepEqual(audit.new_values, { pinned: true, pinnedOrder: third });
    await sql`UPDATE templates SET published=false WHERE id='anor'`;
    await pin("anor", true);
    assert.ok(
      !(await getCatalog()).templates.some((t) => t.id === "anor"),
      "pinning never publishes a hidden design",
    );
    await assert.rejects(
      sql`UPDATE templates SET pinned_order=0 WHERE id='kozgu'`,
    );
  } finally {
    globals.fotihaDatabase = previousDb;
    if (previousUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
    await db.close();
  }
});
