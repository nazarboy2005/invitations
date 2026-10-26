import assert from "node:assert/strict";
import test from "node:test";
import {
  storyChapterState,
  storyLightRadius,
  storyPhotoFrame,
} from "../apps/web/src/components/celebration-story-motion";

test("the opening light expands from its centre and reveals every screen corner", () => {
  for (const [width, height] of [
    [375, 844],
    [1265, 720],
    [1920, 1080],
  ]) {
    assert(storyLightRadius(0, width, height) < 25);
    let previous = 0;
    for (let step = 0; step <= 100; step++) {
      const radius = storyLightRadius(step / 100, width, height);
      assert(radius >= previous);
      previous = radius;
    }
    // The opaque part of the feathered mask must reach the farthest corner.
    assert(
      storyLightRadius(1, width, height) * 0.89 >
        Math.hypot(width / 2, height * 0.51),
    );
    assert.equal(
      storyLightRadius(1, width, height),
      storyLightRadius(3.8, width, height),
    );
  }
});

test("every photo approaches continuously from the centre and grows toward the viewer", () => {
  for (const [width, height, count] of [
    [390, 844, 12],
    [1265, 720, 12],
    [1920, 1080, 12],
  ]) {
    for (let chapter = 0; chapter < 3; chapter++) {
      for (let index = 0; index < count; index++) {
        let previous = 0;
        for (let step = 0; step <= 500; step++) {
          const travel = -0.3 + (step * 4.2) / 500;
          const state = storyPhotoFrame({
            index,
            count,
            travel,
            chapter,
            drift: 0,
            width,
            height,
          });
          assert(Object.values(state).every(Number.isFinite));
          assert(
            state.scale >= previous,
            "scroll forward must never shrink an approaching photo",
          );
          assert(state.opacity >= 0 && state.opacity <= 1);
          previous = state.scale;
        }
        const distant = storyPhotoFrame({
          index,
          count,
          travel: -0.3,
          chapter,
          drift: 0,
          width,
          height,
        });
        assert.equal(distant.opacity, 0);
        assert(Math.abs(distant.x) < width * 0.1);
        assert(Math.abs(distant.y) < height * 0.1);
      }
    }
  }
});

test("reverse scroll retraces the same cylindrical path without recycling visible images", () => {
  const samples = Array.from({ length: 121 }, (_, i) => (i * 3.8) / 120);
  const frame = (travel: number) =>
    storyPhotoFrame({
      index: 4,
      count: 12,
      travel,
      chapter: 1,
      drift: 0,
      width: 1366,
      height: 768,
    });
  const forward = samples.map(frame);
  const backward = [...samples].reverse().map(frame).reverse();
  assert.deepEqual(backward, forward);
  for (let i = 1; i < forward.length; i++) {
    assert(forward[i].depth >= forward[i - 1].depth);
  }
});

test("each title has a readable hold and the final chapter releases completely", () => {
  for (const [chapter, travel] of [
    [0, 0.7],
    [1, 1.95],
    [2, 3.12],
  ]) {
    assert.equal(storyChapterState(travel, chapter).incoming, 1);
    assert.equal(storyChapterState(travel, chapter).outgoing, 0);
    assert.equal(storyChapterState(travel, chapter).opacity, 1);
  }
  assert.equal(storyChapterState(3.8, 2).opacity, 0);
});

test("phone cylinder stays circular when only the screen height changes", () => {
  for (let index = 0; index < 12; index++) {
    const params = {
      index,
      count: 12,
      travel: 0.9,
      chapter: 0,
      drift: 0,
      width: 375,
    };
    const tall = storyPhotoFrame({ ...params, height: 844 });
    const compact = storyPhotoFrame({ ...params, height: 640 });
    assert.equal(tall.x, compact.x);
    assert.equal(tall.y, compact.y);
    assert.equal(tall.scale, compact.scale);
  }
});

test("photos fade before the camera and never grow into full-screen sheets", () => {
  for (const width of [375, 1366]) {
    const max = width <= 700 ? 1.95 : 2.15;
    for (let index = 0; index < 12; index++) {
      for (let step = 0; step <= 100; step++) {
        const state = storyPhotoFrame({
          index,
          count: 12,
          travel: (step * 3.8) / 100,
          chapter: 0,
          drift: 0,
          width,
          height: 844,
        });
        assert(state.scale <= max);
        if (state.depth > 0.9) assert.equal(state.opacity, 0);
      }
    }
  }
});

test("all twelve photos approach in depth order while later photos emerge from the back", () => {
  for (let chapter = 0; chapter < 3; chapter++) {
    let previousPass = -1;
    for (let index = 0; index < 12; index++) {
      let pass = -1;
      let maximumOpacity = 0;
      for (let step = 0; step <= 1000; step++) {
        const travel = (step * 3.8) / 1000;
        const state = storyPhotoFrame({
          index,
          count: 12,
          travel,
          chapter,
          drift: 0,
          width: 390,
          height: 844,
        });
        if (pass < 0 && state.depth >= 0.5) pass = travel;
        maximumOpacity = Math.max(maximumOpacity, state.opacity);
      }
      assert(pass > previousPass + 0.05, "each photo must pass separately");
      assert(maximumOpacity > 0.45, "every photo must become readable");
      previousPass = pass;
    }
    const early = Array.from({ length: 12 }, (_, index) =>
      storyPhotoFrame({
        index,
        count: 12,
        travel: [0.15, 1.6, 2.75][chapter],
        chapter,
        drift: 0,
        width: 1280,
        height: 800,
      }),
    );
    assert(early[0].scale > early[11].scale * 4);
    assert.equal(early[11].opacity, 0, "back photos should not spill out at entry");
  }
});
