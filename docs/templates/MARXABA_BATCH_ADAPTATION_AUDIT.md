# Marxaba ten-template source and adaptation audit

Audit date: 2026-10-20. Reference authority: the user-provided
`Invitations - this folder will be removed from production.zip`, checked
read-only. Production copies are under
`apps/web/public/templates/<template-id>`.

## Archive and asset integrity

- Checked the ten selected template folders against 99 files in the original
  ZIP. Every file exists in both the extracted reference tree and the
  production package; all 99 extracted reference files match their ZIP entry
  SHA-256 hashes.
- Every packaged image, SVG, and font asset present in those 99 archive entries
  matches the original bytes. Eight SVG files in Kuzgi Chinor and Muhabbat
  Kitobi initially differed only in LF versus CRLF at end of file; their app
  copies were restored from the ZIP and now hash-identically match.
- All ten packaged templates have local `fonts.css` files. The original ZIP
  and extracted reference files were not modified.
- Text source copies may have checkout line-ending differences. After line
  ending and trailing-newline normalization, intentional template-level
  content differences are limited to the paths listed below.

## Intentional template-source adaptations

Every `index.html` receives the shared platform bridge and local font
stylesheet, removes the capture-only `sample-invitation.js` injection, and uses
generic document metadata. Template files remain isolated; the following body
changes bind previously fixed text to the shared invitation data while keeping
the captured page structure and design:

| Template | Changed copied source files | Reason |
|---|---|---|
| Oltin Nur | `index.html` | Local-font and shared-bridge bootstrap; generic metadata; remove capture-only sample loader. |
| Samarqand Kechasi | `index.html` | Local-font and shared-bridge bootstrap; generic metadata; remove capture-only sample loader. |
| Bogâ€˜i Eram | `index.html` | Local-font and shared-bridge bootstrap; generic metadata; remove capture-only sample loader. Its Open Graph text describes the design, not a creator couple. |
| Atlas | `index.html` | Common bootstrap plus replace fixed city, date, and event marquee copy with venue, date, and event fields. |
| Uchar Gilam | `index.html`, `template.js` | Common bootstrap; protect asynchronous carpet-texture creation after renderer teardown or WebGL context loss. Texture anisotropy now tolerates a null capabilities object and falls back to 1. |
| Oq Kabutar | `index.html` | Local-font and shared-bridge bootstrap; generic metadata; remove capture-only sample loader. |
| Kuzgi Chinor | `index.html`, `template.css` | Common bootstrap; remove the remote Google Fonts import because the same font families are bundled locally and loaded by `index.html`. |
| Muhabbat Kitobi | `index.html`, `template.js` | Common bootstrap; render authored localized story chapters in the captured book-turn sequence while retaining its chapter artwork and layout. |
| Sahifa | `index.html` | Common bootstrap plus remove fixed example names/location labels and bind visible fields to the shared invitation data. |
| Oltin Uzuk | `index.html`, `template.js` | Common bootstrap plus dynamic engraving names/date; guard empty GSAP targets for titles, dress palette, and calendar cells. |

The shared `platform-bridge.js` is separate from the captured source. It adapts
shared invitation JSON to the source templates and supplies platform-only
features such as locale controls, overflow-safe name fitting, and optional
voice playback. The shared `templates/shared/nikoh/core.js` copy now honors the
`silentPlayback` preview payload by muting its soundtrack. The platform bridge
applies the same preview-only mute to voice audio. This lets QA exercise each
real opening action and its animations without audible playback; public
rendering never receives the flag. The detailed field contract and known
publication gates remain in `TEMPLATE_ROADMAP.md` and
`IMPLEMENTATION_DECISIONS.md`.

## Remaining review

This audit proves source-file presence and asset-byte fidelity; it does not
prove visual equivalence or complete behavior. Full reference-versus-app
screenshots, opening/motion checks, every interaction and optional section,
and per-template long-copy/reduced-motion review remain open. Backend runtime
save/reopen and media upload/public playback also remain unverified because
this checkout lacks the required service configuration. No template is marked
production-ready by this audit.
