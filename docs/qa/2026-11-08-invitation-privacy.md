# Invitation privacy verification

Scope: repository changes and an isolated local Next server. No external application deployment or real Telegram messages.

## Findings and changes

- Uploaded media previously redirected to a signed object-storage URL containing the creator's internal account ID in its path. Media now streams through the authorized application endpoint, including byte ranges. Storage URLs, credentials, object keys, and provider metadata stay on the server. Late stream failures also expose only a fixed error.
- Public invitation HTML and React payloads now use a schema-filtered projection. Disabled contacts, gallery, music, gift details, dress-code content, disabled content languages, stale template data, and unknown template-data properties are excluded. Saved creator data remains intact; deliberately enabled public contacts and gift details still render.
- API error responses only trust the application's explicit public error classes. Unexpected upstream errors cannot supply response messages, codes, or fields. Public page loading also replaces raw database/validation failures before framework logging.
- Application error logs no longer include raw cover error text or arbitrary upstream error names/codes. Development request/fetch/function/browser logging is disabled. Referrer policy is `no-referrer` to avoid sending invitation or guest-link URLs as referrers.

## Verification

- TypeScript check passed.
- 24 focused privacy, authentication, administration, cover, and storage tests passed. Coverage includes injected secret-bearing errors, R2 streaming/ranges/failures, public field filtering, preservation of authored public fields, and projection of every registered template.
- HTTP/browser integration passed against a disposable invitation and account. Checked HTML, React payloads, guest APIs, response URLs/headers, browser console, and 39 browser response bodies. No checked configured secret, fixture owner ID, Telegram ID, or hidden-content marker appeared. Anonymous activity and private-media access were denied. Fixtures were removed.
- Scanned 2,114 source/public/generated browser files for ten configured secret values and Telegram token patterns: no matches. Secret values were not printed.

Broader test runs also found unrelated failures in the current working tree: Telegram message wording, missing `ivory-rose-card` share artwork, language-removal fallback, and gift default expectations. Those implementation paths were not changed by this task.

## Deployment boundary

These fixes are local. Hosting/CDN access logs and historical logs were not inspected or changed. Public invitation content, intentionally enabled contact/payment details, and a visitor's own guest/session credentials necessarily remain visible to that visitor's browser; creator account credentials and identifiers must not be included in public invitation data.

The media proxy transfers file traffic through the application server instead of redirecting it to object storage. Production hosting capacity and transfer usage should account for that path.

## Repeat checks

```powershell
pnpm typecheck
pnpm exec tsx --test tests/invitation-privacy.test.ts tests/cover-error.test.ts tests/cover-storage.test.ts tests/local-storage.test.ts tests/admin-security.test.ts tests/auth.test.ts
```

For HTTP/browser verification, start a dedicated local server with `APP_URL=http://127.0.0.1:3018` and a separate build directory, then run:

```powershell
node --env-file=apps/web/.env.local --import tsx --test tests/invitation-privacy.integration.ts
```
