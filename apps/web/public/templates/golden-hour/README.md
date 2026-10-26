# Invitate Golden Hour source package

Provider: Invitate. The exact captured source is
`Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz/golden-hour.html`;
the matching source package includes `assets/css/golden-hour.css`,
`assets/js/golden-hour.js`, five `assets/images/golden-hour/*` files, and the
font faces referenced by the page. Original captures remain unchanged. A full
archive search found the referenced `assets/audio/lanadel.mp3` (9,386,537
bytes), and it is preserved byte-for-byte in the isolated package. It is not
used as invitation data or a default; music remains optional creator-authored
content.
The referenced `golden-hour.php` RSVP endpoint is absent from the archive and
is replaced by the shared RSVP API adapter. The capture manifest contains no
additional Golden Hour HTML or JavaScript chunks.

The local package preserves the captured page structure, stylesheet, images,
and font faces. `assets/js/golden-hour-source.js` adapts the captured script's
countdown, scroll reveals, and music toggle; `golden-hour-adapter.js` handles
typed data and application services. The absent PHP endpoint is replaced by
the public RSVP/wishes APIs. Public invitations attempt playback on open
through the shared route tracker; the source control remains available for
pause and replay, subject to browser autoplay policy.
`contract-adapter.css` contains the app-only data presentation and reduced
motion additions. The source analytics beacon, site links, fixed
invitee/date/venue copy, and age demo value are not loaded. The source
soundtrack is packaged but never auto-played or bound as invitation data.
Byte-level provenance and every source-to-platform change are listed in
[`SOURCE_ADAPTATIONS.md`](./SOURCE_ADAPTATIONS.md).

## Contract mapping

- Invitation title and event label, honoree name(s), localized and
  personalized greeting, message, hosts, date/time/timezone/countdown, ordered
  program items, venue/address/landmark/map, dress code and palette, gallery
  images/captions/alt text, optional music, and phone/Telegram contacts bind
  from the typed Invitation through `makeGoldenHourData`.
- Source photography is renderer-only for catalog and initial template
  selection previews. Creator uploads replace it. Public invitations with no
  uploaded photos keep every photo slot empty; preview content is never saved.
- The source has no age field in the shared Invitation contract. Its fixed
  captured age and slogan are omitted so demo content is never shown as creator
  data. No age requirement or schema field was invented.
- The original birthday capture has no gift or To‘yona section. Gift fields,
  card-copy controls, and the shared receipt upload are omitted from this
  template.
- RSVP and wishes use the public invitation APIs; preview submissions are
  blocked and moderation remains app-managed. Public music attempts playback on
  open and remains controllable through the source music control. Reduced-motion
  rules disable reveal and decorative motion.

Golden Hour uses the shared Invitate iframe renderer and supports `birthday`
only. Its `birthday` category assignment is independent from event support.
Migration `0127_register_golden_hour_template.sql` is applied, and typed
catalog/database metadata remain private until release checks pass. The
catalog uses the original 744×1280 `pink.png` hero photograph, which is also
the opening page's background image; the capture does not provide a separate
catalog-cover file. The original reference and app copy have not been compared
in a real browser side by side at matching viewports; source fidelity and
reduced-motion parity therefore remain unverified. A browser policy blocked
opening the captured `file:` URL and forbids reaching the same file through an
alternate browser-serving path. The source's fixed age and tagline are
omitted because they have no contract fields and are sample invitation data.
Full repository verification still reports failures in unrelated template
tests. The focused typecheck and template checks pass; the template remains
unpublished until the source comparison and other release gates pass.
