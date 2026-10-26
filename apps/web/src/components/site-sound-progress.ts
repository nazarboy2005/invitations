/** Consume crossed cues even when muted or skipped. Reverse scrolling never
 * replays a reveal; returning to the section cannot produce a burst of sound. */
export function createSoundProgress(
  cues: readonly { at: number; sound: string }[],
  maxJump: number,
) {
  let previous: number | undefined;
  const consumed = new Set<number>();
  return (progress: number): string | undefined => {
    const from = previous;
    previous = progress;
    let sound: string | undefined;
    cues.forEach((cue, index) => {
      if (progress < cue.at || consumed.has(index)) return;
      consumed.add(index);
      if (from !== undefined && from < cue.at && progress - from <= maxJump)
        sound = cue.sound;
    });
    return sound;
  };
}
