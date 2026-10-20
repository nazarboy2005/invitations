# Implementation decisions

Recorded on 2026-10-19 from the user's explicit approval. These are product requirements for future implementation, not implemented features.

## Maintaining this record

The user requests that the important things discussed be kept here and updated as the discussion continues. Record confirmed requirements and corrections promptly, distinguish recommendations from approved decisions, and keep unresolved choices explicit. Replace superseded requirements so future implementation follows the latest agreement. This instruction authorizes maintaining project documentation, not beginning implementation.

## Current implementation authorization and visual direction (2026-10-20)

- The user has now authorized agents to begin building the project. Earlier statements that implementation had not yet been requested describe the prior planning stage and no longer block this work. External deployment, live payments, or use of unavailable credentials are not implied by starting local development.
- Installed complementary design skills: Anthropic `frontend-design` and Vercel `web-design-guidelines`; existing UI/UX Pro Max and shadcn remain available. Installation was explicitly requested before implementation continued.
- Confirmed visual correction: use soft qaymoqrang (cream), not green, throughout the current interface. Prefer warm ivory/cream surfaces, quiet taupe/brown text, understated champagne accents, light borders, and restrained effects. Avoid dominant green accents, generic gradients, and unnecessary decorative UI. Preserve legibility, keyboard focus, and accessible contrast while keeping the result soft.

## Template catalog status and admin-managed categories (2026-10-20)

Confirmed requirements:

- Platform administrators can assign any template to any category throughout the website. Categories are catalog organization, independent from an invitation's event type, selected design, price, publication state, or authored content.
- Use shared category assignments across the public catalog and creator template picker, rather than hard-coded categories in each screen. A template can belong to multiple categories; administrators can update assignments without editing customer invitations.
- Current correction: remove every provisional/dummy template from the application. The Suzani, Shirin bayram, and Ivory Love starter designs are not approved final templates and must not appear as selectable, previewable, or public invitation designs.
- Use the exact designs in the existing local `Invitations - this folder will be removed from production` reference collection later. Leave those captures untouched; do not convert another one until the user explicitly resumes template integration.
- Do not show dummy designs. Template-selection lists contain only real published designs. A full preview uses the real renderer.
- User request (2026-10-20): show the ready Anor design on the homepage and public catalog so people can inspect it. Until it clears the existing publication blockers, label it preview-only and do not expose a template-selection/purchase action. Do not automatically surface other unpublished templates.
- User correction (2026-10-20): catalog cards must use the design's actual reference preview artwork, not an unrelated crop of another scene from the template. Prefer the dedicated image named by the template metadata when present.
- User clarification (2026-10-20): realistic sample invitation details may appear in a catalog preview and during the template-selection stage while the creator has not entered any invitation content. Once any creator-authored content exists, preview their actual content. Sample data is ephemeral presentation data: never save it, publish it, export it as a creator draft, or let it override authored fields. Keep the no-sample rule for later creation stages and public invitations.
- Preserve genuine reference behavior, including meaningful animations and opening sequences, when each exact template is integrated. Follow reduced-motion preferences. Sample invitation copy may demonstrate the layout only in the limited preview cases above; it must not introduce unrelated template artwork or media.
- Earlier approval to build `ivory-love` first is superseded by this correction.
- Current user request (2026-10-20) explicitly resumes production integration and authorizes completing one Marxaba design. Anor is the selected first template. This supersedes the temporary empty-catalog requirement for Anor only; do not proceed to another template until this one is verified.
- Anor's renderer and catalog metadata may be developed and previewed, but keep it unpublished/unselectable until the template passes the requested end-to-end checks and production blockers (including receipt uploads when enabled and asset rights) are resolved. Do not treat a partial renderer as ready to publish.
- Reuse the selected template's own source for the Anor layout and motion, support reduced motion, and use the same isolated renderer for creator preview and public display. Keep the source capture untouched. Its upstream licensing still requires verification before commercial launch.
- User clarification (2026-10-20): "copy" means reuse the template's actual captured HTML, CSS, JavaScript, and assets instead of recreating the design. Anor's local capture contains those source files. Supersede the earlier Anor-only recommendation to recreate the design in a native renderer: package and run the template-level source in an isolated same-origin frame, retaining its original layout and motion code, and bridge it to the platform's typed invitation contract and real RSVP/wishes APIs. Do not import Marxaba's general sample-invitation or platform core/runtime; those carry unrelated sample data and site-level behavior. Keep the source capture untouched. Reuse does not resolve the artwork/code distribution rights question; keep Anor unpublished until rights and production blockers are cleared.
- User reiterated that fidelity includes the original typography and every visual detail. Preserve the captured font families, weight/style variants, CSS, artwork, HTML structure, and motion; package externally referenced font files locally when needed, and do not substitute platform fonts or styling. Platform data/API adapters may be added without redesigning the template.
- Dress code is an optional creator-selected invitation section. When enabled, creators can edit its localized style/text, palette, and note; when disabled or empty, hide it. The venue-photo field remains absent from the editor/shared data contract; do not fill it with sample invitation media. Report it as a gap unless separately approved.
- User requirement (2026-10-20): every new template must use the complete source implementation from its selected reference, including its HTML, CSS, JavaScript, animation code, fonts, artwork, and interactions. Do not approximate or rebuild the design. Keep template-owned source files unchanged and put typed data/API integration in a separate adapter; any necessary source changes must preserve the reference output and be documented. Keep the original capture untouched.
- User requirement (2026-10-20): provide a dedicated full-page preview for each real template so people can see the whole design at its actual public size, including its opening sequence and scroll behavior. Do not confine the only full preview to a phone-shaped mockup in the editor. Catalog cards and the editor's design choices should link to the full preview; the editor may keep a compact live preview for quick feedback.
- User requirement (2026-10-20): the live preview shown during invitation creation should look and behave like the real invitation page at the available viewport size, rather than being clipped inside a decorative phone frame. Keep real creator-entered data in it. Only show illustrative sample names/details while browsing a template or at the template-selection stage before any content has been entered.
- User requirement (2026-10-20): the site must feel polished, complete, responsive, and carefully reviewed on desktop and mobile. Preserve the established soft cream platform styling, while keeping each invitation template's source visual identity intact. Do not publish placeholder or visibly unfinished pages.

