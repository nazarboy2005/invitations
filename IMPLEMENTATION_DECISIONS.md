# Implementation decisions

## Guest activity and Telegram wish notifications (2026-10-22)

- User request: improve the invitation activity page and notify the invitation owner through Telegram when a guest submits a new wish. Wishes remain pending until the owner approves them; notification does not publish guest content.
- Implementation choice: deliver Telegram notifications from the durable `jobs` queue with retries, and provide approve/hide buttons in Telegram plus a link to the owner's activity page. The owner must have opened the bot at least once so Telegram can deliver a private message; activity UI should explain how to connect if delivery is unavailable. Production must run a worker or scheduled queue processor; the local combined Telegram poller can process updates and wishes together.
- User-reported issue: the studio/publication flow can claim a future date has passed, even after correcting/reselecting it. Compare the stored local event time in the invitation's timezone to the current instant without relying on server/browser timezone conversion.
- Implementation choice: activity page gains wish status filters, submission times, and clearer pending counts/empty states while preserving existing RSVP, moderation, and private receipt functions.
- User request: make Telegram bot messages more attractive with improved formatting and stickers.
- Implementation choice: use Telegram HTML formatting with escaped user-provided values, concise Uzbek copy, and contextual emoji. Send optional welcome, onboarding-success, and new-wish stickers only when corresponding bot file ID environment values are configured; missing or invalid decorative stickers never block bot flows. Do not bundle a sticker ID from another bot or chat.
- User clarification (2026-10-22): guest wishes must reach the owner through the Telegram bot with approve and reject controls. Approved wishes appear publicly on the invitation; rejected wishes are deleted and never appear publicly. The bot's reject action uses the existing deleted status and soft-delete timestamp; public reads include only approved, non-deleted wishes.
- User requirement (2026-10-22): show invitation view counts. Count at most one view per anonymous browser per invitation in each rolling 24-hour period using an HttpOnly random cookie, store only a one-way hash for deduplication, and display the aggregate count on published dashboard cards. Do not collect IP addresses or retain a per-view event log.
- User requirement (2026-10-22): new invitation creation defaults the event type to Nikoh to‘yi. Keep the public catalog and creator design picker at two equal columns on mobile and provide design search in both places; search narrows the currently category- and event-compatible designs.
- User request (2026-10-22): improve mobile date/time selection so the time controls and confirmation action are not pushed far below the calendar; use a viewport-bounded picker that keeps the entire date and time task accessible.
- User correction (2026-10-22): keep each program item's time and title side by side on mobile, with enough room for the hour and minute controls; each row should read as “time, program name” before the next row.
- User requirement (2026-10-22): new invitations and newly added program rows start with a localized, editable example entry (“Mehmonlarni kutib olish”); creators can change or remove it like any other row. When adding a language, carry this example over in that locale only while it remains unchanged in an existing locale.
- User requirement (2026-10-22): program time choices must be scrollable; hour choices use whole hours and minute choices use five-minute intervals while retaining any existing non-five-minute value until changed. Give program names more room and show a live preview of each time/name row below its editor fields.
- User requirement (2026-10-22): program entries should use compact cards. Remove both drag behavior/handle and move-up/down buttons; keep the delete action.
- User requirement (2026-10-22): let creators set each program time directly in its invitation preview row.
- User correction (2026-10-22): keep “Taklifnomada ko‘rinishi” as a separate read-only schedule preview; edit the heading, times, and item names in the program editor above it.
- User correction (2026-10-22): keep the existing 300-character limit for program item titles and show their current character count.
- User requirement (2026-10-22): remove the creator-facing draft JSON download control and its export behavior.
- User requirement (2026-10-22): make the invitation activity header match the studio's clean top bar: back control, invitation name, and edit/refresh actions aligned in one sticky header; use the studio's plain arrow treatment for back/refresh and filled primary treatment for edit; keep long names readable without pushing controls offscreen.
- User requirement (2026-10-22): use the studio button pattern across the management dashboard and invitation activity page: shared sizing, rounded corners, typography, outlines, hover and focus states, with existing primary, destructive, and tab roles preserved.

## Database publication authorization (2026-10-21)

- User requirement: template tasks may apply the required additive migrations to the configured database and publish templates through the existing catalog mechanism once their release gates pass. An external/live database is not itself a blocker. Inspect current state, apply only required migrations, verify catalog publication, and commit the publication locally.
- External application deployment and live payment activation remain outside this authorization.

## Continuing template releases (2026-10-22)

- User request: proceed to each next source-backed template in the roadmap in sequence, continue through the remaining inventory, fix issues found, and publish completed templates so users can select them. Apply the established per-template source, contract, verification, migration, and local commit rules. Pause only for a concrete blocker that cannot be resolved in the project.
- User direction (2026-10-22): switch this implementation sequence from the concurrent Marxaba work to the captured Invitate designs and use an isolated branch to avoid overlap. Evelina is the first locally captured Invitate design that also appears in Invitate's current catalog. Its existing ignored reference capture is the source; do not duplicate or modify that capture. Continue through the Invitate inventory sequentially after each design passes its release gates.

Recorded on 2026-10-19 from the user's explicit approval. These are product requirements for future implementation, not implemented features.

## Maintaining this record

The user requests that the important things discussed be kept here and updated as the discussion continues. Record confirmed requirements and corrections promptly, distinguish recommendations from approved decisions, and keep unresolved choices explicit. Replace superseded requirements so future implementation follows the latest agreement. This instruction authorizes maintaining project documentation, not beginning implementation.

## Current implementation authorization and visual direction (2026-10-20)

- The user has now authorized agents to begin building the project. Earlier statements that implementation had not yet been requested describe the prior planning stage and no longer block this work. External deployment, live payments, or use of unavailable credentials are not implied by starting local development.
- User correction (2026-10-21): do not research, record, or treat template-source or template-asset licensing/rights as implementation or publication blockers. Continue copying and integrating the requested local reference source. Template publication readiness is determined by implementation, integration, service, and quality requirements only.
- Installed complementary design skills: Anthropic `frontend-design` and Vercel `web-design-guidelines`; existing UI/UX Pro Max and shadcn remain available. Installation was explicitly requested before implementation continued.
- User decision (2026-10-22): use an **Ivory + gold + charcoal** palette throughout the platform interface. This supersedes the earlier taupe/brown action palette. Use ivory page and card surfaces (`#faf7f0`, `#fffdf8`), charcoal text (`#3f3932`), champagne gold accents (`#c1a05c`), deep gold primary actions (`#8a641c`), pale-gold selection surfaces (`#f3ead4`), and warm light borders. Keep gold as an accent rather than a large page background; do not add green as a brand accent. Preserve accessible contrast, visible keyboard focus, restrained effects, and a calm layout. Invitation renderers keep the colors and styling of their exact reference designs.
- User request (2026-10-22): redesign the whole homepage with creative freedom and use expressive, curving typography selectively in the hero. Implementation choice: an invitation-atelier composition with locally hosted Cormorant Garamond headings, Great Vibes calligraphy accents, Manrope body text, real catalog artwork, fine gold linework, an explanatory three-step section, feature illustration, charcoal statement panel, FAQ, and footer. Keep the existing palette and working preview/creation links; decorative homepage stationery is separate from invitation renderers.
- User request (2026-10-22): give homepage scrolling a slower, weighted feel. Keep the shared site header anchored to the viewport, sliding out gently when scrolling down and returning when scrolling up. Redesign the creator input workspace using the existing palette. Implementation choice: scoped desktop wheel inertia with native touch/reduced-motion fallbacks; preserve native studio and invitation-frame scrolling. Keep site navigation absent from the studio and retain its own save toolbar. Improve the four-step navigation, field hierarchy, language controls, and live-preview presentation without changing invitation source designs.
- User request (2026-10-22): make the homepage more expressive with text/background gradients, ratings, invitation activity, an improved header, and shorter catalog cards. Implementation choice: ivory/champagne light gradients, metallic charcoal/gold headings, gently floating real template previews with a pause control, a clearly labeled sample completion card, a floating glass navigation surface, and compact portrait artwork frames. Use the actual published catalog count and an anonymous published-invitation count when nonzero; never fabricate customers or review scores. The star control is a personal, unsent design preference rather than an aggregate rating. Preserve the earlier request to avoid duplicate hero creation buttons and keep preview/create actions working.

## Template catalog status and admin-managed categories (2026-10-20)

Confirmed requirements:

