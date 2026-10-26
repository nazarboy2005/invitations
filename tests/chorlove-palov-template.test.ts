import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createInvitation, invitationSchema, TEMPLATES } from "../packages/contracts/src/index";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const template = path.join(root, "apps/web/public/templates/chorlove/palov");
const read = (relative: string) => readFileSync(path.join(template, relative), "utf8");

test("Chorlove Palov package keeps its source design isolated and self contained", () => {
  const html = read("index.html");
  assert.match(html, /fonts\.css/);
  assert.match(html, /palov\.css/);
  assert.match(html, /bridge\.js/);
  assert.match(html, /palov-reduced-motion/);
  assert.doesNotMatch(html, /fonts\.googleapis|google-analytics|gtag\(/i);

  for (const relative of [
    "index.html",
    "source-fragment.html",
    "captured-styles.css",
    "palov.css",
    "fonts.css",
    "bridge.js",
    "assets/palov.png",
    "catalog-opening.png",
  ]) assert.ok(existsSync(path.join(template, relative)), `${relative} exists`);

  const fontCss = read("fonts.css");
  assert.doesNotMatch(fontCss, /https?:\/\//i);
  for (const match of fontCss.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    const url = match[1];
    assert.ok(!url.startsWith("data:"), `font is packaged locally: ${url}`);
    const fileName = path.basename(url);
    assert.ok(existsSync(path.join(template, "fonts", fileName)), `${fileName} exists`);
  }

  const provenance = JSON.parse(read("provenance.json"));
  assert.equal(provenance.templateId, "palov");
  assert.equal(provenance.catalogOpening.file, "catalog-opening.png");
  assert.equal(provenance.catalogOpening.dimensions, "480x1040");
  assert.equal(provenance.catalogOpening.eventType, "osh");
  assert.equal(provenance.catalogArtworkSource.packaged, false);
});

test("Chorlove Palov adapter maps approved locales, RSVP, and reduced motion", () => {
  const bridge = read("bridge.js");
  const source = read("source-fragment.html");
  for (const locale of ["uz-Latn", "uz-Cyrl", "en", "ru"]) assert.ok(bridge.includes(locale));
  for (const field of ["greeting", "dateTime", "venue", "gallery", "music", "contacts", "rsvp"]) {
    assert.ok(bridge.includes(field), `${field} is mapped`);
  }
  assert.match(bridge, /prefers-reduced-motion/);
  assert.match(bridge, /threshold:\s*0\.2/);
  assert.match(bridge, /new IntersectionObserver/);
  assert.match(bridge, /root:\s*scroller/);
  assert.match(bridge, /visibleRatio\s*>=\s*0\.2/);
  assert.match(bridge, /\/api\/public\/invitations/);
  assert.doesNotMatch(bridge, /palov-stepper|partySize:\s*"/);
  assert.match(bridge, /partySize:\s*answer === "yes" \? 1 : 0/);
  assert.doesNotMatch(bridge, /payment\.chorlove\.uz|Chorlove\.API|stats\.tolipov/i);
  assert.match(bridge, /contacts\.find\(\(contact\) => contact\.type === "instagram"\)/);
  assert.match(bridge, /setContact\(socialLinks\[1\], instagram, "Instagram"\)/);
  assert.match(source, /class="palov-soc"[^>]*aria-label="Instagram"/);
  assert.doesNotMatch(source, /data-section="toyona"/);
  const sharedExtras = readFileSync(
    path.join(root, "apps/web/public/templates/shared/editor-sections.js"),
    "utf8",
  );
  assert.match(sharedExtras, /key === "receipt" && document\.querySelector\('\[data-section="toyona"\]'\)/);
  assert.match(sharedExtras, /footer\.before\(element\)/);
  const chorloveRenderer = readFileSync(
    path.join(root, "apps/web/src/templates/chorlove/renderer.tsx"),
    "utf8",
  );
  assert.match(
    chorloveRenderer,
    /templateId === "palov"\s*\?\s*\{\s*story: false,\s*dressCode: false,\s*extraPeople: false,/s,
  );
  assert.match(
    chorloveRenderer,
    /invitation,\s*data,\s*frameLocale,\s*invitationId,\s*guestToken,\s*preview,\s*templateId !== "osh" && templateId !== "palov"/s,
  );
  const renderer = readFileSync(path.join(root, "apps/web/src/templates/anor/renderer.tsx"), "utf8");
  assert.match(renderer, /invitation\.contacts\.instagramUrl/);
  const legacyInvitation = invitationSchema.parse({
    ...createInvitation("palov"),
    contacts: { phoneNumber: "", telegramUsername: "", instagramUrl: "" },
    instagramUrl: "",
  });
  assert.equal(legacyInvitation.contacts.instagramUrl, "");
  const css = read("palov.css");
  assert.match(css, /palov-music-control button:hover\s*\{\s*transform:\s*scale\(1\.1\)/);
  assert.match(css, /palov-music-control button:active\s*\{\s*transform:\s*scale\(\.9\)/);
  assert.match(css, /palov-reduced-motion \.palov-reveal\.is-visible/);
});

test("Chorlove route keeps Palov in its provider namespace", () => {
  const renderer = readFileSync(path.join(root, "apps/web/src/templates/chorlove/renderer.tsx"), "utf8");
  const registry = readFileSync(path.join(root, "apps/web/src/templates/chorlove/registry.ts"), "utf8");
  assert.match(registry, /"palov"/);
  assert.match(renderer, /templateId === "palov"/);
  const namespacedTemplates = renderer.match(/const namespaced =([\s\S]*?);/)?.[1] ?? "";
  assert.match(namespacedTemplates, /templateId === "palov"/);
  assert.match(namespacedTemplates, /templateId === "orchid-amplop"/);
  assert.match(renderer, /`\/templates\/chorlove\/\$\{templateId\}\/index\.html\?\$\{query\}`/);
  assert.doesNotMatch(renderer, /\/templates\/invitate-palov/);
});

test("Chorlove Palov is published for nahorgi osh", () => {
  const entry = TEMPLATES.find((item) => item.id === "palov");
  assert.ok(entry);
  assert.equal(entry.name, "Chorlove Palov");
  assert.deepEqual(entry.categoryIds, ["osh"]);
  assert.deepEqual(entry.supportedEventTypes, ["osh"]);
  assert.equal(entry.published, true);
  assert.equal(entry.previewImage, "/templates/chorlove/palov/catalog-opening.png");
  assert.equal(createTemplatePreviewSample("palov").content["uz-Latn"].title, "Nahorgi osh");

  const migration = readFileSync(
    path.join(root, "packages/database/migrations/0135_register_chorlove_palov.sql"),
    "utf8",
  );
  assert.match(migration, /VALUES \('palov', 'osh'\)/);
  assert.match(migration, /VALUES \('palov', 'Chorlove Palov', 15000000, 'UZS', false\)/);

  const publication = readFileSync(
    path.join(root, "packages/database/migrations/0139_publish_chorlove_palov.sql"),
    "utf8",
  );
  assert.match(publication, /SET published\s*=\s*true/);
  assert.match(publication, /WHERE id\s*=\s*'palov'/);
});
