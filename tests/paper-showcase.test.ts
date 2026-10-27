import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import { paperInteractions } from "../apps/web/src/components/paper-interactions";
import { paperEase } from "../apps/web/src/components/paper-reveal-motion";
import {
  initialPaperAvailability,
  paperGalleryMode,
  recordPaperAvailability,
} from "../apps/web/src/components/paper-availability";
import { loadPaperBytes } from "../apps/web/src/components/paper-data";
import {
  paperExpansion,
  paperOpenLayout,
} from "../apps/web/src/components/paper-layout";

test("enlargement starts only when every paper rendered and any failure makes the whole gallery static", () => {
  let state = initialPaperAvailability;
  for (const id of [1, 2, 3]) {
    state = recordPaperAvailability(state, { id, status: "ready" });
    assert.equal(paperGalleryMode(state, 4, false), "loading");
  }
  state = recordPaperAvailability(state, { id: 4, status: "ready" });
  assert.equal(paperGalleryMode(state, 4, false), "animated");
  assert.equal(paperGalleryMode(state, 4, true), "static");
  state = recordPaperAvailability(state, { id: 2, status: "failed" });
  assert.equal(paperGalleryMode(state, 4, false), "static");
  state = recordPaperAvailability(state, { id: 2, status: "ready" });
  assert.equal(
    paperGalleryMode(state, 4, false),
    "static",
    "late ready callbacks cannot undo a GPU failure",
  );
});

test("missing or unsupported native decompression uses identical unpacked geometry", async () => {
  const compressed = readFileSync(
    "apps/web/public/images/home/paper/crumple.bin",
  );
  const raw = readFileSync("apps/web/public/images/home/paper/crumple.raw.bin");
  assert.deepEqual(raw, inflateRawSync(compressed));
  for (const reason of [
    new ReferenceError("DecompressionStream unavailable"),
    new TypeError("deflate-raw unsupported"),
  ]) {
    const requests: string[] = [];
    const result = await loadPaperBytes(
      async (path) => {
        requests.push(path);
        return path.endsWith("raw.bin") ? raw : compressed;
      },
      async () => {
        throw reason;
      },
    );
    assert.deepEqual(result, raw);
    assert.deepEqual(requests, [
      "/images/home/paper/crumple.bin",
      "/images/home/paper/crumple.raw.bin",
    ]);
  }
  const requests: string[] = [];
  await loadPaperBytes(
    async (path) => {
      requests.push(path);
      return compressed;
    },
    async (bytes) => inflateRawSync(bytes),
  );
  assert.equal(
    requests.length,
    1,
    "modern browsers keep the smaller compressed download",
  );
});

test("open sheets grow inside the original compact gallery without touching folded neighbors", () => {
  for (const viewport of [320, 375, 390, 700, 701, 1024, 1440, 1920]) {
    const phone = viewport <= 700;
    const columns = phone ? 2 : 4;
    const container = Math.min(1220, viewport - (phone ? 32 : 64));
    const grid = Math.min(phone ? 365 : 1100, container);
    const gap = phone ? 35 : Math.min(65, Math.max(28, viewport * 0.04));
    const slotWidth = Math.min(
      phone ? 140 : Infinity,
      (grid - gap * (columns - 1)) / columns,
    );
    const width = phone ? Math.min(120, slotWidth) : slotWidth;
    const height = (width * 16) / 9;
    const rowHeight = height;
    const start = (viewport - grid) / 2;
    const papers = Array.from({ length: 4 }, (_, i) => ({
      left:
        start +
        (i % columns) * ((grid - gap * (columns - 1)) / columns + gap) +
        ((grid - gap * (columns - 1)) / columns - width) / 2,
      top:
        Math.floor(i / columns) * (rowHeight + 24) + (rowHeight - height) / 2,
      width,
      height,
    }));
    papers.forEach((paper, index) => {
      // Only existing title-to-paper spacing and section bottom padding are used.
      const area = {
        left: 0,
        top: -(phone ? 32 : 55) + 12,
        width: viewport,
        height:
          height * (phone ? 2 : 1) +
          (phone ? 24 : 0) +
          (phone ? 32 + 45 : 55 + 75) -
          24,
      };
      const bounds = {
        left: 0,
        top: 0,
        width: viewport,
        height: rowHeight * 2 + 24,
      };
      const { scale, shiftX, shiftY } = paperOpenLayout(
        paper,
        area,
        bounds,
        papers.filter((_, i) => i !== index),
      );
      assert.ok(scale > 1.1, `${viewport}px: paper ${index} should be larger`);
      const left = paper.left + width / 2 + shiftX - (width * scale) / 2;
      const right = left + width * scale;
      const top = paper.top + height / 2 + shiftY - (height * scale) / 2;
      const bottom = top + height * scale;
      assert.ok(
        left >= bounds.left + 12 - 0.001 &&
          right <= bounds.left + bounds.width - 12 + 0.001,
      );
      assert.ok(
        top >= area.top - 0.001 && bottom <= area.top + area.height + 0.001,
      );
      for (const [otherIndex, other] of papers.entries()) {
        if (otherIndex === index) continue;
        const foldedTop = other.top + height / 2 - width / 2;
        assert.ok(
          right <= other.left - 12 + 0.001 ||
            left >= other.left + other.width + 12 - 0.001 ||
            bottom <= foldedTop - 12 + 0.001 ||
            top >= foldedTop + width + 12 - 0.001,
        );
      }
    });
  }
});

