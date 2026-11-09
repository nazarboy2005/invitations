# Activity redesign

The owner Activity page uses responsive full-bleed blush rose-and-silk artwork, a large serif heading, burgundy section tabs, translucent summary cards, and coordinated response, wish, receipt, and gift-intention panels. The existing site navigation is unchanged. Assets are local WebP files; generation prompts are recorded in `image-generation.json`.

## Verification

- `pnpm typecheck` passed.
- Eighteen browser checks passed using intercepted synthetic API responses, with no account, invitation, payment, or database changes. See `verification.json`.
- All four sections were checked at 320, 390, 600, 701, 768, 1024, 1280, and 1672 pixels, including templates with RSVP notes. No horizontal document overflow or browser exceptions occurred.
- Search, both response filters, copying, keyboard tab navigation, wish filtering/approval/deletion, delete cancellation, receipt moderation, gift intentions, empty states, refresh failure/recovery, supported-section visibility, admin headers, reduced motion, and long/untrusted text rendering passed.
- `node --import tsx --test tests/guest-activity.test.ts`: three passed, two existing failures. The historical visitor-feature migration test expects renamed template IDs to match an older migration; the Telegram message test expects an older message format. Those tests and their implementation dependencies are unchanged by this redesign.

The saved previews use synthetic records and the real Activity renderer. The temporary development-only fixture route used for inspection was removed after verification. Full-page mobile captures show the existing fixed bottom navigation at the browser viewport boundary.
