# Oq atirgul composition revision — 2026-11-05

Reworked the existing static invitation before adding another design. The original
rose artwork remains byte-for-byte unchanged. The template now combines expressive
Great Vibes names, a quieter tracked occasion heading, an ornamental ampersand,
a compact invitation paragraph, a ruled three-column date/time composition and
a left-aligned venue/address/QR section. The lower text and QR balance the floral
mass on the right. The QR caption stays clear of the foliage.

Local Great Vibes subsets cover Latin and Cyrillic, with EB Garamond supporting
the remaining text. Fine details live in the template's `composition.ts`; layout
and contract mapping remain in `layout.ts`. Both preview and download continue
through the same private server renderer. The catalog poster is regenerated from
the shared sample; no sample content is saved to creator invitations.

Verification:

- Renderer: all four locales, long Latin/Cyrillic names, Fotiha with empty optional
  address/landmark, 750×1050 protected preview and 1500×2100 flattened PNG.
- Locally decoded the final QR for selected/changed coordinates, written-address
  search and an eight-character Fotiha short URL. Date/time parts agree across an
  explicit UTC-to-Tashkent year boundary; Russian months use the day-paired form.
- Excessive wording still fails before export rather than clipping.
- Browser: 1440×1000 and 390×844 catalog, artwork/details dialog and protected full
  preview. Complete 5:7 artwork, no horizontal overflow, page errors or image/API
  errors in these checks. Visually inspected phone detail/full preview and clean
  Latin, Cyrillic and long-name renders.
- 35 focused invitation, capability, editing-policy and filename tests passed.
- TypeScript and production build passed. Both image API deployment traces include
  all four private calligraphy subsets; Playwright/Chromium packaging verification
  also passed.

Commands: `node --import tsx scripts/verify-static-image-render.mts`,
`node --import tsx scripts/verify-ivory-rose-composition.mts`, `pnpm typecheck`,
`pnpm build`. The browser script expects the local app on port 3001.

This changes an existing published template; no database migration is needed.
Earlier verification images in the parent directory remain untouched.
