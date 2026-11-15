# Standalone services scraper

Collects public Google Maps and Yandex Maps business information into local review drafts. It has its own npm dependencies and does not participate in Fotiha's web build. It does not write to the application database or publish services.

## Setup

Requires Node.js 22 or newer. From this directory:

```powershell
npm ci
npm run setup:browser
```

An installed Chrome or Edge can be used instead of downloading Chromium: pass `--channel chrome` or `--channel msedge`. Each run uses a fresh isolated browser context. It does not read your personal browser profile or sign into accounts. No Maps API key or paid scraper account is required.

## Import a business

```powershell
npm run scrape -- --url "https://yandex.uz/maps/org/versal/178096015422/" --city Tashkent --evidence
```

Start from Google instead:

```powershell
npm run scrape -- batch --input examples/google-first.json --out output/google-first --evidence
```

Give both URLs when you already know the pair:

```powershell
npm run scrape -- --url "YANDEX_BUSINESS_URL" --url "GOOGLE_BUSINESS_URL" --out output/paired
```

The scraper still checks the pair. Use `--confirm-match` only after manually confirming an uncertain pair is the same location. `--no-match` disables counterpart search. Full business links and supported Maps sharing links are accepted; generic map pins may not identify a business.

## Search by name or discover businesses

```powershell
npm run scrape -- --query "Grand Elite" --city Tashkent --out output/grand-elite
npm run scrape -- search --query "wedding halls" --city Tashkent --limit 40 --out output/discovery
npm run scrape -- batch --input output/discovery/candidates.json --limit 40 --out output/halls
```

A name import requires a sufficiently distinct name candidate; ambiguous names produce a review draft with candidates instead of choosing an arbitrary branch. Broad queries belong in `search` mode. Discovery returns candidates, not a certified list of wedding halls: category suitability still needs review.

`--limit` caps total discovery candidates or an explicitly limited batch; it is not hard-coded to 20. Google results are scrolled within a bounded budget. Yandex page requests stop when no new IDs appear. Public search may repeat, rank, or cap its results, so a larger limit does **not** guarantee exhaustive coverage. Narrow queries by district or name for additional candidates. `--max-pages` sets the Yandex page budget. `--provider yandex`, `google`, or `both` controls discovery and counterpart searches.

## Batches and recovery

Batch JSON accepts an array of URLs or job objects:

```json
[
  {
    "name": "Example hall",
    "url": "https://yandex.uz/maps/org/123/",
    "city": "Tashkent"
  },
  { "query": "Another Hall", "city": "Samarkand" },
  {
    "yandexUrl": "YANDEX_URL",
    "googleUrl": "GOOGLE_URL",
    "confirmedPair": false
  }
]
```

Use `--concurrency 1` (default) to keep load low; the supported range is 1–4. `--delay 900` controls HTTP spacing per host. Transient HTTP failures are retried with backoff. Source failures remain explicit and do not discard another source's successful data.

Re-run the same command and output directory to resume. Successful source extractions and downloaded media have independent checkpoints; completed jobs with valid images are reused. Failed/partial jobs retry. `--refresh` bypasses extraction snapshots while preserving `review.json` corrections and valid downloaded image files. Same source IDs found through different batch inputs are suppressed in the run index, with duplicate jobs recorded in `run.json`.

## What gets collected

- Business name, address, actual place coordinates where exposed, categories, hours, phone numbers, website and social links, and explicit public email links.
- Available description text, without manufacturing it from addresses, customer reviews, or missing data.
- A bounded gallery from both providers (`--max-images 8` by default). Images are decoded, rotated, resized to a maximum of 1440 pixels per dimension, stripped of metadata, and saved as WebP. Exact duplicates are removed; likely visual duplicates remain flagged for human review.
- For a gallery from only one provider, pass `--image-source single`. This prefers the provider with more available photo candidates and falls back to the other provider only if every attempted image from the first fails. A partially filled gallery stays with its selected provider. Text/contact information still combines both providers; `media.selection` records the photo policy and chosen provider.
- Source galleries may include personal or unrelated uploads. Saved images are candidates for review, not an automatically approved selection of venue photographs.
- Available product names, descriptions, numeric prices, currencies, and explicit units. Yandex menu pages are followed only when advertised by the business page. Ranges are grouped by currency, unit, and product category and always marked `observed_items_only` and `needsReview`.
- Field provenance, alternate values, conflicts, rejected business matches, missing fields, and source-access warnings.

Optional `--website` follows the listed business website's homepage and at most two same-site contact/about pages for public email and social links. It does not guess email addresses or crawl social profiles. Maps/contact links are validated, redirects are checked, local/private addresses are rejected, and downloads have size limits. Access challenges produce errors rather than attempts to bypass them.

## Matching and review

Counterpart discovery tries the business name/city and, if necessary, a listed phone. Matching uses phone overlap, distance, name similarity, transliteration, and website evidence. Small spelling/spacing differences are tolerated. A name alone does not confirm identity, and a shared phone does not override a distant branch. Ambiguous matches remain separate candidates. A manually supplied pair is not silently merged when those checks fail.

Each business directory may contain a `review.json` file:

```json
{
  "overrides": {
    "name": "Reviewed business name",
    "description": "Business-approved description."
  }
}
```

Re-run to apply corrections. Supported override fields are `name`, `address`, `description`, `phones`, `links`, `emails`, `hours`, `categories`, and `location`. Invalid correction files fail explicitly. Price/gallery selection is currently a JSON/report review step; there is no admin editor in this standalone tool.

## Outputs

Default directory: `output/latest/`. Generated content is ignored by Git.

| File                           | Purpose                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| `report.html`                  | Batch overview; open locally in a browser                        |
| `run.json`                     | Job results, statuses, and duplicate jobs                        |
| `<business>/report.html`       | Details, local gallery, products, conflicts, provenance          |
| `<business>/result.json`       | Combined draft, source records, candidates, warnings/errors      |
| `<business>/sources/*.json`    | Successful source checkpoints                                    |
| `<business>/.media-cache.json` | Per-image download checkpoints                                   |
| `<business>/images/*.webp`     | Saved gallery; use `media.images` in result JSON for these files |
| `<business>/evidence/*`        | Optional HTML, rendered text, and browser screenshots            |

`merged.images` contains remote candidates; `media.images` contains the successfully saved files. `complete` means the collection job completed, **not** that every requested field exists. Every merged result has `reviewRequired: true`. Other statuses are `needs_review`, `partial`, and `failed`. Exit codes are 0 for complete/review results, 1 for invalid commands, and 2 for source/job failures.

## Verification and current limits

```powershell
npm test
node src/verify.mjs output/halls-validation
```

See [VALIDATION.md](VALIDATION.md) for the initial live results and [BATCH_30_VALIDATION.md](BATCH_30_VALIDATION.md) for the additional 30 halls, selected galleries and observed wedding offers. Google can return a limited anonymous view with only basic details and very few photos. Description, email, and product extraction cannot be promised for every business; empty fields remain empty. Google description/product handling has synthetic fixture coverage but did not recover those fields in the live hall tests. Yandex exposed real hall rental/per-guest offers and restaurant menu items in the larger batch. Food prices remain separate from wedding packages. Possible 1-so‘m placeholders stay visible in product evidence but are flagged and excluded from derived price ranges.

No source runtime, analytics, reviews, verification badges, or reputation metrics are copied into Fotiha listing data. Later admin integration should call the exported runner, keep drafts private, and map reviewed content/media to the shared services contract; it requires separate authorization.
