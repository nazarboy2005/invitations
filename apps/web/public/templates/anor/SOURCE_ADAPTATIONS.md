# Anor source adaptations

The captured source files in `source/` are kept intact. `bridge.css` contains
only platform adapter styling: the shared invitation contract does not define
a gift bank-name or note field, so their captured empty slots are hidden. Card
number and card holder remain supported and are populated from the invitation
or the preview-only catalog fixture.

Catalog wishes are supplied by the shared localized preview-wishes helper.
They are not written into the invitation contract or saved with creator data.
