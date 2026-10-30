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
Browser-only drafts and unsaved draft changes render transiently: the server
does not write draft screenshots to disk or persistent storage. Their browser
thumbnail identity contains the invitation, names, design and default language.
Date, venue, text and other draft edits reuse that thumbnail. A name/design/language
change replaces it; after the replacement succeeds, the previous browser cache
entry and unused object URL are removed. While replacement is pending, the old
image stays visible. Clearing the browser cache requires a fresh draft capture.

Published requests use the authenticated owner's canonical database record,
never client-supplied published content. After publication commits, publication,
checkout, payment refresh and webhook handlers immediately schedule cover
preparation with Next's `after`; reconciliation and published edits do the same.
Preparation calls the cover function with an expiring HMAC signature bound to
the invitation ID, so other functions do not bundle Chromium. The cover endpoint
verifies that signature and loads a still-published record before capturing.
Failed/busy preparation remains recoverable through the normal dashboard path;
publication itself does not wait for screenshot generation. No invitation
records are saved or published by the cover endpoint. An isolated Chromium
context injects the data into `/preview?template=…&cover=1`; this mode never falls
back to preview fixtures. Ordinary preview/catalog/public rendering is unchanged.

The capture context has no user cookies. It permits GETs for static template/app
assets, configured public media and Google font hosts. Other external URLs,
API calls, write requests and service workers are blocked. Private `/api/media/`
images pass through the existing endpoint with the caller's cookie, without
following redirects. Draft content never appears in query strings or public
image URLs. Responses use `private, no-store`.

Published covers are saved in the existing persistent media storage
(R2 on Vercel, or persistent local media storage on a conventional host). The
lookup is scoped by the verified account ID, visual content and cover version,
so signing in again or clearing all disposable caches reuses the saved image.
Private draft screenshots are encrypted with AES-256-GCM before storage, using
a key derived from the existing `SESSION_SECRET`, with the content/account hash
authenticated as associated data. Even a publicly accessible media bucket holds
only ciphertext. Keep that secret stable; rotating it requires regeneration of
old covers. Saved objects have no automatic cache expiry. Storage failures are
logged and fall back to rendering/caching, without discarding a successful image.
Existing published disk covers migrate into persistent storage when requested.
Draft captures remain browser-only regardless of authentication.

The draft/published policy is covered by browser checks for unchanged names,
name replacement and old-entry deletion, reload reuse, and stale capture results
after reverting a name edit. A real local production integration verified that a
draft capture creates neither a server cache file nor a persistent object, then
published the synthetic invitation through the publication service and invoked
the post-publication preparation helper. It saved the canonical published cover
without a dashboard request. Focused payment/publication/cover tests, the browser
suite, typecheck, build and deployment trace verification passed. Synthetic
database rows and media from that integration were removed.

Persistence verification generated a real synthetic cover into temporary local
media storage, deleted its entire disposable disk cache, replaced its session
cookie, and disabled rendering through an invalid capture origin. The identical
saved image returned in 9 ms, proving that retrieval did not launch a new capture.
Encryption, tamper rejection, account/content separation and storage-outage
fallback tests passed, as did the production build and deployment trace check.
R2 transport uses the existing configured storage client; these persistence
checks used the local backend and did not write test objects to live R2.

The server also caches WebPs outside `public/`. Analytics/development cookies, publication
status, revisions, audio, view counters and extra language variants do not change
the fingerprint. Default-language content and JSON keys are normalized on both
client and server. Previous-format cache entries remain readable during migration.
Identical in-flight requests share a job. At most one capture
runs per process; extra callers receive a retry response. The dashboard also
queues uncached requests one at a time so its own cards do not compete for the
capture slot. New work is limited to
24 captures per IP per minute. Cached reads do not consume that budget. The disk
cache retains at most 500 images for up to seven days; it is disposable. Browser
CacheStorage holds up to 100 version/account-scoped images, with one current
cover per invitation. Draft and published browser identities are distinct. A bounded
memory cache retains ready object URLs across component remounts, including when
disk caching or Web Crypto is unavailable. Cached WebPs are decoded before reuse;
broken entries are deleted and fetched again. Successful images display without
waiting for browser cache writes/eviction. Displayed images remain pinned until their cards
unmount. Filters hide cards without unmounting them, so switching tabs preserves
the image DOM and performs no cache lookup, request or generation for loaded
covers. Reopening the dashboard reuses images; draft name/design/language edits
or published visual-content edits change the key. Offscreen cards defer requests and listing
pages run no live templates. During an edit, the previous image for that same
account/invitation/template stays visible until its replacement is ready. Network
errors and HTTP 429/500/502/503/504 get at most three attempts within an 80-second
budget. Long rate limits stop automatic retries. A separate keyboard-accessible
"Qayta urinish" button retries failed covers without opening the card's link.

## Application host setup

