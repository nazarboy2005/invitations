# Velvet Royale source reference capture

Exact E-invitation catalog identity: `royal-burgundy-edition`, rendered at `https://e-invitation.uz/demo/velvet-royale/`.

This folder is a source reference package, not the app renderer. `CjKUbLp8.js` was copied byte-for-byte from the local E-invitation `Nikoh to'yi/_nuxt` capture. `VelvetRoyale.Bur_z5Os.css` and the image/video files were recovered from the exact asset URLs observed on the live source page using the ChatGPT in-app browser inventory and direct requests for media that the browser asset bundler could not fetch. The files with `velvet-manor-edition` in their remote path are used by the live `velvet-royale` page; the catalog ID and design identity remain `royal-burgundy-edition`.

The page also requests a remote music track and uses sample invitation content. Do not copy its sample data, demo music URL, site runtime, site tracking, or demo RSVP behavior into production. The app renderer must bind the shared invitation contract and services, use Emotional Piano for catalog previews, and use the creator's music on real invitations. Keep this source package unchanged while building the adapter separately.

Font source: captured the exact Google Fonts CSS requested by the invitation (Cormorant Garamond, Great Vibes, and Outfit) and all 18 referenced WOFF2 files. `google-fonts-capture.css` preserves the observed stylesheet; `fonts.css` is the local-path companion for the captured font files. The page's background-audio element points to `https://assets.e-invitation.uz/musics/mari-hakon-samuelsen-ludovico-e-d59dffgg-128k.mp3`; this is source demo audio and must never replace preview Emotional Piano or creator-selected invitation music.

Source-module adaptation note: the captured Royale Vue module has no source map or standalone HTML entry; its seven imports include the E-invitation shared edition registry and large shared Vue/Nuxt application runtime. Those unrelated site-wide modules are not included in the app package. A separate app renderer now uses the captured Royale styles, artwork, fonts, intro and hero motion, and the shared invitation APIs; see `../SOURCE_ADAPTATIONS.md`. The source capture files below `reference/` remain unchanged.

The settled source DOM also references the six gallery photos and `v3-20260927-calendar-corner.webp`; all were recovered after the initial lazy-load inventory. `fonts.css` uses the captured WOFF2 files locally. No source-site RSVP webhook, telemetry code, or demo audio URL is used by the app adapter.

2026-10-28 additive capture: the requested live `/preview/velvet-royale/` page
now loads template module `Cn3YHNzc.js`. It is retained byte-for-byte alongside
the older capture. Its calendar's independent `C94ZD2ww.js` particle engine is
also packaged unchanged. The runtime adapter now uses the actual source DOM
with its scope attributes and loads the original scoped CSS directly. The
source dictionary's template-only labels are extracted to `../labels.json`;
the wider provider runtime is not included. The source registry's Marck Script
font is packaged for Cyrillic names. File hashes are in `../provenance.json`.
