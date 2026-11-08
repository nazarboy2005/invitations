# Dashboard template covers

Taklifnomalarim cards (web and static-image invitations) and payment-result artwork use the template catalog's static poster through the shared `templatePoster` helper. The creator's actual names remain in the card text; names baked into the poster may be sample names.

Both pages render a plain image with the identical source URL. Curated catalog covers take precedence over the template's preview artwork. In production, `publicAsset` supplies the existing versioned `/_assets/<version>/...` URL, served with `Cache-Control: public, max-age=31536000, immutable`. A cached cover can be reused from catalog to dashboard and from dashboard to catalog without another network transfer while the cache entry is fresh and retained. Artwork changes invalidate the asset version. Development deliberately uses original URLs without persistent caching.

Dashboard covers have no account/content cache key, image proxy, blob URL, fetch queue, retry loop, or screenshot request. Edits, publication status, and account changes do not change the poster URL. Native lazy loading defers offscreen images. Save, publication, payment and administrator-review routes no longer prepare personalized screenshots in the background. Actual static-image previews and downloads in Studio retain their existing behavior.

The older screenshot endpoint and capture utilities are legacy infrastructure, no longer used by the dashboard or publication flow. Previous personalized images in browser CacheStorage are not used for template posters.

Verify cross-page reuse against a local production server with:

```sh
COVER_TEST_URL=http://127.0.0.1:3002 pnpm exec tsx --test tests/invitation-covers.browser.integration.ts
```
