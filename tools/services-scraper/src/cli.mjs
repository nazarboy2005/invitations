#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { atomicJson, readJson, unique } from "./core.mjs";
import { Fetcher } from "./network.mjs";
import { BrowserSession } from "./browser.mjs";
import { discover, inputUrls, runBatch } from "./runner.mjs";

const directory = path.dirname(fileURLToPath(import.meta.url));
const HELP = `Fotiha standalone services scraper (Node 22+)

  node src/cli.mjs scrape --url "YANDEX_OR_GOOGLE_MAPS_URL"
  node src/cli.mjs scrape --url "YANDEX_URL" --url "GOOGLE_URL"
  node src/cli.mjs scrape --query "Grand Elite" --city "Tashkent"
  node src/cli.mjs search --query "wedding halls" --city "Tashkent" --limit 30
  node src/cli.mjs batch --input output/discovery/candidates.json --limit 30

Options:
  --url URL            Repeat for an explicit pair (one URL per platform).
  --query TEXT         A business name, or a discovery query in search mode.
  --city TEXT          Search location. Default: Tashkent.
  --input FILE         JSON array of URLs/jobs, or a saved discovery file.
  --provider NAME      both (default), yandex, or google.
  --limit N            Search/batch cap, configurable beyond 20. Default: 10 search / 1 scrape.
  --max-pages N        Maximum Yandex search pages. Default: 3.
  --max-images N       Maximum downloaded gallery photos per business. Default: 8.
  --image-source NAME  mixed (default) or single: use only one provider per gallery.
  --concurrency N      Concurrent business jobs, 1–4. Default: 1.
  --delay N            Minimum HTTP interval per host in milliseconds. Default: 900.
  --timeout N          Request/navigation timeout in milliseconds. Default: 30000.
  --out DIRECTORY     Default: tools/services-scraper/output/latest.
  --refresh           Re-fetch successful source snapshots and completed jobs.
  --no-match          Collect only the supplied platform; no counterpart search.
  --confirm-match     Manually confirm an explicitly supplied pair after checking it.
  --website           Also inspect the business website for public email/social links.
  --evidence          Save source HTML/text and available browser screenshots locally.
  --channel NAME      Installed browser channel: chrome or msedge.
  --headed            Open a visible browser for manual diagnosis.
  --help              Show this help.

Successful jobs resume from disk. Partial/failed jobs retry; --refresh bypasses caches.
review.json beside result.json may contain {"overrides": {"description": "Reviewed text"}}.
Exit codes: 0 completed/review required, 1 invalid command, 2 source/job failures.
No paid Maps APIs, Fotiha database writes, or admin integration.
`;

