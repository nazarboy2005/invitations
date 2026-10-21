# Oltin Kuz source package

The captured `index.html` body, `template.css`, `template.js`, `meta.js`, and all files under `art/` are copied from the untouched Marxaba capture. `index.html` is adapted only in its head: it loads the application’s local fonts, shared invitation runtime, and platform bridge in place of the capture’s shared runtime loader. The shared runtime and `MarxabaInvitation` adapter keep creator data and service/API behavior outside the template source. `i18n.js` retains the source’s interface translations but omits the embedded demo honoree, venue, and birthday label. The captured `sample-overrides.js` is not packaged.

`fonts.css` and its local font files provide the Cormorant Garamond and Lora families requested by the captured source; no external font request remains. `preview.webp` shows the captured opening at the first name reveal, using the birthday-specific content from the centralized `preview-sample.json` fixture. The fixture is not included in this package and is never used for saved or public invitation data.

The source expects `extras.age`, `extras.yearLabel`, `venue.photo`, `gallery[].year`, and `toyona.bank`. The approved invitation contract currently has no celebrant-age, gallery-year, or venue-photo fields, and the bank-name field was explicitly removed. The adapter therefore leaves those values empty and does not provide sample values for them. These are integration gaps for the parent release review; this package stays unpublished and unselectable until the contract mapping and end-to-end checks are complete.

The captured metadata declares `tugilgan-kun` and `yubiley`. Shared integration maps these explicitly to `birthday` and `yubiley`; the new jubilee event type is distinct from the birthday catalog category. The unsupported dynamic source fields listed above remain empty rather than being guessed from other invitation data.

`OltinKuzInvitation` is a small React entry point over the existing shared `MarxabaInvitation` adapter. Registry, contract, event compatibility, and database integration are intentionally left to the parent task.
