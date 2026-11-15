import { load } from "cheerio";
import {
  clean,
  linkKind,
  parseMoney,
  phone,
  priceUnit,
  sourceRecord,
  unique,
  visit,
  webUrl,
} from "./core.mjs";
import { schemaObjects, schemaProducts } from "./schema.mjs";

export function yandexState(html) {
  const $ = load(html);
  const script = $('script.state-view[type="application/json"]').first().text();
  if (!script)
    throw new Error(
      /showcaptcha|captcha-container|CheckboxCaptcha/.test(html)
        ? "ACCESS_CHALLENGE: Yandex requested verification."
        : "Yandex page has no supported business state.",
    );
  try {
    return JSON.parse(script);
  } catch {
    throw new Error("Yandex business state is malformed.");
  }
}
export function yandexItems(state) {
  return unique(
    (state.stack ?? [])
      .flatMap((x) => x.results?.items ?? [])
      .filter((x) => x.type === "business" && x.id && x.title),
    (x) => x.id,
  );
}
export function yandexOrgUrl(item) {
  return `https://yandex.uz/maps/org/${item.seoname ? `${item.seoname}/` : ""}${item.id}/`;
}
export function yandexSearchUrl(query, page = 0) {
  const url = new URL("https://yandex.uz/maps/");
  url.searchParams.set("text", query);
  if (page) url.searchParams.set("page", String(page));
  return url.href;
}
export function yandexProducts(html, org) {
  const products = schemaProducts(html, "yandex");
  for (const catalog of [org.fullObjects, org.topObjects])
    for (const category of catalog?.categories ?? [])
      for (const item of category.categoryItems ?? []) {
        const money = parseMoney(item.price, item.currency);
        if (money && clean(item.title))
          products.push({
            name: clean(item.title),
            ...money,
            category: clean(category.categoryName),
            unit: priceUnit(
              `${item.title ?? ""} ${item.description ?? ""} ${item.volume ?? ""}`,
            ),
            description: clean(item.description),
            source: "yandex",
            sourceUrl: null,
          });
      }
  // Some public page versions embed goods/menu items as named objects.
  for (const key of [
    "goods",
    "products",
    "menu",
    "popularItems",
    "popularGoods",
    "businessGoods",
  ]) {
    visit(org[key], (item) => {
      const money = parseMoney(
        item.price?.value ??
          item.price?.amount ??
          item.price ??
          item.priceValue,
        item.currency ?? item.price?.currency,
      );
      const name = clean(item.title ?? item.name);
      if (name && money)
        products.push({
          name,
          ...money,
          unit: priceUnit(
            `${name} ${item.description ?? ""} ${item.unit ?? ""}`,
          ),
          description: clean(item.description),
          source: "yandex",
          sourceUrl: null,
        });
    });
  }
  // Restrict DOM extraction to product cards; never infer prices from reviews.
  const $ = load(html);
  $(
    '[class*="business-full-prices-item"], [class*="business-menu-item"], [class*="business-goods-item"]',
  ).each((_, el) => {
    const card = $(el);
    const name = clean(
      card.find('[class*="title"], [class*="name"]').first().text(),
    );
    const text = clean(card.find('[class*="price"]').text());
    const money = parseMoney(text);
    if (name && money)
      products.push({
        name,
        ...money,
        unit: priceUnit(card.text()),
        description: clean(card.find('[class*="description"]').text()),
        source: "yandex",
        sourceUrl: null,
      });
  });
  return unique(
    products,
    (p) => `${p.name}|${p.amount}|${p.currency}|${p.unit}`,
  );
}
export function parseYandex(html, url, requestedId = null) {
  const items = yandexItems(yandexState(html));
  const id =
    requestedId ??
    new URL(url).pathname.match(/\/(\d+)\/?(?:prices\/?)?$/)?.[1];
  const org = id
    ? items.find((x) => x.id === id)
    : items.length === 1
      ? items[0]
      : null;
  if (!org)
    throw new Error("Exact Yandex business was not found on this page.");
  const result = sourceRecord("yandex", yandexOrgUrl(org), org.id);
  result.name = clean(org.title);
  result.address = clean(org.fullAddress ?? org.address);
  if (Array.isArray(org.coordinates) && org.coordinates.length === 2)
    result.location = { lat: org.coordinates[1], lng: org.coordinates[0] };
  result.phones = unique(
    (org.phones ?? []).map((x) => phone(x.value ?? x.number)).filter(Boolean),
  );
  result.categories = (org.categories ?? [])
    .map((x) => clean(x.name))
    .filter(Boolean);
  result.hours = clean(org.workingTimeText);
  result.links = unique(
    [
      ...(org.urls ?? []).map((url) => ({ url })),
      ...(org.socialLinks ?? []),
      ...(org.businessLinks ?? []),
    ].flatMap((x) => {
      const url = webUrl(x.href ?? x.url);
      return url
        ? [
            {
              url,
              label: clean(x.readableHref ?? x.title),
              type: linkKind(url),
            },
          ]
        : [];
    }),
    (x) => x.url,
  );
  result.emails = unique(
    [
      ...(org.emails ?? []).map((x) =>
        typeof x === "string" ? x : (x.value ?? x.address),
      ),
      ...(org.contacts ?? [])
        .filter((x) => x.type === "email")
        .map((x) => x.value),
    ].filter(
      (x) => typeof x === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x),
    ),
  );
  const descriptions = [
    org.businessDescription,
    org.longDescription,
    org.descriptionText,
    org.description,
  ];
  for (const item of schemaObjects(html))
    if (
      [item["@type"]]
        .flat()
        .some((x) => /Business|Restaurant|EventVenue/.test(x))
    )
      descriptions.push(item.description);
  result.descriptions = unique(
    descriptions
      .map(clean)
      .filter(
        (x) =>
          x.length > 30 &&
          ![
            clean(org.description === org.address ? org.description : ""),
            result.address,
            clean(org.address),
          ].includes(x),
      )
      .map((text) => ({
        text,
        kind: "business_description",
        source: "yandex",
        sourceUrl: result.url,
      })),
  );
  result.images = unique(
    (org.photos?.items ?? []).flatMap((x) => {
      const url = webUrl(
        (x.urlTemplate ?? x.url ?? "").replace(/%s|%$/, "XXXL"),
      );
      return url
        ? [
            {
              url,
              alt: clean(x.alt) || result.name,
              source: "yandex",
              sourceUrl: result.url,
            },
          ]
        : [];
    }),
    (x) => x.url,
  );
  result.products = yandexProducts(html, org).map((x) => ({
    ...x,
    sourceUrl: result.url,
  }));
  if (result.products.length) result.coverage.products = "partial";
  for (const group of org.featureGroups ?? [])
    for (const feature of group.features ?? [])
      if (/price|bill|цена|чек|narx/i.test(feature.id ?? feature.name ?? ""))
        result.priceHints.push({
          text: clean(feature.value ?? feature.name),
          source: "yandex",
        });
  return result;
}
export async function searchYandex(
  query,
  { fetcher, limit = 5, maxPages = 3, logger = () => {} },
) {
  const result = [],
    seen = new Set();
  for (let page = 0; page < maxPages && result.length < limit; page++) {
    logger(`Yandex search page ${page + 1}: ${query}`);
    const { text } = await fetcher.get(yandexSearchUrl(query, page), {
      maps: true,
    });
    const items = yandexItems(yandexState(text));
    let added = 0;
    for (const item of items)
      if (!seen.has(item.id)) {
        seen.add(item.id);
        added++;
        result.push({
          provider: "yandex",
          id: item.id,
          name: clean(item.title),
          address: clean(item.address),
          location: { lat: item.coordinates?.[1], lng: item.coordinates?.[0] },
          url: yandexOrgUrl(item),
          phones: (item.phones ?? [])
            .map((x) => phone(x.value ?? x.number))
            .filter(Boolean),
        });
      }
    if (!added) break;
  }
  return result.slice(0, limit);
}
export async function scrapeYandex(
  url,
  { fetcher, browser, evidenceDir, maxImages = 8, logger = () => {} },
) {
  const response = await fetcher.get(url, { maps: true });
  const record = parseYandex(response.text, response.url);
  const $ = load(response.text);
  const menuHref = $("a[href]")
    .toArray()
    .map((el) => ({ text: clean($(el).text()), href: $(el).attr("href") }))
    .find((x) => /^(Menu|Prices|Menyu|Narxlar|Меню|Цены)$/i.test(x.text));
  // Only open a menu advertised by this business's public page.
  if (menuHref) {
    let page;
    try {
      logger(`Yandex menu: ${record.name}`);
      const menuUrl = new URL(menuHref.href, record.url).href;
      const menuResponse = await fetcher.get(menuUrl, { maps: true });
      const menuOrg = yandexItems(yandexState(menuResponse.text)).find(
        (x) => x.id === record.id,
      );
      record.products = unique(
        [
          ...yandexProducts(menuResponse.text, menuOrg ?? {}).map((x) => ({
            ...x,
            sourceUrl: menuUrl,
          })),
          ...record.products,
        ],
        (p) => `${p.name}|${p.amount}|${p.currency}|${p.unit}`,
      );
      if (evidenceDir) {
        const { writeFile, mkdir } = await import("node:fs/promises");
        const path = await import("node:path");
        await mkdir(evidenceDir, { recursive: true });
        await writeFile(
          path.join(evidenceDir, "yandex-menu.html"),
          menuResponse.text,
        );
      }
    } catch (error) {
      record.warnings.push(`Menu extraction: ${error.message}`);
    } finally {
      await page?.close();
    }
  }
  if (evidenceDir) {
    const { mkdir, writeFile } = await import("node:fs/promises");
    const path = await import("node:path");
    await mkdir(evidenceDir, { recursive: true });
    await writeFile(path.join(evidenceDir, "yandex.html"), response.text);
  }
  record.coverage.products = record.products.length ? "partial" : "not_found";
  record.images = record.images.slice(0, maxImages);
  return record;
}
