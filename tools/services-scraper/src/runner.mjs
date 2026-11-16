import path from "node:path";
import { mkdir } from "node:fs/promises";
import { atomicJson, hash, readJson, slug, unique } from "./core.mjs";
import { providerForUrl, validateMapsUrl } from "./network.mjs";
import { scrapeYandex, searchYandex } from "./yandex.mjs";
import { scrapeGoogle, searchGoogle } from "./google.mjs";
import { combineSources, matchBusinesses, nameSimilarity } from "./merge.mjs";
import { downloadMedia, verifyMedia } from "./media.mjs";
import { writeBusinessReport, writeRunReport } from "./report.mjs";
import { readOverrides } from "./review.mjs";
import { normalizeContactLinks } from "./contacts.mjs";

const CONTACT_POLICY_VERSION = 1;

export const searchProvider = (provider, query, options) =>
  (
    options.searchers?.[provider] ??
    (provider === "yandex" ? searchYandex : searchGoogle)
  )(query, options);
export async function discover(query, options) {
  const result = [],
    errors = [],
    groups = [];
  for (const provider of options.providers) {
    try {
      groups.push(await searchProvider(provider, query, options));
    } catch (error) {
      errors.push({ stage: `${provider}_search`, error: error.message });
    }
  }
  while (groups.some((x) => x.length))
    for (const group of groups) if (group.length) result.push(group.shift());
  return {
    candidates: unique(result, (x) => `${x.provider}:${x.id ?? x.url}`).slice(
      0,
      options.limit,
    ),
    errors,
  };
}
export function inputUrls(input) {
  const urls = [
    input.url,
    input.yandexUrl,
    input.googleUrl,
    ...(input.urls ?? []),
  ]
    .filter(Boolean)
    .map(validateMapsUrl);
  const byProvider = new Map();
  for (const url of urls) {
    const provider = providerForUrl(url);
    if (byProvider.has(provider) && byProvider.get(provider) !== url)
      throw new Error(
        "Provide at most one URL per platform for each business.",
      );
    byProvider.set(provider, url);
  }
  return byProvider;
}
export async function scrapeBusiness(input, options) {
  const key = hash(
    JSON.stringify({
      input,
      maxImages: options.maxImages,
      imageSource: options.imageSource ?? "mixed",
      autoMatch: options.autoMatch,
      website: options.website,
    }),
  ).slice(0, 12);
  const directoryName = `${slug(input.name || input.query || "business")}-${key}`;
  const directory = path.join(options.out, directoryName),
    existing = await readJson(path.join(directory, "result.json"));
  const overrides = await readOverrides(path.join(directory, "review.json"));
  const overridesHash = hash(JSON.stringify(overrides));
  if (
    existing &&
    existing.contactPolicyVersion === CONTACT_POLICY_VERSION &&
    existing.overridesHash === overridesHash &&
    !options.refresh &&
    ["complete", "needs_review"].includes(existing.status)
  ) {
    try {
      await verifyMedia(directory, existing.media.images);
      options.logger(`Resume: ${existing.merged.name}`);
      return { result: existing, directoryName };
    } catch {
      options.logger(
        "A saved image is missing or invalid; resuming this business.",
      );
    }
  }
  await mkdir(path.join(directory, "sources"), { recursive: true });
  const urls = inputUrls(input),
    sources = [],
    candidates = [],
    errors = [],
    matches = [];
  const context = {
    ...options,
    evidenceDir: options.evidence
      ? path.join(directory, "evidence")
      : undefined,
  };
  const extract = async (provider, url) => {
    const cacheFile = path.join(
      directory,
      "sources",
      `${provider}-${hash(url).slice(0, 12)}.json`,
    );
    const cached = !options.refresh && (await readJson(cacheFile));
    if (cached?.name && cached.url)
      return { ...cached, links: normalizeContactLinks(cached.links) };
    const record = await (
      options.scrapers?.[provider] ??
      (provider === "yandex" ? scrapeYandex : scrapeGoogle)
    )(url, context);
    record.links = normalizeContactLinks(record.links);
    await atomicJson(cacheFile, record);
    return record;
  };
  for (const [provider, url] of urls) {
    try {
      sources.push(await extract(provider, url));
    } catch (error) {
      errors.push({ stage: `${provider}_detail`, url, error: error.message });
    }
  }
  if (!sources.length && !urls.size && input.query) {
    const query = [input.query, input.city ?? options.city]
      .filter(Boolean)
      .join(" ");
    const found = await discover(query, { ...options, limit: 5 });
    candidates.push(...found.candidates);
    errors.push(...found.errors);
    // Query imports require a unique name match. Broad category search belongs in search/batch mode.
    const ranked = found.candidates
      .map((c) => ({
        candidate: c,
        match: matchBusinesses(
          { name: input.query, phones: [], location: null },
          c,
        ),
      }))
      .sort((a, b) => b.match.similarity - a.match.similarity);
    const first = ranked[0];
    const sameProviderRunnerUp = ranked.find(
      (x) =>
        x.candidate.provider === first?.candidate.provider &&
        x.candidate.url !== first?.candidate.url,
    );
    if (
      first &&
      first.match.similarity >= 0.5 &&
      (!sameProviderRunnerUp ||
        first.match.similarity - sameProviderRunnerUp.match.similarity >= 0.25)
    ) {
      try {
        sources.push(
          await extract(first.candidate.provider, first.candidate.url),
        );
      } catch (error) {
        errors.push({
          stage: `${first.candidate.provider}_detail`,
          error: error.message,
        });
      }
    } else
      errors.push({
        stage: "query_match",
        error:
          "No unique name match. Review candidates and import a specific URL.",
      });
  }
  const anchor = sources[0];
  if (anchor && options.autoMatch && sources.length === 1) {
    const other = anchor.provider === "yandex" ? "google" : "yandex";
    if (options.providers.includes(other) && !urls.has(other)) {
      try {
        const evaluated = [];
        const queryName =
          input.name && nameSimilarity(input.name, anchor.name) >= 0.5
            ? input.name
            : anchor.name;
        const queries = [
          `${queryName} ${input.city ?? options.city}`,
          ...(anchor.phones[0] ? [anchor.phones[0]] : []),
        ];
        const seenCandidates = new Set();
        for (const query of queries) {
          let found;
          try {
            found = await searchProvider(other, query, {
              ...context,
              limit: 3,
            });
          } catch (error) {
            errors.push({
              stage: `${other}_search`,
              query,
              error: error.message,
            });
            continue;
          }
          candidates.push(...found);
          for (const candidate of found.slice(0, 3)) {
            if (seenCandidates.has(candidate.id ?? candidate.url)) continue;
            seenCandidates.add(candidate.id ?? candidate.url);
            const earlyMatch = matchBusinesses(anchor, candidate);
            if (
              earlyMatch.status === "rejected" &&
              earlyMatch.distanceMeters > 1000
            ) {
              evaluated.push({ record: candidate, match: earlyMatch });
              continue;
            }
            try {
              const record = await extract(other, candidate.url),
                match = matchBusinesses(anchor, record);
              evaluated.push({ record, match });
            } catch (error) {
              errors.push({
                stage: `${other}_candidate`,
                url: candidate.url,
                error: error.message,
              });
            }
          }
          if (evaluated.some((x) => x.match.status === "matched")) break;
        }
        evaluated.sort((a, b) => b.match.score - a.match.score);
        const eligible = evaluated.filter((x) => x.match.status === "matched");
        const ambiguous =
          eligible.length > 1 &&
          eligible[0].match.score - eligible[1].match.score < 15;
        for (const { record, match } of evaluated)
          matches.push({
            provider: other,
            url: record.url,
            name: record.name,
            ...match,
            accepted:
              match.status === "matched" &&
              !ambiguous &&
              record === eligible[0]?.record,
          });
        if (eligible.length && !ambiguous) sources.push(eligible[0].record);
      } catch (error) {
        errors.push({ stage: `${other}_search`, error: error.message });
      }
    }
  }
  if (sources.length > 1 && !matches.length) {
    const match = matchBusinesses(sources[0], sources[1]);
    const confirmed = Boolean(input.confirmedPair || options.confirmMatch);
    matches.push({
      ...match,
      accepted: match.status === "matched" || confirmed,
      manuallyConfirmed: confirmed,
      provider: sources[1].provider,
      url: sources[1].url,
    });
    if (match.status !== "matched" && !confirmed) {
      candidates.push(sources.pop());
    }
  }
  if (options.website && sources.length) {
    try {
      const { enrichWebsite } = await import("./website.mjs");
      for (const source of [...sources]) {
        const website = source.links.find((x) => x.type === "website");
        if (website) {
          const extra = await enrichWebsite(website.url, context);
          sources.push(extra);
          break;
        }
      }
    } catch (error) {
      errors.push({ stage: "website_contacts", error: error.message });
    }
  }
  const merged = combineSources(sources, { overrides });
  const media = await downloadMedia(merged.images, {
    fetcher: options.fetcher,
    directory,
    limit: options.maxImages,
    imageSource: options.imageSource,
    logger: options.logger,
  });
  await verifyMedia(directory, media.images);
  const needsMatchReview =
    matches.some((x) => !x.accepted && x.status !== "rejected") ||
    (!sources.length && candidates.length > 0);
  const result = {
    schemaVersion: 1,
    contactPolicyVersion: CONTACT_POLICY_VERSION,
    input,
    overridesHash,
    completedAt: new Date().toISOString(),
    status: !sources.length
      ? candidates.length
        ? "needs_review"
        : "failed"
      : errors.length || media.errors.length
        ? "partial"
        : needsMatchReview
          ? "needs_review"
          : "complete",
    sources,
    candidates: unique(candidates, (x) => `${x.provider}:${x.id ?? x.url}`),
    matches,
    merged,
    media,
    errors,
  };
  await atomicJson(path.join(directory, "result.json"), result);
  await writeBusinessReport(directory, result);
  return { result, directoryName };
}
export async function runBatch(inputs, options) {
  await mkdir(options.out, { recursive: true });
  const run = {
    schemaVersion: 1,
    startedAt: new Date().toISOString(),
    updatedAt: null,
    jobs: [],
    duplicates: [],
  };
  const seenSources = new Map();
  let cursor = 0;
  const save = async () => {
    run.updatedAt = new Date().toISOString();
    await atomicJson(path.join(options.out, "run.json"), run);
    await writeRunReport(options.out, run);
  };
  // Serialize report writes while independent jobs run concurrently.
  let saves = Promise.resolve();
  await Promise.all(
    Array.from(
      { length: Math.min(options.concurrency, inputs.length) },
      async () => {
        while (cursor < inputs.length) {
          const input = inputs[cursor++];
          try {
            const { result, directoryName } = await scrapeBusiness(
              input,
              options,
            );
            const identities = result.sources
              .filter((x) => x.provider !== "website")
              .map((x) => `${x.provider}:${x.id ?? x.url}`);
            const duplicate = identities
              .map((x) => seenSources.get(x))
              .find(Boolean);
            if (duplicate)
              run.duplicates.push({
                input,
                directory: directoryName,
                duplicateOf: duplicate,
              });
            else {
              for (const identity of identities)
                seenSources.set(identity, directoryName);
              run.jobs.push({
                input,
                name: result.merged.name,
                directory: directoryName,
                status: result.status,
                photos: result.media.images.length,
                products: result.merged.products.length,
                providers: result.sources.map((x) => x.provider),
              });
            }
          } catch (error) {
            run.jobs.push({
              input,
              status: "failed",
              directory: "",
              error: error.message,
            });
            options.logger(`Failed: ${error.message}`);
          }
          saves = saves.then(save);
          await saves;
        }
      },
    ),
  );
  await saves;
  await save();
  return run;
}
