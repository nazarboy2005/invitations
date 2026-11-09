# Upload and guest security hardening

Personalized dashboard covers were already removed from the UI. The leftover
`POST /api/invitation-covers` now returns **410** without reading its body,
querying the database or starting a browser. Its renderer is removed. Static
invitation previews and PNG exports remain available; their Chromium deployment
traces are still checked by the build.

## File handling

Creator uploads keep the existing prepare → upload → complete flow. Signed R2
uploads bind the exact declared size and content type for five minutes. Completion
reads a single bounded object snapshot, validates it, and writes those exact
validated bytes to a separate server-owned key. It never checks one object then
copies a potentially different version. Retrying completion is idempotent.

Images are fully decoded with a 64-megapixel limit and a ten-second native
processing timeout, oriented, stripped of metadata and re-encoded. Creator
gallery formats remain JPEG, PNG and WebP. Audio is parsed for an actual audio
stream, container, sample rate, channels and duration, rather than only a header.

Receipts accept **JPEG, PNG, WebP, GIF, AVIF, TIFF and PDF**, up to 5 MB.
The first frame/page of image formats is saved as WebP, with its filename/MIME
updated to match. TIFF/AVIF do not need native browser viewing support. SVG and
arbitrary `image/*` inputs are not enabled. HEIC support is not promised by the
bundled decoder. Unsupported/corrupt files get a useful error, never a misleading
success. Creator files remain capped at 15 MB.

PDFs are parsed in an isolated worker with a ten-second deadline and a bounded
JavaScript heap, limited to 50 pages, and rebuilt from visual pages. Form values
are flattened before scripts, attachments and interactive actions/annotations
are removed. They remain private, attachment-only downloads with a sandbox CSP.
This is structural validation and active-content reduction, **not antivirus
scanning or a guarantee against malicious PDF/image decoder inputs**. No uploaded
receipt is proof of payment. Owners and authorized admins retain existing access.

## Budgets and user experience

All budgets are shared across server instances. Per-owner advisory locks protect
storage reservations against concurrent requests. Completion accounts for the
actual normalized size. Guest receipts count toward storage, but do not consume
the creator's daily upload count. Existing approved files are never deleted just
because an account reaches a quota.

| Server environment setting          | Default                        |
| ----------------------------------- | ------------------------------ |
| `MEDIA_ACCOUNT_MAX_BYTES`           | 1073741824 (1 GiB per owner)   |
| `MEDIA_DAILY_UPLOAD_LIMIT`          | 300 creator uploads per day    |
| `RECEIPTS_PER_INVITATION_MINUTE`    | 60                             |
| `SUBMISSIONS_PER_INVITATION_MINUTE` | 300 per submission type        |
| `SUBMISSIONS_PER_INVITATION_DAY`    | 10000 across guest submissions |

Settings are optional, positive integers, and server-only. Defaults work without
adding Vercel variables. Ten simultaneous recent pending uploads are allowed;
prepare/content/complete endpoints also have per-account minute limits.

Aggregate guest budgets are charged only **after** Turnstile succeeds, so missing
tokens cannot exhaust the invitation budget. Existing per-IP limits, wish
moderation, two wishes per visitor and one editable RSVP remain in place. Cookie
clearing still cannot establish a person's real identity on an anonymous link.

Telegram notifications remain durable and are paced across workers: one per
second to a chat, up to twenty per second globally. Deferrals do not consume send
attempts or reject a guest submission. Ordinary short bursts get one bounded
request-background retry; sustained bursts need the existing independent worker.

View tracking skips excess analytics writes quietly (30 per invitation/IP/minute,
120 per IP/minute). It does not add a CAPTCHA or block viewing an invitation.
Expired viewer identifiers are removed in bounded batches after 90 days; aggregate
view counters remain. Published invitation retention is unchanged.

## Deployment and maintenance

Migration `0230_security_resource_limits.sql` adds only indexes for usage and
cleanup queries. It was applied to the configured database during this task.

Run the existing `pnpm telegram:notifications` under a supervisor; it now also
cleans abandoned uploads once per minute. Alternatively, trusted scheduling can
call `/api/internal/guest-notifications` for queued messages and
`/api/internal/media-cleanup` for storage cleanup with
`Authorization: Bearer <CRON_SECRET>` (a server-only random secret of at least 32
characters). The cleanup endpoint processes at most 20 expired/rejected uploads
and 20 source-cleanup jobs per call. It is not automatically scheduled/deployed
by this change.

Failed/abandoned pending objects are removed after one day. Approval also queues
a second source deletion ten minutes later, after the signed URL expires, to
catch a source recreated through an upload replay. Ready assets are preserved.
R2 buckets must be private. As additional protection, configure R2 lifecycle
expiry on unverified `creators/` and `platform-music/` prefixes, excluding
`verified/` and `receipts/`. Infrastructure permissions/lifecycle configuration,
backups, MFA and spending alerts require deployment-account verification.

**Next.js remains pinned at 16.4.2 by user request.** The optimizer now accepts
only bundled raster artwork under `/images` and its versioned alias, without query
strings, redirects, remote sources, uploads or API responses. This narrows the
exposed input surface; it does not replace upstream security patches. See the
[official SVG advisory](https://github.com/vercel/next.js/security/advisories/GHSA-7qx7-33qx-rqx2).

## Verification

Focused tests cover six receipt image formats, malformed files, decoded pixel
limits, PDF scripts/attachments, parsed WAV/audio rejection, R2 signed headers,
source replacement, shared quotas under concurrency, cooldowns, viewer retention,
storage cleanup and cover retirement. The existing Turnstile browser test checks
JSON/multipart payload preservation and cancellation/retries.

Final verification passed: 19 focused tests, the full security HTTP suite, the
isolated PDF-worker HTTP check, and the production dashboard/catalog browser
cache checks. Typechecking, production build, deployment tracing and
`git diff --check` passed. The production optimizer returned 200 for bundled
raster artwork and 400 for API/SVG inputs. `pnpm audit --prod` reported zero
registry advisories; this does not supersede the official Next.js advisory above.
Disposable test accounts/files were removed; no real Telegram messages were sent.

`tests/security-hardening.integration.ts` runs against a dedicated loopback Next
server on port 3024, with `tests/fixtures/security-test-interceptor.cjs` preloaded
and disposable test configuration. CAPTCHA verification and all Telegram sends
are intercepted only in that test process. It uses disposable database records
and local files, verifies private receipt access, duplicate uploads, immutable
approval, corrupt-file rejection, RSVP edits, wish limits and bounded views, then
deletes its fixtures. Production has no test bypass.
