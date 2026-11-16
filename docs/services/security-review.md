# Services security review — 2026-11-16

Scope: Services admin APIs/editor, published directory and media, import queue and
laptop worker, standalone scraper network/browser/media paths. This is a local
source review with focused tests, not an infrastructure audit or a guarantee
against every vulnerability. Both findings below were corrected locally after
the review. No external application deployment was performed.

## P1 — DNS validation is disconnected from the download connection

Original locations: `tools/services-scraper/src/network.mjs:66` and `:110`;
`tools/services-scraper/src/website.mjs:9` is the enabled business-website entry.

The original `assertPublicUrl()` resolved a hostname and checked its returned
addresses, but returned only the URL. `Fetcher.get()` subsequently passed that
hostname to ordinary `fetch()`, which resolved it independently. An attacker-controlled
business website can change DNS between these operations, passing the public-IP
check and directing the actual HTTP request to the laptop's loopback or private
network. The worker enables website enrichment for every import. This requires
an administrator to import a listing whose website is attacker-controlled; it
does not require the website owner to have administrator access themselves.
The current allowed ports restrict requests to HTTP/HTTPS defaults or 80/443.

Confirmed using a process-local synthetic DNS resolver and a temporary HTTP
server bound only to `127.0.0.1:80`: validation returned a public address, the
connection resolved to loopback, and the existing Fetcher received the local
fixture response. No real internal service was accessed. The isolated probe is
in `.tmp/services-security-probes.mjs` (ignored local scratch).

Resolution: downloads now use Node HTTP(S) connections with a pinned lookup
containing only the addresses validated for that connection. Original hostnames
and normal TLS certificate/SNI verification remain intact. Every redirect and
retry resolves and validates again. Encoded and decoded download sizes remain
bounded. Chromium now uses an automatically started authenticated loopback proxy
that applies pinned lookups to HTTP requests and HTTPS CONNECT tunnels, including
redirects and subsequent connections. Proxy bypass for loopback is disabled;
WebSockets, QUIC and non-proxied WebRTC UDP are disabled. Browser and proxy close
together, including failed initialization. The loose consent-domain prefix was
also replaced with explicit Google consent domains.

## P2 — Collector isolation and environment inheritance are too permissive

Original locations: `tools/services-scraper/src/browser.mjs:23` and
`scripts/services-worker.mts:97`.

Original browser launch options did not enable `chromiumSandbox`. Playwright documents
that it defaults to false; the installed implementation adds `--no-sandbox`
unless the option is true. Separately, the collector was spawned without an
explicit `env`, inheriting the worker's database, R2 and other configured
application secrets despite only needing public network access and checkpoints.
Browser launch also did not supply a reduced environment.

These settings increase the consequences of a browser/collector compromise.
They do not by themselves let ordinary website JavaScript read environment
variables; no browser code-execution exploit or credential extraction was
attempted or demonstrated.

Resolution: Chromium sandboxing is explicitly enabled for every browser channel
and fallback; startup fails if no sandboxed browser can launch. Both collector
and browser receive a positive list of essential OS/browser environment settings.
Database/R2/Telegram secrets, role configuration, injected Node options, external
proxy variables and TLS/library overrides are excluded. Database/R2 access stays
in the trusted parent worker. Environment filtering does not isolate files: stronger host isolation would
also use a separate OS identity or container without access to application
environment files. The configured Windows/Chrome laptop flow passed a real
collection using this filtered child-process environment.

References: [Playwright launch options](https://playwright.dev/docs/api/class-browsertype#browser-type-launch),
[Node.js execFile environment](https://nodejs.org/docs/latest-v22.x/api/child_process.html#child_processexecfilefile-args-options-callback).

## Checks that passed

- 31 focused Services, admin authorization/origin/audit, and media unit tests.
- All 30 standalone scraper tests.
- One local Services HTTP integration test using disposable records, covering
  anonymous/ordinary/stale-admin rejection, origin checks, private draft/media
  access, explicit import review, publication snapshots, stale revision rejection,
  unpublishing/archiving, unsafe image references, queue actions and audit writes.
  The test cleaned up its own database records and uploaded object.
- Both `pnpm audit --prod --json` and scraper `npm audit --omit=dev --json`
  reported zero known vulnerabilities at review time.
- Public rendering reads published snapshots; raw import evidence remains admin
  data. Text is rendered through React escaping, links restrict schemes, SQL is
  parameterized, collector execution uses argument arrays without a shell, and
  decoded/re-encoded images are served as WebP.
- Next image optimization is restricted to bundled image paths, preventing
  optimized copies of private API media from becoming a separate cache path.
- Application environment files are ignored; only `.env.example` is tracked.

## Fix verification

- All 40 scraper tests passed, including 10 new network/environment/browser
  regression tests. They cover pinned DNS, private/mixed DNS, alternate IP
  spelling, redirect/retry rebinding, retained Maps share handling, bounded
  decompression/timeouts, proxy authentication, private HTTP/CONNECT rejection,
  pinned forwarding/tunnels, filtered real child-process environments and
  sandbox/failure-cleanup configuration. Fixture adapters do not contact real
  private services or arbitrary public endpoints.
- All 25 focused Services/admin/allowlist/audit tests passed after the fix.
- Web TypeScript checking passed.
- Real Parvoz collection from the original Yandex Share URL completed with
  Google, Yandex and website sources plus two Yandex-only downloaded photos.
  A second real collection exercised the worker's exact filtered child-process
  environment without claiming a queue job or writing database/R2 records.
- No dependency was added and no new infrastructure configuration is needed.
  Stop the old laptop worker with Ctrl+C and restart `pnpm services:worker` to
  use the fix. These changes run on the laptop and do not require a Vercel deploy.

Published user services were not edited during the review or fix. Existing
concurrent pagination edits were left untouched. These checks establish the
specific fixes above, not an absence of every possible security issue.
