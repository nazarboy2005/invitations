/**
 * One-time, resumable import of the explicitly selected public services directory.
 * Run: node scripts/import-chorlove-services.mjs
 * Uses only public category/detail/media URLs, with four concurrent requests.
 * The published snapshot contains no source-account IDs, ratings, or trust claims.
 */
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destination = path.join(root, "apps/web/src/modules/services/data");
const publicRoot = path.join(root, "apps/web/public");
const cache = path.join(root, ".tmp/services-import");
const reportRoot = path.join(root, "docs/services");
const target = 20;
const refresh = process.argv.includes("--refresh");
const reuseSelection = process.argv.includes("--reuse-selection");
const categories = [
  { id: "restaurant", name: "To‘yxonalar" },
  { id: "photo-video", name: "Foto va Video" },
  { id: "wedding", name: "To‘y xizmatlari" },
  { id: "invitation", name: "Taklifnomalar" },
  { id: "toastmaster", name: "Boshlovchilar" },
  { id: "singer", name: "Xonandalar" },
  { id: "dj", name: "DJ xizmati" },
  { id: "decor", name: "Dekoratsiya" },
  { id: "florist", name: "Floristika" },
  { id: "dress", name: "Kelin-kuyov liboslari" },
  { id: "rings", name: "Uzuk va taqinchoqlar" },
  { id: "car", name: "Avto kortej" },
  { id: "makeup", name: "Vizajist va stilist" },
  { id: "cakes", name: "To‘y tortlari" },
  { id: "caravan", name: "Karvon va shoudastur" },
];
await Promise.all([destination, cache, reportRoot].map((folder) => mkdir(folder, { recursive: true })));
const importedAt = new Date().toISOString();
const errors = [];
const imageSources = new Map();
let previousReport;
if (reuseSelection) {
  try { previousReport = JSON.parse(await readFile(path.join(reportRoot, "import-report.json"), "utf8")); }
  catch { throw new Error("--reuse-selection requires an existing completed import report"); }
}

async function mapLimit(values, limit, work) {
  const results = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      results[index] = await work(values[index], index);
    }
  }));
  return results;
}

function sourceUrl(value) {
  const url = new URL(value, "https://chorlove.uz");
  if (url.protocol !== "https:" || !(url.hostname === "chorlove.uz" || url.hostname.endsWith(".chorlove.uz")))
    throw new Error("Unexpected source host");
  return url;
}

async function download(value, image = false) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      let url = sourceUrl(value);
      for (let redirect = 0; redirect <= 4; redirect++) {
        const response = await fetch(url, {
          redirect: "manual",
          signal: AbortSignal.timeout(35000),
          headers: { "User-Agent": "FotihaDirectoryImport/1.0", Accept: image ? "image/*" : "text/html" },
        });
        if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
          url = sourceUrl(new URL(response.headers.get("location"), url).href);
          await response.body?.cancel();
          continue;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length > 30 * 1024 * 1024) throw new Error("Source exceeds 30 MB limit");
        return image ? bytes : bytes.toString("utf8");
      }
      throw new Error("Too many redirects");
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
    }
  }
  throw lastError;
}

function decodeHtml(value) {
  return value.replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}

function parseJsonObject(text, start) {
  let depth = 0, string = false, escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (string) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === '"') string = false;
    } else if (c === '"') string = true;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return JSON.parse(text.slice(start, i + 1));
  }
  throw new Error("Incomplete public business data");
}

function extractBusiness(html) {
  let stream = "";
  for (const match of html.matchAll(/<script>self\.__next_f\.push\((.*?)\)<\/script>/gs)) {
    const part = JSON.parse(match[1]);
    if (typeof part[1] === "string") stream += part[1];
  }
  const marker = stream.indexOf('"business":{');
  if (marker < 0) throw new Error("Public business record is missing");
  const raw = parseJsonObject(stream, marker + '"business":'.length);
  const fullDescription = html.match(/Xizmat haqida<\/h2>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1];
  const description = fullDescription ? decodeHtml(fullDescription.replace(/<[^>]*>/g, "")) :
    typeof raw.description === "string" && !raw.description.startsWith("$") ? raw.description : "";
  return { raw, description };
}

