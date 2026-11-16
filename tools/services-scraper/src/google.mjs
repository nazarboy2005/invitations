import { load } from "cheerio";
import {
  clean,
  linkKind,
  phone,
  priceUnit,
  parseMoney,
  sourceRecord,
  unique,
  webUrl,
} from "./core.mjs";
import { contactLinks, schemaObjects, schemaProducts } from "./schema.mjs";
import { normalizeContactLinks } from "./contacts.mjs";

export function googleSearchUrl(query) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}/?hl=en`;
}
export function googleIdentity(url) {
  const decoded = decodeURIComponent(url);
  const id =
    decoded.match(/!1s(0x[\da-f]+:0x[\da-f]+|ChI[\w-]+)/i)?.[1] ??
    new URL(url).searchParams.get("cid") ??
    null;
  const point = decoded.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  return {
    id,
    location: point ? { lat: Number(point[1]), lng: Number(point[2]) } : null,
  };
}
export function parseGoogle(html, url) {
  const $ = load(html),
    name = clean($("h1.DUwDvf, h1[data-business-name]").first().text());
  if (!name) throw new Error("Google did not show a business detail page.");
  const identity = googleIdentity(url),
    record = sourceRecord("google", url, identity.id);
  record.name = name;
  record.location = identity.location;
  record.address = clean(
    $('[data-item-id="address"]')
      .attr("aria-label")
      ?.replace(/^Address:\s*/i, "") ||
      $('[data-item-id="address"] .Io6YTe').text() ||
      $('[data-item-id="address"]').text(),
  );
  record.phones = unique(
    $('[data-item-id^="phone:tel:"], a[href^="tel:"]')
      .toArray()
      .map((el) =>
        phone(
          ($(el).attr("data-item-id") ?? $(el).attr("href") ?? "").replace(
            /^phone:tel:|^tel:/,
            "",
          ),
        ),
      )
      .filter(Boolean),
  );
  record.categories = unique(
    $('button.DkEaL, [data-item-id="category"]')
      .toArray()
      .map((el) => clean($(el).text()))
      .filter(Boolean),
  );
  record.hours = clean(
    $('[data-item-id="oh"], [data-item-id="hours"]').attr("aria-label") ?? "",
  );
  const contacts = contactLinks(html, url);
  record.emails = contacts.emails;
  const website = $('[data-item-id="authority"]').attr("href");
  record.links = normalizeContactLinks([
    ...(website && webUrl(website)
      ? [{ url: webUrl(website), type: "website", label: "Website" }]
      : []),
    ...contacts.links.map((x) => ({ ...x, type: linkKind(x.url) })),
  ]);
  const texts = $(
    '.PYvSYb, .WeS02d, [data-item-id="description"], [data-attrid="kc:/local:merchant_description"]',
  )
    .toArray()
    .map((el) => clean($(el).text()));
  for (const item of schemaObjects(html))
    if (
      [item["@type"]]
        .flat()
        .some((t) => /Business|Restaurant|EventVenue/.test(t))
    )
      texts.push(clean(item.description));
  record.descriptions = unique(
    texts
      .filter((text) => text.length > 30)
      .map((text) => ({
        text,
        kind: "source_description",
        source: "google",
        sourceUrl: url,
      })),
  );
  record.images = unique(
    $("img[src]")
      .toArray()
      .flatMap((el) => {
        const src = $(el).attr("src");
        if (
          !/^https:\/\/(?:lh\d+\.googleusercontent\.com|[^/]+\.ggpht\.com)\//.test(
            src,
          ) ||
          /\/(?:a|a-)\//.test(src)
        )
          return [];
        return [
          {
            url: src.replace(/=w\d+[^?]*$/, "=w1440-h1440-k-no"),
            alt: clean($(el).attr("alt")) || name,
            source: "google",
            sourceUrl: url,
          },
        ];
      }),
    (x) => x.url,
  );
  record.products = schemaProducts(html, "google");
  $("[data-product-id], .product-card").each((_, el) => {
    const card = $(el),
      money = parseMoney(
        card.find('[itemprop="price"], [class*="price"]').text(),
      );
    const productName = clean(
      card.find('[itemprop="name"], [class*="title"]').first().text(),
    );
    if (money && productName)
      record.products.push({
        name: productName,
        ...money,
        unit: priceUnit(card.text()),
        description: "",
        source: "google",
        sourceUrl: url,
      });
  });
  record.products = unique(
    record.products.map((x) => ({ ...x, sourceUrl: url })),
  );
  record.coverage.products = record.products.length ? "partial" : "not_found";
  record.coverage.limitedView = /limited view of Google Maps/i.test(
    $("body").text(),
  );
  if (record.coverage.limitedView)
    record.warnings.push(
      "Google supplied a limited anonymous view; additional descriptions, products, and gallery photos may not be accessible.",
    );
  return record;
}
async function waitForResults(page, timeout = 20000) {
  await page
    .locator('h1.DUwDvf, [role="feed"], form[action*="sorry"]')
    .or(
      page.getByText(
        /No results found|Google Maps can.t find|couldn.t find|Ничего не найдено/i,
      ),
    )
    .first()
    .waitFor({ timeout });
}
export async function searchGoogle(
  query,
  { browser, limit = 5, logger = () => {}, evidenceDir },
) {
  const page = await browser.page();
  try {
    logger(`Google search: ${query}`);
    await browser.navigate(page, googleSearchUrl(query));
    await waitForResults(page);
    if (await page.locator("h1.DUwDvf").count()) {
      const record = parseGoogle(await page.content(), page.url());
      return [
        {
          provider: "google",
          id: record.id,
          name: record.name,
          address: record.address,
          location: record.location,
          phones: record.phones,
          url: record.url,
        },
      ];
    }
    if (!(await page.locator('[role="feed"]').count())) return [];
    let previous = 0;
    for (let i = 0; i < Math.min(12, Math.ceil(limit / 5) + 1); i++) {
      const count = await page
        .locator('a.hfpxzc[href], [role="feed"] a[href*="/maps/place/"]')
        .count();
      if (count >= limit || (count === previous && i > 0)) break;
      previous = count;
      await page
        .locator('[role="feed"]')
        .first()
        .evaluate((el) => {
          el.scrollTop = el.scrollHeight;
        });
      await page.waitForTimeout(1000);
    }
    return unique(
      (
        await page
          .locator('a.hfpxzc[href], [role="feed"] a[href*="/maps/place/"]')
          .evaluateAll((elements) =>
            elements.map((el) => ({
              name: el.getAttribute("aria-label") ?? el.textContent,
              url: el.href,
            })),
          )
      ).map((x) => ({
        ...x,
        provider: "google",
        ...googleIdentity(x.url),
        phones: [],
        address: "",
      })),
      (x) => x.id ?? x.url,
    ).slice(0, limit);
  } catch (error) {
    await browser
      .evidence(page, evidenceDir, "google-search-error")
      .catch(() => {});
    throw error;
  } finally {
    await page.close();
  }
}
export async function scrapeGoogle(
  url,
  { browser, evidenceDir, maxImages = 8, logger = () => {} },
) {
  const page = await browser.page();
  try {
    logger("Opening Google business page");
    await browser.navigate(page, url);
    await waitForResults(page);
    if (!(await page.locator("h1.DUwDvf").count()))
      throw new Error(
        "Google URL returned multiple businesses; use search mode or provide a specific place link.",
      );
    await page.waitForTimeout(900);
    const record = parseGoogle(await page.content(), page.url());
    await browser.evidence(page, evidenceDir, "google");
    const gallery = page.getByRole("button", {
      name: /^(See photos|Photos|Все фото|Фотографии)/i,
    });
    if ((await gallery.count()) && record.images.length < maxImages) {
      try {
        await gallery.first().click({ timeout: 5000 });
        await page.waitForTimeout(1200);
        const $ = load(await page.content());
        const photoHtml = `<h1 data-business-name>${record.name.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</h1>${$("img").toString()}`;
        record.images = unique(
          [...record.images, ...parseGoogle(photoHtml, record.url).images],
          (x) => x.url,
        );
        await browser.evidence(page, evidenceDir, "google-gallery");
      } catch (error) {
        record.warnings.push(`Gallery: ${error.message}`);
      }
    }
    record.images = record.images.slice(0, maxImages);
    return record;
  } catch (error) {
    await browser.evidence(page, evidenceDir, "google-error").catch(() => {});
    throw error;
  } finally {
    await page.close();
  }
}
