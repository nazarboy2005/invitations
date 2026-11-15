# Services directory source snapshot

The initial directory is a local snapshot of the public Chorlove services pages, imported at the user's request. Public profiles and gallery files are delivered by Fotiha; viewing them does not fetch Chorlove pages, photographs, or Yandex business data.

## Import

Run from the repository root:

```powershell
node scripts/import-chorlove-services.mjs
```

The script selects up to 20 distinct published business pages in each of the 15 requested categories, following category pagination. Restaurant selection specifically prioritizes actual wedding/banquet halls on a bounded set of later category pages, because the source's first pages mostly contain caterers and the user's primary goal is hall partnerships. Other categories use their initial public results. It merges category membership when a business appears in more than one category. It uses four concurrent requests and retries transient failures or incomplete streamed loading responses. An ignored `.tmp/services-import/` checkpoint makes interrupted runs resumable. Downloaded gallery assets are also reused.

`--refresh` requests fresh detail records instead of using those checkpoints. Running the importer explicitly replaces the tracked source snapshot; do not use it as an automatic runtime refresh of subsequently edited business profiles.

`--reuse-selection` retains the exact business slugs in the last completed report, avoiding another category crawl when resuming media recovery or rebuilding local assets.

Outputs:

- `apps/web/src/modules/services/data/categories.json`: all requested discovery categories, including categories without public source listings.
- `apps/web/src/modules/services/data/listings.json`: selected public business information and local gallery paths.
- `apps/web/public/images/services/`: rotated, resized (maximum 1440 pixels per dimension), metadata-stripped WebP gallery assets with content-hash filenames.
- `docs/services/import-report.json`: source URLs, selected slugs, per-category counts, media provenance, and any failed requests.
- `docs/services/import-verification.json`: the completed snapshot's media/data integrity results and any unreferenced assets left from the initial catering selection.

The import deliberately excludes source account identifiers, owners, reviews, ratings, verification/moderation badges, featured status, view counts, and source application code. Every imported profile begins with `featured: false`; source inclusion does not establish a Fotiha partnership.

Prices preserve the source's stated currency and numeric values, with SOM normalized to the equivalent UZS currency code. They have no inferred per-guest, per-hour, per-product, or per-event unit, and have not been independently confirmed. Business-provided corrections should supersede the imported content.

## Source availability

The DJ category explicitly displays no businesses. The caravan/show-program category has 12 public profiles on its first page and five on its second page; the next page is empty. Missing source profiles are not replaced with fabricated listings or providers assigned from unrelated categories. The machine-readable report records the actual completed import counts.

## Verification

Check that all local image paths resolve to decodable files, stored dimensions match actual image dimensions, slugs are unique, category references exist, and no source account/trust fields or Chorlove URLs appear in the published dataset. Page size and navigation behavior are verified separately in the application integration.

The completed initial snapshot contains 277 profiles and 1,844 gallery entries backed by 1,839 unique WebP files (95,650,872 bytes). Thirteen categories contain 20 profiles each, caravan/show programs contains 17, and DJ contains zero. All gallery entries decoded successfully, their recorded dimensions and content-hash filenames matched the files, and the data integrity checks passed. The 20 superseded caterer directories and their 144 unreferenced files were removed after checking absolute paths and final references; the final dataset was unchanged by cleanup.

## Application integration

- `/services` mixes the categories in discovery, and `/services/[category]` filters them. “Taklifnomalar” opens `/templates` and shows the published count from the same `getCatalog()` source used by that page; its legacy services category URL redirects there and is omitted from the sitemap. Directory routes resolve the count on each request so publication changes are reflected. Search, region, and pagination live in shareable URLs; a category change resets the page. Each complete results page contains 12 profiles, with the remaining records on its last page.
- `/services/b/[slug]` displays the local gallery, description, UZS price, business contacts, and directions. The gallery supports thumbnails, a native modal, arrow keys, Escape, and focus restoration. No map SDK or business-data API is loaded by this module; Yandex opens only through the directions link.
- Profile records are bundled JSON content, not rows in the invitation database. Current profiles can be corrected in `listings.json`; the importer is an explicit snapshot replacement. `featured: true` is reserved for an agreed Fotiha partner, sorts that profile first, and displays its partner badge. No initial profile is featured.
- Desktop navigation places Servislar between Shablonlar and Bog‘lanish. Mobile navigation has Asosiy, Shablonlar, Servislar, and the account action. The top-right heart opens the existing template favorites, including when empty; it has an accessible label and no visible text.
- Service categories and profiles are included in the sitemap. Filtered result URLs are excluded from indexing in favor of their category canonical URL.

## Application verification (2026-11-15)

- `pnpm typecheck`: passed.
- `pnpm exec tsx --test tests/services.test.ts tests/favorites.test.ts tests/public-assets.test.ts`: 14 tests passed, covering pagination, filter preservation, local media, contact safety, currencies, favorites, and asset versioning.
- `pnpm exec tsx tests/services-http.integration.mts`: 37 HTTP checks passed on the development server and again against a local production server. These cover all 15 categories, 12+8 pagination, the smaller caravan category, empty DJ category, search, profiles, invalid routes, repeated query parameters, and the sitemap. The production pass also verified that an immutable versioned photo URL returns the exact saved local image bytes.
- Isolated production build (`TAKLIFNOMA_BUILD_DIST_DIR=.next-services-check`): passed, including Next.js TypeScript checks and existing static-invitation/PDF deployment checks. Build-generated TypeScript path changes were restored afterward.
- Browser QA: verified phone navigation and empty Favorites access, category switching, search submission, 12/8 pagination, real gallery images, modal arrow navigation, Escape, and focus restoration. At 320px and 390px phone widths and 901px laptop width, the document had no horizontal overflow; desktop layout was also visually reviewed at the browser's default width.

