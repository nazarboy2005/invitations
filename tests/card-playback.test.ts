import assert from "node:assert/strict";
import test from "node:test";
import { selectViewportCard } from "../apps/web/src/modules/catalog/card-playback-policy";

test("touch scrolling plays one centered card and switches to the next row", () => {
  const row = [
    { id: "anor", top: 200, bottom: 485, height: 285 },
    { id: "atlas", top: 200, bottom: 485, height: 285 },
    { id: "beshik", top: 750, bottom: 1035, height: 285 },
  ];
  assert.equal(selectViewportCard(row, 844), "anor");
  assert.equal(
    selectViewportCard(
      row.map((card) => ({
        ...card,
        top: card.top - 550,
        bottom: card.bottom - 550,
      })),
      844,
    ),
    "beshik",
  );
});

test("cards leaving the screen stop; barely visible and empty openings never start", () => {
  assert.equal(
    selectViewportCard(
      [
        { id: "above", top: -200, bottom: 85, height: 285 },
        { id: "below", top: 800, bottom: 1085, height: 285 },
        { id: "empty", top: 400, bottom: 400, height: 0 },
      ],
      844,
    ),
    null,
  );
  assert.equal(selectViewportCard([], 844), null);
});

test("tablet scrolling favors the closest fully visible opening", () => {
  assert.equal(
    selectViewportCard(
      [
        { id: "top", top: 30, bottom: 315, height: 285 },
        { id: "middle", top: 400, bottom: 685, height: 285 },
      ],
      1180,
    ),
    "middle",
  );
});
