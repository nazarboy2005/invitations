# Lace source adaptations

The runnable package keeps the archived Chorlove Lace page capture and captured styles/assets isolated under `source/` and `assets/`. The source capture remains untouched. Its source-module chunk is `_next/static/chunks/0j~ix342hy.sg.js` in the archived Chorlove export (SHA-256 `f8f02fc84097ac74933c62abdbf3f3ef676621bdc450f0686ac106fea836ed69`). Asset and capture hashes are recorded in `source-assets.provenance.json`.

## Preserved motion

- The cover retains the captured Bellagio poster and opening video. The poster fades after video time passes 0.05 seconds; the hero background video begins when the opening has less than 1.8 seconds remaining; hero names fade in 0.8 seconds after the hero begins; the cover fades with a 2-second ease-in-out transition once less than 1 second remains, then is removed.
- Source section wrappers reveal once at 15% visibility with a `0px 0px -60px 0px` viewport margin. Their source motion is opacity 0 / y 40px to opacity 1 / y 0 over 0.9 seconds with cubic-bezier `(.22, 1, .36, 1)` and a zero-second delay (the source helper default).
- Source program rows reveal once at 40% visibility over 0.6 seconds, with the source runtime's default `ease-out` easing and a 0.05-second stagger.
- Captured inline SVG animations and source artwork remain in the captured page. The package bridge maps the same source motion to the isolated static page without bringing in Chorlove's app or Framer runtime.

## Platform adapter

The bridge fills the captured page from the shared invitation contract and connects RSVP, wishes, gallery, music, calendar, and locale controls to the host preview/public renderer. It does not copy Chorlove's app runtime, analytics, or sample invitation data. The host-provided reduced-motion setting opens without waiting for the cover video, shows the hero immediately, pauses video and SVG animation, and disables transitions.

The catalog cover uses the exact captured opening poster at `/templates/lace/assets/bellagio-2-poster.jpg` (1080 x 1920; SHA-256 `9918bd098acc3620586090b3e6f1eb44dc8876de487849f23c0e272154f5ffff`).

