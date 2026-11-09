# Activity redesign

The owner Activity page uses responsive full-screen rose-and-silk artwork, a large serif heading, burgundy section tabs, translucent summary cards, and coordinated response, wish, receipt, and gift-intention panels. One viewport-fixed background extends behind the existing frosted navigation and stays unchanged across tabs and scrolling. Activity scrollbars are 3px wide with transparent tracks (Firefox uses its native thin width).

Tilaklar uses a sealed-envelope total, an ornamental greeting banner, compact message rows with initials and timestamps, and the existing filtering, approval, and confirmed deletion controls. Its total comes from the existing server count rather than the current results page. Generated backgrounds now use fuller cream and pink roses with a warmer blush base, replacing the previous architectural artwork. Assets are local WebP files; current generation prompts are in `image-generation-v2.json`, and the original prompts remain in `image-generation.json`.

## Verification

- `pnpm typecheck` passed.
- Eighteen browser checks passed using intercepted synthetic API responses, with no account, invitation, payment, or database changes. See `verification.json`.
- Five additional checks passed for the total wish count, fixed viewport artwork, shared background across tabs, transparent scrollbar tracks/image under the gutter, and preserved navbar blur. See `background-verification.json`.
- All four sections were checked at 320, 390, 600, 701, 768, 1024, 1280, and 1672 pixels, including templates with RSVP notes. No horizontal document overflow or browser exceptions occurred.
- Search, both response filters, copying, keyboard tab navigation, wish filtering/approval/deletion, delete cancellation, receipt moderation, gift intentions, empty states, refresh failure/recovery, supported-section visibility, admin headers, reduced motion, and long/untrusted text rendering passed.
- The two previously recorded stale test failures are resolved. The visitor-feature migration test now seeds the IDs that existed when migration 0226 ran; the Telegram test checks the current notice format and status-based moderation controls. Notification behavior and historical migrations are unchanged. `node --import tsx --test tests/guest-activity.test.ts tests/template-renaming.test.ts`: all nine tests passed, including five Activity tests and four template-renaming checks. Telegram transport is mocked; no real messages were sent.

The saved previews use synthetic records and the real Activity renderer. The temporary development-only fixture route used for inspection was removed after verification. Tilaklar previews show desktop/phone viewport and scrolled states. Full-page captures of other tabs show the fixed background only within the initial viewport; ordinary scrolling always retains the full-screen image.
