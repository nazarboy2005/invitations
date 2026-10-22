# Islamic Edition source capture

- Exact E-invitation catalog title: **Islamic** (shown by the source page), packaged app title: **Islamic Edition**.
- Exact E-invitation source ID: `islamic-edition`.
- Source page: `https://e-invitation.uz/demo/islamic-edition/`.
- Original capture root: `Invitations - this folder will be removed from production/E-invitation/Nikoh to'yi/`.
- Original HTML: `islamic-edition.html`.
- Original design stylesheet: `_nuxt/IslamicEdition.Tfv2Eug9.css`.
- Original shared invitation stylesheet: `_nuxt/InvitationEdition.CYAOr4BP.css`.
- Original Vue edition chunk: `_nuxt/D59gBP7x.js`. It is a shared compiled chunk with multiple edition sections and site integrations; the app keeps it as a source reference and does not execute it.
- The HTML also references `_nuxt/DRGjwF_9.js` and Cloudflare Insights. These belong to the source site's shell/tracking and are not loaded by the app renderer.
- Captured source artwork and motion: `bg.webm`, `video.mp4`, `video-start.jpg`, `video-end.jpg`, `bouquet.webp`, `closing-moon.webp`, `contact.webp`, `corner.webp`, `nighty-bg.webp`, and `quran.webp`.
- The original Vue chunk also references `gift.webp`, which is absent from the supplied local capture and no source ZIP is present. The exact captured asset route `https://e-invitation.uz/_external/assets.e-invitation.uz/islamic-edition/gift.webp` returns a source-site 404 in the ChatGPT in-app browser. The renderer uses captured `bouquet.webp` in the gift panel; keep the template unpublished until the missing artwork is recovered or its omission is accepted.
- Captured source fonts: Amiri, Cormorant Garamond, Great Vibes, and Outfit. The exact Google Fonts CSS referenced by the Vue edition chunk and its thirteen font files are packaged locally under `source/reference/`; three missing responses were recovered from their exact `fonts.gstatic.com` URLs.
- The source capture also contains five generic E-invitation music files under `_external/assets.e-invitation.uz/musics/`. They are not selected by the Islamic design module; catalog preview uses Emotional Piano, while live invitations use the creator's chosen track.
- Original captures remain untouched. Source HTML, Vue chunk, stylesheets, available artwork, and fonts are duplicated under `source/reference/` for review; production loads only the adapted invitation renderer and local design assets.

## Adaptation and current release state

The app renderer maps invitation names, personal guest greeting, date/countdown, venue and map, program, gallery, gift details, contacts, RSVP, wishes, and music from the app invitation object. Source-demo people, dates, venues, cards, table assignments, and RSVP destinations are not carried into live output. RSVP and wishes use the app's public invitation API. Catalog registration is unpublished.

Status: **unpublished; release checks are in progress**. The ChatGPT in-app browser opened the local preview, revealed the intro, and showed app-backed preview data across the hero, date/countdown, program, venue, gift, contacts, RSVP, wishes, and closing. Mobile reduced-motion, language switching, and preview-only RSVP were checked; desktop, normal-motion animation, gallery/map interaction, authenticated save/reopen, publish/public-render/reopen verification, and publication remain open. Preview fixture people, date, venue, card, and contacts appear only in preview. The configured app session reports `user: null` in the in-app browser, blocking authenticated lifecycle verification.
