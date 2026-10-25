import assert from "node:assert/strict";
import test from "node:test";
import {
  waterFrame,
  waterResolution,
} from "../apps/web/src/components/occasion-water-motion";

test("drop reaches the surface before the rebound; labels wait for the orb", () => {
  const top = waterFrame(0, 768, false);
  const falling = waterFrame(0.12, 768, false);
  const contact = waterFrame(0.18, 768, false);
  assert(top.dropY < falling.dropY && falling.dropY < contact.dropY);
  assert(Math.abs(contact.dropY + contact.radius - contact.surfaceY) < 0.001);
  assert.equal(contact.release, 0);
  const rebound = waterFrame(0.38, 768, false);
  assert(rebound.stemWidth > 0 && rebound.radius > 0);
  assert(rebound.dropY < rebound.surfaceY);
  assert.equal(rebound.release, 0);
  const separated = waterFrame(0.5, 768, false);
  assert.equal(separated.stemWidth, 0);
  assert.equal(separated.release, 0);
  const orb = waterFrame(0.625, 768, false);
  assert.equal(orb.dropY, 0);
  assert.equal(orb.radius, 9);
  assert.equal(orb.handoff, 1);
  assert.equal(orb.waterOpacity, 0);
  assert.equal(orb.release, 0);
  assert(waterFrame(0.7, 768, false).release > 0);
  assert.equal(waterFrame(0.79, 768, false).release, 1);
  assert.equal(waterFrame(0.79, 768, false).orbit, 0);
});

test("phase boundaries stay continuous and reversing scroll needs no history", () => {
  for (const phone of [false, true]) {
    for (const boundary of [0.18, 0.25, 0.4, 0.46, 0.6, 0.625, 0.79, 0.96]) {
      const before = waterFrame(boundary - 0.000001, 844, phone);
      const after = waterFrame(boundary + 0.000001, 844, phone);
      for (const field of [
        "dropY",
        "radius",
        "stemTop",
        "stemWidth",
      ] as const) {
        assert(
          Math.abs(before[field] - after[field]) < 0.1,
          `${field} jumps at ${boundary}`,
        );
      }
    }
    const forward = Array.from({ length: 101 }, (_, i) =>
      waterFrame(i / 100, 844, phone),
    );
    const reverse = Array.from({ length: 101 }, (_, i) =>
      waterFrame((100 - i) / 100, 844, phone),
    ).reverse();
    assert.deepEqual(forward, reverse);
  }
});

test("render targets stay within pixel budgets on phones and large screens", () => {
  for (const [width, height, phone] of [
    [390, 844, true],
    [320, 568, true],
    [1366, 768, false],
    [3840, 2160, false],
  ] as const) {
    const pixels = waterResolution(width, height, phone);
    assert(pixels.width * pixels.height <= (phone ? 180_000 : 440_000));
    assert(pixels.width <= width && pixels.height <= height);
    const smaller = waterResolution(width, height, phone, 0.5);
    assert(smaller.width * smaller.height <= (phone ? 90_000 : 220_000));
    const resting = waterFrame(1, height, phone);
    assert.equal(resting.radius, phone ? 7 : 9);
  }
});
