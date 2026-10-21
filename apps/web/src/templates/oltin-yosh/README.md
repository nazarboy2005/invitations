# Oltin Yosh adapter

`OltinYoshInvitation` delegates to the shared `MarxabaInvitation` iframe adapter. The captured template source and assets live in `apps/web/public/templates/oltin-yosh`; the original capture remains untouched. The preview and public page use the same packaged renderer.

## Source package and changes

The package retains the captured `index.html` body, `template.css`, `template.js`, `i18n.js`, `meta.js`, and all `art/` assets. It excludes the captured `sample-overrides.js` and Marxaba site-level sample/runtime scripts. The HTML head redirects the captured Google Fonts and reference runtime imports to local font files and the existing shared runtime, removes the sample-specific Shahzoda description, and adds portrait preview metadata. The source script changes only its shared Three.js path and removes the captured default celebrant age of 30; no age is fabricated where the invitation contract supplies none. `i18n.js` retains every captured translation and adds localized document title and description strings so Russian and English metadata do not remain in Uzbek. `fonts.css` and `fonts/` bundle the captured Inter and Syne families for offline rendering. The capture metadata names `preview.webp`, but no such image exists in the local Marxaba capture tree. The packaged WebP was captured from the browser-rendered opening at 450×800 / DPR 1 using the centralized birthday preview fixture, then encoded from the actual screenshot to WebP at quality 0.94. Its current SHA-256 is `313d4fc7544c2ca59636794df948dcef6268362a819cf0cea596cbbdfd6de84d`.

## Data mapping and gaps

The shared adapter maps the first localized invitation person to `extras.celebrant`, and the captured source consumes the shared localized greeting, event label, message, hosts, date/time/timezone, program, venue/address/map links, gallery, dress code, music, RSVP, wishes, gift/to‘yona, and contact values. Repeating rows use the shared adapter's stable invitation items. Sample wishes and catalog content stay ephemeral according to the shared preview rules.

The capture also asks for `extras.age`, `venue.photo`, `toyona.bank`, and `toyona.note`; the approved invitation contract has no celebrant-age, venue-photo, gift-bank-name, or gift-note fields. These are left empty and no placeholder images, age digits, or extra gift details are injected. Its declared event types are `tugilgan-kun` and `yubiley`, category `tugilgan-kun`; shared integration maps these to the distinct typed event IDs `birthday` and `yubiley`. Catalog categories and event compatibility remain separate. The canonical fixture supplies localized birthday and jubilee samples; no template-specific sample data is included.

## Verification

The focused test checks captured sections and controls, local dependencies/assets/fonts, no sample runtime, metadata, source-only gaps, and the actual portrait WebP preview. Package checks are necessary but do not complete the parent catalog/database integration or publication QA.
