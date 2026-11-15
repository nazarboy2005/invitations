import { haversine, normalize, unique } from "./core.mjs";

const cyrillic = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "j",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "x",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sh",
  ъ: "",
  ы: "i",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
  қ: "q",
  ғ: "g",
  ҳ: "h",
  ў: "o",
};
const transliterate = (value) =>
  normalize(value).replace(/[а-яёқғҳў]/g, (x) => cyrillic[x] ?? x);
export function nameSimilarity(a, b) {
  const tokens = (value) =>
    new Set(
      transliterate(value)
        .split(" ")
        .filter(
          (x) =>
            x.length > 1 &&
            ![
              "restaurant",
              "restoran",
              "wedding",
              "hall",
              "banquet",
              "event",
              "toyxona",
              "toyxonasi",
              "tantanalar",
              "palace",
            ].includes(x),
        ),
    );
  const first = tokens(a),
    second = tokens(b);
  if (!first.size || !second.size) return 0;
  const overlap = [...first].filter((x) => second.has(x)).length;
  const tokenScore = (2 * overlap) / (first.size + second.size);
  const compactA = [...first].join(""),
    compactB = [...second].join("");
  let previous = Array.from({ length: compactB.length + 1 }, (_, i) => i);
  for (let i = 1; i <= compactA.length; i++) {
    const next = [i];
    for (let j = 1; j <= compactB.length; j++)
      next[j] = Math.min(
        next[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (compactA[i - 1] === compactB[j - 1] ? 0 : 1),
      );
    previous = next;
  }
  const editScore =
    1 - previous[compactB.length] / Math.max(compactA.length, compactB.length);
  return Math.max(
    tokenScore,
    Math.min(compactA.length, compactB.length) >= 6 && editScore >= 0.85
      ? editScore
      : 0,
  );
}
export function matchBusinesses(a, b) {
  const distance = haversine(a.location, b.location),
    similarity = nameSimilarity(a.name, b.name);
  const sharedPhones = (a.phones ?? []).filter((x) => b.phones?.includes(x));
  const sharedWebsite = (a.links ?? []).some(
    (x) =>
      x.type === "website" &&
      (b.links ?? []).some(
        (y) =>
          y.type === "website" &&
          new URL(x.url).hostname.replace(/^www\./, "") ===
            new URL(y.url).hostname.replace(/^www\./, ""),
      ),
  );
  const reasons = [];
  if (sharedPhones.length) reasons.push("shared_phone");
  if (sharedWebsite) reasons.push("shared_website");
  if (similarity >= 0.5) reasons.push("similar_name");
  if (distance !== null) reasons.push(`distance_${Math.round(distance)}m`);
  let status = "needs_review";
  if (distance !== null && distance > 1000) status = "rejected";
  else if (
    distance !== null &&
    distance <= 180 &&
    (similarity >= 0.5 || sharedPhones.length)
  )
    status = "matched";
  else if (
    distance !== null &&
    distance <= 600 &&
    sharedPhones.length &&
    similarity >= 0.5
  )
    status = "matched";
  else if (distance === null && sharedPhones.length && similarity >= 0.5)
    status = "matched";
  else if (similarity === 0 && !sharedPhones.length && !sharedWebsite)
    status = "rejected";
  const score =
    (sharedPhones.length ? 50 : 0) +
    similarity * 30 +
    (distance !== null && distance < 600 ? 20 * (1 - distance / 600) : 0) +
    (sharedWebsite ? 10 : 0);
  return {
    status,
    score: Math.round(score),
    similarity: Number(similarity.toFixed(3)),
    distanceMeters: distance === null ? null : Math.round(distance),
    reasons,
  };
}
export function priceRanges(products) {
  const groups = new Map();
  for (const product of products) {
    if (
      !Number.isFinite(product.amount) ||
      product.amount <= 0 ||
      product.excludedFromPriceRange ||
      (product.currency === "UZS" && product.amount <= 1) ||
      !product.currency
    )
      continue;
    const key = `${product.currency}|${product.unit ?? "unknown"}|${product.category ?? "unclassified"}`;
    const group = groups.get(key) ?? {
      currency: product.currency,
      unit: product.unit,
      category: product.category ?? null,
      min: product.amount,
      max: product.amount,
      products: [],
      needsReview: true,
      coverage: "observed_items_only",
    };
    group.min = Math.min(group.min, product.amount);
    group.max = Math.max(group.max, product.amount);
    group.products.push(product.name);
    groups.set(key, group);
  }
  return [...groups.values()];
}
export function combineSources(records, { overrides = {} } = {}) {
  const conflicts = [],
    provenance = {};
  const scalar = (field) => {
    const candidates = records
      .filter((x) => x[field])
      .map((x) => ({ value: x[field], source: x.provider, sourceUrl: x.url }));
    provenance[field] = candidates;
    if (
      ["name", "address"].includes(field) &&
      unique(candidates, (x) => normalize(x.value)).length > 1
    )
      conflicts.push({ field, candidates });
    return candidates[0]?.value ?? (field === "location" ? null : "");
  };
  const descriptions = records
    .flatMap((x) => x.descriptions)
    .filter((x) => !["review_excerpt", "review_summary"].includes(x.kind));
  provenance.description = descriptions.map((x) => ({
    value: x.text,
    source: x.source,
    sourceUrl: x.sourceUrl,
    kind: x.kind,
  }));
  if (unique(descriptions, (x) => normalize(x.text)).length > 1)
    conflicts.push({
      field: "description",
      candidates: provenance.description,
    });
  const sourced = (field) =>
    unique(
      records.flatMap((r) =>
        r[field].map((value) => ({
          value,
          source: r.provider,
          sourceUrl: r.url,
        })),
      ),
      (x) => JSON.stringify(x),
    );
  for (const key of ["phones", "links", "emails", "hours", "categories"])
    provenance[key] =
      key === "hours"
        ? records
            .filter((r) => r.hours)
            .map((r) => ({
              value: r.hours,
              source: r.provider,
              sourceUrl: r.url,
            }))
        : sourced(key);
  const products = unique(
    records.flatMap((r) => r.products),
    (p) =>
      `${normalize(p.name)}|${p.currency}|${p.amount}|${p.unit}|${p.category ?? ""}`,
  ).map((product) =>
    product.currency === "UZS" && product.amount <= 1
      ? {
          ...product,
          needsReview: true,
          excludedFromPriceRange: true,
          qualityFlags: unique([
            ...(product.qualityFlags ?? []),
            "possible_placeholder_price",
          ]),
        }
      : product,
  );
  const productVariants = new Map();
  for (const p of products) {
    const key = `${normalize(p.name)}|${p.currency}|${p.unit}`;
    const group = productVariants.get(key) ?? [];
    group.push(p);
    productVariants.set(key, group);
  }
  for (const candidates of productVariants.values())
    if (new Set(candidates.map((p) => p.amount)).size > 1)
      conflicts.push({ field: "product_price", candidates });
  const merged = {
    name: scalar("name"),
    address: scalar("address"),
    location: scalar("location"),
    description: descriptions[0]?.text ?? "",
    phones: unique(records.flatMap((r) => r.phones)),
    links: unique(
      records.flatMap((r) => r.links),
      (x) => x.url,
    ),
    emails: unique(records.flatMap((r) => r.emails)),
    categories: unique(records.flatMap((r) => r.categories)),
    hours: records.find((r) => r.hours)?.hours ?? "",
    images: unique(
      records.flatMap((r) => r.images),
      (x) => x.url,
    ),
    products,
    priceRanges: priceRanges(products),
  };
  if (records.length > 1) {
    const phoneSets = records
      .filter((r) => r.phones.length)
      .map((r) => r.phones);
    if (
      phoneSets.length > 1 &&
      !phoneSets[0].some((p) => phoneSets[1].includes(p))
    )
      conflicts.push({ field: "phones", candidates: provenance.phones });
  }
  // Manual corrections live separately from scraped snapshots and win on refresh.
  for (const [key, value] of Object.entries(overrides))
    if (
      [
        "name",
        "address",
        "description",
        "phones",
        "links",
        "emails",
        "hours",
        "categories",
        "location",
      ].includes(key)
    ) {
      merged[key] = value;
      provenance[key] = [{ value, source: "manual" }];
    }
  const missing = [
    "description",
    "phones",
    "links",
    "emails",
    "images",
    "products",
  ].filter((key) => !merged[key]?.length);
  return { ...merged, conflicts, missing, provenance, reviewRequired: true };
}
