// Enabled by default. Samples are fetched/decoded only after normal interaction.
export const siteSoundSamples = {
  water: { file: "water-drop.mp3", gain: 0.26 },
  silk: { file: "fabric-reveal.mp3", gain: 0.12 },
  sweep: { file: "fabric-reveal.mp3", gain: 0.07, duration: 0.55 },
  air: { file: "air-pass.mp3", gain: 0.09 },
  card: { file: "card-place.mp3", gain: 0.16 },
  paper: { file: "paper-slide.mp3", gain: 0.13 },
} as const;
export type SiteSound = keyof typeof siteSoundSamples;
let context: AudioContext | undefined;
let blocked = false;
let lastCue = -Infinity;
const buffers = new Map<string, AudioBuffer>();
const loading = new Map<string, Promise<void>>();
const voices = new Map<AudioBufferSourceNode, GainNode>();

function hush(immediate = false) {
  if (!context) return;
  for (const [source, envelope] of voices) {
    envelope.gain.cancelScheduledValues(context.currentTime);
    envelope.gain.setTargetAtTime(0, context.currentTime, 0.01);
    source.stop(context.currentTime + (immediate ? 0 : 0.05));
  }
}

export function blockSiteSound(value: boolean, fade = true) {
  blocked = value;
  if (value && fade) hush();
}

function warmSample(cue: SiteSound, audio: AudioContext) {
  const file = siteSoundSamples[cue].file;
  if (buffers.has(file)) return Promise.resolve();
  const pending = loading.get(file);
  if (pending) return pending;
  const load = (async () => {
    try {
      const response = await fetch(`/audio/site/${file}`);
      if (!response.ok) return;
      const buffer = await audio.decodeAudioData(await response.arrayBuffer());
      buffers.set(file, buffer);
    } catch {
      // A missing sample or unsupported codec never affects the animation.
    } finally {
      loading.delete(file);
    }
  })();
  loading.set(file, load);
  return load;
}

export async function startSiteSound() {
  try {
    context ??= new AudioContext();
    if (context.state !== "running") await context.resume();
    if (context.state !== "running" || document.hidden) return;
    await Promise.all(
      (Object.keys(siteSoundSamples) as SiteSound[]).map((cue) =>
        warmSample(cue, context!),
      ),
    );
  } catch {
    // Browser autoplay restrictions or unavailable audio never block the page.
  }
}

export function quietSiteSound() {
  hush(true);
  void context?.suspend().catch(() => {});
}

export function resumeSiteSound() {
  if (!document.hidden) void context?.resume().catch(() => {});
}

/** Play only a ready sample at its cue. Never queue playback behind a fetch. */
export function playSiteSound(cue: SiteSound | string | undefined) {
  if (
    !cue ||
    !Object.hasOwn(siteSoundSamples, cue) ||
    blocked ||
    !context ||
    context.state !== "running" ||
    document.hidden
  )
    return;
  const name = cue as SiteSound;
  const sample = siteSoundSamples[name];
  const buffer = buffers.get(sample.file);
  if (!buffer) return;
  const now = context.currentTime;
  if (now - lastCue < 0.48) return;
  lastCue = now;
  const source = context.createBufferSource();
  const envelope = context.createGain();
  source.buffer = buffer;
  source.playbackRate.value = 1;
  if ("duration" in sample) {
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(sample.gain, now + 0.025);
    envelope.gain.setValueAtTime(sample.gain, now + sample.duration - 0.12);
    envelope.gain.linearRampToValueAtTime(0, now + sample.duration);
  } else envelope.gain.setValueAtTime(sample.gain, now);
  source.connect(envelope).connect(context.destination);
  voices.set(source, envelope);
  source.onended = () => {
    voices.delete(source);
    source.disconnect();
    envelope.disconnect();
  };
  source.start(now);
  if ("duration" in sample) source.stop(now + sample.duration);
}
