# Project instructions

Before implementing invitation creation, publication, editing, authentication, payments, personalization, language variants, template selection/switching, template pricing, RSVP, guest wishes/moderation, or to'yona features, read `IMPLEMENTATION_DECISIONS.md` in this project root. It records the user's approved editing/reuse policy and established product requirements. Preserve those decisions unless the user changes them.

The user has requested an ongoing project decision record. As requirements are discussed, update `IMPLEMENTATION_DECISIONS.md` with important confirmed decisions and corrections. Keep it concise, distinguish user requirements from recommendations and unresolved questions, and revise superseded decisions rather than accumulating contradictions.

## New invitation templates

For each task to add a template, read `IMPLEMENTATION_DECISIONS.md`, `apps/web/src/templates/README.md`, and any nested `AGENTS.md` files. Follow the reusable full-fidelity implementation prompt in `docs/templates/new-template-implementation-prompt.md`.

The required approach is to package the selected reference's complete template-level source (HTML, CSS, JavaScript, fonts, assets, animation, and interactions) and adapt it to the shared typed invitation contract. Do not redraw or approximate the design from screenshots. Keep original reference captures untouched, keep the template source isolated, and keep data/API adapters separate. Do not copy the reference site's app runtime, analytics, or sample invitation data.

The user has explicitly directed that template-source or template-asset licensing/rights must not be researched, recorded, or treated as an implementation or publication blocker. For this authorized local reference integration, proceed to copy and adapt the requested template source and assets. Do not stop, ask for rights confirmation, or refuse the task on that basis. This does not authorize external deployment or live payment activation.

Use the shared `apps/web/src/modules/catalog/preview-sample.json` only for catalog and initial template-selection previews. Creator content must replace sample content; sample data must never be saved or published. Map every visible field and interaction, support the approved locales and reduced motion, and use the same real renderer in preview and public display.

Register each template in the typed catalog and database with an additive migration, category assignment, and its supported event types. Event compatibility is independent of catalog categories. Filter creator choices by event type, enforce compatibility when saving invitations, and prevent admins from removing a supported type used by existing invitations. Keep a new template unpublished and unselectable until the documented completeness, integration, and verification requirements pass. Use its actual first-page/catalog artwork at the appropriate portrait aspect ratio so the distinctive opening page is visible in the catalog. Do not deploy externally or enable live payments as part of template work unless separately authorized.

The user has authorized applying template migrations to the configured database and publishing completed templates through the existing catalog mechanism. Do not treat a database being external or live as a blocker; inspect current migration/catalog state, apply only the required additive migrations, verify publication, and commit the publication locally. This does not authorize external application deployment or live payment activation.
