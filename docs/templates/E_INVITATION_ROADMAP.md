# E-invitation template production roadmap

This roadmap tracks only locally saved E-invitation sources by exact catalog ID. It does not merge Invitate or Chorlove templates. Original source captures remain read-only. Each candidate registers unpublished and stays that way until source/assets, app rendering, catalog persistence, authenticated lifecycle, and visual checks pass.

The order comes from the `ee` source-template array in `Nikoh to'yi/_nuxt/CuxCuSpb.js`; `capture-more.js` records capture order, which differs. Existing Olive Manor work is retained.

| Catalog order (saved sources only) | Exact source ID | Source design | Status |
| --- | --- | --- | --- |
| 1 | `manor-edition` | Manor | Source package and app renderer/routes integrated. Exact source assets and 12 fonts are packaged; three missing font files recovered from exact URLs. Unpublished registration applied and verified. Focused checks pass 4/4. In-app mobile reduced-motion preview, intro open, and app-data sections were inspected. Desktop, normal-motion, gallery/map interactions, authenticated lifecycle, full build, and publication remain open. |
| 2 | `islamic-edition` | Islamic | Source page, shared Vue chunk, CSS, available artwork/video, and 13 fonts packaged. Unpublished registration applied and verified. Focused checks pass 4/4; typecheck passes. In-app mobile reduced-motion preview, intro open, language switch, and preview-only RSVP were inspected. `gift.webp` is referenced by the original chunk but missing; its exact source route returns 404 and no source ZIP exists. Desktop, normal-motion, gallery/map, authenticated lifecycle, build, and publication remain open. |
| 3 | `olive-manor-edition` | Olive Manor | Previously active; source package, renderer/routes, unpublished registration, focused checks, typecheck, and build were completed earlier. In-app `/preview` exposes the iframe but no inner content; the screenshot is blank. Visual parity and interactions, authenticated lifecycle, publication, commit, and notice remain open. |
| 4 | `osh-edition-v1` | Osh Edition | Queued; exact source page and three source images are saved. |
| 5 | `amru-maruf-edition-v1` | Amru Maruf | Queued; exact source page and design stylesheet are saved. |
| 6 | `monochrome-editorial-edition` | Monochrome Editorial | Queued; exact source page, five artwork files, and design stylesheet are saved. |
| 7 | `xatna-edition` | Xatna | Queued; exact source page and six design assets are saved. |
| — | `royal-burgundy-edition` | Velvet Royale | Published, live-catalog verified, and committed as `a074e75`; do not redo. |

## Current blockers and release gates

- **Shared authentication gate:** with the configured local app server, `/api/auth/session` returned `{"user":null,"configured":true}`. The in-app browser has no signed-in user session, so authenticated save/reopen and publish/public-render/reopen checks cannot be performed. Do not claim these checks passed.
- **Islamic Edition source asset:** `gift.webp` is absent from the capture and all supplied source archives. The exact asset route `https://e-invitation.uz/_external/assets.e-invitation.uz/islamic-edition/gift.webp` returns 404 in the ChatGPT in-app browser. The app uses captured `bouquet.webp` in that panel; keep unpublished while progressing.
- **Olive Manor visual QA:** the in-app preview's iframe exposes no rendered content. Keep unpublished until a usable visual check is available.
- **Manor source comparison:** the exact source page title loads but its content stays at “DIZAYN YUKLANMOQDA”; the local captured HTML/module/CSS/assets remain available. Record visual parity as open.
- **Shared workspace:** the checkout includes concurrent edits, deletions, and untracked template work. Preserve them and isolate future template commits; do not stage or revert broad paths.

## Verification evidence

- `tests/manor-edition-template.test.ts`: 4/4 passed; Manor renderer `node --check` passed.
- `tests/islamic-edition-template.test.ts`: 4/4 passed; Islamic renderer `node --check` passed.
- Workspace `pnpm typecheck` passed after Islamic integration; rerun after Manor integration.
- Workspace production build passed after Islamic integration but before Manor integration; rerun before any release decision.
- In-app previews use Emotional Piano in catalog mode and creator-selected music for live invitations. RSVP and wishes use app APIs. Preview names, dates, venues, cards, contacts, and sample wishes stay in preview data.
- Manor and Islamic registrations are present in the live database with `published:false`. Neither has been published, committed as a release, or sent a Telegram notice.
