# Barakali — Taklifla

Complete source package for birthday celebrations, separately registered category
`birthday` and supported event `birthday`. Registration migration 0173; release
migration 0174 after verification. Same renderer in catalog, studio and public.

## Source fidelity and adapters

The immutable capture, exact CSS/language stylesheet, inline floral SVGs, scroll
reveal implementation and ten local font files are recorded in dependencies.json.
The selected source has no image-directory dependency: floral art is inline SVG.
The captured template source stays isolated under public/templates/taklifla-barakali;
bridge.js is the data/API adapter. Provider runtime, analytics, sample content and
fake RSVP persistence are excluded. Original reference captures are untouched.

| Source | Shared contract |
| --- | --- |
| Hero, monogram and closing names | localized people |
| Personal greeting, invitation and signature | personalGreeting/greeting, message, hosts |
| Date, time and countdown | startsAt and timezone |
| Venue, address, landmark, both maps | localized venue copy, shared Google URL/coordinates |
| Telephone | contacts.phoneNumber |
| Celebration portrait | first creator gallery item with stable ID, alt/caption |
| Wishes | wishes settings, guest token, real approved/pending service |
| Optional music | creator music; canonical catalog track only in preview |

Source has one portrait slot, no program, gallery carousel, age badge, gift or
attendance count. Do not fabricate those controls. Empty creator photo is hidden
publicly; the original decorative portrait frame remains in catalog preview.
Preview semantic data and wishes come only from preview-sample.json and never
persist. Google links retain the source button presentation; manual URLs take
precedence. Catalog audio waits for a gesture; public music attempts playback,
retains manual pause across language changes and reflects actual audio events.
Four locales, long names, optional fields and reduced motion are supported.

## Verification

package.test.ts checks exact capture/CSS/SVG/motion/font fidelity and no sample
leakage. verify-browser.cjs compares source/app at mobile and desktop and checks
motion, four locales, shared wishes, preview no-send, long names, portrait, reduced
motion, empty fields and mocked failures/pending submissions. Evidence is in
`evidence/`. tests/taklifla-barakali.integration.ts uses disposable real account,
save/reopen, compatible switching, publication, studio/public routes and pending
guest wishes. Tests separate mock transport from real database persistence.
Actual catalog audio and personalized cover evidence are in docs/templates/taklifla-audit.
Catalog art is the real source first page at 480×800, without app controls.
No external app deployment or payment activation.
