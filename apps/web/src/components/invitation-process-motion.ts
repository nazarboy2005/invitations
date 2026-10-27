const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function invitationProcessProgress(phase: number, pinned: boolean) {
  return clamp(pinned ? (phase - 0.08) / 0.76 : phase);
}

export function invitationStepState(
  progress: number,
  index: number,
  started = true,
) {
  if (!started) return { unlock: 0, focus: 0, active: false };
  // Finish the short reveal as the ball reaches the marker, including marker 03.
  const arrival = clamp((progress * 2 - index + 0.12) / 0.12);
  const unlock = index === 0 ? 1 : arrival * arrival * (3 - 2 * arrival);
  return {
    unlock,
    focus: Math.max(0, 1 - Math.abs(progress * 2 - index)) * unlock,
    active: index === Math.min(2, Math.floor(progress * 2 + 0.001)),
  };
}
