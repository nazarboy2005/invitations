# Empty optional invitation sections

Anor's gallery bridge explicitly kept Lahzalar visible whenever `preview` was
true. An authored Studio draft therefore showed the heading and gallery controls
with no photos. Its public branch already hid an empty gallery. The same preview
override existed in Baraka, Ko‘ngillar oroli, Riwayat and Oq yasmin.

The audit also found program/contact containers whose children were hidden while
their headings remained, RSVP sections that hid only the form or ignored the
disabled setting, and family-signature containers without family names.

Fixes are in the platform adapters, preserving the captured template design and
decorative artwork. TemplateFrame now enforces HTML `hidden` consistently when
source CSS specifies another display mode. Oq yasmin retains its gallery card
prototype so clearing photos and adding them again works without reloading.
Catalog sample content remains ephemeral and separate from authored drafts.

## Verification

- `inventory.json`: all 122 renderable web templates, including unpublished
  designs. Each used authored names, invitation text, date and venue, with
  optional content empty and visitor features disabled. Checked Studio preview
  and the same packaged renderer with public payloads in an isolated local host.
  No remaining unexpected optional-heading matches. Eleven designs received an
  additional focused pass after the final family-container and inspection changes.
- The browser audit uses computed display, rather than assuming a `hidden`
  attribute removes layout. It checks native section hooks, optional containers
  and known optional headings. Designs using div-based layouts also received
  adapter source inspection; a zero semantic-section count is not proof of a
  blank invitation. Zaytun's fixed thank-you passage titled “Tilaklar” remains
  because it is template copy, separate from the optional guest-wishes feature.
- `node tests/optional-sections.browser.cjs`: populated → empty → restored
  checks in Studio and public modes across all four supported locales. The real
  bridge scripts and the shared TemplateFrame visibility rule are exercised.
  See `regression-results.txt` for the assertion count and case inventory.
- `pnpm typecheck`: passed. Five focused Anor initialization/wishes and shared
  contract-slot tests passed. `git diff --check`: passed.

Older source/provenance tests are not green in this checkout: the Anor source
comparison cannot find the external reference directory; the broader affected
template suite returned 31 passes and 18 failures, involving missing external
captures and stale names/publication assertions after template renaming. These
tests were not weakened or rewritten to hide those failures.

Qandil's existing source canvas `getContext` error occurred before these fixes and
again during the broad audit; its optional section visibility checks completed.
No database content, actual invitation publication, external deployment or
payment configuration was changed.

Rerun the broad local audit with:

```powershell
node --import tsx scripts/templates/audit-empty-sections.mts
```

Set `STUDIO_AUDIT_TEMPLATES` to comma-separated canonical IDs for a focused run.
Raw observations are retained locally and ignored; the compact inventory is the
review artifact.
