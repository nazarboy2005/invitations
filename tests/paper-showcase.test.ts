import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import { paperInteractions } from "../apps/web/src/components/paper-interactions";
import { paperEase } from "../apps/web/src/components/paper-reveal-motion";

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
