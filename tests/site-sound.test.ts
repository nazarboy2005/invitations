import { test } from "node:test";
import assert from "node:assert/strict";
import { createSoundProgress } from "../apps/web/src/components/site-sound-progress";
import {
  blockSiteSound,
  playSiteSound,
  quietSiteSound,
  resumeSiteSound,
  startSiteSound,
  siteSoundSamples,
} from "../apps/web/src/components/site-sound";

const cues = [
  { at: 0.2, sound: "water" },
  { at: 0.6, sound: "air" },
  { at: 0.8, sound: "silk" },
];
test("sound is inert before browser activation, including during server rendering", () => {
  assert.doesNotThrow(() => playSiteSound("water"));
});
test("reveals play once going forward, without scroll jitter repeats", () => {
  const follow = createSoundProgress(cues, 0.15);
  assert.equal(follow(0.1), undefined);
  assert.equal(follow(0.21), "water");
  assert.equal(follow(0.18), undefined);
  assert.equal(follow(0.22), undefined);
  follow(0.5);
  assert.equal(follow(0.61), "air");
});
test("fast scrolling consumes skipped cues without a backlog", () => {
  const follow = createSoundProgress(cues, 0.15);
  follow(0);
  assert.equal(follow(0.85), undefined);
  follow(0.1);
  assert.equal(follow(0.21), undefined);
  assert.equal(follow(0.9), undefined);
});
test("loading midway or browser activation later never catches up old cues", () => {
  const follow = createSoundProgress(cues, 0.15);
  assert.equal(follow(0.7), undefined);
  assert.equal(follow(0.81), "silk");
  follow(0.5);
  assert.equal(follow(0.61), undefined);
});

test("samples load once after interaction and never play late or over a preview", async () => {
  let starts = 0;
  let created = 0;
  let decodes = 0;
  const requests: string[] = [];
  const pending: Array<() => void> = [];
  const rates: number[] = [];
  const page = { hidden: false };
  const parameter = () => ({
    value: 0,
    setValueAtTime() {},
    linearRampToValueAtTime() {},
    cancelScheduledValues() {},
    setTargetAtTime() {},
  });
  const gain = () => ({
    connect(other: unknown) {
      return other;
    },
    disconnect() {},
    gain: parameter(),
  });
  const source = () => {
    const rate = { value: 0 };
    return {
      connect(other: unknown) {
        return other;
      },
      disconnect() {},
      start() {
        starts++;
        rates.push(rate.value);
      },
      stop() {},
      playbackRate: rate,
      onended: null,
    };
  };
  class FakeContext {
    currentTime = 0;
    state = "suspended";
    destination = {};
    constructor() {
      created++;
    }
    async resume() {
      this.state = "running";
    }
    async suspend() {
      this.state = "suspended";
    }
    async decodeAudioData() {
      decodes++;
      return { duration: 0.5 };
    }
    createGain = gain;
    createBufferSource = source;
  }
  let audio: FakeContext | undefined;
  const restore = new Map<string, PropertyDescriptor | undefined>();
  const mock = (name: string, value: unknown) => {
    restore.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value });
  };
  mock(
    "AudioContext",
    class extends FakeContext {
      constructor() {
        super();
        audio = this;
      }
    },
  );
  mock("document", page);
  mock("fetch", (url: string) => {
    requests.push(url);
    return new Promise((resolve) =>
      pending.push(() =>
        resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) }),
      ),
    );
  });
  try {
    playSiteSound("water");
    assert.equal(created, 0);
    assert.equal(requests.length, 0);
    const warming = startSiteSound();
    await Promise.resolve();
    assert.equal(created, 1);
    assert.equal(requests.length, 5);
    assert.ok(requests.every((url) => url.startsWith("/audio/site/")));
    playSiteSound("water");
    assert.equal(starts, 0);
    pending.forEach((finish) => finish());
    await warming;
    assert.equal(decodes, 5);
    assert.equal(starts, 0, "loading must not play a missed water cue");
    await startSiteSound();
    assert.equal(created, 1);
    assert.equal(requests.length, 5, "cached samples are never fetched twice");
    playSiteSound("water");
    assert.equal(starts, 1);
    playSiteSound("air");
    assert.equal(starts, 1, "cooldown prevents a burst");
    audio!.currentTime += 1;
    blockSiteSound(true);
    playSiteSound("air");
    assert.equal(starts, 1);
    blockSiteSound(false);
    page.hidden = true;
    playSiteSound("silk");
    assert.equal(starts, 1);
    quietSiteSound();
    assert.equal(audio!.state, "suspended");
    page.hidden = false;
    resumeSiteSound();
    assert.equal(audio!.state, "running");
    for (const cue of Object.keys(siteSoundSamples)) {
      audio!.currentTime += 2;
      const before = starts;
      playSiteSound(cue);
      assert.equal(starts, before + 1, cue);
    }
    const beforeRemoved = starts;
    audio!.currentTime += 2;
    playSiteSound("shimmer");
    assert.equal(starts, beforeRemoved, "removed synthesized cues cannot play");
    assert.ok(
      rates.every((rate) => rate === 1),
      "natural pitch for every cue",
    );
    quietSiteSound();
    assert.equal(audio!.state, "suspended");
    playSiteSound("water");
    assert.equal(starts, beforeRemoved);
  } finally {
    for (const [name, original] of restore) {
      if (original) Object.defineProperty(globalThis, name, original);
      else Reflect.deleteProperty(globalThis, name);
    }
  }
});
