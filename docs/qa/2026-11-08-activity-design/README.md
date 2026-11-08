# Activity page redesign

Compact invitation context and actions, subdued header artwork, attendance totals
that double as filters, and a responsive guest list replace the large decorative
cards and horizontally scrolling mobile table. Wishes have labeled moderation
actions; receipt review and gift intentions retain their original behavior.
Pagination appears only when another page exists or the user has moved beyond
the first page. Searching keeps the input mounted and focused while results load.

Reviewed the existing code and stored visitor-activity capture, then captured the
original and revised component in the dashboard layout using synthetic data.
The temporary local fixture route was removed after verification. The server
rendered the signed-out global navigation; the Activity component received a
published invitation fixture. No database records or guest submissions changed.

- `before-*.png`: original layout at 320, 390, 768 and 1440 pixels.
- `after-*.png`: revised layout at 320, 390, 768, 1024 and 1440 pixels.
- `mobile.png` and `desktop.png`: final viewport captures.
- `wishes-*`, `receipts-*` and `intentions-*`: remaining sections on mobile and desktop.
- `empty.png` and `no-interactions-390.png`: empty states.
- `verification.json`: browser checks and intercepted moderation payloads.

Validation: `pnpm typecheck` passed. Headless Chrome checks passed at all five
widths: no page/table overflow, all tabs visible, attendance filtering, continuous
search focus, clipboard copy, keyboard tab navigation, wish approval/deletion
confirmation, both receipt review actions, conditional pagination, tab pagination
reset, feature-specific sections, empty/error recovery, reduced motion, and
administrator moderation headers. No browser runtime errors were observed.

Moderation/API checks used intercepted responses and synthetic records; this was
UI verification, not a new database integration test. Application authentication
and API authorization were not changed.

## Template-specific RSVP notes

Activity now uses explicit `rsvpNotes` template capabilities, defaulting to false.
The header and every note cell are omitted together for unsupported templates,
and the remaining desktop columns share the space. Mobile timestamps move up
without leaving an empty note row. Search wording follows the same capability.
Templates whose adapters save contact details in the RSVP note retain the column.
Visibility does not depend on a page's response contents or the owner's RSVP toggle.

Additional headless Chrome checks passed for Anor, Velvet, Pulau Sehati and Olive
Manor at 1440, 768, 390 and 320 pixels: expected column/cell counts, unsupported
notes absent from the table, adapted search wording, no page/table overflow,
and supported templates retaining their column when all notes are empty.
No browser errors. `notes-<template>-<width>.png` captures use synthetic responses.
The temporary local fixture route was removed.

The existing public API rejects RSVP notes above 1,000 characters and wishes above
2,000 characters after trimming; template inputs may impose smaller limits.
These limits were inspected, not changed. Template/activity/capability regression
checks passed. The broader guest-activity run has an unrelated existing failure:
its expected Telegram message text differs from the current notification format.