function number(value) {
  const parsed = Number(value);
  return value !== null && value !== "" && Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function locationText(value) {
  if (typeof value === "string") return value === "[object Object]" ? "" : value.trim();
  if (value && typeof value === "object") {
    for (const key of ["name", "label", "title", "value"]) {
      if (typeof value[key] === "string") return value[key].trim();
    }
  }
  return "";
}

function cleanLink(value) {
  try {
    const url = new URL(value.replace(/[),.;]+$/, ""));
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (/chorlove\.uz$/i.test(url.hostname)) return null;
    for (const key of [...url.searchParams.keys()]) if (/^(utm_|xmt$|fbclid$|igsh)/i.test(key)) url.searchParams.delete(key);
    return url.toString();
  } catch { return null; }
}

function linkLabel(url) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (host === "t.me" || host === "telegram.me") return "Telegram";
  if (host === "instagram.com") return "Instagram";
  if (host === "facebook.com" || host === "fb.com") return "Facebook";
  if (host === "youtube.com" || host === "youtu.be") return "YouTube";
  if (host === "threads.com" || host === "threads.net") return "Threads";
  return "Veb-sayt";
}

const selections = await mapLimit(categories, 4, async (category) => {
  if (reuseSelection) {
    const previous = previousReport.categories?.find((item) => item.id === category.id);
    if (!Array.isArray(previous?.selectedSlugs)) throw new Error(`No recorded selection for ${category.id}`);
    return { categoryId: category.id, selected: previous.selectedSlugs.slice(0, target), pages: previous.pagesInspected };
  }
  const selected = [];
  let pages = 0;
  try {
    // The partnership launch needs actual wedding/banquet premises. The source
    // starts its restaurant category with caterers, so inspect a bounded set of
    // later category pages and select explicitly named halls/palaces instead.
    const firstPage = category.id === "restaurant" ? 10 : 1;
    const lastPage = category.id === "restaurant" ? 16 : 10;
    for (let page = firstPage; page <= lastPage && selected.length < target; page++) {
      const html = await download(`/services/${category.id}${page > 1 ? `?page=${page}` : ""}`);
      pages++;
      const pageSlugs = [...new Set([...html.matchAll(/href="\/services\/b\/([^"?#/]+)"/g)].map((m) => decodeHtml(m[1])))];
      const added = pageSlugs.filter((slug) => /^[a-z0-9-]+$/.test(slug) && !selected.includes(slug)
        && (category.id !== "restaurant" || /toyxon|wedding-hall|event-hall|tantanalar|saroy|banket/.test(slug)));
      selected.push(...added.slice(0, target - selected.length));
      if (!pageSlugs.length || (!added.length && category.id !== "restaurant")) break;
    }
  } catch (error) { errors.push({ stage: "category", category: category.id, error: String(error.message) }); }
  console.log(`Category ${category.id}: ${selected.length}/${target} (${pages} pages)`);
  return { categoryId: category.id, selected, pages };
});

const bySlug = new Map();
for (const selection of selections) for (const slug of selection.selected) {
  if (!bySlug.has(slug)) bySlug.set(slug, []);
  bySlug.get(slug).push(selection.categoryId);
}

let detailCount = 0;
const records = (await mapLimit([...bySlug], 4, async ([slug, categoryIds]) => {
  const cachedPath = path.join(cache, `${slug}.json`);
  try {
    let listing;
    if (!refresh) {
      try {
        listing = JSON.parse(await readFile(cachedPath, "utf8"));
        // Old public source records occasionally render a structured district as
        // '[object Object]'. Keep the valid snapshot and omit that unusable label.
        for (const key of ["region", "district", "address"]) listing[key] = locationText(listing[key]);
      } catch { /* Fetch missing public records. */ }
    }
    if (!listing) {
      let extracted;
      for (let attempt = 0; attempt < 4; attempt++) {
        const html = await download(`/services/b/${slug}`);
        try { extracted = extractBusiness(html); break; }
        catch (error) {
          // Some origin responses contain only the streamed loading shell.
          // A successful HTTP status alone does not mean the profile arrived.
          if (attempt === 3) throw error;
          await new Promise((resolve) => setTimeout(resolve, 1200 * (attempt + 1)));
        }
      }
      const { raw, description: sourceDescription } = extracted;
      const matches = [...sourceDescription.matchAll(/https?:\/\/[^\s<>]+/g)].map((m) => cleanLink(m[0])).filter(Boolean);
      for (const value of Object.values(raw.socials || {})) if (typeof value === "string") matches.push(cleanLink(value));
      for (const value of [raw.website, raw.url]) if (typeof value === "string") matches.push(cleanLink(value));
      const links = [...new Set(matches.filter(Boolean))].map((url) => ({ label: linkLabel(url), url }));
      const emails = sourceDescription.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const currency = /^(SOM|UZS|SO['‘’ʻ]?M)$/i.test(raw.currency || "") ? "UZS" :
        /^(USD|EUR)$/i.test(raw.currency || "") ? raw.currency.toUpperCase() : "";
      const min = number(raw.price_from), max = number(raw.price_to);
      let kind = currency && min ? (max && max !== min ? "range" : raw.price_type === "from" ? "from" : "fixed") : "negotiable";
      if (raw.price_type === "negotiable") kind = "negotiable";
      let description = sourceDescription.split(/Qo['‘’ʻ]shimcha ma['‘’ʻ]lumotlar va ko['‘’ʻ]rsatkichlar:/i)[0].trim();
      description = description.split(/\n/).filter((line) => !/chorlove/i.test(line)).join("\n").trim();
      const sourceImages = (raw.images || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((image) => image.url).filter((url) => typeof url === "string");
      listing = {
        slug, name: String(raw.name || ""), categoryIds, categoryLabel: String(raw.category_name || ""),
        description, region: locationText(raw.address?.region), district: locationText(raw.address?.district),
        address: locationText(raw.address?.address),
        phones: (raw.phones || []).filter((phone) => typeof phone.number === "string")
          .map((phone) => ({ label: String(phone.label || "Telefon"), value: phone.number })),
        links, email: raw.email || emails[0] || null,
        latitude: typeof raw.latitude === "number" && Math.abs(raw.latitude) <= 90 ? raw.latitude : null,
        longitude: typeof raw.longitude === "number" && Math.abs(raw.longitude) <= 180 ? raw.longitude : null,
        price: { kind, min: kind === "negotiable" ? null : min, max: kind === "negotiable" ? null : max, currency: currency || "UZS",
          sourceText: kind === "negotiable" ? "Kelishuv asosida" : `${min}${max && max !== min ? `–${max}` : ""} ${raw.currency || ""}${raw.price_type === "from" ? " dan" : ""}` },
        images: [], importedAt, featured: false,
        _sourceImages: sourceImages,
      };
      await writeFile(cachedPath, JSON.stringify(listing, null, 2), "utf8");
    }
    listing.categoryIds = categoryIds;
    detailCount++;
    if (detailCount % 20 === 0) console.log(`Details ${detailCount}/${bySlug.size}`);
    return listing;
  } catch (error) {
    errors.push({ stage: "detail", slug, error: String(error.message) });
    console.error(`Detail failed ${slug}: ${error.message}`);
    return null;
  }
})).filter(Boolean);

// Make genuine extracted records available to local implementation/QA while
// downloads continue; the completed snapshot below supplies all local galleries.
await writeFile(path.join(destination, "categories.json"), JSON.stringify(categories, null, 2) + "\n", "utf8");
await writeFile(path.join(destination, "listings.json"), JSON.stringify(records.map(({ _sourceImages, ...listing }) => listing), null, 2) + "\n", "utf8");
console.log(`Extracted ${records.length}/${bySlug.size} profiles; downloading galleries`);

const jobs = records.flatMap((listing) => (listing._sourceImages || []).map((url, index) => ({ listing, url, index })));
let mediaCount = 0;
await mapLimit(jobs, 4, async ({ listing, url, index }) => {
  try {
    // Source identity indexes the ignored checkpoint; final public URLs contain
    // the optimized file's content hash and change whenever its bytes change.
    const key = createHash("sha256").update(url).digest("hex").slice(0, 16);
    const mediaCheckpoint = path.join(cache, `media-${key}.json`);
    let image;
    if (!refresh) {
      try {
        const saved = JSON.parse(await readFile(mediaCheckpoint, "utf8"));
        if (saved.src.startsWith(`/images/services/${listing.slug}/`)) {
          await stat(path.join(publicRoot, saved.src));
          image = saved;
        }
      } catch { /* Download a missing or invalid checkpoint. */ }
    }
    if (!image) {
      const legacy = path.join(publicRoot, `/images/services/${listing.slug}/${key}.webp`);
      let data, info;
      if (!refresh) {
        try { data = await readFile(legacy); info = await sharp(data).metadata(); } catch { /* New source image. */ }
      }
      if (!data) {
        const bytes = await download(url, true);
        const result = await sharp(bytes, { limitInputPixels: 50_000_000 }).rotate()
        .resize({ width: 1440, height: 1440, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 78, effort: 4 }).toBuffer({ resolveWithObject: true });
        data = result.data;
        info = result.info;
      }
      const hash = createHash("sha256").update(data).digest("hex").slice(0, 16);
      const src = `/images/services/${listing.slug}/${hash}.webp`;
      const output = path.join(publicRoot, src);
      await mkdir(path.dirname(output), { recursive: true });
      await writeFile(output, data);
      image = { src, width: info.width, height: info.height };
      await writeFile(mediaCheckpoint, JSON.stringify(image), "utf8");
      // This is an exact legacy file generated by the same importer, never a
      // directory operation; keep only the content-addressed public asset.
      if (legacy !== output) await unlink(legacy).catch(() => {});
    }
    listing.images[index] = { ...image, alt: `${listing.name} — ${index + 1}` };
    imageSources.set(image.src, sourceUrl(url).href);
  } catch (error) { errors.push({ stage: "image", slug: listing.slug, index, error: String(error.message) }); }
  mediaCount++;
  if (mediaCount % 100 === 0) console.log(`Images ${mediaCount}/${jobs.length}`);
});

for (const listing of records) {
  listing.images = listing.images.filter(Boolean);
  delete listing._sourceImages;
}
const report = {
  importedAt, source: "https://chorlove.uz/services", requestedPerCategory: target,
  categories: selections.map(({ categoryId, selected, pages }) => ({
    id: categoryId, sourceUrl: `https://chorlove.uz/services/${categoryId}`, pagesInspected: pages,
    imported: records.filter((listing) => listing.categoryIds.includes(categoryId)).length,
    requested: target, selectedSlugs: selected,
  })),
  uniqueBusinesses: records.length, downloadedImages: records.reduce((sum, listing) => sum + listing.images.length, 0),
  listings: records.map(({ slug, importedAt, images }) => ({ slug, sourceUrl: `https://chorlove.uz/services/b/${slug}`, importedAt,
    images: images.map(({ src }) => ({ local: src, sourceUrl: imageSources.get(src) })) })),
  notes: [
    "A local snapshot of public business information; no runtime requests to the source are required.",
    "Source ratings, reviews, verification, featured status, view counts, and account identifiers are excluded.",
    "All imported businesses begin without a Fotiha partnership/featured claim.",
    "Imported source prices are not independently confirmed, and have no inferred per-guest, per-hour, or per-event units.",
    "Restaurant selection deliberately prioritizes explicitly named wedding/banquet halls from bounded category pages 10–16, supporting the user's hall-partnership goal; the source's initial caterer-heavy pages were not used for the final snapshot.",
    "No external deployment, business outreach, paid subscription, or payment action was performed.",
  ], errors,
};
await writeFile(path.join(destination, "categories.json"), JSON.stringify(categories, null, 2) + "\n", "utf8");
await writeFile(path.join(destination, "listings.json"), JSON.stringify(records, null, 2) + "\n", "utf8");
await writeFile(path.join(reportRoot, "import-report.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ uniqueBusinesses: report.uniqueBusinesses, downloadedImages: report.downloadedImages,
  categories: report.categories.map(({ id, imported }) => ({ id, imported })), errors: errors.length }, null, 2));
