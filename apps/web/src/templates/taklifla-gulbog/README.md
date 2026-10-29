# Gulbog — Taklifla Garden Arch

Complete wedding garden source, shared renderer in catalog/studio/public routes.
Registration 0181; release 0182 after verification. Wedding category and event
compatibility are independent. Catalog/personalized art uses its actual opened
floral hero; public invitations retain the source monogram/petal opening.

## Source and adapters

The immutable capture, exact source CSS/language styles, floral/garden artwork
and fonts are tracked in dependencies.json. Source motion is wrapped in
startGardenSource for contract-first initialization: the original splash,
18 falling petals, countdown and reveal observer run directly. Reduced motion
skips/hides petals and removes motion; native opening behavior is retained.
The platform adapter handles typed data, Google maps, moderation, locale and
optional music. No provider runtime, analytics, source sample records or fake
service acknowledgments are served. Original captures stay untouched.

| Source | Typed invitation data |
| --- | --- |
| Hero, monograms and invitation | localized people, greeting, hosts, message |
| Date/countdown and ordered event cards | startsAt/timezone and stable program IDs |
| Venue/map button | shared Google URL/coordinates or authored address search |
| Separate daughter/family line | validated templateData brideFamily per locale |
| Reminder panel and footer note | validated reminderTitle/reminderText/footerNote per locale |
| Guestbook | wishes settings, resolved guest token, approved/pending service |
| Music/dismiss control | creator music; gesture-gated canonical catalog track |

The private package had hidden the family/reminder fields. They are now editable,
validated, saved/reopened and preserved on switching. Shared wedding profile
JSON supplies preview-only examples. Common names/venue/program stay in the
shared contract; no semantic template sample file exists. Canonical wishes
appear only in catalog previews. Source wish-card presentation is retained;
new pending wishes never appear in the approved feed. The source's nonpersonal
closing copy remains when no custom footer is authored. No source gallery,
gift, attendance count or independent RSVP form is fabricated.

Normal typography is unchanged; long fields wrap and unusual names fit. Four
locales are supported. Music play/pause/dismiss reflect real audio, retain the
guest choice across locale updates and never bypass catalog gesture gating.
Studio opens only after source data arrives, with no accidental sample state.

## Verification

Three source/adapter tests and shared fixture regressions pass. Source/app
comparisons at 320/390/1280 verify matching geometry/fonts, opening, 18 active
petals, reveals, four locales, canonical wishes/source details, seven program
items, long/empty content, reduced motion and no-send/failure handling.
Real disposable account tests verify source fields, save/reopen/switching,
publication, studio/public, four personalized locales, selected/manual Google
maps and pending guest wishes. Actual decoded audio, pause/resume/dismiss and
catalog/personalized covers are recorded separately. Evidence:
docs/templates/taklifla-audit/gulbog*. Typecheck/build pass. No app deployment or payments.
