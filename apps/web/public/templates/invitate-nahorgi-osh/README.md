# Invitate Nahorgi Osh source package

This isolated package adapts the exact Invitate manifest entry
`https://invitate.uz/nahorgi-osh.html`, stored at
`Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz/nahorgi-osh.html`.
It is the “Nahorgi osh taklifnomasi” capture, not `palov.html` (“Peshtoq”).
The captured page uses the shared `palov.css`, `palov.js`, and `palov.png` assets.
The source capture remains untouched.

The local page keeps the captured HTML hierarchy, inline SVG decoration,
spacing, palette, responsive layout, CSS animations, and reduced-motion CSS.
It does not load Invitate analytics or its local-only RSVP simulation. The
platform adapter is separate at `assets/js/nahorgi-osh-adapter.js`; typed
contract mapping is at `apps/web/src/templates/invitate/nahorgi-osh-adapter.ts`.
The captured Google Fonts response is served from local font files.

Field mapping covers the osh label and title treatment, authored people,
personalized guest greeting, message, hosts, date/time, venue/address/map,
source-owned palov illustration and caption, contacts, and RSVP. The captured
design has no creator gallery, program, dress code, gift/to‘yona, wishes, or
music controls. Empty optional venue/contact content is hidden. RSVP submits to
the public invitation API; preview mode cannot submit.

The design supports event type `osh` only and is assigned to the `osh` catalog
category. The registration migration keeps the row private until the complete
release checks pass; the additive publication migration enables it afterward.
The catalog artwork is a portrait capture of this source's distinctive opening
page; it is not synthesized from the palov illustration. `preview.png` is a 780×1688 render of the captured opening at
390×844 CSS pixels. Invitation fields are blank in the saved artwork, so no
fixture or creator content is stored in the image.
