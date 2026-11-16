# Services caching

Service photos use `/api/services/photos/[slug]?src=...&w=...`. Cards, galleries,
lightboxes and Open Graph metadata share that route, including bundled photographs.
The stored invitation-independent service image contract and original assets remain unchanged.

Every photo request, including HEAD and conditional requests, checks:

1. The service is currently published and still contains that exact source URL.
2. Uploaded media metadata still exists.
3. The original storage object/file still exists, using R2 HEAD or local stat.

Only then can the route serve cached bytes or `304 Not Modified`. Published photos
use `private, no-cache, must-revalidate` and an ETag based on source identity,
storage version, width and transformation version. Replacements have new source
URLs; even a physical overwrite changes the validator. Missing sources, detached
photos and hidden/deleted services fail closed with uncached errors. Storage or
database failures never fall back to cached pixels or bundled seed data.

The existing `/api/services/media/[id]` route performs its live publication/admin
checks first and shares the same source validation. Admin-only/draft responses
remain `private, no-store` and cannot return a conditional 304.

Derived WebP bytes live in a disposable process-local LRU cache: 32 MiB, 128
entries, five-minute retention. Identical requests share work; four transformations
run at once, with at most 64 pending unique jobs. Requested widths are restricted
to 320, 640, 960, 1280 and 1600 pixels, without upscaling. Public API responses
never use the unrestricted Next image optimizer or a CDN cache that could skip
visibility checks. The photo route explicitly traces packaged service WebP files.

The gallery renders the current slide and its immediate neighbors, including
loop-edge clones. Lightbox photos load only while the dialog is open. An image
error hides the failed image instead of displaying an old or broken photo.

Published directory data is reused for up to five minutes per server process.
Each request first reads `service_directory_cache_state.revision` from the database;
retention time does not determine freshness. Migration
`0237_services_cache_revision.sql` changes that revision transactionally for public
inserts, edits, removal, ordering changes, hiding, deletion and truncation. This
covers scripts/workers as well as the admin UI. A cache miss reads the revision
and published content in one SQL snapshot. Private draft-only changes do not
invalidate the directory. Before the migration is applied, reads remain uncached.
Full pages remain dynamic and favorites remain outside shared caches.

Browser history can restore an already-rendered document without making a photo
request. This does not retroactively erase pixels or original static files a visitor
already downloaded. The guarantee is that subsequent photo requests and fresh
page loads cannot resurrect removed content from these caches. Live removal from
an already-open screen would require a separate update channel/polling behavior.

## Verification

```powershell
$env:TSX_TSCONFIG_PATH='apps/web/tsconfig.json'
node --import tsx --test tests/service-image-cache.test.ts tests/service-directory-cache.test.ts tests/services.test.ts tests/services-admin-schema.test.ts tests/service-favorites.test.ts tests/local-storage.test.ts tests/public-assets.test.ts
```

`tests/services-cache.integration.mts` exercises the production HTTP routes and
desktop/mobile browser rendering. It requires a separate application on port 3014,
a loopback-only database with services schemas and migration 0237, and
`MEDIA_STORAGE=local` with the same disposable `LOCAL_MEDIA_DIR` in both processes.
It deliberately refuses a remote database. It warms the caches, then tests image
replacement, attachment removal, hidden services, physical file deletion, metadata
deletion, bundled photo removal and service deletion. Fixtures are cleaned up.
