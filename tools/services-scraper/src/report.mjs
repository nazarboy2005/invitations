import { writeFile } from "node:fs/promises";
import path from "node:path";

const esc = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const json = (value) => esc(JSON.stringify(value, null, 2));
const style =
  "body{font:16px/1.6 system-ui,sans-serif;max-width:1150px;margin:40px auto;padding:0 24px;color:#232b37;background:#f7f8fa}h1,h2{line-height:1.2}section,article{background:white;border:1px solid #dce1e8;border-radius:12px;padding:24px;margin:20px 0}table{border-collapse:collapse;width:100%;font-size:14px}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd;vertical-align:top;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}figure{margin:0}img{width:100%;height:190px;object-fit:contain;background:#eee}figcaption,small{font-size:13px;color:#596475}.warning{border-left:4px solid #ba7420;padding-left:16px}.badge{font-size:13px;border-radius:6px;padding:4px 8px;background:#e9eef7}a{color:#1751a6}";
const shell = (title, body) =>
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>${esc(title)}</title><style>${style}</style><body>${body}</body></html>`;

export async function writeBusinessReport(directory, result) {
  const m = result.merged;
  const body = `<h1>${esc(m?.name || result.input.name || "Business import")}</h1><p><span class="badge">${esc(result.status)}</span> · ${esc(result.completedAt)}</p>
  <p class="warning">Research draft. Nothing has been published. Missing information and conflicts require review. Observed product prices do not establish a complete business price range.</p>
  <section><h2>Business information</h2><table>${["name", "address", "description", "hours"].map((key) => `<tr><th>${esc(key)}</th><td>${esc(m?.[key] || "Not found")}</td></tr>`).join("")}<tr><th>Phones</th><td>${esc(m?.phones.join(", ") || "Not found")}</td></tr><tr><th>Email</th><td>${esc(m?.emails.join(", ") || "Not found")}</td></tr><tr><th>Links</th><td>${(m?.links ?? []).map((x) => `<div><a href="${esc(x.url)}" rel="noreferrer">${esc(x.type)}: ${esc(x.url)}</a></div>`).join("") || "Not found"}</td></tr></table></section>
  <section><h2>Sources and matching</h2>${result.sources.map((r) => `<p><strong>${esc(r.provider)}</strong>: <a href="${esc(r.url)}" rel="noreferrer">${esc(r.name)}</a> · ${r.images.length} photo candidates · ${r.products.length} products</p>${r.warnings.map((w) => `<p class="warning">${esc(w)}</p>`).join("")}`).join("")}<pre>${json(result.matches)}</pre>${result.errors.map((x) => `<p class="warning">${esc(x.stage)}: ${esc(x.error)}</p>`).join("")}<details><summary>Other candidates (not merged)</summary><pre>${json(result.candidates)}</pre></details></section>
  <section><h2>Downloaded gallery</h2>${result.media?.selection?.policy === "single" ? `<p>Photos from one provider only: <strong>${esc(result.media.selection.source ?? "No usable photos")}</strong>. Other business fields may combine both providers.</p>` : ""}<div class="gallery">${(result.media?.images ?? []).map((x) => `<figure><a href="${esc(x.file)}"><img loading="lazy" src="${esc(x.file)}" alt="${esc(x.alt)}"></a><figcaption>${esc(x.source)} · ${x.width} × ${x.height}${x.possibleDuplicateOf ? " · possible duplicate" : ""}</figcaption></figure>`).join("")}</div><p>${result.media?.duplicates.length ?? 0} exact duplicates removed; ${result.media?.errors.length ?? 0} failed downloads.</p></section>
  <section><h2>Observed products</h2><table><tr><th>Item</th><th>Price</th><th>Unit/category</th><th>Source</th></tr>${(m?.products ?? []).map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.amount)} ${esc(p.currency)}${p.excludedFromPriceRange ? "<br><strong>Possible placeholder: excluded from price ranges</strong>" : ""}</td><td>${esc(p.unit ?? "Unknown")} / ${esc(p.category ?? "Unclassified")}</td><td>${esc(p.source)}</td></tr>`).join("")}</table><details><summary>Ranges by currency, unit, and category — review required</summary><pre>${json(m?.priceRanges ?? [])}</pre></details></section>
  <section><h2>Missing fields and conflicts</h2><p>Missing: ${esc(m?.missing.join(", ") || "None")}</p><pre>${json(m?.conflicts ?? [])}</pre></section>
  <section><details><summary>Field provenance and manual overrides</summary><pre>${json(m?.provenance ?? {})}</pre></details><p>Machine-readable result: <a href="result.json">result.json</a></p></section>`;
  await writeFile(
    path.join(directory, "report.html"),
    shell(m?.name || "Business import", body),
  );
}
export async function writeRunReport(directory, run) {
  const rows = run.jobs
    .map(
      (job) =>
        `<tr><td><a href="${esc(job.directory)}/report.html">${esc(job.name || job.input.query || job.input.url || "Business")}</a></td><td>${esc(job.status)}</td><td>${job.photos ?? 0}</td><td>${job.products ?? 0}</td><td>${esc(job.providers?.join(", "))}</td></tr>`,
    )
    .join("");
  await writeFile(
    path.join(directory, "report.html"),
    shell(
      "Fotiha scraper results",
      `<h1>Fotiha scraper results</h1><p>${esc(run.updatedAt)} · ${run.jobs.length} businesses · ${run.duplicates?.length ?? 0} duplicate jobs suppressed</p><table><tr><th>Business</th><th>Status</th><th>Saved photos</th><th>Products</th><th>Merged sources</th></tr>${rows}</table><p>Nothing in this report has been imported into the Fotiha database or published.</p>`,
    ),
  );
}
