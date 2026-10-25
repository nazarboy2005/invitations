# Homepage occasion orbit

`OccasionOrbit` sits immediately after the hero, before featured designs. It uses
the existing display font, light champagne water and a pomegranate orb on the
ivory/blush background. The revealed composition now follows the supplied rich
photographic reference with four silk-framed scenes, numbered captions, pearls,
petals, layered fine ellipses and a sculpted burgundy drop. Four optimised WebP
cutouts are the only new media; no video, WebGL textures or packages are needed.
See [artwork provenance and complete prompts](home-occasion-art.md).

## Scroll sequence

The track is 2.6 viewport heights with a one-viewport sticky stage. Its 1.6
additional viewports of native scroll drive all motion in both directions:

- 0–18%: a glassy drop falls toward the surface with increasing speed.
- 18–25%: impact/cavity and outward ripples; the drop merges into water.
- 25–40%: a liquid neck and rounded bulb rise from the impact point.
- 40–62.5%: the neck contracts; the bulb separates and lifts to the centre,
  rounds/shrinks into the pomegranate orb, then crossfades to the HTML dot.
- 62.5–79%: satellites spread out, revealing names after they separate.
- 79–96%: the scenes follow the oval through 90 degrees on desktop, always upright.
- 96–100%: the arrangement rests, then leaves in normal page flow.

The fall starts only after the stage reaches the top of the viewport. There is
no scroll interception or added smoothing layer. Live measurements preserve
alignment after resizing, font loading and layout changes above the section.

Phones use a tall oval, captions beneath the photographs and the same full
quarter-turn as desktop, reaching the next photograph's original position.
Desktop captions follow the current side through a continuous inner arc at the
top/bottom poles, rather than changing a fixed left/right anchor. The number/rule
fades briefly while a subtle image scale adjustment keeps the single readable
label clear of the central jewel. No duplicate or disappearing labels are used.
The old “Scroll qiling” instruction and mouse icon are removed entirely.
“Tadbirlar / Unutilmas lahzalar” and the
reference's two short lines introduce the revealed scene; decorative elements
fade in during release. Water timing and its GPU handoff remain unchanged.
Reduced motion and server/no-JS
rendering show the complete static composition. Screens 520px high or shorter use
a compact two-column arrangement. Switching modes clears the previous transforms.
WebGL unavailability/context loss retains a CSS pool/ripples/neck and the same
deterministic timeline. The semantic heading/list remains available to assistive
technology; the canvas/dots/path are decorative. Nothing is falsely clickable.

## Performance design

- `occasion-water.ts` is a separate dynamic import, requested within 200px of
  the section during browser idle time. Reduced motion/short landscape never
  initialise WebGL. Shader compilation uses the parallel extension when available.
- One triangle and one shader pass; analytic ripples, ellipsoid and revolved neck.
  No ray marching, fluid simulation, textures, framebuffer chain or 3D dependency.
- At most 440,000 backing pixels on desktop and 180,000 on phones, independent
  of device pixel ratio. Repeated slow scroll frames halve the budget once.
- Rendering happens only on visible, changed scroll frames. There is no automatic
  time animation. An idle page draws zero extra frames; offscreen/hidden tabs stop.
  Once HTML takes over, the water renderer stops drawing throughout the orbit.
- Resources are disposed on unmount/preference changes; the buffer shrinks to 1x1.
  Initialisation failure/context loss preserves the CSS experience.
- Development-only canvas data attributes expose actual draw count/backing pixels
  for QA; production omits those writes. See [MDN WebGL guidance](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices).
- The production renderer is a separate 7,773-byte chunk (3,212 bytes gzip in
  this build). This is the deferred water renderer, not the entire homepage bundle.
- The four 600×450 transparent WebP photographs total 184,682 bytes. They use
  native lazy loading, low fetch priority and asynchronous decoding. The new
  orbit details are CSS; there is still no perpetual animation or extra GPU pass.

## Verification

- Focused tests cover impact contact, phase continuity, label timing, deterministic
  reverse scrolling and render budgets.
- Browser QA checks fall/rebound/handoff/orbit at desktop/phone sizes, no horizontal
  overflow and a direct exit into the template collection. The development draw
  counter stays fixed at rest and throughout the HTML orbit.
- Short landscape retains the static two-column fallback.
- TypeScript, all three focused tests and the isolated Next production build
  passed, including all 20 static pages. Build-generated config edits were restored.
- Browser draw counter stayed at 32 while idle; after handoff it stayed at 33
  across further orbit scrolling. Observed backing buffers were 439,500 pixels
  at 1366×768, 179,352 at 390×844 and 173,240 at 320×568. Changing to 844×390
  landscape disposed the renderer and reduced its canvas to 1×1.
- These are desktop browser checks at phone viewport sizes, not benchmarks on
  physical low-end phones; no universal frame-rate claim is made.
- Local captures: `test-results/occasion-water-rebound-laptop.png`,
  `test-results/occasion-water-rebound-phone.png` and
  `test-results/occasion-water-orbit-phone.png`.

Photographic refinement: TypeScript, the three timing/budget tests and the
isolated production build passed again. Browser checks covered 1366×768,
1024×768, 390×844, 320×568 and 844×390 landscape, including intermediate/end
orbit positions, returning navigation, loaded images and no horizontal overflow.
The approved water scene remains hidden from the new decorative layers until
release. Final captures: `test-results/occasion-art-laptop.png` and
`test-results/occasion-art-phone.png`.

Motion follow-up: three additional regression tests cover equal phone/desktop
destinations, continuous caption positions through both side crossings, and
central-jewel clearance. Browser inspection includes the mid-turn cardinal
positions at 390×844 and 320×568, as well as desktop caption changes in both
scroll directions. All work still runs from changed native-scroll frames; no
new assets, animation timer or rendering dependency was added.
All six focused tests, TypeScript and the isolated production build passed.
Final motion captures: `test-results/occasion-motion-laptop.png` and
`test-results/occasion-motion-phone.png`.
