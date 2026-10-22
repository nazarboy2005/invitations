# Nahor

The typed `NahorInvitation` wrapper uses the packaged captured source at
`apps/web/public/templates/nahor` through the shared Marxaba iframe adapter.
The original capture is unchanged. Its complete page body, CSS, JavaScript,
localization, fonts, animation engines, and art are retained; sample-invitation
scripts are excluded. The platform adapter carries the shared contract values
into the source, adds a name-fit rule, and keeps the unsupported venue-photo,
gift-bank-name, and gift-note fields empty.

Nahor is published at 150,000 UZS through additive migration
`0070_publish_nahor.sql`, with catalog category `osh` and `osh` event support.
Focused source and contract checks, the full test suite, typecheck, production
build, and the four-locale catalog-wide save/publish/public-render/reopen
integration pass. Desktop browser review compared the captured qozon opening
with the app and checked the lid reveal, all four locales, gallery movement and
empty-photo lightbox, To‘yona disclosure, RSVP count and choice, and clean
console output. Narrow viewport runtime emulation and reduced-motion browser
emulation were unavailable; the captured responsive and reduced-motion paths
remain packaged. No live RSVP or wish was submitted during preview checks.
