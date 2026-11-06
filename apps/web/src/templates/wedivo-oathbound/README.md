# Ahd yo‘li (Wedivo Oathbound)

Proposed Uzbek catalog name: **Ahd yo‘li**. Stable catalog ID: `wedivo-oathbound`; category `wedding`; supported event
types `wedding` only. This isolated package is **not registered or published**.
The central coordinator owns registry, editor/preview/public routing, additive
database registration, pricing, and release publication. No shared registration,
migration, database, application deployment or payment change is included here.

`renderer.tsx` is the single renderer intended for creator and public display.
It hosts `/templates/wedivo-oathbound/index.html` in a same-origin frame and
passes only the typed adapter payload. `adapter.ts` never creates an invitation
or mutates caller data. Its preview media require both `preview` and the
canonical sample flag (`sampleWishes`); any authored gallery replaces them.

The source, dependency inventory, exact hashes and adaptations are documented
in the public package's `SOURCE_ADAPTATIONS.md` and `source/provenance.json`.
The original archive remains untouched. All 3D geometry, shaders, world
generation, skeletal animation, pathfinding, die rendering, chest/progress
systems and game-mode controls come from the captured source.

## Field mapping

| Source UI | Shared contract |
| --- | --- |
| Cover, hero, HUD, character names, credits | Active locale `content.people` |
| Guest name and prologue greeting | Guest display name + `content.personalGreeting` / `greeting` |
| Invitation paragraph, hosts | `content.message`, `content.hosts` |
| Wedding date, countdown, calendar, phase cards | `startsAt`, `timezone`, `content.eventLabel` |
| Unlimited phase/program rows | Stable `program.id`, time, localized titles/descriptions |
| Repeatable quest chapters | Stable `story.id`, localized title/text (no hard four-row cap) |
| Gallery, hero photo, lightbox | Creator `gallery`; six exact source photos only for initial sample previews |
| Venue, directions, address copying | Localized venue/address/landmark, map URL or coordinates |
| Dye works and cloak colors | `dressCode` style/text/note and repeatable named colors |
| Native Instagram contact | Shared `contacts.instagramUrl`; no invented person-specific profiles |
| Native background audio and sound toggle | Optional creator `music`; silent previews; source pause preference |
| Attendance form | Existing public RSVP API, opaque guest token, fixed party size 1/0 |
| Blessing form/list | Existing wishes API; only approved public wishes; pending acknowledgment |
| Native amount-based gift form | Creator gift enabled flag controls visibility; form remains disabled |

Phone/Telegram data and card/receipt data remain in the shared invitation but
have no native UI in this exact source and are not injected. The source has no
card-number display or receipt-upload interaction. The gift form is an amount
confirmation flow, with no matching approved service; it neither sends money nor
pretends a confirmation succeeded.

## Explicit contract gaps and release gates

The source parameter manifest supports separate full/nicknames, per-person
parents, age/level/stats/class/biography/signature items, individual portraits,
avatar customization, custom realm/title, quote/citation, patch notes, skill
tree authoring, story dates/photos/rewards, film/livestream, hashtag, co-inviters,
physical parking instructions and gift amount confirmation. Those have no
matching approved contract/editor/service fields. Example values are removed;
unsupported optional content is hidden while its native source structure and
game implementation remain packaged. No biography is inferred from names and
no source sample invitation content becomes creator data. Generic source game
art, world names and fictional inventory/game instructions remain template art.

The default Uzbek Latin presentation translates the source logo/name, all
static sections and controls, game dialogue/typewriter messages, world and
inventory labels, tooltips, placeholders, validation, success/error text, aria
labels, countdown/program text and CSS-generated copy. The separate
`platform-i18n.js` dictionary and DOM/source hooks keep translations outside the
original engine; authored names, paragraphs, stories, gallery labels and guest
wishes are protected from translation. The same built-in Uzbek copy is adapted
for Uzbek Cyrillic; creator-authored text is never transliterated. English and
Russian content/control variants remain supported, while extended Russian
game narrative still requires review. The unsupported authoring/service gaps require
coordinator review before this design can meet the full fidelity release gate.
Reduced motion deliberately uses the source classic scroll mode with no WebGL
world/die or CSS motion; it retains the same original sections and controls.

Focused tests: `pnpm exec tsx --test tests/wedivo-oathbound-template.test.ts`.
Browser evidence lives under `docs/templates/qa-artifacts/wedivo-oathbound`.
The browser service exercise uses explicit mocks and does not establish real
database persistence, creator save/reopen, publication, or public route parity.
Those integration checks require coordinator routing/registration first.

Translation decision (2026-10-26): the user's later Uzbek-default instruction
supersedes the source English name/copy. “Ahd yo‘li” retains the short two-word
fantasy title composition; world names and fictional game content are translated
naturally, including “Mehr vodiysi”, “Xotiralar o‘rmoni” and “Abadiyat qasri”.
No language-selector control is injected into the source; locale comes from the
shared renderer's existing locale prop/outer route.
