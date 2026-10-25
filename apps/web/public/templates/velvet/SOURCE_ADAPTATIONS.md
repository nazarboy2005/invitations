# Velvet source adaptations

Reference: `Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz/velvet.html`, resolved from the Invitate capture manifest. The original capture is unchanged. The complete template package retains the source page structure, captured Velvet CSS and animation JS, opening/background videos, audio asset, image assets, and source visual interactions.

## Adapter changes

- `index.html` keeps the original section order, slider opening, video layers, calendar, program, RSVP form, countdown, and initials. Static sample invitation text and program rows are binding targets or removed; creator data supplies them at runtime.
- `bridge.js` is the platform adapter. It maps shared contract fields, localizes controls, rebuilds ordered program rows, updates the calendar and countdown, blocks preview RSVP sends, and submits real RSVP responses through the application API. It does not call the captured webhook.
- `assets/js/velvet.js` retains the slider, unlock, audio/mute, calendar, localized Enter-key heart-date prompt, and staggered program reveal. The fixed source countdown and date are replaced by event data; the event date is the initial heart highlight. System or preview-QA reduced motion pauses the autoplay videos, suppresses CSS animation, and removes the delayed opening overlay.
- `assets/css/velvet.css` retains the captured styles and adds a reduced-motion override. `assets/fonts/*.css` preserves the captured Merriweather, Open Sans, Playfair Display, and Great Vibes face declarations. All font files referenced by those captured stylesheets are bundled locally, including subset binaries omitted by the capture archive.
- `preview.webp` is the 450×800 source opening hero and slider before the invitation details, without fixture text. `preview.provenance.json` records its source and hash.

## Remaining fidelity evidence

The manifest and archive search found no additional Velvet component or source chunk. Visual comparison confirms the cover uses the same opening hero and slider scene as the archived provider screenshot. A matched-viewport browser comparison of normal/reduced motion, the interaction sweep, and public/save-reopen/API checks are still outstanding because the browser policy blocked access to the workspace loopback route. Keep Velvet unpublished until those checks pass and any resulting differences are recorded.
