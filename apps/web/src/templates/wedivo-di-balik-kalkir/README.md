# Ravshan Muhabbat (source: Di Balik Kalkir)

The captured HTML is preserved byte-for-byte at
`public/templates/wedivo-di-balik-kalkir/source/captured-template.html`.
`public/templates/wedivo-di-balik-kalkir/index.html` is the app-hosted source
copy with the provider parameter manifest and preview shim removed, external
fonts made local, and invitation-specific example media removed. Source
artwork and exact font files live in `public/templates/wedivo-di-balik-kalkir/assets`.

`renderer.tsx` uses this same iframe renderer for creator preview and guest
display. `adapter.ts` maps the shared `Invitation` contract through the
existing legacy data adapter. `adapter.js` binds names, authored message, dates,
venue, schedule, story chapters, gallery, dress code, RSVP, wishes, and locale
to the original source DOM while preserving its opening and motion scripts.
RSVP and wishes submit only to the platform's existing public APIs; preview
submissions are disabled. The RSVP service receives party size 1/0, per the
approved guest-count rule.

The source's amount-based gift transfer form and physical gift mailing address
have no matching contract/service fields. The adapter hides that section rather
than claiming a gift confirmation succeeded. The source quote and before/after
anecdote likewise have no contract fields; those sections are hidden, while
authored contract story chapters populate the original four chapter layout and
vellum interaction. The source video section remains hidden because there is no
video field in the invitation contract.

This package is not registered in the shared catalog. Registration, database
migration, event compatibility and publication remain coordinator-managed.


## Uzbek copy

The proposed Uzbek catalog name is **Ravshan Muhabbat** (“Clear Love”). The production copy defaults to natural Uzbek Latin while retaining the source's paper, vellum, floral, typography and motion design. Captured Indonesian demo biographies, dates, venue, family names and story prose are removed; personal details come only from the invitation contract. Unsupported source quote, before/after, video and gift sections stay hidden.

Section labels and interaction copy use concise Uzbek wording to fit the original cards and controls. RSVP, wish, gallery, countdown and calendar feedback are localized in the host adapter. The original capture remains unmodified. The renderer continues to accept the approved Uzbek Cyrillic, English and Russian locale codes through the existing locale adapter; this package establishes Uzbek Latin as its complete default copy.
