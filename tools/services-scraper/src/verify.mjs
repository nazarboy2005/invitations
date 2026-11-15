import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { readJson, atomicJson } from "./core.mjs";
import { verifyMedia } from "./media.mjs";

export async function verifyRun(output) {
  const root = path.resolve(output),
    run = await readJson(path.join(root, "run.json"));
  assert.ok(run?.jobs?.length, "No batch run found.");
  const summary = {
    checkedAt: new Date().toISOString(),
    businesses: 0,
    mergedSources: 0,
    savedImages: 0,
    products: 0,
    needsReview: 0,
    partial: 0,
    missingDescriptions: 0,
    missingEmails: 0,
  };
  for (const job of run.jobs) {
    assert.ok(job.directory, `Job has no result: ${job.error}`);
    const directory = path.resolve(root, job.directory);
    assert.ok(directory.startsWith(root + path.sep), "Invalid job directory.");
    const result = await readJson(path.join(directory, "result.json"));
    assert.equal(result.schemaVersion, 1);
    assert.ok(
      result.merged.reviewRequired,
      "A scraped listing must remain a review draft.",
    );
    for (const key of ["name", "address", "description", "hours"])
      assert.equal(typeof result.merged[key], "string", key);
    if (result.sources.length) assert.ok(result.merged.name);
    for (const number of result.merged.phones)
      assert.match(number, /^\+\d{7,15}$/);
    for (const source of result.sources)
      if (source.location) {
        assert.ok(Math.abs(source.location.lat) <= 90);
        assert.ok(Math.abs(source.location.lng) <= 180);
      }
    for (const range of result.merged.priceRanges) {
      assert.ok(range.min > 0 && range.max >= range.min);
      assert.equal(range.needsReview, true);
      assert.equal(range.coverage, "observed_items_only");
    }
    assert.equal(result.media.images.length, job.photos);
    if (result.media.selection?.policy === "single") {
      const providers = [
        ...new Set(result.media.images.map((image) => image.source)),
      ];
      assert.ok(
        providers.length <= 1,
        "A single-source gallery contains mixed providers.",
      );
      assert.equal(result.media.selection.source, providers[0] ?? null);
    }
    assert.equal(result.merged.products.length, job.products);
    await verifyMedia(directory, result.media.images);
    summary.businesses++;
    summary.mergedSources += result.sources.length;
    summary.savedImages += result.media.images.length;
    summary.products += result.merged.products.length;
    if (result.status === "needs_review") summary.needsReview++;
    if (result.status === "partial") summary.partial++;
    if (!result.merged.description) summary.missingDescriptions++;
    if (!result.merged.emails.length) summary.missingEmails++;
  }
  await atomicJson(path.join(root, "verification.json"), summary);
  return summary;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  verifyRun(process.argv[2] ?? "output/latest")
    .then((value) => console.log(JSON.stringify(value, null, 2)))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
