# O‘rik Guli source adaptations

The captured invitation body is retained verbatim. `template.js`, `fx.js`,
`fog.js`, `meta.js`, and the captured localization table are byte-identical to
the reference. The page head points to the package-local fonts and the shared
Nikoh runtime; reference-site sample data and its runtime are excluded, and the
shared `platform-bridge.js` supplies typed invitation data and real platform
service calls.

`template.css` contains two documented platform-only changes:

- `.toyona__note:empty,.gift__bank:empty{display:none}` hides empty gift-note
  and bank-name slots that the approved invitation contract and editor do not
  support. Card number and holder still map to the supported gift fields.
- The `prefers-reduced-motion` rule removes transitions and decorative motion
  while leaving state changes available. The captured JavaScript also uses
  the shared reduced-motion setting for its opening and animation work.

The venue photo is a captured source-only decoration with no approved
`venue.photo` editor or persistence field; its empty photo treatment is
preserved as authored and no sample photo is inserted. The shared four-locale
preview fixture is mapped through `makeLegacyData`; it is preview-only and is
not saved or passed to public invitations.
