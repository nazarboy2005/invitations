# Aurelia source adaptations

The captured `index.html`, `assets/css/aurelia.css`, `assets/js/aurelia.js`,
fonts, image assets, SVG ornaments, and hero video are packaged locally. Original
capture files remain untouched. HTML structure, captured CSS, and the original
preloader/countdown behavior are retained. Locally packaged Trajan font URLs
replace source-host URLs; files and hashes match the captured font assets.

`assets/js/aurelia-adapter.js` is the platform adapter. It maps the shared
invitation contract to source slots, localizes the four supported locales,
connects RSVP and moderated wishes to platform APIs, maps creator gallery
uploads while retaining captured default photos for empty slots, and implements
the optional To‘yona card interaction. It also handles reduced motion for the
hero video. The captured `aurelia.js` originally displayed RSVP success without
submitting to a service; that duplicate local RSVP handler was removed so the
adapter is the only response handler. The original opening artwork, layout,
countdown, and animation remain unchanged.

The shared preview fixture is used only for catalog and initial template
selection. Creator-authored values replace it, and fixture values are never
saved or published. The same packaged page is used in creator preview and public
display.
