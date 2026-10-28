# Velvet Royale source adapter

Reference: https://e-invitation.uz/preview/velvet-royale/; catalog identity:
`royal-burgundy-edition`. The 2026-10-28 correction supersedes the earlier
claim that the simplified renderer reproduced the full source.

## Source package

- `template.html` contains the reference's actual rendered section tree and Vue
  scope attributes, extracted from the live opening state. Personal sample text,
  date/time, card, phone, venue, gallery sources, map URL and audio are cleared.
  Asset URLs point to this package. No reference app runtime runs in the iframe.
- `index.html` loads the untouched scoped `source/reference/VelvetRoyale.Bur_z5Os.css`
  directly. The old scope-stripped `renderer.css` is removed. The source
  envelope SVG, engraving mask, seal layers, chevrons, botanical dividers, doves,
  quote blocks, photo album, calendar, rings, map corners, table card, gift card,
  contact cards, RSVP paper, family wreath and closing artwork remain intact.
- `source/reference/Cn3YHNzc.js` preserves the current template component module.
  It is reference evidence, not an executable import of the provider's site.
  The older `CjKUbLp8.js` capture remains untouched. `source/provenance.json`
  records hashes for all packaged source assets and fonts.
- `source/reference/C94ZD2ww.js` is the unchanged particle engine used by the
  reference calendar. `source/labels.json` extracts only the template's built-in
  labels and decorative quotes for the four approved locales. Those defaults
  never enter saved invitation data. The provider's wider runtime is excluded.
- `adapter.css` supplies the document reset normally provided by the host site,
  platform language/music controls, calendar/program links, reduced motion and
  Cyrillic font fallback. The fallback is the source registry's Marck Script,
  packaged locally; original fonts and artwork remain unchanged.

## Data and interaction bridge

`renderer.js` binds the shared payload supplied by
`apps/web/src/templates/velvet-royale/renderer.tsx`. Creator preview, full preview,
public display and personalized dashboard cover generation use that renderer.

| Visible content | Shared source |
| --- | --- |
| Names, seal initials, greeting, invitation wording, family | Active locale's invitation content and resolved guest greeting |
| Quote/story blocks | Authored story chapters, preserving IDs and order; source decorative quotes when no chapters exist |
| Calendar, time, countdown and calendar link | Invitation instant and event timezone |
| Repeatable program | Ordered program IDs, times and active-locale titles |
| Photo opening and horizontal album | Creator gallery, captions and alt text; authentic source images only in fixture previews |
| Venue, address and map | Shared venue coordinates and creator Google Maps link |
| Gift card and copy | Enabled shared gift card number/holder; no sample bank/card |
| Contact cards | Shared phone, Telegram and Instagram |
| RSVP and wishes | Existing public APIs, resolved guest token, party limit and moderation |
| Music | Global catalog preview track or creator-selected audio; source sample audio is excluded |

The opener retains the idle engraving wave, animated wax layers, released seal,
source video and final 1.4-second reveal. It prevents scrolling before opening,
unlocks/focuses the hero and runs the source hero video. Video failure uses the
same final reveal, with a 15-second loading fallback. The reference's four reveal
classes, delays, viewport threshold and section progress transforms are restored.

The calendar restores its 750 ms lead-in, 70 ms day lighting sequence, event-day
pulse and the original three particle bursts. The album retains arrows, swipe,
keyboard navigation, active indicators and 3.8-second automatic advancement,
pausing for focus, gestures, hidden tabs and reduced motion. Source artwork stays
visible without creator photos; an empty creator album remains hidden.

Google Maps replaces the reference's Yandex target inside its original floral
frame. Places links retain their place ID and use stored coordinates for the
embed. Full manual Google links derive an embed from their query where possible;
short links retain the exact navigation URL without inventing a pin. The
server-only `GOOGLE_MAPS_API_KEY` remains in the editor's Places API routes and
is never sent to this renderer. Google navigation and these embeds need no key.

RSVP stores phone input in the existing RSVP note, respects the attendance
deadline and party limit, and sends wishes through moderation. Preview submits
never write. The music control reflects actual playback; a guest pause survives
locale updates and unrelated clicks. Reduced motion opens immediately, displays
content and the selected date, and suppresses video, particles and transitions.

## Optional source field

The reference's table card is preserved, but the shared guest editor, storage
and resolver have no seating-assignment field. Its number is cleared and the
section is hidden rather than publishing the reference's sample table. This is
an existing platform capability gap, not a missing drawing/animation. No new
guest-management requirement or table number is manufactured by this adapter.

Verification evidence is under `docs/templates/velvet-royale-verification/`.
Publication migration `0168_publish_complete_velvet_royale.sql` changes only this
template's availability and ensures its wedding category/event assignment;
current administrator pricing is preserved. No external application deployment
or live payment activation is part of this change.
