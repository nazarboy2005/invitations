# Jonli vodiy

Proposed Uzbek catalog name: **Jonli vodiy**. Internal ID:
`wedivo-lanskap-yang-hidup`. Proposed category: `wedding`; supported event:
`wedding` only. Registration, additive migration, catalog/public renderer routing,
database application and publication are reserved for the coordinator. This
package is private and unselectable.

`renderer.tsx` is the same iframe renderer for creator preview and public display.
`adapter.ts` maps the shared typed invitation contract; it never mutates it.
Only catalog/initial-selection calls with `preview && sampleWishes` can use source
preview photos in otherwise empty gallery slots. Creator uploads take precedence;
public payloads have neither source portrait photos nor sample wishes.

The complete source package, mapping, unsupported-field inventory, source hashes,
translation decisions and verification evidence are documented in
`apps/web/public/templates/wedivo-lanskap-yang-hidup/SOURCE_ADAPTATIONS.md`.
