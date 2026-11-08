# Olive Manor app adaptation

Exact E-invitation catalog ID: `olive-manor-edition`. This design is registered unpublished while visual parity and release checks are completed. It is a separate E-invitation template and must not be replaced with a similarly named Invitate or Chorlove design.

`source/reference/` preserves exact captured modules, styles, fonts and artwork for analysis. The dedicated standalone app renderer and narrow typed adapter use the captured Olive Manor section class structure and styling with the shared invitation contract. Visual parity has not been verified yet. Do not load Nuxt, the E-invitation shared registry/site runtime, source demo data, analytics, sample soundtrack, or external RSVP endpoints.

Required bindings: localized couple/host names and guest greeting; event/date/time/countdown/calendar; program; venue/address/map; creator gallery; creator music; gift; contacts; RSVP and wishes. Catalog preview uses the shared Emotional Piano and ephemeral fixture data. Public invitations use creator-selected music and real invitation data. Empty optional fields stay hidden. The table assignment has no app data field and must stay empty.

Release gates still open: source/component/assets parity review; production renderer and adapter; typed catalog and unpublished DB registration; creator/full preview/public route; focused tests; typecheck/build; ChatGPT in-app browser review on desktop/mobile and reduced motion; authenticated save/publish/public-render/reopen; live catalog confirmation; separate release commit and authorized Telegram notification.
