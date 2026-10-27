import assert from "node:assert/strict";
import { test } from "node:test";
import {
  invitationProcessProgress,
  invitationStepState,
} from "../apps/web/src/components/invitation-process-motion";

test("the pinned sequence holds at its start and end, and clamps overscroll", () => {
  assert.equal(invitationProcessProgress(-1, true), 0);
  assert.equal(invitationProcessProgress(0.08, true), 0);
  assert.equal(invitationProcessProgress(0.46, true), 0.5);
  assert.equal(invitationProcessProgress(0.84, true), 1);
  assert.equal(invitationProcessProgress(0.9, true), 1);
  assert.equal(invitationProcessProgress(2, true), 1);
});

test("upcoming steps stay off and every step is fully on at its marker", () => {
  assert.equal(invitationStepState(0, 1).unlock, 0);
  assert.equal(invitationStepState(0.5, 2).unlock, 0);
  for (const [index, progress] of [
    [0, 0],
    [1, 0.5],
    [2, 1],
  ]) {
    assert.deepEqual(invitationStepState(progress, index), {
      unlock: 1,
      focus: 1,
      active: true,
    });
  }
  assert.equal(invitationStepState(1, 0).unlock, 1);
});

test("all steps stay off before pinning and relock when scrolling above it", () => {
  const off = { unlock: 0, focus: 0, active: false };
  for (const index of [0, 1, 2]) {
    assert.deepEqual(invitationStepState(0, index, false), off);
  }
  assert.deepEqual(invitationStepState(0, 0, true), {
    unlock: 1,
    focus: 1,
    active: true,
  });
  assert.deepEqual(invitationStepState(0, 0, false), off);
});

test("scrolling backward returns the same state and relocks upcoming steps", () => {
  const progress = [0, 0.47, 0.5, 0.97, 1];
  const forward = progress.map((p) =>
    [0, 1, 2].map((i) => invitationStepState(p, i)),
  );
  const backward = [...progress]
    .reverse()
    .map((p) => [0, 1, 2].map((i) => invitationStepState(p, i)));
  assert.deepEqual(backward.reverse(), forward);
  assert.equal(invitationStepState(0.47, 1).unlock > 0, true);
  assert.equal(invitationProcessProgress(0.5, false), 0.5);
});
