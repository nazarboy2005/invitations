# Template guest actions and homepage sharing

## Result

- Full previews show a small burgundy spinner centered on a warm white background with “Taklifnoma ochilmoqda…” until the frame, fonts, and visible images are ready. This replaces the earlier cover-artwork/logo loading screen for both sample and creator previews. Reduced-motion mode keeps the indicator still. Catalog embeds and cover workers retain their existing behavior.
- The homepage has explicit Open Graph metadata and a `summary` Twitter card: **Fotiha — Elektron taklifnomalar**, **Yaxshi kunlar uchun chiroyli taklifnomalar.**, and the existing Fotiha mark on a 256 × 256 square background. The image is `/share/fotiha-logo-v1.png`. The layout is designed for a compact thumbnail; Telegram controls its final presentation.
- Each opened sample preview chooses from the full available library, including bundled tracks and active library uploads. Consecutive previews avoid the previous track when alternatives exist. Adapters receive that selection in the temporary invitation data. Creator music and uploaded recordings remain unchanged. Recording attribution is available in previews.
- At the user's request, calendar buttons retain their original template-native behavior, including direct `.ics` downloads. The shared provider chooser and its calendar-file implementation have been removed. The original template source handlers are unchanged.

The live homepage was read using a Telegram crawler user agent before the change: it already returned the Fotiha page title but had no Open Graph image or social metadata. The reported Quran preview was not reproduced in the served HTML; stale Telegram metadata is a possible explanation. No deployment or Telegram account action was performed.

## Payment audit

The existing production payment path already derives new order amounts from the platform-managed database price, persists immutable order details, authenticates provider notifications, and checks payment ID, order ID, currency, and exact amount before granting publication. Browser return parameters do not grant payment status. No production payment change was needed for the reported link-price concern.

Added explicit regression cases for signed success notifications reporting **0.01**, **1.00**, or **999.99 UZS** against a **1,000 UZS** order. Each returns `PAYMENT_MISMATCH`, leaves the order pending and invitation draft, and creates no publication entitlement. HTTP checkout with `expectedAmountMinor: 1` returns `409 PRICE_CHANGED`. Provider calls in these tests use a stub; no live payment is created.

## Verification

- `pnpm typecheck` and final `pnpm --filter @taklifnoma/web exec tsc --noEmit`: passed.
- Initial calendar implementation unit checks passed before the user requested its removal. The chooser-specific unit tests have also been removed; original template calendar handlers are retained.
- Focused PostgreSQL payment integration (`unpaid direct publish` and `wrong amount`): **2 passed**, including the new underpayment cases.
- `tests/payments-http.integration.ts`: **passed**, covering authentication/origin checks, tampered price, fake success return parameters, signed webhook publication, and idempotent delivery.
- `node tests/preview-guest-actions.browser.cjs` checks the minimal loading indicator and music across Anor, Atlas, Oq Kabutar, Stained Glass, Velvet Royale, and Pulau Sehati. After restoring native calendar behavior it verifies Anor downloads an `.ics` directly, and a creator draft retains its chosen recording and exports its own names and saved event time. No shared calendar chooser is mounted. See `browser-report.json` and the PNG captures; `preview-loader.png` shows the current loader.
- Before the calendar rollback, `pnpm test`: **708 passed, 179 failed, 1 skipped**. An isolated checkout of the original HEAD, using the same dependencies/assets, produced the **same 179 failing test names** (**705 passed, 179 failed, 1 skipped**). There were no new failures. Existing failures include missing original reference captures and stale assertions. See `suite-comparison.json` for that comparison. Two added chooser-specific unit cases were subsequently removed with the reverted feature.

The earlier complete payment integration run also encountered a stale dashboard-summary assertion and a remote database connection closure in the final cancellation test. The focused security cases and separate HTTP integration above passed afterward.
