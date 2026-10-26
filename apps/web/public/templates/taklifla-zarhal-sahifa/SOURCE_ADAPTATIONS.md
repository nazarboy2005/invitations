# Zarhal Sahifa source and platform mapping

The source is the archived Taklifla page `diyora-shahzod__be3e347086adb843.html`.
Its SHA-256 and all 30 resolved dependencies are recorded in `provenance.json`.
The original archive remains unchanged. The requested sibling image folder was
absent, so exact image/font dependencies were recovered from the capture
manifest or the exact source URLs. The packaged source styles, reveal animation,
artwork, fonts, and music control remain template-scoped.

## Platform data

| Visible source content | Contract/service mapping |
| --- | --- |
| Invitation title, greeting, couple names, event label, and message | Per-locale `Invitation.content`; personalized `{name}` greeting uses the resolved guest name. |
| Date, weekday, time, and countdown | `startsAt` and `timezone`; date labels use the active locale and countdown uses the event instant. |
| Venue name and address | Localized venue name/address/landmark. The archived map block is hidden legacy markup and remains hidden. |
| Photo collage | Creator `Invitation.gallery`; three byte-pinned captured photographs are used only through `preview-sample.json` in catalog/initial-selection previews. Creator uploads replace those fixture photographs; public data contains only authored uploads. |
| Dress guidance | Enabled `dressCode` style, text, note, and colors. |
| Guest wishes | Preview-only fixture in preview; public approved wishes load from the moderated wishes API. Submission reports success only after an accepted API response; pending wishes are not inserted into the approved feed. |
| Music button | Creator-configured `Invitation.music`. Public playback starts with the invitation and retains the guest's pause choice. Catalog playback stays gesture-gated and can be silenced for QA. |
| Language selector and built-in labels | Uzbek Latin, Uzbek Cyrillic, English, and Russian. The default catalog fixture locale remains Uzbek Latin. |

The reference has no program/timeline, RSVP, gift/to‘yona, contacts, or story
section; the adapter does not invent or expose those controls. The captured map
block was already hidden and remains hidden. Source demonstration names, venue,
dates, and text are removed from the package's initial state. No audio file was
present in the assigned capture, so playback uses only creator-provided music.

## Verification and release

The source and package were checked at 390×844 and 1440×844. The source opening
and local opening retain the same narrow portrait composition; the desktop
renderer centers the 478px source canvas without horizontal overflow. Browser
checks cover all four locales, scrolling/reveals, long names, authored gallery
replacement, empty optional sections, reduced motion, preview no-send behavior,
moderated-wish error/success handling, and creator-music play/pause. The source
opening artwork is rendered as `preview.webp` at portrait ratio. The isolated
HTTP harness uses stub wish responses, so it is not evidence of database
persistence; authenticated application save/publish/public-route/reopen is
verified separately before release.
