# Taklifnomachi template releases

Source of truth: `Invitations - this folder will be removed from production/Taklifnomachi/capture-manifest.json` and the corresponding files below `Web invitations/`. The manifest contains eight captured demos in this order. The captures remain untouched. All manifest-listed resources for these eight designs are present locally.

Release policy: register each entry unpublished; package its own source and assets, add a typed adapter and additive migration, and publish only after focused source/adapter/catalog checks, typecheck, production build, authenticated save/publish/public-render/reopen verification, and in-app browser QA pass. Record unavailable database or browser checks explicitly. No Taklifnomachi entries are currently registered in the application catalog.

| Sequence | Source ID and URL | Capture | Implementation | Release checks | Catalog | Open gates |
|---:|---|---|---|---|---|---|
| 1 | `1` — https://taklifnomachi.uz/demo/1 | `Web invitations/taklifnomachi.uz/demo/1/index.html`; 70 manifest resources under `templates/1/` plus captured fonts/audio and shared files | Source reviewed; integration not started | Not run | Not registered | Implement and audit all source scripts, replace hard-coded invitation content, remove source form endpoints and Cloudflare beacon, connect supported app APIs |
| 2 | `12` — https://taklifnomachi.uz/demo/12 | `Web invitations/taklifnomachi.uz/demo/12/index.html`; 15 manifest resources under `templates/12/` | Not started | Not run | Not registered | Source audit and implementation |
| 3 | `13` — https://taklifnomachi.uz/demo/13 | `Web invitations/taklifnomachi.uz/demo/13/index.html`; 15 manifest resources under `templates/13/` | Not started | Not run | Not registered | Source audit and implementation |
| 4 | `15` — https://taklifnomachi.uz/demo/15 | `Web invitations/taklifnomachi.uz/demo/15/index.html`; 12 manifest resources under `templates/15/` and source-specific audio | Not started | Not run | Not registered | Source audit and implementation |
| 5 | `16` — https://taklifnomachi.uz/demo/16 | `Web invitations/taklifnomachi.uz/demo/16/index.html`; 13 manifest resources under `templates/16/` | Not started | Not run | Not registered | Source audit and implementation |
| 6 | `17` — https://taklifnomachi.uz/demo/17 | `Web invitations/taklifnomachi.uz/demo/17/index.html`; 13 manifest resources under `templates/17/` | Not started | Not run | Not registered | Source audit and implementation |
| 7 | `18` — https://taklifnomachi.uz/demo/18 | `Web invitations/taklifnomachi.uz/demo/18/index.html`; 20 manifest resources under `templates-source/18/` and captured fonts | Not started | Not run | Not registered | Source audit and implementation |
| 8 | `19` — https://taklifnomachi.uz/demo/19 | `Web invitations/taklifnomachi.uz/demo/19/index.html`; 12 manifest resources under `templates-source/19/` and captured fonts | Not started | Not run | Not registered | Source audit and implementation |

## Current run notes

- Repository branch is `main` (`origin/main` plus nine local commits). The outer workspace has pre-existing deleted tracked files and an untracked nested project; do not restore or stage those files as part of template work.
- The nested application has extensive unrelated working-tree changes, including the shared template preview renderer, catalog/editor files, contract, and roadmap. Keep Taklifnomachi changes isolated and review those shared edits before touching them.
- No `.zip` was found in the project or its parent. The capture manifest's `failures` list is empty, and all 170 resources associated with the eight source template packages are present.
- Source ID `1` is a Tilda-based long-form design. Its capture has 22 inline scripts, 13 template scripts, an external Cloudflare beacon, a Google Fonts request, a fixed demo title/content, an empty-action POST form, an RSVP modal, countdown, music control, and an opening video. The first release step must inventory script responsibilities and replace source data/service paths while retaining the design's structure and motion. One HTML source alone is not a complete installable package; its 70 manifest resources must be packaged and path-adjusted.
- Database credentials and Telegram bot configuration have not been inspected or verified yet. Do not claim migrations, publication, or notifications until the respective release actions succeed.
- The initial catalog sequence above follows the manifest order only; it is not inferred from numeric ID sorting.
