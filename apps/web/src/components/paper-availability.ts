export type PaperAvailability = { ready: number[]; failed: boolean };
export type PaperStatus = "ready" | "failed";
export type PaperAvailabilityAction =
  { id: number; status: PaperStatus } | { status: "reset" };

export const initialPaperAvailability: PaperAvailability = {
  ready: [],
  failed: false,
};

export function recordPaperAvailability(
  state: PaperAvailability,
  action: PaperAvailabilityAction,
): PaperAvailability {
  if (action.status === "reset") return initialPaperAvailability;
  if (action.status === "failed") return { ready: [], failed: true };
  if (state.failed || state.ready.includes(action.id)) return state;
  return { ready: [...state.ready, action.id], failed: false };
}

export function paperGalleryMode(
  state: PaperAvailability,
  total: number,
  reduced: boolean,
) {
  if (reduced || state.failed) return "static";
  return state.ready.length === total ? "animated" : "loading";
}
