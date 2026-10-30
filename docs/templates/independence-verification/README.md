# Template independence verification — 2026-10-30

The cleanup removes template business attribution entirely. No replacement
business identity is introduced. It also neutralizes catalog display names and
public preview/selection URLs. Historical IDs and templateData namespaces remain
unchanged so saved invitations, browser drafts, pricing and event support continue
to work. Old preview bookmarks redirect to the corresponding neutral URL and keep
their other parameters. Examples: `taklifla-tovus` → `tovus`,
`invitate-palov` → `osh-ziyofati`, `wedivo-pulau-sehati` → `kongillar-oroli`.
Source directories and private implementation symbols retain their provenance.

Removed credits include the previous providers' text and existing Visol credits.
Localized page metadata and the corporate preview sample no longer use the
previous provider's business name. Creator-authored invitation content is not
rewritten.

The shared preview venue photograph and the fonts requested by unpublished
designs 15–17 are served locally. The unpublished Wedding design's two missing
decorative photo sources return 404 and its location video returns 403; those
broken elements are omitted. Available captured artwork and the real venue/map
section remain. Fetch results and the retained photograph's hash are recorded in
`../dependency-assets.json`. No unrelated substitute imagery is introduced.

Captured sample venue iframe URLs are absent from active HTML. Maps still use
the shared application renderer and its configured Yandex keys. The removed
Tilda fallback and form-service scripts are not loaded. Proxy returns 404 for
archival source HTML, the unused Wedding analytics script, and those two Tilda
scripts. The live Anor source frame, scripts, fonts, images and source assets
remain available. Original captures and source evidence are preserved.

Validation:

- Production build and TypeScript check passed.
- `browser-report.json`: all 90 published designs checked through the real Next
  preview route with their sample payloads, opening and scrolling; no provider
  links/requests, business credits or captured sample maps. The platform Telegram
  SDK and configured Yandex API remain intentional service dependencies. External
  requests were recorded and blocked during inspection; this is not a provider
  uptime/billing test.
- Browser checks also verify archival 404 responses, the live Anor source frame,
  and canonical redirection of a historical branded preview link.
- `package-report.json`: all 120 packaged entry pages initially loaded, including
  unpublished designs, with no external resource requests.
- Regression checks cover public aliases, their uniqueness, existing saved IDs,
  locally served sample media, credits and archival isolation.
- `test-comparison.json`: the broad suite has 851 tests, 792 passing and 59 failing.
  A clean checkout of baseline `c49869f` had 60 failures. There are no new failing
  test names; one stale Green Garden source-format assertion was corrected. The
  remaining failures predate this cleanup. Source comparisons allow only the
  approved removal of provider credits/metadata in addition to the earlier map
  adaptation; raw capture buffers and artwork/font hashes remain unmodified.
- Migration `0203_neutral_template_names.sql` was applied to the configured
  database. IDs, publication flags, prices and currency were compared before and
  after and stayed identical. No external application deployment occurred.

Re-run initialized browser checks against a local Next server:

```powershell
$env:TEMPLATE_AUDIT_ORIGIN = 'http://127.0.0.1:3001'
node --import tsx tests/template-independence.browser.mts
```