On Vercel, the application uses the pinned `@sparticuz/chromium` Linux x64 binary
with `playwright-core`, not a developer machine's Playwright browser install.
Next externalizes both packages and explicitly traces `@sparticuz/chromium/bin/**`
and the complete `playwright-core/**` runtime into the cover route. Playwright
loads `browsers.json` dynamically at import time even when Chromium's executable
path is supplied separately. Tracing its JavaScript alone omitted that file in
production and caused `COVER_DEPENDENCY_MISSING` before browser startup.
`pnpm build` now checks the actual cover-route deployment manifest for Playwright's
metadata/entry points/bundles and Chromium's binary/library/font archives, failing
the build if any are absent. No runtime binary download URL or extra service is needed.
Vercel's private disk cache lives under the OS temporary directory (`/tmp`), since
the deployed application directory is read-only. It survives warm invocations only;
the persistent media store and browser CacheStorage provide reuse across reloads
and server cold starts. Read or
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
JSON error boundary. Browser launch has a 15-second timeout. An independent
42-second deadline includes executable extraction, launch and the entire render;
it rejects even if Chromium shutdown stalls. CDP screenshot calls have an
8-second deadline and context/browser/CDP cleanup waits are bounded to one second
each, leaving room under the route's 60-second function limit. Successful jobs
close their private context and retain the browser for up to 20 idle seconds;
failed jobs discard the browser. Each context starts with no cookies or draft
data from earlier jobs. Serverless launch disables Chromium's single-process
flag so private contexts can be disposed and recreated reliably.

Captures block audio downloads (preserving video artwork), wait for DOM readiness rather than the
whole page load event, and bound font waits. Once the selected source scene and
visible images settle, CDP captures its pixels directly, including the special
hero crop. This avoids Playwright screenshot preparation waiting again for
unrelated hidden/offscreen fonts. The selected scenes and existing cache version
are preserved.

Before screenshotting, cancel outstanding animation-frame callbacks as well as
pausing CSS animations and media. This stops canvas/GSAP loops from continuously
rendering during capture while retaining the selected real source frame.
Failures log template ID, stage, elapsed milliseconds, deadline status and Node
RSS (no names/content/cookies). Storage configuration warnings report missing
environment-variable names without exposing values. On Vercel, configure
`MEDIA_STORAGE=r2`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
`R2_BUCKET_NAME` and a stable `SESSION_SECRET` of at least 32 characters in the
deployment's environment. Vercel Deployment Storage is retained build output,
not this application media backend; reducing deployment retention does not
configure cover persistence. No production Vercel stall is claimed reproduced
by local tests.

Timeout repair verification: 10 focused tests passed, including permanently
stalled CDP screenshot/detach and browser-close operations. Production build and
deployment tracing passed. Real local production captures passed for Anor
(including a name replacement), Somon Yo‘li, Butterfly and Aurelia in 5–10 seconds
each. The deployed Vercel runtime still needs verification after deployment and
configuration of persistent storage.

2026-10-30 performance repair verification: the focused tests, dashboard browser
suite, production build and deployment trace checks passed. Real synthetic
captures passed for Anor (including edited names and an identical cache hit),
Somon Yo‘li's hero crop, Butterfly and Aurelia's video artwork. Local captures
took about 5–9 seconds after browser startup; the server cache hit took 24 ms.
The bundled Linux x64 Chromium 153 also passed three successive isolated context
captures with the serverless launch flags. These are local/WSL checks; the live
deployment still needs to be updated.

To repeat the packaged-browser smoke check on a Linux host with Node 22, run
`VERCEL=1 node tests/cover-linux-smoke.mjs`.

Verification commands:

```sh
pnpm exec tsx --test tests/invitation-covers.test.ts tests/cover-runtime.test.ts
pnpm exec tsx --test tests/cover-browser.test.ts tests/cover-error.test.ts
pnpm exec tsx --test tests/cover-storage.test.ts
pnpm exec tsx --test tests/cover-publication.test.ts
pnpm typecheck
pnpm build
# With the built app running on http://127.0.0.1:3002:
pnpm exec tsx --test tests/invitation-covers.browser.integration.ts
# Real synthetic captures (defaults to port 3001; COVER_TEST_URL overrides it):
pnpm exec tsx --test tests/cover-capture.integration.ts
# Real render, delete disk cache, then fetch saved image with rendering disabled:
# Set TSX_TSCONFIG_PATH=apps/web/tsconfig.json in the shell first.
pnpm exec tsx --test tests/cover-persistence.integration.ts
# With matching local media/cache directories, free publishing and app env loaded:
pnpm exec node --env-file=apps/web/.env.local --import tsx --test tests/cover-publication.integration.ts
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

The subsequent production dependency error identified the omitted
`playwright-core/browsers.json`. After the explicit package include, the build and
its new manifest check passed. All 115 Playwright Core files were copied from the
manifest to an isolated temporary directory and successfully imported there,
including browser metadata and device descriptors. The updated cover trace totals
about 83.2 MiB on the local build host. This packaging correction requires redeployment.

When changing selected scenes or renderer artwork, update the recipe and bump
`COVER_VERSION` to invalidate both caches. Inspect personalized captures beside
the existing catalog images, including long names and the default language.
