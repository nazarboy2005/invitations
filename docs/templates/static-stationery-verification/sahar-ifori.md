# Sahar ifori replacement — 2026-11-05

User requested removal of dark Zarhal oqshom and a polished light replacement.
Sahar ifori uses luminous ivory paper, blush sweet-pea/cosmos watercolor, sage
calligraphy and champagne fine lines. Original built-in imagegen output is copied
unchanged into `apps/web/src/templates/sahar-ifori/assets/background.png`; the
exact generation prompt and field mapping are beside its isolated `layout.ts`.

Composition review moved the family signature into the QR group so it clears the
bottom frame. Names balance the top-left florals; greeting/body, three-part date
band and venue have distinct hierarchy. Artwork is clear of actual text bounds.
Only the canonical shared fixture supplies the actual public 750×1050 poster.

Additive migrations 0216/0217 were applied individually using the migration ledger
and advisory lock: Zarhal is unpublished, Sahar is published at zero UZS with
wedding/fotiha support and wedding category. The typed fallback agrees. Retired
source/fonts remain packaged for owned invitations. Explicit trusted `retired`
metadata allows their existing owned downloads; unpublished unfinished designs
still cannot export and new Zarhal creation remains rejected.

Verification:

- TypeScript and 39 focused invitation/capability/edit-policy/filename/browser/
  deadline tests pass.
- New design passes four locales, long Latin/Cyrillic names, empty optionals,
  Fotiha, year/timezone rollover, Russian month grammar, bounded slot positions,
  oversized-content rejection, decoded short/written-address QR, clean flattened
  1500×2100 PNG and baked-watermark 750×1050 preview checks.
- Actual protected previews and authored saved Studio render at 1440×1000 and
  390×844 without horizontal overflow or image/auth/runtime failures.
- Published catalog/detail checks pass at both widths; Sahar is present and Zarhal
  is absent. Actual owned Sahar save/reopen/switch, event compatibility, download,
  identity lock, location correction and repeat download pass. A retired owned
  Zarhal exports successfully while a new Zarhal creation returns 409.
- Sequential catalog-only and backend-only release runs finish with no browser,
  runtime, image or authentication API failures; temporary rows are cleaned up.
- Production build `.next-sahar-ifori` and both static-route manifests include
  the new background, both EB Garamond fonts and all four local calligraphy
  subsets, plus the existing private designs and browser runtime.

Commands:

```powershell
node --import tsx scripts/verify-static-collection.mts --sahar-only
node --import tsx scripts/verify-static-collection.mts --posters-only
node --env-file=apps/web/.env.local --import tsx scripts/verify-static-collection-ui.mts --release
node --env-file=apps/web/.env.local --import tsx scripts/verify-static-collection-ui.mts --release --catalog-only
$env:TAKLIFNOMA_BUILD_DIST_DIR='.next-sahar-ifori'; pnpm build
node apps/web/scripts/verify-static-image-deployment.cjs
```

`sahar-ifori-catalog.webp` is the finished card; `sahar-ifori-long-*`, locale,
minimal and rollover renders document content stress cases. Preview/Studio/detail
captures show the actual app. The shared `collection.webp` now shows the three
current light-paper designs. No external deployment or live payment activation.

Run browser checks sequentially: overlapping full/backend harnesses and their
extra retired probe can exceed the intentional three-render server limit. The
retired probe is now removed immediately after its check. An overlapping run
reported a preview 429 and another Studio wait timed out; these were followed by
separate catalog/backend checks rather than relaxing the renderer limit.
