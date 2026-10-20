# Project instructions

Before implementing invitation creation, publication, editing, authentication, payments, personalization, language variants, template selection/switching, template pricing, RSVP, guest wishes/moderation, or to'yona features, read `IMPLEMENTATION_DECISIONS.md` in this project root. It records the user's approved editing/reuse policy and established product requirements. Preserve those decisions unless the user changes them.

The user has requested an ongoing project decision record. As requirements are discussed, update `IMPLEMENTATION_DECISIONS.md` with important confirmed decisions and corrections. Keep it concise, distinguish user requirements from recommendations and unresolved questions, and revise superseded decisions rather than accumulating contradictions.

## New invitation templates

For each task to add a template, read `IMPLEMENTATION_DECISIONS.md`, `apps/web/src/templates/README.md`, and any nested `AGENTS.md` files. Follow the reusable full-fidelity implementation prompt in `docs/templates/new-template-implementation-prompt.md`.

The required approach is to package the selected reference's complete template-level source (HTML, CSS, JavaScript, fonts, assets, animation, and interactions) and adapt it to the shared typed invitation contract. Do not redraw or approximate the design from screenshots. Keep original reference captures untouched, keep the template source isolated, and keep data/API adapters separate. Do not copy the reference site's app runtime, analytics, or sample invitation data.

Use the shared `apps/web/src/modules/catalog/preview-sample.json` only for catalog and initial template-selection previews. Creator content must replace sample content; sample data must never be saved or published. Map every visible field and interaction, support the approved locales and reduced motion, and use the same real renderer in preview and public display.

Register each template in the typed catalog and database with an additive migration and category assignment. Keep it unpublished and unselectable until the documented completeness, integration, and verification requirements pass. Use its actual first-page/catalog artwork at the appropriate portrait aspect ratio so the distinctive opening page is visible in the catalog. Do not deploy externally or enable live payments as part of template work unless separately authorized.