Implementation choices:

- Store categories and template/category relationships in PostgreSQL; expose admin-only category creation/renaming and assignment controls. Site administrators can assign any template to any number of categories, and category filters must help customers discover matching designs in the public catalog and editor picker. Seed existing event categories as a starting point, with no restriction tying designs to those events.
- Template registry and renderer modules must remain independent and modular so exact references can be added one at a time. For Anor, package only its template-level HTML, CSS, animation scripts, and assets in the isolated renderer; do not embed the complete captured website or import Marxaba's general site runtime/sample invitation. Live service validation still requires configured PostgreSQL, Telegram, and R2.

## Required invitation content

- Support names of the people involved, family/host names (for example, Al Thani family), event type, date/time, and editable introductory/invitation text.
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
- Keep variants under one invitation/owner/URL with shared events, guest records, and media, rather than creating independent invitation copies.
- Allow separate wording for names/family names when needed, greetings and personalized greeting patterns, invitation/introduction text, event labels, program titles/descriptions/speakers, venue names/addresses/directions, contact labels, stories, dress-code text, photo captions/alt text, gift notes, and other editable visible text.
- Preserve all language variants when switching templates. Every selectable template must render supported language variants without losing fields.

Recommended behavior and schema guidance:

- Editor: choose a primary language, then "Til qo'shish" / Add language to enter only language-dependent fields. Reuse shared dates/times/timezones, coordinates/map references, contact values, card details, uploaded files, and event/program item identities/order. Display dates/numbers using the active locale; do not store duplicate dates or media per language.
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
- In a private bot chat, read identity from authenticated Telegram update `from.id`; verify callbacks against the same Telegram user. Ask for explicit "Confirm website login" consent and show request context plus a short code also displayed on the website. Receiving `/start` alone must not silently log a browser into the sender's account. Never ask users to share login links/codes with others.
- The originating browser checks request status using its own session-bound secret, not merely the public bot-link payload. After bot confirmation, show the authenticated Telegram identity and require browser confirmation before establishing account access and claiming the draft. This reduces accidental account linking and forwarded-link/login-CSRF risks; the codes/context must match a login the user actually initiated.
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

