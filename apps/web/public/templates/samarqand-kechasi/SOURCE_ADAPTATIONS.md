# Samarqand Kechasi platform adaptations

The captured invitation layout, motion, and assets remain intact. The platform
loads `platform-adapter.css` after the captured styles to collapse empty note
and bank-name hooks, which have no fields in the approved invitation contract.
The gallery image template has an empty fallback `alt`; the shared runtime
provides a localized description when a guest photo is present, while empty
gallery entries render the template's decorative icon only.

The template receives preview examples only through the centralized
`preview-sample.json` fixture. Blank and authored invitations are adapted from
their own contract data and do not inherit sample content.
