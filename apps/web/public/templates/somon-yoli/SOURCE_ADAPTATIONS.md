# Somon Yo‘li platform adaptations

The captured layout, stylesheet, motion, and artwork remain intact. The
platform adds a small `platform-adapter.css` file after the captured styles to
collapse the empty note and bank-name hooks; those fields do not exist in the
approved invitation contract. The empty gallery image template has no fallback
alt text, so placeholder cards remain icon-only. The shared runtime sets a
localized description when a real uploaded image is rendered.

Catalog and initial template-selection previews receive sample data only from
the centralized `preview-sample.json`. Blank and authored invitations are
adapted from their own contract data; the fixture is not copied into drafts.

The catalog cover uses the source's `#hero` section with its astrolabe, names,
date, and motto, matching the original cover the user identified. The source
opening poster (`art/poster-galaxy.webp`) remains untouched and still appears
when guests first open an invitation. The cover capture uses the unchanged
source HTML, CSS, and astrolabe artwork with only canonical preview fixture
values; its portrait framing and checksum are recorded in
`preview.provenance.json`.
