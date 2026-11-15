import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sourceRecord } from "../src/core.mjs";
import { scrapeBusiness, runBatch } from "../src/runner.mjs";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../output/tests",
);
async function temporary(t) {
  await mkdir(root, { recursive: true });
  const directory = await mkdtemp(path.join(root, "runner-"));
  t.after(async () => {
    assert.ok(path.resolve(directory).startsWith(root + path.sep));
    await rm(directory, { recursive: true, force: true });
  });
  return directory;
}
const makeRecord = (provider, url, fields = {}) => ({
  ...sourceRecord(provider, url, provider === "yandex" ? "123" : "google-id"),
  name: "Test Hall",
  location: { lat: 41.3, lng: 69.2 },
  phones: ["+998111111111"],
  ...fields,
});
function setup(out) {
  const calls = { yandex: 0, google: 0, search: 0 };
  const options = {
    out,
    city: "Tashkent",
    maxImages: 0,
    concurrency: 2,
    autoMatch: true,
    providers: ["yandex", "google"],
    logger: () => {},
    fetcher: {
      get: () => {
        throw new Error("unexpected network");
      },
    },
    scrapers: {
      yandex: async (url) => (calls.yandex++, makeRecord("yandex", url)),
      google: async (url) => (calls.google++, makeRecord("google", url)),
    },
    searchers: {
      google: async () => {
        calls.search++;
        return [
          {
            ...makeRecord("google", "https://www.google.com/maps/place/test/"),
            images: undefined,
          },
        ];
      },
      yandex: async () => [],
    },
  };
  return { options, calls };
}
test("full pipeline writes reports, matches providers and resumes without scraping completed jobs", async (t) => {
  const out = await temporary(t),
    { options, calls } = setup(out),
    input = { url: "https://yandex.uz/maps/org/123/" };
  const first = await scrapeBusiness(input, options);
  assert.equal(first.result.sources.length, 2);
  assert.equal(first.result.status, "complete");
  assert.ok(
    (
      await readFile(path.join(out, first.directoryName, "report.html"), "utf8")
    ).includes("Test Hall"),
  );
  const before = { ...calls };
  await scrapeBusiness(input, options);
  assert.deepEqual(calls, before);
  await writeFile(
    path.join(out, first.directoryName, "review.json"),
    JSON.stringify({ overrides: { description: "Reviewed description" } }),
  );
  const updated = await scrapeBusiness(input, options);
  assert.equal(updated.result.merged.description, "Reviewed description");
  assert.equal(calls.yandex, 1);
  assert.equal(calls.google, 1);
  const refreshed = await scrapeBusiness(input, { ...options, refresh: true });
  assert.equal(refreshed.result.merged.description, "Reviewed description");
  assert.equal(calls.yandex, 2);
});
test("one failing source preserves a usable partial draft and retries only failed source on resume", async (t) => {
  const out = await temporary(t),
    { options, calls } = setup(out),
    input = {
      urls: [
        "https://yandex.uz/maps/org/123/",
        "https://www.google.com/maps/place/test/",
      ],
    };
  options.scrapers.google = async () => {
    calls.google++;
    throw new Error("temporary failure");
  };
  const first = await scrapeBusiness(input, options);
  assert.equal(first.result.status, "partial");
  assert.equal(first.result.sources.length, 1);
  options.scrapers.google = async (url) => (
    calls.google++,
    makeRecord("google", url)
  );
  const resumed = await scrapeBusiness(input, options);
  assert.equal(resumed.result.status, "complete");
  assert.equal(calls.yandex, 1);
  assert.equal(calls.google, 2);
});
test("a failed fallback search does not discard already extracted candidate evidence", async (t) => {
  const out = await temporary(t),
    { options } = setup(out);
  let searches = 0;
  options.searchers.google = async () => {
    if (searches++) throw new Error("search unavailable");
    return [
      {
        ...makeRecord("google", "https://www.google.com/maps/place/test/"),
        location: null,
        phones: [],
      },
    ];
  };
  options.scrapers.google = async (url) =>
    makeRecord("google", url, { location: null, phones: [] });
  const r = await scrapeBusiness(
    { url: "https://yandex.uz/maps/org/123/" },
    options,
  );
  assert.equal(r.result.status, "partial");
  assert.equal(r.result.matches.length, 1);
  assert.equal(r.result.matches[0].accepted, false);
  assert.equal(r.result.sources.length, 1);
});
test("explicit unrelated pairs stay separate and a batch continues after invalid source errors", async (t) => {
  const out = await temporary(t),
    { options } = setup(out);
  options.scrapers.google = async (url) =>
    makeRecord("google", url, { location: { lat: 42, lng: 70 } });
  const r = await scrapeBusiness(
    {
      urls: [
        "https://yandex.uz/maps/org/123/",
        "https://www.google.com/maps/place/test/",
      ],
    },
    options,
  );
  assert.equal(r.result.sources.length, 1);
  assert.equal(r.result.matches[0].status, "rejected");
  const run = await runBatch(
    [{ url: "https://evil.test/" }, { url: "https://yandex.uz/maps/org/123/" }],
    { ...options, autoMatch: false },
  );
  assert.equal(run.jobs.length, 2);
  assert.ok(run.jobs.some((x) => x.status === "failed"));
  assert.ok(run.jobs.some((x) => x.status === "complete"));
});
test("duplicate business IDs are suppressed across batch jobs", async (t) => {
  const out = await temporary(t),
    { options } = setup(out);
  const run = await runBatch(
    [
      { name: "First", url: "https://yandex.uz/maps/org/123/" },
      { name: "Duplicate", url: "https://yandex.uz/maps/org/123/" },
    ],
    { ...options, autoMatch: false },
  );
  assert.equal(run.jobs.length, 1);
  assert.equal(run.duplicates.length, 1);
});
test("invalid manual correction files cause an explicit error instead of silently losing corrections", async (t) => {
  const out = await temporary(t),
    { options } = setup(out),
    input = { url: "https://yandex.uz/maps/org/123/" };
  const r = await scrapeBusiness(input, options);
  await writeFile(path.join(out, r.directoryName, "review.json"), "{broken");
  await assert.rejects(scrapeBusiness(input, options), /Invalid review file/);
});
