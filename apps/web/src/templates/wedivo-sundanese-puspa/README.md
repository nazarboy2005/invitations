# Sundanese Puspa · Melati Bog‘idagi To‘y

Private, isolated adaptation of the captured Wedivo template source. The original capture is kept separately and unchanged. Local artwork and exact font files are packaged under `apps/web/public/templates/wedivo-sundanese-puspa/`.

The Uzbek Latin catalog name is **Melati Bog‘idagi To‘y** (“Wedding in the Jasmine Garden”), reflecting the source’s jasmine garland and bamboo garden motif. Uzbek Latin is the default copy. Source Indonesian copy is translated in the isolated adapter layer; source captures and composition remain unchanged. Dynamic invitation text comes from the selected invitation locale. Other enabled locales are switched through the compact language control.

## Current adapter behavior

- `renderer.tsx` provides a single iframe renderer for creator preview and public display. Its path is not yet wired into shared template dispatch.
- `adapter.ts` adapts the invitation contract through the existing legacy data mapper. The bridge binds couple names, hosts, greeting/message, date and timezone, venue/map links, schedule, story, dress code, gallery, and music.
- RSVP uses the public RSVP endpoint. The source party-count input is removed and attendance sends party size 1 or 0. Guest name and optional message are retained.
- Wishes use the public wishes endpoint and load approved wishes. The source amount form and physical gift address are removed; the existing private receipt upload UI is mounted in that source section.
- The source video section is hidden because there is no video field in the invitation contract. The capture's sample invitation media and private demo text are removed.
- Form labels and status messages support Uzbek Latin, Uzbek Cyrillic, English, and Russian. The source and wrapper honor reduced-motion preferences.
- Catalog preview uses only `catalog/preview-sample.json` through the shared adapter and existing preview music; sample content is not persisted.

## Remaining gates

This draft must stay unregistered and unselectable. Shared creator/public renderer dispatch, typed catalog entry, event-type compatibility enforcement, additive database migration/publication, and an authentic opening-page catalog artwork still need coordinator integration. The package also needs browser visual review and full creator/public integration verification before those gates can pass.
