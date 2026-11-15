// Publish the user-approved, locally reviewed batch. No network or database access.
// Re-runs preserve existing profiles; --check verifies the published snapshot only.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const batch = path.join(
  root,
  "tools/services-scraper/output/additional-30/collection",
);
const listingsFile = path.join(
  root,
  "apps/web/src/modules/services/data/listings.json",
);
const reportFile = path.join(
  root,
  "docs/services/maps-additions-publication.json",
);
const publicRoot = path.join(root, "apps/web/public");
const check = process.argv.includes("--check");
const json = async (file) => JSON.parse(await readFile(file, "utf8"));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const inside = (base, relative) => {
  const result = path.resolve(base, relative);
  assert.ok(
    result.startsWith(path.resolve(base) + path.sep),
    "Invalid local path",
  );
  return result;
};
const selection = await json(
  path.join(root, "docs/services/maps-additions-selection.json"),
);
assert.equal(selection.approvedForDirectory, true);
assert.equal(selection.selected.length, 30);
const listings = await json(listingsFile);
const originalCount = listings.length;
const originalHallCount = listings.filter((x) =>
  x.categoryIds.includes("restaurant"),
).length;
const previous = await json(reportFile).catch((error) => {
  if (error.code !== "ENOENT") throw error;
  return null;
});

if (check) {
  assert.equal(previous?.listings.length, 30);
  let images = 0;
  for (const entry of previous.listings) {
    const listing = listings.find((x) => x.slug === entry.slug);
    assert.ok(listing, entry.slug);
    assert.equal(listing.featured, false);
    assert.equal(entry.imageSource, "yandex");
    assert.equal(listing.images.length, entry.images.length);
    for (const image of entry.images) {
      const saved = listing.images.find((x) => x.src === image.src);
      assert.ok(saved);
      const bytes = await readFile(inside(publicRoot, image.src.slice(1)));
      const meta = await sharp(bytes).metadata();
      assert.equal(digest(bytes), image.sha256);
      assert.equal(meta.width, saved.width);
      assert.equal(meta.height, saved.height);
      images++;
    }
  }
  assert.equal(
    listings.filter((x) => x.categoryIds.includes("restaurant")).length,
    50,
  );
  console.log(
    JSON.stringify({
      checkedListings: 30,
      checkedImages: images,
      weddingHalls: 50,
    }),
  );
  process.exit(0);
}

function contacts(record) {
  const chosen = new Map();
  const preferred = record.name === "Dunyo Saroyi" ? "/dunyosaroyi" : null;
  for (const item of [...record.links].sort(
    (a, b) =>
      Number(Boolean(preferred && b.url.includes(preferred))) -
      Number(Boolean(preferred && a.url.includes(preferred))),
  )) {
    const url = new URL(item.url);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      continue;
    const host = url.hostname.replace(/^www\./, "");
    let type = item.type;
    if (host === "instagram.com") {
      if (
        !/^\/[\w.]+\/?$/.test(url.pathname) ||
        ["/explore", "/p", "/reel"].includes(url.pathname.replace(/\/$/, ""))
      )
        continue;
      type = "instagram";
    } else if (host === "facebook.com" || host.endsWith(".facebook.com"))
      type = "facebook";
    else if (host === "t.me" || host === "telegram.me") {
      type = "telegram";
      const target = decodeURIComponent(url.pathname.slice(1));
      if (
        /^\+?\d+$/.test(target) &&
        !record.phones.includes(`+${target.replace(/^\+/, "")}`)
      )
        continue;
    } else if (host === "wa.me") {
      type = "whatsapp";
      const target = url.pathname.replace(/\D/g, "");
      if (!record.phones.includes(`+${target}`)) continue;
      url.pathname = `/${target}`;
      url.search = "";
    } else if (host.includes("yandex.") || host.includes("google.")) continue;
    if (chosen.has(type)) continue;
    for (const key of [...url.searchParams.keys()])
      if (/^(utm_|igsh|mibextid|hl|text)/i.test(key))
        url.searchParams.delete(key);
    url.hash = "";
    const label =
      {
        website: "Veb-sayt",
        instagram: "Instagram",
        telegram: "Telegram",
        facebook: "Facebook",
        youtube: "YouTube",
        whatsapp: "WhatsApp",
      }[type] ?? "Veb-sayt";
    chosen.set(type, { label, url: url.href });
  }
  return [...chosen.values()];
}

