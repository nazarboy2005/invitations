# E-invitation source repair

**Final state: verified locally and ready for deployment; live rollout awaits
separate deployment authorization.** All 31 focused tests, 8 mobile/desktop
cases, 4 reduced-motion/long-name checks, 4 authenticated private lifecycles,
4 public/RSVP/music/cover lifecycles, the fifth design's 2 browser checks,
typecheck and production build pass.

The live `fotiha.uz` renderer files still contain the older implementation.
`live-deployment-check.json` compares their actual contents with this checkout.
Publishing database rows alone therefore exposes the old broken pages. After
the scoped publication/lifecycle verification, the four database flags were
returned to their original **unpublished** state (`hold-database.json`). All
130 other rows and every administrator price/name remain unchanged. Their
registrations and complete source packages are retained. Typed fallback flags
are rollout defaults, not evidence of a deployed application.

After authorized deployment, confirm all four live renderer hashes, then run
`e-invitation-migration.mts publish` to re-enable only these four through the
repeatable additive migration. Verify the live catalog and previews afterward.

The requested designs are `olive-manor-edition`, `islamic-edition`,
`monochrome-editorial-edition` and `xatna-edition`. The existing Velvet Royale
(`royal-burgundy-edition`) is retained and separately audited. The explicitly
removed Manor, Osh Edition V1 and Amru Maruf designs remain removed.

## Root cause and repair

The older saved HTML pages contain the provider's loading state. Their compiled
template modules and assets contain the actual designs. The previous website
renderers used rewritten, simplified HTML with scope-stripped styles, omitted
layers/sections and shortened or missing opening transitions. Olive Manor also
read `venue` before initialization. Islamic Edition had a replacement blue layout
and removed its opening video after 800 ms. Xatna immediately rebuilt its page
instead of animating the doors and contained question marks in Cyrillic labels.

The repaired packages use the complete rendered template element trees and
original scoped styles from the current references, with original modules kept
as source evidence. `source/current/provenance.json` records asset/font/module
hashes. The old `source/reference` archives and the separate `Templates` directory
are unchanged. Obsolete simplified CSS is removed from the active packages.

Olive Manor's intro styles live in the misleadingly named provider chunk
`fonts.DKpGYWYt.css`; these are captured locally as `source/current/inline.css`.
Omitting that chunk hides the envelope behind the hero. Current source assets
also recover Xatna's embroidered closing arch and the complete source galleries.
Monochrome's current reference uses the available original paper edges and does
not request the obsolete missing `tear-edge-top-b-v4.png`.

## Runtime and integration

Each package owns `template.html`, its original CSS/fonts/artwork, `motion.js`
and a narrow renderer entry. `e-invitation-shared/runtime.js` maps the typed
invitation payload and existing Fotiha services; no provider Vue/Nuxt runtime,
analytics, sample soundtrack or API is loaded. Raw reference modules are evidence
and are not executable imports.

- Olive Manor retains its wax breath/release, 720 ms release lead-in and complete
  7.041667-second video; Islamic retains its complete 8.041667-second door video,
  animated letters, original star engine, decorative motion and ambient video.
- Monochrome retains the 920 ms opening action and 650 ms fade. Xatna retains the
  1,000 ms door transition, original greeting letters, dividers and closing arch.
- Calendars retain their original cell/SVG structures, timed illumination and
  particle sequences: Olive 750/70 ms, Islamic 900/70 ms, Xatna 520/92 ms. Reduced
  motion immediately exposes final content without video/particles/transitions.
- Creator names, greetings, wording, event labels, family, date/time/timezone,
  program IDs/order, media/alt/captions, contacts, gifts, RSVP and wishes replace
  reference personal data. Source seating assignments are removed because the
  shared guest contract has no seating field.
- Calendars download a local `.ics`. Saved map links and coordinates use the
  platform's Yandex Maps display. Galleries retain their original layouts and
  support keyboard/swipe photo viewing. Optional story, dress and receipt upload
  use the existing shared editor-section adapter.
- Updates and locale changes bind in place, preserving the opened state, scroll,
  guest form input and an explicit music pause. Names fit within the source
  composition, including longer creator names. Empty creator galleries hide
  while template-owned artwork remains.
- The shared preview fixture supplies only the authentic source preview photos
  for the three wedding designs. Xatna has no unrelated sample photos; creator
  uploads use its complete original gallery component. No sample data is saved.
- The same renderer serves Studio, full preview, public display and personalized
  covers. Exact 390:844 opening artwork is packaged as `catalog.webp`.

## Verification and release evidence

`browser-report.json` records the mobile/desktop section, video-frame, calendar,
gallery, four-locale, form-preservation, empty-content and network checks.
`*-reduced-long.png` records reduced-motion/long-name checks.
`long-name-report.json` checks wrapped line bounds for overlap;
`focus-ambient-report.json` verifies keyboard opening, focus containment, content
unlocking and playback of Islamic's ambient video while visible.
`preflight-lifecycle.json` records authenticated save/reopen, real photo/audio
uploads, program/story/dress/gift preservation and event compatibility.
`release-lifecycle.json` records publication, real public rendering, one-person
RSVP persistence, pending-wish privacy, music pause and personalized covers.
`velvet-royale-audit.json` records the retained fifth design's browser audit.

Only migration `0224_publish_complete_e_invitation_four.sql` publishes these four
existing registrations. Administrator names/prices and all other catalog rows
are preserved; `publish-database.json` records the before/after scope check.
Wedding event support applies to the first three; Xatna supports `sunnat-toyi`.
No external application deployment or live payment activation is part of this
repair. Publication tests use disposable data and the existing process-local
free-publication override; the running application's payment mode is unchanged.

The four requested designs were tested while enabled; the final hold preserves
the original live visibility until the corrected application is deployed.

Reproduce with the capture/packaging helpers in `scripts/templates`, then
`verify-e-invitation.cjs`, the lifecycle script with the web tsconfig, the focused
template tests, web typecheck and production build. Test accounts, invitations,
uploads, submissions and notification jobs are removed in lifecycle cleanup.
