# Public asset caching

The landing page, catalog, Studio and public invitation renderers use
`publicAsset(url)` from `apps/web/src/lib/public-asset.ts` for packaged public
images, audio, template documents and scripts. API URLs, uploaded media, external
URLs, page links and already-versioned URLs pass through unchanged.

## Build and serving

`apps/web/scripts/prepare-public-assets.mjs` runs from Next configuration for both
development and production builds. Typechecking and the standard unit-test command
also prepare its generated manifests, including on a clean checkout.

The generator hashes eligible files beneath `public/images`, `public/audio`,
`public/music` and `public/templates`. One revision covers their complete dependency
graph. Asset changes produce a new `/_assets/<revision>/` namespace; code-only
releases retain the existing asset URLs. This initially invalidates the whole asset
graph when any packaged asset changes, trading some cache reuse between asset
releases for consistent HTML/CSS/script dependencies.

Only text bundles are emitted beneath `public/_assets`: their relative paths stay
intact, and root-relative asset references point to the same namespace. Original
source/captured files are never rewritten. An adapter that identifies its template
from pathname segments is adjusted only in the generated copy. Large binary files
use Next rewrites to their original files, preserving static serving, byte ranges
and validators without copying approximately 500 MB of template media.

Proxy checks the current revision and the exact generated file allowlist before
serving the namespace. Valid production URLs receive:

```http
Cache-Control: public, max-age=31536000, immutable
```

Unknown files, obsolete revisions and private template artifacts return 404 with
`no-store`. Development emits original asset URLs so HMR and refreshes do not
depend on generated revisions. Versioned URLs requested directly in development
use `no-store`. Production binary rewrites stay pinned to the build's revision;
the development page does not depend on them.
Unversioned original paths retain normal
Next revalidation. Build outputs and manifests are ignored by Git; obsolete
generated trees are removed inside the dedicated `public/_assets` directory.
Rebuild production after changing packaged files. Development uses the originals
directly and does not require a manifest refresh for asset edits.

CSS background URLs come from shared layout variables using the same URL helper,
so a mobile hero used by both `<picture>` and CSS is fetched only once. Existing
responsive artwork, lazy loading, on-demand previews and audio gesture policy are
preserved. Next's generated JavaScript/CSS/platform-font caching is unchanged.

## Landing background loading

`LandingAssetLoader` is mounted only on the homepage. After the initial window
load, an idle callback (maximum 1.5-second delay) starts a queue in DOM section
order. It switches existing lazy images to eager one at a time per worker, so
native picture/srcset/sizes selection remains authoritative. Two workers run
normally; slow/data-saving connections use one. Visible queued items take priority
when visitors jump ahead, then warming continues without requiring scrolling.

Section-specific tasks warm the water/paper JavaScript modules, paper geometry,
crease texture and sound files. They do not create graphics contexts or activate
audio. Reduced motion omits animation modules/geometry. Downloads reuse normal
HTTP caching, including the production content-revision namespace. Failed images
and optional requests do not stop the queue; unmounting aborts background fetches
and removes pending callbacks. No localStorage “already loaded” flag is used,
because the browser may evict individual cached assets.

## Privacy and freshness

No blanket public cache policy applies to application pages or APIs. Session,
dashboard, Studio drafts, admin, payments, receipts, generated owner covers and
uploaded-media authorization retain their existing behavior. Invitation documents
remain dynamic; the cached template frame contains only the reusable renderer and
receives authored content separately. Presentation adapters version bundled music
and preview artwork without saving build-specific URLs into creator invitations.

Preview/Studio document recognition and the cover capture asset policy understand
the versioned frame paths. Original private source-capture and tracker restrictions
apply to generated output too. Catalog metadata and pricing stay fresh rather than
being placed into a new data cache in this change.

## Verification

```powershell
pnpm build
pnpm exec tsx --test tests/public-assets.test.ts tests/template-independence.test.ts tests/invitation-covers.test.ts
pnpm --filter @taklifnoma/web exec next start --hostname 127.0.0.1 --port 3002
# In a second terminal; CACHE_AUDIT_ORIGIN can select another local server:
pnpm exec tsx tests/public-assets.browser.mts
# Against the normal development server on port 3001:
pnpm exec tsx tests/public-assets-dev.browser.mts
# Homepage queue: no scrolling, responsive artwork, reduced motion/data saver,
# offscreen renderer deferral, and fresh/repeat HTTP-cache measurements:
pnpm exec tsx tests/landing-assets.browser.mts
```

The browser audit checks immutable headers, unchanged binary bodies, byte-range
audio, private API headers, blocked captures, missing/stale URLs, first/repeat
homepage transfers, representative relative/absolute-path template frames, mobile
layout and reuse of the mobile hero URL. It uses real Chromium HTTP caching;
Playwright request routing would disable that cache. Results and desktop/mobile
screenshots are written to ignored `.data/cache-verification/`.

Local production baseline on 2026-10-31 (desktop, reduced motion, page scrolled
through its sections): 31 public asset responses and 4,113,912 network bytes on the
first visit; 31 responses and 11,026 bytes on the repeat visit. The original hero
returned `public, max-age=0`. These are local production-build measurements, not a
claim about the external deployment or its CDN configuration.

After implementation, the same desktop flow transferred 4,114,470 public-asset
bytes on the first visit and **zero** network bytes on the repeat visit. All 31
asset responses used versioned URLs. Relative-path Anor, pathname-derived Aurelia,
shared/absolute-path Cloud Castle and Qog‘oz ertagi frames loaded successfully;
mobile fetched its hero image once. Header, binary equality, range and privacy
checks passed. The production build and its cover-deployment verification passed.

The full unit suite reports 812 passing tests and 59 failures. A comparison run
against unchanged HEAD (with the same dependencies and captured assets) reproduced
all 59 failing test names; the caching change introduced no additional failures.
The dedicated asset-versioning and privacy tests pass.

### Development refresh regression

The original implementation was verified only with `next start`. An already-running
`next dev` server retained startup rewrites for one asset revision while HMR loaded
the newly generated revision into page/Proxy modules. Generated text frames still
existed on disk, but binary image URLs had no matching rewrite and returned 404.

Development now emits the original local URLs, bypassing revision-specific routing
and avoiding stale rewrites during HMR. Production retains its build-pinned,
immutable asset URLs. The development browser regression
checks desktop/mobile navigation, normal refresh, uncached refresh and catalog
images on the running localhost server.

Follow-up verification on port 3001 passed all six desktop/mobile navigation,
normal-refresh and uncached-refresh cases, with zero failed asset responses.
The 31 focused unit checks and the production build passed.

### Landing queue verification (2026-11-02)

Production build (including TypeScript and cover-deployment checks) and all four
public-asset unit checks passed. `tests/landing-assets.browser.mts` verified that
every homepage image finishes without scrolling, correct desktop/mobile artwork
is selected, and paper renderers remain uninitialized offscreen. Normal desktop,
normal mobile and reduced-motion/data-saving mobile all passed with no failed
public assets. First-visit public-asset transfers were respectively 4,055,412,
3,717,148 and 3,615,747 bytes; repeat visits transferred zero public-asset network
bytes in all three cases. These are local production measurements; the server
reported a database connection timeout and used its existing local catalog fallback.
