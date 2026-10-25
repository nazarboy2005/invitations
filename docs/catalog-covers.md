# Catalog covers

The homepage and `/templates` share Visol navigation. The homepage selection is
Anor, Bog‘i Eram, Cloud Castle, Ganch, Kuzgi Chinor, Nahor, Yangi Uy and Shirin
Bayram, in that order; unpublished entries are omitted without substitutions.

All 53 existing public cover images were reviewed as portrait contact sheets.
Eleven weaker openings were replaced with actual settled production-renderer
screenshots, captured at 480×800 (the cards' 3:5 aspect ratio):

| Template | Selected scene |
| --- | --- |
| Atlas | Open textile layout with large names |
| Bog‘i Eram | Fully opened garden with both names completely revealed and opaque |
| Doira | Illuminated courtyard after the drum opening |
| Ganch | Sunny Bukhara courtyard after the doors open |
| Monogram | Complete ivory typographic invitation |
| Muhr | Floral arch and reflecting pool after the seal opens |
| Nahor | Uncovered pilaf with names and date |
| O‘rik Guli | Blossom valley and complete names after the window opens |
| Parda | Open embroidered curtains framing the evening table |
| Qatlam | Fully unfolded architectural paper scene |
| Yangi Uy | House, welcome heading, family and date after opening |

Other existing images were retained. Additional opened candidates for Cloud
Castle, Bulbul, Muhabbat Kitobi and Qog‘oz Turna were compared but not selected:
their current covers better preserve the full composition or distinctive opening.
This is an editorial image review, not a new end-to-end audit of every template.

`apps/web/src/modules/catalog/catalog-covers.ts` selects the new files through
`templatePoster`. Home/catalog cards, detail posters and studio choices use the
same helper. Source captures, historical cover files and shared contract preview
metadata are untouched. No additional animation, capture code or renderer runs
on listing pages. Eleven lazy-loaded WebPs total 798,424 bytes, each under 120 KB.

## Choosing another frame

Use a local production server and open
`/preview?template=ganch&poster=1` at 480×800. This preview-only mode ignores
drafts, uses the canonical sample in one locale, disables sample music and hides
app preview actions. Add `&card=1` to trigger the existing automatic catalog
opening; otherwise interact with the real invitation normally. Wait until its
opening is complete and inspect the result before capturing. For special
gestures, Nahor needs a pot-lid click and Qatlam a downward book drag.

Save the clean viewport screenshot, encode WebP without changing its framing,
and replace the matching versioned cover asset (or use a new filename and update
the map). Record the state/action, hash and size in `catalog-cover-captures.json`.
Normal previews/public invitations retain their normal locales and controls.

The user can identify a preferred frame with either a screenshot plus template
name, or a time measured **after opening** plus any scroll/interaction. A
screenshot is more reliable than seconds because loading time varies.

Follow-up: the catalog navbar uses the same transparent background as the home
navbar, at the top and while scrolling. Bog‘i Eram's former garden-only image
was replaced after checking both name spans and their parent at opacity 1 with
no remaining name transforms. Its detailed garden uses WebP quality 86;
other cover encodings remain unchanged.

Original PNG captures and before-review contact sheets are local QA files under
`test-results/`; shipped WebPs and their capture provenance are in the workspace.

Validation: five focused selection/cover checks pass, web typecheck and final
production build pass (20 static pages generated). Desktop 1366×768 and phone
390×844 checked; the mobile menu opens/dismisses and its Marosimlar link selects
the four published osh designs. No phone horizontal overflow. The exact eight
homepage IDs and new poster URLs were verified in the rendered DOM. A temporary
development hot-refresh warning about the changed hook dependency count occurred
while adding capture mode; it is not a production build error.
