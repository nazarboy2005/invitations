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
