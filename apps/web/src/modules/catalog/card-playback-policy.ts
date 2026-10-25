export type VisibleCard = {
  id: string;
  top: number;
  bottom: number;
  height: number;
};

/** A single mostly visible opening nearest the viewport center wins. */
export function selectViewportCard(
  cards: VisibleCard[],
  viewportHeight: number,
) {
  let best: string | null = null;
  let distance = Infinity;
  for (const card of cards) {
    const shown = Math.min(card.bottom, viewportHeight) - Math.max(card.top, 0);
    if (card.height <= 0 || shown < card.height * 0.6) continue;
    const nextDistance = Math.abs(
      (card.top + card.bottom) / 2 - viewportHeight / 2,
    );
    if (nextDistance < distance) {
      best = card.id;
      distance = nextDistance;
    }
  }
  return best;
}
