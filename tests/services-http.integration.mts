import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  serviceCategories,
  serviceListings,
} from "../apps/web/src/modules/services/services-data";

const origin = process.env.SERVICES_TEST_ORIGIN ?? "http://127.0.0.1:3001";
const cardCount = (html: string) =>
  [...html.matchAll(/<article\b[^>]*data-service-card/g)].length;
const checks: string[] = [];
async function page(route: string, status = 200) {
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, status, route);
  const html = await response.text();
  assert.ok(
    !/payment\.chorlove\.uz|search-maps\.yandex|api-maps\.yandex/.test(html),
    route,
  );
  checks.push(route);
  return html;
}

const directoryHtml = await page("/services");
assert.equal(cardCount(directoryHtml), 12);
assert.ok(
  !/HAMKORLIK UCHUN|yaxshi hamrohlardan boshlanadi/.test(directoryHtml),
);
assert.ok(!/class="[^"]*cardCategory/.test(directoryHtml));
const templatesHtml = await page("/templates");
const templateCount = templatesHtml.match(
  /To‘liq kolleksiya[\s\S]*?<\/span>\s*(?:<!--.*?-->\s*)*(\d+)/,
)?.[1];
assert.ok(templateCount, "template catalog exposes its published count");
assert.match(
  directoryHtml,
  new RegExp(
    `Taklifnomalar</span>(?:</span>)?<small>(?:<!--.*?-->)*${templateCount}</small>`,
  ),
);
assert.match(
  directoryHtml,
  /href="\/templates"[^>]*><span[^>]*><svg[\s\S]*?Taklifnomalar/,
);
for (const category of serviceCategories) {
  if (category.id === "invitation") {
    const response = await fetch(new URL("/services/invitation", origin), {
      redirect: "manual",
    });
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "/templates");
    checks.push("/services/invitation → /templates");
    continue;
  }
  const count = serviceListings.filter((listing) =>
    listing.categoryIds.includes(category.id),
  ).length;
  const html = await page(`/services/${category.id}`);
  assert.equal(cardCount(html), Math.min(12, count), category.id);
  for (let pageNumber = 2; pageNumber <= Math.ceil(count / 12); pageNumber++)
    assert.equal(
      cardCount(await page(`/services/${category.id}?page=${pageNumber}`)),
      Math.min(12, count - (pageNumber - 1) * 12),
      category.id,
    );
}
const listing = serviceListings.find((item) =>
  item.categoryIds.includes("florist"),
)!;
assert.equal(
  cardCount(await page(`/services?q=${encodeURIComponent(listing.name)}`)) >= 1,
  true,
);
assert.equal(cardCount(await page("/services?q=no-such-service-zzzzzz")), 0);
await page(`/services/b/${listing.slug}`);
await page("/services/missing-category", 404);
await page("/services/b/missing-profile", 404);
await page(
  "/services?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E&q=duplicate&page=bad",
);
const sitemap = await page("/sitemap.xml");
assert.ok(sitemap.includes(`/services/b/${listing.slug}`));
assert.ok(!sitemap.includes("/services/invitation"));
const { version } = JSON.parse(
  readFileSync("apps/web/src/generated/public-asset-version.json", "utf8"),
);
const image = listing.images[0];
const versionedAssets = directoryHtml.includes(`/_assets/${version}`);
const imageResponse = await fetch(
  new URL(
    versionedAssets ? `/_assets/${version}${image.src}` : image.src,
    origin,
  ),
);
assert.equal(imageResponse.status, 200);
if (versionedAssets)
  assert.match(
    imageResponse.headers.get("cache-control") ?? "",
    /max-age=31536000.*immutable/,
  );
const actualHash = createHash("sha256")
  .update(Buffer.from(await imageResponse.arrayBuffer()))
  .digest("hex");
const expectedHash = createHash("sha256")
  .update(readFileSync(`apps/web/public${image.src}`))
  .digest("hex");
assert.equal(
  actualHash,
  expectedHash,
  "published photo matches the saved local file",
);
console.log(
  JSON.stringify({
    passed: checks.length,
    origin,
    categories: serviceCategories.length,
    pageSize: 12,
  }),
);
