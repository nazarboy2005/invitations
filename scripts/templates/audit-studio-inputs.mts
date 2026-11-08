import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { TEMPLATES } from "../../packages/contracts/src/index.ts";
import { templateCapabilities } from "../../packages/contracts/src/capabilities.ts";
import { templateDataSchema } from "../../packages/contracts/src/studio-inputs.ts";
import { getDb, closeDb } from "../../packages/database/src/index.ts";

const output = resolve("docs/qa/2026-11-08-studio-inputs");
mkdirSync(output, { recursive: true });
const aliases: Record<string, string> = {
  anor: "templates/anor/source/index.html", "royal-burgundy-edition": "templates/baxmal-saroy/index.html",
  osh: "templates/osh/index.html", palov: "templates/palov/index.html",
  "orchid-amplop": "templates/ormon-maktubi/index.html", "taklifla-zarrin-gullar": "templates/zarrin-gullar/template.html",
};
const base = resolve("apps/web/public");
function graph(entry: string, files = new Set<string>()) {
  if (!existsSync(entry) || files.has(entry)) return files;
  files.add(entry);
  const text = readFileSync(entry, "utf8");
  const refs = [
    ...Array.from(text.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g), m => m[1]),
    ...Array.from(text.matchAll(/\bimport\s+(?:[^;\n]*?\s+from\s+)?["']([^"']+)["']/g), m => m[1]),
  ];
  for (const ref of refs) {
    if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    graph(ref.startsWith("/") ? resolve(base, "." + ref.split("?")[0]) : resolve(dirname(entry), ref.split("?")[0]), files);
  }
  return files;
}
const dbRows = process.env.DATABASE_URL ? await getDb()`SELECT id,published FROM templates ORDER BY id` : [];
await closeDb();
const ids = [...new Set([...TEMPLATES.map(t => t.id), ...dbRows.map(t => t.id)])].sort();
const rows = ids.map(id => {
  const t = TEMPLATES.find(t => t.id === id), db = dbRows.find(t => t.id === id), c = templateCapabilities(id);
  const entry = [aliases[id], `templates/${id}/index.html`, `templates/onlinetaklifnoma-${id}/index.html`].filter(Boolean).find(p => existsSync(resolve(base, p)));
  const sources = entry ? graph(resolve(base, entry)) : new Set<string>();
  // E-invitation runtime fetches its actual template document dynamically.
  const dynamicDocument = resolve(base, `templates/${id}/template.html`);
  if (existsSync(dynamicDocument)) graph(dynamicDocument, sources);
  const details = templateDataSchema(id)?.safeParse({});
  return {
    id, name: t?.name || id, published: db?.published ?? t?.published ?? false,
    registered: !!t, hasRenderer: !!t && c.hasRenderer,
    capabilities: c,
    inputs: {
      eventType: "Database event compatibility", languages: ["uz-Latn", "uz-Cyrl", "en", "ru"],
      people: c.people, age: c.age, hosts: c.inputs.hosts, eventLabel: c.inputs.eventLabel, greeting: c.inputs.greeting,
      invitationText: c.hasRenderer, startsAt: c.hasRenderer, timezone: c.hasRenderer,
      venueName: c.hasRenderer, address: c.hasRenderer, landmark: c.hasRenderer, map: c.maps,
      program: c.program ? c.programLimit : 0, programHeading: c.program && c.inputs.programHeading,
      programTime: c.program, programTitle: c.program, programDescription: c.program && c.inputs.programDescriptions,
      story: c.story, storyTitle: c.story > 0, storyText: c.story > 0,
      gallery: c.gallery, galleryCaptionAndAlt: c.gallery > 0,
      artists: c.artists, artistNameRoleAndImage: c.artists > 0,
      musicEnableAndSelection: c.music,
      giftEnableNumberAndHolder: c.gift, receiptUpload: c.gift && c.receipts,
      rsvpMode: c.rsvp, rsvpDeadline: c.rsvp !== "none" && c.rsvpDeadline, partySize: "Fixed at one",
      wishes: c.wishes, moderation: "Always required",
      phone: c.phone, telegram: c.telegram, simultaneousContacts: c.phone && c.telegram ? c.contactLimit : c.phone || c.telegram ? 1 : 0,
      dressEnable: c.dressCode, dressStyle: c.dressCode && c.inputs.dressStyle,
      dressText: c.dressCode && c.inputs.dressText, dressNote: c.dressCode && c.inputs.dressNote,
      colorNames: c.dressCode && c.inputs.dressColorNames, colorHex: c.dressCode && c.inputs.dressColorHex,
      colors: c.dressCode && (c.inputs.dressColorNames || c.inputs.dressColorHex) ? c.dressColorLimit : 0,
      templateSpecific: details?.success ? Object.keys(details.data as object) : [],
    },
    sourceFiles: [...sources].map(p => relative(resolve("."), p).replaceAll("\\", "/")),
    note: !t ? "Database-only retired/queued row; unavailable to Studio and saves" : !c.hasRenderer ? "Queued package absent; controls disabled and saves rejected" : t.format === "image" ? "Static composition; no guest webpage or visitor controls" : "Packaged renderer and adapter reviewed",
  };
});
writeFileSync(resolve(output, "input-matrix.json"), JSON.stringify(rows, null, 2) + "\n");
writeFileSync(resolve(output, "input-matrix.md"), [
  "# Studio input support across the complete database and typed catalog", "",
  `${rows.length} designs; ${rows.filter(r => r.published).length} published and ${rows.filter(r => !r.published).length} unpublished at audit time. Full field-level values, template-specific keys and source dependencies are in input-matrix.json.`, "",
  "No publication flags, prices, migrations, or deployments were changed by this audit.", "",
  "| Template ID | State | Photos | People | Program | Story | Dress | Music | Gift / receipts | RSVP | Phone / Telegram | Hidden text slots |",
  "|---|---|---:|---:|---:|---:|---|---|---|---|---|---|",
  ...rows.map(r => { const c = r.capabilities; return `| ${r.id} | ${r.published ? "Published" : "Unpublished"}${r.hasRenderer ? "" : " / unavailable"} | ${c.gallery} | ${c.people} | ${c.program ? c.programLimit : 0} | ${c.story} | ${c.dressCode ? "Yes" : "No"} | ${c.music ? "Yes" : "No"} | ${c.gift ? "Yes" : "No"} / ${c.receipts ? "Yes" : "No"} | ${c.rsvp} | ${c.phone ? "Yes" : "No"} / ${c.telegram ? "Yes" : "No"} | ${(["hosts", "greeting", "eventLabel"] as const).filter(k => !c.inputs[k]).join(", ")} |`; }), "",
].join("\n"));
console.log(JSON.stringify({ templates: rows.length, published: rows.filter(r => r.published).length, unpublished: rows.filter(r => !r.published).length, registered: rows.filter(r => r.registered).length, withPhotos: rows.filter(r => r.hasRenderer && r.capabilities.gallery > 0).length, withoutPhotos: rows.filter(r => r.hasRenderer && !r.capabilities.gallery).length, unavailable: rows.filter(r => !r.hasRenderer).length }));
