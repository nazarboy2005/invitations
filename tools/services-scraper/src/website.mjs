import { load } from "cheerio";
import { clean, linkKind, sourceRecord, unique } from "./core.mjs";
import { contactLinks } from "./schema.mjs";
import { isSocialPlatformUrl, normalizeContactLinks } from "./contacts.mjs";

// Optional and bounded: homepage + up to two same-origin contact/about pages.
export async function enrichWebsite(url, { fetcher }) {
  if (isSocialPlatformUrl(url))
    throw new Error(
      "Social accounts are contacts, not business websites to crawl.",
    );
  const record = sourceRecord("website", url),
    origin = new URL(url).origin;
  const home = await fetcher.get(url);
  if (isSocialPlatformUrl(home.url))
    throw new Error("Business website redirected to a social platform.");
  if (
    new URL(home.url).origin !== origin &&
    new URL(home.url).hostname.replace(/^www\./, "") !==
      new URL(url).hostname.replace(/^www\./, "")
  )
    throw new Error("Business website redirected to another domain.");
  const $ = load(home.text);
  const pages = unique(
    $("a[href]")
      .toArray()
      .flatMap((el) => {
        try {
          const target = new URL($(el).attr("href"), home.url);
          return target.origin === new URL(home.url).origin &&
            /contact|about|kontakt|aloqa|контакт|о\s+нас/i.test(
              `${target.pathname} ${$(el).text()}`,
            )
            ? [target.href]
            : [];
        } catch {
          return [];
        }
      }),
  ).slice(0, 2);
  const responses = [home];
  for (const page of pages) {
    try {
      const response = await fetcher.get(page);
      if (new URL(response.url).origin !== new URL(home.url).origin)
        throw new Error(
          "Contact page redirected outside the business website.",
        );
      responses.push(response);
    } catch (error) {
      record.warnings.push(`Contact page: ${error.message}`);
    }
  }
  for (const response of responses) {
    const contacts = contactLinks(response.text, response.url);
    record.emails.push(...contacts.emails);
    record.links.push(
      ...contacts.links.map((x) => ({ ...x, type: linkKind(x.url) })),
    );
  }
  record.emails = unique(record.emails);
  record.links = normalizeContactLinks(record.links);
  // Website contacts are enrichment evidence, never a separate business match.
  record.name = "";
  record.warnings.push(
    "Public business-website contact links only; no email addresses inferred.",
  );
  return record;
}
