# Personalized dashboard covers

Dashboard artwork keeps the catalog's full 3:5 portrait window (480×800). It is
a static capture of the real renderer with the invitation's own content. Catalog
poster files stay unchanged; they contain sample text and cannot be personalized
by changing an image URL.

`cover-recipe.ts` defines the selected opening state. The eleven curated catalog
covers use their opened scenes, including Nahor's pot lid and Qatlam's book drag.
Anor opens to its landscape hero; Cloud Castle opens to its castle. Retained
hero covers such as Kuzgi Chinor, Ko‘zgu, Nilufar, Qog‘oz Turna, Retro Kino,
Sahifa, Somon Yo‘li and Toscana also open to the selected scene. Somon Yo‘li
captures its hero element at its recorded 540×960 viewport; Oltin Uzuk uses the
documented source hand/ring fallback at 450×800 with the competing photo rig
and locale selector hidden. Output uses the catalog's top-aligned 3:5 framing.
Other designs retain their selected opening composition, allowing automatic reveals such as
Butterfly's doors to settle. Native skip controls finish long reveals. Captures
run in the recipe's fixed viewport, wait for fonts/visible images, and freeze the result.
See `catalog-cover-captures.json` for the original curated reference captures.

The dashboard submits the actual typed invitation to `POST /api/invitation-covers`.
This supports browser-only drafts and unsaved local changes. The route does not
read invitations by ID or save/publish submitted data. An isolated Chromium
context injects the data into `/preview?template=…&cover=1`; this mode never falls
back to preview fixtures. Ordinary preview/catalog/public rendering is unchanged.

The capture context has no user cookies. It permits GETs for static template/app
assets, configured public media and Google font hosts. Other external URLs,
API calls, write requests and service workers are blocked. Private `/api/media/`
images pass through the existing endpoint with the caller's cookie, without
following redirects. Draft content never appears in query strings or public
image URLs. Responses use `private, no-store`.

The server stores WebPs outside `public/`, scoped by visual content, cover version
and the authentication session cookie. Analytics/development cookies, publication
status, revisions, audio, view counters and extra language variants do not change
the fingerprint. Default-language content and JSON keys are normalized on both
client and server. Previous-format cache entries remain readable during migration.
Identical in-flight requests share a job. At most two captures
run per process; extra callers receive a retry response. New work is limited to
24 captures per IP per minute. Cached reads do not consume that budget. The disk
cache retains at most 500 images for up to seven days; it is disposable. Browser
CacheStorage holds up to 100 content/version/account-scoped images. A bounded
memory cache retains ready object URLs across component remounts, including when
disk caching or Web Crypto is unavailable. Cached WebPs are decoded before reuse;
broken entries are deleted and fetched again. Successful images display without
waiting for browser cache writes/eviction. Displayed images remain pinned until their cards
unmount. Filters hide cards without unmounting them, so switching tabs preserves
the image DOM and performs no cache lookup, request or generation for loaded
covers. Reopening the dashboard reuses images; editing visual content changes
the key and generates a fresh cover. Offscreen cards defer requests and listing
pages run no live templates. During an edit, the previous image for that same
account/invitation/template stays visible until its replacement is ready. Network
errors and HTTP 429/500/502/503/504 get at most three attempts within an 80-second
budget. Long rate limits stop automatic retries. A separate keyboard-accessible
"Qayta urinish" button retries failed covers without opening the card's link.

## Application host setup

On Vercel, the application uses the pinned `@sparticuz/chromium` Linux x64 binary
with `playwright-core`, not a developer machine's Playwright browser install.
Next externalizes both packages and explicitly traces `@sparticuz/chromium/bin/**`
into the cover route. No runtime binary download URL or extra service is needed.
Vercel's private disk cache lives under the OS temporary directory (`/tmp`), since
the deployed application directory is read-only. It survives warm invocations only;
browser CacheStorage provides reuse across reloads and server cold starts. Read or
write failures in the disposable server cache never discard a successful capture.
Runtime cache paths opt out of source tracing so public template assets are not
accidentally bundled into the server function.

For local development or a conventional Node host, run
`pnpm --filter @taklifnoma/web exec playwright install --with-deps chromium`.
Playwright Core and Sharp are application dependencies and are externalized from
Next's server bundle; the full Playwright dependency remains available for local QA.
`APP_URL` must reach the running application from that host. Optional
`INVITATION_COVER_BROWSER_PATH` selects a managed Chromium executable;
`INVITATION_COVER_DIR` selects the private cache directory. No database migration
or catalog publication change is required. Browser imports occur inside the API's
JSON error boundary. Browser launch has a 15-second timeout and the capture browser
closes after 40 seconds, leaving room under the route's 60-second function limit.

Verification commands:

```sh
pnpm exec tsx --test tests/invitation-covers.test.ts tests/cover-runtime.test.ts
pnpm typecheck
pnpm build
# With the built app running on http://127.0.0.1:3002:
pnpm exec tsx --test tests/invitation-covers.browser.integration.ts
```

The browser integration uses synthetic API fixtures and writes no account records.
It checks cold/warm loads, filters, account isolation, edits, unavailable hashing or
storage, corrupt cached images, bounded transient retries and manual recovery.

2026-10-30 verification: all 14 focused/browser checks, typecheck and production
build passed. The cover route's deployment trace includes the Chromium binary,
Amazon Linux libraries, fonts and SwiftShader; it totals about 81.3 MiB and excludes
public template artwork. A real synthetic personalized cover returned HTTP 200
from the local production server in 11.0 seconds cold and 27 ms from its server
cache. The live Vercel endpoint was confirmed to return an empty HTTP 500 before
the repair. A separate Linux x64 smoke check launched packaged Chromium 153 with
Playwright Core and rendered Anor's real opened scene using synthetic personalized
names. External redeployment still requires access to the Vercel project.

When changing selected scenes or renderer artwork, update the recipe and bump
`COVER_VERSION` to invalidate both caches. Inspect personalized captures beside
the existing catalog images, including long names and the default language.
