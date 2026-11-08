import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { createInvitation, templateById } from "../packages/contracts/src/index";

const ids = ["zaytun", "islomiy", "oq-qora-lavha", "xatna"];
for (const id of ids) {
  const base = `apps/web/public/templates/${id}`;
  test(`${id}: active page uses complete scoped source and local assets`, () => {
    const html = readFileSync(`${base}/template.html`, "utf8");
    const index = readFileSync(`${base}/index.html`, "utf8");
    assert.match(index, /source\/current\/template\.css/);
    assert.match(index, /source\/current\/inline\.css/);
    assert.ok(!index.includes(`/templates/${id}/renderer.css`));
    assert.ok(!index.includes(`/templates/${id}/adapter.css`));
    assert.doesNotMatch(index, /_nuxt|https?:\/\//);
    assert.match(html, /data-v-/);
    assert.doesNotMatch(html, /Akmal|Madina|Yusufbek|2030|assets\.e-invitation|<script|<audio|href="(?:https?:|tel:)/);
    assert.doesNotMatch(html, /section-credit-footer|data-invitation-credit/);
    const css = readFileSync(`${base}/source/current/fonts.css`, "utf8");
    for (const [, url] of css.matchAll(/url\(([^)]+)\)/g)) {
      const target = url.replace(/^["']|["']$/g, "");
      assert.ok(target.startsWith(`/templates/${id}/`));
      assert.ok(existsSync(`apps/web/public${target}`), target);
    }
    for (const [, url] of html.matchAll(/(?:src|poster)="([^"]+)"/g)) {
      if (!url.startsWith("/templates/")) continue;
      assert.ok(existsSync(`apps/web/public${url}`), url);
    }
    const provenance = JSON.parse(readFileSync(`${base}/source/current/provenance.json`, "utf8"));
    for (const item of provenance.files) {
      if (!item.sha256) continue;
      assert.equal(createHash("sha256").update(readFileSync(`${base}/source/current/${item.file}`)).digest("hex"), item.sha256, item.file);
    }
  });
  test(`${id}: catalog identity, event type, publication and single-person attendance agree`, () => {
    const t = templateById(id)!;
    assert.ok(t);
    assert.equal(t.published, true);
    assert.equal(t.previewImage, `/templates/${id}/catalog.webp`);
    assert.deepEqual(t.supportedEventTypes, [id === "xatna" ? "sunnat-toyi" : "wedding"]);
    assert.equal(createInvitation(id).rsvp.maxPartySize, 1);
  });
}
test("the repair's adapter uses platform APIs without provider runtime or sample fallbacks", () => {
  const js = readFileSync("apps/web/public/templates/e-invitation-shared/runtime.js", "utf8");
  assert.match(js, /\/rsvp/); assert.match(js, /\/wishes/); assert.match(js, /partySize: status === 'yes' \? 1 : 0/);
  assert.doesNotMatch(js, /assets\.e-invitation|_nuxt|webhook|cloudflareinsights|Akmal|Madina|Yusufbek/);
  const migration = readFileSync("packages/database/migrations/0224_publish_complete_e_invitation_four.sql", "utf8");
  assert.doesNotMatch(migration, /DELETE|price_minor\s*=/i);
});
