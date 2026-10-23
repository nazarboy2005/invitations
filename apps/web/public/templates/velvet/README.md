# Invitate Velvet

Exact capture source: `Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz/velvet.html`, resolved from the Invitate capture manifest. The original capture remains untouched. This package includes the captured HTML/CSS/source interaction script, the Velvet opening and background videos, source music, image assets, shared curtain background, locally captured font files, and locally captured animate.css. The isolated HTML has local asset references and platform binding targets; its adapter is `apps/web/src/templates/invitate/velvet-adapter.ts` and iframe bridge is `bridge.js`.

The adapter maps shared invitation people, personalized greeting, message, event date/timezone, venue and map, repeatable program, dress code, gift details, creator photo gallery/Telegram link, RSVP response and music. Creator fields replace source sample names, date, venue, program, and RSVP values. The RSVP endpoint is `/api/public/invitations/{id}/rsvp`; song requests are stored as RSVP notes. Empty optional sections are hidden. Built-in controls are localized for Uzbek Latin, Uzbek Cyrillic, English, and Russian. Reduced motion is covered by captured source styles and app CSS overrides.

The catalog record remains unpublished and the existing migration awaits coordinated numbering. Portrait `preview.webp` is a 450×800 capture of the source-video opening overlay before invitation details; capture provenance and hashes are recorded in `preview.provenance.json`.

Remaining release checks: full browser interaction and responsive review, save/reopen, public route/API behavior, source-to-app visual comparison, localized UI sweep, and final migration/catalog database verification. No publication or external deployment has been performed.
