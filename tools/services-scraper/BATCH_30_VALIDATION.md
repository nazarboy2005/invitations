# Additional 30 wedding halls — collection validation

Collected on 15 November 2026. These are private research drafts; the public directory still contains its original 20 wedding hall listings. Admin integration and publication were not part of this batch.

Subsequent publication: the user approved these 30 for the Services directory. They are now packaged in the application snapshot, with 153 local photos, bringing wedding halls to 50. See [the publication evidence](../../docs/services/maps-additions-publication.json). The collection findings below describe the original research stage; admin integration is still separate.

## Results

- Screened 52 distinct discovery candidates using business details. The final 30 all have a banquet-hall category, an address, a phone number and at least three selected photographs.
- Checked all 30 against the existing directory using phone, name and coordinates. No detected duplicates, shared phones, or locations within 180 m of an existing hall. No final pair shares a source ID/phone or lies within 180 m of another final hall.
- Combined 55 source records: 25 halls matched both Google and Yandex; five retained only Yandex information. No uncertain Google record was merged.
- Final statuses: 26 completed collection jobs, four with additional match-review flags (Osiyo Grand, Sadaf, Huvaydo, Ko‘kcha koshonasi). All 30 still require publication review; complete describes execution, not owner verification.
- Downloaded 178 photographs and visually excluded 25 guest/child portraits, unrelated shops/logos, unhelpful snapshots and duplicate-looking views. The 153 selected photos use Yandex only, one provider per hall, with 3–6 photos per gallery. Raw candidates and exclusion reasons remain available separately.
- Every selected image passed decoding, hash and dimension checks. Gallery policy is asserted by the verifier.
- Rendered all 30 reports: all 153 selected images loaded, gallery counts matched, and none of the business reports overflowed at a 390 px viewport. Inspected the overview and Seoul pricing render.
- 21 halls have at least one website/social/contact link. Descriptions and emails remain missing for all 30; nothing was invented.
- Transient source/image failures recovered on a serial resume. Final run has no failed or partial jobs.

## Price findings

- Seoul: source lists hall rental **from 25,000,000 UZS** and two banquet packages **390,000 / 450,000 UZS per guest**. Rental and per-person packages stay in separate categories/units. These are observed offers, not a confirmed full venue range.
- Sarbon: two event service offers, **450,000 and 2,500,000 UZS**, retained separately because their categories differ and the unit is unspecified.
- Bahor on Yunusota Street: **54 food-menu items**, grouped as mains, salads, bread and skewers. Food-item prices must not become the hall’s per-guest wedding price range.
- O‘zbegim: a **1 UZS** per-person entry was retained as raw evidence and flagged as a possible placeholder, excluded from derived ranges.
- Total: **60 observed product/service records across four halls**, including the excluded placeholder.

## Findings that changed selection or code

- Shirin and Zebu Zar occupy the same stated address, about 17 m apart, and their galleries include overlapping-looking buildings. This does not prove they are duplicates, but Shirin was held back until identity is confirmed. Toyxonachi Saroy replaced it in the final 30.
- Google name search can find a dental clinic, street, hotel or distant branch. Those candidates remained unmerged. Source names alone are insufficient.
- Added `--image-source single`, with fallback only when the preferred provider yields no usable image. A partly filled gallery never borrows photos from the other provider.
- Fixed explicit per-guest units in Yandex product titles, including Russian “на 1 гостя” and Uzbek Cyrillic “Киши бошига”. Hall capacity does not imply a per-person price.
- Added a 1-so‘m placeholder guard. The original amount remains in product evidence but cannot influence ranges. One-dollar items are not filtered by this rule.
- `npm test`: **25 passing tests**, including single-source/fallback behavior, placeholder prices and title-based unit extraction.

## Local artifacts

- [Open the 30-hall report](output/additional-30/collection/report.html)
- [Audit and per-hall coverage](output/additional-30/audit.json)
- [Final batch inputs](output/additional-30/inputs.json)
- [Image exclusions and reasons](output/additional-30/gallery-screening.json)
- [Held-back candidate](output/additional-30/held-back.json)
- [Integrity verification](output/additional-30/collection/verification.json)

All generated evidence/media remain local under Git-ignored `output/additional-30/`. Per-business reports link original Maps sources and contain conflicts, missing fields and price units. `media.images` is the screened gallery; `media.originalImages` and `media.excludedImages` preserve the unselected evidence. A future refresh can change source results, so visual screening must be repeated before publication.

## Final halls

| Hall                | Source records  | Selected photos | Collection status |
| ------------------- | --------------- | --------------: | ----------------- |
| Diamond Hall        | yandex + google |               4 | complete          |
| Tabassum to'yxonasi | yandex + google |               6 | complete          |
| Bahor               | yandex + google |               5 | complete          |
| Osiyo Grand         | yandex          |               6 | needs_review      |
| Версаль             | yandex + google |               5 | complete          |
| Oqshom              | yandex + google |               4 | complete          |
| Bisyor              | yandex + google |               6 | complete          |
| Parvoz              | yandex + google |               4 | complete          |
| Zamin               | yandex + google |               5 | complete          |
| Sadaf               | yandex          |               5 | needs_review      |
| Ummon               | yandex + google |               5 | complete          |
| Ofarin              | yandex + google |               6 | complete          |
| Dunyo Saroyi        | yandex + google |               4 | complete          |
| Huvaydo             | yandex + google |               6 | needs_review      |
| A'lo                | yandex + google |               5 | complete          |
| Yakka Saroy         | yandex + google |               6 | complete          |
| Royal rose          | yandex + google |               6 | complete          |
| Зебу зар            | yandex + google |               6 | complete          |
| Яшнабад             | yandex          |               6 | complete          |
| Ezidyor Gold        | yandex + google |               6 | complete          |
| Афруз               | yandex + google |               5 | complete          |
| Toyxonachi Saroy    | yandex + google |               3 | complete          |
| Seoul               | yandex + google |               6 | complete          |
| Sarbon              | yandex + google |               4 | complete          |
| Узбегим ресторан    | yandex + google |               6 | complete          |
| Olmos               | yandex + google |               6 | complete          |
| Дилором             | yandex + google |               3 | complete          |
| Ko‘kcha koshonasi   | yandex          |               6 | needs_review      |
| Бахор               | yandex          |               5 | complete          |
| Зухринисо           | yandex + google |               3 | complete          |
