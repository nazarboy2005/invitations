# Gulbarglar sehri

Proposed Uzbek catalog name: **Gulbarglar sehri**. The source reference remains
Wedivo “Peony Paradise — Mekar Pelan-Pelan”; the internal source-derived ID is
unchanged. Uzbek Latin is the default presentation language, including the
iframe/document name and controls. Other approved locales remain explicit
choices. See the translation record in `SOURCE_ADAPTATIONS.md`.

Proposed catalog ID: `wedivo-peony-paradise`. Category: `wedding`.
Supported event types: `wedding` only. These are separate metadata assignments.
This design was absent from the typed catalog and packages when this task began.

The complete source floral/silk design and motion engine are isolated in
`apps/web/public/templates/wedivo-peony-paradise`. The typed data adapter and
shared preview/public iframe renderer are here. Source asset hashes and every
adaptation/gap are recorded in that package's `provenance.json` and
`SOURCE_ADAPTATIONS.md`.

**Not ready for selection or publication.** Shared catalog/registry, migrations,
database and publication were intentionally left to coordinator
`01a1799d-f44a-77b1-8491-802254dc23d2`, per this task's scope. An additive private
registration migration and eventual renderer wiring are needed. No migration
sequence is reserved here. No application deployment or payment activation.

`WedivoPeonyParadiseInvitation` accepts the same invitation/locale/guest/preview
inputs as the existing iframe renderers. `fullPreview`, `qaMobile`,
`qaReducedMotion`, `catalogMusic`, `sampleWishes` and `silentPlayback` are
supported. Its in-frame language buttons change only the presentation locale.
An authored data change starts a fresh isolated document to dispose source
timers, observers, listeners and audio safely; it does not change saved data.

The adapter never creates sample invitation copy. Callers may pass the central
`createTemplatePreviewSample` only for catalog/initial-selection previews.
The canonical fixture's empty photo slots remain empty: the reference's real
demo couple uploads are excluded, and no unrelated media is substituted.

Checks (2026-10-26): focused tests 7/7; all three JS syntax checks;
template-scoped TypeScript check; nonvisual DOM initialization for four locales,
long names, empty optionals and six story chapters/two gallery photos. Full web
typecheck encountered an unrelated generated `.next/dev/types` declaration
error; the targeted check passes. Browser access subsequently recovered: the
actual source and Uzbek opening were compared at phone and desktop sizes, the
real 390×843 portrait opening is `preview.jpg`, and reduced-motion opening,
long-name wrapping, couple switch, silk palette, gift knot, preview submission
messages and Uzbek native validation were checked. Source-field completeness,
full motion/service/locale QA, actual service persistence and creator save/reopen
remain release gates. See the detailed evidence and limitations in the package.

Focused suite: `pnpm exec tsx --test tests/wedivo-peony-paradise-template.test.ts`.
