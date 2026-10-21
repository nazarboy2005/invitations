# Muhabbat Kitobi application adapter notes

The captured page body, source styles, book-opening animation, motion scripts,
and artwork are retained. The shared Marxaba runtime adapts the typed invitation
fields to the captured template slots.

- The catalog and blank template-selection preview may use the shared
  four-locale sample fixture: six localized program entries, clothing details,
  three preview wishes, To‘yona card details, contacts, and six empty gallery
  items. The fixture is never included in saved invitations or public content.
- Empty gallery photos render as the shared icon placeholder with no visible
  photo label. Gallery arrows/dots use the shared modulo navigation and smooth
  scrolling, respecting reduced motion.
- The captured gift section contains `toyona.note` and `toyona.bank` slots,
  which are not fields in the approved shared contract. A scoped adapter hides
  these empty slots while retaining the captured layout and styles.
- Browser interaction, reduced-motion visual behavior, and live save/reopen
  checks remain runtime/service release gates.
