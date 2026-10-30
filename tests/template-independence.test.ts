import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  TEMPLATES, createInvitation, invitationSchema, publicTemplateId,
  publicTemplateName, resolveTemplateId, templateById,
} from "../packages/contracts/src/index";
import { isPrivateTemplateArtifact } from "../apps/web/src/server/template-artifacts";
import preview from "../apps/web/src/modules/catalog/preview-sample.json";

const providers = /taklifla|taklifnomachi|invitate|chorlove|wedivo|marxaba|onlinetaklifnoma/i;
const root = "apps/web/public/templates";

test("public template identities are neutral, unique and preserve saved invitation IDs", () => {
  const slugs = new Map<string, string>();
  for (const template of TEMPLATES) {
    const slug = publicTemplateId(template.id);
    assert.doesNotMatch(slug, providers);
    assert.doesNotMatch(template.name, providers);
    assert.equal(resolveTemplateId(slug), template.id);
    assert.equal(templateById(slug)?.id, template.id);
    assert.ok(!slugs.has(slug) || slugs.get(slug) === template.id, slug);
    slugs.set(slug, template.id);
    const original = createInvitation(template.id);
    assert.equal(invitationSchema.parse(original).templateId, template.id);
  }
  assert.equal(publicTemplateName("Taklifnomachi · Klassik"), "Klassik");
  assert.equal(publicTemplateName("Invitate Wedding"), "Wedding");
  assert.equal(publicTemplateName("Golden Hour"), "Golden Hour");
});

test("archived pages and trackers are private while real source frames and artwork stay accessible", () => {
  for (const path of [
    "/templates/velora/source/velora.html",
    "/templates/safir/source/safir.html",
    "/templates/green-white/source/preview-frame.html",
    "/templates/manor-edition/source/reference/manor-edition.html",
    "/templates/taklifnomachi-1/source/index.html",
    "/templates/taklifnomachi-15/source/taklifnomachi.uz/demo/15/index.html",
    "/templates/invitate-wedding/assets/captured/5b73decb38ff5c8c.js",
    "/templates/taklifnomachi-1/source/templates/1/js/Q362wQYV0bJ4.js",
  ]) assert.equal(isPrivateTemplateArtifact(path), true, path);
  for (const path of [
    "/templates/anor/source/index.html",
    "/templates/anor/source/bridge.js",
    "/templates/manor-edition/source/reference/assets/intro-poster.jpg",
    "/templates/velora/index.html",
    "/templates/shared/yandex-maps.js",
  ]) assert.equal(isPrivateTemplateArtifact(path), false, path);
  assert.equal(isPrivateTemplateArtifact("/templates/velora/source/velora%2ehtml"), true);
});

test("entry pages contain no remote source assets, captured maps or business credits", () => {
  const entries = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(root, entry.name, "index.html"))
    .filter(existsSync);
  entries.push(join(root, "anor/source/index.html"));
  for (const entry of entries) {
    const html = readFileSync(entry, "utf8");
    assert.doesNotMatch(html, /<(?:img|source|video|audio|iframe|script|link)\b[^>]*(?:src|href)=["']https?:\/\//i, entry);
    assert.doesNotMatch(html, /powered by|Made with (?:Visol|Marxaba)|(?:Visol|Marxaba|Marhamat) bilan yaratildi|data-slot="footer"/i, entry);
    assert.doesNotMatch(html, /href="https:\/\/(?:chorlove\.uz|t\.me\/chorlove_uz|instagram\.com\/chorlove\.uz)/i, entry);
  }
  for (const id of ["palace-rose", "jasmine-white"] as const) {
    const url = preview.templateSamples[id].venuePhoto;
    assert.equal(url, "/images/preview/venue.jpg");
    assert.ok(existsSync(join("apps/web/public", url)));
  }
});
