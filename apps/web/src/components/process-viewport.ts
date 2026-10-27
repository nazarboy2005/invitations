export type ProcessViewport = { width: number; height: number };

/** Phone browser bars must not add/remove the pin's scroll spacer mid-gesture. */
export function stableProcessViewport(
  previous: ProcessViewport | undefined,
  next: ProcessViewport,
  phone: boolean,
) {
  return phone && previous?.width === next.width ? previous : next;
}
