# Templates page — 2026-11-03

The user requested one continuous background inspired by the supplied catalog
reference, fixed behind scrolling content. Fotiha branding and existing web 3:5 /
image 5:7 card display ratios are preserved. The catalog format choices are centered
between gold rules above the web categories; Studio keeps its existing control.

`background-original.png` is the untouched built-in image_gen output.
`generation-prompt.md` records the exact prompt. The complete artwork is encoded
as the 230 KB local `apps/web/public/images/catalog/catalog-background.webp` asset;
there are no separate hero/mobile background bitmaps. Mobile changes the framing
of the same asset. Text, controls and cards remain accessible application content.

The page uses a fixed decorative layer with a stable viewport height. Filter
controls initially sit directly over the artwork; an IntersectionObserver adds a
translucent backing when the controls pin while scrolling. Favorites uses the same
page background; the landing page has no changes.

Verification: `node --import tsx scripts/verify-templates-background.mts` checks the
real page on desktop/mobile, fixed artwork with moving cards, two centered format
choices, web-only category visibility, preserved display ratios, favorites, no
horizontal overflow and no page errors. `pnpm typecheck` and `pnpm build` pass.

Screenshots: `desktop.png`, `desktop-scrolled.png`, `image-format.png`, `mobile.png`
and `mobile-scrolled.png`. No external deployment was performed.
