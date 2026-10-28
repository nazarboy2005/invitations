# Published invitation previews

Published `/i/<code>` links use a dedicated 1200×1200 JPEG and the invitation's
authored names/event title and localized event/date details. The artwork contains
no names, dates or sample text. Catalog posters remain separate.

The Open Graph and Twitter tags are rendered on the server. `?lang=` selects an
enabled authored variant; unsupported/repeated language parameters use the
default. Dates use the existing event-timezone formatter. Canonical and preview
URLs omit `?g=`; guest greetings and other private content never enter metadata.
Draft, archived and invalid links retain the public route's 404 behavior.

Telegram is added to the framework's existing HTML-limited bot list so its
crawler gets tags in `<head>`. Other crawler defaults are preserved. Twitter's
`summary` format suits square art; each messaging client/sender controls its own
preview size. A locally verified HTTP response does not establish how a remote
client will crop or cache a particular message.

## Artwork maintenance

- Curate `share-artwork-sources.json` in this directory. Select text-free scene,
  ornament or illustration assets; avoid sample people, sample ages and event
  photos. Crops are normalized `[left, top, width, height]` values. Transparent
  artwork can be placed on a matching background using `fit: "contain"`.
- Designs without a standalone art asset use a text-free vector motif in the
  template palette. Do not fabricate customer initials.
- Run `pnpm share:artwork` from the project root. The generator writes static
  JPEGs into `apps/web/public/share/templates`, builds the JSON manifest used by
  the metadata helper, and removes only obsolete generated JPEGs in that folder.
  Commit the recipes, generated files and manifest together. No rendering or
  image transformation runs during publication or crawler requests.
- Inspect the output at square and thumbnail sizes. File names contain a hash
  of their actual bytes so an artwork change gets a new URL. These assets can
  be cached for a year; published invitation text remains dynamic.

`APP_URL` supplies the public origin, using the same configuration as existing
published invitation links. A neutral square envelope is available as a fallback
for template IDs without an image entry.

## Verification

`pnpm test:sharing` runs focused metadata/artwork checks and anonymous Telegram
HTTP checks against the local app configured in `apps/web/.env.local`. HTTP
checks create and clean up isolated test rows, verify tags in `<head>`, fetch the
public JPEG without credentials, and check draft/archive 404 responses. They do
not send messages to Telegram.
