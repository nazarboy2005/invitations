# Bir xabardan to‘yga — Suhbatimiz tarixi

Proposed catalog ID: `wedivo-riwayat-obrolan`. Proposed category: `wedding`.
Supported event types: `wedding` only. The package is deliberately unregistered
and unselectable. The central coordinator owns registry/route wiring, additive
unpublished registration, database and publication.

Source: Wedivo “Dari ‘P’ Sampai ‘Sah’ — Riwayat Obrolan Kami”. Uzbek Latin is the
default presentation language. Natural translations keep the original source
composition and animation. The other three approved locales remain available.

`renderer.tsx` is the single source iframe renderer for catalog, studio and public
display. `adapter.ts` maps `Invitation` through the shared typed data adapter;
`public/templates/wedivo-riwayat-obrolan/adapter.js` binds that data before the
source runtime starts. Locale/content changes rehydrate the same frame URL.
No invitation data is persisted by this renderer. Preview-only media/wishes
require `preview && sampleWishes`; never set this flag for creator-authored data.

Read the public package's `SOURCE_ADAPTATIONS.md` for the complete source field
mapping, omitted unsupported panels, service behavior and release gates.
