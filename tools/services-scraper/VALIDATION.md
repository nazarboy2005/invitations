# Validation — 2026-11-15

The standalone tool was exercised against actual public pages from this machine, with no Maps API key, paid scraper, personal browser profile, database import, or admin integration.

## Live wedding-hall batch

Command, from `tools/services-scraper`:

```powershell
node src/cli.mjs batch --input examples/validation.json --out output/halls-validation --evidence --max-images 6 --channel chrome
node src/verify.mjs output/halls-validation
```

| Hall             | Sources accepted into draft | Saved images | Outcome                                                                                   |
| ---------------- | --------------------------- | -----------: | ----------------------------------------------------------------------------------------- |
| Versal           | Yandex + Google             |            6 | Same-name business about 7.9 km away rejected during testing                              |
| Grand Elite      | Yandex + Google             |            2 | Google spelling `Grantelite` matched using name similarity and a 27 m location difference |
| Yakka Saroy      | Yandex + Google             |            6 | Alternate name/transliteration and shared phone/site matched                              |
| Meros Event Hall | Yandex + Google             |            6 | Correct hall matched about 6 m away; other Meros businesses rejected                      |
| Osiyo Grand      | Yandex only                 |            6 | Google result lacked enough corroborating identity evidence; retained for review          |

Totals: **5 businesses, 9 accepted source records, 26 saved images, 4 completed collection jobs and 1 requiring match review**. A job marked complete still requires content review.

All five yielded basic business information and photos. Available phones and social/site links were retained with source records. **None of the five yielded a usable business description, email address, or product catalog in the tested anonymous sessions.** Those fields remain explicitly missing. Google displayed a limited anonymous view, often exposing only one photo. The description/product parser's synthetic fixture tests do not establish that those fields are currently recoverable from live Google pages.

This is a working collector, not a guarantee of complete or publication-ready listings. Visual QA of the saved galleries found personal/unrelated-looking source uploads, particularly in the Meros gallery. Photos must be selected/reviewed; technical image validation and identity matching do not prove that every uploaded photograph depicts the business.

For the later 30-hall expansion test, including real wedding offers, gallery screening and recovered source timeouts, see [BATCH_30_VALIDATION.md](BATCH_30_VALIDATION.md).

## Google-first import

```powershell
node src/cli.mjs batch --input examples/google-first.json --out output/google-first-validation --evidence --max-images 4 --channel chrome
node src/verify.mjs output/google-first-validation
```

Starting from Meros's Google CID link successfully located the corresponding Yandex listing, accepted both source records, and saved four images. Stable CID links are useful when a manually shortened `data=!…` URL loses required Google path segments.

## Positive product-price control

```powershell
node src/cli.mjs batch --input examples/price-control.json --out output/price-control --provider yandex --no-match --max-images 3 --evidence
node src/verify.mjs output/price-control
```

Safia is a **pastry business, not a wedding hall**, included specifically because its public Yandex menu exposes real structured products. The tool collected **38 products**, their names/descriptions, numeric prices, and UZS currency; the raw observed amounts range from **7,500 to 448,000 UZS**. Products are grouped into their original six categories when deriving ranges. These amounts are not hall prices, and no unit or complete business price range was inferred.

The seven-item circular-cake group is retained under `Круглые торты` rather than the overlapping popular-items grouping. All ranges carry `needsReview: true` and `coverage: observed_items_only`.

## Discovery

```powershell
node src/cli.mjs search --query "wedding halls" --city Tashkent --provider yandex --limit 30 --max-pages 3 --out output/discovery-validation
node src/cli.mjs search --query "wedding halls" --city Tashkent --provider google --limit 5 --out output/google-search-validation --channel chrome
```

- Yandex returned **25 distinct business IDs** with no errors. The next page repeated results, and collection stopped rather than looping. This confirms discovery beyond the original twenty-entry seed, not exhaustive coverage of all halls.
- Google discovery returned **5 candidates** with no errors.
- Name-based import was exercised with `Grand Elite` in the hall batch.
- Search results need category/branch review. No discovered candidates were added to the public directory.

## Automated and visual checks

`npm test` passes **22 tests** covering actual narrowed public-page fixtures, separately labelled synthetic fields, currency parsing, explicit units, wrong-branch rejection, transliteration/spelling, conflicts/provenance, manual overrides, failed-source recovery, checkpoint reuse, duplicate jobs, local/private URL rejection, image integrity/duplicates, and HTML escaping.

The verifier decoded and hashed every saved output image and checked dimensions, prices, phone shapes, source coordinates, report counts, and review flags. The local batch report and selected Versal, Grand Elite, and Meros galleries were rendered and visually inspected. No broken gallery images were found; the business report had no horizontal overflow at 390 px viewport width.

Live artifacts, source evidence, `verification.json`, HTML reports, and screenshots remain under the Git-ignored `output/` directories. The fixture HTML contains narrowed public fields only, without copying source application runtimes or analytics.

## Remaining boundaries

- No claim of successful live Google description, email, or product extraction from these five halls.
- No claim that source galleries or discovered businesses are editorially suitable for publication.
- No exhaustive city-wide search guarantee; query ranking and result caps remain source-dependent.
- The optional website contact enrichment is bounded and separately opt-in; it was not needed to claim a successful email recovery in this validation.
- Access challenges and missing fields are reported. Nothing attempts to bypass verification or manufacture missing information.
- Admin integration and public directory expansion remain separate user-authorized tasks.