export function parseCli(args) {
  const command = args[0] && !args[0].startsWith("-") ? args.shift() : "scrape";
  if (!["scrape", "search", "batch"].includes(command))
    throw new Error("Command must be scrape, search, or batch.");
  const { values } = parseArgs({
    args,
    strict: true,
    options: {
      url: { type: "string", multiple: true },
      query: { type: "string" },
      city: { type: "string", default: "Tashkent" },
      input: { type: "string" },
      provider: { type: "string", default: "both" },
      limit: { type: "string" },
      "max-pages": { type: "string" },
      "max-images": { type: "string" },
      "image-source": { type: "string", default: "mixed" },
      concurrency: { type: "string" },
      delay: { type: "string" },
      timeout: { type: "string" },
      out: { type: "string" },
      channel: { type: "string" },
      refresh: { type: "boolean" },
      "no-match": { type: "boolean" },
      "confirm-match": { type: "boolean" },
      website: { type: "boolean" },
      evidence: { type: "boolean" },
      headed: { type: "boolean" },
      help: { type: "boolean" },
    },
  });
  const number = (key, fallback, min, max) => {
    const n = values[key] === undefined ? fallback : Number(values[key]);
    if (!Number.isSafeInteger(n) || n < min || n > max)
      throw new Error(`--${key} must be an integer from ${min} to ${max}.`);
    return n;
  };
  if (!["both", "yandex", "google"].includes(values.provider))
    throw new Error("--provider must be both, yandex, or google.");
  if (values.channel && !["chrome", "msedge"].includes(values.channel))
    throw new Error("--channel must be chrome or msedge.");
  if (!["mixed", "single"].includes(values["image-source"]))
    throw new Error("--image-source must be mixed or single.");
  return {
    command,
    values,
    options: {
      out: path.resolve(values.out ?? path.join(directory, "../output/latest")),
      city: values.city,
      providers:
        values.provider === "both" ? ["yandex", "google"] : [values.provider],
      limit: number("limit", command === "search" ? 10 : 1, 1, 1000),
      maxPages: number("max-pages", 3, 1, 30),
      maxImages: number("max-images", 8, 0, 30),
      imageSource: values["image-source"],
      concurrency: number("concurrency", 1, 1, 4),
      delay: number("delay", 900, 250, 60000),
      timeout: number("timeout", 30000, 5000, 90000),
      autoMatch: !values["no-match"],
      confirmMatch: Boolean(values["confirm-match"]),
      refresh: Boolean(values.refresh),
      website: Boolean(values.website),
      evidence: Boolean(values.evidence),
    },
  };
}
async function main() {
  const { command, values, options } = parseCli(process.argv.slice(2));
  if (values.help) {
    console.log(HELP);
    return;
  }
  const logger = (text) => console.error(`[scraper] ${text}`);
  const browser = new BrowserSession({
    channel: values.channel,
    headed: values.headed,
    timeout: options.timeout,
  });
  const fetcher = new Fetcher({
    timeout: options.timeout,
    delay: options.delay,
    logger,
  });
  Object.assign(options, { logger, browser, fetcher });
  try {
    if (command === "search") {
      if (!values.query) throw new Error("Search requires --query.");
      const result = await discover(`${values.query} ${options.city}`, options);
      await atomicJson(path.join(options.out, "candidates.json"), {
        schemaVersion: 1,
        query: values.query,
        city: options.city,
        fetchedAt: new Date().toISOString(),
        ...result,
      });
      console.log(
        JSON.stringify(
          {
            candidates: result.candidates.length,
            errors: result.errors,
            file: path.join(options.out, "candidates.json"),
          },
          null,
          2,
        ),
      );
      if (result.errors.length || !result.candidates.length)
        process.exitCode = 2;
      return;
    }
    let inputs;
    if (values.input) {
      const input = await readJson(path.resolve(values.input));
      const list = Array.isArray(input)
        ? input
        : (input?.inputs ?? input?.candidates);
      if (!Array.isArray(list) || !list.length)
        throw new Error(
          "Input must contain a nonempty array of jobs/URLs or discovery candidates.",
        );
      inputs = list.map((item) =>
        typeof item === "string" ? { url: item } : item,
      );
      if (values.limit !== undefined) inputs = inputs.slice(0, options.limit);
    } else if (values.url?.length) inputs = [{ urls: values.url }];
    else if (values.query)
      inputs = [{ query: values.query, city: options.city }];
    else
      throw new Error(
        "Supply --url, --query, or --input. Use --help for examples.",
      );
    for (const input of inputs) {
      if (!input || typeof input !== "object" || Array.isArray(input))
        throw new Error("Each batch item must be a URL or job object.");
      if (
        !input.query &&
        !input.url &&
        !input.urls?.length &&
        !input.yandexUrl &&
        !input.googleUrl
      )
        throw new Error("A batch item needs a URL or query.");
      inputUrls(input);
    }
    inputs = unique(inputs, (item) => JSON.stringify(item));
    if (
      options.confirmMatch &&
      inputs.some((input) => inputUrls(input).size !== 2)
    )
      throw new Error(
        "--confirm-match requires an explicit Google/Yandex URL pair for every job.",
      );
    const run = await runBatch(inputs, options);
    console.log(
      JSON.stringify(
        {
          jobs: run.jobs.length,
          statuses: run.jobs.reduce(
            (acc, x) => ((acc[x.status] = (acc[x.status] ?? 0) + 1), acc),
            {},
          ),
          report: path.join(options.out, "report.html"),
        },
        null,
        2,
      ),
    );
    if (run.jobs.some((x) => ["failed", "partial"].includes(x.status)))
      process.exitCode = 2;
  } finally {
    await browser.close();
  }
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
