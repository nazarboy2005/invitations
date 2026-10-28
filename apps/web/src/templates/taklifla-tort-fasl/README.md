# To‘rt fasl — Taklifla Fasllar

## Source and production adaptation

`public/templates/taklifla-tort-fasl/dependencies.json` records the untouched
capture, its SHA-256 and every local artwork/font hash. `adapter.test.ts` checks
these and compares `source/template.css` byte-for-byte with the captured style.
The original capture is never modified.

- `index.html`: retains source DOM, inline styles, seasonal layers and controls.
  Removes sample invitation values and provider runtime/analytics. Adds local
  font/runtime links, binding IDs, repeatable event template and music control.
- `source/template.css`: exact captured CSS.
- `source/motion.js`: extracted seeded particle generator, reveal observer,
  seasonal background blending and parallax. Adds reduced-motion handling,
  visibility pausing and scroll-triggered animation frames instead of a perpetual
  frame loop. Original easing, counts, timings and artwork are retained.
- `source/wish-close.js`: captured closing behavior; `closing-panel.js` connects
  the source's event-plus-24-hours closing scene to the authored event instant.
- `platform-adapter.js`: binds typed data, escapes text through DOM textContent,
  localizes controls, handles optional/long content, music, shared map links and
  real moderated wishes. Pending wishes never appear in the approved list.
  Gesture retry excludes the music button so its own toggle cannot immediately
  undo playback; a manual pause survives language switches and later gestures.
- `labels.js`: source wording plus four supported locale variants.
- `adapter.ts`: passes source-visible contract fields only; unused gift/card
  details are excluded. No source sample names, dates, venue or provider APIs.

## Field mapping

| Source section | Shared invitation fields |
| --- | --- |
| Opening, spring hero, autumn invitation, footer | localized people, event label, title |
| Summer invitation | greeting/personalGreeting, message, date, program with stable IDs |
| Venue and navigation | localized venue/address and `venue.mapUrl`, coordinate fallback |
| Dress information | localized dress text and named palette |
| Winter countdown | startsAt + timezone, event time and venue |
| Telephone reply | contacts.phoneNumber + rsvp.enabled |
| Autumn wishes and closing panel | wishes settings, guest token, shared wishes API, event instant |
| Music | optional creator music; gesture-gated preview music, retained pause choice |

There is no source gallery, seating plan, party-count input or gift form.
The real renderer is shared by full preview, editor and public display. Sample
content is supplied only by the canonical preview fixture. The catalog image
captures the actual opened spring hero; dashboard covers open the same scene
with creator content.

## Verification

`qa/` contains 320/390/1280 browser captures, matching reference opening/hero/
autumn captures and motion/network report. Source screenshot differences in
event wording and venue wording reflect shared authored fields; the production
language control additionally offers Uzbek Cyrillic.

`docs/templates/tort-fasl-verification/integration-report.json` records real
authenticated save/reopen, publication transaction, four-language public
rendering, personalized greeting, Google Place/manual URL edits and pending
wish persistence. Generated accounts/invitations/submissions are cleaned up.
Transport mocks in the standalone browser check are explicitly separate from
this real backend verification. No external app deployment or payment activation.

Reproduce standalone comparisons from the repository root: run
`node --import tsx tests/taklifla-tort-fasl.fixture.ts`, serve
`python tests/taklifla-tort-fasl.server.py`, then run
`node tests/taklifla-tort-fasl.browser.cjs`. The integration check requires the
local app and configured database and cleans up its generated records.
