import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import {
  serviceDirectory,
  type ServiceListing,
} from "../apps/web/src/modules/services/services-utils";
import {
  serviceListings,
  serviceCategories,
} from "../apps/web/src/modules/services/services-data";
import { serviceEditorSchema } from "../apps/web/src/modules/services/service-editor-contract";

test("partnership migration recovers activation history and owns reactivation timestamps", async () => {
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
    const {
      rows: [actor],
    } = await db.query<{ id: string }>(
      "INSERT INTO users(telegram_user_id,display_name) VALUES(1,'QA') RETURNING id",
    );
    const seed = serviceListings[0];
    // Import order puts the cake category last. Activation order must override it.
    for (const [slug, category, since] of [
      ["restaurant-partner", "restaurant", "2020-11-17T12:00:00.000Z"],
      ["photo-partner", "photo-video", "2020-11-17T11:00:00.000Z"],
      ["cake-partner", "cakes", "2020-11-17T10:00:00.000Z"],
    ]) {
      const listing = {
        ...seed,
        slug,
        categoryIds: [category],
        featured: true,
        featuredOrder: 0,
      };
      await db.query(
        "INSERT INTO service_listings(slug,draft,published,status,created_at) VALUES($1,$2,$2,'published','2020-11-01')",
        [slug, JSON.stringify(listing)],
      );
      await db.query(
        "INSERT INTO admin_audit_log(actor_id,action,target_id,previous_values,new_values,created_at) VALUES($1,'service.update',$2,'{\"featured\":false}','{\"featured\":true}',$3)",
        [actor.id, slug, since],
      );
      // A later ordinary edit must not count as activation.
      await db.query(
        "INSERT INTO admin_audit_log(actor_id,action,target_id,previous_values,new_values,created_at) VALUES($1,'service.update',$2,'{\"featured\":true}','{\"featured\":true}','2020-11-18')",
        [actor.id, slug],
      );
    }
    await db.exec(
      await readFile(
        new URL(
          "../packages/database/migrations/0238_service_partnership_recency.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    async function listings() {
      return (
        await db.query<{ published: ServiceListing }>(
          "SELECT published FROM service_listings ORDER BY position",
        )
      ).rows.map((r) => r.published);
    }
    const initial = await listings();
    assert.equal(initial[0].featuredSince, "2020-11-17T12:00:00.000Z");
    assert.deepEqual(
      serviceDirectory({}, initial, serviceCategories).listings.map(
        (s) => s.slug,
      ),
      ["restaurant-partner", "photo-partner", "cake-partner"],
    );
    assert.deepEqual(
      serviceDirectory(
        { q: seed.name },
        initial,
        serviceCategories,
      ).listings.map((s) => s.slug),
      ["restaurant-partner", "photo-partner", "cake-partner"],
    );
    for (const listing of initial)
      assert.ok(serviceEditorSchema.safeParse(listing).success);
    // Posted timestamps are untrusted, including on ordinary edits.
    await db.exec(
      `UPDATE service_listings SET draft=draft || '{"featuredSince":"2099-01-01T00:00:00.000Z"}', published=published || '{"featuredSince":"2099-01-01T00:00:00.000Z"}' WHERE slug='cake-partner'`,
    );
    assert.equal((await listings())[2].featuredSince, initial[2].featuredSince);
    await db.exec(
      `UPDATE service_listings SET draft=draft || '{"featured":false}', published=published || '{"featured":false}' WHERE slug='cake-partner'`,
    );
    assert.equal((await listings())[2].featuredSince, undefined);
    await db.exec(
      `UPDATE service_listings SET draft=draft || '{"featured":true}', published=published || '{"featured":true}' WHERE slug='cake-partner'`,
    );
    assert.ok(
      Date.parse((await listings())[2].featuredSince!) >
        Date.parse(initial[0].featuredSince!),
    );
    assert.equal(
      serviceDirectory({}, await listings(), serviceCategories).listings[0]
        .slug,
      "cake-partner",
    );
    // Manual priorities still take precedence over activation time.
    await db.exec(
      `UPDATE service_listings SET draft=draft || '{"featuredOrder":1}', published=published || '{"featuredOrder":1}' WHERE slug='cake-partner'`,
    );
    assert.equal(
      serviceDirectory({}, await listings(), serviceCategories).listings[0]
        .slug,
      "restaurant-partner",
    );
  } finally {
    await db.close();
  }
});
