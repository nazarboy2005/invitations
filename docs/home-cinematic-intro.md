# Feature opening and cream venue card — 2026-10-28

The user requested that “Nega aynan biz?” become the first photographic scene
inside the existing image-over-image sequence, replacing its detached plain
heading. The sequence now contains five scenes with a shared animated copy
treatment. The venue card uses cream paper, fine gold borders, brown lettering
and a brown navigation pill inspired by the user's supplied reference.

Covering reveals take 0.4 viewport scrolls instead of 0.32 (25% more scroll
distance, 20% lower speed). The 0.9-viewport text reading interval is unchanged.
Sound cues and total track length derive from the same timing constants.
Reduced motion and short screens retain the stacked layout.

Generated with the built-in image generation tool; optimized as desktop
1600×900 and right-cropped mobile 700×1000 WebPs:

- `apps/web/public/images/home/cinematic/intro-daylight.webp`
- `apps/web/public/images/home/cinematic/intro-daylight-mobile.webp`

## Final generation prompt

Use case: photorealistic-natural
Asset type: full-bleed opening background for a premium Uzbek wedding invitation website feature sequence, landscape 16:9.
Primary request: cinematic sunlit ivory wedding setting, quiet and refined, matching warm cream editorial wedding photography.
Scene/backdrop: elegant pale limestone garden terrace with a softly draped ivory silk curtain and a floral arrangement of cream garden roses, delicate white blossoms and restrained olive foliage concentrated on the right third, one subtle trailing burgundy silk ribbon. Beyond, softly blurred sunlit garden. No people.
Composition/framing: wide editorial photograph, eye-level, subtle depth, abundant uncluttered pale ivory negative space on the left half and center for large dark serif web text; details at right edge, soft light-and-leaf shadows on pale stone. Keep central area calm so portrait crop is usable too.
Lighting/mood: natural warm morning daylight, airy luminous highlights, soft film texture, romantic and cinematic but understated.
Color palette: warm off-white, creamy ivory, pale champagne, muted natural greens, tiny burgundy accent. Avoid heavy yellow or pink cast.
Constraints: no text, no typography, no logos, no watermarks, no UI, no frames, no black areas. A real photograph, not a painted illustration.

## Verification

- Web TypeScript check passed.
- Browser reviewed at 1440×900, 390×844 and 320×568. The opening belongs to
  the covering sequence, desktop and portrait backgrounds load, and there is
  no horizontal document overflow. Checked the venue card at desktop and the
  smallest phone breakpoint. The mobile opening has a soft cream wash that
  follows its copy, keeping the floral background legible.
