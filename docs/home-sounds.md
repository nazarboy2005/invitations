# Visol interaction sounds

These are short samples rather than runtime-generated tones/noise. No music,
shimmer, rising notes or per-photo sound. Default-on behavior has no toggle;
the browser still requires normal user interaction to unlock audio.

| Cue | Sample | Mix gain | Trigger |
| --- | --- | --- | --- |
| Water | SoundJay Water Droplet 01 | 0.26 | Water impact at orbit progress 0.18 |
| Fabric | OwlStorm Blanket Movement 6 | 0.12 | Four-image reveal at 0.66 |
| Feature sweep | Same fabric sample, faded over 0.55 s | 0.07 | Each incoming Why us photograph at 8% of its covering reveal |
| Air | Slower, softened excerpt of the same fabric recording | 0.09 | Each of the three cylinder chapter entrances |
| Card | filmfan87 card placed on table | 0.16 | Each process marker, same pitch |
| Paper | Mixkit Paper slide 1530 | 0.13 | Template details opening |

The air pass uses recorded fabric movement rather than the previously proposed
Wyzowl sound: that library describes its assets as synthesized. This keeps the
palette grounded in physical materials. Fabric is actual cloth, not claimed to
be a silk recording. The preview cue is recorded sliding paper, not claimed to
be a recording of an envelope.

Five mono 44.1 kHz / 80 kbps MP3s total 35,747 bytes. Source excerpts are trimmed,
filtered to reduce rumble/harshness, peak-adjusted, and faded at their edges.
There is no pitch progression or oscillator-based effect. Source credits,
download locations, hashes, and exact processing are in home-sound-sources.json.
OwlStorm and filmfan87 sources are CC0; SoundJay and Mixkit permit use in projects
under their respective terms. Assets are part of Visol, not a sound download library.

One shared AudioContext fetches and decodes samples once after interaction.
Cues never await a fetch: if a sample is not ready, that occurrence stays silent.
Hidden tabs and template previews suppress effects. Preview opening permits
only its paper cue before blocking subsequent page effects. Fast/reverse scroll
does not enqueue or repeat consumed cues; a shared cooldown prevents bursts.

Verification: unit checks cover lazy loading, cache reuse, cue consumption,
no playback after delayed loading, fixed pitch, cooldown, preview suppression,
and hidden-tab suspension. MP3s are decoded and checked for duration/peak level.
Listening on target speakers/headphones remains a subjective mix review; automated
checks cannot establish whether an effect sounds elegant to a listener.
