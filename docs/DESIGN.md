# Visual direction

The platform interface uses the user-selected **Ivory + gold + charcoal** palette. Gold gives the product a celebratory identity while ivory keeps the interface light and charcoal keeps text readable.

| Role | Value |
| --- | --- |
| Page background | `#faf7f0` |
| Card and form surface | `#fffdf8` |
| Soft surface | `#f7f1e5` |
| Main text | `#3f3932` |
| Muted text | `#756e65` |
| Border | `#e8e1d5` |
| Soft gold border | `#d9c99e` |
| Primary action | `#8a641c` |
| Primary action hover | `#73520f` |
| Champagne gold accent | `#c1a05c` |
| Strong gold detail | `#8a641c` |
| Pale gold surface | `#f3ead4` |

Use a plain sans serif for forms and a restrained serif for headings. Use deep
gold for primary buttons and the brighter champagne gold for small highlights,
icons, selection states, and focus rings. Keep gold off large background areas.
Use ivory/champagne light gradients and metallic text gradients on the homepage,
as requested in the latest design pass. Avoid brand-green accents and fabricated
social proof. Keep keyboard focus, readable contrast, reduced motion, and mobile
form/preview switching.

This palette is for the platform shell: navigation, editor, dashboard, forms,
and catalog UI. Invitation templates retain their own reference colors and
visual identity; do not recolor their source designs to match the shell. The
catalog currently has published designs as well as unpublished work, so empty
states should reflect the actual catalog response rather than assume it is empty.
Preserve each template's meaningful source animations and opening experience,
with an accessible reduced-motion alternative. Captured reference websites and
files remain outside the production app.

## Homepage composition (2026-10-22)

The homepage follows an invitation-atelier direction: editorial spacing, luminous
ivory surfaces, gold gradients, layered shadows, fine linework, and a charcoal
gradient statement section. Cormorant
Garamond provides the display headings, Manrope the body and navigation, and
Great Vibes a selective calligraphy accent in the hero and decorative artwork.
These fonts are hosted locally. The homepage and creator workspace share the
display/body fonts; calligraphy remains a selective homepage accent. Invitation
renderers keep their reference typography.

The hero links to real available catalog previews, with Anor and Sahifa preferred
when present. The catalog preserves complete portrait artwork, published-template
selection, and current pricing. Only categories containing available templates
appear as filters. Below it, the page explains the creation process, highlights
invitation details, and provides keyboard-accessible native FAQ disclosures.
The hero adds an ivory/champagne atmosphere, metallic display text, floating
preview cards, a clearly labeled sample completion card, and a motion pause
control. Reduced-motion users see a static composition. Catalog counts come from
the available data. A nonzero anonymous published-invitation total can replace
the three-step metric; no invented usage numbers or customer reviews appear.
The interactive stars capture only an unsent personal preference and say so.
The header uses a floating translucent surface, a gold emblem, and a shaded gold
creation action while retaining directional visibility and signed-in wording.

Catalog cards use bounded artwork stages (285px desktop, 225px phone), with the
complete portrait artwork contained inside. Prices overlay the stage; description
text occupies one line, with the full description retained in the accessible
text and browser tooltip.
The process section uses three raised ivory panels, while the feature and footer
sections continue the warm layered treatment.

Mobile layouts stack the hero and feature sections, use two catalog columns
where space permits (one below 361px), and adapt navigation. Entrance and hover
motion respect reduced-motion settings.

## Scroll and navigation (2026-10-22)

The homepage uses desktop wheel inertia with a restrained slowdown and easing.
Touch and reduced-motion users keep native scrolling. The implementation uses
[Lenis](https://github.com/darkroomengineering/lenis), with anchor handling and
cleanup on navigation. Smoothing is scoped to the homepage so editor fields,
menus, and invitation frames keep their own native scroll behavior.

The shared site header is sticky. After leaving the top of the page, downward
scrolling slides it out; upward scrolling reveals it. A direction threshold
avoids jitter. Keyboard focus reveals the header, and reduced-motion settings
remove the slide transition. The studio keeps its own sticky save toolbar,
without the site navigation.

## Creator workspace (2026-10-22)

Use a quiet ivory workspace with a bordered central editing surface, a compact
four-step rail, and a sticky live-preview panel. Large display headings,
segmented step position, clear field labels, roomy inputs, and small language
controls establish hierarchy. Uploads, repeatable program/story entries, optional
settings, and selected templates share the same soft surfaces and gold details.
Preview presentation stays rectangular and uses the actual renderer.

At tablet widths the steps become a horizontal row. On phones, show compact
steps and separate editing/preview controls; stack paired fields on very narrow
screens and use 16px input text. Returning to another step starts at the top of
the form. Keep draft recovery, login, save behavior, template compatibility,
optional sections, and authored-data handling intact.
