export type PaperBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** Use existing gallery whitespace; never add height to fit an open sheet. */
export function paperOpenLayout(
  paper: PaperBox,
  area: PaperBox,
  bounds: PaperBox,
  neighbors: PaperBox[],
) {
  const gap = 12;
  const cx = paper.left + paper.width / 2;
  const cy = paper.top + paper.height / 2;
  let left = bounds.left + gap;
  let right = bounds.left + bounds.width - gap;
  let top = area.top;
  let bottom = area.top + area.height;
  for (const neighbor of neighbors) {
    const nx = neighbor.left + neighbor.width / 2;
    const ny = neighbor.top + neighbor.height / 2;
    // A square the original sheet's width conservatively encloses the ball.
    // Same-row balls limit width; balls above/below limit height on phones.
    if (Math.abs(ny - cy) < 1) {
      if (nx < cx) left = Math.max(left, nx + neighbor.width / 2 + gap);
      if (nx > cx) right = Math.min(right, nx - neighbor.width / 2 - gap);
    } else if (Math.abs(nx - cx) < 1) {
      if (ny < cy) top = Math.max(top, ny + neighbor.width / 2 + gap);
      if (ny > cy) bottom = Math.min(bottom, ny - neighbor.width / 2 - gap);
    }
  }
  const scale = Math.max(
    1,
    Math.min((right - left) / paper.width, (bottom - top) / paper.height),
  );
  const half = (paper.width * scale) / 2;
  const centerX = Math.max(left + half, Math.min(right - half, cx));
  const halfHeight = (paper.height * scale) / 2;
  const centerY = Math.max(top + halfHeight, Math.min(bottom - halfHeight, cy));
  return { scale, shiftX: centerX - cx, shiftY: centerY - cy };
}

/** Grow near the flat pose, after the previously open sheet has folded away. */
export function paperExpansion(progress: number) {
  const t = Math.max(0, Math.min(1, 1 - progress / 0.25));
  return t * t * (3 - 2 * t);
}
