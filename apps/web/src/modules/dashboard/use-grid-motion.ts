"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

type CardFrame = { node: HTMLElement; rect: DOMRect; opacity: string };

/** Animate layout changes while leaving the real cards and cached covers mounted. */
export function useGridMotion() {
  const gridRef = useRef<HTMLDivElement>(null);
  const previous = useRef<{ cards: CardFrame[]; grid: DOMRect } | null>(null);
  const animations = useRef(new Set<Animation>());
  const ghosts = useRef(new Set<HTMLElement>());

  function cancelMotion() {
    animations.current.forEach((animation) => animation.cancel());
    animations.current.clear();
    ghosts.current.forEach((ghost) => ghost.remove());
    ghosts.current.clear();
  }

  function updateGrid(update: () => void) {
    const grid = gridRef.current;
    if (
      grid &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      previous.current = {
        grid: grid.getBoundingClientRect(),
        cards: Array.from(grid.children)
          .filter(
            (node): node is HTMLElement =>
              node instanceof HTMLElement &&
              !node.hidden &&
              !ghosts.current.has(node),
          )
          .map((node) => ({
            node,
            rect: node.getBoundingClientRect(),
            opacity: getComputedStyle(node).opacity,
          })),
      };
      cancelMotion();
    } else {
      previous.current = null;
      cancelMotion();
    }
    update();
  }

  useLayoutEffect(() => {
    const before = previous.current;
    const grid = gridRef.current;
    if (!before || !grid) return;
    previous.current = null;
    const after = grid.getBoundingClientRect();
    const visible = Array.from(grid.children).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && !node.hidden,
    );
    const oldFrames = new Map(before.cards.map((frame) => [frame.node, frame]));
    const timing = { duration: 260, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
    function play(
      node: HTMLElement,
      frames: Keyframe[],
      options = timing,
      finish?: () => void,
    ) {
      const animation = node.animate(frames, options);
      animations.current.add(animation);
      void animation.finished.then(
        () => {
          animations.current.delete(animation);
          finish?.();
        },
        () => {},
      );
    }

    if (Math.abs(before.grid.height - after.height) > 1) {
      // Animate the list's space before paint, keeping the bottom note and page
      // height in step with the cards rather than snapping them into place.
      play(grid, [
        { height: `${before.grid.height}px` },
        { height: `${after.height}px` },
      ]);
    }
    visible.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const old = oldFrames.get(node);
      oldFrames.delete(node);
      if (rect.bottom < 0 || rect.top > window.innerHeight + 80) return;
      if (old) {
        const x = old.rect.left - before.grid.left - (rect.left - after.left);
        const y = old.rect.top - before.grid.top - (rect.top - after.top);
        if (Math.abs(x) + Math.abs(y) > 1 || Number(old.opacity) < 1) {
          play(node, [
            { transform: `translate(${x}px, ${y}px)`, opacity: old.opacity },
            { transform: "translate(0, 0)", opacity: 1 },
          ]);
        }
      } else {
        play(node, [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ]);
      }
    });

    oldFrames.forEach(({ node, rect, opacity }) => {
      if (rect.bottom < 0 || rect.top > window.innerHeight + 80) return;
      // Decorative exit copy only: never duplicate interactive cards or popovers.
      const ghost = document.createElement("div");
      ghost.className = node.className;
      const copy = node.cloneNode(true) as HTMLElement;
      copy.querySelectorAll("[popover]").forEach((menu) => menu.remove());
      copy
        .querySelectorAll("[id]")
        .forEach((element) => element.removeAttribute("id"));
      ghost.append(...Array.from(copy.childNodes));
      ghost.inert = true;
      ghost.setAttribute("aria-hidden", "true");
      ghost.dataset.gridExit = "";
      Object.assign(ghost.style, {
        position: "absolute",
        pointerEvents: "none",
        margin: "0",
        left: `${rect.left - before.grid.left}px`,
        top: `${rect.top - before.grid.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
      ghosts.current.add(ghost);
      grid.append(ghost);
      play(
        ghost,
        [
          { opacity, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-5px)" },
        ],
        { ...timing, duration: 130 },
        () => {
          ghost.remove();
          ghosts.current.delete(ghost);
        },
      );
    });
  });

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (reducedMotion.matches) cancelMotion();
    };
    reducedMotion.addEventListener("change", onChange);
    return () => {
      reducedMotion.removeEventListener("change", onChange);
      cancelMotion();
    };
  }, []);

  return { gridRef, updateGrid };
}
