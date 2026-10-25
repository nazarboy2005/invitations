# Visual direction

The user-approved platform palette is **pomegranate + white + charcoal**, with
selective blush highlights and small gold decorative details. Approved on
2026-10-25 after reviewing the cream-heavy implementation. This supersedes the
previous ivory/gold direction and cream-only Why us treatment.

| Role                                 | Token                  | Value     |
| ------------------------------------ | ---------------------- | --------- |
| Page background                      | `--bg`                 | `#ffffff` |
| Cards and forms                      | `--surface`            | `#ffffff` |
| Quiet workspace/section fill         | `--surface-soft`       | `#f8f6f7` |
| Main text                            | `--ink`                | `#29252a` |
| Muted text                           | `--muted`              | `#6f6770` |
| Neutral borders                      | `--line`               | `#e9e3e6` |
| Selection/accent borders             | `--line-strong`        | `#e5b4bf` |
| Primary action and focus             | `--primary`, `--focus` | `#b8324a` |
| Action hover                         | `--primary-hover`      | `#98263d` |
| Action text                          | `--on-primary`         | `#ffffff` |
| Interactive accent                   | `--accent`             | `#b8324a` |
| Strong interactive accent            | `--accent-strong`      | `#98263d` |
| Soft selection surface               | `--accent-soft`        | `#fff1f3` |
| Stronger illustration/selection tint | `--accent-tint`        | `#f7dce2` |
| Decorative gold                      | `--gold`               | `#c6a15b` |
| Text on small gold details           | `--gold-ink`           | `#765719` |
| Soft decorative gold                 | `--gold-soft`          | `#fbf5e8` |

Use white as the dominant surface. Pomegranate identifies primary actions,
selected controls, focus, and selective heading emphasis. Keep blush localized
to the hero artwork, a few feature panels, and selection states. Reserve gold
for small ornaments and seals. Do not apply a warm tint to every surface.
Use neutral charcoal shadows through `--shadow-color`.

White on the primary pomegranate has approximately 5.84:1 contrast; body and
muted text remain readable on white and blush surfaces. Decorative gold is not
for small informational text on white. Keep visible keyboard focus, reduced
motion, and usable phone controls. Semantic warning/error/success colors remain
independent from the brand palette.

## Scope and typography

These tokens style platform navigation, catalog/preview chrome, studio,
dashboard/activity pages, forms, and dialogs. Invitation templates retain their
own source colors, typography, assets, animations, and opening experiences.
Do not recolor template renderers or authored invitation data.

Cormorant Garamond supplies editorial headings, Manrope supplies platform body
text/navigation, and Great Vibes is a selective homepage calligraphy accent.
Fonts remain locally hosted. Forms and functional controls use the sans serif.

## Homepage and catalog

Order: hero, eight curated published designs, visual Why us, three creation
steps, FAQ, final create/discovery invitation. The white hero has a localized
blush atmosphere behind real Anor/Sahifa artwork, solid charcoal/pomegranate
headings, small gold ornaments, and a clear “Dizaynlarni ko‘rish” action linking
to `/templates`. The personal star preference remains explicitly unsent.
Do not invent social proof or usage metrics.

Why us retains its asymmetric invitation/map lead row and reply, wish, and gift
illustrations. White/neutral cards alternate with selected blush panels; routes,
hearts, and the envelope use pomegranate, with small gold seals. Illustrations
are marked as samples and use lightweight HTML/CSS/SVG without extra renderers.
The process uses a neutral soft background and white cards. FAQ stays white;
the final statement uses charcoal with a pomegranate action. Footer stays white.

`/templates` contains search, categories, and the full published catalog.
Selected category pills use white text on pomegranate. Fully clickable 3:5
portrait cards preserve actual design art and bottom-gradient captions. Detail
dialogs retain their real silent phone preview and preview/create actions;
preview surroundings use subtle neutral/blush surfaces. On phones the dialog
is a partial-height bottom sheet with entrance/exit motion, internal scrolling,
keyboard focus handling, safe-area padding, and a reduced-motion fallback.
Only one silent live card preview plays at a time; artwork/renderers load lazily.

## Workspace, navigation, and motion

Keep the creator workspace calm: white form surfaces, neutral soft surroundings,
pomegranate active steps, primary actions, selected options, and focus. Preserve
the four-step workflow, sticky save toolbar, language controls, browser draft
recovery, and responsive edit/live-preview switching. Dashboard and activity
views share the same platform tokens, including tabs, summary surfaces, and
shared select/date/dialog controls.

Retain the sticky directional site header and restrained desktop wheel smoothing.
Phones/tablets and reduced-motion users retain native scrolling. Keep smoothing
scoped to the homepage, allow native nested/form scrolling, and respect reduced
motion for entrance/hover effects and catalog transitions.
