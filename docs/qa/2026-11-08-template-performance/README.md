# Template media and offscreen effects

User requirement: optimize large images/videos and pause offscreen effects;
preserve every animation.

## Media

- 177 template images and 12 videos have additive optimized copies. Original
  captured media stays untouched. Original URLs transparently serve the smaller
  copy through an exact manifest lookup, in development and versioned production
  paths. APIs, uploads, external URLs and private captures are not broadened.
- Selected files total 178,989,854 bytes originally and 49,626,643 bytes after
  optimization: 129,363,211 bytes (72.3%) less transfer across those library files,
  not a per-invitation loading-time/FPS claim. Duplicate source files share copies.
- Static images use WebP quality 88, full alpha quality, preserved proportions,
  and a maximum 1920-pixel edge. Videos use H.264, a maximum 1280-pixel edge and
  fast-start metadata. All 12 outputs were checked with ffprobe: frame rate,
  frame count, duration and audio-track count are retained. See `media-report.json`.
- Files saving less than 10% keep their original. Animated images are never
  flattened. Evelina's 27 MB GIF remains its complete original animation and is
  now lazy/async/low-priority, with the existing two-screen image lookahead.
  Animated-WebP experiments were discarded because they coalesced/changed the
  frame sequence. No experimental derivatives remain.
- `node scripts/optimize-template-media.mjs` regenerates derivatives offline;
  it requires sharp and ffmpeg/ffprobe. Run the public-asset preparation afterward.
  Manifest changes invalidate the immutable asset revision.
- `media-comparison.png`: originals left, optimized images right, viewed at
  phone-like size. Golden Hour, Butterfly and Stained Glass retain their artwork,
  colors and proportions.

## Effects

The shared TemplateFrame installs a scoped visibility adapter in preview, Studio
and public rendering. CSS/Web Animations and single-section infinite GSAP loops
pause outside the screen and on hidden documents. Videos pause without resetting
their playback position. They resume when visible; source-owned paused animations
stay paused. A small margin wakes effects just before entry.

Section geometry is observed instead of individual moving petals or entrance
transforms, so a moving animation cannot freeze itself permanently offscreen.
The observer accounts for the outer iframe's visibility and nested scroll areas.
Animation discovery is batched, with a one-second fallback for programmatically
created Web Animations. Finished/removed effects are released and observers are
cleaned up on navigation/unmount.

Finite GSAP opening timelines, scroll-driven timelines, audio playback, source
canvas/WebGL engines and their existing visibility controls remain source-owned.
There is no global requestAnimationFrame replacement, animation removal, particle
reduction or new lower-motion mode. Uploaded creator photos are not recompressed
by this packaged-template media pass.

## Verification

- `pnpm --filter @taklifnoma/web exec tsc --noEmit`: passed.
- Unit/source checks: template-media, public-assets, catalog-music and
  anor-public-initialization: 8 passed.
- `node tests/template-performance.browser.cjs`: passed on a 390×844 viewport
  with real motion. At 4× CPU throttle, verifies offscreen CSS, Web Animations,
  GSAP loops and video pause/resume, stable playback times, intentional pauses,
  dynamic effects and outer-frame visibility. Also checks actual optimized
  HTTP bytes/MIME, versioned URLs and video Range responses. Full-motion
  Stained Glass, Sunset and Swan Garden opening videos play and reveal;
  Evelina retains its lazy animated GIF. No page errors.
- `node tests/preview-loading.browser.cjs`: passed; critical opening resources,
  background music fetching, image lookahead and eight renderer-family checks.
- `node tests/preview-guest-actions.browser.cjs`: passed across six templates;
  native calendar downloads and creator-selected music/content are preserved.

This is local work, not an external deployment. CPU-throttled browser checks
verify behavior; they do not establish a physical medium-phone FPS improvement.
