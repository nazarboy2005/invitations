# Editor input and publication audit — 2026-10-22

## Decisions

- Local publication must work without R2 credentials. Use ignored private local disk storage on this machine; retain R2 for deployment.
- User follow-up: skip receipt AI checks. Accept private image/PDF receipts for manual owner review; never describe an upload as payment confirmation. No AI provider or notification is called.
- Keep exact captured template designs. Missing shared optional sections use a separate adapter; original captures are untouched.

## Input support

| Editor input | Save/public behavior |
| --- | --- |
| Event type, compatible design | Database checks compatibility; identities lock at publication. |
| Names and hosts | Stored per locale. First two names use captured name slots; additional names have a shared supplemental section. |
| Enabled/default languages | Four supported locales; required text checked in each enabled language. |
| Event label, greeting, invitation text | Creator content replaces preview sample data. |
| Date/time | Real local date/time and IANA timezone validated; editing ends at event-local day end. |
| Venue, address, landmark, map URL | Text preserved, map links supported; external venue autocomplete remains future work. |
| Program heading, repeatable time/title | Order and IDs preserved; each time/title required in enabled languages for added entries. |
| Story | Localized chapters preserved; separate adapter supplies a section when the selected reference lacks one. |
| Dress-code switch, style, text, note, palette | Native captured section when available; shared fallback otherwise, including Anor. |
| Photo upload, caption, external URL | JPG/PNG/WebP up to 15 MB. Local/R2 uploads are type/size checked and owner protected. Publication checks stored object existence and size. Captions preserved. External hosts can remove or deny their images; the app does not proxy arbitrary URLs. |
| Music switch, library, own upload | Optional. MP3/WAV/M4A up to 15 MB, own reusable library and platform tracks. Enabled music requires a selection. Public reads support seeking/ranges. Browser opening/play interaction remains required for sound. |
| Gift switch, card number, holder | Optional, valid card number and holder required when enabled. |
| Receipt switch | Private JPG/PNG/WebP/PDF up to 5 MB; giver names required; no AI or bank verification. Rate limited and deduplicated by invitation/file hash. Owner can mark received/problem. No file URL is returned to anonymous guests. Disabling stops new uploads without deleting old receipts. |
| RSVP switch, deadline, party maximum | Backend enforces limits/deadline. Anonymous same-browser changes replace their earlier response using an opaque HttpOnly cookie; personalized guests are bound to their verified token. Owner sees responses/totals. Clearing cookies or using another browser can produce a separate anonymous response. |
| Wishes switch | Guest submits pending; owner approves/hides from activity page; only approved wishes are public. |
| Phone and Telegram username | Validated before publishing and mapped to contact links. |

## Storage and deployment

`MEDIA_STORAGE=local` and an absolute `LOCAL_MEDIA_DIR` are configured privately for this computer. Bytes are outside `public/`, keyed by generated identifiers, and read only through authorized media routes. Local disk must be backed up with the database. No silent local fallback runs on Vercel. R2 credentials and real R2 transfers are still unverified; switching providers does not move existing files automatically. Existing keys retain their storage location.

Guest receipt bodies pass through the app; platform body limits may be lower than 5 MB. R2 creator uploads use direct presigned PUTs. Persistent production hosting, storage/CORS setup, abandoned-file retention, and Telegram notification jobs remain separate deployment work.

## Verification

`pnpm test:publishing`: **18/18 passed**, including all 15 published templates with four-language field preservation and local media/receipt/RSVP/moderation flows. Related checks passed **44/44**; TypeScript and final production build passed. Full suite: **359 passed / 41 existing capture failures**, with the same failure names as the previous baseline. Browser review confirmed the authored Anor opening and its newly supported dress-code section.

See details in `PUBLISHING_VERIFICATION.md`. Integration tests use disposable accounts, invitations, receipt/RSVP/wish rows and local files, then remove those exact fixtures. They never send Telegram messages, call AI, or modify customer invitations.
