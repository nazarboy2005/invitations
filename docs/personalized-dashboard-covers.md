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
disk caching is unavailable; displayed images remain pinned until their cards
unmount. Filters hide cards without unmounting them, so switching tabs preserves
the image DOM and performs no cache lookup, request or generation for loaded
covers. Reopening the dashboard reuses images; editing visual content changes
the key and generates a fresh cover. Offscreen cards defer requests and listing
pages run no live templates.

## Application host setup

Run `pnpm --filter @taklifnoma/web exec playwright install --with-deps chromium`
on a Node application host that supports spawning Chromium. Playwright and Sharp
are application dependencies and are externalized from Next's server bundle.
`APP_URL` must reach the running application from that host. Optional
`INVITATION_COVER_BROWSER_PATH` selects a managed Chromium executable;
`INVITATION_COVER_DIR` selects the private cache directory. No database migration
or catalog publication change is required. This workflow has been tested locally;
provision Chromium separately on any deployment host.

When changing selected scenes or renderer artwork, update the recipe and bump
`COVER_VERSION` to invalidate both caches. Inspect personalized captures beside
the existing catalog images, including long names and the default language.
