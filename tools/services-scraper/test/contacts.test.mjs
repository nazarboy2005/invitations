import test from "node:test";
import assert from "node:assert/strict";
import { contactUrl, normalizeContactLinks } from "../src/contacts.mjs";
import { contactLinks } from "../src/schema.mjs";
import { parseGoogle } from "../src/google.mjs";
import { enrichWebsite } from "../src/website.mjs";
import { combineSources } from "../src/merge.mjs";
import { sourceRecord } from "../src/core.mjs";
import { toFotihaDraft } from "../src/fotiha-adapter.mjs";

test("Instagram contacts canonicalize profile variants and exclude HTTP, navigation and post links", () => {
  const profile = "https://www.instagram.com/parvoz_restaurant";
  const variants = [
    profile,
    profile + "/",
    "https://instagram.com/Parvoz_Restaurant/?igsh=tracking#bio",
    "https://m.instagram.com/parvoz_restaurant/",
  ];
  for (const url of variants) assert.equal(contactUrl(url), profile);
  const invalid = [
    "http://instagram.com/parvoz_restaurant",
    "http://www.instagram.com/parvoz_restaurant/",
    "http://instagram.com./parvoz_restaurant/",
    "https://www.instagram.com/",
    "https://www.instagram.com/accounts/login/?next=/parvoz_restaurant",
    "https://www.instagram.com/accounts/emailsignup/",
    "https://www.instagram.com/stories/hall/123/",
    "https://www.instagram.com/stories/highlights/123/",
    "https://www.instagram.com/reel/123/",
    "https://www.instagram.com/reels/",
    "https://www.instagram.com/hall/reel/123/",
    "https://www.instagram.com/p/123/",
    "https://www.instagram.com/explore/",
    "https://l.instagram.com/?u=https://example.com",
    "https://www.instagram.com:444/hall",
    "https://www.instagram.com/hall..bad",
    "https://www.instagram.com/hall.",
    "https://user:password@instagram.com/hall",
    "javascript:alert(1)",
  ];
  for (const url of invalid) assert.equal(contactUrl(url), null, url);
  assert.deepEqual(
    normalizeContactLinks(
      [...variants, ...invalid].map((url) => ({ url, type: "website" })),
    ),
    [{ url: profile, type: "instagram" }],
  );
  assert.equal(
    contactUrl("http://hall.example/contact"),
    "http://hall.example/contact",
  );
});

test("Google authority profiles are social contacts and official website enrichment keeps only profile links", async () => {
  const url = "https://www.google.com/maps/place/Hall/";
  const google = parseGoogle(
    '<h1 data-business-name>Hall</h1><a data-item-id="authority" href="https://instagram.com/parvoz_restaurant/">Website</a>',
    url,
  );
  assert.deepEqual(google.links, [
    {
      url: "https://www.instagram.com/parvoz_restaurant",
      type: "instagram",
      label: "Website",
    },
  ]);
  const html = `<a href="https://instagram.com/parvoz_restaurant/">Instagram</a>
    <a href="https://www.instagram.com/parvoz_restaurant">Duplicate</a>
    <a href="https://instagram.com/stories/highlights/123/">Stories</a>
    <a href="https://instagram.com/parvoz_restaurant/reel/123/">Reel</a>
    <a href="https://instagram.com/accounts/login/">Login</a>
    <a href="http://instagram.com/broken">Broken</a>
    <a href="https://t.me/parvoz">Telegram</a><a href="mailto:info@hall.example">Email</a>`;
  const website = await enrichWebsite("https://hall.example/", {
    fetcher: {
      get: async () => ({ url: "https://hall.example/", text: html }),
    },
  });
  assert.deepEqual(
    website.links.map((l) => l.url),
    ["https://www.instagram.com/parvoz_restaurant", "https://t.me/parvoz"],
  );
  assert.deepEqual(website.emails, ["info@hall.example"]);
  assert.deepEqual(
    contactLinks(
      '<a href="https://evil.example/path/instagram.com/hall">Unrelated</a>',
      "https://hall.example",
    ).links,
    [],
  );
  let calls = 0;
  await assert.rejects(
    enrichWebsite("https://instagram.com/parvoz_restaurant", {
      fetcher: {
        get: async () => {
          calls++;
        },
      },
    }),
    /Social accounts/,
  );
  assert.equal(calls, 0);
});

test("merging cached sources, overrides and adapter inputs cannot restore duplicate or invalid Instagram contacts", () => {
  const links = [
    { url: "https://instagram.com/parvoz_restaurant/", type: "website" },
    { url: "https://www.instagram.com/parvoz_restaurant", type: "instagram" },
    { url: "http://instagram.com/parvoz_restaurant" },
    { url: "https://www.instagram.com/accounts/login/" },
  ];
  const merged = combineSources(
    [
      {
        ...sourceRecord("google", "https://google.com/maps/place/Hall"),
        name: "Hall",
        links,
      },
    ],
    { overrides: { links } },
  );
  assert.equal(merged.links.length, 1);
  assert.equal(
    merged.links[0].url,
    "https://www.instagram.com/parvoz_restaurant",
  );
  const draft = toFotihaDraft(
    { completedAt: new Date().toISOString(), merged: { name: "Hall", links } },
    { categoryId: "restaurant" },
    "hall",
    [],
    "Hall",
  );
  assert.deepEqual(draft.links, [
    { url: "https://www.instagram.com/parvoz_restaurant", label: "instagram" },
  ]);
});
