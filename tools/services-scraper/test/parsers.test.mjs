import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  parseYandex,
  yandexItems,
  yandexState,
  yandexProducts,
  yandexBusinessId,
  scrapeYandex,
} from "../src/yandex.mjs";
import { parseGoogle, googleIdentity } from "../src/google.mjs";
import { parseMoney, priceUnit, readJsonArray } from "../src/core.mjs";

const fixture = (name) =>
  readFile(new URL(`fixtures/${name}.html`, import.meta.url), "utf8");

test("Yandex identifies shared business points without guessing from coordinates", () => {
  const url = new URL("https://yandex.uz/maps/10335/tashkent/");
  url.searchParams.set("poi[point]", "69.338259,41.289793");
  url.searchParams.set("poi[uri]", "ymapsbm1://org?oid=28785477820");
  assert.equal(yandexBusinessId(url.href), "28785477820");
  assert.equal(
    yandexBusinessId("https://yandex.uz/maps/org/test/123/menu/"),
    "123",
  );
  assert.equal(yandexBusinessId("https://yandex.uz/maps/-/CXSBfFON"), null);
  for (const uri of [
    "",
    "https://evil.example/?oid=123",
    "ymapsbm1://house?oid=123",
    "ymapsbm1://org?oid=123/../../",
    "ymapsbm1://user@org?oid=123",
  ]) {
    url.searchParams.set("poi[uri]", uri);
    assert.equal(yandexBusinessId(url.href), null);
  }
  assert.equal(
    yandexBusinessId("https://yandex.uz/maps/?ll=69.338259,41.289793"),
    null,
  );
  assert.throws(() => yandexBusinessId("https://evil.example/maps/?oid=123"));
});

test("Yandex shared map points fetch the exact business page before extracting details", async () => {
  const resolved = new URL("https://yandex.uz/maps/10335/tashkent/");
  resolved.searchParams.set("poi[uri]", "ymapsbm1://org?oid=178096015422");
  const calls = [];
  const html = await fixture("yandex-versal");
  const record = await scrapeYandex("https://yandex.uz/maps/-/share", {
    fetcher: {
      get: async (url, options) => {
        calls.push(url);
        assert.equal(options.maps, true);
        return calls.length === 1
          ? { url: resolved.href, text: awaitNever() }
          : { url, text: html };
      },
    },
  });
  assert.equal(record.id, "178096015422");
  assert.equal(calls[1], "https://yandex.uz/maps/org/178096015422/");
  assert.ok(record.name.includes("Versal"));
  assert.ok(record.phones.length);
  assert.ok(record.images.length);
});

