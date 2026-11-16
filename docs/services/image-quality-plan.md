# Proposed Services image quality changes

Status: recommendation for review; this task does not change image processing.

## Current findings

- Packaged directory content contains 1,997 images. The median longest edge is 800px; 849 images have a longest edge below 800px. These files cannot become sharper by raising an output quality setting.
- Google photo extraction requests up to 1440px. The scraper downsizes all collected images to 1440px and encodes WebP at quality 84. The worker's storage function encodes them again at quality 85 (1600px cap).
- Manual uploads are resized/encoded in the browser (1600px, quality 86, at most 4 MiB transferred), then encoded again by the storage function at quality 85.
- Packaged images use Next's image optimization. Stored `/api/services/media/…` images bypass it and display the saved WebP directly. The gallery and lightbox can stretch a small source beyond its useful resolution.

## Recommended implementation

1. Preserve the highest available source as a private master in R2 for new imports/uploads. Keep existing type, byte-size, pixel-count and metadata/security checks. An original may already be small or compressed; never claim that resizing adds detail.
2. Generate display files directly from that master, once: a card variant around 800px, a detail variant around 1600px and an expanded variant up to 2560px, without enlargement. Begin with WebP quality 90 and compare actual samples before settling the setting. Retain the existing single-provider gallery preference.
3. Use responsive `srcset`/`sizes` for card and gallery variants, loading the expanded version only when opened. Keep private masters protected; preserve the published-reference access checks and deletion/shared-image behavior for variants.
4. Move manual master transfer to short-lived, authenticated direct R2 uploads. Validate the uploaded object server-side before accepting it as a service photo. This avoids the serverless request-body limit without relying on browser compression. Do not introduce public bucket access.
5. Refresh older blurry photos from their recorded sources or a better administrator upload, with review before replacement. Regenerating a small existing WebP cannot recover missing detail. Keep the current public image until its replacement is ready.
6. Verify representative halls at phone/desktop pixel densities, gallery expansion, transferred bytes, and loading speed; also test privacy, deletion, malformed images and failed uploads. Release the pipeline before refreshing existing content in controlled batches.

Keeping private originals costs more storage, but prevents repeated loss when generating future variants. Serving full originals on every card would waste bandwidth and slow the directory; visitors should receive the smallest variant that remains sharp at their display size.
