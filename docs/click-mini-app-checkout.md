# Click checkout handoff (2026-10-28)

## Code finding and fix

The studio previously called `window.location.assign(order.checkoutUrl)` after
asynchronous save/publish/checkout requests. The payment return page's
“Click orqali davom etish” was an ordinary same-tab anchor. Both keep the Click
page in the Mini App document's browsing context. There was no payment iframe or
router handoff to an external browser. These paths are consistent with the
reported Android `ERR_UNKNOWN_URL_SCHEME` when Click subsequently opens its app;
the native failure itself was not reproduced in this session.

The studio now opens `/payment/return?order=<original-order-id>` after preparing
the payment. The backend already persists the Nodze payment ID, checkout URL and
order association. The page retrieves account-owned orders and selects that ID
before falling back to session storage/the most recent order. It also retains
selection in the URL and session storage when the user changes orders.

An explicit fresh tap calls `Telegram.WebApp.openLink(checkoutUrl)` synchronously
inside Telegram. The SDK's mere presence outside Telegram is insufficient to
select this path; launch data or a known SDK platform identifies the Mini App.
Missing/unsupported/throwing SDKs show recovery instructions. Outside Telegram,
the button opens a normal new browser tab. A new tab or successful SDK call does
not prove an external browser or Click app opened.

HTTPS validation preserves the provider URL's exact original string; no Click
scheme, intent URL or additional checkout parameters are constructed. Opening,
copying and retrying the launch make no create-payment request. The existing
backend status verification, idempotency and signed webhook fulfillment remain
authoritative. Focus/visibility return and the manual refresh action retrieve
the same order's backend status.

Recovery instructions are always available: use the Telegram browser menu's
external-browser action where available, or copy this same checkout URL into
Chrome. Clipboard denial reveals a selectable read-only URL. If Click is absent,
install it and reopen the same URL, or use an available alternative on Click's
page. Return to Taklifnoma and refresh status without creating another payment.
The frontend cannot detect or promise native app-launch success.

SDK reference: [Telegram WebApp.openLink](https://core.telegram.org/bots/webapps#initializing-mini-apps)
requires a user interaction. Browser choice remains subject to the Telegram
client/version and user settings.

## Verification actually performed

- Five new focused checkout tests: synchronous exact-URL SDK dispatch; launch
  fragment/platform detection; missing/old/throwing SDK recovery without internal
  navigation; ordinary-browser fallback; rejection of custom schemes/HTTP/credentials.
- Existing payment unit/database integration suite: 15/15 pass, with mocked
  provider requests and disposable database fixtures. Covers duplicate checkout,
  lost responses/idempotency, signed/deduplicated success, stale/mismatched events,
  status reconciliation, correction after publication failure, explicit retry
  after cancellation and unchanged URL validation.
- Existing local HTTP lifecycle integration: 1/1 pass against a loopback Nodze
  stub; return parameters cannot forge success, verified webhook publishes once.
- New desktop headless Chrome browser QA: 1/1 pass, covering three modes
  (mocked Telegram bridge, unavailable bridge, ordinary browser). At 390×844,
  checks no automatic launch, active user gesture, exact URL dispatch, throwing
  bridge recovery, clipboard-denied manual copy, original order selection after
  reload with storage unavailable, manual status refresh, no checkout creation,
  no page errors or horizontal overflow. All payment responses and native
  dispatches are mocked; this is not an Android emulator or physical device test.
- Web TypeScript check and scoped diff whitespace checks pass.

Run the browser check with `node --test tests/payment-checkout.browser.mjs`.
Install/provide Playwright and Chrome; `PLAYWRIGHT_MODULE_PATH` can point to an
existing Playwright package. It starts an isolated local Next server on port
3103, disables database/provider credentials, intercepts payment APIs, blocks
external requests and restores Next-generated project files afterward.

No real Nodze/Click payment was created. No external deployment was performed.

## Android checks still required

No Android device connection or Android control tool was available in this
session. None of these device checks has been performed by the agent:

1. With an existing test order, record its order/payment IDs. Open the exact same
   checkout URL via the new Mini App button and directly in Android Chrome.
   Record device, Android/Telegram/Chrome/Click versions and Telegram browser settings.
2. With Click installed, tap “Открыть в приложении” in both paths and verify
   the intended app opens. Test Telegram's embedded-browser setting as well.
3. Test with Click unavailable or app launch blocked. Verify the external-browser
   instructions and copy/manual-copy recovery, and reopen the same URL without
   producing another order/payment ID. Menu labels vary by client language/version.
4. Return to the still-open Mini App; verify the original order is selected after
   focus/reload and “Holatni tekshirish” works. Opening/returning alone must leave
   it pending. A deliberate, separately authorized test payment must confirm only
   after verified backend status, preserving the same order/payment association.

The user's earlier manual observation that the Nodze test page opens Click
successfully is context supplied by the user, not a device test performed here.
