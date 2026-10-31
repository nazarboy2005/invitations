import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import {
  favoritesFirst,
  parseFavorites,
} from "../apps/web/src/modules/favorites/favorites-data";

test("browser storage rejects malformed entries and deduplicates saves", () => {
  const favorite = { templateId: "anor", savedAt: "2026-10-30T12:00:00.000Z" };
  assert.deepEqual(
    parseFavorites(
      JSON.stringify([
        favorite,
        favorite,
        null,
        {},
        { ...favorite, templateId: "../secret" },
        { ...favorite, savedAt: "bad" },
      ]),
    ),
    [favorite],
  );
  assert.deepEqual(parseFavorites("corrupted"), []);
  assert.deepEqual(parseFavorites('{"anor": true}'), []);
});

test("Studio puts favorites first without introducing incompatible designs or disturbing catalog order", () => {
  const templates = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  const favorites = ["d", "b", "incompatible"].map((templateId) => ({
    templateId,
    savedAt: new Date().toISOString(),
  }));
  assert.deepEqual(
    favoritesFirst(templates, favorites).map((item) => item.id),
    ["b", "d", "a", "c"],
  );
  assert.deepEqual(
    templates.map((item) => item.id),
    ["a", "b", "c", "d"],
  );
});

test("favorites migration isolates accounts, deduplicates merges, and cascades account deletion", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      "CREATE TABLE users(id uuid PRIMARY KEY); CREATE TABLE templates(id text PRIMARY KEY); INSERT INTO users VALUES ('00000000-0000-4000-8000-000000000001'), ('00000000-0000-4000-8000-000000000002'); INSERT INTO templates VALUES ('anor');",
    );
    await db.exec(
      await readFile(
        new URL(
          "../packages/database/migrations/0204_template_favorites.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.exec(
      "INSERT INTO template_favorites(user_id,template_id) SELECT id,'anor' FROM users ON CONFLICT DO NOTHING; INSERT INTO template_favorites(user_id,template_id) SELECT id,'anor' FROM users ON CONFLICT DO NOTHING;",
    );
    assert.equal(
      (await db.query("SELECT * FROM template_favorites")).rows.length,
      2,
    );
    await db.exec(
      "DELETE FROM template_favorites WHERE user_id='00000000-0000-4000-8000-000000000001';",
    );
    assert.equal(
      (await db.query("SELECT * FROM template_favorites")).rows.length,
      1,
    );
    await db.exec("DELETE FROM users;");
    assert.equal(
      (await db.query("SELECT * FROM template_favorites")).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
