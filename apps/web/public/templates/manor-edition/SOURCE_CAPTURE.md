# Manor source capture

- Exact E-invitation catalog title: **Manor**.
- Exact E-invitation source ID: `manor-edition`.
- Source page: `https://e-invitation.uz/demo/manor-edition/`.
- Original capture root: `Invitations - this folder will be removed from production/E-invitation/Nikoh to'yi/`.
- Original HTML: `manor-edition.html`; source page displayed its title but stayed at “DIZAYN YUKLANMOQDA” in the in-app browser.
- Original design Vue chunk: `_nuxt/CK_975a4.js`; it contains the Manor module and source-site sample data. It is preserved as reference only and is not executed by the app.
- Original design and shared styles: `_nuxt/ManorEdition.C7IcG54x.css` and `_nuxt/InvitationEdition.CYAOr4BP.css`.
- All 15 captured Manor art/media files are packaged: `cake.webp`, `couple.webp`, `divider.webp`, `doves.gif`, `frame.webp`, four `gallery-romance-v1-*.webp` photos, `hero.jpg`, `intro-poster.jpg`, `intro.mp4`, `rings.webp`, `table.webp`, and `wreath.webp`.
- The page references the captured Google Fonts CSS. Twelve referenced Cormorant Garamond, Great Vibes, and Inter font files are packaged locally; three missing capture responses were recovered from exact `fonts.gstatic.com` URLs.
- The source page also loads Cloudflare Insights and source-site application chunks; these do not load in the app renderer.
- Original captures remain untouched. Source HTML, Vue chunk, CSS, fonts, and assets are duplicated under `source/reference/`; production loads only the adapted renderer and local design assets.

## App adaptation and release status

The adapted renderer maps names, personalized guest greeting, date/countdown, venue/map, program, gallery, gifts, contacts, RSVP, wishes, and creator music from app invitation data. Catalog previews use Emotional Piano. Source demo names, dates, venues, table assignment, and payment data are excluded from live invitations. Catalog registration is unpublished and the live database row is verified as unpublished.

Status: **unpublished; release checks are in progress**. The app's in-app browser preview rendered the intro and mobile reduced-motion layout, opened the invitation, and showed app-backed names, date/countdown, program, venue, gift, contacts, RSVP, and preview wishes. Desktop, non-reduced-motion animation, gallery/map interaction checks, authenticated save/reopen, publish/public-render/reopen, and publication remain open. The live source demo remained in its loading state, so source-to-app parity has not been confirmed. The configured app session reports `user: null` in the in-app browser; authenticated verification cannot proceed without a signed-in user session.
