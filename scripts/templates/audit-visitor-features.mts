import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { TEMPLATES } from "../../packages/contracts/src/index.ts";
import { templateVisitorFeatures } from "../../packages/contracts/src/capabilities.ts";

const base = resolve("apps/web/public");
const aliases: Record<string, string> = {
  anor: "templates/anor/source/index.html",
  "royal-burgundy-edition": "templates/velvet-royale/index.html",
  osh: "templates/chorlove/osh/index.html",
  palov: "templates/chorlove/palov/index.html",
  "orchid-amplop": "templates/chorlove/orchid-amplop/index.html",
  "taklifla-zarrin-gullar": "templates/taklifla-zarrin-gullar/template.html",
};
function sources(
  entry: string,
  seen = new Set<string>(),
): { text: string; files: string[] } {
  if (!existsSync(entry) || seen.has(entry)) return { text: "", files: [] };
  seen.add(entry);
  let text = readFileSync(entry, "utf8");
  const refs = [
    ...Array.from(
      text.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g),
      (m) => m[1],
    ),
    ...Array.from(
      text.matchAll(/\bimport\s+(?:[^;\n]*?\s+from\s+)?["']([^"']+)["']/g),
      (m) => m[1],
    ),
  ];
  const files = [relative(resolve("."), entry).replaceAll("\\", "/")];
  for (const ref of refs) {
    if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    const file = ref.startsWith("/")
      ? resolve(base, "." + ref.split("?")[0])
      : resolve(dirname(entry), ref.split("?")[0]);
    const child = sources(file, seen);
    text += "\n" + child.text;
    files.push(...child.files);
  }
  return { text, files };
}

const rows = TEMPLATES.map((t) => {
  const f = templateVisitorFeatures(t.id);
  if (t.format === "image")
    return {
      id: t.id,
      name: t.name,
      features: f,
      evidence: "Static image; no visitor submission page",
      files: [],
      issues: [] as string[],
    };
  const entry = [
    aliases[t.id],
    `templates/${t.id}/index.html`,
    `templates/onlinetaklifnoma-${t.id}/index.html`,
  ]
    .filter(Boolean)
    .find((file) => existsSync(resolve(base, file)));
  const graph = entry ? sources(resolve(base, entry)) : { text: "", files: [] };
  const issues: string[] = [];
  if (!entry)
    issues.push("Queued design: entry document absent; visitor forms disabled");
  if (
    f.rsvp === "form" &&
    !/[\/'"`]rsvp[\/'"`]|["']rsvp["']\s*[,)]/.test(graph.text)
  )
    issues.push("RSVP handler requires manual review");
  if (
    f.wishes &&
    !/[\/'"`]wishes[\/'"`]|["']wishes["']\s*[,)]/.test(graph.text)
  )
    issues.push("Wish handler requires manual review");
  const evidence = f.receipts
    ? "Page handlers + shared private-receipt adapter"
    : entry
      ? "Packaged page/script dependency graph"
      : "No packaged entry";
  return {
    id: t.id,
    name: t.name,
    features: f,
    evidence,
    files: graph.files,
    issues,
  };
});
const output = resolve("docs/qa/2026-11-08-visitor-activity");
mkdirSync(output, { recursive: true });
writeFileSync(
  resolve(output, "template-inventory.json"),
  JSON.stringify(rows, null, 2) + "\n",
);
writeFileSync(
  resolve(output, "template-inventory.md"),
  [
    "# Visitor features across the complete template catalog",
    "",
    `All ${rows.length} distinct typed catalog templates, including unpublished designs. This is a source/adapter audit, not a claim that every design passed a fresh browser lifecycle test.`,
    "",
    "Phone/deadline means contact instructions, not an attendance form. Receipts are private uploads; gift intentions are pledges, not payments. Four queued source packages are absent and have forms disabled. Database-only retired/queued IDs also receive explicit metadata in migration 0226.",
    "",
    "| Template ID | RSVP | Wishes | Receipt uploads | Gift intentions | Notes |",
    "|---|---|---|---|---|---|",
    ...rows.map(
      (r) =>
        `| ${r.id} | ${r.features.rsvp} | ${r.features.wishes ? "Yes" : "No"} | ${r.features.receipts ? "Yes" : "No"} | ${r.features.giftIntentions ? "Yes" : "No"} | ${r.issues.join("; ")} |`,
    ),
    "",
  ].join("\n"),
);
console.log(
  JSON.stringify(
    {
      templates: rows.length,
      withRsvp: rows.filter((r) => r.features.rsvp === "form").length,
      wishes: rows.filter((r) => r.features.wishes).length,
      receipts: rows.filter((r) => r.features.receipts).length,
      giftIntentions: rows.filter((r) => r.features.giftIntentions).length,
      review: rows
        .filter((r) => r.issues.length)
        .map((r) => ({ id: r.id, issues: r.issues })),
    },
    null,
    2,
  ),
);
