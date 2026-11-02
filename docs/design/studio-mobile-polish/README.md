# Studio and phone layout refinements — 2026-11-03

- Venue search closes on blur, outside pointer interaction and Escape. Delayed
  search results stay cached without reopening the dismissed dropdown. Refocusing
  shows the results; explicit mouse/touch selection still resolves a destination.
  Descriptive name edits retain the selected Yandex URL.
- Studio no longer offers generic add/remove-name controls. Both wedding fields
  remain available even if a draft contains only one name. Existing extra names
  remain editable rather than being removed from stored content.
- Phone catalog search and its shortcut share a row: heart/count for favorites,
  catalog icon for all designs. Icon links retain accessible names. Desktop text
  labels remain visible.
- The phone dashboard stacks the heading above a full-width action row with
  aligned favorites/new-invitation links and a 44px new-invitation target.

Verification:

```powershell
node --env-file=apps/web/.env.local --import tsx scripts/verify-studio-mobile-polish.mts
pnpm typecheck
node --import tsx --test tests/studio-capabilities.test.ts apps/web/src/modules/studio/preview-invitation.test.ts tests/invitation.test.ts
```

The browser script uses disposable authenticated fixtures and removes them in
`finally`. Yandex API responses are controlled browser fixtures, including a
response held until after focus loss; the application editor and saved invitation
reads are real. It checks wedding image/web and birthday name controls, preserved
existing names, mouse/touch selection and dismissal, and catalog/favorites plus a
loaded three-card dashboard at 320, 390, 430 and 580px without horizontal overflow
or page errors. The 29 regression tests and TypeScript check pass.

Screenshots: `venue-desktop.png`, `venue-mobile.png`, `templates-mobile.png`,
`favorites-mobile.png` and `dashboard-mobile.png`. No external deployment or
payment activation.
