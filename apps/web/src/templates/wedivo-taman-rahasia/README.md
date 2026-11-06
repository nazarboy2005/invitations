# Sirli Bog‘ — Wedivo Taman Rahasia: Di Balik Gerbang

Proposed Uzbek catalog name: **Sirli Bog‘**. Default visible and accessible copy
is natural Uzbek Latin; Uzbek Cyrillic, English and Russian remain available.
The source's garden/chapter metaphors are translated rather than replaced with
generic platform copy. Long navigation labels wrap inside the original stone
rail; source artwork, font families, composition and motion remain unchanged.
The Indonesian source title is retained only as provenance. These translation
choices implement the confirmed Uzbek-default requirement.

Proposed stable ID: `wedivo-taman-rahasia`. Category: `wedding`; supported event
types: `wedding` only. This exact design was absent from the typed catalog and
existing packages at the start of this task. No shared catalog, registry,
migration, database, publication, deployment or payment changes belong to this
package. The coordinator must add an unpublished registration migration and
the renderer entry before app-route integration can be verified.

The selected embedded-source capture is
`Wedivo/Web invitations/templates/gLoUUgh7ocbBu09nZsFQ/index.html` under the
root reference archive. `public/templates/wedivo-taman-rahasia/dependencies.json`
records its unchanged SHA-256 and every localized dependency. The eight exact
template-owned JPEGs and all requested Cinzel, EB Garamond, IM Fell English and
Pinyon Script font files are local. The complete source DOM, SVG ornament
generator, CSS, gate/key opening, seed-packet flips, growing story vine, flower
art/interaction, sundial schedule, glasshouse gallery/viewer, stone/letter
interaction, scroll discovery and ambient animation are packaged together.

`package-source.py` reproducibly derives the production source without writing
to the original archive. It requires Python/BeautifulSoup. A full raw capture
is deliberately not duplicated into the public asset directory because the
capture contains provider demo content and a provider map credential.

`renderer.tsx` is the single iframe renderer intended for both preview and
public display. `adapter.ts` creates typed, locale-specific envelopes using
the existing contract adapter. `adapter.js` contains only platform data,
localization, privacy/optional-section rules and API connections. The source
engine starts after the first envelope; updates reload the isolated source
with open/scroll/music-pause state carried forward. Locale buttons use the
same invitation's authored locale variants. No sample fixture is imported by
the renderer: catalog/initial-selection callers supply the central fixture,
and authored/public callers supply their actual invitation.

## Source-to-contract mapping

| Source UI | Contract/service |
| --- | --- |
| Gate, hero, packets, closing names | Localized `content.people`; source bride/groom order retained |
| Gate greeting and named guest | `content.greeting` / personalized greeting and `guestName` |
| Packet parent line / closing hosts | Shared `content.hosts`; no invented per-parent data |
| Opening invitation and hidden letter | Authored `content.message`; both source-present presentations share it |
| Hero date/countdown | `startsAt` converted to an instant in `timezone`; visible date from shared formatter |
| Main pergola card | `eventLabel`/event type, date/time, venue/address/landmark |
| Calendar / map actions | UTC Google Calendar URL with event timezone; authored map URL/coordinates/address |
| Flower-clock schedule | All program IDs, order, times, localized titles and descriptions |
| Story vine | All authored story IDs/title/text, including more than the source's four example rows |
| Dress palette | `dressCode` text/style/note and source's first five color positions |
| Glasshouse photos / viewer | Authored gallery URLs, stable IDs, alt text and captions; empty gallery hidden |
| RSVP | Existing `/api/public/invitations/:id/rsvp`; yes/no/maybe, fixed party size 1/0, optional guest token |
| Wishes / tree | Approved public wishes API; POST acknowledgments say pending moderation and never add the pending wish publicly |
| Music | Optional creator URL/catalog music setting; gesture-gated preview, public attempt/retry, retained guest pause |

## Explicit source gaps and release gate

The source's separate personal seed-care anecdotes, standalone quote/source,
flower choices/meanings, story dates/photos, per-person portraits, independent
second ceremony, livestream URL/note, secret-letter-specific copy/photograph,
closing-specific message/hashtag, amount-based gift form and QR check-in have
no equivalent approved editor/persistence/service fields. Demo values are
removed. Unsupported standalone sections/controls are hidden; original source
structures and motion code remain packaged. No card-number/to'yona, receipt,
contact or other source-absent section is added. Shared content is preserved
when a target design does not render it.

The flower-language chapter is an identifiable source interaction but has no
safe authored data mapping. It remains hidden, not replaced with invented
values. These documented presentation gaps and the coordinator's route/save/
reopen/switch/public-render checks must be resolved or explicitly accepted
before publication. This package must remain private and unselectable.

The source has five palette positions while the shared contract allows twelve;
all twelve stay in invitation data, but only the first five are shown. The
source event card shows the shared event; all program rows remain visible in
the sundial. The shared contract does not include separate person portrait
fields, so the source's own initial-letter fallbacks are used. No gallery
photo is repurposed as a person portrait.

See `VERIFICATION.md` for tested scope, evidence and remaining integration work.
