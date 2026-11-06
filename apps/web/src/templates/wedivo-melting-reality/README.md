# Tush va haqiqat

Private source package for **Melting Reality — Dunia Boleh Meleleh, Kita Tetap Nyata**,
capture ID `zkIhLR9Uv1c8xwbW76Sw`. No duplicate was found in the typed catalog or
existing packages during the preflight search on 2026-10-26.

Proposed ID: `wedivo-melting-reality`. Category: `wedding`. Supported event types:
`wedding` only. The captured design is explicitly a two-person wedding invitation.
Category assignment and event compatibility must be registered separately.
Proposed Uzbek catalog name: **Tush va haqiqat**; default copy is Uzbek Latin.

`renderer.tsx` exports `WedivoMeltingRealityInvitation`, suitable for the same
creator-preview/full-preview/public dispatch. `adapter.ts` is a pure typed
presentation mapper; it reads the shared contract and central preview-wish fixture,
does not change invitation data, and never supplies sample names/dates/venues.
Catalog/initial-selection callers must pass the central
`createTemplatePreviewSample("wedivo-melting-reality")` with `preview` and
`sampleWishes`; source photos are substituted only in that ephemeral mode when
there are no authored gallery URLs. Creator uploads win.

The isolated iframe source, CSS, JavaScript, exact fonts/artwork and API bridge
are in `apps/web/public/templates/wedivo-melting-reality`. See that package's
`SOURCE_ADAPTATIONS.md` and `HANDOFF.md` for field mappings, exact changes,
source gaps and release gates.

This owner intentionally did not edit shared dispatch/catalog/registry,
migrations, database or publication state. The coordinator must wire the
component, add an additive unpublished template registration, then complete the
listed release gates. Do not publish or make selectable yet.
