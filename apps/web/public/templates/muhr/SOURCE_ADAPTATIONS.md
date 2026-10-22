# Muhr platform adaptations

The captured invitation body, stylesheet, template and seal scripts, metadata,
translations, and listed artwork stay byte-identical to the local reference
capture. The packaged document head removes the reference site's sample-data
script and remote Google Fonts links, uses local font files, and points to the
shared Marxaba contract/API runtime and local vendor scripts.

`platform-adapter.css` hides the captured gift-card bank label when the shared
invitation contract has no bank-name value. The contract and creator editor
also lack `venue.photo` and `toyona.note` fields. The venue frame therefore
uses the shared map/empty-photo fallback, and the optional gift note remains
empty because the shared invitation contract has no corresponding fields. Do
not inject sample values into a saved or public invitation. Muhr is published
at 150,000 UZS through additive migration `0077_publish_muhr.sql`. Browser QA
was skipped under the user's release instruction while the browser transport
was unavailable; the shared authenticated save/publish/render/reopen flow is
verified for the published catalog.