test("Yandex shared business identity cannot silently switch to another business", async () => {
  const url = new URL("https://yandex.uz/maps/10335/tashkent/");
  url.searchParams.set("poi[uri]", "ymapsbm1://org?oid=999");
  const html = await fixture("yandex-versal");
  await assert.rejects(
    scrapeYandex(url.href, {
      fetcher: { get: async (value) => ({ url: value, text: html }) },
    }),
    /Exact Yandex business/,
  );
});
test("captured Yandex detail yields identity, contacts and photos without treating its address as a description", async () => {
  const r = parseYandex(
    await fixture("yandex-versal"),
    "https://yandex.uz/maps/org/versal/178096015422/",
  );
  assert.equal(r.id, "178096015422");
  assert.ok(r.name.includes("Versal"));
  assert.ok(r.phones.includes("+998712422164"));
  assert.equal(r.location.lng, 69.224814);
  assert.equal(r.descriptions.length, 0);
  assert.equal(r.images.length, 2);
  assert.match(r.images[0].url, /\/XXXL$/);
  assert.throws(() =>
    parseYandex(awaitNever(), "https://yandex.uz/maps/org/999/"),
  );
});
function awaitNever() {
  return '<script class="state-view" type="application/json">{"stack":[]}</script>';
}
test("real Yandex menu extracts numeric prices, original descriptions, and product categories", async () => {
  const r = parseYandex(
    await fixture("yandex-safia-menu"),
    "https://yandex.uz/maps/org/safia/62015200740/menu/",
    "62015200740",
  );
  assert.equal(r.products.length, 38);
  assert.ok(
    r.products.every(
      (x) => x.currency === "UZS" && Number.isFinite(x.amount) && x.category,
    ),
  );
  assert.equal(Math.min(...r.products.map((x) => x.amount)), 7500);
  assert.equal(Math.max(...r.products.map((x) => x.amount)), 448000);
  assert.ok(
    r.products.some(
      (x) => x.name === "Рулет Меренговый" && x.amount === 209000,
    ),
  );
});
test("Yandex parser selects the requested business, excludes unrelated results, and rejects challenge pages", () => {
  const state = {
    stack: [
      {
        results: {
          items: [
            { type: "business", id: "1", title: "Wrong" },
            {
              type: "business",
              id: "2",
              title: "Right",
              address: "Street",
              phones: [],
            },
          ],
        },
      },
    ],
  };
  const html = `<script type="application/json" class="state-view">${JSON.stringify(state)}</script>`;
  assert.equal(
    parseYandex(html, "https://yandex.uz/maps/org/2/").name,
    "Right",
  );
  assert.equal(yandexItems(yandexState(html)).length, 2);
  assert.throws(
    () => parseYandex(html, "https://yandex.uz/maps/org/3/"),
    /Exact/,
  );
  assert.throws(
    () => yandexState('<div class="CheckboxCaptcha"></div>'),
    /ACCESS_CHALLENGE/,
  );
});
test("captured Google DOM extracts actual business fields and marks limited access", async () => {
  const r = parseGoogle(
    await fixture("google-versal"),
    "https://www.google.com/maps/place/Versal/data=!1s0x38ae8b8efc7297ff:0x2b25a59e558906f4!3d41.3282599!4d69.2248441",
  );
  assert.equal(r.name, "Versal Banquet Hall");
  assert.equal(r.id, "0x38ae8b8efc7297ff:0x2b25a59e558906f4");
  assert.equal(r.location.lat, 41.3282599);
  assert.ok(r.phones.includes("+998712422164"));
  assert.match(r.address, /Beruni/);
  assert.equal(r.coverage.limitedView, true);
  assert.equal(r.images.length, 1);
  assert.match(r.images[0].url, /w1440/);
  assert.equal(r.descriptions.length, 0);
});
test("Google parser supports available description/products/social/email fields and excludes profile avatars (synthetic markup)", () => {
  const html = `<h1 data-business-name>Test Hall</h1><p data-item-id="description">A business-provided description with enough information to review.</p><a data-item-id="authority" href="https://hall.example">Website</a><a href="mailto:hello@hall.example">Email</a><a href="https://instagram.com/testhall">Instagram</a><img src="https://lh3.googleusercontent.com/a-/profile"><script type="application/ld+json">{"@type":"Product","name":"Guest package","offers":{"price":250000,"priceCurrency":"UZS","description":"per guest"}}</script>`;
  const r = parseGoogle(html, "https://www.google.com/maps/place/test/");
  assert.equal(r.descriptions.length, 1);
  assert.deepEqual(r.emails, ["hello@hall.example"]);
  assert.equal(r.links.length, 2);
  assert.equal(r.images.length, 0);
  assert.equal(r.products[0].amount, 250000);
});
test("money parsing preserves currencies and handles local separators without inventing amounts", () => {
  for (const text of ["250 000 so‘m", "250,000 UZS", "250.000 сўм"])
    assert.deepEqual(parseMoney(text), { amount: 250000, currency: "UZS" });
  assert.deepEqual(parseMoney("$12.50"), { amount: 12.5, currency: "USD" });
  assert.deepEqual(parseMoney("209000", "сўм"), {
    amount: 209000,
    currency: "UZS",
  });
  for (const text of ["Negotiable", "250000", "0 UZS", "250–500 UZS"])
    assert.equal(parseMoney(text), null);
  assert.equal(priceUnit("Banquet hall for 500 kishi"), null);
  assert.equal(priceUnit("250000 so‘m kishi boshiga"), "person");
  assert.equal(priceUnit("Банкет «всё включено» — на 1 гостя"), "person");
  assert.equal(priceUnit("Киши бошига"), "person");
  assert.equal(priceUnit("Банкетный зал на 500 гостей"), null);
});
test("Yandex menu units use explicit guest wording in product titles, not hall capacity", () => {
  const products = yandexProducts("", {
    fullObjects: {
      categories: [
        {
          categoryName: "Packages",
          categoryItems: [
            { title: "Банкет — на 1 гостя", price: "390000", currency: "UZS" },
            { title: "Киши бошига", price: "1", currency: "UZS" },
            {
              title: "Аренда зала",
              description: "Банкетный зал на 500 гостей",
              price: "25000000",
              currency: "UZS",
            },
          ],
        },
      ],
    },
  });
  assert.deepEqual(
    products.map((x) => x.unit),
    ["person", "person", null],
  );
});

test("embedded JSON parsing does not execute scripts and handles quoted brackets", () => {
  assert.deepEqual(
    readJsonArray('window.X=["a]b",{"x":1}];throw new Error()', "window.X="),
    ["a]b", { x: 1 }],
  );
  assert.equal(
    readJsonArray("window.X=(()=>process.exit())()", "window.X="),
    null,
  );
  assert.equal(
    googleIdentity("https://www.google.com/maps/@41,69,10z").location,
    null,
  );
});
