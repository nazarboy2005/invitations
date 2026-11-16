import { load } from "cheerio";
import { contactUrl, isSocialPlatformUrl } from "./contacts.mjs";
import { clean, parseMoney, priceUnit, unique, visit } from "./core.mjs";

// Parse data embedded in public HTML; never evaluate source scripts.
export function schemaObjects(html) {
  const $ = load(html),
    result = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      visit(JSON.parse($(el).text()), (x) => {
        if (x["@type"]) result.push(x);
      });
    } catch {
      /* Optional malformed markup. */
    }
  });
  return result;
}
export function schemaProducts(html, source) {
  return unique(
    schemaObjects(html).flatMap((item) => {
      if (
        ![item["@type"]]
          .flat()
          .some((t) => ["Product", "MenuItem", "Service"].includes(t))
      )
        return [];
      return [item.offers]
        .flat()
        .filter(Boolean)
        .flatMap((offer) => {
          const money = parseMoney(offer.price, offer.priceCurrency);
          if (!money || !clean(item.name)) return [];
          return [
            {
              name: clean(item.name),
              ...money,
              unit: priceUnit(
                `${item.description ?? ""} ${offer.description ?? ""}`,
              ),
              description: clean(item.description),
              source,
              sourceUrl: null,
            },
          ];
        });
    }),
  );
}
export function contactLinks(html, base, { scoped = false } = {}) {
  const $ = load(html),
    links = [],
    emails = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (/^mailto:/i.test(href)) {
      const email = href.slice(7).split("?")[0];
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        emails.push(email.toLowerCase());
      return;
    }
    const url = contactUrl(href, base);
    if (url && (scoped || isSocialPlatformUrl(url)))
      links.push({ url, label: clean($(el).text()) });
  });
  return { links: unique(links, (x) => x.url), emails: unique(emails) };
}
