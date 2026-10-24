# Chorlove Palov source package

Exact reference: `Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/palov/preview-frame.html`, resolved by the Chorlove capture manifest. This is separate from Invitate Palov (`invitate-palov`) and Chorlove Osh (`osh`). The Chorlove design uses shared ID `palov` and is served from this nested package so it cannot collide with the similarly named Invitate asset path.

The package retains the complete captured Palov page structure in `source-fragment.html` and its exact scoped stylesheet in `captured-styles.css`. The original Chorlove page/component chunk is `Web invitations/_next/static/chunks/11~zi79p5fltu.js` (module 924687); its component behavior and motion configuration are adapted into standalone `bridge.js` without shipping Next/Turbopack, React, Chorlove hooks, site analytics, API clients, the captured song, or the provider's default invitation. `palov.css` removes the remote font import; `fonts.css` and `fonts/` serve all requested Lora and Playfair Display faces and the Cyrillic/Latin subsets locally. Exact art `Web invitations/images/palov/palov.png` is retained as the source-owned plate illustration.

The captured metadata declares an authentic 778×1686 opening image. The remote image was inspected and checksummed, but is not packaged because it contains the source demo's names, date, time and venue. `catalog-opening.png` is a 480×1040 capture from this renderer with the shared `preview-sample.json` fixture for `osh`; it shows canonical preview content and the real source design. See `provenance.json` for source paths, hashes, font files and asset details. The adapted page places the source audio control outside its scroll surface so its fixed position works in the shared iframe.

## Contract mapping

- Invitation title → hero title; hosts/family names → hero and footer signoff.
- Localized greeting, including the personalized guest greeting → introduction heading; invitation message → introduction copy.
- Start date/time/timezone → localized date display and live countdown.
- Venue name, address/landmark and map URL → location card and safe external map link.
- First creator-uploaded gallery image → source's replaceable plate image; without uploads, the exact Palov illustration stays visible as template art. Preview gallery slots remain ephemeral and empty.
- Optional creator music → captured floating audio control, with playback starting only after a guest click and rejected playback handled.
- Phone and Telegram contacts → footer contact controls.
- RSVP enabled state and guest name/token → captured RSVP form and the real public RSVP endpoint; party count appears only for an affirmative response.
- Built-in labels and status messages support Uzbek Latin, Uzbek Cyrillic, English and Russian. Captured reveal behavior follows its original once-visible, 20%-threshold, 0.7-second ease-out motion; `prefers-reduced-motion` and preview QA flags reveal sections without motion.

The source has no native schedule, calendar action, multi-photo gallery, wishes, gift/to'yona, dress-code, or language-picker controls. The shared gift receipt-upload adapter creates a platform section before the footer when enabled; because Palov has no native `[data-section="toyona"]` section, it does not insert the receipt form into a source panel. Its optional Instagram footer link maps to the shared optional `contacts.instagramUrl` field and creator input; the default preserves older invitations without an Instagram value. Palov supports the `osh` event type and the `osh` category independently. The local integration suite verifies draft save/reopen, private publish rejection, and the public route, view and RSVP endpoints using disposable data. Keep the catalog entry private until publication is coordinated.
