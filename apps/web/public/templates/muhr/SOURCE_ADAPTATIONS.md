# Muhr platform adaptations and release gaps

The captured invitation body, stylesheet, template and seal scripts, metadata,
translations, and listed artwork stay byte-identical to the local reference
capture. The packaged document head removes the reference site's sample-data
script and remote Google Fonts links, uses local font files, and points to the
shared Marxaba contract/API runtime and local vendor scripts.

`platform-adapter.css` hides the captured gift-card bank label when the shared
invitation contract has no bank-name value. The contract and creator editor
also lack `venue.photo` and `toyona.note` fields. The venue frame therefore
uses the shared map/empty-photo fallback, and the optional gift note remains
empty; these missing editor/contract fields are release gaps. Do not inject
sample values into a saved or public invitation. Keep Muhr unpublished until
the gaps and remaining browser/service release checks are resolved.
