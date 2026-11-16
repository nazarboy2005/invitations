# Services administration

Open `/admin?view=services` using an administrator account with a fresh verified session. The sidebar contains **Servislar**. The dashboard uses the existing authentication, same-origin checks, write rate limit and audit history.

## Managing a profile

The list includes all existing profiles, with name/phone/address search, category and status filters, pagination, partner placement and unpublished-change indicators. **Servis qo‘shish** is the single entry point for creation: choose **Qo‘lda qo‘shish** for an empty editor or **Maps’dan import** for a collected review draft. **Import tarixi** provides access to progress and completed drafts from both the list and creation flow; it is not a separate creation tab. Edit name, permanent slug on creation, categories, description, region/district/address, coordinates, phone numbers, email, website/social links, pricing, photo descriptions, cover and photo order.

- **Qoralamani saqlash** saves a private draft. For a published profile, the previous public snapshot stays visible.
- **Nashr qilish** atomically publishes the editor's contents. A name, category, valid phone, address and at least one saved photo are required. Imported drafts also require explicit review acknowledgement. Missing descriptions and emails may remain empty.
- **Nashrdan olish** removes the public snapshot and preserves an editable draft. **Arxivlash** keeps the record in the archive; it can be edited and republished later.
- **Ko‘rib chiqish** renders the current, even unsaved draft using the public detail component in a private modal. No public preview URL is created.

Featured means an agreed Fotiha partnership, not a source-site badge. Published featured profiles sort first and display “Hamkor”. Smaller priority numbers sort first among partners; equal priorities preserve directory order. Regular new profiles append to their category. The all-services view retains its category interleaving. Saving changes to featured status does not change public placement until publication.

Slugs remain stable after creation, preserving favorites and incoming links. Revision checks reject stale edits from another tab instead of overwriting them. Browser navigation and refresh protect unsaved editor changes. Services changes appear in the existing admin audit log.

## Import review

**Servis qo‘shish → Maps’dan import** accepts a Google/Yandex business link, an optional counterpart link, or a specific business name with a search city. Choose the category and directory region; neither is inferred from a possibly ambiguous source address. The default gallery uses one provider; a mixed gallery is an explicit option. Each job saves at most eight photo candidates. The existing scraper searches the counterpart, combines accepted sources, and can inspect the listed official website's contact pages. Access challenges and missing fields remain explicit.

Jobs progress through queued, running, review, failed or cancelled. The UI polls status and shows importer availability in both the Maps form and history. If the laptop importer is offline, requests wait in the durable queue; the UI explains that the laptop program must be running with internet access. Administrators can cancel or retry. The completed job creates a private draft, never an automatic publication. Possible duplicate profiles are flagged by phone overlap or name. The review panel retains accepted sources, alternate values, match decisions, missing fields, source errors, products, separated price ranges and photo provenance. Rejected or uncertain counterpart candidates remain evidence rather than merged business content.

Observed product ranges are grouped by currency, category and unit. They are presented for review, without converting a restaurant menu or a placeholder into a wedding package price. The administrator enters the appropriate reviewed headline price in the editor; default pricing remains negotiable. Existing UZS conversion/rounding and `/ kishi` display continue to apply.

## Storage and migration

`0234_services_admin.sql` creates service profiles, media, durable import jobs and worker heartbeat storage, and adds service audit actions. `0235_services_seed.sql` preserves the approved 307 profiles, including 50 wedding halls, as both editable drafts and published snapshots in their existing order. Both migrations are additive to invitation/catalog data.

`service_listings` is the runtime source of truth once a database is configured. Directory pages, detail metadata, related profiles, the sitemap and account favorite validation all read published database snapshots. Database errors do not fall back to bundled records and accidentally resurrect removed profiles. Bundled JSON remains a development fallback only when `DATABASE_URL` is absent; snapshot import scripts must not be used to replace admin edits.