const districts = [
  [/Шайхантахурский/i, "Shayxontohur tumani"],
  [/Алмазарский/i, "Olmazor tumani"],
  [/Чиланзарский/i, "Chilonzor tumani"],
  [/Учтепинский/i, "Uchtepa tumani"],
  [/Мирзо-Улугбекский/i, "Mirzo Ulug‘bek tumani"],
  [/Яшнабадский/i, "Yashnobod tumani"],
  [/Юнусабадский/i, "Yunusobod tumani"],
  [/Ташкентский район/i, "Toshkent tumani"],
];
const published = [];
for (const selected of selection.selected) {
  assert.match(selected.slug, /^[a-z0-9-]+$/);
  const existing = listings.find((x) => x.slug === selected.slug);
  if (existing) {
    const recorded = previous?.listings.find(
      (x) => x.slug === selected.slug && x.yandexId === selected.sourceId,
    );
    assert.ok(
      recorded,
      `Slug already used outside this batch: ${selected.slug}`,
    );
    published.push(recorded);
    continue;
  }
  const directory = inside(batch, selected.directory);
  const result = await json(path.join(directory, "result.json"));
  assert.ok(["complete", "needs_review"].includes(result.status));
  const source = result.sources.find(
    (x) => x.provider === "yandex" && x.id === selected.sourceId,
  );
  assert.ok(source && source.name && source.address && source.phones.length);
  assert.ok(source.categories.some((x) => /банкетный зал/i.test(x)));
  assert.equal(result.media.selection.policy, "single");
  assert.equal(result.media.selection.source, "yandex");
  assert.ok(result.media.galleryReview);
  assert.ok(result.media.images.length >= 3);
  assert.ok(
    !listings.some((x) =>
      x.phones.some((p) => source.phones.includes(p.value)),
    ),
    `Existing phone duplicate: ${source.name}`,
  );
  const images = [],
    provenance = [];
  for (const image of result.media.images) {
    assert.equal(image.source, "yandex");
    const bytes = await readFile(inside(directory, image.file));
    assert.equal(digest(bytes), image.sha256);
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, image.width);
    assert.equal(meta.height, image.height);
    const src = `/images/services/${selected.slug}/${image.sha256.slice(0, 24)}.webp`;
    const destination = inside(publicRoot, src.slice(1));
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(inside(directory, image.file), destination);
    images.push({
      src,
      width: image.width,
      height: image.height,
      alt: `${source.name} — ${images.length + 1}`,
    });
    provenance.push({ src, sourceUrl: image.url, sha256: image.sha256 });
  }
  const price = {
    kind: "negotiable",
    min: null,
    max: null,
    currency: "UZS",
    sourceText: "",
  };
  let description = "";
  if (source.id === "91538804082") {
    const packages = result.merged.products.filter(
      (x) =>
        x.currency === "UZS" &&
        x.unit === "person" &&
        !x.excludedFromPriceRange,
    );
    assert.deepEqual(
      packages.map((x) => x.amount).sort((a, b) => a - b),
      [390000, 450000],
    );
    Object.assign(price, {
      kind: "range",
      min: 390000,
      max: 450000,
      unit: "person",
      sourceText: "Банкет «всё включено» — на 1 гостя: 390000 / 450000 UZS",
    });
    description =
      "Banket paketlari: bir mehmon uchun 390 000 yoki 450 000 so‘m. Zal ijarasi 25 000 000 so‘mdan boshlanadi. Narx va shartlarni to‘yxona bilan aniqlashtiring.";
  }
  const listing = {
    slug: selected.slug,
    name: source.name,
    categoryIds: ["restaurant"],
    categoryLabel: "To‘yxonalar va Restoranlar",
    description,
    region: /Ташкентский район/i.test(source.address)
      ? "Toshkent viloyati"
      : "Toshkent shahri",
    district:
      districts.find(([pattern]) => pattern.test(source.address))?.[1] ?? "",
    address: source.address,
    phones: source.phones.map((value, index) => ({
      label: index ? "Qo‘shimcha" : "Asosiy",
      value,
    })),
    links: contacts(source),
    email: source.emails[0] ?? null,
    latitude: source.location?.lat ?? null,
    longitude: source.location?.lng ?? null,
    price,
    images,
    importedAt: result.completedAt,
    featured: false,
  };
  listings.push(listing);
  published.push({
    slug: listing.slug,
    name: listing.name,
    yandexId: source.id,
    sources: result.sources
      .filter((x) => x.provider !== "website")
      .map((x) => ({ provider: x.provider, url: x.url })),
    imageSource: "yandex",
    images: provenance,
    contactPolicy:
      "Yandex anchor phones and one usable link per contact type; uncertain Google candidates and conflicting extra phone values excluded.",
    pricePolicy:
      source.id === "91538804082"
        ? "Explicit per-person wedding packages; rental kept in description, not mixed into package range."
        : "Negotiable; no inferred wedding price from food items, unspecified event services or 1-so'm placeholders.",
    collectionStatus: result.status,
    directoryApprovedByUser: true,
  });
}
assert.equal(new Set(listings.map((x) => x.slug)).size, listings.length);
assert.equal(
  listings.filter((x) => x.categoryIds.includes("restaurant")).length,
  50,
);
await writeFile(listingsFile, JSON.stringify(listings, null, 2) + "\n");
await writeFile(
  reportFile,
  JSON.stringify(
    {
      schemaVersion: 1,
      publishedAt: previous?.publishedAt ?? new Date().toISOString(),
      originalListings: previous?.originalListings ?? originalCount,
      originalWeddingHalls: previous?.originalWeddingHalls ?? originalHallCount,
      publishedListings: 30,
      weddingHalls: 50,
      imageCount: published.reduce((n, x) => n + x.images.length, 0),
      listings: published,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    added: listings.length - originalCount,
    weddingHalls: 50,
    photos: published.reduce((n, x) => n + x.images.length, 0),
  }),
);
