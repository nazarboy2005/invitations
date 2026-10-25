import assert from "node:assert/strict";
import test from "node:test";
import {
  occasionCaption,
  occasionLayout,
} from "../apps/web/src/components/occasion-orbit-layout";

test("phones and laptops exchange the same four orbit positions", () => {
  for (const [width, height] of [
    [305, 568],
    [375, 844],
    [1009, 768],
    [1351, 768],
  ]) {
    const layout = occasionLayout(width, height);
    const destination = [1, 3, 0, 2];
    layout.angles.forEach((angle, index) => {
      const next = layout.angles[destination[index]];
      assert(
        Math.abs(Math.cos(angle + layout.rotation) - Math.cos(next)) < 1e-10,
      );
      assert(
        Math.abs(Math.sin(angle + layout.rotation) - Math.sin(next)) < 1e-10,
      );
    });
  }
});

test("a caption moves continuously to the current side, including across both poles", () => {
  for (const start of [-135, -45, 135, 45]) {
    let previous = occasionCaption((start * Math.PI) / 180, 196, 30, 157);
    for (let step = 1; step <= 10000; step++) {
      const angle = ((start + (step * 90) / 10000) * Math.PI) / 180;
      const current = occasionCaption(angle, 196, 30, 157);
      assert(current.side >= -1 && current.side <= 1);
      assert(Math.abs(current.side - previous.side) < 0.01);
      assert(Math.abs(current.y - previous.y) < 2);
      assert(Math.abs(current.scale - previous.scale) < 0.01);
      if (Math.abs(Math.cos(angle)) >= 0.28)
        assert.equal(current.side, Math.sign(Math.cos(angle)));
      previous = current;
    }
  }
});

test("labels clear the central jewel while crossing underneath/above their photos", () => {
  for (const [width, height, label] of [
    [1351, 768, 30],
    [1009, 768, 24],
    [1905, 1080, 34],
  ]) {
    const layout = occasionLayout(width, height);
    const top = occasionCaption(
      -Math.PI / 2,
      layout.artwork,
      label,
      layout.radiusY,
    );
    const bottom = occasionCaption(
      Math.PI / 2,
      layout.artwork,
      label,
      layout.radiusY,
    );
    assert(Math.abs(top.side) < 1e-10);
    assert(Math.abs(bottom.side) < 1e-10);
    assert.equal(top.flourish, 0);
    assert.equal(bottom.flourish, 0);
    assert(top.y + label / 2 <= layout.radiusY - 31 - 5.9);
    assert(-bottom.y + label / 2 <= layout.radiusY - 31 - 5.9);
  }
});