Existing packaged images remain unchanged. New uploads/imports use the configured application media storage (R2 or explicitly persistent local disk). Images are decoded, rotated, resized to 1600px maximum, stripped of metadata and stored as WebP. The image route serves a file publicly only while a published snapshot references it; other files require a fresh admin session. Responses are not cached, so removing a listing also withdraws anonymous image access. Normal visits do not scrape Maps or load remote source photos.

## Running the background worker

Scraping runs outside Next.js request lifetimes and deployments. On a persistent worker host, install the root workspace and `npm ci` plus `npm run setup:browser` inside `tools/services-scraper`. An installed Chrome/Edge channel is also supported. Share `DATABASE_URL`, admin role configuration and media-storage secrets with the web app. For local disk, both processes must use the same persistent `LOCAL_MEDIA_DIR`; the worker's default resolves to the web app's `.data/media` directory.

From the repository root:

```powershell
pnpm db:migrate
pnpm services:worker
```

The importer starts its own private local outbound proxy, pins connections to validated public IP addresses, and requires Chromium sandboxing. It does not need a separately deployed proxy or extra environment variables. The collector/browser receive a filtered environment; database/R2 secrets stay in the parent worker. After updating the worker or scraper code, stop the existing laptop importer with Ctrl+C and run `pnpm services:worker` again. These worker-only security changes do not require a Vercel deployment.

`pnpm services:worker --once` processes at most one job. Use a process supervisor for a persistent deployment; a serverless web function alone does not run this worker. `SERVICES_IMPORT_DIR` optionally chooses its private checkpoints directory; `SERVICES_SCRAPER_CHANNEL` optionally selects `chrome` or `msedge`. No paid Maps API credentials are needed.

For the on-demand laptop setup, copy the website's `PLATFORM_ADMIN_TELEGRAM_IDS` into the laptop's `apps/web/.env.local` along with the shared database and R2 settings. Restart the importer after editing its environment. An online heartbeat confirms that the process can connect, but does not confirm that its admin allowlist matches the website. Environment-based admin access is not persisted into `users.is_admin`; never work around a mismatch by disabling the worker's role checks or promoting an account in the database.

Yandex **Share** links (`/maps/-/…`) are supported. When a shared link redirects to a map-point URL containing a `ymapsbm1://org?oid=…` business identity, the scraper follows that exact business's canonical page before extraction. Bare coordinates identify a point, not a business, and cannot replace a business link.

Claims use row locks and lease tokens. Workers heartbeat every ten seconds during a job, recover stale claims after two minutes, and stop automatically recovering after three interrupted attempts. A collector has an eight-minute process timeout. Cancellation invalidates the lease and interrupts collection; a late result cannot create a draft. Lost/rejected jobs clean up their newly saved media. Workers recheck the creating administrator's active role before collecting and before committing results.

## Verification

- TypeScript and isolated production build passed.
- 22 focused Services/admin security tests and 27 scraper tests passed.
- The local HTTP integration test covers draft and media privacy, publication, public snapshot isolation, later edits, stale revision rejection, unpublishing, archiving, sitemap changes, import cancellation/retry, same-origin/session protections and durable audit entries.
- All 40 public-directory HTTP checks passed against the final production build, including the 50-hall pagination, category redirects, profiles, sitemap and immutable packaged images.
- Browser QA exercised manual creation, photo upload, partner priority, preview, save/publish, unsaved-change protection and import submission. Phone layouts were checked for document overflow.
- A fresh live Seoul import combined Google and Yandex, produced eight saved photo candidates, three products and two separate observed price groups, and flagged the existing Seoul profile as a possible duplicate. The imported copy remained private and required review. Disposable test records were removed afterward.
- A real administrator's Parvoz Yandex Share request was retried after matching the laptop admin allowlist. The share link resolved through an organization map point to the exact business page. The job reached review with Google/Yandex/website sources, eight Yandex-only photos verified in R2 and one duplicate warning; it was left private for the administrator's review. The map-point fix has parser, exact-identity and URL-validation regression coverage.

No external web application deployment is performed by this feature implementation. Deploy the web application and run the worker with their shared storage/database configuration to use the same workflow on the public site.
