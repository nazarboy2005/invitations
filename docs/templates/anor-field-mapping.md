# Anor field mapping and readiness

Anor is implemented as an isolated source-backed renderer in
`apps/web/src/templates/anor`. The creator preview and `/i/[slug]` public page
use the same component and original captured template page. It reads the typed
invitation contract through `bridge.js` and never seeds invitation content.
The captured Anor HTML, CSS, animation JavaScript, seed engine, and artwork are
packaged under `apps/web/public/templates/anor/source`; locally licensed fonts
are used. Original Marxaba captures remain untouched.

| Reference content or interaction            | Shared invitation data / behavior                                                                                            | State                                                                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Couple/celebrant names                      | `content[locale].people[]`                                                                                                   | Dynamic; long names wrap                                                                                              |
| Family/host names                           | `content[locale].hosts`                                                                                                      | Dynamic                                                                                                               |
| Opening and letter greeting                 | `content[locale].greeting`, `personalGreeting`; personalized guest display name is resolved server-side from the guest token | Dynamic; `{name}` is interpolated only for a valid guest link                                                         |
| Introductory wording                        | `content[locale].message`                                                                                                    | Dynamic; hidden when empty                                                                                            |
| Event type and label                        | `eventType`, overridden by `content[locale].eventLabel`                                                                      | Dynamic with localized built-in labels                                                                                |
| Event date/time/timezone                    | `startsAt`, `timezone`                                                                                                       | Localized date and weekday; timezone-aware countdown and calendar file                                                |
| Repeatable program                          | `program[]` plus localized `content[locale].programTitles[id]`                                                               | Dynamic; section hidden when empty                                                                                    |
| Restaurant, address, landmark, map pin/link | `content[locale].venueName`, `address`, `landmark`, `venue.latitude`, `longitude`, `mapUrl`                                  | Dynamic; section hidden when empty                                                                                    |
| Venue photograph                            | No shared editor field                                                                                                       | Gap; image is omitted rather than replaced with a couple's photo                                                      |
| Dress-code section, palette and note        | User chose to omit this section for now                                                                                      | Omitted                                                                                                               |
| Gallery photographs, captions and alt text  | `gallery[]`                                                                                                                  | Dynamic carousel and lightbox; hidden when empty                                                                      |
| RSVP                                        | `rsvp` and `/api/public/invitations/[id]/rsvp`                                                                               | Connected to persistence, deadline, guest token and server validation                                                 |
| Wishes                                      | `wishes` and public wishes API                                                                                               | Only approved messages are read; new submissions remain moderated                                                     |
| To'yana card                                | `gift.enabled`, card number, holder, bank                                                                                    | Optional; hidden without enabled card details                                                                         |
| Receipt image/PDF upload                    | `gift.receiptUploadEnabled`                                                                                                  | Not implemented in this project; no fake upload/confirmation is shown                                                 |
| Music                                       | `music.enabled`, asset URL                                                                                                   | Optional; begins from the opening interaction; accessible play/pause; playback rejection leaves the control available |
| Repeated phone/Telegram contacts            | `contacts[]`                                                                                                                 | Dynamic, with `tel:` and Telegram links                                                                               |
| Locale variants                             | `enabledLocales`, localized `content` values                                                                                 | Uzbek Latin, Uzbek Cyrillic, English, Russian; selector shown only for multiple enabled locales                       |

## Known differences and blockers

- The pomegranate cut, staged break frames, seed physics, initials, sunrise,
  scroll reveals, parallax, ambient motion, and finale now run from the
  captured `template.js`, `seeds.js`, and GSAP/ScrollTrigger scripts. The
  captured HTML and CSS supply the corresponding layout and visual design.
- The capture does not document a license for its photographic artwork. The
  art is copied into the application for isolated local review, but commercial
  production use needs rights confirmation.
- The captured artwork includes the venue-photo slot; the current editor has
  no venue-specific photo field. Venue directions also have no separate field;
  creators can provide a landmark and map URL.
- The repository has no receipt upload, AI screening, private receipt storage,
  or Telegram receipt delivery API. When receipt uploads are enabled, Anor
  does not claim successful upload or delivery. This is a required integration
  before production readiness.
- The seed value is `15,000,000` price-minor units, rendered by the current
  catalog as `150,000 UZS`. It is provisional; a platform administrator should
  set the intended Anor price before publication.
- The app's creator browser preview works without PostgreSQL, but account save,
  published public invitations, RSVP persistence, and wishes require the
  configured database and applicable Telegram/R2 services.

Anor remains unpublished in both the shared catalog definition and migration
until these blockers are resolved and visual/behavior checks are complete.
