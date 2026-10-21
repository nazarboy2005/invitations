# Oynavand application adapter notes

The captured opening, poster artwork, styles, 3D mirror interaction, and
template motion are retained. The shared Marxaba runtime maps invitation data
to the captured slots and owns RSVP, wishes, contacts, gifts, and gallery data.

- The catalog and blank template-selection preview may use the shared
  four-locale sample fixture, including six localized program entries, clothing
  details, three preview wishes, To‘yona card details, phone/Telegram contacts,
  and six empty gallery photos. This sample never enters saved or published
  invitation content.
- Empty Lahzalar items render as shared icon placeholders without visible photo
  labels. The shared gallery controls wrap by index and scroll smoothly, with
  instant navigation under reduced motion; Oynavand's source motion only adds
  the captured kaleidoscope interaction.
- The captured To‘yona section includes `toyona.note` and `toyona.bank` slots,
  which are not contract fields. The scoped `contract-adapter.css` hides these
  slots when empty without changing captured visual styles.
- Visual browser checks and live save/reopen behavior remain runtime/service
  release gates.
