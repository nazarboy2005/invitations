# Progressive full-preview loading

## Behavior

Full previews retain the minimal spinner, then reveal once the opening content,
fonts, images, CSS backgrounds and any opening video poster/first frame are ready.
They no longer wait for the iframe's full `load` event or the music API. Critical
asset waiting has a four-second fallback after renderer initialization, rather
than a fixed delay. Renderer scripts still need to download and initialize.

The shared `TemplateFrame` initializes after DOMContentLoaded, and retains a
load-time data resend for source runtimes that install listeners at window.load.
It respects bridges that hide the body while loading their own motion script.
Invitate/Safir receive their initial window.name data without a redundant reload.
No captured template source or animation design was changed.

After opening, lazy images within two viewport heights are requested ahead of
scrolling. The observer uses the frame's Document as its explicit root so the
outer iframe does not clip the lookahead area. Dynamic gallery images are included.

The gallery warms the complete music-library list into a five-minute session cache.
A preview selects once, immediately, from that cache. Direct visits without a
cached list select from the bundled library while fetching the full list for
subsequent openings. This avoids late track switching or renderer reloads and
preserves creator-selected/uploaded music. StrictMode's canceled effect does not
consume a selection. Template switching cannot reveal the previous document as
the next template's ready state.

## Verification

- `pnpm --filter @taklifnoma/web exec tsc --noEmit`: passed.
- `node tests/preview-loading.browser.cjs`: passed. Holds opening artwork,
  music API and an offscreen eager image independently. Checks the opening is
  gated on its artwork; the invitation is revealed with music/later media still
  pending and frame readyState still interactive; authored labels are populated;
  newly inserted lazy images load ahead; the current music does not change when
  the list arrives; the next opening uses the refreshed library. Also smoke-tests
  Invitate Wedding, Golden Hour, Safir, Butterfly, Yulduzli Tun, Fayzli Xonadon,
  Zarrin Do'ppi and Islamic Edition. Invitate/Safir use one document navigation.
- `node tests/preview-guest-actions.browser.cjs`: passed across Anor, Atlas,
  Oq Kabutar, Stained Glass, Velvet Royale and Pulau Sehati. Native calendar
  downloads and creator music/content remain intact.
- `pnpm exec tsx --test tests/catalog-music.test.ts tests/anor-public-initialization.test.ts`:
  3 passed.
- The additional existing `preview-sample.test.ts` run had 19 passes and three
  failures in blank-draft classification (Love Sakura, Glass Pink and the generic
  empty-template case). Its fixture, classification logic and contract inputs are
  unchanged by this task; these failures are outside loading behavior.
- `git diff --check`: passed.

## Phone animation performance

This change addresses startup dependencies. It does not claim to fix animation
frame rate on physical medium-range phones. Source review found continuous
particle rendering, canvas backing surfaces capped at device pixel ratio 2, and
layered animated/shadow effects. These are profiling candidates, not measured
causes of the reported lag. A subsequent performance pass should measure opening
and scrolling separately before tuning those effects. No application deployment
was performed.
