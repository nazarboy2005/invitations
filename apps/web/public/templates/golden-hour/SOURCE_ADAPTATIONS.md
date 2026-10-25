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

The original font stylesheet response and referenced local WOFF2 files are copied to `assets/css/fonts.css` and `assets/fonts/`; 39 font-face rules resolve to 23 local font files with none missing. Page CSS is unchanged. The captured JavaScript and audio remain in the package for audit and design completeness. The active `golden-hour-source.js` retains the source countdown, 1-second timer, 0.18-threshold IntersectionObserver, and music toggle behavior, while taking date and optional music URL from the typed adapter. The source track is not installed as creator data or played automatically. The active data adapter handles dynamic text, sections, public RSVP/wishes APIs, and guest privacy.

## Required application changes

- The fixed date is replaced by contract date/time/timezone. The fixed age and “Best Year Yet” tagline are omitted because the shared contract has no age field and they are captured demo invitation content.
- Source music is an optional creator field. The captured soundtrack (`assets/audio/lanadel.mp3`, 9,386,537 bytes) is packaged byte-for-byte but not bound as invitation data or a default. Autoplay and first-click-anywhere playback are removed; the original toggle remains, and playback begins only from that control.
- The captured `golden-hour.php` RSVP endpoint is not present in the archive. Its submission is replaced with the shared invitation RSVP and moderated-wishes APIs; previews block requests.
- Site analytics, social/provider links, and fixed sample invitation details are not loaded. Contacts come from invitation data.
- App-only styles, including data wrapping, loading-state visibility, hidden-section behavior, gift receipt presentation, and reduced-motion overrides, live in `assets/css/contract-adapter.css`. The source stylesheet remains exact.

## Verification status

The archive has no additional Golden Hour HTML or JavaScript chunks, and the five images, source CSS/JS, and soundtrack are checked by `tests/golden-hour-template.test.ts`. The archive provides an authentic 390px full-page source screenshot and the catalog uses the source's exact portrait opening hero image. A disposable draft row passed the application `saveInvitation` update and `getOwnedInvitation` reload path at revision 2; the generated user and draft were deleted after the check. The browser preview also confirmed RSVP submission is blocked.

Normal-motion browser comparison is complete against `https://invitate.uz/golden-hour.html` and the app preview at 390×844 and 1280×720. The portrait hero image/crop, centered 480px desktop column, typography, location block, and dress-code styling match the source. App copy is contract-driven: it omits the source demo age/tagline and signature, and the shared birthday preview fixture's swatches differ from the captured source demo palette. Creator content replaces that preview fixture. Both pages had no browser console errors. The live browser reported `prefers-reduced-motion: reduce` as false; this session cannot emulate true reduced motion, so runtime behavior under that preference remains unverified. The CSS reduction rules and focused source checks remain present.

The focused Golden Hour test passes 5/5; `node --check` passes for both packaged JavaScript files. A creator UI save/reopen and public lifecycle check remain unavailable. `/studio` responds 200, but the public `/i/golden-hour-check` route responds 404 and `/api/invitations/golden-hour-check` responds 503. The local `/api/catalog` endpoint responds 200 and excludes Golden Hour; its response says database `configured: false`. The current shell has no `DATABASE_URL`, so database state cannot be refreshed. Browser media emulation is unavailable and `prefers-reduced-motion: reduce` stays false in this session; runtime behavior under that preference is not verified. Keep the template unpublished until reduced-motion runtime behavior and creator/public lifecycle checks are verified.