- Platform administrators can assign any template to any category throughout the website. Categories are catalog organization, independent from an invitation's event type, selected design, price, publication state, or authored content.
- Use shared category assignments across the public catalog and creator template picker, rather than hard-coded categories in each screen. A template can belong to multiple categories; administrators can update assignments without editing customer invitations.
- User requirement (2026-10-21): template event compatibility is separate from catalog categories. Each template has an admin-managed set of supported event types in the database. Show only compatible published templates after the creator chooses an event type, and reject incompatible template/event pairs when saving. Admins cannot remove a supported event type while saved invitations still use that template with that event type. A template must support at least one event type.
- User requirement (2026-10-21): keep each implementation agent on its assigned template until that template clears its release gates and is published; do not reassign it to another design first. If an environment limitation blocks a gate, record the exact blocker and keep working on that template rather than claiming publication readiness.
- Implementation recommendation (2026-10-21): the captured Marxaba metadata uses distinct Fotiha, Qiz uzatish, and Sunnat to‘yi event labels. Represent these as typed event IDs and localized creator options, mapping only the exact event types each template declares. Keep catalog category assignments unchanged; this extends the currently small event-type list based on the approved source-backed compatibility model.
- Implementation recommendation (2026-10-21): the captured Beshik design declares Beshik to‘yi and birthday compatibility. Add Beshik to‘yi as a localized event type, keep its compatibility separate from catalog categories, and present one celebrant field for the Beshik design.
- Source-backed event mapping (2026-10-21): add distinct localized `yubiley` and `iftorlik` event IDs when captured template metadata declares them. Map source IDs exactly (`tugilgan-kun` to `birthday`, `yubiley` to `yubiley`; `iftorlik` to `iftorlik`) and keep these event compatibility values separate from the `birthday` and `osh` catalog categories.
- In the creator’s template picker, show only category filters that contain at least one published template compatible with the selected event type. “Barchasi” counts and displays the complete compatible template set.
- User requirement (2026-10-21): make template selection the first creator step. Keep event type selection in that first step so the available templates and category filters can be constrained immediately. Follow with invitation details, date/location/program, and photos/options.
- Current correction: remove every provisional/dummy template from the application. The Suzani and Ivory Love starter designs are not approved final templates and must not appear as selectable, previewable, or public invitation designs. The user's later instruction to complete every remaining source-backed Marxaba design explicitly includes Shirin Bayram; that authentic captured design supersedes the earlier exclusion of the starter entry with the same name. Keep it unpublished until its individual release gates pass.
- Use exact designs from the existing local `Invitations - this folder will be removed from production` reference collection. Leave captures untouched. Template integration has resumed under the user's 2026-10-22 request to continue sequentially through the remaining designs.
- Do not show dummy designs. Template-selection lists contain only real published designs. A full preview uses the real renderer.
- User request (2026-10-20): show the ready Anor design on the homepage and public catalog so people can inspect it. This was initially preview-only. User later explicitly requested that Anor have the same creation action as published templates; that supersedes the preview-only restriction for Anor. Publish it at its existing catalog price and keep other unpublished templates out of selection.
- User correction (2026-10-21): label catalog preview actions “Ko‘rish” and creation actions “Yaratish”. Place them in one row, with the creation button using a 1.5fr column and Ko‘rish using 1fr.
- User requirement (2026-10-21): clicking “Yaratish” on a specific catalog template starts a fresh invitation with that template selected and opens the creator at invitation details, skipping the template-selection step. Drafts that already have a selected template also resume at invitation details; generic creation without a template starts at template selection.
- User correction (2026-10-21): remove the duplicate homepage hero buttons because the catalog and header already provide navigation. In the shared site header, label the dashboard link “Kirish” when signed out and “Taklifnomalarim” when signed in.
- User correction (2026-10-20): catalog cards must use the design's actual reference preview artwork, not an unrelated crop of another scene from the template. Prefer the dedicated image named by the template metadata when present.
- User correction (2026-10-21): Somon Yo‘li’s catalog cover should show the source hero with its astrolabe, names, date, and motto, matching the user-provided reference. Keep the galaxy poster as the invitation’s original opening scene.
- User clarification (2026-10-20): realistic sample invitation details may appear in a catalog preview and during the template-selection stage while the creator has not entered any invitation content. Once any creator-authored content exists, preview their actual content. Sample data is ephemeral presentation data: never save it, publish it, export it as a creator draft, or let it override authored fields. Keep the no-sample rule for later creation stages and public invitations.
- Preserve genuine reference behavior, including meaningful animations and opening sequences, when each exact template is integrated. Follow reduced-motion preferences. Sample invitation copy may demonstrate the layout only in the limited preview cases above; it must not introduce unrelated template artwork or media.
- Earlier approval to build `ivory-love` first is superseded by this correction.
- Current user request (2026-10-20) explicitly resumes production integration and authorizes completing one Marxaba design. Anor is the selected first template. This supersedes the temporary empty-catalog requirement for Anor only; do not proceed to another template until this one is verified.
- Anor's renderer and catalog metadata may be developed and previewed, but keep it unpublished/unselectable until the template passes the requested end-to-end checks and production blockers (including receipt uploads when enabled) are resolved. Do not treat a partial renderer as ready to publish.
- Reuse the selected template's own source for the Anor layout and motion, support reduced motion, and use the same isolated renderer for creator preview and public display. Keep the source capture untouched.
- User clarification (2026-10-20): "copy" means reuse the template's actual captured HTML, CSS, JavaScript, and assets instead of recreating the design. Anor's local capture contains those source files. Supersede the earlier Anor-only recommendation to recreate the design in a native renderer: package and run the template-level source in an isolated same-origin frame, retaining its original layout and motion code, and bridge it to the platform's typed invitation contract and real RSVP/wishes APIs. Do not import Marxaba's general sample-invitation or platform core/runtime; those carry unrelated sample data and site-level behavior. Keep the source capture untouched.
- User reiterated that fidelity includes the original typography and every visual detail. Preserve the captured font families, weight/style variants, CSS, artwork, HTML structure, and motion; package externally referenced font files locally when needed, and do not substitute platform fonts or styling. Platform data/API adapters may be added without redesigning the template.
- Dress code is an optional creator-selected invitation section. When enabled, prefill missing editable localized style/text/note and a five-color palette: evening attire; attire guidance; champagne, powder, olive, dark blue, and burgundy; and the note that guests should avoid white because it is the bride’s color. Apply defaults when enabling it and when opening an older enabled draft with missing values. Preserve existing creator-authored dress-code values and colors. When disabled or empty, hide it. The venue-photo field remains absent from the editor/shared data contract; do not fill it with sample invitation media. User clarification (2026-10-21): retain the current contract and use a map when coordinates are available; otherwise hide an empty venue-photo frame. This fallback is accepted and is not a release blocker by itself.
- User requirement (2026-10-20): every new template must use the complete source implementation from its selected reference, including its HTML, CSS, JavaScript, animation code, fonts, artwork, and interactions. Do not approximate or rebuild the design. Keep template-owned source files unchanged and put typed data/API integration in a separate adapter; any necessary source changes must preserve the reference output and be documented. Keep the original capture untouched.
- User requirement (2026-10-20): provide a dedicated full-page preview for each real template so people can see the whole design at its actual public size, including its opening sequence and scroll behavior. Do not confine the only full preview to a phone-shaped mockup in the editor. Catalog cards and the editor's design choices should link to the full preview; the editor may keep a compact live preview for quick feedback.
- User requirement (2026-10-20): the live preview shown during invitation creation should look and behave like the real invitation page at the available viewport size, rather than being clipped inside a decorative phone frame. Keep real creator-entered data in it. Only show illustrative sample names/details while browsing a template or at the template-selection stage before any content has been entered.
- User requirement (2026-10-20): the site must feel polished, complete, responsive, and carefully reviewed on desktop and mobile. Preserve the current Ivory + gold + charcoal platform styling, while keeping each invitation template's source visual identity intact. Do not publish placeholder or visibly unfinished pages.

Implementation choices:

- Store categories and template/category relationships in PostgreSQL; expose admin-only category creation/renaming and assignment controls. Site administrators can assign any template to any number of categories, and category filters must help customers discover matching designs in the public catalog and editor picker. Seed existing event categories as a starting point, with no restriction tying designs to those events.
- Template registry and renderer modules must remain independent and modular so exact references can be added one at a time. For Anor, package only its template-level HTML, CSS, animation scripts, and assets in the isolated renderer; do not embed the complete captured website or import Marxaba's general site runtime/sample invitation. Live service validation requires configured PostgreSQL, Telegram, and the selected storage provider (local development disk or R2).

## Required invitation content

- User requirement (2026-10-21): hide the site-wide navigation header throughout invitation creation/editing; it belongs on the landing page, not inside the studio. Rename the fourth creator step from “Rasmlar va imkoniyatlar” to “Qo‘shimcha”.
- User correction (2026-10-22): use one consistent shared site header across the homepage, design catalog, and dashboard; this supersedes the earlier separate dashboard account bar. Keep site navigation absent from the studio.
- User requirement (2026-10-22): dashboard cards show each invitation’s actual opening design with creator-authored content, use a compact layout, and combine browser drafts and saved invitations in newest-created-first order. Implementation choice: lazy-mounted, silent, noninteractive real renderer thumbnails; database creation timestamps and retained browser-draft creation timestamps determine order. Legacy browser drafts fall back to their earliest available saved timestamp.
- User requirement (2026-10-21): remove the browser autosave status line beneath the invitation title in the creator header; report storage failures through the existing error message.
- User requirement (2026-10-21): label the creator’s save action “Saqlash”. Signed-in users save directly; signed-out users complete Telegram login and then the same draft is saved.
- User requirement (2026-10-21): replace repeatable contact cards with two optional fields, phone number and Telegram username. Render each non-empty contact and omit the empty one. Store these as `contacts.phoneNumber` and `contacts.telegramUsername`; convert existing array-form contacts without losing the first non-empty value of either type.

