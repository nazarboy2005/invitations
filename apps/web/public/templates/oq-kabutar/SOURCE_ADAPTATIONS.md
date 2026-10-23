# Oq Kabutar platform adaptations

The captured body, styles, motion, opening, and clothing section remain intact.
The adapter binds invitation data and application services through the shared
Marxaba runtime.

The captured gift section includes optional bank-name and gift-note slots,
which have no fields in the approved contract. `contract-adapter.css` hides
those empty rows while preserving the shared preview fixture's card number and
cardholder. It does not add a provider label or put example details into saved
invitation data. The empty Lahzalar gallery uses the shared icon-only fallback;
its source carousel controls wrap and respect reduced motion.

The preview-only sample remains separate from blank and saved invitations.
Live browser/mobile, reduced-motion, save/reopen, and API-backed media checks
remain release gates.

The catalog and initial-selection artwork is `preview-opening.png`, a clean
450×800 render of the captured closed intro from
`/preview?template=oq-kabutar&qaSilent=1&qaReducedMotion=1`. It uses the shared
`preview-sample.json` fixture through the actual `MarxabaInvitation` renderer.
The capture excludes the app language switcher and Next.js development badge;
`preview.provenance.json` records source, fixture, and artwork hashes. The
older `preview.webp` depicts the post-opening hero and is no longer selected as
catalog art. The captured source files remain untouched.
