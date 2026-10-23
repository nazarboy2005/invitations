# Published-template source-fidelity audit — batch 14

Date: 2026-10-23

## Database order

Read-only query through the configured application database returned 51
published templates ordered by ID. Positions 40–42 are:

| Position | Template | Price | Category | Supported event types |
| ---: | --- | ---: | --- | --- |
| 40 | Qog‘oz Turna (`qogoz-turna`) | 150,000 UZS | wedding | wedding |
| 41 | Retro Kino (`retro-kino`) | 150,000 UZS | wedding | wedding |
| 42 | Sahifa (`sahifa`) | 150,000 UZS | wedding | wedding |

These are the three rows after Qiz Bazmi and before Sahro Fonusi.

## Provider and source comparison

Searched the 13 provider capture manifests and the full local capture tree,
including E-invitation and every available provider folder. Marxaba is the only
provider whose manifest and capture tree contain exact complete sources for
these IDs: `Nikoh/templates/qogoz-turna`, `retro-kino`, and `sahifa`. No
alternate complete capture was found. Reference captures remain untouched.

- **Qog‘oz Turna:** The packaged body is byte-identical to the capture, and
  captured `template.css` and `meta.js` match. `template.js` differs only in
  the local shared-Three.js path. The paper-fold source motion and reduced-motion
  paths are preserved. Local Lora/Caveat font files and shared runtime
  dependencies are present. The 720×1280 catalog image is a clean portrait of
  the actual `#intro`, including the paper crane, fixture names/date, and open
  action. Confirmed fixture mismatch: the image shows 14 November 2026 at
  18:00, while the canonical preview fixture is 12 June 2027 at 17:00. Its
  provenance names the fixture but does not record a fixture hash. A separate
  repair task was created: `01a166e7-a16d-7792-8f08-1728210d0aed`.
- **Retro Kino:** Focused parity checks confirm the captured body, styling,
  motion source, metadata, and local fonts; documented adaptations are isolated
  to localization, the countdown mutation-observer guard, and optional contract
  fields. Reduced-motion branches are present. The catalog image is a
  byte-identical 941×1672 copy of `art/poster.webp`, a blank poster used by the
  later hero. The captured `#intro` is a different first page with film-leader
  art, greeting, credits, date, ticket, and opening action. The current catalog
  therefore omits the distinctive opening. A separate repair task was created:
  `01a166e7-6f15-7dd1-b956-b6f538dc89a6`.
- **Sahifa:** Focused source checks confirm the captured page, CSS, opening
  script, motion script, and local fonts are retained; the shared contract
  adapter maps the preview fixture and keeps it out of blank drafts. The current
  catalog image shows the later editorial hero with sample names/date, while
  the captured `#intro` has a separate greeting, decoded names, issue/date
  lockup, and “Sonni ochish” control. The capture contains no image assets or
  declared preview image, and the package has no cover provenance. The catalog
  image is not a documented capture of the distinctive opening. A separate
  repair task was created: `01a166e7-cb83-7761-ad08-c1783a7a0cab`.

## Preview and empty-gallery behavior

The canonical sample fixture is catalog/initial-selection-only; blank
invitations do not inherit its people or repeatable content. These sources have
no attributable source gallery photos to inject. The shared renderer hides a
creator-photo gallery when there is no usable uploaded image URL. A Retro Kino
test still asserted an obsolete older expression that kept blank icon cards in
the public gallery; I updated that assertion to verify the current empty-photo
rule instead.

## Verification and limits

Focused command:

```text
pnpm exec tsx --test tests/qogoz-turna-template.test.ts tests/retro-kino-template.test.ts tests/retro-kino-preview-contract.test.ts tests/sahifa-localization.test.ts tests/sahifa-preview-contract.test.ts
```

The initial focused run reported 21/22 because Retro Kino's old empty-gallery
assertion contradicted the shared public hide-empty-photo rule. After correcting
that stale assertion, the focused run passed 22/22. The separate Retro Kino
cover follow-up then tightened the cover test to require genuine `#intro`
capture provenance; the current poster-copy image correctly fails that new
gate. The current focused result is therefore 21/22, with the sole failure
tracking the unresolved confirmed cover defect. The other source-parity checks
inspect HTML/CSS/JavaScript, local fonts, motion/reduced-motion code, preview
fixtures, and existing cover provenance. Catalog images were visually
inspected. Fresh browser animation/interaction runs were not performed in this
audit because local browser control is disabled in Work settings.

Separate repair tasks were created for the three confirmed catalog findings.
Qog‘oz Turna's permitted screenshot interface did not expose a savable rendered
image. Retro Kino and Sahifa can be viewed through their supported browser
surfaces, but those surfaces cannot save a clean iframe-only portrait capture;
an alternate automation export was not used. All three original covers remain
unchanged and require a permitted capture path. No source capture, database,
publication, deployment, or payment state changed.