- Do not ask creators for “Taklifnoma sarlavhasi” while no template displays it as invitation content. Keep the internal title for the renderer’s accessible iframe name; provide it from localized defaults instead of a creator field.
- When no custom event label is saved, show the selected event type as the field’s visible initial value. Creator editor placeholders follow the editor interface language, not the invitation language being authored. The current editor interface is Uzbek Latin, so placeholders remain in Uzbek Latin when switching invitation language tabs. The optional hosts example is “Raxmonovlar oilasi”; placeholders are examples only and must not be saved as creator content.
- Support names of the people involved, family/host names (for example, Al Thani family), event type, date/time, and editable introductory/invitation text.
- New wedding invitations prefill the editable invitation message with localized starter wording in Uzbek Latin, Uzbek Cyrillic, English, or Russian. Other event types do not inherit wedding wording. Newly added language variants get localized built-in defaults for the title, event name, greeting, wedding message, and program heading, while people’s names and other authored content start blank for that locale. Never copy names from another language; creators enter each language’s spellings independently.
- The localized “Tadbir nomi” field defaults to the selected event type (for example, “Nikoh to‘yi”). Update that default when the event type changes only while the field is still blank or still contains the previous generated default; preserve creator-authored wording. Generate the standard event label for each newly added supported locale.
- Support a general greeting such as "Assalomu alaykum, aziz mehmon!" and personalized greetings using a guest's name. Create the general invitation before its personalized versions, which reuse the same content.
- Support repeatable event program entries with time and title; do not impose a fixed four-entry structure.
- Support venue/restaurant name, address, map location, landmark/orientir, and further directions or location details.
- Support RSVP responses, guest wishes, photos of the couple/celebrants, music, and repeatable contact details including phone numbers and Telegram usernames.
- To'yona card details and guest receipt uploads are optional creator-controlled features, as specified below.
- Event types must support weddings (nikoh to'yi), qiz bazmi, nahorgi osh, birthdays, and expansion to other events. The exact full event-type catalog remains open.
- Additional content found in the templates includes gallery years and program speakers; support for these remains a recommendation pending schema approval. Story chapters are now approved as described below. Multilingual creation is a confirmed requirement, as detailed below.
- User approval (2026-10-20): invitations may include an optional repeatable story section. Each chapter has a stable ID and localized title and story text; chapter numbering and template illustrations remain controlled by the selected template. Preserve chapter content through save/reopen and template switching. Render the section only when at least one chapter has content in the active language. Do not add sample story text to saved or published invitations.

## Invitation languages and content variants

Confirmed requirements:

- Support invitation creation in Uzbek Latin (existing language), Uzbek Cyrillic, English, and Russian. Recommended standard locale keys: `uz-Latn`, `uz-Cyrl`, `en`, `ru`.
- Each invitation has one selected default language and optional additional language variants. Creators add variants only where needed; creating in one language must not require filling every supported language.
- Creators can remove any non-primary language variant from the editor. To remove the primary language, they first designate another enabled language as primary. Removing a language also deletes that locale's authored text and localized story/dress-code labels; shared event data and media remain unchanged.
- Keep variants under one invitation/owner/URL with shared events, guest records, and media, rather than creating independent invitation copies.
- Allow separate wording for names/family names when needed, greetings and personalized greeting patterns, invitation/introduction text, event labels, program titles/descriptions/speakers, venue names/addresses/directions, contact labels, stories, dress-code text, photo captions/alt text, gift notes, and other editable visible text.
- Couple/celebrant names are locale-specific authored content too: store and edit each enabled language's names independently, render the active language's values in every template, and never silently transliterate or overwrite another language's names. The shared catalog fixture may demonstrate the appropriate Uzbek Cyrillic and Russian spellings; it remains preview-only.
- Preserve all language variants when switching templates. Every selectable template must render supported language variants without losing fields.

Recommended behavior and schema guidance:

- Editor: choose a primary language, then "Til qo'shish" / Add language to enter only language-dependent fields. Reuse shared dates/times, coordinates/map references, contact values, card details, uploaded files, and event/program item identities/order. Display dates/numbers using the active locale; do not store duplicate dates or media per language. New events use Asia/Tashkent by default; timezone remains internal event data and is not creator-editable in the current editor.
- Supply translated built-in interface text (section/button labels, RSVP choices, music controls, moderation acknowledgments, and receipt messages); creators should not have to translate standard controls themselves. Custom heading overrides can have language variants.
- Public invitation language selector shows only enabled/published variants. Recommended locale URL selector: `?lang=ru`, compatible with personalized links such as `?g=<token>&lang=ru`. A language change must not create a new invitation or duplicate a guest/RSVP/receipt.
- Allow incomplete variants to be saved privately. Before exposing a variant publicly, validate its required text and identify missing fields. Recommend default-language fallback for optional missing wording, shown clearly to the creator in preview; exact per-field fallback policy remains to be finalized. Do not silently publish a supposedly complete translation with missing required content.
- Translation/transliteration assistance may be added later, but automatic AI translation is not requested or approved. Never silently translate names or overwrite authored text. Guest-submitted wishes and receipt images remain original content, not automatic translations.
- Suggested schema: `invitations.default_locale`, enabled locales, and `invitation_content` unique by `(invitation_id, locale)`; translated repeatable items reference the same stable item ID and locale. Choose one consistent translation-table/JSONB approach during final schema design. Guest preferred locale can be optional; all variants reuse the same greeting placeholders and guest identity.
- Language variants follow existing creator editing deadlines. Per-language prices, separate publication fees, and exact interface-language settings have not been decided.

## Optional venue/restaurant autocomplete

Confirmed requirements:

- As a creator types a venue/restaurant name, show matching place suggestions. Selecting one prefills the venue name, address, and map location/coordinates where available.
- Suggestions are only an entry aid. Selection is never mandatory: allow entirely manual venues, including homes or places absent from map listings, and allow pasting a map link or setting a pin.
- After selecting a suggestion, the creator may edit any invitation location field, including venue name, address, coordinates/pin, links, hall, landmark/orientir, and directions. Do not lock user-facing details to a provider's place record or refresh over their edits.

Recommended implementation:

- Use supported Google Places Autocomplete + Place Details or Yandex Geosuggest + appropriate place-detail/search/geocoding API, not scraping map HTML. Final provider is undecided; evaluate real venue coverage in target cities, cost, supported languages, and licensing for persistent invitation content.
- Use an interchangeable place-search module. Show locality/address in suggestions to distinguish same-named venues and optionally bias results by selected city/country without requiring GPS access. Include restaurants, wedding halls, and other event venues rather than restricting every event to restaurants.
- Prefill only after explicit selection. Debounce/rate-limit search and discard stale responses; outages/no results must not prevent manual entry, saving, or publication. Do not guess missing coordinates or claim venue availability/bookability from search results.
- Keep creator-authored display fields independent from optional provider references (`place_provider`, `place_id`/URI). Preserve existing location data and language variants when switching templates. Renaming a venue must not silently move its map pin; changing the pin/location should update navigation targets consistently. Selecting a different suggestion must not silently overwrite authored translations or additional venue notes.
- Provider content has attribution, map-display, and storage/caching restrictions; confirm the selected plan permits the intended long-lived data use before choosing a persistence strategy. Do not assume copying or editing API data removes its licensing restrictions, or mix Google-derived place data onto another provider's map without checking permitted use. Persist only permitted provider metadata and separate it from creator-entered values.
- API keys, provider setup, exact map UI, storage/refresh policy, and any alternate provider fallback remain implementation choices; no scraping job or restaurant database import is requested.

References checked on 2026-10-19: Google autocomplete https://developers.google.com/maps/documentation/places/web-service/place-autocomplete and policies https://developers.google.com/maps/documentation/places/web-service/policies; Yandex suggestions https://yandex.com/maps-api/docs/suggest-api/request.html and place search https://yandex.com/maps-api/docs/geosearch-api/request.html.

## Custom invitation music

- Confirmed clarification: music is optional for each invitation. Creators may leave music off entirely; no audio upload or track selection is required to save or publish an invitation. If they want music, allow them to upload their preferred audio file and use it as background music.
- Confirmed clarification (2026-10-20): when music is enabled, creators may either upload a new track or choose one of their previously uploaded audio tracks from a reusable personal music library. A track stays owned by its creator and can be reused across that creator's invitations; do not expose another creator's uploads in the picker.
- User requirement (2026-10-21): administrators must be able to add shared music tracks and choose which tracks are available in creators' music selectors. The creator selector combines active platform-curated tracks with that creator's own uploads; personal tracks remain private and reusable only by their owner. Platform tracks are uploaded to R2, stored as catalog entries, and can be hidden from new selections without removing existing invitation references.
- User requirement (2026-10-20): preserve and check each reference template's own music and mute/play control. Every full catalog template preview must have default preview music, even when the source capture only has a toggle and no bundled track. Start it only after the visitor opens/plays the invitation; never autoplay on catalog load.
- Catalog preview music is presentation-only and must not be saved into an invitation or override creator music settings. Creators may separately choose a clearly licensed platform library track or one of their own uploaded tracks for an invitation.
- The default catalog soundtrack is one global setting shared by all templates. Changing that single setting updates every supported full preview; do not maintain separate per-template defaults unless the user later requests them. This global preview setting is separate from each creator's invitation music.
- Current implementation uses "Emotional Piano" by triangelx, verified as CC0 1.0 on its Wikimedia Commons file page, for catalog previews and as an optional platform-library selection. Keep the source/license record in `apps/web/src/modules/catalog/catalog-music.ts`; replace the file if its license or availability is later disputed.
- Keep the uploaded track linked to the invitation independently of its template; switching designs must retain the selection, asset, and enabled/disabled choice. Template defaults must not enable music against the creator's choice.
- Recommended controls: preview, replace/remove the track, and disable music; guests receive accessible play/pause or mute controls.
- Store audio in R2 and reference it through the proposed `media_assets` / `invitation_music` records. Validate actual audio content and size/duration; supported upload formats and exact limits remain undecided. Recommend MP3 playback output, converting accepted source formats in a background worker where necessary.
- Only when the creator has enabled music, start playback from the guest's explicit opening interaction (for example, "Taklifnomani ochish") or Play button. Browsers can block audible autoplay; handle playback failure and leave a usable Play control. Never promise sound immediately on page load or force playback after the guest pauses it. Invitations without music must not show inactive audio controls.
- Audio loading/conversion must not block displaying the invitation. Creator replacement/removal follows the existing editing deadline.
- Browser behavior reference checked on 2026-10-19: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay. Requirement/design record only; no upload or player implemented.

## Voice greeting removal

- User correction (2026-10-21): remove optional voice greetings from the creator editor, invitation contract, template bridge, and stored invitation data. Background music remains supported.
- Migration `0010_remove_voice_greetings.sql` removes legacy `voiceMessage` JSON data and deletes any referenced media-asset rows that are not also used as invitation music or gallery images. New invitations and template work must not add a separate voice-greeting field or player.

## To'yona bank-name field removal

- User correction (2026-10-21): do not request or store the bank name for a to'yona destination. Keep the card number, cardholder name, and optional receipt-upload setting.
- Migration `0011_remove_gift_bank_name.sql` removes the legacy `gift.bankName` value while preserving the other gift settings. New invitation contracts and editor forms must not add the field back.

## Telegram authentication and invitation ownership

User requirements:

- Telegram is the authentication method for invitation creators. Website visitors may prepare an invitation before login; saving it to their account requires Telegram authentication and ownership association.
- Confirmed addition: sharing the creator's own Telegram phone number is mandatory to complete creator onboarding/authentication. Collect it through Telegram's native contact-sharing request, not a typed number or another person's contact. This applies to website and Mini App creator entry; ordinary invitation guests are not subject to creator onboarding.
- Website entry uses our bot's deep link with an opaque login request payload, for example `https://t.me/<our_bot>?start=auth_<random-token>`. The bot identifies the person through a trusted Telegram update and links the draft to that person's account after login completion.
- Telegram Mini App entry identifies the user automatically using validated Telegram data, without a separate identity-login prompt. If their required phone contact has not been collected, they must still complete phone sharing before creator access/ownership claiming is activated. This supersedes the earlier assumption that Mini App entry always needs no onboarding step.
- The same Telegram user must resolve to the same platform account across website, bot, and Mini App.

Validated design recommendations:

- Create an internal `users.id` and a unique `telegram_user_id` (PostgreSQL `BIGINT`). Link `invitations.owner_id` to the internal user. Telegram username, display name, URL parameters, and visitor-submitted IDs are not proof of identity; username changes must not create new accounts.
- Bot phone sharing: show a reply-keyboard button such as "Telefon raqamimni yuborish" with `request_contact: true` in the private bot chat. Accept the contact only through the trusted bot update flow and require `message.contact.user_id` to be present and equal `message.from.id` and the Telegram user associated with the pending request. Reject other people's contacts, typed numbers, forwarded contacts, or missing/mismatched user IDs and ask the user to use the native button again.
- Mini App phone sharing: use `Telegram.WebApp.requestContact()` when required. Its client callback is not proof of the phone number; complete the requirement only after the backend receives and validates the corresponding Telegram contact update for the same verified user. Offer the private bot contact-sharing flow when the native Mini App method is unavailable.
- Do not finalize website login/draft claiming or activate Mini App creator access until identity checks, login consent, and the required phone-sharing check have completed. Refusing phone sharing leaves the user in incomplete onboarding while preserving their draft.
- Recommend requesting the phone once at first onboarding and reusing the recorded Telegram-shared contact on later logins; forced sharing on every login is not yet requested. Keep Telegram user ID as the account identity, not the phone number. No account merging or ownership transfer based on matching phone numbers. Telegram contact sharing is not an independent SMS verification or two-factor login; no SMS OTP step is currently requested.
- Store the normalized phone privately with source and collection time. Do not automatically display the authentication phone as an invitation contact; publishing a contact number is a separate creator choice. Recollection after phone/account changes remains an implementation policy to finalize.
- Give an anonymous editor an unguessable draft capability bound to its browser session. Preserve form data while opening Telegram. Apply limits/expiry to anonymous drafts/uploads; exact retention remains undecided.
- Generate login requests on the server, bind each to its originating browser session and intended draft, and use short-lived, single-use random tokens stored as hashes. A five-minute lifetime is a recommendation, not a finalized product rule. The Telegram `start` payload allows up to 64 characters from A-Z/a-z/0-9/_/-. Do not put personal data, raw invitation IDs, or a reusable application session token in it.
- In a private bot chat, read identity from authenticated Telegram update `from.id`; verify callbacks against the same Telegram user. Ask for explicit website-login confirmation. The browser-bound, short-lived, opaque Telegram `/start` token identifies the pending login; do not display or request a matching numeric login code. Receiving `/start` alone must not silently log a browser into the sender's account. Never ask users to share login links with others.
- The originating browser checks request status using its own session-bound secret, not merely the public bot-link payload. After bot confirmation, show the authenticated Telegram identity and require browser confirmation before establishing account access and claiming the draft. This reduces accidental account linking and forwarded-link/login-CSRF risks.
- Finalize login and draft claiming atomically, consuming the request once and checking draft possession. Rotate the application session and use secure server-managed sessions (HttpOnly/Secure cookie for the normal website, CSRF protection, expiry/logout). Duplicate Telegram deliveries or concurrent claims must be harmless. Already authenticated creators can save directly.
- Do not transfer an invitation that already has another owner, auto-merge conflicting accounts, or grant ownership because someone opened a public/personalized invitation URL. Public invitation guests do not need creator login just to view, RSVP, submit wishes, or upload receipts where allowed. An owned invitation cannot be claimed again through a new login request.
- Bot webhooks must validate the configured Telegram secret header; a separate AWS bot calling the Vercel backend must use authenticated service-to-service requests. Do not trust arbitrary incoming JSON claiming to be a Telegram update.
- Mini App: send raw `Telegram.WebApp.initData` to the backend; verify its signature/hash for our bot using Telegram's official procedure, validate `auth_date` freshness, and require a verified user field before issuing an application session. Do not trust `initDataUnsafe.user.id` or a client-supplied user ID as authentication. Limit replay/exchange and apply normal session authorization to subsequent requests. Exact freshness/session lifetimes remain undecided.
- Missing, invalid, or expired Mini App identity must not silently become an authenticated user; request a fresh Telegram launch or offer the website login flow. Anonymous form data should survive login recovery.
- Mini App authentication does not itself guarantee permission for the bot to send private receipt notifications. Use the bot-start flow or Mini App `requestWriteAccess` where needed, record verified messaging availability, and handle revoked access/blocked bot separately from login status.
- Platform-admin privileges are assigned independently on the server; Telegram authentication never grants them automatically.

Suggested schema additions (final schema/migrations remain pending):

- `users`: internal ID, unique `telegram_user_id`, private `phone_number`, `phone_source` (`telegram_contact`), `phone_shared_at`, onboarding completion status/time, Telegram profile fields as non-authoritative display metadata, timestamps. Phone fields may be absent on an incomplete record but are required for completed creator onboarding. This replaces the earlier generic authentication-subject proposal for the selected Telegram-only creator login.
- `auth_requests`: token hash, originating anonymous/browser session reference, intended draft reference, Telegram user ID after confirmation, state, expiry, bot confirmation time, consumption time. Store browser-side challenge secrets separately from the bot-link token.
- `sessions`: user reference, hashed session secret, expiry and revocation; anonymous draft sessions tracked separately as needed.
- `telegram_connections`: reuse the receipt-delivery connection table for verified user/private-chat IDs and messaging status, rather than creating a competing identity record.

Checked on 2026-10-19 against Telegram deep links https://core.telegram.org/bots/features#deep-linking, Mini App validation/write access https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app, and webhook authentication https://core.telegram.org/bots/api#setwebhook. Documentation/design only; no authentication code or bot integration implemented.

Phone-sharing addition checked on 2026-10-19: https://core.telegram.org/bots/api#keyboardbutton (`request_contact`, private chats only), https://core.telegram.org/bots/api#contact (`user_id` is optional, so explicitly require a matching ID for our onboarding), and https://core.telegram.org/bots/webapps#initializing-mini-apps (`requestContact`).

## Persistent creator sessions

Confirmed requirement:

- Returning website creators should remain signed in on the same browser/device across page refreshes and normal browser restarts while their session remains valid. Do not repeat Telegram login or phone sharing on every visit, save, or checkout. The user's OpenAI website example describes the desired experience; no claim is made about OpenAI's internal implementation.

Recommended design and behavior:

- Use a persistent, opaque session credential in a first-party HttpOnly/Secure cookie with appropriate SameSite/CSRF protection and explicit expiry. Store hashed session credentials and revocation/expiry state in durable server-side storage shared across Vercel instances/deployments; do not rely on process memory or expose reusable login tokens in localStorage/URLs.
- Validate sessions and owner/platform-admin authorization on the server for protected requests. Render the authenticated initial page without an unnecessary login-screen flash; never put private dashboard/session responses in a public CDN cache.
- Renew eligible sessions transparently with a controlled sliding idle timeout and a fixed absolute lifetime. Rotation must handle concurrent tabs/requests without spurious logout and must not revive expired/revoked sessions or extend access forever. Background polling alone should not keep an otherwise unused session alive indefinitely. Exact idle/absolute durations and rotation intervals remain undecided.
- Explicit logout invalidates the server session as well as clearing its cookie. Provide an active-session/device list, revoke-one-session action, and "Log out all devices"; revoked sessions must lose access on subsequent protected requests. Device descriptions are approximate metadata, not proof of identity.
- Each browser/device has its own session. Website and Mini App resolve to the same Telegram account but need not share cookies or session storage. A new browser/device, cleared cookies, private browsing after its storage is cleared, expiration, or revocation may require Telegram login again. Reuse a previously completed phone-sharing record unless recollection is explicitly required; no routine repeat onboarding.
- Preserve recoverable drafts and return users to their interrupted editor/checkout after reauthentication. Distinguish temporary network/backend errors from actual session expiry so an outage does not falsely log users out or discard edits.
- Require fresh Telegram confirmation for appropriate sensitive/risk events and apply stricter session rules to platform admins; do not hard-bind ordinary sessions to an IP address, since mobile networks change. Exact sensitive-action list remains undecided. Existing invitation edit deadlines and payment/ownership checks apply even while signed in.
- Extend proposed `sessions` fields with created/last-active times, idle and absolute expiry, revocation time, rotation metadata as needed, device description, and last-authenticated time. Avoid unnecessary retention of precise device/network identifiers.

Reference checked on 2026-10-19: OWASP Session Management Cheat Sheet https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html. Session-library selection and exact policies remain implementation decisions; no authentication code has been changed.

## Approved invitation editing and reuse policy

A purchased invitation belongs to one specific event. Changing its displayed event date must never automatically extend editing access.

- Before publication, the creator may freely edit all invitation content.
- At first publication, lock the event identity: main people/names and event type. Record the first publication time and identity lock time.
- After publication and before the approved editing deadline, allow practical updates to text, photos, music, program, location, contacts, and optional to'yona settings.
- Name corrections such as "Nodor" to "Nodir" use a correction request reviewed by an administrator. Do not automatically accept or reject corrections based solely on character edit distance.
- Replacing the main people or changing the invitation to a different event requires a new invitation.
- Postponement requires a request containing the proposed date and a short explanation. An administrator approves the date and editing deadline together. Keep approved date history.
- An approved postponement updates the existing invitation and preserves its URL, guests, and responses.
- Initially set the editing deadline to the end of the approved event day in the event's timezone. For multiple ceremonies, use the last approved ceremony.
- After publication, only an administrator can extend the editing deadline. Changing dates or adding ceremonies must not automatically extend it.
- Do not disable all editing several days before the event; urgent practical updates must remain possible until the approved editing deadline.
- After the editing deadline, creator editing and new personalized guest-link creation close. Further corrections require administrator approval.
- Enforce permissions on the server for website and bot actions, including uploads and guest-link creation. Hiding controls in the UI is insufficient.

Keep these concerns separate:

1. Creator editing deadline.
2. RSVP deadline.
3. Optional receipt-upload deadline, which may remain open briefly after the event.
4. Public viewing expiry/retention. Read-only invitations may remain viewable as keepsakes; the exact retention duration has not been decided.

Database additions agreed as part of this policy:

- `invitations`: `first_published_at`, `identity_locked_at`, `edit_deadline_at`, `archived_at`.
- `invitation_change_requests`: `id`, `invitation_id`, `requested_by`, `change_type`, `proposed_changes`, `reason`, `status`, `reviewed_by`, `reviewed_at`, `review_note`, creation/update timestamps.
- `invitation_audit_log`: `id`, `invitation_id`, `actor_id`, `action`, `previous_values`, `new_values`, `created_at`.

## Platform-controlled template pricing

- Platform administrators (the project operators) must be able to set a separate price for each template.
- Tenant administrators, invitation creators, and ordinary users cannot change template prices. Enforce this distinction on the server.
- Display the selected template's price clearly when choosing or switching templates.
- Implementation guidance: store an exact amount in the currency's minor units and a currency code, associated with the template. Record which platform administrator changed a price and when.
- Implementation guidance: calculate prices on the server and snapshot the selected template, amount, and currency on any checkout/order record. A template switch must never silently reuse a payment or quote for a different template. Exact checkout, quote validity, and payment adjustment rules remain to be decided.

## Current invitation publication milestone (2026-10-22)

- User requirement: plan the publishing flow first. During the current prelaunch stage, clicking Publish should publish a valid invitation immediately without checkout or a payment requirement. Payment integration is a later milestone. This concerns customer invitations, separately from administrator publication of catalog templates.
- Preserve existing authenticated ownership, draft recovery, authored-content validation, and post-publication editing rules. The user has not requested anonymous publishing or an authentication bypass.
- User decision (2026-10-22): public invitation codes must be exactly **six Base62 characters**, using `0-9`, `A-Z`, and `a-z`, for example `/i/aB3xY9` on the existing invitation route. This supersedes the earlier ten-character lowercase recommendation. Generate random codes on the server, preserve case, enforce database uniqueness, retry collisions, and keep the code stable through allowed edits. A custom domain is not required to implement this flow: keep the stored slug independent from the configured application origin.
- Implementation recommendation: use an explicit server-side free/paid publication mode and record free publication honestly. Later payment verification gates the same publication service. Recommend keeping early free publications accessible when paid publishing begins.
- User authorization (2026-10-22): implement the publishing plan, configure the supplied database/Telegram/application environment privately, review the implementation, and run related tests. Store credentials in ignored `apps/web/.env.local`; never include values in committed documentation or test output.
- Implemented: authenticated free publication through `POST /api/invitations/[id]/publish`, save-before-publish in the studio, enabled-locale/content/date/location/media validation, six-character case-sensitive Base62 allocation with unique-constraint retry, one transactional publication/audit/identity-lock/deadline update, and stable copy/open links in studio/dashboard. Initial editing deadline is the end of the event day in its timezone, including DST. Existing publications remain accessible when free publication is disabled. No payment records are fabricated.
- Implementation choice: provide an optional localhost Telegram polling adapter that forwards to the existing authenticated webhook handler, refuses to replace an active webhook, and never logs secrets or message payloads. Human account confirmation is still required. The concrete sequence and verification limits are in `docs/INVITATION_PUBLISHING_PLAN.md` and `docs/PUBLISHING_VERIFICATION.md`.
- User feedback during verification: Telegram identity confirmation succeeded, but the next action after returning to the website was unclear. Show a confirmed-account card and a clearly labeled **Nashr qilishni yakunlash** (or **Saqlashni yakunlash**) button with instructions; focus that action when confirmation arrives. Preserve the chosen save/publish intent and the account confirmation step.

## Future payments and authentication-first checkout

Confirmed user intent:

- Add Click Uzbekistan payments later for the website and the Telegram-facing experience; the user will supply the merchant credentials during implementation. No credentials are needed for the current planning discussion and no payment integration is authorized yet.
- Authenticate the creator first (including mandatory Telegram phone-sharing onboarding if not already completed), then allow payment. Preserve their draft throughout login and checkout; reuse a valid existing authenticated session.
- Use the selected template's platform-admin-controlled price for checkout. Charge only against an order associated with the authenticated owner and the intended invitation/template.

Validated constraint and recommendations:

- Website: plan for Click web checkout. Click's official overview lists web and Telegram payment interfaces, but that alone does not establish eligibility to use Click for our specific product inside Telegram.
- A paid digital invitation/template-publication service appears to be a digital service. Telegram's current official rules require Telegram Stars (`XTR`) for digital goods/services sold inside bots and Mini Apps, even if the merchant also runs a separate website. Therefore native Click checkout inside our bot/Mini App is not an approved technical assumption. Keep the user's desired Telegram payment experience recorded, with the provider/channel decision unresolved; Stars is a recommendation subject to user agreement, not a replacement requirement silently adopted. Recheck official rules and merchant eligibility before implementation.
- Recommended sequence: draft/preview -> authenticate and complete required phone sharing -> server-created checkout/order -> verified payment completion -> publication entitlement. Exact publication trigger (automatic or explicit creator confirmation) remains undecided.
- Store merchant secrets only in server-side secret/environment configuration, never this document, frontend bundles, or Git. Keep provider integration behind a modular payment adapter.
- Persist order price/currency/template snapshots and payment attempts/provider transaction references. Validate payment notifications using the chosen provider's documented verification process; check order, amount, currency, and final successful state. Browser redirects, screenshots, AI screening, or an initial payment/preparation event do not prove platform payment completion. Handle retries/duplicate notifications idempotently.
- Keep failed/cancelled/pending checkout drafts recoverable. Template switching before publication remains allowed; switching after checkout creation must invalidate/reconcile the old quote/payment entitlement rather than publish a different-priced template under a stale order. Upgrade, refund, quote-expiry, and post-payment switching rules remain open.
- Platform publication fees are separate from optional guest to'yona transfers and their AI-screened receipt uploads.

Checked on 2026-10-19: Click overview https://docs.click.uz/ (Prepare/Complete and supported interfaces); Telegram digital-payment requirements https://core.telegram.org/bots/payments-stars, especially its alternate-provider and separate-website FAQ. Detailed Click integration endpoints/contract eligibility still need verification during implementation.

## Template publication, retirement, and replacement (2026-10-20)

Confirmed requirements:

- Platform administrators can publish or unpublish any template at any time. Tenant admins and creators cannot change catalog publication status.
- When unpublishing a template used by existing invitations, the platform admin must be able to select another template as its replacement. This is an admin-selected design replacement for affected invitations, including already-published ones, not a request to recreate invitation content.
- Unpublished templates are unavailable for new selection; publishing them makes them selectable again.

Recommended behavior and safeguards:

- Admin workflow: show affected draft/live invitation counts, select an eligible published replacement, preview representative invitations with their existing data, then apply retirement/replacement. A plain catalog-hide action that preserves existing users can be offered separately, but must not be confused with the requested replace-existing-invitations action.
- Preserve invitation IDs, public/personalized URLs, owner, event identity/dates, all language content, media/music choices, guest links, RSVP responses, wishes/moderation, receipts, and payment history. Change only the rendering template/version and explicitly mapped presentation settings. Missing design-specific sections use the shared fallback approach; never delete their data or substitute demo content.
- Admin replacement is a controlled exception to the creator's template/edit locks: it may occur after publication or the event deadline, but must not unlock creator editing, extend deadlines, or alter event identity. Ordinary creator template switching after publication remains undecided.
- Recommend no additional charge or automatic refund solely because the platform retires/replaces a paid template. Retain original order/template/price snapshots and record a separate admin replacement/entitlement mapping. Reconcile unpaid checkout quotes explicitly so stale callbacks cannot attach the wrong template/price. Detailed unpaid-order/refund handling remains to be finalized.
- Do not delete template versions/assets still needed to serve invitations or recover from failed replacement. Stop new selection promptly; migrate existing assignments in a resumable, idempotent process that keeps a valid renderer available until each replacement succeeds. Revalidate template eligibility when saving/publishing to handle retirement during an open editor/checkout.
- Notify affected creators in their dashboard; recommend a deduplicated bot notice where messaging is available. If a previously retired template is republished, do not automatically move invitations back.
- Validate platform-admin authority server-side. Record actor, reason, old/new template versions, affected invitations, job status/errors, and timestamps; provide an auditable rollback of rendering assignments where compatible with current invitation data.

Suggested schema additions (not approved migrations): `templates.publication_status`, `published_at`, `unpublished_at`, optional `replacement_template_id`; a replacement operation/job record with per-invitation outcomes and before/after assignment versions. Use the existing invitation audit log for applied changes. Final status names, batch controls, notification wording, and pricing exceptions remain design recommendations.

## Template switching before publication

- Before publication, users must be able to choose any published/selectable template and switch templates without entering their invitation details again. Platform-retired templates are excluded from new selection.
- Store invitation content independently from template rendering. Selecting a new template changes the design selection, not the underlying invitation or its entered content.
- Confirmed (2026-10-20): persist the selected template's stable ID with the invitation, not its display name. Keep the ID in both `invitations.template_id` (foreign key to the template catalog) and the invitation data snapshot; when a draft or published invitation is reopened, resolve that ID to the matching renderer so the same design opens. Renaming a template changes its catalog label without changing which design existing invitations use.
- Reuse all applicable existing information: people and family names, event types/dates/timezones, greetings and editable text, program entries, locations, RSVP configuration, gallery/media, to'yona and receipt settings, contacts, music, stories, and dress codes.
- Preserve uploaded asset references and repeatable item order. Do not replace entered values with template sample names, dates, or other demo content.
- All selectable templates must consume a shared invitation data contract, with template adapters or common fallback sections where needed. Support switching across event types without forcing a wedding-only bride/groom structure onto other events.
- Do not discard optional content when the target design lacks a native presentation for it. Preserve it, use a suitable fallback where possible, and explain any presentation limitation in the preview. Switching back must retain the original data.
- Preview the new template with the existing content and its applicable price before publication.
- Creator-initiated template changes after publication remain undecided. Platform-admin replacement of retired templates is separately authorized above and does not grant ordinary creators post-publication switching rights.

## Personalized invitation links at scale

- User correction (2026-10-21): do not show the personalized-greeting pattern field in the general invitation editor until personalized guest links are managed there. Keep the contract field for the future flow and preserve any existing value.
- User proposes personalized URLs such as `ourdomain.org/onar-gentlement/person=nazar` and wants thousands of personalized invitations without duplicating the base invitation.
- Recommended URL for greeting-only personalization: `https://ourdomain.org/onar-gentlement?person=Nazar`. The query parameter changes the displayed greeting; it is not guest authentication or a trustworthy guest identifier. Normalize/limit the name and render it as escaped text, never HTML.
- Recommended URL for recorded guests: `https://ourdomain.org/onar-gentlement?g=<opaque-random-token>`. Resolve the token to an invitation-scoped guest record and its display name. Store a token hash; do not put sequential guest IDs or use names as unique identities. A shared token identifies the link, not the real-world person opening it.
- In both cases, retain one invitation and its media. Recorded personalization adds lightweight guest records, not copied websites, builds, or media. General invitation updates flow through to all personalized links.
- Recommended bulk workflow: paste many names or import a list, create guest records/links in bounded batches, and export/copy the links. Duplicate names must remain distinguishable by guest record/token. Importing a list does not authorize sending messages to those guests.
- Avoid sharing cached personalized HTML between guests: cache common invitation content separately and resolve the greeting per request or on the client. Never let a shared CDN cache expose one guest's greeting or response data to another.
- Keep the existing general-invitation-first and publication/edit-deadline rules. Whether greeting-only links, recorded token links, or both are exposed in the product is still a recommendation under discussion, not a finalized URL scheme or plan limit.

## Guest wishes/messages: creator inbox and moderation

Confirmed requirements:

- Persist guest wishes/messages against the specific invitation and show them in that invitation's creator dashboard. Telegram is a notification/control surface, not the only copy of the message.
- Notify the invitation creator through the bot with the submitted guest name, message, invitation context, and actions to view it in the invitation ("Taklifnomada ko'rish") and delete it ("O'chirish").
- The creator must control what appears publicly, to prevent improper or malicious guest submissions from remaining on the invitation.

Recommended moderation workflow:

- New submissions default to `pending` and remain private until the creator explicitly approves them. Add a separate "Tasdiqlash" / "Taklifnomada ko'rsatish" action; opening "Taklifnomada ko'rish" must not itself approve a message. For pending messages, the view action opens an authenticated creator-only preview at the message; it must not expose unpublished messages publicly.
- Dashboard filters: pending, published, hidden/rejected, and deleted. Support approve, hide/unpublish, and delete from the dashboard as well as the bot. Display submission time and guest identity/link association when available; names entered by public visitors are self-reported.
- Recommend reversible deletion: remove immediately from public visibility and active lists, retain in the creator's deleted/private dashboard view until a defined purge. Exact retention and permanent-deletion policy remain undecided. Deleted messages must never be returned by public message endpoints.
- Persist a submission before queuing its bot notification. Bot failures must not lose the message or cause it to become public. Retry delivery without duplicate routine notifications and keep dashboard access usable if the bot is blocked.
- Every bot callback/dashboard action must verify the authenticated actor owns this invitation or has explicitly granted platform-admin authority. Do not authorize by a message ID, URL, Telegram username, or callback data alone. Make duplicate/stale actions harmless and keep bot/dashboard moderation state synchronized.
- Public views/APIs query approved, nondeleted messages only; authorization for private previews is server-side. Refresh/invalidate public caches after hiding/deleting messages. Render user text safely, apply length limits/rate limits and spam controls; filtering may assist but never overrides creator approval.
- Guest acknowledgment before approval: "Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko'rinadi."
- Creator message moderation and dashboard access remain available after the event editing deadline; that deadline locks invitation-content edits, not the ability to remove improper guest content. Guest submission closing dates/controls remain a separate undecided policy.

Suggested schema extensions (pending final migration design):

- `wishes`: invitation reference, optional guest reference, author name, message, moderation status (`pending`/`approved`/`rejected`), submitted time, moderated-by user/time, optional deleted time and deleting actor.
- `wish_settings`: message submissions enabled and approval-required setting; approval-before-publication is the recommended default, not yet a separately approved user configuration policy.
- Reuse a general notification outbox/delivery mechanism for wish notifications, tracking wish/creator connection, status, retries, Telegram message ID, and a deduplication key. Keep delivery state independent from moderation status.

## Receipt uploads and owner review (updated 2026-10-22)

- Latest user correction: skip receipt AI checks. This supersedes the earlier requirement to screen receipts using an AI gateway/fallback before delivery. AI integration and automatic forwarding are outside the current implementation.
- Guests can upload a JPG/PNG/WebP image or PDF with the names of the givers when the creator enables receipt uploads. Keep files private to the invitation owner; uploads never prove receipt of money.
- The owner reviews receipts in the website dashboard and explicitly marks received/problem after checking their account. Show the absence of AI/bank verification to guests and owners. Do not report successful Telegram delivery when none occurred.
- Associate a verified personalized guest token when supplied, rate-limit uploads, and deduplicate identical files per invitation. Disabling uploads preserves existing private receipts.
- User request: audit every editor input and make publication work locally without unavailable R2 setup. Implementation choice: private local storage for local development, retaining R2 for deployment. Store bytes outside public/, keep credentials/settings in ignored .env.local, and preserve ownership/readiness checks. Refuse local disk on Vercel; production self-hosting must explicitly configure persistent storage and backups.
- Owner RSVP responses and wish approval/hiding must be available through the website. Do not leave the wish-approval promise dependent on an absent notification worker.

## Other established requirements and stack choices

- Structure the project modularly.
- Website: Next.js and TypeScript, deployed on Vercel.
- Media storage: Cloudflare R2.
- Database provider: user supplied a Neon PostgreSQL connection string for this project. Keep its secret URL out of this decision file and other tracked files; configure it through the `DATABASE_URL` environment secret during authorized setup. Telegram bot hosting is not finalized.
- Create a general invitation first, then personalized guest links that inherit its content. Guest-link creation after publication was recommended.
- Creator chooses whether to include to'yona card details. Only when enabled, show a second choice to allow guest transfer-receipt image/PDF uploads.
- Receipt uploads are private to the invitation owner and authorized administrators; do not place them in public galleries. An upload does not itself verify receipt of money.
- Associate receipts with a personalized guest when available; allow a sender name for general invitation visitors.
- Disabling to'yona also disables new receipt uploads; preserve existing receipts privately for the owner.

The comprehensive invitation schema discussed in chat is still a proposal; do not treat every proposed table or field as separately approved. No application, database migration, or infrastructure implementation was requested at the time this record was saved.

## Recommended development-agent organization (2026-10-20)

User requested recommendations for specialized workers/agents. The following is a proposed organization, not approval to spawn agents or begin implementation:

- Lead/integration agent: coordinates tasks, requirements, shared contracts, integration, and final verification. Maintains this record; does not silently promote open recommendations to approved product rules.
- Core/backend agent: owns schema/migrations, invitation lifecycle/ownership, server authorization, Telegram identity verification/session logic, and shared API/data contracts.
- Web/editor agent: owns creator flows, multilingual editor/preview, dashboard, and platform-admin interface; consumes the shared contracts and backend rules.
- Template agent: owns the renderer/registry, isolated template styles/animations/assets, and data-preserving switching. Keep the catalog empty until exact local reference templates are selected for integration; then add and review them one at a time.
- Telegram agent: owns bot/Mini App transport, contact-sharing UX, login handoff, notification delivery/buttons, and bot moderation actions; calls shared backend authorization/business rules.
- Integrations/background-jobs agent: owns R2/media/audio handling, place-provider adapters, AI receipt processing/fallback, and durable jobs/retries. Click checkout is a later scoped assignment; do not implement the unresolved Telegram payment-provider choice.
- QA/release agent: independently checks critical scenarios, mobile visuals/performance, privacy/authorization boundaries, failure recovery, and staging/release readiness. Lead retains integration responsibility.

Recommended sequence: preserve the empty template catalog until the user selects exact local references. For each selected reference, build a modular renderer and verify shared-data switching, save/reopen, motion, and language behavior before moving to the next one. Add guest interactions/moderation/admin controls and provider-heavy features in scoped stages.

Use the lead plus up to three focused specialists concurrently initially, rotating roles with the phase. Give every assignment owned files/modules, dependencies, acceptance criteria, and a handoff describing changes, checks, and unresolved issues. Core/backend is the single migration owner; other agents propose shared-contract changes through the lead. Avoid concurrent writes to shared files; use isolated branches/worktrees once Git is established and consolidate before integration checks. Implementers verify their changes; independent QA does not replace that duty.

Development agents are distinct from production queue workers. The running app will need durable job types for Telegram notifications, receipt analysis, media processing, and template replacement; these can initially share a worker deployment with bounded concurrency/retries rather than separate microservices. Only receipt analysis needs an AI provider by current requirements.

## Additional reference captures (2026-10-20)

- User requested local design captures from taklifnomachi.uz, onlinetaklifnoma.app, taklifla.uz/templates, taklifiy.uz/ru/invitations, yoryor.org, mytaklif.uz/t, and invitate.uz, in the existing per-source capture workspace format.
- User also requested opening and checking every newly copied template. Preserve public source URLs and record missing assets or rendering limitations; do not claim perfect copies without verification.
- This authorizes reference capture and local preview work, not production integration or a change to the product requirements.
- User additionally authorized capturing the 156 Wedivo previews exposed by scrolling through their signed-in dashboard and adding them to the same local gallery. Treat this as reference capture only; do not convert these templates into production renderers without a separate implementation decision.
- User additionally authorized adding the existing Chorlove and Marxaba reference captures to that local gallery and checking their live catalogs for missing designs. The catalogs were checked on 2026-10-20; captures remain reference material only and are not production templates.

- User additionally authorized capturing the public Invitio theme previews at invitio.co.id and adding them to the same local reference gallery. Keep as reference captures only; do not integrate into production without a separate decision.

- User additionally authorized adding Wedvitation’s public invitation previews to the local reference gallery. Capture its public catalog designs only; do not promote them into production templates without a separate decision.

- User additionally authorized capturing all public Yumevite catalog template previews in the local reference gallery. Keep as reference material only; production integration requires a separate decision.
- User additionally authorized adding the existing E-Taklifnoma (e-invitation.uz) captures to the local reference gallery. Include its seven saved previews across Nikoh to'yi, Nahor oshi, and Xatna to'yi; keep source captures untouched and do not treat this as production template integration.

## Production template conversion brief (2026-10-20)

- User requested a reusable prompt for a coding agent to convert captured reference templates into production templates with dynamic invitation fields, preserving the complete design, animations, and interactions.
- This request is for the implementation brief only; it does not itself resume reference integration in this session. Apply the existing modular renderer, shared-data, language, optional-feature, and reference-preservation requirements when integration is authorized.

## Shared template preview sample data (2026-10-20)

- Current scope correction (2026-10-20): the user authorized preparing all ten
  Marxaba nikoh templates listed in `docs/templates/TEMPLATE_ROADMAP.md` after
  the earlier Anor-first restriction. Continue the full batch without waiting
  for per-template approval. Each template remains unpublished/unselectable
  until its own documented gates pass. User authorization (2026-10-21): publish
  Qandil and Ko‘zgu after passing their release checks; their catalog migrations
  were applied and committed separately. External app deployment remains a
  separate step.

- Confirmed: use one shared `apps/web/src/modules/catalog/preview-sample.json` fixture for catalog and the initial template-selection stage. It contains consistent sample names, family/hosts, event date and time, venue, greeting, invitation text, event label, and repeatable program entries in Uzbek Latin, Uzbek Cyrillic, English, and Russian.
- User requirement (2026-10-21): show three example guest wishes in every template's catalog and initial template-selection preview, with the section eyebrow “Yurakdan” where that is part of the captured design. Keep sample wishes in the shared localized `preview-sample.json` fixture and never persist or publish them as invitation content.
- User correction (2026-10-21): use the catalog artwork names Javohir and Madina as the shared demo couple in every locale, so opening a template preview matches its catalog card. In Uzbek Cyrillic and Russian demo names, render the Latin name sound `h` with `х` (Javohir → Жавохир); keep normal Uzbek Cyrillic spelling such as `ҳ` in the surrounding Uzbek copy. Apply these names only to catalog/initial selection samples; authored creator content replaces them and sample data is never saved or published.
- User requirement (2026-10-20): show language choices as `Uz`, `Уз`, `En`, and `Ru` in the invitation language switcher, while retaining the internal locale identifiers for storage and routing.
- Every template maps the same fixture into its own source design. Creator-authored data takes precedence; the fixture is presentation-only and must never be saved, exported, or published.
- Keep fixture editing in source control for now. An admin settings screen for changing preview samples is a future option, not a current requirement.
- Confirmed: the catalog card uses the template's distinctive first/opening page artwork at its full portrait aspect ratio, rather than cropping a landscape scene or substituting another image. Source metadata's dedicated preview asset takes precedence.
- User correction: invitation names must remain fully visible in every template and at narrow screen sizes. Preserve the source's authored display typography when both names fit; adapt only the overflowing name lockup with responsive sizing or wrapping. Test unusually long names as part of template review.

- User request (2026-10-21): continue template work one design at a time. Finish
  the active design with complete source-level dynamic integration and its
  customer-ready verification, then publish it before advancing to the next
  design. If any required release gate is still open, stay on that design and
  leave it unpublished; do not count implementation progress as publication
  readiness.
- User follow-up (2026-10-22): continue with the next design already in the
  conversion sequence and publish it through the existing catalog once its
  documented release gates pass. The current roadmap identifies Nilufar as the
  active next design; its existing publication authorization remains subject
  to those gates.
- Follow-up (2026-10-22): Nilufar is now catalog-published at 150,000 UZS with
  wedding and fotiha compatibility. Migration `0052_publish_nilufar.sql` was
  applied and the public catalog API, 390px layout, and authenticated
  four-locale save/publish/reopen flow were verified. Reduced-motion runtime
  emulation was unavailable; source guards and focused assertions pass.
  External deployment and live payment activation were not performed. Continue
  with the next design in the approved conversion sequence.
- User selected Samarqand Kechasi as the next template and requested publication
  through the same catalog mechanism and existing 150,000 UZS price after its
  template checks pass. This authorizes its additive catalog publication
  migration; it does not authorize external deployment or live payment changes.
- User requested that, after Samarqand Kechasi, the next template be fully
  prepared and published using the same catalog mechanism. Bog‘i Eram is the
  next template in the approved batch. The request authorizes its additive
  publication migration at the existing 150,000 UZS price; it does not
  authorize external deployment or live payment changes.
- User requested that template work continue after Bog‘i Eram. Atlas is the
  next design and may be published with an additive migration at its existing
  150,000 UZS price after its documented checks pass. Do not deploy externally
  or activate live payments as part of this work.

- User request (2026-10-21): continue through the remaining Marxaba templates
  and other already captured, approved reference sources one at a time. Make each
  publishable and publish it through the existing catalog mechanism only after
  its required release gates pass. This supersedes the earlier pause after Atlas
  for the newly approved sequence; it does not authorize external deployment or
  live payment activation.
- User clarification (2026-10-21): finish the remaining Marxaba designs first,
  then continue with Chorlove. Work on distinct templates in parallel where
  possible; the primary agent reviews each worker's changes and release gates
  before publication. Unfinished designs remain unpublished. This does not
  authorize external deployment or live payment activation.
- User correction (2026-10-21): Uchar Gilam's names must appear directly on the
  carpet as in its original artwork; the dark rounded text panel is not
  acceptable. Published template previews should show the original clothing
  section, populated with localized sample dress-code text and palette.

- User correction (2026-10-21): skip Uchar Gilam completely and continue with
  the next template. Oq Kabutar is now catalog-published at 150,000 UZS after
  source fidelity, four locales, opening, mobile layout, RSVP state, optional
  sections, and browser checks passed. External deployment and cloud-media/save
  verification remain open. Continue with Kuzgi Chinor.
- Follow-up (2026-10-21): Kuzgi Chinor is now catalog-published at 150,000 UZS
  after the four-locale, source-fidelity, opening, mobile, RSVP, optional-section,
  reduced-motion source guard, and asset checks passed. Its app-specific page
  metadata uses Uzbek as the source text so Uzbek Cyrillic renders naturally.
  External deployment and cloud-media/save verification remain open. Continue
  with Muhabbat Kitobi; Uchar Gilam remains skipped.

- Follow-up (2026-10-21): Muhabbat Kitobi is catalog-published at 150,000 UZS after its four-locale copy/metadata, source fidelity, responsive preview, RSVP, authored-story integration, and release checks passed. Story chapter labels are localized. External deployment and cloud-media/save verification remain open. Continue with Sahifa; Uchar Gilam remains skipped.
- Follow-up (2026-10-21): Sahifa is catalog-published at 150,000 UZS after source fidelity, localized metadata, four-locale content, opening, mobile width, optional sections, and clean browser-console checks passed. Preview wishes use the shared localized sample fixture; locale switching preserves invitation data. External deployment and cloud-media/save verification remain open. Continue with Oltin Uzuk; Uchar Gilam remains skipped.
- Follow-up (2026-10-21): Oltin Uzuk is catalog-published at 150,000 UZS after source artwork/styles, four-locale content and metadata, mobile width, opening, RSVP, optional sections, example wishes, and clean browser-console checks passed. Empty scene animations are skipped when the captured photo-based ring film replaces the 3D scene. External deployment and cloud-media/save verification remain open. Continue with Oynavand; Uchar Gilam remains skipped.
- User requirement (2026-10-21): every catalog and initial template-selection preview must show the optional To‘yona section using the shared preview-only JSON fixture. The example card details are `8600 1234 5678 9012` and `AZIZ AZIZOV`; never include them in saved creator invitations or public invitation data.
- User requirement (2026-10-22): Invitate designs display creator-provided To‘yona card details in a way that fits each template. Evelina and Aurelia show the optional section only when To‘yona is enabled and a card number is present; conceal the details on a card that flips open on click, include the cardholder when supplied, and allow copying the number.
- User requirement (2026-10-21): every catalog and initial template-selection preview must show the Bog‘lanish section with the shared preview-only contact examples `+998 90 123 45 67` and `@demo`. Keep these out of saved creator invitations and public invitation data.
- User requirement (2026-10-21): extend the shared preview-only wedding program to six localized entries (17:30 guest arrival, 18:00 couple entrance, 18:30 congratulations and dinner, 20:00 dancing and music, 21:30 cake, 22:30 closing words). Keep the Lahzalar section visible in template previews even when the gallery has no images; continue hiding empty galleries on public invitations.
- User correction (2026-10-21): use each template's complete captured Lahzalar/gallery section, including its original markup, styling, and interactions, across published and remaining templates. Do not hand-build repeated placeholder cards or substitute images. Keep the preview-only gallery section visible when the fixture has no photos; use only decorative empty-state elements that are actually present in that template's captured source. The local Anor capture has the arch gallery, image template, arrows, and dots, but no empty-state star cards, so its app preview must follow that captured implementation rather than the improvised cards.
- Follow-up (2026-10-21): Oynavand is catalog-published at 150,000 UZS after
  source fidelity, portrait opening artwork, four-locale, opening, sample
  program/dress-code/wishes/To‘yona/contact, empty Lahzalar, and RSVP checks.
  Additive migrations `0022` and `0023` were applied. External website deploy
  and cloud-service readiness remain unverified; continue with Somon Yo‘li.
- Follow-up (2026-10-21): Somon Yo‘li is catalog-published at 150,000 UZS
  after four-locale, opening, six-item localized program, source gallery,
  preview-only gift/contact, RSVP/wishes, and build checks. Migrations `0024`
  and `0025` were applied. Fixed locale-specific program delivery in the shared
  Marxaba runtime. External website deployment and cloud-service readiness
  remain unverified; continue with Qog‘oz Turna. The full test suite has one
  unrelated existing failure because Paxta's expected `preview.webp` is absent.
- Follow-up (2026-10-21): Qog‘oz Turna is catalog-published at 150,000 UZS
  after exact captured body/style/motion checks, packaged portrait artwork,
  four-locale browser review, opening behavior, the complete six-item program,
  preview gallery, shared wishes, gift/contact sample, and RSVP controls passed.
  Migrations `0026` and `0027` were applied. External deployment and cloud
  service readiness remain unverified; continue with Nilufar.
- User correction (2026-10-21): catalog and blank creator previews must show the
  captured Lahzalar empty-photo icon cards across templates. Use six icon-only
  entries with empty image URLs in the shared preview fixture so each captured
  renderer draws its own placeholder cards and controls. Do not use sample
  photographs. Keep these entries out of saved and public invitations; public
  galleries remain hidden until the creator adds photos. Refresh placeholder
  image fallback and carousel bindings when preview data arrives after iframe
  initialization.

- User requirement (2026-10-21): preview-only empty Lahzalar items display a decorative icon without the repeated “To‘y surati” fallback text. Gallery previous/next controls wrap from either end and scroll smoothly, respecting reduced-motion preferences. Keep accessible localized labels on the controls.
- User requirement (2026-10-21): after each template is published, create a local Git commit for that publication; do not push it. Commit only after the template has passed its release gates and its publication state is verified.
- User correction (2026-10-21): Qandil and Oynavand catalog covers must match their captured source openings. Qandil uses the original source's initial dark-room, hanging-lantern opening rendered from `index.html`; do not substitute a user-provided screenshot. Oynavand must show its opening copy and names rather than an empty background. Refresh cover provenance whenever either source capture changes.
- Follow-up (2026-10-22): Suzani is catalog-published at 150,000 UZS via additive migration `0053_publish_suzani.sql`. The focused package suite, typecheck, responsive/four-locale browser checks, and isolated four-locale save/publish/public-render/reopen integration passed. Fixed the captured embroidered opening art's stacking with a documented template-scoped adapter. Reduced-motion browser emulation remains unavailable; source guards and assertions pass. Continue with O‘rik Guli. No external deployment or live payment activation.
- Follow-up (2026-10-22): O‘rik Guli is catalog-published at 150,000 UZS through migration `0054_publish_orik_guli.sql`. The database and `/api/catalog` confirm publication and wedding/fotiha/qiz-uzatish compatibility. Mobile reference comparison at 390×844, all four full-page locales, long names, gallery/lightbox controls, To‘yona, and guest-count control pass; no horizontal overflow or browser errors. The five focused package/fixture tests, web typecheck, production build, and isolated save/publish/public-render/reopen integration pass. Added exact 780×1170 first-view catalog-art provenance and a source-adaptations record. Runtime reduced-motion emulation remains unavailable; captured JavaScript/CSS handling and source assertions pass. No external deployment or live payment activation.

- Follow-up (2026-10-22): Lola is published at 150,000 UZS through additive migration `0059_publish_lola.sql`; four-locale save/publish/reopen integration and browser checks pass. Continue sequentially with Qiz Bazmi. Reduced-motion browser emulation remains unavailable; captured and CSS guards are present.
- Follow-up (2026-10-22): Qiz Bazmi is published at 150,000 UZS through additive migration `0060_publish_qiz_bazmi.sql`; four-locale save/publish/reopen integration passes for the catalog. Continue sequentially with Shahzoda. Reduced-motion browser emulation remains unavailable; captured and CSS guards are present.
- Follow-up (2026-10-22): Shahzoda is published at 150,000 UZS through additive migration `0062_publish_shahzoda.sql`; four-locale save/publish/reopen integration passes across the catalog. Fixed long-name clipping in the captured intro plaque and hero using a scoped app adapter. Continue sequentially with Chavandoz. Reduced-motion browser emulation remains unavailable; captured and CSS guards are present.
- Follow-up (2026-10-22): Chavandoz is published at 150,000 UZS through additive migration `0063_publish_chavandoz.sql`; the database and `/api/catalog` confirm Sunnat/birthday support. Full four-locale save/publish/public-render/reopen integration passes. Corrected published flags in the typed fallback catalog for all completed database releases so local catalog visibility matches publication state. Continue sequentially with Beshik; reduced-motion runtime emulation remains unavailable while captured CSS/JS paths are present.
- Follow-up (2026-10-22): Beshik is published at 150,000 UZS through additive migration `0064_publish_beshik.sql`; the database and `/api/catalog` confirm category `other` plus beshik-toyi/birthday compatibility. Fixed long-name clipping in the animated opening and hero with scoped adapter CSS. Full 402-test suite, typecheck, production build, browser checks, and four-locale save/publish/public-render/reopen integration pass. Continue sequentially with Konfetti; reduced-motion runtime emulation remains unavailable.
- Follow-up (2026-10-22): Konfetti is published at 150,000 UZS through additive migration `0065_publish_konfetti.sql`; DB and `/api/catalog` confirm the birthday category and birthday/jubilee support. Four-locale copy, long-name fit, candle opening, gallery movement, guest count, clean console, source parity, 402 tests, typecheck, build, and the catalog-wide save/publish/public-render/reopen integration pass. The in-app browser viewport override did not take effect, so mobile runtime review remains unverified; responsive rules and shared name-fit remain in place. Reduced-motion runtime emulation is unavailable; source JS/CSS support it. Continue sequentially with Oltin Kuz.

- Follow-up (2026-10-22): Invitate Evelina is published at 150,000 UZS after a local-source package, mobile/browser checks, focused tests, typecheck, production build, and the authenticated four-locale save/publish/public-render/reopen integration passed. The Cyrillic calligraphy fallback visually maps unsupported Uzbek `ҳ/қ` glyphs to `х/к` while retaining the original accessible text. The language chooser follows Anor's fixed header control. Continue with Aurelia, the first locally captured design in Invitate's live catalog order.
- User correction (2026-10-22): For Aurelia, preserve the two captured photo assets as visible design defaults. The first uploaded creator gallery image replaces the celebration photo and the second replaces the restaurant photo; an empty slot retains its captured default. Keep these defaults as template assets rather than saving them into invitation content.
