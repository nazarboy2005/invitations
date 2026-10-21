# Bog‘i Eram platform adaptations

The captured template files and shared Marxaba runtime remain the source of the
rendered design. The platform adds `platform-adapter.css` after the captured
stylesheet to collapse empty note and bank-name hooks; those fields are not
present in the approved invitation contract. The gallery image's fallback `alt`
text is blank so the empty-photo decorative star remains icon-only; the shared
runtime supplies a localized alt description when an uploaded image exists.

The adapter does not add sample content. Catalog and initial template-selection
previews receive the centralized `preview-sample.json` through the typed
renderer; blank or authored invitations receive only their own contract data.