## AI screening and Telegram delivery of to'yona receipts

User-requested workflow:

- When the invitation creator enables receipt uploads, visitors can submit a receipt screenshot/image or PDF together with the name(s) of the person/people giving the to'yona. Keep these guest-entered names separate from any bank sender name extracted from the receipt: transfers may come from another person's account.
- Screen the receipt using the supplied AI gateway first, with the official OpenAI API as an independent fallback on primary provider failure.
- Check whether the document appears to be a completed transfer receipt and compare its visible recipient card details and cardholder name against the invitation's selected to'yona destination. Do not compare against unrelated bride/groom names or platform service-payment accounts.
- Forward a receipt that passes screening, with the submitted giver names, to the invitation creator through the Telegram bot. Show an appropriate guest-facing delivery confirmation.
- Clearly unrelated documents must receive a message explaining that the upload is not a payment receipt.

Validation findings and recommended implementation rules (technical assessment, not a claim of bank verification):

- AI can classify/extract receipt information and assess visible consistency. It cannot prove authenticity or that funds actually arrived. Never label AI-screened receipts as bank-verified payments. Recipient confirmation or a future bank/payment-provider integration is a separate source of payment verification.
- Use three screening outcomes: `passed`, `rejected`, and `needs_review`. Provider/processing errors have their own status, never a fabricated rejection or payment success.
- Extract structured fields: document type, displayed transfer status, recipient card mask/visible digits and positions, recipient name, sender name if present, amount, currency, transfer date/time, transaction/reference ID if present, field readability, and reasons for the outcome. Missing values stay null; never invent details.
- Perform recipient matching in server code using extracted evidence and a snapshot of the selected card details at submission time. Normalize spaces/separators in card numbers and compare visible digits at their actual positions. A card-shaped number, a matching bank prefix, or last-four match alone is insufficient to establish the recipient.
- Normalize names for case, punctuation, and supported transliteration. Initials, masked names, missing recipient fields, uncertain OCR, or conflicting evidence need review rather than guessing. Exact match thresholds and treatment of partial matches must be calibrated against real receipt examples before implementation is considered reliable.
- Clearly readable contradictory recipient details or a failed/cancelled/pending transfer do not pass completed-transfer screening. Explain the actual reason rather than calling every failed check "not a receipt".
- Do not require the bank sender name to equal the guest-entered giver names. Show both to the creator when available.
- Primary fallback triggers include timeout, unavailable service, quota/rate-limit exhaustion, and unusable/invalid structured output. Do not retry a clear semantic rejection with another model merely to obtain acceptance. If both providers fail, preserve the private submission and show processing pending/unavailable; retry or review it separately.
- Supplied provider: an OpenAI-compatible gateway documented at `https://ai-api.nodzera.com`, using `/v1/chat/completions` or `/v1/responses`. It invokes a local Codex CLI and shares the signed-in account's limits; it is not the official OpenAI API. Use configurable server-only credentials and provider/model adapters. Production uptime, capacity, and real receipt accuracy have not been tested.
- The supplied gateway supports image understanding but its native PDF reader extracts text only, does not inspect PDF images, and rejects no-text scans. Render receipt PDFs to bounded page images in an isolated worker before primary vision processing; retain extracted text as supplemental evidence. Apply byte/page/pixel limits compatible with the gateway, including base64 overhead. Do not silently ignore pages that were not processed.
- The official OpenAI fallback supports image input and PDF text/page-image analysis with a compatible vision model. Keep fallback credentials, model choice, usage, and errors distinct from the local gateway. No production model has been selected yet.
- Receipt content is untrusted evidence, never model instructions. Use extraction-only calls without action tools; validate returned structured data before application decisions. The model cannot choose Telegram recipients or initiate messages.
- Keep original receipts and derivatives private in R2; validate actual image/PDF content and apply upload limits. Explain to guests that receipts are analyzed by the configured AI provider(s) and shared with the invitation creator through Telegram. Avoid public receipt URLs and sensitive content in logs.
- Process uploads asynchronously with durable job/delivery state. Rate-limit uploads and detect duplicate files/transaction evidence within the relevant invitation/destination; retries must not produce repeat owner notifications. Duplicate detection is evidence-based and cannot guarantee detection of edited receipts.
- Bind the creator's Telegram chat to their authenticated platform account before enabling the Telegram-dependent receipt flow; do not accept an arbitrary visitor-supplied chat ID or username as the destination. If the bot becomes unavailable or blocked, retain the receipt and retry/show delivery pending without reporting successful delivery.
- On a passing receipt, the bot sends the receipt and giver names with a summary (amount/currency/date if readable, masked recipient, screening result). State that actual receipt of money is unconfirmed. Recommended owner controls: confirm received / flag an issue, separately from AI screening.
- Guest messages distinguish: `Chek tekshirilmoqda...`; delivered: `Chekingiz taklifnoma egasiga yuborildi.`; unrelated upload: `Bu fayl to'lov cheki emas. Iltimos, pul o'tkazmasi chekini yuklang.`; wrong destination: `Chekdagi qabul qiluvchi rekvizitlari mos kelmadi.`; unreadable/partial evidence: `Chek ma'lumotlarini aniq o'qib bo'lmadi. Iltimos, tiniqroq nusxasini yuboring.`; queued delivery: `Chekingiz qabul qilindi. Yuborish kutilmoqda.` Show "sent" only after the Telegram API acknowledges delivery; this does not mean the creator read it.

