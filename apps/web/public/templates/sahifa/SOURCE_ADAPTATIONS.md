# Sahifa app integration

Sahifa keeps its captured page, template styles, opening script, motion script,
and artwork. The shared typed adapter supplies creator data and the canonical
catalog fixture only for catalog/initial template-selection previews. The
fixture is not part of a blank invitation and cannot be persisted from that
draft.

The preview contract covers dress code, six ordered program items, shared
sample wishes, To‘yona card number/cardholder, phone and Telegram contacts, and
six icon-only empty gallery entries. Shared gallery controls wrap the selected
index and scroll smoothly (instantly for reduced motion). Empty photos use the
shared decorative icon fallback with no photo label.

The source contains optional To‘yona note and bank-name hooks that are not in
the approved invitation contract. `platform-adapter.css` hides those empty
hooks while preserving the original card number and cardholder fields.
Migration `0020_publish_sahifa.sql` publishes Sahifa at 150,000 UZS. The typed
catalog also marks it published, so fallback catalog and creator selection
agree with the database registration.