The development preview uses the existing server at `http://127.0.0.1:3001/services`. The additional production verification server was stopped afterward. No external application deployment was performed.

## Fixed backgrounds and UZS display

The responsive background uses two locally packaged generated WebP assets in `apps/web/public/images/services/backdrops/`. A fixed, non-interactive picture layer stays behind the services routes; phones select the portrait asset and use a stable large-viewport height. Desktop categories sit beside the introduction and remain sticky below the existing header, with internal scrolling for the full category list. Phones keep the horizontal categories sticky below the existing header. Navbar and favorites behavior are unchanged.

Imported numeric prices and currencies remain intact in the source snapshot. Display converts USD using `data/exchange-rate.json`: the Central Bank of Uzbekistan rate effective 14.11.2026 is 12,014.37 UZS per USD. Converted and native UZS display amounts round to the nearest 100,000 so‘m at or above 100,000 (317,848 → 300,000), nearest 10,000 below that, nearest 1,000 below 10,000, and nearest so‘m below 1,000. Ranges whose endpoints round to the same amount display one price. Unknown currencies show a request to confirm the price. The saved snapshot is read locally, with no rate API call on visits. To refresh it, retrieve the documented CBU USD endpoint in the JSON and replace the rate and effective date together. Converted prices are described as estimates in profile notes.

Background generation used the built-in image generation tool. Exact prompts and output paths are recorded in `background-prompts.md`.

## Cards and category refinement

Page and category scrollbars use 3px thumbs with transparent tracks in Chromium and thin native scrollbars in other browsers. The root canvas carries the same responsive fixed background, including the scrollbar gutter. Category links and the results heading share matching decorative icons. The sidebar slogan and partnership promotion were removed, along with the footer slogan. Cards use a shorter photo, overlapping blush information panel, circular arrow, and no category label. Names and locations allow two lines on phones. Existing navbar and favorites behavior are unchanged.

Verification: TypeScript checks, all 11 services/public-asset tests, all 37 HTTP checks on the development server, and the final isolated production build (`.next-services-polish-check`) passed. HTTP checks also compare the invitation-category count with the published catalog and verify the legacy redirect. Browser checks at 320px, 390px, and the default desktop viewport found no horizontal overflow. Category icons appear in all 16 sidebar links and the selected heading; categories stayed at 104px on desktop and 52px on phones, with the backdrop at 0px while scrolling. Clicking Taklifnomalar opened `/templates` with the same 35 published designs. Review captures are saved in `.tmp/services-card-polish/desktop.jpg` and `phone.jpg`. No external deployment was performed.

Verification of this update: typecheck, 11 services/public-asset tests, a fresh isolated production build, and all 37 HTTP checks passed. Both responsive backgrounds were fetched through production's immutable asset URLs and matched local SHA-256 hashes. The running development server still held an older versioned asset revision, so the packaged asset checks were completed against the fresh production server instead. That temporary server was stopped afterward. Browser checks confirmed the background stays at viewport top 0 while scrolling; categories stay at 104px on desktop and 52px on phones. The 320px and 390px layouts had no horizontal overflow. Navbar/favorites files were not changed for this update.

## Sticky results toolbar

The services footer is removed, and the restaurant category is displayed as “To‘yxonalar”. The category heading, search, location menu, and previous/next arrows share a compact toolbar above the cards with a 24px frosted-glass treatment. It pins at the desktop top edge and below the 66px phone category strip. The directory reuses the templates page's header-yield boundary, so upward scrolling through results does not bring the desktop navbar over the toolbar. The phone navbar also stays hidden while its category strip is pinned and returns above that area. The former bottom pagination, visible results-range row, and directory currency note are removed.

Search starts as an icon immediately left of the location filter. Opening it moves the icon to the left edge of its input, with Qidirish on the right. The heading, location filter, and pagination keep their dimensions and positions. On narrow phones the input floats below the toolbar instead of reflowing those controls. Escape closes search and restores focus without scrolling; reduced motion skips animation. The location control reuses SoftSelect with a rounded, locally styled menu, keyboard navigation, selected checkmarks, Escape, and outside-click dismissal. Choosing a location applies the form immediately, preserves the entered search, and resets pagination. Server rendering still handles filtering; the client toolbar receives only its small control props, without importing the listing dataset.

The expanded icon has a transparent background, and the explicit × button clears both its text and the applied query. Category navigation drops the search query while retaining the region. Search and region updates omit the results anchor, preserve the toolbar instance, and reserve the viewport's required document height so shorter results cannot clamp the current scroll position. Services opt into non-scrolling SoftSelect focus. Long headings fit their available width with a smaller font rather than ellipsis. The introductory statistics are removed, and the desktop category list scrolls inside the padded, clipped sidebar.

Verification of the toolbar refinement: typecheck, 11 services/public-asset tests, and all 37 development HTTP checks passed. Browser QA covers unchanged heading/filter/pager geometry when search opens, automatic region filtering, dropdown keyboard dismissal, top-edge pinning, navbar suppression during upward scrolling over cards, and responsive overflow checks. The previous toolbar production build passed before this refinement. No external deployment was performed.
