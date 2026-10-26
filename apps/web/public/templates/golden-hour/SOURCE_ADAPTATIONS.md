# Golden Hour source provenance and adaptations

The source is `Invitations - this folder will be removed from production/Invitate/Web invitations/invitate.uz/golden-hour.html`, resolved by the Invitate capture manifest. The original capture remains untouched. Its full-page mobile screenshot is `Invitations - this folder will be removed from production/reports/new-sites/Invitate/12-source.png`.

## Exact packaged assets

The following packaged files match the capture byte-for-byte:

| Captured source                             | Packaged path                               | SHA-256                                                            |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| `assets/css/golden-hour.css`                | `assets/css/golden-hour.css`                | `0924622B6172080D86416900155DBBBAD41774F20949F1FE62D2F78CECC2B61C` |
| `assets/js/golden-hour.js`                  | `assets/js/golden-hour-reference.js`        | `681C46465326A33389E6E57224FB014F5F069638A3A4CA4602009BF735E4E2D1` |
| `assets/audio/lanadel.mp3`                  | `assets/audio/lanadel.mp3`                  | `D565ED21AFEC170022FCCC6DB06A2E8FC273CA622620BF47247E73103AA1D1AC` |
| `assets/images/golden-hour/pink.png`        | `assets/images/golden-hour/pink.png`        | `83CDB9DF7D7006BC332F34279B9BB9EEC00DEC4A8570962D76BCD712311DA041` |
| `assets/images/golden-hour/flowers.png`     | `assets/images/golden-hour/flowers.png`     | `659E42DC8D40164943647F0DE84DC845042A0E6B5D10CD50177FEC149868839F` |
| `assets/images/golden-hour/flocake.png`     | `assets/images/golden-hour/flocake.png`     | `D8A8AEEB76AF7DADA3117776ED69BB2F3A251FE8553CCF4B2667126FC5391FDE` |
| `assets/images/golden-hour/location.png`    | `assets/images/golden-hour/location.png`    | `839C8E7A43E9C781C4F18C48738C05A6D23B943034952FEAFE3CF37E645AA97`  |
| `assets/images/golden-hour/footerimage.png` | `assets/images/golden-hour/footerimage.png` | `6EC900BAFDF18500070680BF3416C9EC1EA70700E117C96B182BF9095B805348` |

The original font stylesheet response and referenced local WOFF2 files are copied to `assets/css/fonts.css` and `assets/fonts/`; 39 font-face rules resolve to 23 local font files with none missing. Page CSS is unchanged. The captured JavaScript and audio remain in the package for audit and design completeness. The active `golden-hour-source.js` retains the source countdown, 1-second timer, 0.18-threshold IntersectionObserver, and music toggle behavior, while taking date and optional music URL from the typed adapter. Public invitations attempt the configured track on open through the shared route tracker; the source toggle remains available for pause and replay. The active data adapter handles dynamic text, sections, public RSVP/wishes APIs, and guest privacy.

## Required application changes

- The fixed date is replaced by contract date/time/timezone. The fixed age and “Best Year Yet” tagline are omitted because the shared contract has no age field and they are captured demo invitation content.
- Source music is an optional creator field. The captured soundtrack (`assets/audio/lanadel.mp3`, 9,386,537 bytes) is packaged byte-for-byte but not bound as invitation data or a default. Public invitations attempt the creator-configured track on open; browser-blocked playback retains the original toggle for guest control.
- The captured `golden-hour.php` RSVP endpoint is not present in the archive. Its submission is replaced with the shared invitation RSVP and moderated-wishes APIs; previews block requests.
- Site analytics, social/provider links, and fixed sample invitation details are not loaded. Contacts come from invitation data.
- App-only styles, including data wrapping, loading-state visibility, hidden-section behavior, and reduced-motion overrides, live in `assets/css/contract-adapter.css`. The receipt hook is hidden because the captured birthday source has no gift section. The source stylesheet remains exact.

## Verification status

The five images, source CSS/JavaScript, and soundtrack are checked against the original capture by `tests/golden-hour-template.test.ts`. The catalog cover is the source's exact portrait hero art (744×1280). The focused suite passes 5/5, `node --check` passes for both packaged JavaScript files, and the web typecheck passes.

Normal-motion browser comparison is complete against the live source and app preview at 390×844 and 1280×720. The hero art/crop, centered 480px desktop column, typography, location block, and dress-code styling match. Contract-driven copy omits source demo age/tagline/signature; the shared birthday fixture's swatches differ from the source demo palette. Both pages had no browser console errors.

The mobile RSVP comparison exposed a confirmed bug: localization selected every nested `.rsvp-field label`, replacing the first radio label's input. The adapter now targets only direct field labels with `.rsvp-field > label`. After the fix, both yes/no radios render with source-aligned spacing at 390×844 and 1280×720. No guest-count control is present. The preview blocks RSVP submission; no RSVP was submitted.

The configured catalog API reports Golden Hour published with birthday-only category/event support. The authenticated HTTP save → publish → public-render → reopen/allowed-edits integration passes 1/1; its disposable test invitation and user were removed afterward. Reduced-motion runtime emulation is unavailable in this browser session (`prefers-reduced-motion: reduce` is false). The original reduced-motion CSS rule is preserved, and the app package retains its reduced-motion overrides. No external deployment or payment activation occurred.
