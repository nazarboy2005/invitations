# Nahor captured source package

This package keeps the Nahor template's captured page body, CSS, JavaScript,
localized source copy, metadata, and artwork together. The five illustrated
opening frames, osh hero, tablecloth, serving tray, and gate artwork are copied
from the original capture. The source GSAP, ScrollTrigger, and LZ-String vendor
files are included unchanged. Only the shared site runtime paths, external font
URLs, and Open Graph preview reference in `index.html` are adapted. Bundled
Lora and Great Vibes font files are loaded locally. The missing `og.jpg`
reference now points to the packaged portrait opening capture, and the shared
Marxaba runtime provides the invitation contract, localization, and API bridge.
`platform-adapter.css` hides the source-only empty gift note and bank-name slots;
the approved contract intentionally keeps the card number and cardholder name
without a bank-name or gift-note field. Captured sample invitation scripts are
excluded.

`NahorInvitation` uses the shared typed invitation adapter. This design is
source-backed for the `osh` event type. For a catalog/blank initial preview,
the wrapper adapts the central canonical sample's default event label to
Nahorgi osh while preserving the sample people, date, program, contact, gift,
and gallery details. This is render-only data and does not alter creator drafts
or public invitations. The source's `extras.celebrant` name slot receives the
first invitation person through the shared adapter. A new blank Nahor draft
shows one template-specific “Mezbon yoki oila nomi” field with a family-name
example, avoiding an additional person field that the source would not display;
existing person values are preserved when switching designs.

The authored source exposes a venue-photo slot, but the approved invitation
contract/editor has no venue-photo field. It remains omitted rather than being
filled with sample artwork; when coordinates exist, the shared runtime can show
a real map in that source frame. Card number/cardholder, wishes, RSVP, program,
gallery, dress code, contacts, music, venue/map data, and event date use the
shared runtime contract. Localized static copy is provided by the source's
Russian/English dictionary and shared Uzbek-Cyrillic transliteration; authored
content remains locale-specific.

The catalog opening capture and its provenance use only
`apps/web/src/modules/catalog/preview-sample.json`. No catalog registry,
database, migration, or publication state is changed in this package task.
