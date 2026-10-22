# Shirin Bayram source package

This package retains the captured Shirin Bayram page and its original visual
system. `template.css`, `i18n.js`, `meta.js`, and the document body are copied
from the untouched reference. `template.js` is unchanged except for its local
Three.js dependency path. The captured GSAP, ScrollTrigger, LZ-String, and
Three.js engines are bundled unchanged under `vendor/`, with only their HTML or
loader URLs redirected locally. `index.html` uses bundled fonts and the
application's same-origin invitation runtime instead of the reference site's
runtime and sample overrides. The complete cake poster art and Three.js
cake/balloon motion are included; the source's fallback poster remains active
for reduced motion or when WebGL is unavailable.

The captured metadata declares only `tugilgan-kun`, mapped to the shared
`birthday` event type. It does not declare `yubiley`, so the registry and
database intentionally support birthdays only; catalog category and event
compatibility remain separate. The typed wrapper sets the birthday event label
only for the preview-only canonical sample. The runtime maps the shared contract's first person to the
source's single celebrant slot. The captured design also has age slots, but the
approved invitation contract and editor do not currently collect a celebrant's
age, so these slots remain empty instead of inventing sample values. The source
has no dedicated venue-photo field; the shared runtime only receives approved
venue and map data. RSVP, wishes, program, gallery, optional dress code, gift,
contacts, music, greeting, hosts, venue, and localized dates flow through the
shared Marxaba adapter. A separate `contract-adapter.css` hides the captured
gift bank-name and note slots while those unsupported values are empty; it
does not alter the captured `template.css`. The scoped adapter also limits the
large intro and hero name size and restores normal word boundaries: the source's
`overflow-wrap:anywhere` split short Cyrillic names inside a word, and wider
Cyrillic glyphs made its headline overflow its lockup.

The canonical catalog fixture is the only source of preview names and dates;
the temporary browser harness used during capture was removed. The fixture is
never persisted in drafts or passed to a public invitation. Shirin Bayram is
published at 150,000 UZS through additive migration
`0067_publish_shirin_bayram.sql`, under category `birthday` with birthday-only
event compatibility. Desktop browser review covers the animated opening, all
four locales, long-name fit, gallery wrap, gift disclosure, RSVP counter, and
clean console; the catalog-wide four-locale save/publish/public-render/reopen
integration passes. The in-app viewport override did not take effect, so narrow
viewport runtime review remains unverified; captured breakpoints and the
scoped name-fit adapter are present. Reduced-motion runtime emulation is
unavailable; captured source CSS and JavaScript honor the preference.
