import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { mkdtemp, mkdir, rm, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { publicIp, validateMapsUrl, assertPublicUrl } from "../src/network.mjs";
import { downloadMedia, verifyMedia } from "../src/media.mjs";
import { parseCli } from "../src/cli.mjs";
import { writeBusinessReport } from "../src/report.mjs";
import { sourceRecord } from "../src/core.mjs";
import { combineSources } from "../src/merge.mjs";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../output/tests",
);
async function temporary(t) {
  await mkdir(root, { recursive: true });
  const directory = await mkdtemp(path.join(root, "case-"));
  t.after(async () => {
    assert.ok(path.resolve(directory).startsWith(root + path.sep));
    await rm(directory, { recursive: true, force: true });
  });
  return directory;
}
test("URL checks reject credentialed, non-Maps, private and local network targets", async () => {
  for (const value of [
    "file:///C:/secret",
    "https://user:password@yandex.uz/maps/",
    "https://evil.test/maps/",
    "http://127.0.0.1/maps/",
    "https://yandex.uz.evil.test/maps/",
  ])
    assert.throws(() => validateMapsUrl(value));
  assert.equal(
    validateMapsUrl("https://maps.app.goo.gl/test"),
    "https://maps.app.goo.gl/test",
  );
  for (const ip of [
    "127.0.0.1",
    "10.0.0.1",
    "172.16.0.1",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "::1",
    "0:0:0:0:0:0:0:1",
    "::ffff:127.0.0.1",
    "fc00::1",
    "fe80::1",
  ])
    assert.equal(publicIp(ip), false, ip);
  assert.equal(publicIp("8.8.8.8"), true);
  assert.equal(publicIp("2606:4700:4700::1111"), true);
  await assert.rejects(assertPublicUrl("http://127.0.0.1/"), /Private/);
  await assert.rejects(
    assertPublicUrl("https://example.com/image.jpg", { image: true }),
    /expected Maps/,
  );
});
test("CLI accepts batch sizes above twenty but rejects unbounded/invalid settings", () => {
  assert.equal(
    parseCli(["search", "--query", "halls", "--limit", "35"]).options.limit,
    35,
  );
  for (const args of [
    ["--concurrency", "8"],
    ["--limit", "NaN"],
    ["--max-images", "-1"],
    ["--provider", "other"],
  ])
    assert.throws(() => parseCli(args));
});
test("media validates files, removes exact duplicates, and retains near matches for review", async (t) => {
  const directory = await temporary(t),
    red = await sharp({
      create: { width: 240, height: 200, channels: 3, background: "#ff0000" },
    })
      .png()
      .toBuffer(),
    blue = await sharp({
      create: { width: 240, height: 200, channels: 3, background: "#0000ff" },
    })
      .png()
      .toBuffer();
  const fetcher = {
    get: async (url) => ({
      bytes: url.endsWith("blue")
        ? blue
        : url.endsWith("bad")
          ? Buffer.from("not an image")
          : red,
      contentType: "image/png",
    }),
  };
  const candidates = ["red", "red-copy", "blue", "bad"].map((x) => ({
    url: `https://lh3.googleusercontent.com/${x}`,
    source: "google",
    alt: x,
  }));
  const result = await downloadMedia(candidates, {
    fetcher,
    directory,
    limit: 4,
  });
  assert.equal(result.images.length, 2);
  assert.equal(result.duplicates.length, 1);
  assert.equal(result.errors.length, 1);
  assert.ok(result.images[1].possibleDuplicateOf);
  await verifyMedia(directory, result.images);
  let requests = 0;
  const resumed = await downloadMedia(candidates, {
    fetcher: {
      get: async (url) => {
        requests++;
        return fetcher.get(url);
      },
    },
    directory,
    limit: 4,
  });
  assert.equal(resumed.images.length, 2);
  assert.equal(
    requests,
    1,
    "Only the previous invalid-image request is retried.",
  );
});
test("single-source galleries prefer more candidates and never fill remaining slots from another provider", async (t) => {
  const directory = await temporary(t);
  const bytes = await sharp({
    create: { width: 240, height: 200, channels: 3, background: "red" },
  })
    .png()
    .toBuffer();
  const calls = [];
  const candidates = [
    { source: "google", url: "https://lh3.googleusercontent.com/good" },
    { source: "yandex", url: "https://avatars.mds.yandex.net/good" },
    { source: "yandex", url: "https://avatars.mds.yandex.net/bad" },
  ];
  const fetcher = {
    get: async (url) => {
      calls.push(url);
      if (url.endsWith("bad")) throw new Error("unavailable");
      return { bytes, contentType: "image/png" };
    },
  };
  const result = await downloadMedia(candidates, {
    directory,
    fetcher,
    imageSource: "single",
    limit: 6,
  });
  assert.equal(result.images.length, 1);
  assert.equal(result.selection.source, "yandex");
  assert.ok(calls.every((x) => x.includes("yandex")));
  await verifyMedia(directory, result.images);
  const fallback = await downloadMedia(
    candidates.map((x) =>
      x.source === "yandex" ? { ...x, url: x.url + "bad" } : x,
    ),
    { directory, fetcher, imageSource: "single", limit: 6 },
  );
  assert.equal(fallback.images.length, 1);
  assert.equal(fallback.selection.source, "google");
  assert.deepEqual(
    [...new Set(fallback.images.map((x) => x.source))],
    ["google"],
  );
  assert.equal(
    parseCli(["--image-source", "single"]).options.imageSource,
    "single",
  );
  assert.throws(() => parseCli(["--image-source", "other"]));
});

test("HTML review report escapes scraped text and does not execute it", async (t) => {
  const directory = await temporary(t),
    source = {
      ...sourceRecord("yandex", "https://yandex.uz/maps/"),
      name: "<script>alert(1)</script>",
    };
  await writeBusinessReport(directory, {
    input: {},
    status: "complete",
    completedAt: "test",
    sources: [source],
    matches: [],
    errors: [],
    candidates: [],
    merged: combineSources([source]),
    media: { images: [], duplicates: [], errors: [] },
  });
  const report = await readFile(path.join(directory, "report.html"), "utf8");
  assert.ok(report.includes("&lt;script&gt;"));
  assert.ok(!report.includes("<script>"));
});
