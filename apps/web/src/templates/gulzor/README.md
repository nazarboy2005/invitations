# Toscana platform adaptation

The captured HTML, CSS, artwork, and animation remain packaged under
`apps/web/public/templates/toscana`. The app copy of `template.js` has two
documented source adaptations:

- The lazy Three.js URL points to the local shared vendor bundle.
- Before the captured scroll-film title tween runs, it restores the original
  word spans if a platform data refresh replaced those spans with live text.
  This keeps the title animation working for creator-authored data and avoids
  constructing a GSAP tween with no targets.

Static copy localization is isolated in `apps/web/public/templates/toscana/i18n.js`;
the missing “The atelier” translation is supplied there. Platform contract and
API behavior stays in the shared Marxaba adapter/runtime.

The shared locale runtime provides Uzbek Latin source copy, Uzbek Cyrillic
transliteration, Russian copy, and English copy, including the captured
accessible labels. The source's `venue.photo` slot has no field in the current
invitation contract or creator editor. Per the user's decision, keep the
contract unchanged: the shared runtime shows a map when coordinates are
available, and the template-scoped `platform-adapter.css` hides the empty-photo
easel when neither a photo nor map is available. A real photo, if supplied by
an existing compatible payload, keeps the captured easel. Never inject sample
photo data. This accepted fallback is not a release blocker.

Toscana is published at 150,000 UZS through additive migration
`0076_publish_toscana.sql`, with wedding/fotiha compatibility. Browser review
verified its captured opening, four locales, mobile fit, localized program,
gallery, To‘yona, RSVP counter, creator-name updates, and clean logs. The
authenticated four-locale save/publish/public-render/reopen integration passes
for Toscana. Reduced-motion runtime emulation and external deployment remain
unverified.
