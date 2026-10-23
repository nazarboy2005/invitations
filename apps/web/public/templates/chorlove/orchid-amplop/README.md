# Orchid Amplop

This package is the local Orchid Amplop renderer target. It uses the original
template CSS extracted verbatim from Chorlove component module `482485`, the
exact template-owned artwork listed in `source/provenance.json`, and local
Comfortaa/Allura font subsets. `bridge.js` adapts the shared Chorlove iframe
message to this page; it does not load the Chorlove site runtime.

The source archive's original preview capture is only the opening screen. The
complete renderer component and its embedded stylesheet were recovered from
`Chorlove/Web invitations/_next/static/chunks/0v0-3ulc~exde.js`. Reference
captures remain unchanged. The route chunk's framework module loader,
authentication/analytics, and site-level data/services are not packaged.

## Contract mapping

- Couple names and greeting: localized shared invitation content and the
  guest-personalized greeting from the Chorlove adapter.
- Event date, timezone-formatted labels, countdown, calendar action, venue,
  map link, and repeatable program: shared date, timezone, venue, and program
  fields.
- Story chapters, creator gallery, contacts, gift card, wishes, RSVP, and
  creator music: shared contract fields and existing public APIs. Empty optional
  sections remain hidden. Uploaded photos replace preview-only source gallery
  images; public invitations never receive those samples.
- Uzbek Latin, Uzbek Cyrillic, English, and Russian: localized built-in labels;
  creator-authored localized content comes from the shared adapter.
- Motion: source CSS is retained; its reveal/open transitions are disabled by
  reduced-motion preference or the preview QA flag.

## Source fidelity audit (2026-10-23)

Compared the live source preview and local shared preview at matching 390×844
mobile and 1280×800 desktop viewports. The captured component module confirms the opener timings and
easing: forest 1.1s, emblem shell 0.85s (+0.12s), envelope 0.9s (+0.22s),
button row 0.75s (+0.34s), and staggered opener copy at 0.72s with 0.38s
initial delay and 0.12s stagger. The package now mirrors those values, source
exit transforms, 6.5s emblem pulse, 1.65s side-chevron loops, 1.035 hover and
0.97 press scale, and the 0.95s / 0.34 viewport reveal behavior. The opener
uses the source Lucide mail and chevron paths. The source music control is
behind the z-120 gate at z-110; the package now follows that stacking.

Browser checks covered the live source opening and hero, the package opener and completed open transition in normal motion, gallery lightbox open/close, gift-card expand/collapse, and package reduced-motion QA. The opener layouts align closely at mobile and desktop widths. Package reduced motion is an accessibility adaptation that shows opener copy immediately; captured CSS explicitly disables only the hero down-arrow animation. Browser-level source reduced-motion emulation remains pending.

The source lightbox uses Framer Motion's implicit physical spring (stiffness 100, damping 10, mass 1). The package now generates that under-damped curve analytically at 60 Hz and plays the sampled opacity/scale values through WAAPI, stopping at the source spring rest tolerances. This keeps the standalone package free of the provider runtime while matching its spring parameters and visible interpolation. Browser re-verification of the updated lightbox is pending because the connected browser transport is currently unavailable. Gift-card expansion uses the captured 0.5s duration, easing, blur, scale, and offsets. Section reveal viewport threshold, margin, duration, easing, and recorded delays match. No clean catalog cover exists: metadata art includes fixed names/provider UI. Six component-referenced images remain absent. Therefore source fidelity and publication gates remain open.

## Current release state

The page package is not a publication approval. The source capture manifest has
no standalone thumbnail or portrait opening art, and the component's additional
references to `divider.svg`, `bride-groom-circle.svg`, groom/bride portraits,
and story photos are absent from the exact Orchid asset directory. No unrelated
template images are substituted. The package currently uses the existing circle
asset for the circular frame and leaves optional authored portraits empty.
The shared typed registry and full-preview route now expose the template for
preview only, with wedding-only compatibility. The reduced-motion browser pass
confirmed the opening and populated sections. Migration
`0132_register_orchid_amplop.sql` is applied; the configured database confirms
the wedding row is unpublished. The database has no Orchid invitations, and
the public catalog API excludes the row.

The capture's structured metadata points to an authentic 778×1686 opening
image, but it includes fixed source couple names and a provider UI badge. The
renderer capture made with the canonical shared preview fixture is portrait,
but currently includes the Next.js development badge. Neither image is used as
catalog art. The archive also lacks the six images referenced by the component.
Save/reopen, public invitation rendering, RSVP/wish submission, browser-level source reduced-motion comparison, and a clean portrait catalog cover remain release checks. Keep the template
unpublished and unselectable until those checks pass.
