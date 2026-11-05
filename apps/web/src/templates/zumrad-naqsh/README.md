# Zumrad naqsh — static image invitation

Original 5:7 emerald and antique-gold Uzbek heirloom stationery artwork. The
source artwork is a local SVG with no external references; fonts are bundled.
It uses the static image preview/export renderer and remains independent from
web publishing, payment and third-party image services.

## Field map

All coordinates use the 1500 × 2100 export. One fixed renderer definition drives
both the protected 750 × 1050 preview and flattened PNG download.

| Slot | Contract field | x / y / width / height | Style |
| --- | --- | --- | --- |
| Occasion | `content[locale].eventLabel` | 210 / 335 / 1080 / 60 | Uppercase, tracked, ivory |
| First name | `content[locale].people[0]` | 180 / 490 / 1140 / 115 | EB Garamond italic, ivory |
| Name separator | Both people | 300 / 615 / 900 / 58 | Ivory italic ampersand |
| Second name | `content[locale].people[1]` | 180 / 685 / 1140 / 115 | EB Garamond italic, ivory |
| Invitation | `content[locale].message` | 260 / 875 / 980 / 190 | Centered, ivory |
| Date | `startsAt`, `timezone` | 235 / 1110 / 1030 / 88 | Prominent centered date |
| Time | `startsAt` wall-clock time | 430 / 1213 / 640 / 55 | Tracked, centered |
| Venue | `content[locale].venueName` | 230 / 1350 / 1040 / 65 | Centered, ivory |
| Address/landmark | `content[locale].address`, `.landmark` | 290 / 1430 / 920 / 135 | Centered; empty values omitted |
| Local location QR | Shared Yandex venue or address search | 645 / 1733 / 210 / 210 | Local QR with light quiet zone |

The design supports wedding and fotiha events. Greeting, hosts, contacts, music,
gallery, program, RSVP, wishes and gift fields are unsupported and normalized
away by the shared image capability profile. Empty optional address/landmark text
stays blank. Text shrinks only to the declared minimum; overflow fails before
download. Local EB Garamond fonts include all supported scripts.

The catalog poster is rendered from `preview-sample.json`, and is never persisted
as creator content. Preview pixels are watermarked server-side. Exports are clean
1500 × 2100 PNGs with no editable text or layers. Existing static ownership,
first-download identity lock, correction, deadline and repeat-download rules apply.
