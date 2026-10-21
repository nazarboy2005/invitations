# Atlas application adapter notes

The captured source renderer, styles, motion, artwork, and textile patterns are
retained. The shared Marxaba runtime maps the typed invitation to source slots
and handles gallery, RSVP, wishes, gift, and contacts data.

- The catalog and blank template-selection preview may use the shared
  four-locale fixture, including six localized program entries, clothing
  details, three preview wishes, To‘yona card details, phone/Telegram contacts,
  and six empty gallery photos. This sample never enters saved or public
  invitation data.
- Empty Lahzalar photos render as the shared icon placeholder without visible
  photo labels. Gallery arrows and dots use shared modulo navigation and smooth
  scrolling, with instant movement for reduced-motion preferences.
- The source To‘yona section has `toyona.note` and `toyona.bank` slots, which are
  not fields in the shared contract. A scoped adapter hides those empty slots
  without changing the captured stylesheet.
- Browser visual and interaction checks and live save/reopen behavior remain
  runtime/service release gates.