Suggested schema extensions (exact migrations remain unapproved):

- `gift_receipts`: retain invitation/destination/guest/asset references; include `giver_names`, extracted bank sender name, recipient evidence snapshot, extracted fields, file hash, screening status/reasons, processing status, owner review status, and submission/update timestamps. Do not use one ambiguous `approved` flag for screening, bank confirmation, and delivery.
- `receipt_analysis_attempts`: receipt reference, provider, model, schema/prompt version, extracted result/reason codes, outcome/error code, and attempt timestamps; no secrets or unnecessary raw sensitive logs.
- `telegram_connections`: platform user reference, verified Telegram user/chat IDs, linked time, connection status.
- `receipt_deliveries`: receipt reference, creator connection reference, delivery status, idempotency key, retry count, next retry time, last error, Telegram message ID, sent time.

References checked on 2026-10-19: supplied gateway documentation (user attachment); official OpenAI file inputs https://developers.openai.com/api/docs/guides/file-inputs and vision limitations https://developers.openai.com/api/docs/guides/images-vision. This was a documentation/design assessment only: no receipt was uploaded to either provider and no Telegram message was sent.

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

- Confirmed: use one shared `apps/web/src/modules/catalog/preview-sample.json` fixture for catalog and the initial template-selection stage. It contains consistent sample names, family/hosts, event date and time, venue, greeting, invitation text, event label, and repeatable program entries in Uzbek Latin, Uzbek Cyrillic, English, and Russian.
- User correction (2026-10-20): use Asadbek and Gulhayo as the shared example names in every locale's sample fixture.
- User requirement (2026-10-20): show language choices as `Uz`, `Уз`, `En`, and `Ru` in the invitation language switcher, while retaining the internal locale identifiers for storage and routing.
- Every template maps the same fixture into its own source design. Creator-authored data takes precedence; the fixture is presentation-only and must never be saved, exported, or published.
- Keep fixture editing in source control for now. An admin settings screen for changing preview samples is a future option, not a current requirement.
- Confirmed: the catalog card uses the template's distinctive first/opening page artwork at its full portrait aspect ratio, rather than cropping a landscape scene or substituting another image. Source metadata's dedicated preview asset takes precedence.
- User correction: invitation names must remain fully visible in every template and at narrow screen sizes. Preserve the source's authored display typography when both names fit; adapt only the overflowing name lockup with responsive sizing or wrapping. Test unusually long names as part of template review.