test("enlargement waits until the paper is almost flat and reverses immediately", () => {
  assert.equal(paperExpansion(1), 0);
  assert.equal(paperExpansion(0.25), 0);
  assert.equal(paperExpansion(0), 1);
  assert.equal(paperExpansion(0.125), 0.5);
});

function setup() {
  let selected: string | null = null;
  let keyboard = false;
  const paper = (id: string) =>
    paperInteractions({
      id,
      isActive: () => selected === id,
      select: (id) => {
        selected = id;
      },
      keyboardPaperFocused: () => keyboard,
    });
  return {
    first: paper("anor"),
    second: paper("cloud-castle"),
    selected: () => selected,
    keyboard: () => {
      keyboard = true;
    },
  };
}
function click(modified = false) {
  let prevented = false;
  return {
    event: {
      metaKey: modified,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      preventDefault() {
        prevented = true;
      },
    },
    prevented: () => prevented,
  };
}
const leave = (pointerType: string, focused = false) => ({
  pointerType,
  currentTarget: { matches: () => focused } as unknown as EventTarget &
    HTMLAnchorElement,
});

test("hover opens only that paper and click follows its preview", () => {
  const state = setup();
  state.first.onPointerEnter({ pointerType: "mouse" });
  assert.equal(state.selected(), "anor");
  const action = click();
  state.first.onClick(action.event);
  assert.equal(action.prevented(), false);
  state.first.onPointerLeave(leave("mouse"));
  state.second.onPointerEnter({ pointerType: "mouse" });
  assert.equal(state.selected(), "cloud-castle");
  state.first.onPointerLeave(leave("mouse"));
  assert.equal(
    state.selected(),
    "cloud-castle",
    "stale leave cannot close a different paper",
  );
});

test("touch focus does not open early: first tap unfolds, second follows link", () => {
  const state = setup();
  state.first.onPointerEnter({ pointerType: "touch" });
  state.first.onPointerDown();
  state.first.onFocus();
  assert.equal(state.selected(), null);
  const first = click();
  state.first.onClick(first.event);
  assert.equal(first.prevented(), true);
  assert.equal(state.selected(), "anor");
  state.first.onPointerLeave(leave("touch"));
  assert.equal(state.selected(), "anor");
  state.first.onPointerDown();
  const second = click();
  state.first.onClick(second.event);
  assert.equal(second.prevented(), false);
});

test("tapping another paper folds the old one and does not navigate", () => {
  const state = setup();
  state.first.onPointerDown();
  state.first.onClick(click().event);
  state.second.onPointerDown();
  state.first.onBlur();
  state.second.onFocus();
  const action = click();
  state.second.onClick(action.event);
  assert.equal(action.prevented(), true);
  assert.equal(state.selected(), "cloud-castle");
});

test("keyboard focus unfolds and incidental hover cannot override it", () => {
  const state = setup();
  state.keyboard();
  state.first.onFocus();
  state.second.onPointerEnter({ pointerType: "mouse" });
  assert.equal(state.selected(), "anor");
  const action = click();
  state.first.onClick(action.event);
  assert.equal(action.prevented(), false);
  state.first.onBlur();
  state.second.onFocus();
  assert.equal(state.selected(), "cloud-castle");
  state.first.onPointerMove({ pointerType: "mouse" });
  assert.equal(
    state.selected(),
    "anor",
    "intentional mouse movement can take over",
  );
});

test("modifier clicks preserve browser link behavior and cancelled touch does not open", () => {
  const state = setup();
  state.first.onPointerDown();
  state.first.onPointerCancel();
  assert.equal(state.selected(), null);
  const action = click(true);
  state.first.onClick(action.event);
  assert.equal(action.prevented(), false);
  assert.equal(state.selected(), null);
});

test("paper easing has exact endpoints and stays smooth and monotonic", () => {
  assert.equal(paperEase(0), 0);
  assert.equal(paperEase(1), 1);
  let previous = 0;
  for (let i = 1; i <= 100; i++) {
    const current = paperEase(i / 100);
    assert.ok(current >= previous && current <= 1);
    previous = current;
  }
});

test("local folding geometry contains complete original keyframes", () => {
  const data = inflateRawSync(
    readFileSync("apps/web/public/images/home/paper/crumple.bin"),
  );
  assert.equal(data.subarray(0, 4).toString(), "CRP1");
  const vertices = data.readUInt16LE(4);
  const faces = data.readUInt16LE(6);
  const keyframes = data.readUInt16LE(8);
  assert.ok(vertices > 100 && faces > vertices && keyframes > 10);
});
