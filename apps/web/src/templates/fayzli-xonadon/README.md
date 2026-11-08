# Fayzli Xonadon — Taklifla Bookie Terracotta

Complete housewarming source, supported event `yangi-uy`, catalog category `other`.
Registration 0177; release 0178 after verification. Same renderer in catalog,
studio and public invitation routes, with authentic opening/personalized covers.

## Source reuse

The immutable capture, all three CSS blocks, original reveal engine, house
photograph and 13 local font faces are tracked by source/provenance.json.
Source CSS/artwork and reveal code retain their exact captured bytes. The
application runs source/reveal.js directly; platform-adapter.js binds typed data,
Google venue, four locales, reduced motion and real RSVP. Provider runtime,
query demos, local RSVP simulation, analytics and headcount are excluded.
The absent bookie-terracotta-img folder is not a runtime dependency: the source
uses the exact locally packaged house photo and inline SVG artwork.

## Data mapping

| Source | Shared or validated source data |
| --- | --- |
| Hero/family signature | localized hosts, falling back to people |
| Greeting and welcome | personalized greeting, message |
| Date/time | startsAt and timezone |
| Address/map | venueName/address/landmark, shared Google URL/coordinates |
| Dinner courses | validated templateData menu: stable IDs, localized label/name/description |
| Dress code/swatches | shared localized dressCode and stable colors |
| RSVP | shared settings/deadline, guest token, real attendance API with 1/0 |
| Audio | optional creator music, canonical catalog track after gesture |

Dinner menu was hidden in the private package. It is now editable per locale,
saved/reopened and preserved on switching. Original course cards/Roman numerals
repeat from a source card. Canonical menu examples live in the shared housewarming
event profile JSON only. Empty creator menus hide; sample content never persists.
The source floor-plan SVG is a decorative illustration with localized room labels,
not a claim about the creator's actual building. There is no source gallery,
wishes, program or gift form to invent. All optional source sections hide cleanly.

## Verification

Five source/adapter tests plus shared fixture tests pass. Browser comparisons at
320/390/1280 verify source geometry/fonts/photo/frame, scroll motion, four locales,
long family names, seven stable menu cards, preview no-send, API error retention,
reduced motion and blank optionals. Actual catalog audio decodes after a gesture;
manual pause survives locale changes. Real disposable account checks cover
source menu save/reopen, compatible switching, studio/public renderers, four
personalized locales, Google Place/manual URL edits, publication and one-person
RSVP with resolved guest identity. Catalog/personalized covers use the source
first page. Evidence: docs/templates/taklifla-audit/xonadon*. Typecheck/build pass.
No external application deployment or live payments.
